import { useState } from 'react';
import { DOMAINS, DOMAIN_COLOR } from '../../constants/index.js';
import { groqChat, parseJSON } from '../../utils/cosmosAI.js';

function localRoute(goal) {
  return [
    { title: 'Map the terrain', desc: `Survey ${goal} — gather the best resources and define what mastery looks like.` },
    { title: 'Learn the fundamentals', desc: 'Build the core vocabulary and first principles before anything else.' },
    { title: 'First hands-on attempt', desc: 'Do the smallest real version end to end, however rough.' },
    { title: 'Study the experts', desc: 'Reverse-engineer how skilled people actually approach it.' },
    { title: 'Build something real', desc: 'Apply it to a concrete project you genuinely care about.' },
    { title: 'Teach it back', desc: 'Explain it to someone else — the final test of true understanding.' },
  ];
}

export default function Expedition({ game }) {
  const { state } = game;
  const expeditions = state.expeditions || [];

  const [creating, setCreating] = useState(expeditions.length === 0);
  const [goal, setGoal] = useState('');
  const [domain, setDomain] = useState('Learning');
  const [busy, setBusy] = useState(false);
  const [selId, setSelId] = useState(expeditions[0]?.id || null);

  const sel = expeditions.find(e => e.id === selId) || expeditions[0] || null;

  async function chart() {
    if (!goal.trim() || busy) return;
    setBusy(true);
    let milestones;
    try {
      const raw = await groqChat(state.groqKey,
        `You are an expert curriculum designer. A learner wants to achieve: "${goal.trim()}" (domain: ${domain}).\n` +
        `Design a sequential expedition of 5-7 milestones from absolute basics to genuine competence.\n` +
        `Return ONLY JSON: {"milestones":[{"title":"...","desc":"..."}]}. ` +
        `Each title ≤ 6 words. Each desc ≤ 18 words, an actionable step. Order foundational → advanced.`,
        { json: true, maxTokens: 600 });
      const parsed = parseJSON(raw);
      milestones = Array.isArray(parsed?.milestones) && parsed.milestones.length
        ? parsed.milestones.slice(0, 8).map(m => ({ title: String(m.title || 'Milestone').slice(0, 60), desc: String(m.desc || '').slice(0, 140) }))
        : localRoute(goal.trim());
    } catch {
      milestones = localRoute(goal.trim());
    }
    game.addExpedition({ goal: goal.trim(), domain, milestones });
    setBusy(false);
    setCreating(false);
    setGoal('');
    setSelId(null); // fall back to the newest (prepended) expedition next render
  }

  const dc = DOMAIN_COLOR[sel?.domain] || '#fb923c';
  const currentIndex = sel ? sel.milestones.findIndex(m => !m.done) : -1;
  const doneCount = sel ? sel.milestones.filter(m => m.done).length : 0;
  const progress = sel && sel.milestones.length ? doneCount / sel.milestones.length : 0;

  return (
    <div className="exp-root">
      <div className="exp-bar">
        <div className="exp-bar-tabs">
          {expeditions.map(e => (
            <button
              key={e.id}
              className={`exp-bar-tab${sel?.id === e.id ? ' active' : ''}`}
              style={{ '--dc': DOMAIN_COLOR[e.domain] || '#fb923c' }}
              onClick={() => { setSelId(e.id); setCreating(false); }}
            >
              {e.completed ? '✓ ' : ''}{e.goal.slice(0, 22)}
            </button>
          ))}
        </div>
        <button className="exp-new" onClick={() => setCreating(c => !c)}>{creating ? '×' : '+ NEW'}</button>
      </div>

      {creating && (
        <div className="exp-create">
          <div className="exp-create-title">Where do you want to go?</div>
          <input
            className="exp-goal-in"
            placeholder="e.g. Understand quantum field theory · Learn to oil paint"
            value={goal}
            onChange={e => setGoal(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && chart()}
          />
          <div className="exp-dom-row">
            {DOMAINS.map(d => (
              <button
                key={d}
                className={`exp-dom${domain === d ? ' active' : ''}`}
                style={{ '--dc': DOMAIN_COLOR[d] }}
                onClick={() => setDomain(d)}
              >{d}</button>
            ))}
          </div>
          <button className="primary" onClick={chart} disabled={busy || !goal.trim()}>
            {busy ? 'CHARTING ROUTE…' : 'CHART THE ROUTE'}
          </button>
          {!state.groqKey && (
            <div className="exp-nokey">No Groq key — a default route will be charted. Add a key in Profile for a tailored path.</div>
          )}
        </div>
      )}

      {!creating && sel && (
        <div className="exp-map" style={{ '--dc': dc }}>
          <div className="exp-map-head">
            <div className="exp-map-goal">{sel.goal}</div>
            <div className="exp-map-prog">
              <div className="exp-map-prog-track"><div className="exp-map-prog-fill" style={{ width: `${progress * 100}%` }} /></div>
              <span>{doneCount}/{sel.milestones.length}</span>
            </div>
            <button className="exp-map-del" onClick={() => { game.deleteExpedition(sel.id); setSelId(null); setCreating(true); }}>delete</button>
          </div>

          {sel.completed && (
            <div className="exp-complete-banner">◆ EXPEDITION COMPLETE — you reached the summit of "{sel.goal}"</div>
          )}

          <div className="exp-trail">
            <div className="exp-spine"><div className="exp-spine-fill" style={{ height: `${progress * 100}%` }} /></div>
            {sel.milestones.map((m, i) => {
              const stState = m.done ? 'done' : i === currentIndex ? 'current' : 'locked';
              return (
                <div key={m.id} className={`exp-station ${stState} ${i % 2 ? 'right' : 'left'}`}>
                  <div className="exp-node">
                    <span className="exp-node-glyph">{m.done ? '✓' : stState === 'locked' ? '◌' : i + 1}</span>
                  </div>
                  <div className="exp-card">
                    <div className="exp-card-title">{m.title}</div>
                    {stState !== 'locked' && m.desc && <div className="exp-card-desc">{m.desc}</div>}
                    {stState === 'locked' && <div className="exp-card-fog">· fog ahead ·</div>}
                    {stState === 'current' && (
                      <button className="exp-reach" onClick={e => game.completeExpeditionMilestone(sel.id, m.id, e)}>
                        REACH THIS ▸
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
