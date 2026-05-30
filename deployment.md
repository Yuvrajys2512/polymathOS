# POLYMATH OS — Deployment Document

> This is the honest pre-deployment checklist for shipping POLYMATH OS as a real product that real people sign up for and use every day. Not a demo. Not a portfolio piece. A real product.
>
> Items are labeled **[YOU]** (needs you to do it manually) or **[CODE]** (needs to be built).

---

## Current Honest State of the App

Before any checklist: here is what the app actually is right now.

**What works well:**
- Full game loop — capture → classify → XP → level → streak → achievements
- Focus timer with identity modes and loot drops
- Cosmos suite (Workbench, Lab, Expedition, Council, Oracle)
- All AI features gracefully degrade offline without an API key
- Mobile layout at ≤768px
- localStorage persistence — data survives refreshes

**What is not production-ready yet:**
- No user accounts — every person's data lives only on their own device/browser. If they clear localStorage, they lose everything. If they switch devices, they lose everything. This is the single biggest real-product gap.
- No auth — anyone who lands on your URL is inside the app immediately
- SEED object in useGameState.js has hardcoded sample projects ("Build POLYMATH OS", "Define research threads") that appear for every new user
- No error boundary — one React crash takes down the entire app with a blank white screen
- index.html has no description, no OG image, no favicon — looks broken when shared on Twitter/Discord
- No legal coverage — no privacy policy, no terms of service. You are collecting user emails via Supabase auth; GDPR requires a privacy policy to do that.
- No feedback channel — no way for users to tell you what's broken

---

## Phase 0 — Decisions You Must Make First

These are product decisions. Make them before any code is written.

### [YOU] Decide: Auth strategy
Supabase (recommended) gives you email/password + magic link + Google OAuth on their free tier. This is the only new runtime dependency the entire launch needs. Decision required: approve adding `@supabase/supabase-js`.

### [YOU] Decide: Domain name
The app needs a real domain. Options:
- `polymathOS.app`
- `polymathos.io`
- `polymathapp.io`

Buy from Namecheap or Cloudflare Registrar (~$12/year). Set up after you have a Vercel deployment.

### [YOU] Decide: What happens to AI without an API key
Right now: app works with local fallback classifiers (good). Groq features (Oracle, Cosmos, quest generation) show a "no key" message. This is the correct UX for beta. Confirm: BYO-key stays, no AI proxy for launch. Document this in the onboarding.

### [YOU] Decide: Feedback tool
Pick one before launch: Tally (free, clean), Typeform, or Google Form. You need a live URL to link from the app on day one. Takes 5 minutes to set up.

---

## Phase 1 — Things YOU Do (No Code Required)

### [YOU] Create a Supabase account
1. Go to supabase.com → create an account
2. Create a new project — name it `polymath-os-prod`
3. Choose a region close to your likely users (if you expect mostly India/South Asia: `ap-southeast-1` Singapore)
4. Save the database password somewhere secure (you will not need it often but you can't recover it)
5. From the project dashboard, go to **Settings → API** and copy:
   - `Project URL` (looks like `https://xxxx.supabase.co`)
   - `anon public` key (the long JWT string)
   You will give these to the code step as environment variables.

### [YOU] Create the database table
In the Supabase dashboard → **SQL Editor** → run this:

```sql
create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state   jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users can read own profile"
  on profiles for select
  using (auth.uid() = user_id);

create policy "Users can upsert own profile"
  on profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = user_id);
```

This is the entire database schema. One table. One row per user.

### [YOU] Enable auth providers in Supabase
Dashboard → **Authentication → Providers**:
- Confirm Email is enabled (it is by default)
- Optionally: enable Google OAuth (requires a Google Cloud project — skip for v1 if you want simpler)
- Set **Site URL** to your production domain (e.g. `https://polymathOS.app`) — without this, Supabase's magic links go nowhere

### [YOU] Create a Vercel account and link the repo
1. Go to vercel.com → create an account with GitHub
2. Import the `POLYMATH-OS` repository
3. Vercel will auto-detect Vite — framework: Vite, build command: `npm run build`, output: `dist`
4. Before first deploy, add environment variables in **Settings → Environment Variables**:
   ```
   VITE_SUPABASE_URL    = https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY = eyJ...
   ```
5. Connect your custom domain once purchased: **Settings → Domains → Add**

### [YOU] Write a Privacy Policy
Because you collect emails via Supabase auth, you legally need one. This is non-negotiable in most jurisdictions. Options:
- **Generator (fast):** Termly (termly.io/privacy-policy-generator) or iubenda — 10 minutes
- **Minimum content required:**
  - What you collect (email address, app usage data stored in your Supabase database)
  - What you don't collect (you don't sell data, you don't run ads)
  - How to delete an account (you must offer this — "email yuvrajstark2512@gmail.com")
  - Cookie/localStorage disclosure
- Host it at `/privacy` or just link to a public Notion page / Google Doc for v1

### [YOU] Write a Terms of Service
Shorter than the privacy policy. Covers:
- The app is provided as-is (no uptime guarantee for beta)
- User-generated content belongs to the user
- No warranty clause
- You can terminate accounts that abuse the service
- Same generator tools as above work for this

### [YOU] Set up a feedback form
Create a Tally (tally.so) or Google Form with:
- "What brought you here?"
- "What's the one thing that would make you open this every day?"
- "What's broken or confusing?"
- Email field (optional, for follow-up)

Keep the URL — you will hardcode it into the app in a code step.

### [YOU] Get a Groq API key (for your own testing)
You need to verify that the BYO-key onboarding works end-to-end. Go to console.groq.com → create a free account → generate an API key. Use this to test the full flow after deployment.

---

## Phase 2 — Code That Must Be Written

These are in priority order. The first three are launch blockers. The rest are quality gates.

### [CODE] Fix: Remove hardcoded sample data from SEED
**File:** `src/hooks/useGameState.js` — the `SEED` object
**Problem:** Every new user sees "Build POLYMATH OS" and "Define research threads" as their starting projects. This is jarring and makes the product feel broken.
**Fix:** `projects: []` in SEED. The onboarding experience handles first-run state, not the seed.

### [CODE] Add Supabase auth + data sync
**This is the core launch-blocker.** Replaces the localStorage-only persistence with user accounts.

Requires:
1. Install `@supabase/supabase-js` (needs approval)
2. Create `src/lib/supabase.js` — single Supabase client initialized from env vars
3. Build `src/views/AuthView.jsx` — login/signup/magic-link screen (shown when no session)
4. Rewrite persistence in `useGameState.js`:
   - On init: check Supabase session → if logged in, fetch `profiles` row → hydrate state from it
   - On state change: keep the existing localStorage write (offline cache) + add a debounced upsert (1.5s trailing) to Supabase
   - On first login if `profiles` row is empty but localStorage has data: prompt "Import existing progress?"
5. Add sign-out option (sidebar bottom or Profile view)
6. Loading state: "Syncing your universe..." while Supabase fetch resolves

**Database upsert pattern (inside useGameState):**
```js
supabase.from('profiles').upsert({
  user_id: session.user.id,
  state: currentState,
  updated_at: new Date().toISOString(),
});
```

### [CODE] Add error boundary
**File:** new `src/components/ErrorBoundary.jsx`, used in `src/main.jsx`
**Problem:** Any unhandled React render error shows a blank white screen with no way to recover.
**Fix:** Class component wrapping the entire app tree. On error: show a dark "Something crashed — your data is safe, reload to continue" screen with a reload button. Log the error to console.

### [CODE] Add OG / SEO metadata to index.html
**Problem:** When someone shares the URL on Discord or Twitter, it shows a blank card. This kills organic spread.
**Add to index.html:**
```html
<meta name="description" content="A personal OS for polymathic minds. Capture ideas, track domains, level up your actual life." />
<meta property="og:title" content="POLYMATH OS" />
<meta property="og:description" content="For ADHD minds with too many interests. Capture raw thought. Level up across 8 domains. Build momentum." />
<meta property="og:image" content="https://yourdomain.com/og-image.png" />
<meta property="og:url" content="https://yourdomain.com" />
<meta name="twitter:card" content="summary_large_image" />
```

### [YOU + CODE] Create an OG image
A 1200×630px PNG that looks like the app — dark background, POLYMATH OS wordmark, one sentence tagline, maybe a fake screenshot of the capture panel. Design this yourself (Figma, Canva) and drop it in `/public/og-image.png`.

### [CODE] Fix Vite config for SPA routing
**Problem:** If a user navigates directly to a deep URL (or Vercel needs to redirect all routes to index.html), it will 404.
**File:** `vite.config.js` — add `appType: 'spa'`
**Also:** Create a `vercel.json` at project root:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### [CODE] Add a favicon
**Problem:** Browser tab shows default Vite puzzle icon.
**Fix:** Create a simple icon — a dark square with "P" or the ◆ symbol in teal. Save as `public/favicon.ico` and `public/favicon.svg`. Add to index.html:
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

### [CODE] Link the feedback form in the app
In `src/components/Sidebar/Sidebar.jsx` (bottom section) or in `src/views/ProfileView.jsx`, add a link that opens the feedback form URL in a new tab. Plain anchor tag. No new component needed.

### [CODE] Add links to Privacy Policy and Terms in AuthView
Before a user creates an account, they should see: "By creating an account you agree to our [Terms] and [Privacy Policy]." The links open in a new tab. This is required for compliance.

### [CODE] Harden the AI error surfaces
**Problem:** Oracle.jsx and the Cosmos AI features (Lab, Expedition, Council) may show raw error messages or silently fail when the Groq API fails (rate limit, bad key, network error).
**Fix:** Each AI call site needs a user-visible error state. Not a console.log — a visible message inside the component: "Groq returned an error. Check your API key in Character → API Keys." The local fallbacks in classify.js and questGen.js are already correct; apply the same pattern to the Cosmos features.

### [CODE] Onboarding: explain the Groq key requirement
**Problem:** A new user creates an account, opens the app, tries Oracle or Quest Generation — nothing works, no explanation.
**Fix:** In the Character view (where the API key input lives), add a small callout when `groqKey` is empty:
```
AI features need a free Groq API key.
Get one in 60 seconds at console.groq.com
Paste it here. It never leaves your device.
```
Also surface this in the MorningBrief if no key is set on first day.

---

## Phase 3 — Production Quality Checks

These are not features. They are the difference between a real product and a demo.

### [YOU] Test the full user journey end-to-end
After code is deployed, run through this manually with a fresh incognito browser window:
1. Land on the app → see landing page
2. Click Enter → see auth screen
3. Sign up with a real email
4. Confirm email (check inbox)
5. Return to app — should be logged in, fresh empty state
6. Capture a thought → see it classified (without Groq key, local fallback)
7. Add Groq API key → capture another thought → see Groq classification
8. Complete a focus session → see XP awarded
9. Close the browser entirely
10. Reopen → should be logged in, data intact, same state
11. Open a different browser (or phone) → log in with same credentials → data should appear

If step 10 or 11 fails, the sync is broken. Do not launch.

### [YOU] Test mobile specifically
On your phone (not browser devtools):
1. Log in
2. Capture a thought
3. Open Focus view, start a session
4. Open Thoughts view
5. Scroll through Cosmos tabs

The bottom nav bar should be visible. Tap targets should work. Nothing should overflow.

### [YOU] Test with no internet
1. Log in → load the app fully
2. Turn off WiFi on your device
3. Capture a thought → it should work (localStorage)
4. Turn WiFi back on → the thought should sync (Supabase upsert fires when connection returns)

If the app breaks when offline: the sync debounce needs try/catch and a retry.

### [CODE] Run a production build and check bundle size
```
npm run build
```
Check `dist/` output. The JS bundle should be under 400KB gzipped. If it's larger, something is being included unexpectedly. The current stack (Vite + React, no libraries) should be comfortably under this.

### [YOU] Check the Supabase free tier limits
Supabase free tier: 500MB database, 50,000 monthly active users, 2GB file storage.
For beta, this is fine. Just know: at ~1,000 active users with moderate data, each user's state blob is roughly 20-50KB. At 1,000 users that's 20-50MB — well within limits.

Know the limit so you don't hit it unexpectedly.

---

## Phase 4 — Launch Sequence

Do these in order on launch day.

1. **[CODE]** Merge all code changes. Run `npm run build` — zero errors.
2. **[YOU]** Push to `main` branch on GitHub → Vercel auto-deploys.
3. **[YOU]** Open the Vercel deployment URL (not your custom domain yet) → run through the full user journey checklist from Phase 3.
4. **[YOU]** Point your custom domain to Vercel in Vercel's dashboard → wait for SSL cert (usually under 5 minutes).
5. **[YOU]** Update Supabase → Authentication → Site URL to your custom domain.
6. **[YOU]** Send a magic link to your own email — confirm it resolves to the correct domain.
7. **[YOU]** Test sign-up → confirm email → full journey one more time on the production domain.
8. **[YOU]** Share the URL with 2-3 people you trust. Not the public yet — trusted testers. Ask them to sign up and spend 15 minutes using it.
9. **[YOU]** After trusted testers confirm it works: share publicly.

---

## Phase 5 — Immediately After Launch

These aren't pre-launch but are necessary within the first 48 hours:

### [YOU] Watch the Supabase logs
Dashboard → **Logs → API** — watch for 400/500 errors from real users. Common first-day issues: auth email not delivering (check spam), RLS policy blocking writes.

### [YOU] Watch for crashes
Vercel → **Functions Logs** (there are no serverless functions in this app, so this is N/A) — but open your browser console on the production site and watch for React errors. Any `Cannot read properties of undefined` is a crash that real users are silently hitting.

### [YOU] Have a rollback plan
Vercel keeps every deployment. If something is catastrophically broken: Vercel dashboard → **Deployments** → find the previous working deploy → **Promote to Production**. This takes 30 seconds.

### [YOU] Message the first 10 users directly
If you can, reach out personally. Not a mass email — a direct message. "Hey, you signed up for POLYMATH OS — what did you think? What would make you open it again tomorrow?" This is your most valuable feedback loop and you only have it once.

---

## What This Product Is Not Ready For (Yet)

Be honest with yourself about these before you go wide:

- **Viral traffic.** Supabase free tier handles ~500 concurrent connections. If you hit the front page of Hacker News, you will hit limits. Cross that bridge if you get there.
- **Account recovery.** There is no "forgot password" flow if using email/password (magic link avoids this). Confirm your auth method before launch.
- **Data export.** Users can't export their data yet. This is both a UX gap and a GDPR right (right to portability). Not a launch blocker for beta, but plan it for v1.1.
- **Multiple devices in real time.** Last-write-wins sync is fine for one device at a time. Two devices open simultaneously will race. This is acceptable for beta; add real-time subscriptions post-launch if users report it.
- **AI at scale.** You're not paying for Groq — users bring their own keys. This scales perfectly because cost is zero. But it also means every user needs to go through the friction of getting a Groq key. Track how many users skip AI features vs. use them. That ratio tells you whether a future AI proxy is worth building.

---

## Definition of "Ready to Launch"

The app is ready to ship when all of these are true:

- [ ] Supabase account created, table created, RLS enabled
- [ ] Auth screen built and working (sign up → confirm email → in app)
- [ ] Data syncs to Supabase on change and loads on next login
- [ ] Data persists across browsers/devices for the same account
- [ ] SEED has no hardcoded sample data
- [ ] Error boundary in place
- [ ] OG image + meta tags in index.html
- [ ] Favicon set
- [ ] vercel.json SPA rewrite in place
- [ ] Privacy Policy written and linked
- [ ] Terms of Service written and linked
- [ ] Feedback form created and linked from the app
- [ ] Groq key onboarding is clear for new users
- [ ] Full user journey tested manually in incognito
- [ ] Mobile tested on a real device
- [ ] Production build passes: `npm run build` zero errors
- [ ] Custom domain pointing to Vercel
- [ ] Supabase Site URL updated to production domain

That's 16 items. When all 16 are checked: ship it.
