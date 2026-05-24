import { CHAR_STATS } from '../../constants/index.js';
import { polymathScore, xpToLevel } from '../../utils/game.js';

export default function CharacterSheet({ xp }) {
  const score = polymathScore(xp);
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Character Sheet</h2>
        <span className="badge">RPG</span>
      </div>
      <div className="char-stats">
        {CHAR_STATS.map(stat => {
          const lvls = stat.domains.map(d => xpToLevel(xp?.[d] || 0));
          const avgLv = Math.round((lvls[0] + lvls[1]) / 2);
          const pct   = Math.min(100, (avgLv / 10) * 100);
          return (
            <div className="char-row" key={stat.key}>
              <div className="char-key" style={{ '--c': stat.color }}>{stat.key}</div>
              <div>
                <div className="char-label">{stat.label}</div>
                <div className="char-domains">{stat.domains.join(' · ')}</div>
                <div className="char-bar-track">
                  <div className="char-bar-fill"
                    style={{ width: `${pct}%`, background: stat.color, boxShadow: `0 0 8px ${stat.color}` }} />
                </div>
              </div>
              <div className="char-level" style={{ color: stat.color }}>{avgLv}</div>
            </div>
          );
        })}
      </div>
      <div className="ps-line">
        <span>Polymath Score</span>
        <span>{score.toLocaleString()}</span>
      </div>
    </section>
  );
}
