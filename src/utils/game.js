import { DOMAINS, XP_PER_LEVEL, QUEST_POOL, ACHIEVEMENTS, WEEKLY_QUEST_POOL } from '../constants/index.js';

export function xpToLevel(xp)  { return Math.floor((xp || 0) / XP_PER_LEVEL) + 1; }
export function xpInLevel(xp)  { return (xp || 0) % XP_PER_LEVEL; }

export function polymathScore(xp) {
  const breadth = DOMAINS.filter(d => (xp?.[d] || 0) > 0).length;
  const raw = DOMAINS.reduce((s, d) => s + Math.sqrt(xp?.[d] || 0), 0);
  const mult = breadth >= 6 ? 1.6 : breadth >= 4 ? 1.3 : breadth >= 2 ? 1.1 : 1;
  return Math.round(raw * mult * 8);
}

export function todayStr() { return new Date().toISOString().split('T')[0]; }

export function seededPick(pool, n, seed) {
  const arr = [...pool];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.abs(Math.floor(Math.sin(seed + i * 73) * 10000)) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, n);
}

export function makeDailyQuests(dateStr) {
  const seed = dateStr.split('-').reduce((a, v, i) => a + parseInt(v) * (i + 1) * 37, 0);
  return seededPick(QUEST_POOL, 3, seed).map(q => ({ ...q, progress: 0, completed: false }));
}

export function refreshQuests(quests) {
  const today = todayStr();
  if (quests.date === today) return quests;
  return { date: today, list: makeDailyQuests(today) };
}

export function updateStreak(streak) {
  const today = todayStr();
  if (streak.lastDate === today) return streak;
  const yday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  return streak.lastDate === yday
    ? { count: streak.count + 1, lastDate: today }
    : { count: 1, lastDate: today };
}

export function advanceQuests(list, type, val = 1) {
  return list.map(q => {
    if (q.completed || q.type !== type) return q;
    const np = type === 'domains' ? val : Math.min(q.goal, q.progress + val);
    return { ...q, progress: np, completed: np >= q.goal };
  });
}

export function questBonusXP(newList, oldList) {
  let b = 0;
  newList.forEach((q, i) => { if (q.completed && !oldList[i]?.completed) b += q.xpReward; });
  return b;
}

export function findNewAchs(state, prevIds) {
  return ACHIEVEMENTS.filter(a => !prevIds.includes(a.id) && a.check(state));
}

export function getHabitStreak(dates) {
  if (!dates?.length) return 0;
  const s = new Set(dates);
  const today = todayStr();
  const yest  = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  let cur = s.has(today) ? today : s.has(yest) ? yest : null;
  if (!cur) return 0;
  let count = 0;
  while (s.has(cur)) {
    count++;
    cur = new Date(new Date(cur + 'T12:00:00Z').getTime() - 86400000).toISOString().split('T')[0];
  }
  return count;
}

export function fmt(s) {
  return `${Math.floor(s / 60).toString().padStart(2,'0')}:${Math.floor(s % 60).toString().padStart(2,'0')}`;
}

export function getISOWeekStr() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const w = new Date(d.getFullYear(), 0, 4);
  const wn = 1 + Math.round(((d.getTime() - w.getTime()) / 86400000 - 3 + (w.getDay() + 6) % 7) / 7);
  return `${d.getFullYear()}-W${String(wn).padStart(2, '0')}`;
}

export function refreshWeeklyQuest(wq) {
  const weekStr = getISOWeekStr();
  if (wq?.weekStr === weekStr) return wq;
  const [yr, wk] = weekStr.replace('W', '').split('-').map(Number);
  const seed = (yr * 53 + wk * 7);
  const picked = WEEKLY_QUEST_POOL[Math.abs(seed) % WEEKLY_QUEST_POOL.length];
  return { ...picked, weekStr, progress: 0, completed: false };
}

export function advanceWeeklyQuest(wq, type, val = 1) {
  if (!wq || wq.completed || wq.type !== type) return wq;
  const np = Math.min(wq.goal, wq.progress + val);
  return { ...wq, progress: np, completed: np >= wq.goal };
}

export function pickChaosTask(taskBoard, thoughts, energyLevel) {
  const boardTasks = (taskBoard || []).filter(t => !t.done);
  const thoughtTasks = (thoughts || []).filter(t => t.type === 'task' && !t.done);
  const all = [...boardTasks, ...thoughtTasks];
  if (all.length === 0) return null;

  const tierScore  = { common: 1, rare: 2, epic: 3 };
  const priScore   = { low: 1, medium: 2, high: 3 };

  if (energyLevel <= 2) {
    return all.sort((a, b) =>
      (tierScore[a.tier] || 1) - (tierScore[b.tier] || 1) ||
      (priScore[a.priority] || 1) - (priScore[b.priority] || 1)
    )[0];
  } else if (energyLevel >= 4) {
    return all.sort((a, b) =>
      (tierScore[b.tier] || 1) - (tierScore[a.tier] || 1) ||
      (priScore[b.priority] || 1) - (priScore[a.priority] || 1)
    )[0];
  } else {
    const medium = all.filter(t => t.priority === 'medium' || t.tier === 'rare');
    return medium.length > 0 ? medium[0] : all[0];
  }
}
