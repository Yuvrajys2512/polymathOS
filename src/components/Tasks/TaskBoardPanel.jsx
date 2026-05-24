import { useState } from 'react';
import { DOMAINS, TIER_XP } from '../../constants/index.js';
import { todayStr } from '../../utils/game.js';

export default function TaskBoardPanel({ tasks, onAdd, onComplete, onDelete }) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle]   = useState('');
  const [tier, setTier]     = useState('common');
  const [domain, setDomain] = useState('Life');

  const active    = tasks.filter(t => !t.done);
  const doneToday = tasks.filter(t => t.done && t.completedAt?.startsWith(todayStr())).length;

  function handleAdd() {
    if (!title.trim()) return;
    onAdd(title.trim(), tier, domain);
    setTitle(''); setAdding(false); setTier('common');
  }

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Quest Board</h2>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {doneToday > 0 && (
            <span className="badge" style={{ color: 'var(--accent)', borderColor: 'rgba(0,217,177,0.3)' }}>
              {doneToday} done
            </span>
          )}
          <button className="icon ghost" style={{ color: 'var(--accent)', fontSize: 18 }}
            onClick={() => setAdding(!adding)} title="Add quest">
            {adding ? '×' : '+'}
          </button>
        </div>
      </div>

      {adding && (
        <div className="task-add-form">
          <input value={title} onChange={e => setTitle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="Quest title…" autoFocus />
          <div className="tier-chips">
            {['common','rare','epic'].map(t => (
              <button key={t} className={`tier-chip ${t}${tier === t ? ' active' : ''}`} onClick={() => setTier(t)}>
                {t} +{TIER_XP[t]}xp
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <select value={domain} onChange={e => setDomain(e.target.value)} style={{ fontSize: 12 }}>
              {DOMAINS.map(d => <option key={d}>{d}</option>)}
            </select>
            <button className="primary" style={{ whiteSpace: 'nowrap', padding: '9px 16px' }} onClick={handleAdd}>Add →</button>
          </div>
        </div>
      )}

      <div className="taskboard-list">
        {active.length === 0 && !adding && (
          <div className="empty" style={{ padding: '14px 12px' }}>No active quests.<br />Hit + to add one.</div>
        )}
        {active.map(t => (
          <div key={t.id} className={`task-card ${t.tier}`}>
            <div className="task-card-top">
              <div className="task-left">
                <span className={`tier-badge ${t.tier}`}>{t.tier}</span>
                <span className="task-title">{t.title}</span>
              </div>
              <div className="task-actions">
                <span className={`tier-xp ${t.tier}`} style={{ fontFamily: 'var(--mono)', fontSize: 10, marginRight: 2 }}>
                  +{TIER_XP[t.tier]}
                </span>
                <button className="icon" style={{ color: 'var(--accent)' }} title="Complete"
                  onClick={e => onComplete(t.id, e)}>✓</button>
                <button className="icon danger" title="Delete" onClick={() => onDelete(t.id)}>×</button>
              </div>
            </div>
            <div className="task-meta">{t.domain}</div>
          </div>
        ))}
        {tasks.filter(t => t.done).slice(0, 3).map(t => (
          <div key={t.id} className={`task-card ${t.tier} done`}>
            <div className="task-card-top">
              <div className="task-left">
                <span className={`tier-badge ${t.tier}`}>{t.tier}</span>
                <span className="task-title">{t.title}</span>
              </div>
              <button className="icon danger" title="Remove" onClick={() => onDelete(t.id)}>×</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
