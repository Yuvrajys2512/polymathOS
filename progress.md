# POLYMATH OS — Build Progress

## Batch 1 ✅ COMPLETE

### 1. Project Restructure → Vite + React
**Status:** Done  
**What changed:**
- Migrated from single 1,519-line `index.html` (CDN React + Babel) to a proper Vite + React project
- 30 files across `src/components/`, `src/hooks/`, `src/utils/`, `src/constants/`
- Clean build: 53 modules, zero errors
- Dev server: `npm run dev` → `http://localhost:5173`

**File structure:**
```
src/
├── main.jsx
├── App.jsx
├── index.css              ← full design system
├── constants/index.js     ← all game constants + new IDENTITY_MODES
├── utils/game.js          ← XP, quests, streaks, chaos task picker
├── utils/classify.js      ← local + Claude API classification
├── hooks/useGameState.js  ← all game state + localStorage
├── hooks/useTimer.js      ← timer + identity mode state
└── components/
    ├── Landing/LandingPage.jsx
    ├── TopBar.jsx
    ├── HeroBar.jsx
    ├── Heatmap/StreakHeatmap.jsx
    ├── Capture/CapturePanel.jsx
    ├── Domains/DomainsPanel.jsx
    ├── Timer/FocusTimer.jsx         ← NEW: identity modes
    ├── ChaosMode/ChaosMode.jsx      ← NEW
    ├── Thoughts/ThoughtCard.jsx
    ├── Tasks/TaskBoardPanel.jsx
    ├── Quests/QuestsPanel.jsx
    ├── Habits/HabitStack.jsx        ← includes energy check-in
    ├── Character/CharacterSheet.jsx
    ├── Achievements/AchievementsPanel.jsx
    ├── Projects/ProjectsPanel.jsx
    └── shared/ToastStack.jsx, XpFloats.jsx
```

---

### 2. Chaos Mode 🆕
**Status:** Done  
**Location:** `src/components/ChaosMode/ChaosMode.jsx`

**How it works:**
- Triggered via **"⚡ Overwhelmed"** button in the top-right of the header
- **Phase 1 — Breathe:** Full-screen overlay with an animated breathing circle (4s inhale/exhale cycle), 4 breath cycles before auto-advancing
  - 3 expanding ring layers with CSS animation
  - "breathe in / hold / breathe out / hold" cycling text
  - Progress dots showing breath count
  - "I'm ready →" skip button
- **Phase 2 — One Thing:** Reveals ONE task chosen by energy level
  - Low energy (☠/😪): easiest task (common tier, low priority)
  - High energy (😊/⚡): hardest task (epic tier, high priority)
  - Medium energy: balanced tasks
  - Shows task title, domain, tier badge, XP reward
  - "Start Focus Session" auto-starts the timer and exits chaos mode
  - "Exit Chaos Mode" to return without starting

---

### 3. Focus Identity Modes 🆕
**Status:** Done  
**Location:** `src/components/Timer/FocusTimer.jsx`, `src/constants/index.js`

**6 modes:**
| Mode | Icon | Color | XP Mult | Vibe |
|------|------|-------|---------|------|
| Builder Mode | ⚒ | Teal `#00d9b1` | 1.2× | Building something real |
| Deep Research | ◉ | Blue `#60a5fa` | 1.3× | Down the rabbit hole |
| Creative Flow | ◈ | Purple `#c084fc` | 1.25× | Let the ideas come |
| Locked In | ◆ | Red `#f87171` | 1.5× | No distractions. Zero. |
| Night Grind | ★ | Violet `#8b5cf6` | 1.4× | While the world sleeps |
| Exec Sprint | ⚡ | Gold `#fbbf24` | 1.35× | Ship it. Now. |

**What changes per mode:**
- Timer ring color + glow
- Timer digits glow color (when running)
- Section border/background tint
- Mode banner with icon, name, vibe text, XP multiplier badge
- Preset buttons + adjust buttons tint to mode color
- Start button background matches mode color
- XP earned per session = `15 × multiplier` (stored in session log)
- Modes locked during active session (can only switch when stopped)

---

### 4. UI Overhaul
**Status:** Done  
**Location:** `src/index.css`

**Key improvements:**
- Better glassmorphism: triple-layer (gradient bg + top highlight line + border glow)
- Layered box shadows with depth
- Enhanced hover states: panels lift, domain tiles bleed color radially, thoughts slide right
- Breathing/pulse animations for hero stats, streak risk, active habits
- Timer outer glow ring pulses with mode color when running
- XP bar fill uses `cubic-bezier(0.34, 1.56, 0.64, 1)` — slight overshoot bounce
- Achievement badges have `translateY(-2px)` lift + shadow on hover
- Chaos mode overlay: multi-ring breathing circle, calming transitions
- Mode card grid: 3×2 layout, glow on active
- Topbar is `position: sticky` — stays visible while scrolling

---

---

## Batch 2 ✅ COMPLETE

### 1. Momentum Score (replaces Streak in HeroBar)
**Status:** Done  
**Files:** `src/utils/momentum.js`, `src/components/HeroBar.jsx`

**How it works:**
- 7-day weighted score (0–100%): today = 1.0 weight, 6 days ago = 0.46 weight
- Activity on each day = captures × 0.08 + task completions × 0.22 + focus sessions × 0.32 (capped at 1.0)
- **Trend detection:** compares last 3 days vs prior 3 days → ↑ Rising / → Stable / ↓ Falling
- **Comeback Bonus:** fires when you're active today after 2+ inactive days — glows, shows "COMEBACK" badge
- Color system: ≥60% = green, 30–59% = amber, <30% = red

**What replaced what:**
- Streak card → Momentum card in HeroBar
- Trend arrow displayed inline with the score (colored separately)
- Sub-label shows context: "Gaining momentum", "Comeback bonus active!", etc.

---

### 2. Brain Map
**Status:** Done  
**Files:** `src/components/BrainMap/BrainMap.jsx`, button in `TopBar`

**How it works:**
- Opened via **"◈ Brain Map"** button in the topbar (purple button)
- Full-screen canvas overlay with physics force-directed graph
- **Physics:** repulsion between all nodes + spring forces along edges + center gravity + damping
- **Nodes:** all 8 domains, size = 22px + (XP / 28)px — bigger = more XP
  - Level number shown inside node
  - Domain label below
  - Subtle ambient glow matching domain color
- **Edges:** built from 2 data sources:
  1. **Co-occurrence:** days when both domains had captures (more shared days = thicker edge)
  2. **Tag overlap:** shared tags between domains (counted and added to edge strength)
  - Gradient edges (from one domain color to the other)
- **Interactions:**
  - Hover → tooltip (domain, level, XP, captures, connections)
  - Click → isolates node, dims unconnected nodes, shows side panel with connection list
  - Click again → deselect
- **Selected node panel (right side):** shows XP, captures, link count + list of connected domains
- **Legend (bottom-left):** node size = XP level, edge thickness = connection strength
- **Empty state:** message shown when user has no data yet

**Visual details:**
- Radial glow backgrounds behind each node (subtle, domain-colored)
- Animated pulse ring on hovered/selected nodes
- Gradient edges fade/brighten with selection state
- Co-occurrence day count shown on edge hover

---

---

## Batch 3 ✅ COMPLETE

### 1. Quest Generator
**Status:** Done
**Files:** `src/utils/questGen.js`, `src/components/QuestGenerator/QuestGenerator.jsx`

**How it works:**
- Lives in the left column, below Daily Quests
- User types a goal (e.g. "Learn machine learning" or "Launch a SaaS")
- **With Claude API key:** Calls `claude-sonnet-4-6` to generate a custom 5-quest questline with phases, titles, descriptions, and XP rewards tailored to the goal
- **Without API key:** Falls back to `localGenerateQuestline()` — 6 universal phases (Foundation, Plan, First Step, Deep Work, Checkpoint, Level Up) with goal-aware text
- Domain is auto-inferred from goal text using keyword matching across all 8 domains
- Questlines are stored in `state.questlines[]` and persist via localStorage
- Each questline shows: goal title, domain dot + color, phase progress bar, "next quest" hint when collapsed
- Expand to see all quests as sequential steps — active quest is highlighted, done quests are dimmed
- Checking off a quest awards XP (via `applyGame`), triggers XP float animation, and completes the questline when all quests are done

**Questline data structure:**
```js
{ id, goal, domain, quests: [{ id, phase, title, desc, xpReward, done, index }], completed, createdAt }
```

---

### 2. Dopamine-Based Adaptive Engine
**Status:** Done
**Files:** `src/components/AdaptiveEngine/AdaptiveEngine.jsx`

**How it works:**
- Lives in the right column, below Habit Stack
- Reads today's energy level from `state.energyLog`
- **Energy → Archetype mapping:**
  | Energy | Level | Archetype | Color |
  |--------|-------|-----------|-------|
  | ☠ Dead / 😪 Low | 1–2 | Recovery Mode | Gray |
  | 😐 Okay | 3 | Creative Mode | Purple |
  | 😊 Good | 4 | Admin Mode | Gold |
  | ⚡ Peak | 5 | Deep Work Mode | Teal |
- **Per archetype:** unique icon, tagline, "Why:" explanation, filtered task suggestions from the taskBoard, and 4 generic action suggestions
- Task filtering: Recovery → common/easy tasks; Creative → Writing/Design/rare tasks; Admin → non-epic tasks; Deep Work → epic/high priority tasks
- Completing a task from the Adaptive Engine calls `onCompleteTask` with XP float
- **Empty state:** "Set your energy level" prompt with instructions to use the Energy Check-in in Habit Stack

---

---

## Batch 4 ✅ COMPLETE

### 1. Thought Aging
**Files:** `src/components/Thoughts/ThoughtCard.jsx`

Thoughts visually decay the longer they sit unresolved:
- **3–6 days:** amber border glow + "3d old" pill + slight opacity drop
- **7+ days:** red border + red glow shadow + pulsing "7d old" pill + heavier fade
- Done thoughts are excluded (aging only affects active thoughts)
- No new state — computed from `createdAt` on every render

---

### 2. Boss Battles
**Files:** `src/components/BossBattles/BossBattles.jsx`

A new gamification mechanic for intimidating goals:
- User names a boss (e.g. "Launch MVP"), picks a domain and phase count (3–5)
- Each boss has an **HP bar** (100% → 0% as phases are defeated)
- HP color shifts: red >60%, amber 30–60%, green <30% (nearly dead)
- Phases unlock sequentially — only the active phase is clickable
- **Defeat animation:** canvas confetti particle burst + "DEFEATED" banner with gradient text when the final phase is cleared
- Completing phases awards XP via `applyGame`, burst float animation (3 particles)
- +200 bonus XP on full defeat
- Lives in the left column, between Daily Quests and Quest Generator

---

### 3. The Forge
**Files:** `src/components/Forge/Forge.jsx`, `✦ Forge` button in TopBar

A full-screen overlay (gold theme) for cross-domain synthesis:
- Select 2–5 thoughts from a scrollable filtered list
- **With Claude API:** calls `claude-sonnet-4-6` to find the hidden connection, returns synthesis sentence + expanded insight + domain + tags
- **Without Claude API:** local fallback that names the domain intersection
- Result can be saved as a new "insight" thought (type: insight, priority: high, forged: true) — awards 40 XP
- Chip preview of selected thoughts in the right pane
- Triggered via **"✦ Forge"** button in the topbar (gold styling, between quick capture and Brain Map)

---

## Pending Review

> User should verify:
> 1. Chaos Mode breathe animation feels calming (not jarring)
> 2. Identity mode color transformations on the timer feel distinct
> 3. Existing data from old localStorage version loads correctly
> 4. The "⚡ Overwhelmed" button placement in the header makes sense
> 5. Overall UI feels like an upgrade (not just a migration)

---

## Suggested Batch 2 (awaiting approval)

_To be proposed after Batch 1 review._

Options include:
- **Momentum Score** — replace streaks with a forgiving weighted consistency score
- **Dopamine-Based Task Suggestions** — energy → recommended tasks (uses existing energy check-in data)
- **Brain Map** — visual graph of domain connections
- **Boss Battles** — intimidating goals with HP bar and phases
- **Quest Generator** — AI generates quests from user-defined goals
