# POLYMATH OS — Potential Features

> This document is the holding tank for features not yet in production.md.
> Nothing here is committed to. Everything here is worth thinking about.
> When a feature is ready to build, move it to production.md with a full spec.

---

## Table of Contents

1. [Polymath Features](#1-polymath-features)
2. [ADHD Features](#2-adhd-features)
3. [Gamification Features](#3-gamification-features)
4. [Build Priority](#4-build-priority)

---

## 1. Polymath Features

*For someone pursuing knowledge across many domains — connection, development, retention, direction, output.*

---

### 1.1 Open Questions Tracker

**The problem it solves:** Most people forget what they were curious about. Questions are different from thoughts — a question is a sustained intellectual commitment. Feynman kept a list of 12 open questions his whole life and ran everything he learned against them.

**What it does:**
- Dedicated question capture, separate from thoughts (different intent, different data model)
- Questions age and resurface — *"You asked this 3 weeks ago. Has anything you've captured since answered it?"*
- AI cross-links questions with the same underlying structure across domains: *"Your biology question about emergence and your economics question about market dynamics are structurally identical"*
- Questions get "closed" when you capture an insight that resolves them — visible, satisfying intellectual progress
- Weekly digest: your 3 oldest unanswered questions
- Questions can be tagged to domains and linked to thoughts

**Data model:**
```
Question {
  id, text, domain, createdAt,
  status: 'open' | 'answered' | 'released',
  answeredBy: thoughtId | null,
  relatedThoughts: thoughtId[],
  lastSurfaced: date
}
```

**Build complexity:** Low–Medium

---

### 1.2 Idea Incubator

**The problem it solves:** The gap between capturing an idea and developing it is where 99% of ideas die. You have a thought. It sits in your stream. You never return to it. Three months later it's buried.

**What it does:**
- Mark any captured thought as "Incubating"
- Every few days it resurfaces with rotating thinking prompts:
  - *"What's the strongest objection to this?"*
  - *"What would this look like applied to a different domain?"*
  - *"What do you need to know to test this?"*
  - *"Who's already working on something like this?"*
  - *"What's the simplest version of this idea?"*
- Each response you give becomes a thread on that idea — the idea grows over time
- After enough development iterations, it graduates to a "Developed Idea" with its own page
- Shows: time in incubation, number of iterations, which domains it spans
- Incubating ideas count is visible in the sidebar (like todo pending count)

**Build complexity:** Low–Medium

---

### 1.3 Reading Brain

**The problem it solves:** Polymaths read constantly but it's invisible. No visibility into how much you've ingested in Physics vs. Writing this month. And most reading evaporates because there's no extraction step.

**What it does:**
- Log anything: book, paper, article, video, course — tagged to a domain
- "Extract" flow: after finishing something, 3–5 quick insight captures pre-tagged to that source
- Reading queue per domain — what's next in each area
- Cold domain alert: *"You haven't read anything in Physics in 30 days"*
- Reading velocity per domain: are you making progress or revisiting familiar territory
- Source links to thoughts: any thought can be attributed to a source

**Build complexity:** Low

---

### 1.4 Weekly Synthesis Brief

**The problem it solves:** Polymaths lose the thread. They can't see their own patterns because they're inside them. The Morning Brief is daily and task-focused. This is weekly and purely about your intellectual life.

**What it does (AI-generated, runs every Sunday):**
- *"This week you captured 23 thoughts. A hidden theme appeared across 4 domains: compression and information density."*
- *"Your open question from 3 weeks ago about emergence now has 4 thoughts that might be forming an answer."*
- *"You've been in AI/ML for 12 days straight. Your Physics and Writing domains are going cold."*
- *"Potential cross-domain collision: your note on mycelium networks and your note on distributed training share the same structure."*
- *"Insight surge: 5 insights this week vs 1 last week — something clicked."*
- Uses data already in the app — no new input required from the user

**Build complexity:** Low (AI call + existing data)

---

### 1.5 Cross-Domain Collision

**The problem it solves:** The most valuable ideas live at domain intersections. Most people never go there deliberately. The Forge synthesizes your own thoughts — this deliberately smashes concepts from different domains to generate new research directions.

**What it does:**
- Pick two domains (or let app pick randomly)
- AI generates 3–5 collision prompts:
  - *"What if evolutionary selection pressure was a form of gradient descent? What would that imply?"*
  - *"Mycelium networks distribute information without a central hub. How would a neural architecture with this topology behave?"*
- These are prompts for YOUR thinking, not answers
- You respond → captured as a cross-domain insight tagged to both domains
- Hot intersections (most active collisions) become visible on Brain Map
- Can be surfaced randomly as a daily creative prompt

**Build complexity:** Low (AI call + existing capture flow)

---

### 1.6 Knowledge Decay Check-ins

**The problem it solves:** You forget things you've learned. A polymath who forgets everything isn't building anything. This makes learning cumulative. Based on the Ebbinghaus forgetting curve.

**What it does:**
- When you mark an insight as "I really understood this", it starts a decay clock
- Checkpoints at 7d, 30d, 90d: app resurfaces it and asks: *"You captured this 30 days ago. Still solid?"*
- Three responses: **Still true** (extends clock) / **Evolved** (add a new thread) / **Wrong** (archive it)
- Per-domain "retention score": of the insights you marked as important, how many have held up
- Not Anki-style flashcards — more like a check-in conversation with your past self

**Build complexity:** Medium

---

### 1.7 The Antilibrary

**The problem it solves:** Nassim Taleb's idea — the books you haven't read are more important than the ones you have. The unread shelf is a map of what you don't know. Polymaths can feel like frauds because they're aware of how much they haven't learned. This reframes that as a superpower.

**What it does:**
- Dedicated space for: papers you've seen cited but haven't read, concepts you know exist but don't understand, domains you've never explored, people doing work you should know about
- NOT a todo list — no pressure to complete it, no due dates
- When you engage with something from the Antilibrary, it moves to active learning
- AI suggests additions based on what you ARE reading: *"You keep reading about information theory but haven't encountered Kolmogorov complexity — add it?"*
- Size of your Antilibrary is something to be proud of, not ashamed of

**Build complexity:** Low (new list type, similar to doom pile)

---

### 1.8 Speed Research Mode

**The problem it solves:** When going deep on a topic, you want a structured scaffold — not just freeform capture. Research without structure often circles without progressing.

**What it does:**
- Enter a topic or question
- AI generates a research scaffold: key concepts to understand, key questions to answer, key people/papers to know
- You capture insights as you go, auto-tagged to this research session
- Research session has its own view: scaffold on the left, capture on the right
- At end: auto-generated summary of everything you captured
- Sessions become permanent knowledge assets, not just thoughts

**Build complexity:** Medium

---

## 2. ADHD Features

*For the neurological realities of ADHD — not just "reminders and timers" but features that address actual executive dysfunction, time blindness, emotional dysregulation, and working memory deficits.*

---

### 2.1 First Step Injector

**The ADHD problem:** Task initiation paralysis. Not laziness — the brain fails to allocate dopamine to the start signal. "Write dissertation chapter 3" fails. "Open the document and put your cursor in it" works.

**What it does:**
- One-tap on any task: AI breaks it to a comically small first step only (not subtasks — THE first step)
  - *"Write dissertation chapter 3"* → *"Open the document and put your cursor in it"*
  - *"Work out"* → *"Put on your gym shoes"*
  - *"Read that paper"* → *"Open the PDF and read the abstract"*
- Shows ONLY the first step — everything else disappears
- After: *"Done? Want the next step or are you rolling now?"*
- No shame if you stop after step one. One step always earns XP.

**Build complexity:** Low (AI call, minimal UI)

---

### 2.2 Context Snapshots

**The ADHD problem:** Working memory leaks. Coming back to something after interruption and having zero idea where you were. The context is gone. Rebuilding it takes 20 minutes. So you avoid starting at all.

**What it does:**
- Before any task switch, optional 30-second prompt: *"Before you go — where were you? What's the next action? What's the open problem?"*
- 10 seconds to type one line — or skip entirely, no friction
- When you return: context snapshot is the FIRST thing you see
- Breadcrumb visible on every task: when you last touched it and what you noted
- "Return to task" flow: shows snapshot before showing anything else

**Build complexity:** Low

---

### 2.3 The Doom Pile (with Amnesty)

**The ADHD problem:** Every ADHDer has accumulated avoided tasks they feel crushing guilt about. The shame of the pile makes avoidance worse. The worse avoidance gets, the bigger the pile. Apps that show overdue tasks in red make this dramatically worse.

**What it does:**
- Separate "Doom Pile" section — explicitly not a todo list
- No due dates, no priority indicators, zero pressure language
- Anything can be added to Doom Pile instead of active todos
- Weekly "Doom Pile Amnesty": review it, officially release items you're never going to do
  - Not marked as failed — marked as *"Released — not for me right now"*
  - The amnesty is a ritual, not a deletion. Explicit forgiveness.
- AI occasionally suggests moving an item from Doom Pile to active if energy/context matches

**Build complexity:** Low (new list type + copy decisions)

---

### 2.4 Shame Shield (RSD Protection Layer)

**The ADHD problem:** Rejection Sensitive Dysphoria (RSD) affects the majority of ADHDers. One overdue task, one missed streak, one "you failed" message can trigger a shame spiral that kills the rest of the day.

**What it does:**
- No task is ever marked "FAILED" or displayed as punishing
- Missed streak: no counter reset display. *"You took a break. Your streak shield activated."*
- Doom spiral detection: no activity for 3+ days → app opens to compassion screen:
  *"You've been away for a bit. That's okay. You don't owe this app anything. Want to start small?"*
  - Button: "Give me one tiny thing"
  - Button: "Just let me write something"
  - Button: "I'm not ready yet" → app says "okay, we're here when you are"
- Full language audit: every piece of UI copy reviewed for shame/guilt framing before shipping
- Overdue tasks shown as "resting" not "overdue"

**Build complexity:** Low (copy decisions + one new screen)

---

### 2.5 Emotional State → Adaptive UI

**The ADHD problem:** ADHDers are highly emotionally reactive. The same app that works when you're feeling good actively makes things worse when you're emotionally flooded. A one-size-fits-all interface ignores this entirely.

**What it does:**
- Quick emotional check-in at app open (one tap, completely optional):
  `Frozen · Anxious · Bored · Overwhelmed · Flat · Okay · Flowing · Hyped`
- App adapts immediately based on state:
  - **Frozen** → one task, giant, everything else hidden. "Just this."
  - **Anxious** → overdue indicators hidden, calming captures shown, Chaos Mode offered
  - **Bored** → Cross-Domain Collision activated, novelty capture prompt, domain randomizer
  - **Overwhelmed** → full minimal mode, breathing prompt, no task list visible
  - **Flat** (dopamine low) → gamification foregrounded, boss battles surfaced, XP floats enlarged
  - **Flowing** → get out of the way, just show the capture input
  - **Hyped** → maximum capture mode, boss battle attack prompt, channel the energy

**Build complexity:** Medium

---

### 2.6 Hyperfocus Mode

**The ADHD problem:** Hyperfocus is the ADHD superpower and every productivity tool either ignores it or fights it. If you're in hyperfocus, nothing should interrupt you. When it ends, enormous value is trapped in your head and evaporates within an hour.

**What it does:**
- After 75+ uninterrupted minutes: app detects hyperfocus, silently enters Hyperfocus Mode
  - All notifications suppressed
  - Serendipity Engine paused
  - No quest progress popups
  - Timer continues but becomes invisible
  - Screen edge glow activates (visual signal you're in the zone)
- When session ends: Hyperfocus Harvest screen
  *"You were in hyperfocus for 2h 18m. That's rare. Extract everything."*
  - Rapid-fire capture mode: 5 minutes, no classification, just dump
  - AI organizes the dump into thoughts, questions, and insights after
- Hyperfocus sessions: 3× XP, special badge on profile for 24 hours
- Hyperfocus history: track how often it happens and in which domains

**Build complexity:** Medium

---

### 2.7 Time Blindness Trainer

**The ADHD problem:** ADHDers have no internal clock — reduced activation in brain regions responsible for time perception. This isn't a character flaw, it's neurological. Current timers compensate for it but don't build the skill.

**What it does:**
- Before starting a task: *"How long do you think this will take?"*
- After completing: shows actual vs. estimated time
- Over time: builds a personal accuracy score and "ADHD tax":
  *"You consistently underestimate by 2.4×. Real estimate for this: 48 min, not 20."*
- Time anchor mode: every 15 minutes, a gentle non-alarming visual pulse — not a notification, just a breathing reminder that time is passing
- Pattern recognition: *"The last 5 times you started something at 10pm, you went until 2am. It's 10pm."*
- Per-domain time data: some domains you're more accurate in than others

**Build complexity:** Medium

---

### 2.8 Body Double Mode

**The ADHD problem:** Body doubling is one of the most well-documented ADHD strategies — the presence of another person, even a stranger working silently, activates the ADHD brain enough to work. Zero mainstream productivity apps support this.

**What it does:**
- "Work with others" mode — shows live count of other POLYMATH OS users currently in focus sessions
  *"843 people are working right now"*
- Focus Room: stripped-back UI — only the timer, the task name, and the presence counter. Nothing else.
- Optional ambient presence: a pulsing dot for each active session, no names, no details
- Future: opt-in pairing — matched with one anonymous user for a session, both see each other's timer ticking

**Build complexity:** High (requires lightweight backend for real-time presence)

---

### 2.9 Transition Rituals

**The ADHD problem:** The gap between tasks is where ADHD loses hours. Finish something (or abandon it), and instead of moving on, you open YouTube and surface 2 hours later. The transition itself needs to be a designed moment.

**What it does:**
- "Close" ritual when finishing/leaving a task (30 seconds):
  - Capture one line: "What just happened?"
  - Save context snapshot automatically
  - Closure XP: even if you didn't finish, you get XP for the ritual
- "Open" ritual when starting a new task (30 seconds):
  - Shows: what this task is, what the one goal is, time estimate
  - One breath prompt (literal: "breathe in... start")
  - Timer only starts after the ritual completes
- Rituals are optional but XP-rewarded — builds the habit through dopamine

**Build complexity:** Medium

---

### 2.10 Object Permanence Compensation

**The ADHD problem:** Out of sight = out of mind. Tasks that disappear into a list might as well not exist. If it's not visible, it doesn't exist — this is neurological, not forgetfulness.

**What it does:**
- "Float" any one task: pins it visibly on every screen, always
- App actively surfaces forgotten things rather than waiting for you to scroll
- *"You had this intention 4 hours ago. Did it happen?"* — gentle nudge, not guilt
- Random todo surfacing throughout the day (not scheduled — random = novelty = ADHD attention)
- "Reappearance" — tasks that haven't been touched in 3+ days float up unprompted once

**Build complexity:** Low–Medium

---

## 3. Gamification Features

*To make the gamification layer feel like a real game, not just an accounting system.*

---

### 3.1 Visible XP Progress Bar

Currently the topbar shows a level number. The single biggest missing game mechanic — a bar filling toward the next level. Brain craves watching a bar fill.

```
[Lv.12] ████████░░░ 840 / 1000 XP
```

**Build complexity:** Very Low

---

### 3.2 Level-Up Ceremony

A level-up toast is underwhelming. Deserves a full-screen moment: brief overlay with new level, title unlock, particles, what changed (domain bonuses, new features unlocked). 2–3 seconds, auto-dismisses.

**Build complexity:** Low

---

### 3.3 Rank / Title System

Levels unlock titles displayed on profile and in topbar:

| Level | Title |
|-------|-------|
| 1–2   | The Wandering Mind |
| 3–5   | Curious Seeker |
| 6–9   | Domain Apprentice |
| 10–14 | Domain Explorer |
| 15–19 | Cross-Domain Thinker |
| 20–29 | Knowledge Weaver |
| 30–39 | The Synthesizer |
| 40–49 | Polymath Ascendant |
| 50+   | Polymath |

Achievements also unlock honorific titles. Player can equip their favorite.

**Build complexity:** Low

---

### 3.4 Session End Screen

When a focus session ends, a debrief card (like a game round-end screen):

```
SESSION COMPLETE
◉ Deep Work · AI/ML · 45 min

+120 XP  ·  Momentum ↑3%
Daily quest: 2/3 sessions
Boss damage: −45 HP on "Thesis Draft"
Streak: 🔥 Day 8

[Continue →]
```

**Build complexity:** Low–Medium

---

### 3.5 Combo System

Rapid sequential actions give combo bonuses:
- 3+ captures within 5 minutes → *"THOUGHT STORM ×3 — +50 bonus XP"*
- Back-to-back todo completions → *"ON A ROLL ×2"*
- Session + boss phase same day → *"DOUBLE KILL"*

Shown as temporary floating badge, not just a toast. Scales: bigger XP = bigger text.

**Build complexity:** Medium

---

### 3.6 Boss Battles — Give Them Teeth

Currently bosses are passive HP bars. Give them agency:
- No boss activity for 3 days → boss "attacks" — does HP damage to player character
- Player character now has HP (100 base, +10 per level)
- Losing all HP triggers "Defeated" state on that boss (resets it, not punishing, just narrative)
- Boss phases show visual transformation as HP drops
- Killing a boss drops a Loot Card with cosmetic reward + big XP

**Build complexity:** Medium

---

### 3.7 Weekly Challenges

Beyond the 3 daily quests — a weekly epic quest that resets every Monday:
- *"The Deep Dive: Complete 8 focus sessions this week"* → 500 XP + rare title
- *"Polymath Week: Capture thoughts in 5 different domains"* → Domain Synergy gem
- *"Boss Hunter: Damage 2 different bosses"* → Boss Slayer XP boost

**Build complexity:** Low (extends existing quest system)

---

### 3.8 Prestige / Ascension System

At Level 50: "Ascend to Polymath II" — resets level to 1, keeps all domain progress and cosmetics, adds Ascension star ★, multiplies future XP by 1.25×. Creates an endgame loop.

**Build complexity:** Low (math change + ceremony screen)

---

### 3.9 Skill Trees per Domain

Each domain gets a 3-tier tree. Unlock by hitting domain XP milestones:

```
AI/ML:
Tier 1 (100 XP):  "Data Wrangler"    → +5% XP from AI/ML captures
Tier 2 (500 XP):  "Model Architect"  → Deep Research mode bonus
Tier 3 (2000 XP): "Research Sage"    → AI classify always free
```

**Build complexity:** Medium–High

---

### 3.10 Loot / Cosmetic System

Actions earn "Shards" — currency for cosmetics only (zero pay-to-win):
- Capture panel border skins
- XP float styles (damage numbers, anime speed lines, minimal)
- Sidebar themes
- Character frame / avatar border styles

All earnable through play. Cosmetics validate progress without affecting balance.

**Build complexity:** High

---

## 4. Build Priority

### Immediate (low effort, high impact)

| Feature | Category | Why now |
|---------|----------|---------|
| First Step Injector | ADHD | Unique, low build, changes daily behavior |
| Context Snapshots | ADHD | Fills biggest gap in task flow |
| Doom Pile + Amnesty | ADHD | Simple data model, emotional impact |
| Shame Shield language | ADHD | Zero code — copy decisions only |
| Open Questions Tracker | Polymath | Unique, simple data model |
| Visible XP Progress Bar | Gamification | 1 hour, game design 101 |
| Level-Up Ceremony | Gamification | Half day, massive feel improvement |
| Weekly Challenges | Gamification | Extends existing quest system |

### Medium term

| Feature | Category | Why then |
|---------|----------|---------|
| Idea Incubator | Polymath | Needs capture to be mature first |
| Reading Brain | Polymath | Clean standalone feature |
| Session End Screen | Gamification | Needs session flow to feel stable |
| Emotional State → Adaptive UI | ADHD | Medium logic, high payoff |
| Hyperfocus Mode | ADHD | Needs timer to be reliable |
| Time Blindness Trainer | ADHD | Needs session history data |
| Combo System | Gamification | Needs XP bar first |
| Boss Battles with Teeth | Gamification | HP system prerequisite |

### Later (complex or dependent)

| Feature | Category | Why later |
|---------|----------|---------|
| Weekly Synthesis Brief | Polymath | Needs weeks of data to be useful |
| Cross-Domain Collision | Polymath | Builds on Forge patterns |
| Knowledge Decay Check-ins | Polymath | Needs insight tagging first |
| Antilibrary | Polymath | Needs reading brain first |
| Speed Research Mode | Polymath | Complex UX, needs solid foundation |
| Body Double Mode | ADHD | Requires backend |
| Skill Trees | Gamification | High complexity, needs domain system mature |
| Loot / Cosmetics | Gamification | Build this when retention is proven |
| Prestige System | Gamification | Endgame — build last |

---

*Last updated: 2026-05-24*
