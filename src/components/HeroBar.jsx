import { DOMAINS, DOMAIN_COLOR, ACHIEVEMENTS } from '../constants/index.js';
import { polymathScore, xpToLevel, todayStr } from '../utils/game.js';
import {
  calcMomentumScore,
  getMomentumTrend,
  hasComebackBonus,
  getMomentumMeta,
} from '../utils/momentum.js';

export default function HeroBar({ state }) {
  const totalXP = DOMAINS.reduce((s, d) => s + (state.xp?.[d] || 0), 0);
  const score   = polymathScore(state.xp);
  const peak    = DOMAINS.reduce((b, d) => (state.xp?.[d] || 0) > (state.xp?.[b] || 0) ? d : b, DOMAINS[0]);
  const peakLv  = xpToLevel(state.xp?.[peak] || 0);

  const momentum = calcMomentumScore(state.thoughts, state.taskBoard, state.sessions);
  const trend    = getMomentumTrend(state.thoughts, state.taskBoard, state.sessions);
  const comeback = hasComebackBonus(state.thoughts, state.taskBoard, state.sessions);
  const momMeta  = getMomentumMeta(momentum, trend, comeback);

  return (
    <div className="hero-bar">
      {/* Polymath Score */}
      <div className="hero-stat" style={{ '--glow': 'rgba(0,217,177,0.12)' }}>
        <div className="hero-stat-label">Polymath Score</div>
        <div className="hero-stat-value" style={{ '--c1': '#00d9b1', '--c2': '#60a5fa' }}>
          {score.toLocaleString()}
        </div>
        <div className="hero-stat-sub">breadth × depth composite</div>
      </div>

      {/* Momentum Score */}
      <div
        className="hero-stat"
        style={{
          '--glow': momMeta.glow,
          borderColor: comeback ? momMeta.color + '55' : undefined,
          boxShadow: comeback ? `0 0 20px ${momMeta.glow}` : undefined,
        }}
      >
        <div className="hero-stat-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          Momentum
          {comeback && (
            <span style={{
              fontSize: 8, fontWeight: 700, letterSpacing: '0.1em',
              background: `${momMeta.color}22`,
              border: `1px solid ${momMeta.color}44`,
              borderRadius: 4, padding: '1px 5px', color: momMeta.color,
            }}>
              COMEBACK
            </span>
          )}
        </div>
        <div className="hero-stat-value momentum-value" style={{ '--c1': momMeta.c1, '--c2': momMeta.c2 }}>
          {momentum}
          <span style={{
            fontSize: 18, fontFamily: 'var(--mono)', marginLeft: 4,
            color: momMeta.trendColor,
            WebkitTextFillColor: momMeta.trendColor,
          }}>
            {momMeta.trendIcon}
          </span>
        </div>
        <div className="hero-stat-sub" style={{ color: comeback ? momMeta.color : undefined }}>
          {momMeta.sub}
        </div>
      </div>

      {/* Total XP */}
      <div className="hero-stat" style={{ '--glow': 'rgba(139,92,246,0.1)' }}>
        <div className="hero-stat-label">Total XP</div>
        <div className="hero-stat-value" style={{ '--c1': '#a78bfa', '--c2': '#f472b6' }}>
          {totalXP.toLocaleString()}
        </div>
        <div className="hero-stat-sub">{state.achievements.length}/{ACHIEVEMENTS.length} achievements</div>
      </div>

      {/* Peak Domain */}
      <div className="hero-stat" style={{ '--glow': 'rgba(96,165,250,0.1)' }}>
        <div className="hero-stat-label">Peak Domain</div>
        <div className="hero-stat-value" style={{ '--c1': DOMAIN_COLOR[peak] || 'var(--accent)', '--c2': '#e8e8f0' }}>
          Lv.{peakLv}
        </div>
        <div className="hero-stat-sub">{peak} · {state.xp?.[peak] || 0} XP</div>
      </div>
    </div>
  );
}
