import { useState, useCallback } from 'react';
import { DOMAINS, DOMAIN_COLOR } from '../../constants/index.js';
import { groqChat, parseJSON } from '../../utils/cosmosAI.js';

const DIFFICULTIES = [
  { id: 'easy',      label: 'EASY',      color: '#22c55e' },
  { id: 'medium',    label: 'MEDIUM',    color: '#f59e0b' },
  { id: 'hard',      label: 'HARD',      color: '#f97316' },
  { id: 'legendary', label: 'LEGENDARY', color: '#8b5cf6' },
];

const DIFF_COLOR = Object.fromEntries(DIFFICULTIES.map(d => [d.id, d.color]));

function localRoute(goal) {
  return [
    { title: 'Map the terrain',        desc: `Survey ${goal} — gather the best resources and define what mastery looks like.`, difficulty: 'easy' },
    { title: 'Learn the fundamentals', desc: 'Build the core vocabulary and first principles before anything else.',           difficulty: 'easy' },
    { title: 'First hands-on attempt', desc: 'Do the smallest real version end to end, however rough.',                       difficulty: 'medium' },
    { title: 'Study the experts',      desc: 'Reverse-engineer how skilled people actually approach it.',                     difficulty: 'medium' },
    { title: 'Build something real',   desc: 'Apply it to a concrete project you genuinely care about.',                     difficulty: 'hard' },
    { title: 'Teach it back',          desc: 'Explain it to someone else — the final test of true understanding.',            difficulty: 'hard' },
  ];
}

function newStage() {
  return { _key: crypto.randomUUID(), title: '', difficulty: 'medium' };
}

// ── Expedition list card ──────────────────────────────────────────────────────

function ExpCard({ exp, onSelect }) {
  const dc = DOMAIN_COLOR[exp.domain] || '#fb923c';
  const done = exp.milestones.filter(m => m.done).length;
  const total = exp.milestones.length;
  const pct = total ? (done / total) * 100 : 0;
  return (
    <button
      className={`exp-list-card${exp.completed ? ' completed' : ''}`}
      style={{ '--dc': dc }}
      onClick={() => onSelect(exp.id)}
    >
      <div className="exp-list-domain">{exp.domain}</div>
      <div className="exp-list-goal">{exp.goal}</div>
      <div className="exp-list-meta">
        <div className="exp-list-track">
          <div className="exp-list-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="exp-list-count">{done}/{total}</span>
      </div>
      {exp.completed && <div className="exp-list-done">COMPLETE</div>}
    </button>
  );
}

// ── Stage row in creation form ────────────────────────────────────────────────

function StageRow({ stage, index, onChange, onRemove, canRemove }) {
  return (
    <div className="exp-stage-row">
      <span className="exp-stage-num">{index + 1}</span>
      <input
        className="exp-stage-name"
        placeholder={`Stage ${index + 1} name…`}
        value={stage.title}
        onChange={e => onChange({ ...stage, title: e.target.value })}
      />
      <div className="exp-diff-row">
        {DIFFICULTIES.map(d => (
          <button
            key={d.id}
            className={`exp-diff-btn${stage.difficulty === d.id ? ' active' : ''}`}
            style={{ '--dc': d.color }}
            onClick={() => onChange({ ...stage, difficulty: d.id })}
            type="button"
          >{d.label}</button>
        ))}
      </div>
      {canRemove && (
        <button className="exp-stage-del" onClick={onRemove} type="button">×</button>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Expedition({ game }) {
  const { state } = game;
  const expeditions = state.expeditions || [];

  const [view, setView]       = useState('list');   // 'list' | 'create' | 'trail'
  const [selId, setSelId]     = useState(null);

  // creation form state
  const [goal, setGoal]       = useState('');
  const [domain, setDomain]   = useState('Learning');
  const [stages, setStages]   = useState([newStage(), newStage(), newStage()]);
  const [busy, setBusy]       = useState(false);

  const sel = expeditions.find(e => e.id === selId) || null;
  const dc  = DOMAIN_COLOR[sel?.domain] || '#fb923c';
  const currentIndex = sel ? sel.milestones.findIndex(m => !m.done) : -1;
  const doneCount = sel ? sel.milestones.filter(m => m.done).length : 0;
  const progress  = sel && sel.milestones.length ? doneCount / sel.milestones.length : 0;

  function openCreate() {
    setGoal('');
    setDomain('Learning');
    setStages([newStage(), newStage(), newStage()]);
    setView('create');
  }

  function openTrail(id) {
    setSelId(id);
    setView('trail');
  }

  function addStage() {
    if (stages.length < 12) setStages(s => [...s, newStage()]);
  }
  function updateStage(i, s) { setStages(prev => prev.map((x, j) => j === i ? s : x)); }
  function removeStage(i)    { setStages(prev => prev.filter((_, j) => j !== i)); }

  function createManual() {
    const validStages = stages.filter(s => s.title.trim());
    if (!goal.trim() || validStages.length === 0) return;
    game.addExpedition({
      goal: goal.trim(),
      domain,
      milestones: validStages.map(s => ({
        title: s.title.trim(),
        desc: '',
        difficulty: s.difficulty,
      })),
    });
    setView('list');
  }

  async function chartWithAI() {
    if (!goal.trim() || busy) return;
    setBusy(true);
    let milestones;
    try {
      const raw = await groqChat(
        state.groqKey,
        `You are an expert curriculum designer. A learner wants to achieve: "${goal.trim()}" (domain: ${domain}).\n` +
        `Design a sequential expedition of 5-7 milestones from absolute basics to genuine competence.\n` +
        `Assign a difficulty to each: easy, medium, hard, or legendary.\n` +
        `Return ONLY JSON: {"milestones":[{"title":"...","desc":"...","difficulty":"easy|medium|hard|legendary"}]}.\n` +
        `Each title ≤ 6 words. Each desc ≤ 18 words, an actionable step. Order foundational → advanced.`,
        { json: true, maxTokens: 700 }
      );
      const parsed = parseJSON(raw);
      milestones = Array.isArray(parsed?.milestones) && parsed.milestones.length
        ? parsed.milestones.slice(0, 8).map(m => ({
            title: String(m.title || 'Milestone').slice(0, 60),
            desc: String(m.desc || '').slice(0, 140),
            difficulty: ['easy','medium','hard','legendary'].includes(m.difficulty) ? m.difficulty : 'medium',
          }))
        : localRoute(goal.trim());
    } catch {
      milestones = localRoute(goal.trim());
    }
    game.addExpedition({ goal: goal.trim(), domain, milestones });
    setBusy(false);
    setView('list');
  }

  // ── List view ───────────────────────────────────────────────────────────────

  if (view === 'list') {
    return (
      <div className="exp-root">
        <div className="exp-list-header">
          <div className="exp-list-title">YOUR EXPEDITIONS</div>
          <button className="exp-new-btn" onClick={openCreate}>+ NEW EXPEDITION</button>
        </div>

        {expeditions.length === 0 ? (
          <div className="exp-empty">
            <div className="exp-empty-icon">⟁</div>
            <div className="exp-empty-title">No expeditions yet</div>
            <div className="exp-empty-body">
              Chart a learning route from zero to mastery.<br />
              Build it manually stage by stage, or let AI chart the path.
            </div>
            <button className="primary" onClick={openCreate}>Create first expedition</button>
          </div>
        ) : (
          <div className="exp-list-grid">
            {expeditions.map(e => (
              <ExpCard key={e.id} exp={e} onSelect={openTrail} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Create view ─────────────────────────────────────────────────────────────

  if (view === 'create') {
    const validCount = stages.filter(s => s.title.trim()).length;
    return (
      <div className="exp-root">
        <div className="exp-create-header">
          <button className="exp-back-btn" onClick={() => setView('list')}>← EXPEDITIONS</button>
          <span className="exp-create-heading">NEW EXPEDITION</span>
        </div>

        <div className="exp-create-form">
          <div className="exp-field">
            <label className="exp-field-label">EXPEDITION NAME</label>
            <input
              className="exp-goal-in"
              placeholder="e.g. Understand quantum field theory · Learn to oil paint"
              value={goal}
              onChange={e => setGoal(e.target.value)}
            />
          </div>

          <div className="exp-field">
            <label className="exp-field-label">DOMAIN</label>
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
          </div>

          <div className="exp-field">
            <div className="exp-stages-head">
              <label className="exp-field-label">STAGES</label>
              <span className="exp-stages-hint">Name each checkpoint and set its difficulty</span>
            </div>
            <div className="exp-stages-list">
              {stages.map((s, i) => (
                <StageRow
                  key={s._key}
                  stage={s}
                  index={i}
                  onChange={upd => updateStage(i, upd)}
                  onRemove={() => removeStage(i)}
                  canRemove={stages.length > 1}
                />
              ))}
            </div>
            {stages.length < 12 && (
              <button className="exp-add-stage" onClick={addStage} type="button">
                + ADD STAGE
              </button>
            )}
          </div>

          <div className="exp-create-actions">
            <button
              className="primary"
              onClick={createManual}
              disabled={!goal.trim() || validCount === 0}
            >
              CREATE EXPEDITION
            </button>
            {state.groqKey && (
              <button
                className="exp-ai-btn"
                onClick={chartWithAI}
                disabled={busy || !goal.trim()}
              >
                {busy ? 'CHARTING…' : 'CHART WITH AI ↗'}
              </button>
            )}
          </div>
          {!state.groqKey && (
            <div className="exp-nokey">Add a Groq API key in Character → API Keys to enable AI route generation.</div>
          )}
        </div>
      </div>
    );
  }

  // ── Trail view ──────────────────────────────────────────────────────────────

  if (view === 'trail' && sel) {
    return (
      <div className="exp-root">
        <div className="exp-trail-header">
          <button className="exp-back-btn" onClick={() => setView('list')}>← EXPEDITIONS</button>
          <div className="exp-map-goal">{sel.goal}</div>
          <div className="exp-map-prog">
            <div className="exp-map-prog-track">
              <div className="exp-map-prog-fill" style={{ width: `${progress * 100}%`, '--dc': dc }} />
            </div>
            <span>{doneCount}/{sel.milestones.length}</span>
          </div>
          <button
            className="exp-map-del"
            onClick={() => { game.deleteExpedition(sel.id); setView('list'); setSelId(null); }}
          >delete</button>
        </div>

        {sel.completed && (
          <div className="exp-complete-banner" style={{ '--dc': dc }}>
            ◆ EXPEDITION COMPLETE — you reached the summit of "{sel.goal}"
          </div>
        )}

        <div className="exp-map" style={{ '--dc': dc }}>
          <div className="exp-trail">
            <div className="exp-spine">
              <div className="exp-spine-fill" style={{ height: `${progress * 100}%` }} />
            </div>
            {sel.milestones.map((m, i) => {
              const stState = m.done ? 'done' : i === currentIndex ? 'current' : 'locked';
              const diff = m.difficulty || 'medium';
              return (
                <div key={m.id} className={`exp-station ${stState} ${i % 2 ? 'right' : 'left'}`}>
                  <div className="exp-node">
                    <span className="exp-node-glyph">{m.done ? '✓' : stState === 'locked' ? '◌' : i + 1}</span>
                  </div>
                  <div className="exp-card">
                    <div className="exp-card-head">
                      <div className="exp-card-title">{m.title}</div>
                      <span
                        className="exp-diff-badge"
                        style={{ '--dc': DIFF_COLOR[diff] }}
                      >{diff.toUpperCase()}</span>
                    </div>
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
      </div>
    );
  }

  return null;
}
