import { ACHIEVEMENTS } from '../../constants/index.js';

export default function AchievementsPanel({ unlockedIds }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Achievements</h2>
        <span className="badge">{unlockedIds.length}/{ACHIEVEMENTS.length}</span>
      </div>
      <div className="ach-grid">
        {ACHIEVEMENTS.map(a => (
          <div key={a.id} className={`ach-badge${unlockedIds.includes(a.id) ? ' unlocked' : ' locked'}`}>
            <span className="ach-icon">{a.icon}</span>
            <span className="ach-title">{a.title}</span>
            <div className="ach-tip">{a.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
