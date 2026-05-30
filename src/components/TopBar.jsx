import { DOMAINS } from '../constants/index.js';
import { xpToLevel, polymathScore } from '../utils/game.js';
import { calcMomentumScore, getMomentumTrend, getMomentumMeta } from '../utils/momentum.js';

export default function TopBar({ state, onChaos, onTutorial }) {
  const totalXp   = DOMAINS.reduce((s, d) => s + (state.xp?.[d] || 0), 0);
  const maxLevel  = Math.max(...DOMAINS.map(d => xpToLevel(state.xp?.[d] || 0)));
  const score     = polymathScore(state.xp);
  const momentum  = calcMomentumScore(state.thoughts, state.taskBoard, state.sessions);
  const trend     = getMomentumTrend(state.thoughts, state.taskBoard, state.sessions);
  const momMeta   = getMomentumMeta(momentum, trend, false);

  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-logo">Polymath OS</div>
        <div className="brand-sub">capture first · level up · embrace the chaos</div>
      </div>

      <div className="topbar-stats">
        <div className="stat-pill">
          <span className="stat-pill-label">XP</span>
          <span className="stat-pill-value">{totalXp.toLocaleString()}</span>
        </div>
        <div className="stat-pill">
          <span className="stat-pill-label">LEVEL</span>
          <span className="stat-pill-value">{maxLevel}</span>
        </div>
        <div className="stat-pill">
          <span className="stat-pill-label">SCORE</span>
          <span className="stat-pill-value">{score.toLocaleString()}</span>
        </div>
        <div className="stat-pill momentum-pill" style={{ '--mom-color': momMeta.color }}>
          <span className="stat-pill-label">MOMENTUM</span>
          <span className="stat-pill-value momentum-val">
            {momentum}%
            <span className="momentum-trend" style={{ color: momMeta.trendColor }}>
              {momMeta.trendIcon}
            </span>
          </span>
        </div>
      </div>

      <div className="topbar-actions">
        <button className="tut-trigger" onClick={onTutorial}>Tutorial</button>
        <button className="chaos-trigger" onClick={onChaos}>
          ⚡ Overwhelmed
        </button>
      </div>
    </header>
  );
}
