# CLAUDE.md — POLYMATH OS Reference

## Project Overview

POLYMATH OS is a gamified personal productivity and life-management SPA for people with ADHD who have multiple intellectual interests (polymaths). Users capture raw thoughts which are auto-classified by AI into domains and types, then earn XP and level up through captures, focus sessions, task completions, habits, and daily quests. The core loop: capture thought → classify → earn XP → advance streak/quests/achievements → level up character. The entire app runs client-side with no backend — state persists in localStorage, and the only external call is to the Anthropic Claude API (optional, user-supplied key).

---

## Tech Stack

| Tool | Version | Why |
|------|---------|-----|
| React | ^18.3.1 | UI framework |
| React-DOM | ^18.3.1 | DOM rendering |
| Vite | ^5.4.2 | Build tool, dev server (HMR) |
| @vitejs/plugin-react | ^4.3.1 | React Fast Refresh in Vite |

**No other runtime dependencies.** No React Router, no Zustand, no Tailwind, no charting lib, no date lib. Everything — routing, state, charts, timers — is hand-rolled. The only external runtime dependency is the Anthropic API (`https://api.anthropic.com/v1/messages`) called directly from the browser with the `anthropic-dangerous-direct-browser-access: true` header.

**Models used:**
- `claude-sonnet-4-6` — thought classification, questline generation
- `claude-haiku-4-5-20251001` — task expansion and todo suggestions (faster/cheaper)

---

## Project Structure

```
src/
├── main.jsx                      ★ Entry point — mounts App to #root
├── App.jsx                       ★ Root component — routing, global shortcuts, all overlay states
├── index.css                     ★ ALL styles (~4400 lines) — design tokens, every component class
│
├── constants/
│   └── index.js                  ★ Single source of truth for DOMAINS, DOMAIN_COLOR, XP_PER_LEVEL,
│                                   TIER_XP, IDENTITY_MODES, QUEST_POOL, ACHIEVEMENTS, CHAR_STATS,
│                                   ENERGY_LEVELS, TYPE_OPTS, PRIORITY_OPTS, FOCUS_PRESETS, STORAGE_KEY
│
├── hooks/
│   ├── useGameState.js           ★ God hook — all game state, every mutation method, localStorage sync
│   └── useTimer.js               Focus timer — countdown, mode switching, loot gating, chaos session
│
├── utils/
│   ├── game.js                   Pure functions: xpToLevel, polymathScore, streak, quests, achievements
│   ├── classify.js               localClassify (regex heuristics) + classifyWithClaude (API)
│   ├── momentum.js               calcMomentumScore, getMomentumTrend, getMomentumMeta
│   ├── questGen.js               localGenerateQuestline + generateQuestlineWithClaude
│   ├── todoAI.js                 expandTask (subtask AI) + suggestTodos (AI todo suggestions)
│   └── captureParticles.js       DOM particle burst animation on thought capture
│
├── views/                        Full-page routed screens (rendered by activeView state in App.jsx)
│   ├── HomeView.jsx              ★ Capture hero, intention, HUD strip, radial ring, recent thoughts
│   ├── FocusView.jsx             Thin wrapper around FocusTimer component
│   ├── ThoughtsView.jsx          Full thought stream with filters, triage shortcut, archived section
│   ├── TodoView.jsx              Daily todo list — progress ring, subtasks, AI breakdown, overdue
│   ├── QuestsView.jsx            2-col layout: quests+taskboard (left), bosses+questgen (right)
│   ├── CharacterView.jsx         2-col layout: character sheet+domains+achievements / habits+radar+apikey
│   └── ProfileView.jsx           Gaming stats hub — rank, level, polymath score, domain table
│
└── components/
    ├── TopBar.jsx                XP/level/score/momentum pills + brand + chaos button
    ├── HeroBar.jsx               4-stat grid (XP, level, streak, domains) — may be legacy
    │
    ├── Sidebar/
    │   └── Sidebar.jsx           Left rail nav (72px) — 6 main nav + 3 overlay items, badge on todo
    │
    ├── Capture/
    │   └── CapturePanel.jsx      Textarea + agentic routing terminal (live classification display)
    │
    ├── Timer/
    │   ├── FocusTimer.jsx        Full focus session UI — mode selector, domain, presets, controls, log
    │   ├── AntiTimer.jsx         ★ Canvas 3D point-cloud timer visualization (Fibonacci sphere + Bezier)
    │   └── LootDrop.jsx          Post-session modal — tier badge, random quote, XP bonus award
    │
    ├── Thoughts/
    │   └── ThoughtCard.jsx       Individual thought — type/domain/priority pills, edit, age decay, done
    │
    ├── Heatmap/
    │   ├── RadialRing.jsx        30-day SVG radial activity ring (today at top, domain-colored bars)
    │   └── StreakHeatmap.jsx     7-day grid heatmap (used in CharacterView or legacy)
    │
    ├── Domains/
    │   └── DomainsPanel.jsx      Domain tiles with XP bars, level badge, thought count
    │
    ├── Character/
    │   └── CharacterSheet.jsx    Total XP, level, INT/WIS/CRE/STR stats
    │
    ├── Achievements/
    │   └── AchievementsPanel.jsx Unlocked/locked achievement grid
    │
    ├── Quests/
    │   └── QuestsPanel.jsx       3 daily quests with progress bars
    │
    ├── Tasks/
    │   └── TaskBoardPanel.jsx    Tiered task list (common/rare/epic) with XP rewards
    │
    ├── Habits/
    │   └── HabitStack.jsx        Daily habit checkboxes + streaks + energy level selector
    │
    ├── QuestGenerator/
    │   └── QuestGenerator.jsx    AI-powered questline generator + display
    │
    ├── BossBattles/
    │   └── BossBattles.jsx       Multi-phase boss encounter — create, complete phases, defeat bonus
    │
    ├── RadarChart/
    │   └── DomainRadar.jsx       SVG polar chart of domain strengths
    │
    ├── BrainMap/
    │   └── BrainMap.jsx          Knowledge graph visualization (overlay)
    │
    ├── Forge/
    │   └── Forge.jsx             Manual thought creation form bypassing auto-classification (overlay)
    │
    ├── ChaosMode/
    │   └── ChaosMode.jsx         "Overwhelmed" mode — energy-aware task picker, quick start (overlay)
    │
    ├── MorningBrief/
    │   └── MorningBrief.jsx      Once-per-day modal — stats summary + intention setter
    │
    ├── Triage/
    │   └── TriageMode.jsx        One-at-a-time thought prioritization (triggered from ThoughtsView)
    │
    ├── Serendipity/
    │   └── SerendipityEngine.jsx Ambient old-thought surfacer (renders globally in App)
    │
    ├── AdaptiveEngine/
    │   └── AdaptiveEngine.jsx    (Partially built — adaptive UI logic)
    │
    ├── MomentumOrb/
    │   └── MomentumOrb.jsx       Canvas animated orb for home page — size/glow = momentum score
    │
    ├── Landing/
    │   └── LandingPage.jsx       First-visit welcome screen (overlays MainApp, fades on enter)
    │
    ├── Projects/
    │   └── ProjectsPanel.jsx     Project list with progress sliders (partially used)
    │
    ├── TodoPanel/
    │   └── TodoPanel.jsx         ★ LEGACY — old popup todo panel. Superseded by TodoView. Do not use.
    │
    └── shared/
        ├── ToastStack.jsx        Achievement/notification toasts (max 3, auto-dismiss 4.5s)
        └── XpFloats.jsx          Floating "+N XP" numbers at click position
```

---

## Architecture & Data Flow

### Routing
No React Router. A single `activeView` state in `App.jsx` (string: `'home' | 'focus' | 'thoughts' | 'todo' | 'quests' | 'character' | 'profile'`) drives which view renders. Overlays (BrainMap, Forge, ChaosMode, MorningBrief) are boolean states layered on top.

### State Management
**`useGameState`** is the single source of truth. It is a large custom hook (not context) that:
1. Loads initial state from localStorage on mount (`polymath-os-v2` key)
2. Exposes `state` object + ~35 mutation methods
3. Auto-saves to localStorage on every state change via `useEffect([state])`
4. Returns `toasts` and `floats` arrays for global UI side effects

`App.jsx` calls `useGameState()` once and passes `game` (the whole return object) down to views as a prop. No prop drilling beyond one level — views receive `game` and destructure what they need. There is no React Context, no Redux, no Zustand.

**State shape** (canonical structure in `SEED` inside `useGameState.js`):
```js
{
  thoughts:        Thought[],          // captured and classified thoughts
  projects:        Project[],          // named projects with progress %
  intention:       string,             // today's single intention
  intentionHistory: IntentionEntry[],  // last 30 intentions
  sessions:        Session[],          // completed focus sessions (capped at 50)
  apiKey:          string,             // Claude API key (stored in localStorage)
  pomodoro:        { focusMinutes, breakMinutes },
  domainList:      string[],           // active domains (defaults to DOMAINS constant)
  todos:           Todo[],             // daily todos with subtasks
  xp:              { [domain]: number }, // XP per domain, including custom domains
  streak:          { count: number, lastDate: string | null },
  achievements:    string[],           // array of unlocked achievement IDs
  quests:          { date: string, list: Quest[] }, // refreshed daily
  taskBoard:       Task[],             // tiered task board items
  habits:          Habit[],            // daily habit definitions with dates[]
  energyLog:       EnergyEntry[],      // last 90 days of energy level logs
  questlines:      Questline[],        // multi-phase AI-generated questlines
  bosses:          Boss[],             // boss battles with phases
  identityModes:   IdentityMode[],     // focus mode definitions (built-in + custom)
}
```

### Object Shapes
```js
// Thought
{ id, text, domain, type, insight, priority, tags[], status, done, createdAt, completedAt?, forged? }
// status: 'pending' (while classifying) | 'ready' (classified by Claude) | 'local' (offline fallback)

// Session
{ id, mode, domain, minutes, captured, at, identityMode, xpEarned }

// Task (taskBoard)
{ id, title, tier, domain, done, createdAt, completedAt? }
// tier: 'common' | 'rare' | 'epic'

// Todo
{ id, text, priority, estimate, done, doneAt, createdAt, date, subtasks[] }
// priority: 1 (high) | 2 | 3 | 4 (low)
// subtasks: [{ id, text, done }]

// Habit
{ id, name, dates[], xp }
// dates: YYYY-MM-DD strings of days completed

// Boss
{ id, name, domain, phases[], defeated, createdAt, defeatedAt? }
// phases: [{ id, title, xpReward, done }]

// Questline
{ id, goal, domain, quests[], completed, createdAt, completedAt? }
// quests: [{ id, title, xpReward, done }]
```

### XP & Leveling
- `XP_PER_LEVEL = 150` — flat per level
- `level = floor(totalXP / 150) + 1`
- `xpInLevel = totalXP % 150`
- `totalXP = sum(state.xp[domain] for all domains)`
- XP is stored **per domain** — `state.xp` is a domain → number map
- Level shown in TopBar is computed from total XP across all domains

### XP Award Amounts
| Action | XP | Domain |
|--------|----|--------|
| Thought captured | 10 | classified domain |
| Thought forged | 40 | specified domain |
| Focus session completed | `15 × identityMode.xpMult` | active domain |
| Task (thought) completed | 25 | thought domain |
| Task (board) common | 25 | task domain |
| Task (board) rare | 75 | task domain |
| Task (board) epic | 150 | task domain |
| Todo P1 completed | 30 | Life |
| Todo P2 completed | 20 | Life |
| Todo P3 completed | 15 | Life |
| Todo P4 completed | 10 | Life |
| Habit completed | habit.xp (default 15) | Life |
| Intention set | 5 | Life |
| Quest completed | quest.xpReward | Life (bonus) |
| Boss phase completed | phase.xpReward | boss domain |
| Boss defeated | +200 bonus | boss domain |

### Critical Internal Function: `applyGame`
All XP-awarding mutations in `useGameState` funnel through `applyGame(prevState, domain, questType, xpAmount)`. It:
1. Refreshes quests if date changed
2. Updates streak
3. Advances quests of the given type
4. Calculates quest completion bonus XP
5. Applies domain XP + quest bonus XP
6. Checks for new achievement unlocks
7. Queues achievement toasts via `pendingAchs` ref
8. Returns the new full state

**Never bypass `applyGame` when awarding XP.** Direct `xp` mutations skip quest advancement, streak update, and achievement checks.

### Thought Classification Flow
1. User submits → `submitThought(text, apiKey)` called
2. Thought immediately added to state with `domain: 'Sorting'`, `status: 'pending'`
3. Async: `classifyWithClaude(text, apiKey)` called
   - If no apiKey → `localClassify(text)` (regex heuristics)
   - If API call fails → catches and falls back to `localClassify`
4. Thought updated in place by ID with classified data, `status: 'ready'`
5. Domain/insight/quest advances applied in same setState call

### Timer Flow
`useTimer` in `App.jsx` receives `handleSessionFinish` callback. On natural timer expiry (no pause, no force-finish), it calls `onFinish(mode, focusMinutes, identityMode)` which calls `game.finishSession`. Loot drop displays only on clean finish.

### Global Side Effects
- **`<ToastStack>`** — rendered in App.jsx, receives `game.toasts`
- **`<XpFloats>`** — rendered in App.jsx, receives `game.floats`
- **`<SerendipityEngine>`** — rendered in App.jsx, ambient thought surfacer
- **`captureParticles`** — fires imperatively from CapturePanel on submit, animates DOM particles to XP pill

---

## Key Conventions

### File Organization
- **Views** = full routed pages in `src/views/` — receive `game` and produce a complete screen
- **Components** = reusable UI in `src/components/` — grouped by domain (Timer/, Thoughts/, etc.)
- **Hooks** = stateful logic in `src/hooks/` — only 2, both in App.jsx level
- **Utils** = pure/async functions in `src/utils/` — no React, no side effects (except captureParticles)
- **Constants** = everything shared and static in `src/constants/index.js` — one file, one import

### Styling
- **All CSS is in `src/index.css`** — no CSS modules, no styled-components, no Tailwind
- CSS custom properties (variables) defined in `:root` — always use these, never hardcode colors
- Component styles follow the pattern `.component-name { }` with BEM-ish child names: `.component-name-part`
- Glassmorphism pattern: `background: rgba(255,255,255,0.03); backdrop-filter: blur(20px); border: 1px solid var(--border)`
- Animations defined as `@keyframes` at bottom of their section
- Mobile breakpoint: `@media (max-width: 768px)` — mobile styles at bottom of file
- Extra-small: `@media (max-width: 390px)` — after the 768px block

### Component Patterns
- Functional components only, no class components
- Props are destructured in the function signature
- Internal sub-components (e.g., `PriorityDot`, `TodoItem` in TodoView) are defined at the top of the same file if only used there
- `useMemo` used heavily for derived state (filtered lists, calculated scores)
- `useCallback` used for event handlers passed as props (to prevent child re-renders)
- No prop-types, no TypeScript

### Naming
- Components: `PascalCase`
- Hooks: `useGameState`, `useTimer` — camelCase with `use` prefix
- Utilities: plain camelCase functions
- CSS classes: `kebab-case`
- State variables: camelCase
- Constants: `SCREAMING_SNAKE_CASE`
- IDs generated with: `crypto.randomUUID()`
- Dates: always `YYYY-MM-DD` string format from `todayStr()` utility

### ID Generation
Always `crypto.randomUUID()`. Never Math.random(), never Date.now() as ID.

### Date Handling
- Current date string: `todayStr()` from `src/utils/game.js`
- ISO timestamps: `new Date().toISOString()`
- Date comparisons: string prefix matching (`t.createdAt?.startsWith(today)`)
- Avoid the `Date` constructor with arbitrary strings — use ISO format + `.split('T')[0]`

---

## Current State

### Fully Built and Working
- **Home page** — capture hero, combo counter, adaptive prompts, today HUD (captures/sessions/tasks/XP), streak, domain pips, 30-day radial ring, recent thoughts stream, momentum orb, intention input
- **Focus page** — identity mode selection (6 built-in + custom), AntiTimer 3D visualization, domain picker, presets, play/pause/reset/force-finish, focus log, loot drop modal, mode environments (CSS backgrounds per mode)
- **Thoughts page** — full stream with search, domain/type/priority filters, snap-in animations, blast-out on filter change, triage mode (⚡ shortcut when 3+ thoughts), archived section, ThoughtCard with edit/done/delete
- **Todo page** — daily todos, SVG progress ring, subtask expansion, AI breakdown (Haiku), AI suggestions from thoughts+intention, priority picker, overdue detection
- **Quests page** — daily quests (3/day, date-seeded), task board (tiered), boss battles (multi-phase, 200 XP defeat bonus), AI questline generator
- **Character page** — character sheet (INT/WIS/CRE/STR), domain tiles with XP bars, achievements grid, habit stack with streaks, energy level selector, domain radar chart, API key input
- **Profile page** — rank title + level badge (8-tier rank system), full stats hero card, domain XP breakdown table, achievement display
- **Core systems** — XP/leveling, streak, daily quests, achievements (12), daily brief modal, chaos mode overlay, brain map overlay, forge overlay, serendipity engine, toast notifications, XP float animations, capture particles
- **Cosmos page** (`src/views/CosmosView.jsx`) — sub-tab hub. Tabs: Oracle (Groq Q&A about your mind), Timeline, DNA helix, **Workbench** (infinite spatial canvas — draggable note/thought nodes + hand-drawn edges, persisted in `state.workbench`), **Lab** (n=1 experiment tracker — `state.experiments`, animated canvas graph, Groq/local conclusion), **Expedition** (Groq-charted learning routes — `state.expeditions`, fog-of-war trail, milestone XP), **Council** (decision war room — `state.councilSessions`, AI advisor reveal + verdict), Memento Mori. Shared AI helper: `src/utils/cosmosAI.js` (`groqChat`, `parseJSON`).
- **Mobile layout** — full responsive at ≤768px: bottom nav bar, safe area insets, touch targets, full-screen overlays

### Partially Built / Placeholder
- **`AdaptiveEngine.jsx`** — file exists, likely stubbed
- **`ProjectsPanel.jsx`** — file exists, projects are in state but project management UI is minimal (only `addProject` and `updateProjectProgress` in game state)
- **`HeroBar.jsx`** — exists but may be superseded by TopBar stat pills

### Intentionally Legacy (Do Not Use)
- **`TodoPanel.jsx`** — old popup todo component, fully replaced by `TodoView.jsx`. Still exists as file but not imported in App.jsx.

---

## Important Constraints

1. **No npm install without explicit user approval.** The only dependencies are React + Vite. Adding libraries changes the bundle, the mental model, and the maintenance burden. Solve problems with vanilla React first.

2. **All state mutations go through `useGameState`.** Do not useState locally for anything that needs to persist. Do not call `localStorage` directly anywhere except inside `useGameState`.

3. **All XP awards must go through `applyGame`.** Direct `xp` state mutations skip streak, quest advancement, and achievement checks. Any mutation that awards XP must call `applyGame` internally.

4. **All styles go in `src/index.css`.** No inline styles except for dynamic values (e.g., `style={{ '--dc': DOMAIN_COLOR[d] }}`). No CSS modules. No component-scoped style files.

5. **STORAGE_KEY = `'polymath-os-v2'`** — never change this. Changing it silently wipes all user data (localStorage key mismatch). Any state schema migration must be additive with the `{ ...SEED, ...s }` merge pattern.

6. **`DOMAINS` constant drives the entire domain system** — domain colors, XP tracking, quest filtering, character stats, achievements. If adding domain-related features, always import from `src/constants/index.js`. Never hardcode domain names in components.

7. **`classifyWithClaude` must always have a `localClassify` fallback.** Users without API keys are first-class citizens. Every AI feature must degrade gracefully.

8. **The `'Sorting'` pseudo-domain** is a transient state during classification. A thought with `domain: 'Sorting'` means it hasn't been classified yet. Never treat it as a real domain — it's not in the `DOMAINS` constant.

9. **`TodoPanel.jsx` is dead code.** Do not revive or import it. The todo system lives in `TodoView.jsx`.

10. **`useTimer` controls all session gating.** When `timer.running === true` and `activeView === 'focus'`, navigation is blocked in `Sidebar`. Respect this — don't add ways to navigate away mid-session.

11. **`crypto.randomUUID()` for all IDs.** Never use Math.random() or timestamps as IDs.

12. **Date strings must be `YYYY-MM-DD` format** throughout. Use `todayStr()` from `utils/game.js`. The entire streak, quest refresh, todo date, and achievement system depends on consistent date string format.

---

## Feature Addition Protocol

When asked to add a feature:

1. **Check this file first** — identify which section of state is affected, which existing methods to reuse or extend.

2. **Locate the exact files to touch:**
   - New state shape? → `useGameState.js` (add to SEED, add methods, wire through `applyGame` if XP involved)
   - New view/page? → `src/views/NewView.jsx`, wire in `App.jsx` routing block, add to `Sidebar.jsx` NAV array
   - New overlay? → component file + boolean state in `App.jsx` + overlay button in Sidebar OVERLAYS array
   - Existing view enhancement? → the view file + CSS in `index.css`
   - New utility function? → appropriate `src/utils/` file (or `game.js` for pure game logic)
   - New constant? → `src/constants/index.js`

3. **Minimal changes:** Touch only the files required. Don't refactor surrounding code. Don't add abstractions not needed by the feature.

4. **CSS pattern:** Add all new CSS to `src/index.css`. Group it with a `/* ── FEATURE NAME ── */` comment header. Add mobile overrides in the `@media (max-width: 768px)` block at the bottom.

5. **Verify build:** Always run `npx vite build` after changes. Build must pass with zero errors.

6. **Update "Current State" section** of this file after completing the feature — mark it as fully built or partially built accurately.

7. **XP-awarding actions** — if the feature grants XP, it must call `applyGame` inside `setState` with the correct `(prevState, domain, questType, xpAmount)` signature. Check if an existing `questType` covers it (`capture | session | tasks | domains | intention | insight | habit`) or add a new quest type to `QUEST_POOL` and `advanceQuests`.

8. **New persistent data** — add the field to `SEED` in `useGameState.js` with a default value. Add it to the `loadState` fallback spread: `fieldName: s.fieldName || defaultValue`. This ensures old saves don't break.
