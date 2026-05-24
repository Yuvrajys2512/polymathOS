# POLYMATH OS — Feature Checklist

Tick off features as they get built. Format: `[x]` = done, `[ ]` = pending.

---

## From improvements.md

### Core Capture
- [x] Quick Capture — raw thought dump with AI structuring (domain, type, priority, tags, insight)
- [x] Local heuristic classification fallback (no API key needed)
- [x] Claude API classification (with sk-ant key)

### Gamification — XP & Domains
- [x] Domain XP System — 8 domains (AI/ML, Writing, Business, Design, Physics, Health, Learning, Life)
- [x] XP per level (150 XP/level), XP bar per domain
- [x] Domain level badges
- [x] Polymath Score — breadth × depth composite
- [x] Character Sheet — INT, WIS, CRE, STR derived from domain levels

### Gamification — Tasks & Quests
- [x] Quest Board — add tasks with Common / Rare / Epic tiers and XP rewards
- [x] Daily Quests — 3 seeded quests per day (capture, session, task, insight, domain targets)
- [x] Habit Stack — daily habits with streak tracking and XP
- [x] Achievements — 12 unlockable badges with toast notifications
- [x] XP floats — visual +XP popups on actions

### Focus Sessions
- [x] Focus Timer (Pomodoro) with presets (15–60 min) and manual adjust
- [x] Focus session logging (domain, duration, captures, XP earned)
- [x] Energy Check-in — rate daily energy (Dead → Peak)
- [x] Focus Identity Modes — Builder, Deep Research, Creative Flow, Locked In, Night Grind, Exec Sprint (each with unique color theme + XP multiplier)

### Streaks & Momentum
- [x] Activity Heatmap — last 30 days capture grid
- [x] Momentum Score — 7-day weighted score (0–100%) replacing raw streaks
- [x] Momentum trend detection — ↑ Rising / → Stable / ↓ Falling
- [x] Comeback Bonus — bonus state when returning after 2+ inactive days
- [ ] Momentum Chains — full visual momentum chain UI with recovery bonuses
- [ ] Streak per domain (Duolingo-style, punish neglect per domain)

### Brain & Visualization
- [x] Brain Map — force-directed physics graph of domain connections (co-occurrence + tag overlap)
- [ ] Thought Galaxy — every captured thought as a glowing node in a 3D constellation
- [x] Domain Radar Chart — spider chart showing 7-day balance across 8 domains

### ADHD-Specific
- [x] Chaos Mode — "I'm overwhelmed" button → breathing exercise → auto-picks one task by energy level
- [x] Dopamine-Based Adaptive Task System — energy level → dynamic task suggestions (deep/creative/passive/recovery)
- [ ] Anti-Procrastination AI — detects avoidance patterns, abandoned tasks, repeated postponements
- [ ] Parallel Progress System — cycle multiple active domains without guilt

### Quest Generation
- [x] Quest Generator — AI generates quests/questlines from user-defined goals
- [x] Boss Battles — intimidating goals with HP bar, phases, milestones, rewards, and unlock animation

### Life Dashboard
- [ ] Life Dashboard — track sleep, workouts, learning hours, mood, social energy
- [ ] Correlations — "You focus 37% better after gym" type insights

### Memory & Archive
- [ ] Memory Vault / Archive — timeline of completed quests, old thoughts, personality shifts, proof of growth
- [ ] Second Brain Compression — AI weekly/monthly summary of lessons, patterns, recurring goals
- [ ] Weekly Character Development Report — AI-generated analytics card (viral-worthy)

### Domain Mastery
- [ ] Domain Evolution System — mastery tree, milestones, artifacts per domain
- [ ] Skill Trees — unlock progression (Python → Deep Learning → Agents → RAG)
- [ ] Hidden achievements, legendary quests, rare badges

### Difficulty & XP
- [ ] XP Based on Real Difficulty — cognitive load, duration, resistance level, novelty scoring

---

## From FEATURES.md

### Visual Showstoppers
- [ ] Thought Galaxy — live force-directed graph, every thought a glowing node, colored by domain, connected by tags (full constellation view)
- [ ] Ambient Focus Mode — UI dims when timer runs, full-screen breathing particle field takes over
- [x] Domain Radar Chart — spider/radar chart for 7-day domain balance

### Game-Changing Utility
- [ ] Command Palette (Cmd+K) — fuzzy-search palette for every action: capture, filter, timer, find thought
- [ ] Voice Capture — Web Speech API, speak → transcribe → auto-classify
- [x] AI Morning Brief — first open of day shows Claude-generated card with open tasks, cold threads, suggested focus
- [x] The Forge — select 2+ thoughts from different domains, Claude synthesizes a connection or emergent idea
- [x] Thought Aging — uncompleted tasks visually decay (opacity drop after 3 days, red glow after 7)
- [x] Serendipity Engine — every 30 min, a random old insight surfaces quietly in the corner

### Stats That Feel Alive
- [x] Focus Heatmap — 30-day activity grid (currently captures; could expand to 90 days focus sessions)
- [ ] Capture Velocity — sparkline of thoughts per day over 2 weeks
- [ ] Domain Time Clock — donut chart of where Pomodoro hours actually went this week

### Wild / Unique
- [ ] Time Capsule — seal a thought to be revealed in 30/60/90 days, notification when it re-surfaces
- [ ] Distill — select 5–10 thoughts from a domain, Claude compresses to one sharp insight paragraph
- [ ] Thought Streaks per domain — Duolingo-style, miss 3 days and it tells you

---

## Infrastructure / UX (already built)
- [x] Vite + React project structure (migrated from single HTML file)
- [x] localStorage persistence with version migration
- [x] Landing page with neural canvas animation and typing taglines
- [x] Sticky topbar with search, type filter, priority filter
- [x] Domain filter chips (thought stream)
- [x] Thought stream with slide-in animations
- [x] Thought edit in-place
- [x] Archive (done thoughts) toggle
- [x] Project tracker with progress sliders
- [x] Session log
- [x] Claude API key input (browser-only, never sent to backend)
- [x] Toast notifications for achievement unlocks
- [x] XP float animations on task/habit completion
- [x] Keyboard shortcut: `/` to focus capture, `Ctrl+Enter` to submit
- [x] Responsive layout (mobile-friendly breakpoints)

---

## Summary

| Status | Count |
|--------|-------|
| ✅ Built | ~39 |
| ⬜ Pending | ~16 |
| **Total** | **~55** |
