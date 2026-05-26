# COSMOS — Sub-Tab Reference

The **Cosmos** page (`src/views/CosmosView.jsx`) is a hub of "beyond the ordinary" experiences, each living as its own sub-tab. This file documents the four tabs added alongside the originals (Oracle, Timeline, DNA, Memento Mori): **Workbench, Lab, Expedition, Council**.

All four:
- Render inside `CosmosView` via the `TABS` array + a render block keyed on `active`.
- Receive the whole `game` object as a prop and read/mutate through `useGameState`.
- Persist to `localStorage` automatically (any `state.*` change is saved by `useGameState`).
- Use **Groq** for AI (key in `state.groqKey`, set in Profile → AI Settings) and **degrade gracefully** with a local fallback when there's no key or the call fails.

Tab order in Cosmos: `Oracle · Timeline · DNA · Workbench · Lab · Expedition · Council · Memento`.

---

## Shared AI helper — `src/utils/cosmosAI.js`

A thin wrapper around the Groq chat endpoint, mirroring the call style in `classify.js` / `Oracle.jsx`.

```js
groqChat(groqKey, prompt, { model, maxTokens, json })  // → string (model text)
parseJSON(raw)                                          // → parsed object/array | null
```

- Default model: `llama-3.3-70b-versatile`. Throws `no-key` if `groqKey` is missing, or `API <status>` on a bad response — callers catch and fall back to local logic.
- `json: true` requests Groq JSON mode; `parseJSON` defensively extracts the first `{…}`/`[…]` block and parses it.

---

## ⊞ THE WORKBENCH — infinite spatial canvas

**What it is:** an endless, pannable/zoomable board where loose captures become structured plans. Drop blank notes or existing thoughts, drag them into clusters, and draw connections by hand.

**Component:** `src/components/Workbench/Workbench.jsx`
**No AI. No key required.**

### Interactions
- **Pan** — drag empty space (pointer-capture; screen-space delta, zoom-independent).
- **Zoom** — mouse wheel (anchored to cursor) or the `− / % / + / ⟲` controls. Clamped to `0.3×–2.5×`.
- **Add Note** — toolbar `+ NOTE` drops an editable sticky at the viewport center.
- **Add Thought** — toolbar `+ THOUGHT` opens a picker of not-done thoughts not already on the board; selecting one drops a read-only card tinted with its domain color.
- **Move** — drag a card by its header. Live position is local during drag; the final position commits to state on pointer-up (avoids a `localStorage` write per frame).
- **Connect** — click a card's `⤳`, then click another card → an edge is created. Click empty space to cancel.
- **Delete** — card `×` (also removes its edges); click an edge line to delete it.

### State — `state.workbench`
```js
{
  nodes: [
    { id, kind: 'note' | 'thought', text, color, x, y,
      domain?, thoughtId? }   // thought nodes carry domain + source thoughtId
  ],
  edges: [ { id, from, to } ] // from/to are node ids
}
```
Camera (`x, y, zoom`) is **local UI state only** — intentionally not persisted.

### Methods (`useGameState`)
`addWorkbenchNode(node)` · `updateWorkbenchNode(id, patch)` · `deleteWorkbenchNode(id)` (cascades edges) · `addWorkbenchEdge(from, to)` (dedupes, ignores self-links) · `deleteWorkbenchEdge(id)`

### Implementation notes
- World layer is a fixed `4000×3000` board transformed by `translate(cam.x, cam.y) scale(cam.zoom)`.
- Edges are an SVG with `pointer-events: none`; only the lines are clickable (`pointer-events: stroke` on a fat invisible hit-line).
- Edge endpoints follow the live drag position so connections track a card while it moves.

---

## ⏣ THE LAB — personal experiment tracker

**What it is:** run n=1 experiments on yourself. Form a hypothesis, change one variable, log a daily metric, watch the graph build, then let the verdict develop.

**Component:** `src/components/Lab/Lab.jsx`
**AI:** optional (Groq verdict; local stats fallback). Concluding awards **+50 XP to Learning**.

### Flow
1. `+ NEW EXPERIMENT` → fill **Title, Hypothesis, Variable, Metric** → `BEGIN TRIAL`.
2. Select an experiment; **LOG** a numeric value (+ optional note) each day. Re-logging the same day overwrites it.
3. With **2+ data points**, `CONCLUDE EXPERIMENT`:
   - With a Groq key → an analyst prompt reviews the series and returns a 2–3 sentence verdict.
   - Without → `localVerdict()` computes average + start-to-finish trend and writes a plain-language conclusion.
4. Concluded experiments show a purple **VERDICT** block and lock.

### State — `state.experiments`
```js
[ {
    id, title, hypothesis, variable, metric,
    status: 'running' | 'concluded',
    logs: [ { date: 'YYYY-MM-DD', value: number, note } ],  // sorted by date
    conclusion, createdAt, concludedAt?
} ]
```

### Methods
`addExperiment({title,hypothesis,variable,metric})` · `logExperiment(id, value, note)` · `concludeExperiment(id, conclusion)` (routes XP through `applyGame`) · `deleteExperiment(id)`

### Implementation notes
- `LabGraph` is a self-contained `<canvas>` line chart: DPR-aware, auto-scales to the value range, 3 gridlines, gradient area fill, glowing points, and a ~650ms self-drawing reveal animation on data change.

---

## ⟁ THE EXPEDITION — learning-path cartographer

**What it is:** turn a scattered "want to learn X" into a structured journey. AI charts a milestone route; you advance it like a campaign map with fog over what's ahead.

**Component:** `src/components/Expedition/Expedition.jsx`
**AI:** optional (Groq route; local default route). Milestones award **+30 XP**, full completion **+80 XP** in the expedition's domain.

### Flow
1. `+ NEW` → enter a goal, pick a **domain** → `CHART THE ROUTE`.
   - With a key → Groq returns 5–7 sequential milestones (foundational → advanced) as JSON.
   - Without → `localRoute()` provides a sensible generic 6-step path.
2. The route renders as a vertical **trail**: a glowing central spine, milestone "stations" alternating left/right.
   - **done** = lit node in domain color · **current** = pulsing, has a `REACH THIS ▸` button · **locked** = dimmed + blurred ("fog ahead"), description hidden.
3. Reaching the current milestone advances the spine fill and lights the node. Completing the last one marks the expedition complete (summit banner).

### State — `state.expeditions`
```js
[ {
    id, goal, domain,
    milestones: [ { id, title, desc, done } ],
    completed, createdAt, completedAt?
} ]
```

### Methods
`addExpedition({goal,domain,milestones})` · `completeExpeditionMilestone(expId, milestoneId, e)` (XP via `applyGame`; bigger award on final milestone) · `deleteExpedition(id)`

### Implementation notes
- The trail is a center-spine layout (robust + responsive) rather than fragile absolute coordinate math; on mobile the spine shifts left and all cards stack to its right.
- After creating, `selId` is reset to `null` so the view falls back to the newest (prepended) expedition — avoids reading stale `game.state`.

---

## ⊜ THE COUNCIL — decision war room

**What it is:** bring a decision; an internal council of advisor-facets of your own mind debates it, then delivers a verdict.

**Component:** `src/components/Council/Council.jsx`
**AI:** optional (Groq advisors + verdict; local generic council). **No XP** — it's a thinking tool.

### Flow
1. Type a decision (or pick an example chip) → `CONVENE`.
2. Context is built from your **top domains by XP + recent thoughts**, so advisors reference your actual situation.
   - With a key → Groq returns JSON: 4 advisors (each `role` + `argument`) plus a decisive `verdict`.
   - Without → `localCouncil()` supplies four archetypes (Strategist / Skeptic / Builder / Visionary) and generic counsel.
3. A round **stage** renders: a central emblem with advisor **seats** positioned evenly around it (trig-placed). Seats light up one-by-one (~760ms each); arguments appear in the transcript as each is revealed; the **VERDICT** block fades in last.
4. Every convening is saved to **PAST RULINGS**; clicking one reloads it (all revealed instantly).

### State — `state.councilSessions`
```js
[ {
    id, question,
    advisors: [ { role, argument } ],
    verdict, createdAt
} ]   // capped at 30
```

### Methods
`addCouncilSession({question, advisors, verdict})` · `deleteCouncilSession(id)`

### Implementation notes
- Sequential reveal driven by a `revealed` counter advanced via `setTimeout` in an effect; verdict shows once `revealed >= advisors.length`.
- Seat colors come from a fixed palette by index for visual consistency, regardless of what the model returns.

---

## File map

```
src/
├── utils/cosmosAI.js                     ★ shared groqChat + parseJSON
├── views/CosmosView.jsx                    TABS array + render blocks (wires all sub-tabs)
├── hooks/useGameState.js                   SEED + loadState fallback + all methods below
└── components/
    ├── Workbench/Workbench.jsx
    ├── Lab/Lab.jsx
    ├── Expedition/Expedition.jsx
    └── Council/Council.jsx
```

**State added to `SEED` (and `loadState` fallback so old saves don't break):**
`workbench: { nodes: [], edges: [] }` · `experiments: []` · `expeditions: []` · `councilSessions: []`

**All CSS** lives in `src/index.css` under the section headers `WORKBENCH`, `LAB`, `EXPEDITION`, `COUNCIL`, with mobile overrides in the `@media (max-width: 768px)` block.

---

## Conventions honored
- All persistent state flows through `useGameState`; no direct `localStorage` access in components.
- All XP awards (Lab conclude, Expedition milestones) route through `applyGame` — preserving streak, quest advancement, and achievement checks.
- All AI features have a working offline fallback; **the Workbench needs no key at all.**
- IDs via `crypto.randomUUID()`; dates as `YYYY-MM-DD` from `todayStr()`.
- Styling uses the existing design tokens (dark terminal-OS aesthetic) — no new dependencies. Build: `npx vite build` (passes clean).
