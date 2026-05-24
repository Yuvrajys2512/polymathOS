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
- TBD — to be proposed after Phase 1 + 2 are live and reviewed
