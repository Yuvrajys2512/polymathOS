# Quests Tab — What Was Built

## 1. Campaign Map (full-width canvas at top)

A live canvas constellation visualization spanning the full width of the Quests tab.

- **Questlines** render as rows of domain-colored star nodes connected by lines. Completed nodes glow and show a checkmark. The next active node pulses. Completed edges have a traveling light particle moving along them.
- **Bosses** appear in a right-side zone separated by a dashed line. Each boss has a pulsing body, an HP ring arc that drains as phases complete, and the HP color shifts red → yellow → green as it gets low.
- **Hover tooltips** — hover any node to see its title, XP reward, HP %, and status (complete / next up).
- **Empty state** — shows placeholder text if no questlines or bosses exist.
- **Files:** `src/components/CampaignMap/CampaignMap.jsx` (new), CSS in `src/index.css`

---

## 2. Weekly Campaign

A persistent weekly objective that resets every Monday. Bigger goal, bigger XP than daily quests.

- Shown below the daily quest cards in QuestsPanel with a purple progress bar.
- Advances automatically from the same actions that earn XP: focus sessions, task completions, habit logs, thought captures.
- Each week gets a different quest from the pool (deterministic seed so everyone on the same week gets the same one).
- Weekly quest pool: The Marathon (5 sessions), Destroyer Mode (10 tasks), Iron Discipline (5 habits), Deep Week (3 sessions), Task Slayer (5 tasks). XP rewards 220–500.
- **State shape added:** `weeklyQuest: { weekStr, title, desc, type, goal, progress, completed, xpReward }`
- **Files:** `src/constants/index.js` (WEEKLY_QUEST_POOL), `src/utils/game.js` (getISOWeekStr, refreshWeeklyQuest, advanceWeeklyQuest), `src/hooks/useGameState.js`, `src/components/Quests/QuestsPanel.jsx`

---

## 3. Daily Combo + Streak

Rewards completing all 3 daily quests on the same day.

- When all 3 quests complete: +75 Life XP bonus fires automatically, a gold "◆ All quests complete · +75 XP bonus" badge appears below the quest list.
- A streak counter tracks consecutive days you sweep all 3 (e.g. "3x" shown in gold).
- If you have a streak but haven't swept today yet, a hint shows: "◆ Nd streak — complete all 3 for bonus".
- **State shape added:** `dailyComboStreak: { count, lastComboDate }`
- Combo detection lives inside `applyGame` — no extra calls needed, it checks automatically on every XP action.
- **Files:** `src/hooks/useGameState.js` (applyGame), `src/components/Quests/QuestsPanel.jsx`

---

## 4. Boss Auto-Suggest

Fixes the empty Boss Battles panel by scanning your existing data.

- When there are no active bosses and no form open, the panel shows **"DETECTED THREATS"** — suggested bosses derived from:
  - Top 2 domains by count of undone task-type thoughts → e.g. "AI/ML Backlog · 6 pending tasks in AI/ML"
  - Overdue todos → "Overdue Siege · 3 overdue todos"
- One click on "Summon" creates a 3-phase boss from the suggestion with default phases.
- Suggestions disappear once a boss is active.
- **Files:** `src/components/BossBattles/BossBattles.jsx`

---

## 5. Quest Generator Intent Fill

If you've set today's intention, a one-click button appears above the quest input:
`✦ Use today's intention: "your intention here"`

Clicking it pre-fills the goal input so you don't have to retype. Disappears once you start typing.

- **Files:** `src/components/QuestGenerator/QuestGenerator.jsx`

---

## Architecture Notes

- All new state (`weeklyQuest`, `dailyComboStreak`) is in `SEED` with loadState fallbacks — old saves won't break.
- Weekly quest advances happen in both `applyGame` (for session/tasks/habit/intention types) and `submitThought` (for capture type).
- Combo detection is inside `applyGame` — zero extra calls needed anywhere.
- `applyGame` was also fixed: the old version had a bug where `Life` domain XP from quest bonuses overwrote the main XP if `domain === 'Life'`. The new version accumulates all bonus XP correctly.
- Build: `npx vite build` passes with zero errors, 338KB JS bundle.
