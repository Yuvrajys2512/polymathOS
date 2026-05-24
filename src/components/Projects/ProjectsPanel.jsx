import { useState } from 'react';

export default function ProjectsPanel({ projects, onAdd, onUpdateProgress, sessions }) {
  const [projName, setProjName] = useState('');

  return (
    <>
      <section className="panel">
        <div className="panel-head">
          <h2>Projects</h2>
          <span className="badge">{projects.length}</span>
        </div>
        {projects.map(proj => (
          <div className="project" key={proj.id}>
            <div className="project-row">
              <strong>{proj.name}</strong>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--accent)' }}>{proj.progress}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${proj.progress}%` }} />
            </div>
            <input type="range" min="0" max="100" value={proj.progress}
              onChange={e => onUpdateProgress(proj.id, Number(e.target.value))} />
          </div>
        ))}
        <div className="mini-form">
          <input value={projName} onChange={e => setProjName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && projName.trim()) { onAdd(projName.trim()); setProjName(''); } }}
            placeholder="Add project…" />
          <button onClick={() => { if (!projName.trim()) return; onAdd(projName.trim()); setProjName(''); }}>Add</button>
        </div>
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Session Log</h2>
          <span className="badge">{sessions.length}</span>
        </div>
        <div className="session-log">
          {sessions.length === 0 ? (
            <div className="empty" style={{ padding: '16px 12px' }}>Finished focus sessions appear here.</div>
          ) : sessions.map(s => (
            <div className="session-item" key={s.id}>
              <strong>{s.domain} · {s.minutes}m {s.identityMode ? `· ${s.identityMode}` : ''}</strong>
              <div>{new Date(s.at).toLocaleString()} · {s.captured} captured · +{s.xpEarned || 15} XP</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
