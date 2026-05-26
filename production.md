# POLYMATH OS — Production Document

> This is the source of truth for every decision made on this product.  
> No feature gets built without an entry here first.  
> No UI changes without an architecture reason.

---

## 1. Product Identity

**What it is:**  
A life operating system for people with ADHD and too many interests. Not a productivity app. Not a note-taking tool. An identity system — it helps you trust yourself again.

**What it is NOT:**  
- A task manager (that's incidental)
- A journal (that's incidental)
- Another "get organized" app that guilts you for being chaotic

**Core promise:**  
You can be obsessed with 12 things at once, switch between them constantly, and still grow. POLYMATH OS makes that visible, rewarding, and sustainable.

**Emotional tone:**  
Hype. Momentum. "Look how far you've come." Never: guilt, reminders, streaks that punish you.

---

## 2. Core User

**Who they are:**  
- ADHD brain (diagnosed or not)
- Multiple passions that feel like a liability but are actually a superpower
- High potential, scattered execution
- Needs dopamine to function
- Will not open an app that feels like homework
- Will obsessively use an app that feels like a game they're winning

**Their daily pain points:**  
1. Ideas disappear before they can act on them
2. Can't decide what to do right now
3. Feels like they're not making progress because it's nonlinear
4. Abandons things and feels guilty about it
5. Can't see the connections between their different interests

**What POLYMATH OS solves for each:**  
1. → Instant capture with zero friction (no categories required)
2. → "Here's your one thing right now" (Chaos Mode, Adaptive Engine, Morning Brief)
3. → XP, levels, Momentum Score — makes invisible progress visible
4. → Questlines and Boss Battles frame abandonment as "paused" not "failed"
5. → Brain Map and Forge show the connections they couldn't see

---

## 3. Design Principles

1. **One thing at a time.** Every screen has one primary action. Everything else is secondary.
2. **Zero friction to capture.** The capture input is always reachable in under 2 seconds.
3. **No guilt mechanics.** Streaks show momentum, not punishment. Missing a day doesn't destroy anything.
4. **Reward motion, not perfection.** XP for capturing a half-baked idea. XP for a 15-min session. Always be earning.
5. **Beautiful enough to open.** If it doesn't feel premium and futuristic, they'll stop opening it.
6. **Progressive disclosure.** Show the 2 core actions first. Everything else is one tap away, not on screen at once.
7. **ADHD-safe defaults.** Auto-save everything. Nothing requires finishing a flow. Can always exit and come back.

---

## 4. Information Architecture

### 4.1 What Belongs on Screen at First Load

**Always visible:**
- Capture input (THE primary action)
- Stats bar: XP · Momentum · Level (compact, top)
- Navigation to other views

**Visible once per day (auto-dismiss):**
- Morning Brief (sets context, intention, and today's focus)

**Accessible in 1 click:**
- Focus Timer
- Chaos Mode ("Overwhelmed" — always in nav)
- Thought stream
- Quests

**Accessible in 2 clicks (secondary features):**
- Brain Map
- Forge
- Character / Achievements
- Habits

### 4.2 Navigation Structure

**Sidebar (left rail, icon + label):**

| Icon | Label | What it contains |
|------|-------|-----------------|
| ⌂ | Home | Capture + Morning Brief + Today's stats |
| ⚡ | Focus | Timer + Identity Modes + Session Log |
| ◉ | Thoughts | Full thought stream + filters + domains |
| ⚔ | Quests | Daily Quests + Quest Generator + Boss Battles |
| ◈ | Forge | Synthesis engine (open as modal or view) |
| ◎ | Brain Map | Knowledge graph (open as overlay) |
| ◆ | Character | Domains + Character Sheet + Achievements + Habits |

**Always accessible (sidebar bottom or floating):**
- ⚡ Overwhelmed → Chaos Mode
- ✦ Quick Capture → modal (keyboard shortcut: /)

### 4.3 Layout Structure

```
┌─────────────────────────────────────────────────────┐
│  [Logo]  [XP pill] [Momentum pill] [Level pill]  [⚡ Chaos] │  ← Topbar (minimal)
├──────┬──────────────────────────────────────────────┤
│      │                                              │
│  ⌂   │         MAIN CONTENT AREA                   │
│  ⚡   │         (switches per nav item)              │
│  ◉   │                                              │
│  ⚔   │                                              │
│  ◈   │                                              │
│  ◎   │                                              │
│  ◆   │                                              │
│      │                                              │
└──────┴──────────────────────────────────────────────┘
```

---

## 5. Feature Registry

Every feature is catalogued here. Status: `KEEP` | `RETHINK` | `CONSOLIDATE` | `CUT`

---

### CAPTURE PANEL
**Status:** `KEEP — Primary Action`  
**What it does:** Freeform text input → AI or local classifier assigns domain, type, priority, tags, insight  
**Where it lives:** Home view, hero position  
**How it feels:** Zero friction. No required fields. Just type and hit enter.  
**UX notes:** Must be the largest element on the home screen. Keyboard shortcut (/) must always work regardless of current view. Character count and Ctrl+Enter hint are fine.  
**Decision:** Nothing changes in functionality. Position and visual weight change dramatically — this becomes the hero element.

---

### FOCUS TIMER + IDENTITY MODES
**Status:** `KEEP — Primary Action`  
**What it does:** Pomodoro timer with 6 identity modes (Builder, Research, Creative, Locked In, Night Grind, Exec Sprint), each with XP multipliers and color themes  
**Where it lives:** Focus view (sidebar nav item ⚡)  
**How it feels:** Should feel like entering a mode — a ritual. Switching to the Focus view is like "clocking in."  
**UX notes:** Timer should fill the Focus view. Mode cards are beautiful — keep. Session log at bottom is useful.  
**Decision:** Move out of the home screen entirely. Has its own dedicated view. Accessible in one click.

---

### MORNING BRIEF
**Status:** `KEEP — Daily Ritual`  
**What it does:** Shows once per day — personalized context (focus for today, ADHD nudge, open tasks, cold threads, intention setter)  
**Where it lives:** Home view, appears as an overlay/card on first open of the day. Dismissed once read.  
**How it feels:** Like a commander briefing before a mission. Sets the tone.  
**UX notes:** Don't let this block capture. Should appear as a card that can be set aside. Intention setter inside it is the key interaction.  
**Decision:** Stays. Refine so it appears as a slide-in card on the home view, not a blocking modal. Can be dismissed or minimized.

---

### CHAOS MODE
**Status:** `KEEP — Critical ADHD Feature`  
**What it does:** Breathing exercise → one task selected by energy level. Helps when overwhelmed.  
**Where it lives:** Floating button in topbar (always accessible, always visible)  
**How it feels:** A lifeline. Must never feel hidden.  
**UX notes:** The breathing animation is the right call. The one-task reveal is the right call. Button must be prominent.  
**Decision:** Keep. Make the "Overwhelmed" button more prominent — consider making it glow/pulse subtly when the app has been open for 30+ min with no sessions.

---

### BRAIN MAP
**Status:** `KEEP — Unique Differentiator`  
**What it does:** Force-directed graph of domain connections. Shows co-occurrence and tag overlap. Click to explore.  
**Where it lives:** Sidebar nav item ◎. Opens as a full-screen overlay.  
**How it feels:** Should feel like seeing your brain from the outside. Beautiful, interactive, surprising.  
**UX notes:** The physics simulation is great. Needs data to be impressive — empty state must be compelling.  
**Decision:** Keep as-is functionally. Improve empty state. Move from topbar button to sidebar nav.

---

### THE FORGE
**Status:** `KEEP — Unique Differentiator`  
**What it does:** Select 2-5 thoughts → AI finds the hidden connection → Save as insight  
**Where it lives:** Sidebar nav item ◈. Opens as a full-screen overlay.  
**How it feels:** Like a lab. Experimental, high-reward.  
**UX notes:** The left-right split layout works. Needs minimum 2 thoughts to be useful.  
**Decision:** Keep. Move from topbar button to sidebar nav.

---

### SERENDIPITY ENGINE
**Status:** `KEEP — Background Magic`  
**What it does:** Every 20 min, resurfaces a random old thought (7+ days ago) as a corner card for 12 seconds  
**Where it lives:** Background — no nav item needed, just appears  
**How it feels:** Magical. Like the app is thinking with you.  
**UX notes:** 12 second display is right. Auto-dismiss progress bar is good. Don't make it dismissable too easily.  
**Decision:** Keep exactly as-is. No changes.

---

### QUEST GENERATOR
**Status:** `KEEP — High Value`  
**What it does:** User types a goal → AI generates a 5-phase questline with XP rewards  
**Where it lives:** Quests view (sidebar ⚔)  
**How it feels:** Like the app becomes your quest master. High dopamine.  
**UX notes:** The questline display (progress bar, expandable, phase hints) works well. Domain inference is a nice touch.  
**Decision:** Keep. Move into dedicated Quests view alongside Daily Quests.

---

### BOSS BATTLES
**Status:** `KEEP — High Value Gamification`  
**What it does:** Name a major goal → set phases → HP bar counts down as phases complete → confetti on defeat  
**Where it lives:** Quests view (sidebar ⚔)  
**How it feels:** High stakes, satisfying. The HP bar is genius for ADHD.  
**Decision:** Keep. Move into Quests view.

---

### DAILY QUESTS
**Status:** `KEEP`  
**What it does:** 3 daily quests seeded by date (capture X thoughts, do Y sessions, etc.). Auto-progress on actions.  
**Where it lives:** Quests view (sidebar ⚔)  
**How it feels:** Daily structure. A reason to open the app.  
**Decision:** Keep. Lives in Quests view.

---

### THOUGHT STREAM + FILTERS
**Status:** `KEEP — Core Utility`  
**What it does:** All captured thoughts with domain/type/priority filters, search, archive  
**Where it lives:** Thoughts view (sidebar ◉)  
**How it feels:** The brain dump, organized.  
**UX notes:** The aging indicator (amber/red) is great. Keep. Domain filter pills at top work.  
**Decision:** Keep. Move to its own view. Not on the home screen by default.

---

### THOUGHT AGING
**Status:** `KEEP — Passive Awareness`  
**What it does:** Thoughts change color/glow as they age unresolved (3-6d = amber, 7d+ = red)  
**How it feels:** Gentle nudge without guilt. The thought itself shows age, not a notification.  
**Decision:** Keep exactly as-is.

---

### MOMENTUM SCORE
**Status:** `KEEP`  
**What it does:** Weighted 7-day activity score (0-100%) with trend (rising/stable/falling) and comeback bonus  
**Where it lives:** Topbar stats pill  
**Decision:** Keep. Displayed compactly in the stats bar at top.

---

### ADAPTIVE ENGINE
**Status:** `CONSOLIDATE → into Morning Brief or Quests`  
**What it does:** Reads energy level → recommends an archetype (Recovery/Creative/Admin/Deep Work) with matched tasks  
**Current problem:** Lives as its own panel in a column, feels like another block of content to read  
**Rethink:** The archetype + recommendations should appear in Morning Brief ("Based on your energy: Deep Work Mode") and optionally as a persistent chip in the home view  
**Decision:** Remove as a standalone panel. Fold the logic into Morning Brief's recommendations section and into Chaos Mode's task selection.

---

### HABIT STACK + ENERGY CHECK-IN
**Status:** `CONSOLIDATE → into Character view`  
**What it does:** Daily habit toggles with streak counters + 5-level energy check-in  
**Current problem:** Lives in a column competing for attention  
**Rethink:** Energy check-in is critical (it powers Adaptive Engine and Chaos Mode) but doesn't need to be always visible. Habits are important but secondary.  
**Decision:** Move to Character view (◆). Energy check-in gets a prominent spot there. Consider a compact "energy pill" in the topbar that you can click to update.

---

### DOMAINS PANEL
**Status:** `CONSOLIDATE → into Character view + Thoughts filters`  
**What it does:** 8 domain tiles with level, thought count, XP progress bars. Click to filter thoughts.  
**Current problem:** Takes up a full column section. Mostly admin overhead.  
**Rethink:** Domain XP and levels belong in the Character view. Domain filtering belongs as pills in the Thoughts view.  
**Decision:** Remove as a standalone panel. Domain data lives in Character view. Domain filter pills stay in Thoughts view.

---

### CHARACTER SHEET (INT/WIS/CRE/STR)
**Status:** `KEEP → in Character view`  
**What it does:** 4 RPG stats derived from domain pairs. Visual identity.  
**Where it lives:** Character view (◆)  
**Decision:** Keep. It's the RPG identity layer. Pair with Achievements and Domain levels.

---

### ACHIEVEMENTS
**Status:** `KEEP → in Character view`  
**What it does:** 12 unlock conditions with toast notifications  
**Where it lives:** Character view (◆)  
**Decision:** Keep. Move to Character view.

---

### PROJECTS PANEL
**Status:** `CUT`  
**What it does:** List of projects with progress sliders + session log  
**Current problem:** Overlaps with Boss Battles (major goals with phases) and Quest Generator (goal decomposition). Session log overlaps with Focus view's session log.  
**Decision:** Cut the Projects panel. Session log moves to Focus view. Goals are handled by Boss Battles and Quest Generator.

---

### RADAR CHART (DOMAIN RADAR)
**Status:** `CONSOLIDATE → into Character view`  
**What it does:** 8-axis radar chart showing 7-day activity balance across domains  
**Current problem:** Another visualization living in a column  
**Decision:** Move to Character view as a secondary visualization. Not on home screen.

---

### ACTIVITY HEATMAP
**Status:** `KEEP → on Home view, compact`  
**What it does:** 30-day GitHub-style heatmap of capture activity  
**How it feels:** Satisfying to see. A record of consistency.  
**Decision:** Keep on home screen but make it compact — a single thin strip, not a large block.

---

### TASK BOARD
**Status:** `RETHINK`  
**What it does:** Add tasks manually (with tier/domain), complete them for XP, see done tasks  
**Current problem:** Competes with Quest tasks and Boss Battle phases. Three separate places to "do things."  
**Rethink:** Tasks should be a unified list — whether added manually, generated from quests, or from boss phases. The tier system (common/rare/epic) is great and should stay.  
**Decision:** Keep the data model and tier system. Consolidate task display into the Quests view. Manual task addition stays.

---

### TOPBAR (CURRENT)
**Status:** `RETHINK`  
**Current contents:** Logo + tagline + search + type filter + priority filter + Quick Capture + Forge + Brain Map + Overwhelmed  
**Problems:** Too many elements. Search with 2 dropdowns is complex. 4 buttons with different purposes crowded together.  
**Decision:**  
- Logo + tagline: keep, left side  
- Stats pills (XP, Momentum, Level): add, center  
- Chaos Mode button: keep, right side (most prominent)  
- Search: move to Thoughts view only  
- Type/Priority filters: move to Thoughts view  
- Quick Capture: keep as floating shortcut (/ key), remove button  
- Forge button: move to sidebar  
- Brain Map button: move to sidebar  

---

## 6. New Layout — Home View

```
TOPBAR:
  [POLYMATH OS]  [Lv.4]  [2,340 XP]  [67% Momentum ↑]        [⚡ Overwhelmed]

SIDEBAR (left, narrow):
  ⌂  Home
  ⚡  Focus  
  ◉  Thoughts
  ⚔  Quests
  ◈  Forge
  ◎  Brain Map
  ◆  Character
  ─────────
  [avatar/initials]

HOME MAIN AREA:
  ┌─ Morning Brief card (shows once/day, dismissable) ──────────┐
  │  "Today: Deep Work on AI/ML  |  3 epic tasks open"          │
  │  "Your intention: ________________"   [Set & Start →]       │
  └─────────────────────────────────────────────────────────────┘

  ┌─ CAPTURE ──────────────────────────────────────────────────┐
  │                                                             │
  │   Dump the raw thought. No categories, no cleanup.         │
  │                                                             │
  │                                        [Capture →]         │
  └─────────────────────────────────────────────────────────────┘

  ┌─ Activity (30-day heatmap, compact strip) ──────────────────┐

  ┌─ Recent Thoughts (last 5, quick view) ─────────────────────┐
  │  [◈ idea · AI/ML · 2h ago]  "transformers for time series" │
  │  ...                              [View all thoughts →]     │
  └─────────────────────────────────────────────────────────────┘
```

---

## 7. Visual Direction

**Theme:** Dark futuristic. Not sci-fi costume — actual clarity with depth.

**Typography:**
- Numbers (XP, level, timer): Monospaced, large, high contrast
- Labels: Clean sans-serif, subdued
- Capture input: Slightly larger, welcoming

**Color usage:**
- Background: near-black `#0a0a0f`
- Panel surfaces: `rgba(255,255,255,0.03)` to `0.06`
- Accent: Teal `#00d9b1` (primary), domain colors for identity
- Danger/urgency: `#f87171`
- Success: `#4ade80`

**Effects:**
- Glassmorphism panels with subtle top-highlight border
- Glows only on interactive/active states (not decorative)
- Smooth transitions: 200-300ms easing
- Scanline texture overlay (very subtle, 2-4% opacity) on background

**What to avoid:**
- Color everywhere (reserve color for meaning)
- Animations that distract (animate on state change only)
- Heavy drop shadows competing with glows

---

## 8. Decision Log

| Date | Decision | Reason |
|------|----------|--------|
| 2026-05-24 | Switched from feature-dump to structured product approach | App was becoming visually overwhelming; lacked IA |
| 2026-05-24 | Cut Projects Panel | Redundant with Boss Battles + Quest Generator |
| 2026-05-24 | Moved Forge + Brain Map to sidebar nav | Topbar was too crowded |
| 2026-05-24 | Consolidated Adaptive Engine into Morning Brief + Chaos Mode | Standalone panel added noise without clear trigger |
| 2026-05-24 | Moved Domains Panel to Character view | Admin overhead, not a primary daily action |
| 2026-05-24 | Moved Habits to Character view | Secondary daily action; energy check-in stays accessible via topbar pill |
| 2026-05-24 | Made Capture the hero element on home | #1 user action must have #1 visual weight |
| 2026-05-24 | Added sidebar navigation | The core structural change that makes everything else possible |
| 2026-05-24 | Specced AI Feature Builder for v2 | Users want to extend the app for their own workflows without code |
| 2026-05-25 | Added best streak tracking to game state | `streak.best` now persists across resets; surfaced on Profile as a lifetime stat |
| 2026-05-25 | Added 7-day domain activity strip to Profile | Makes cross-domain activity visible at a glance without raw numbers |
| 2026-05-25 | Added rank progression bar to Profile hero | Gives players a clear "next goal" tied to their rank identity |
| 2026-05-25 | Color-coded stat boxes in Profile | Each stat has a semantic color (streak=orange, focus=blue, etc.) — reduces monotony, improves scannability |
| 2026-05-26 | Built 4 Cosmos sub-tabs (Workbench, Lab, Expedition, Council) | See `cosmos.md`. All client-side, AI optional with local fallbacks, state through `useGameState` |
| 2026-05-26 | Specced multi-user launch path (auth + JSONB persistence + deploy) | See Section 11. Goal: ship a beta so real users can sign up and leave reviews |

---

## 9. What We Build Next

Before any code: this document must be agreed on.

**Phase 1 — Structural Rebuild (no new features):**
1. Add sidebar navigation
2. Restructure home view (Capture hero + Morning Brief + heatmap strip + recent thoughts)
3. Create Focus view (timer + sessions)
4. Create Thoughts view (full stream + filters)
5. Create Quests view (daily + generator + boss battles)
6. Create Character view (domains + char sheet + achievements + habits)
7. Remove Projects Panel
8. Fold Adaptive Engine into Morning Brief
9. Clean topbar (logo + 3 stat pills + Overwhelmed only)

**Phase 2 — Visual Polish:**
1. Scanline background texture
2. Monospaced number typography
3. Refined glassmorphism (reduce competing glows)
4. Sidebar hover/active states
5. View transition animations

**Phase 3 — New Features (after UX is solid):**
- AI Feature Builder (see Section 10)
- To be extended as Phase 1 + 2 are reviewed

---

## 10. V2 — AI Feature Builder

### 10.1 What It Is

A tab inside POLYMATH OS where the user describes a feature or workflow they need, and the AI builds it — live, inside the app — without any code.

**What it is NOT:**
- A code editor or IDE
- A way to modify existing views/features
- Unrestricted code execution

**Core promise:**
"If you can describe it, POLYMATH OS can build it for you. Your app grows with your brain."

**ADHD fit:**
Power users with ADHD often need hyper-specific workflows that no app ships by default. A water tracker, a reading log, a mood-to-domain mapper, a custom daily ritual. Instead of switching apps, they extend this one.

---

### 10.2 Architecture Decision: JSON-Schema Driven (Not Raw Code)

**Chosen approach:** AI generates structured JSON config → app renders it via a WidgetRenderer.

**Why not raw code generation:**
- Security: arbitrary JS execution in the browser is dangerous
- Stability: generated code can break the rest of the app
- Debugging: broken JSON is recoverable; broken code is not
- Portability: JSON config is storable, shareable, versionable in localStorage

**The tradeoff accepted:**
Features are limited to what the schema supports. If a user wants something the schema can't express, we tell them clearly and expand the schema in future versions.

---

### 10.3 The Widget Schema

Every AI-generated feature is a `CustomWidget` object:

```json
{
  "id": "uuid",
  "name": "Water Tracker",
  "description": "Log glasses of water toward a daily goal",
  "createdAt": "ISO string",
  "type": "counter | checklist | log | rating | toggle-group | timer | note",
  "icon": "💧",
  "color": "#38bdf8",
  "domain": "Health",
  "xpEnabled": true,
  "xpPerAction": 5,
  "config": { /* type-specific, see below */ },
  "data": { /* runtime state, persisted to localStorage */ }
}
```

**Widget types and their configs:**

#### `counter`
Track a number toward a daily/weekly goal.
```json
{
  "type": "counter",
  "config": {
    "unit": "glasses",
    "goal": 8,
    "resetCadence": "daily",
    "incrementBy": 1
  }
}
```

#### `checklist`
A fixed list of items to check off. Resets on cadence.
```json
{
  "type": "checklist",
  "config": {
    "items": ["Morning pages", "Cold shower", "No phone first hour"],
    "resetCadence": "daily"
  }
}
```

#### `log`
Free-text log entries with optional tags. Like a mini journal.
```json
{
  "type": "log",
  "config": {
    "placeholder": "What did you read today?",
    "tags": ["fiction", "non-fiction", "articles"],
    "showCount": true
  }
}
```

#### `rating`
Rate something on a scale. Logged over time.
```json
{
  "type": "rating",
  "config": {
    "label": "Sleep quality",
    "scale": 5,
    "style": "stars | dots | numbers",
    "resetCadence": "daily"
  }
}
```

#### `toggle-group`
Multiple independent toggles (not a checklist — no "done" concept, just on/off state).
```json
{
  "type": "toggle-group",
  "config": {
    "toggles": [
      { "id": "t1", "label": "Deep work mode", "icon": "🧠" },
      { "id": "t2", "label": "Phone away",     "icon": "📵" }
    ]
  }
}
```

#### `timer`
A named countdown or stopwatch. Not a Pomodoro — a custom one.
```json
{
  "type": "timer",
  "config": {
    "label": "Reading session",
    "defaultMinutes": 20,
    "style": "countdown | stopwatch",
    "xpOnComplete": 30
  }
}
```

#### `note`
A persistent scratchpad. Editable, always saved.
```json
{
  "type": "note",
  "config": {
    "label": "Today's intention",
    "placeholder": "What am I optimizing for today?",
    "resetCadence": "daily | never"
  }
}
```

---

### 10.4 The Conversation Flow (UX)

**Location:** Sidebar nav item `✦ Builder` — a dedicated full-page view.

**Layout:**
```
┌──────────────────────────────────────────────────────────────┐
│  BUILD A FEATURE                                              │
│  Describe any tracker, habit, or workflow you want.          │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ I want to track how many pages I read each day...    │   │
│  │                                              [Build →]│   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ── Preview ─────────────────────────────────────────────── │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  📚  Daily Reading Tracker                           │   │
│  │      Pages today: [  0  ] / 30    [+1]  [+5]  [+10] │   │
│  │      ████░░░░░░  3 / 30 pages                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  "A counter widget that tracks pages read toward a 30-page  │
│   daily goal. Resets each day. Awards 2 XP per page logged."│
│                                                              │
│           [Tweak description]    [Add to my app →]          │
│                                                              │
│  ── Your Widgets ────────────────────────────────────────── │
│  [💧 Water Tracker]  [😴 Sleep Log]  [+ New]                │
└──────────────────────────────────────────────────────────────┘
```

**States:**
1. **Empty** — prompt to describe a feature, with 3-4 example prompts as chips
2. **Generating** — loading state, AI is processing
3. **Preview** — rendered widget + AI's explanation + Tweak / Add buttons
4. **Tweaking** — user can edit the description and regenerate
5. **Saved** — widget added to "Your Widgets" list and to the Widgets view

**Example prompt chips (shown in empty state):**
- "Track my water intake"
- "Daily reading log with page count"
- "Morning ritual checklist"
- "Rate my sleep quality each night"

---

### 10.5 The AI Prompt Contract

The system prompt sent to Claude when building a feature:

```
You are the POLYMATH OS Feature Builder. Your job is to generate a CustomWidget JSON config from a user's description.

Rules:
- You MUST output only valid JSON. No explanation, no markdown, no commentary.
- You MUST use only the supported widget types: counter, checklist, log, rating, toggle-group, timer, note
- If the request doesn't fit any type, pick the closest and simplify
- Keep config values practical — don't over-engineer
- Set xpEnabled: true and xpPerAction to a sensible value (5-30) unless the user says no XP
- Infer domain from the description (Health, Focus, Creative, Learning, etc.)
- Choose an appropriate emoji icon
- Choose a color that matches the domain (use CSS hex, avoid white/black)

Widget schema: [insert full schema]

User request: "[user's description]"
```

The response is parsed as JSON and validated against the schema before being shown to the user. If parsing fails or the type is invalid, we show a "couldn't build that one" message and ask for a simpler description.

---

### 10.6 Where Widgets Live

Once saved, widgets appear in a **Widgets view** (sidebar nav, icon `⊞`):

- Grid of user's custom widgets
- Each is a card: icon, name, the interactive widget itself
- Compact by default, expandable
- Edit (re-describe to regenerate) and Delete per widget
- Widget data persists in `game.state.customWidgets[]`
- XP from widget actions feeds into the existing XP system

**On the home view:**
- Option to "pin" a widget to the home view's bottom section
- Max 2 pinned widgets (space constraint)
- Pinned widgets appear below the heatmap strip

---

### 10.7 Security Model

**What the AI can do:**
- Define the shape and behavior of a widget via JSON
- Suggest XP values, cadence, labels, colors

**What the AI cannot do:**
- Execute arbitrary JavaScript
- Access thoughts, todos, sessions, or any other app state directly
- Modify existing views or components
- Make network requests

**Widget data isolation:**
Each widget has its own `data` key in localStorage. The WidgetRenderer reads only `widget.data` and calls only `updateWidgetData(id, patch)`. No widget code touches anything else.

**The user approval step is mandatory:**
Preview is always shown before saving. The user reads the AI's explanation in plain English. There is no "auto-install" path.

---

### 10.8 What This Unlocks (The Vision)

Once the schema is established, the feature builder becomes a platform:

- **Import/export:** Share widget configs as JSON files or short codes
- **Widget store:** Community-submitted configs (screened for schema compliance)
- **AI iteration:** "Make it track weekly not daily" → AI patches only the changed fields
- **Linked widgets:** A reading log and a reading counter that share data
- **Mobile companion:** The same JSON schema works on any renderer

This is POLYMATH OS becoming an operating system in the real sense — not just an app, but a platform that grows with the user's brain.

---

### 10.9 Build Checklist (When Phase 3 Starts)

- [ ] Define `CustomWidget` type in `constants/index.js`
- [ ] Add `customWidgets: []` to `useGameState` with add/update/delete/patch functions
- [ ] Build `WidgetRenderer.jsx` — renders any widget type from config
- [ ] Build `FeatureBuilderView.jsx` — chat input + preview + saved list
- [ ] Write and test the AI prompt contract (see 10.5)
- [ ] Add `'builder'` to sidebar nav
- [ ] Add `'widgets'` to sidebar nav
- [ ] Build `WidgetsView.jsx` — grid of saved widgets
- [ ] Add "pin to home" logic in `HomeView.jsx`
- [ ] Validate JSON schema on AI response before preview
- [ ] Write empty states for both views
- [ ] Test each widget type with real AI output

---

## 11 — Going Live: Accounts, Database & Deployment

> Goal: turn the local-only SPA into a real multi-user web app — people sign up, their data is saved server-side, and they can leave reviews after using it.

### 11.1 Why This Is Less Work Than It Looks

Two properties of the current architecture make this dramatically cheaper than a typical "add a backend" job:

1. **All state is one JSON blob.** `useGameState` keeps the entire app state under a single localStorage key (`polymath-os-v2`). We do **not** need to design normalized SQL tables — the whole state object goes into one `jsonb` column keyed by user. Schema design is essentially free.
2. **Persistence is isolated to one file.** Per CLAUDE.md constraint #2, *only* `useGameState` touches localStorage. So the "save to a real database" rewrite happens in **one place**, not across the ~30 components.

The app is also **fully usable without AI** — every AI feature already has a local fallback. That means we can ship a beta with *no AI backend at all* (see 11.4).

### 11.2 What We Must Add

| Piece | What it does | Rough effort |
|---|---|---|
| **Auth** | Email/password or magic-link login gating the app | ~half day |
| **Database** | One row per user storing the state blob (`user_id` + `state jsonb` + `updated_at`) | ~few hours |
| **Sync layer** | Load blob on login; debounced upsert on change (replaces the localStorage `useEffect`) | ~half day |
| **Auth gate + loading states** | Splash/login screen, "loading your universe" state, sign-out | ~half day |
| **Deploy** | Host the Vite build + set env vars | ~1 hour |
| **Feedback** | Collect reviews | ~trivial (external form first; see 11.7) |

### 11.3 Recommended Stack

**Supabase** — auth + Postgres + `jsonb` + row-level security in a single free tier, and it works from a Vite SPA with no server of our own to run.

- Requires adding `@supabase/supabase-js`. **This needs explicit approval** (CLAUDE.md constraint #1: no npm installs without sign-off). It is the only new runtime dependency this path requires.
- Table: `profiles ( user_id uuid pk, state jsonb, updated_at timestamptz )`, with RLS so a user can only read/write their own row.
- Alternatives considered: Firebase (Firestore) — fine, but Supabase's Postgres + JSONB maps more cleanly to "store the blob"; Clerk + a separate DB — more moving parts than needed for a beta.

### 11.4 The One Real Decision — AI: Proxy vs Bring-Your-Own-Key

Today AI calls go **straight from the browser** with a user-supplied Groq key (`state.groqKey`). For a public app there are two paths:

| Option | UX | Backend needed | Who pays for AI | Verdict |
|---|---|---|---|---|
| **Keep BYO-key / AI optional** | Worse (user pastes a key) but app works fully without it | **None** | The user | **Recommended for beta** |
| **Proxy through our own key** | Seamless | Yes — a serverless endpoint holding the key | **We do, for every user** | Defer to post-beta |

**Decision:** Launch the beta with **auth + DB sync only**, leaving AI as optional/BYO-key. It is the leanest path to "people can sign up and use it," and the app's local fallbacks mean nothing is broken without AI. Adding the proxy later is a clean, separate step (~half day) that refactors the 5 existing call sites (`classify.js`, `Oracle.jsx`, and the 3 Cosmos AI features via `cosmosAI.js`) to hit our endpoint instead of Groq directly.

> ⚠️ Do **not** ship our own Groq key in client code — it would be extractable from the browser bundle. The key must live server-side or stay BYO.

### 11.5 The Sync Rewrite (the core code change, all in `useGameState`)

- **On login:** fetch the user's `state` blob; if present, hydrate `useState` with it; if absent, seed from `SEED` (and offer to import any existing localStorage data — see 11.6).
- **On change:** replace the current `localStorage.setItem` effect with a **debounced upsert** (e.g. 1–2s trailing) to avoid a DB write on every keystroke. Keep a localStorage write too, as an offline cache / instant-resume.
- **Conflict handling (beta-simple):** last-write-wins keyed on `updated_at`. Multi-device real-time merge is explicitly out of scope for the beta.
- **Offline:** keep working against localStorage; flush to DB when back online.

### 11.6 Data Migration (localStorage → account)

Existing/anonymous users already have a `polymath-os-v2` blob. On first login, if the account has no saved state but localStorage does, prompt: *"Import your existing progress into this account?"* → one-time upsert. Prevents the beta from feeling like it wiped their data.

### 11.7 Collecting Reviews / Feedback

Start with the **lowest-effort thing that works**: an external form (Tally / Typeform / Google Form) linked from a small "Feedback" item in the sidebar or profile. Ship that on day one. Only build in-app feedback infra if volume justifies it — don't block launch on it.

### 11.8 Effort Estimate & Phasing

- **Beta-ready (lean path):** ~**1–2 focused days** — Supabase auth + JSONB sync + migration + deploy + a feedback link.
- **Post-beta polish:** AI proxy (~half day), real-time multi-device sync, password reset/email verification niceties, analytics.

**Budget extra care for the fiddly bits:** the debounce (don't hammer the DB), the auth-gate/loading state, last-write-wins edge cases, and the first-login migration prompt.

### 11.9 Build Checklist (Lean Beta Path)

- [ ] Get approval to add `@supabase/supabase-js`
- [ ] Create Supabase project; add `profiles` table + row-level security
- [ ] Add env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- [ ] Build auth gate: login/signup screen + sign-out + loading state
- [ ] Rewrite `useGameState` persistence: load-on-login + debounced upsert (keep localStorage cache)
- [ ] First-login migration prompt (import existing localStorage blob)
- [ ] Decide AI: confirm BYO-key for beta (no proxy)
- [ ] Add a "Feedback" link (external form) in sidebar/profile
- [ ] Deploy to Vercel/Netlify; verify build + env vars in prod
- [ ] Smoke test: sign up → use app → reload → data persists → sign out/in on another device
- [ ] (Post-beta) Add serverless AI proxy and migrate the 5 Groq call sites
