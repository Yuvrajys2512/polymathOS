import { todayStr } from './game.js';

function dayScore(thoughts, taskBoard, sessions, day) {
  const captures  = thoughts.filter(t => t.createdAt?.startsWith(day)).length;
  const completed = (taskBoard  || []).filter(t => t.completedAt?.startsWith(day)).length;
  const focused   = (sessions   || []).filter(s => s.at?.startsWith(day)).length;
  return Math.min(1, captures * 0.08 + completed * 0.22 + focused * 0.32);
}

function hasActivityOnDay(thoughts, taskBoard, sessions, day) {
  return dayScore(thoughts, taskBoard, sessions, day) > 0;
}

export function calcMomentumScore(thoughts, taskBoard, sessions) {
  let score = 0, total = 0;
  for (let i = 0; i < 7; i++) {
    const day = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
    const w = 1 - i * 0.09;
    total += w;
    score += dayScore(thoughts, taskBoard, sessions, day) * w;
  }
  return Math.round((score / total) * 100);
}

export function getMomentumTrend(thoughts, taskBoard, sessions) {
  let recent = 0, prior = 0;
  for (let i = 0; i < 3; i++) {
    recent += dayScore(thoughts, taskBoard, sessions,
      new Date(Date.now() - i * 86400000).toISOString().split('T')[0]);
  }
  for (let i = 3; i < 6; i++) {
    prior += dayScore(thoughts, taskBoard, sessions,
      new Date(Date.now() - i * 86400000).toISOString().split('T')[0]);
  }
  if (recent > prior + 0.25) return 'rising';
  if (recent < prior - 0.25) return 'falling';
  return 'stable';
}

export function hasComebackBonus(thoughts, taskBoard, sessions) {
  const today     = todayStr();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const d2ago     = new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0];
  return (
    hasActivityOnDay(thoughts, taskBoard, sessions, today) &&
    !hasActivityOnDay(thoughts, taskBoard, sessions, yesterday) &&
    !hasActivityOnDay(thoughts, taskBoard, sessions, d2ago)
  );
}

export function getMomentumMeta(score, trend, comeback) {
  const colors = {
    high:   { color: '#4ade80', glow: 'rgba(74,222,128,0.25)',  c1: '#4ade80', c2: '#22d3ee' },
    mid:    { color: '#fbbf24', glow: 'rgba(251,191,36,0.25)',  c1: '#fbbf24', c2: '#fb923c' },
    low:    { color: '#f87171', glow: 'rgba(248,113,113,0.2)',  c1: '#f87171', c2: '#f43f5e' },
  };
  const band = score >= 60 ? 'high' : score >= 30 ? 'mid' : 'low';
  const trendIcon  = { rising:'↑', stable:'→', falling:'↓' }[trend];
  const trendColor = { rising:'#4ade80', stable:'var(--muted)', falling:'#f87171' }[trend];
  const sub = comeback
    ? '🔥 Comeback bonus active!'
    : trend === 'rising'
    ? '↑ Gaining momentum'
    : trend === 'falling'
    ? '↓ Keep going — don\'t stop'
    : `${score}% over 7 days`;
  return { ...colors[band], trendIcon, trendColor, sub };
}
