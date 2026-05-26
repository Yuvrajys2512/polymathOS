import { useState } from 'react';
import { DOMAIN_COLOR } from '../../constants/index.js';
import { localGenerateQuestline, generateQuestlineWithClaude } from '../../utils/questGen.js';

export default function QuestGenerator({ questlines, groqKey, onGenerate, onCompleteQuest, onDeleteQuestline, intention = '' }) {
  const [goal, setGoal]       = useState('');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(null);

  async function handleGenerate() {
    if (!goal.trim() || loading) return;
    setLoading(true);
    try {
      let result;
      if (groqKey) {
        result = await generateQuestlineWithClaude(goal.trim(), groqKey);
      } else {
        result = localGenerateQuestline(goal.trim());
      }
      onGenerate({ goal: goal.trim(), ...result });
      setGoal('');
    } catch {
      const fallback = localGenerateQuestline(goal.trim());
      onGenerate({ goal: goal.trim(), ...fallback });
      setGoal('');
    } finally {
      setLoading(false);
    }
  }

  const activeLines = questlines.filter(ql => !ql.completed);
  const doneLines   = questlines.filter(ql => ql.completed);

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Quest Generator</h2>
        <span className="badge" style={{ background: 'rgba(139,92,246,0.18)', color: '#a78bfa', borderColor: 'rgba(139,92,246,0.3)' }}>
          AI
        </span>
      </div>

      {intention && !goal && (
        <button className="qgen-intent-fill" onClick={() => setGoal(intention)}>
          ✦ Use today's intention: "{intention.length > 40 ? intention.slice(0, 38) + '…' : intention}"
        </button>
      )}
      <div className="qgen-input-row">
        <input
          value={goal}
          onChange={e => setGoal(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleGenerate()}
          placeholder="Enter a goal… (e.g. learn machine learning)"
          disabled={loading}
        />
        <button
          className="primary"
          onClick={handleGenerate}
          disabled={!goal.trim() || loading}
          style={{ minWidth: 110, fontSize: 12 }}
        >
          {loading ? (
            <span className="qgen-loading">
              <span className="qgen-dot" /><span className="qgen-dot" /><span className="qgen-dot" />
            </span>
          ) : (
            groqKey ? '✦ Generate' : '⚒ Build'
          )}
        </button>
      </div>
      {!groqKey && (
        <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>
          No API key — using local quest templates.
        </p>
      )}

      {questlines.length === 0 && (
        <div className="empty" style={{ padding: '20px 0 8px' }}>
          Set a goal above — AI will craft a questline to get you there.
        </div>
      )}

      <div className="questline-list">
        {activeLines.map(ql => (
          <QuestlineCard
            key={ql.id}
            ql={ql}
            expanded={expanded === ql.id}
            onToggle={() => setExpanded(expanded === ql.id ? null : ql.id)}
            onCompleteQuest={onCompleteQuest}
            onDelete={onDeleteQuestline}
          />
        ))}

        {doneLines.length > 0 && (
          <div className="questline-done-section">
            <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>
              ✓ {doneLines.length} completed questline{doneLines.length > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

function QuestlineCard({ ql, expanded, onToggle, onCompleteQuest, onDelete }) {
  const color  = DOMAIN_COLOR[ql.domain] || '#00d9b1';
  const total  = ql.quests.length;
  const done   = ql.quests.filter(q => q.done).length;
  const pct    = total > 0 ? (done / total) * 100 : 0;
  const nextQ  = ql.quests.find(q => !q.done);
  const totalXp = ql.quests.reduce((s, q) => s + q.xpReward, 0);

  return (
    <div className={`questline-card${ql.completed ? ' ql-done' : ''}`} style={{ '--ql-color': color }}>
      <div className="questline-header" onClick={onToggle}>
        <div className="questline-left">
          <span className="ql-domain-dot" style={{ background: color, boxShadow: `0 0 8px ${color}55` }} />
          <div>
            <div className="ql-goal">{ql.goal}</div>
            <div className="ql-meta">
              <span className="ql-domain">{ql.domain}</span>
              <span className="ql-xp-total">◆ {totalXp} XP total</span>
            </div>
          </div>
        </div>
        <div className="questline-right">
          <span className="ql-progress-label">{done}/{total}</span>
          <span className="ql-chevron">{expanded ? '▾' : '▸'}</span>
        </div>
      </div>

      <div className="ql-prog-track">
        <div className="ql-prog-fill" style={{ width: `${pct}%`, background: color, boxShadow: `0 0 8px ${color}66` }} />
      </div>

      {!expanded && nextQ && !ql.completed && (
        <div className="ql-next-hint">
          <span className="ql-next-phase">{nextQ.phase}</span>
          <span className="ql-next-title">→ {nextQ.title}</span>
        </div>
      )}

      {expanded && (
        <div className="ql-quests">
          {ql.quests.map((q, i) => (
            <div key={q.id} className={`ql-quest-item${q.done ? ' done' : ''}${i === ql.quests.findIndex(x => !x.done) ? ' active' : ''}`}>
              <div className="ql-quest-left">
                <span className="ql-quest-check" onClick={e => !q.done && onCompleteQuest(ql.id, q.id, e)}>
                  {q.done ? '✓' : '○'}
                </span>
                <div>
                  <div className="ql-quest-phase">{q.phase}</div>
                  <div className="ql-quest-title">{q.title}</div>
                  <div className="ql-quest-desc">{q.desc}</div>
                </div>
              </div>
              <span className="ql-quest-xp">+{q.xpReward}</span>
            </div>
          ))}
          <div className="ql-card-footer">
            <button className="ghost" style={{ fontSize: 11, color: 'var(--muted)', padding: '4px 8px' }} onClick={() => onDelete(ql.id)}>
              ✕ Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
