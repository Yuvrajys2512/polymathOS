import { todayStr } from '../../utils/game.js';

export default function QuestsPanel({ quests }) {
  const done = quests.list.filter(q => q.completed).length;
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Daily Quests</h2>
        <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span className="quest-date">{done}/{quests.list.length}</span>
          <span className="badge">{todayStr()}</span>
        </span>
      </div>
      <div className="quest-list">
        {quests.list.length === 0 && (
          <div className="empty" style={{ padding: '16px 12px' }}>Loading quests…</div>
        )}
        {quests.list.map(q => (
          <div key={q.id} className={`quest-card${q.completed ? ' done' : ''}`}>
            <div className="quest-top">
              <span className="quest-title">{q.title}</span>
              <span className="quest-xp">+{q.xpReward} XP</span>
            </div>
            <div className="quest-desc">{q.desc}</div>
            {q.completed ? (
              <div className="quest-done-txt">✓ Complete!</div>
            ) : (
              <>
                <div className="quest-prog-track">
                  <div className="quest-prog-fill" style={{ width: `${Math.min(100, (q.progress / q.goal) * 100)}%` }} />
                </div>
                <div className="quest-prog-label">{q.progress} / {q.goal}</div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
