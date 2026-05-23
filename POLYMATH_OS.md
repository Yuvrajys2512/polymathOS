# POLYMATH OS
### A personal operating system for the polymathic, ADHD mind

---

## The Problem

Most productivity tools are built for specialists — people who live in one domain, follow linear workflows, and think in neat to-do lists. They fail people who think sideways.

The polymathic mind with ADHD doesn't have one project. It has twelve. It doesn't have a task list. It has a hurricane of ideas, half-formed questions, domain-crossing insights, and random threads that could be brilliant or could be noise. The standard tools — Notion, Todoist, Obsidian — demand structure *before* you have any. They punish you for thinking the way you actually think.

**POLYMATH OS** is built the other way around. Capture first, structure emerges. The system works with how ADHD-brained polymaths actually operate: in bursts, across domains, non-linearly, urgently.

---

## The Vision

A personal command center that:

- **Accepts raw thought** without demanding you already know what it is
- **Uses AI to impose structure** after the fact — domain, type, priority, tags — so you never stare at a blank category field
- **Surfaces the right things at the right time** — what to focus on, what's been neglected, what's due
- **Tracks growth across domains** so the breadth of your mind becomes a visible, measurable asset instead of something that feels like chaos
- **Stays out of the way** — fast to open, faster to capture, never a burden

The north star: open it in under 2 seconds, dump a thought in under 5, close it and get back to work. Everything else is secondary.

---

## Scope

### In Scope

- Instant thought capture with AI auto-classification (domain, type, insight, tags, priority)
- Focus session management (Pomodoro-style timer with session logging)
- Multi-domain knowledge tracking with activity heatmaps
- Project/goal tracker with manual progress and AI-generated subtask suggestions
- Daily intention setting with end-of-day reflection prompt
- Thought stream with filtering, search, and linking
- Weekly domain balance report — which areas got attention, which went dark
- Rabbit-hole detection — alerts when you've over-indexed one domain in a session
- Capture from anywhere — keyboard shortcut, quick-capture modal

### Out of Scope (for now)

- Team or collaborative features
- Native mobile app (web-first, mobile-responsive later)
- Full note-taking / wiki replacement (this is a capture + focus tool, not Notion)
- Calendar or scheduling integration (possible in a later phase)

---

## Architecture Decision

Built as a **single-file React application** running in the browser with:

- **Claude API (claude-sonnet-4-6)** for all AI classification, suggestions, and summaries
- **localStorage** for persistence (no backend, no auth — personal tool first)
- **No framework overhead** — React only, no Redux, no router
- Deployed as a static file (can be hosted on GitHub Pages, Vercel, or run locally)

This keeps it lightweight, auditable, and something you actually built — not a CRUD app scaffolded by a tool.

---

## Phases

---

### Phase 1 — Core Capture Engine
**Goal:** A working brain dump loop. Thought in, AI structure out, stream rendered.

**What gets built:**
- Capture textarea with ⌘↵ shortcut
- Claude API call: classifies domain, type (idea/task/question/note/insight), insight summary (≤8 words), priority, and 1–2 tags
- Thought stream renders with live AI tagging (pending state → resolved)
- Domain filter on the stream
- Pomodoro timer (focus / break modes, visual arc progress)
- Today's intention setter
- Domain grid (counts update as thoughts are captured)
- Project tracker with progress sliders

**Verifiable output:** You can open the app, dump 10 thoughts across different domains, and every thought comes back with a domain, a type label, a compressed insight, and tags — correctly, without you categorizing anything manually. Timer runs. Projects update.

**This is Phase 1. It's done.**

---

### Phase 2 — Persistence + Search
**Goal:** Nothing you capture disappears. You can find anything.

**What gets built:**
- localStorage persistence — thoughts, projects, intention history, domain counts all survive page refresh
- Full-text search bar across the stream (instant, client-side)
- Filter by type (Idea / Task / Ask / Insight / Note) in addition to domain
- Priority filter (High / Medium / Low)
- Delete and edit individual thoughts
- Mark tasks as done (strike-through + move to archived section)
- Session log — each Pomodoro session recorded with timestamp and active domain

**Verifiable output:** Refresh the page — everything is still there. Search for a keyword you captured three sessions ago — it appears instantly. Complete a task — it moves to done without disappearing.

---

### Phase 3 — Focus Intelligence
**Goal:** The app helps you decide *what to work on* and tells you when you're drifting.

**What gets built:**
- **Daily Focus Suggestion** — on open, Claude looks at your uncompleted tasks + intention and suggests the single highest-leverage thing to work on right now (one API call, shown as a card at the top)
- **Rabbit-hole Alarm** — if >60% of your captures in the last session are from one domain while others have open tasks, a subtle warning surfaces
- **Domain neglect indicator** — domains with no activity in 3+ days get a visual dim state on the grid
- **Session summary** — when a Pomodoro ends, a brief AI summary of what was captured in that block ("You captured 4 ideas in AI/ML and 1 task in Writing. The Writing task is still open.")
- **Capture velocity** — small stat showing how many thoughts captured today vs. 7-day average

**Verifiable output:** Start a session, deliberately over-capture in one domain while ignoring an open task in another — the rabbit-hole alert fires. End a Pomodoro — a one-sentence session summary appears. Open the app in the morning — a focused suggestion is waiting.

---

### Phase 4 — Domain Intelligence + Weekly Review
**Goal:** Your breadth becomes visible and navigable. You see your mind from the outside.

**What gets built:**
- **Domain detail view** — click a domain to see all thoughts, tasks, insights, and a Claude-generated "current state" summary of that domain based on your captures
- **Weekly review dashboard** — auto-generated every Sunday: which domains were active, what you completed, what stalled, what insight stood out
- **Domain heatmap** — 7-day activity grid per domain (GitHub-style), showing where attention went
- **Cross-domain linker** — Claude occasionally surfaces a connection between two thoughts from different domains ("Your note on emergence in Physics connects to your AI/ML question about self-attention")
- **Growth timeline** — scrollable history of all insights, filterable by domain, showing how thinking evolved

**Verifiable output:** After one week of use, open the weekly review — it accurately summarizes which domains you worked in, surfaces the best insight, and flags the stalled task. Click into a domain — a paragraph summary of your current thinking in that area is generated from your actual captures.

---

### Phase 5 — Polish + Portability
**Goal:** Something you'd actually show someone. Something that feels finished.

**What gets built:**
- Full keyboard navigation (every action reachable without mouse)
- Quick-capture modal triggered by a global shortcut (/ or custom)
- Export — download all thoughts as JSON or markdown
- Settings panel — customize domains, adjust Pomodoro durations, toggle features
- Mobile-responsive layout (two-panel collapse for small screens)
- Onboarding flow for first-time use (set domains, set first intention, capture first thought)
- Performance audit — ensure no jank on 500+ thoughts in the stream
- Visual polish pass — transitions, micro-interactions, empty states

**Verifiable output:** The app runs cleanly on mobile. You can export your entire thought history as markdown. A new user can open it and understand what to do within 30 seconds without being told.

---

## Current Status

| Phase | Status |
|---|---|
| Phase 1 — Core Capture Engine | ✅ Complete |
| Phase 2 — Persistence + Search | ✅ Complete |
| Phase 3 — Focus Intelligence | ⬜ Not started |
| Phase 4 — Domain Intelligence + Weekly Review | ⬜ Not started |
| Phase 5 — Polish + Portability | ⬜ Not started |

---

## Guiding Principles

**Capture speed is sacred.** Any friction added to the capture flow is a regression, regardless of what feature it enables.

**AI does the taxonomy, you do the thinking.** Never ask the user to categorize, tag, or sort manually. That's the AI's job.

**Nothing disappears.** Every thought captured is permanent until explicitly deleted. ADHD brains already lose too much.

**Breadth is a feature.** The multi-domain design is intentional. The goal is to make range feel like an asset, not a liability.

**Ship phases, not features.** Each phase produces something fully usable. No half-built phases sitting in the codebase.
