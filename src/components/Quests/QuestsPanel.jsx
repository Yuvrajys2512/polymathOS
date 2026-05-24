import { todayStr } from '../../utils/game.js';

export default function QuestsPanel({ quests, weeklyQuest, dailyComboStreak }) {
  const done = quests.list.filter(q => q.completed).length;
  const allDone = done === quests.list.length && quests.list.length > 0;
  const todayCombo = dailyComboStreak?.lastComboDate === todayStr();
  const comboCount = dailyComboStreak?.count || 0;

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

      {/* Daily combo badge */}
      {allDone && (
        <div className="daily-combo">
          <span className="daily-combo-icon">◆</span>
          <span className="daily-combo-text">
            {todayCombo ? 'All quests complete' : 'Daily sweep'} · +75 XP bonus
          </span>
          {comboCount > 0 && (
            <span className="daily-combo-streak">{comboCount}x</span>
          )}
        </div>
      )}
      {!allDone && comboCount > 0 && (
        <div className="daily-combo-hint">
          <span style={{ color: 'rgba(251,191,36,0.5)', fontSize: 10, fontFamily: 'var(--mono)' }}>
            ◆ {comboCount}d streak — complete all 3 for bonus
          </span>
        </div>
      )}

      {/* Weekly quest */}
      {weeklyQuest && (
        <div className={`weekly-quest${weeklyQuest.completed ? ' wq-done' : ''}`}>
          <div className="weekly-quest-head">
            <span className="weekly-quest-label">WEEKLY CAMPAIGN</span>
            <span className="weekly-quest-xp">
              {weeklyQuest.completed ? '✓ Done' : `+${weeklyQuest.xpReward} XP`}
            </span>
          </div>
          <div className="weekly-quest-title">{weeklyQuest.title}</div>
          <div className="weekly-quest-desc">{weeklyQuest.desc}</div>
          <div className="weekly-quest-bar">
            <div
              className="weekly-quest-fill"
              style={{ width: `${Math.min(100, (weeklyQuest.progress / weeklyQuest.goal) * 100)}%` }}
            />
          </div>
          <div className="weekly-quest-prog">{weeklyQuest.progress} / {weeklyQuest.goal}</div>
        </div>
      )}
    </section>
  );
}
