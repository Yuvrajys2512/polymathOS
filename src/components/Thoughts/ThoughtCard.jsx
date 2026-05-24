import { useState } from 'react';
import { DOMAIN_COLOR, TYPE_ICON } from '../../constants/index.js';

function getAgeDays(createdAt) {
  if (!createdAt) return 0;
  return Math.floor((Date.now() - new Date(createdAt).getTime()) / 86400000);
}

export default function ThoughtCard({ thought, updateThought, deleteThought }) {
  const [editing, setEditing] = useState(false);
  const [text, setText]       = useState(thought.text);
  const color = DOMAIN_COLOR[thought.domain] || 'var(--accent)';

  const ageDays = thought.done ? 0 : getAgeDays(thought.createdAt);
  const ageClass = ageDays >= 7 ? ' aged-critical' : ageDays >= 3 ? ' aged-warn' : '';

  return (
    <article className={`thought${thought.done ? ' done' : ''}${ageClass}`} style={{ '--dc': color }}>
      <div className="thought-top">
        <div className="meta">
          <span className="type-icon" style={{ color, opacity: 0.8 }}>
            {TYPE_ICON[thought.type] || '·'}
          </span>
          <span className="pill dom" style={{ '--dc': color }}>{thought.domain}</span>
          <span className="pill typ">{thought.type}</span>
          <span className={`pill ${thought.priority}`}>{thought.priority}</span>
          {thought.status === 'pending' && <span className="pill pending">classifying…</span>}
          {ageDays >= 7 && <span className="pill aged-pill critical">{ageDays}d old</span>}
          {ageDays >= 3 && ageDays < 7 && <span className="pill aged-pill warn">{ageDays}d old</span>}
        </div>
        <div className="thought-actions">
          {thought.type === 'task' && (
            <button
              className="icon"
              title={thought.done ? 'Restore' : 'Mark done'}
              style={{ color: thought.done ? 'var(--muted)' : 'var(--accent)' }}
              onClick={e => updateThought(thought.id, { done: !thought.done, completedAt: !thought.done ? new Date().toISOString() : null }, !thought.done ? e : null)}
            >
              {thought.done ? '↶' : '✓'}
            </button>
          )}
          <button className="icon ghost" title="Edit" onClick={() => setEditing(!editing)}>✎</button>
          <button className="icon danger" title="Delete" onClick={() => deleteThought(thought.id)}>×</button>
        </div>
      </div>

      {editing ? (
        <div className="edit-box">
          <textarea value={text} onChange={e => setText(e.target.value)} />
          <button className="primary" onClick={() => { updateThought(thought.id, { text }); setEditing(false); }}>
            Save
          </button>
        </div>
      ) : (
        <p className="thought-text">{thought.text}</p>
      )}

      <div className="meta">
        <span className="pill" style={{ opacity: 0.65, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {thought.insight}
        </span>
        {(thought.tags || []).map(tag => <span className="pill" key={tag}>#{tag}</span>)}
        <span className="pill" style={{ marginLeft: 'auto', fontSize: 9, opacity: 0.55 }}>
          {new Date(thought.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </article>
  );
}
