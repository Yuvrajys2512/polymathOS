import { useState, useMemo, useRef, useEffect } from 'react';
import { DOMAINS, STORAGE_KEY, STORAGE_V1, DEFAULT_HABITS, TIER_XP } from '../constants/index.js';
import {
  todayStr, refreshQuests, updateStreak, advanceQuests, questBonusXP,
  findNewAchs, xpToLevel,
} from '../utils/game.js';
import { classifyWithClaude, localClassify } from '../utils/classify.js';

const SEED = {
  thoughts: [],
  projects: [
    { id: crypto.randomUUID(), name: 'Build POLYMATH OS', progress: 20 },
    { id: crypto.randomUUID(), name: 'Define active research threads', progress: 10 },
  ],
  intention: '', intentionHistory: [], sessions: [], apiKey: '',
  pomodoro: { focusMinutes: 25, breakMinutes: 5 },
  xp: Object.fromEntries(DOMAINS.map(d => [d, 0])),
  streak: { count: 0, lastDate: null },
  achievements: [],
  quests: { date: null, list: [] },
  taskBoard: [],
  habits: DEFAULT_HABITS,
  energyLog: [],
  questlines: [],
  bosses: [],
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      return {
        ...SEED, ...s,
        xp: { ...SEED.xp, ...s.xp },
        taskBoard: s.taskBoard || [],
        habits: s.habits || DEFAULT_HABITS,
        energyLog: s.energyLog || [],
        questlines: s.questlines || [],
        bosses: s.bosses || [],
      };
    }
    const old = JSON.parse(localStorage.getItem(STORAGE_V1) || 'null');
    if (!old) return SEED;
    const base = { ...SEED, ...old };
    const xp = Object.fromEntries(DOMAINS.map(d => [d, 0]));
    old.thoughts?.forEach(t => { if (DOMAINS.includes(t.domain)) xp[t.domain] += (t.done ? 35 : 10); });
    old.sessions?.forEach(s => { if (DOMAINS.includes(s.domain)) xp[s.domain] += 15; });
    base.xp = xp;
    return base;
  } catch { return SEED; }
}

export function useGameState() {
  const [state, setState] = useState(loadState);
  const [toasts, setToasts] = useState([]);
  const [floats, setFloats] = useState([]);
  const pendingAchs = useRef([]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    setState(p => {
      const fq = refreshQuests(p.quests);
      return fq === p.quests ? p : { ...p, quests: fq };
    });
  }, []);

  useEffect(() => {
    if (pendingAchs.current.length === 0) return;
    const next = pendingAchs.current.map(a => ({ ...a, tid: crypto.randomUUID() }));
    pendingAchs.current = [];
    setToasts(p => [...p, ...next].slice(-3));
  }, [state.achievements]);

  useEffect(() => {
    if (toasts.length === 0) return;
    const id = setTimeout(() => setToasts(p => p.slice(1)), 4500);
    return () => clearTimeout(id);
  }, [toasts]);

  useEffect(() => {
    if (floats.length === 0) return;
    const id = setTimeout(() => setFloats(p => p.slice(1)), 1600);
    return () => clearTimeout(id);
  }, [floats]);

  function spawnFloat(amt, e) {
    if (!e?.currentTarget) return;
    const r = e.currentTarget.getBoundingClientRect();
    setFloats(p => [...p, { id: crypto.randomUUID(), amt, x: r.left + r.width / 2 - 20, y: r.top - 10 }].slice(-8));
  }

  function spawnBurst(amt, e, count = 1) {
    if (!e?.currentTarget) return;
    const r = e.currentTarget.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top;
    const items = Array.from({ length: count }, (_, i) => ({
      id: crypto.randomUUID(),
      amt: i === 0 ? amt : Math.ceil(amt * 0.4),
      x: cx + (Math.random() - 0.5) * 80 - 20,
      y: cy + (Math.random() - 0.5) * 30 - 10,
    }));
    setFloats(p => [...p, ...items].slice(-10));
  }

  function applyGame(p, domain, questType, xpAmt) {
    const prevAchs = p.achievements;
    const fq = refreshQuests(p.quests);
    const newStreak = updateStreak(p.streak);
    const ql = advanceQuests(fq.list, questType);
    const bonus = questBonusXP(ql, fq.list);
    const newXp = {
      ...p.xp,
      [domain]: (p.xp[domain] || 0) + xpAmt,
      ...(bonus > 0 ? { Life: (p.xp['Life'] || 0) + bonus } : {}),
    };
    const ns = { ...p, xp: newXp, streak: newStreak, quests: { ...fq, list: ql } };
    const newA = findNewAchs(ns, prevAchs);
    if (newA.length > 0) pendingAchs.current.push(...newA);
    return { ...ns, achievements: [...prevAchs, ...newA.map(a => a.id)] };
  }

  const domains = useMemo(() => {
    const c = Object.fromEntries(DOMAINS.map(d => [d, 0]));
    state.thoughts.forEach(t => { c[t.domain] = (c[t.domain] || 0) + 1; });
    return DOMAINS.map(name => ({ name, count: c[name] || 0 }));
  }, [state.thoughts]);

  async function submitThought(text, apiKey) {
    if (!text.trim()) return;
    const id = crypto.randomUUID(), now = new Date().toISOString();
    const pending = { id, text, domain: 'Sorting', type: 'note', insight: 'Classifying…', priority: 'medium', tags: [], status: 'pending', done: false, createdAt: now };
    setState(p => {
      const fq = refreshQuests(p.quests);
      const ns = updateStreak(p.streak);
      const ql = advanceQuests(fq.list, 'capture');
      return { ...p, thoughts: [pending, ...p.thoughts], streak: ns, quests: { ...fq, list: ql } };
    });
    try {
      const result = await classifyWithClaude(text, apiKey);
      setState(p => {
        const today = todayStr();
        const newT = p.thoughts.map(t => t.id === id ? { ...t, ...result, status: 'ready' } : t);
        const uDoms = new Set(newT.filter(t => t.createdAt?.startsWith(today) && DOMAINS.includes(t.domain)).map(t => t.domain)).size;
        const prevAchs = p.achievements;
        let ql = advanceQuests(p.quests.list, 'domains', uDoms);
        if (result.type === 'insight') ql = advanceQuests(ql, 'insight');
        const bonus = questBonusXP(ql, p.quests.list);
        const d = result.domain;
        const newXp = { ...p.xp, [d]: (p.xp[d] || 0) + 10, ...(bonus > 0 ? { Life: (p.xp['Life'] || 0) + bonus } : {}) };
        const ns = { ...p, thoughts: newT, xp: newXp, quests: { ...p.quests, list: ql } };
        const newA = findNewAchs(ns, prevAchs);
        if (newA.length > 0) pendingAchs.current.push(...newA);
        return { ...ns, achievements: [...prevAchs, ...newA.map(a => a.id)] };
      });
    } catch {
      const fb = localClassify(text);
      setState(p => ({
        ...p,
        thoughts: p.thoughts.map(t => t.id === id ? { ...t, ...fb, status: 'local', tags: [...fb.tags, 'offline'].slice(0, 2) } : t),
        xp: { ...p.xp, [fb.domain]: (p.xp[fb.domain] || 0) + 10 },
      }));
    }
  }

  function updateThought(id, patch, e) {
    setState(p => {
      const t = p.thoughts.find(x => x.id === id);
      const newT = p.thoughts.map(x => x.id === id ? { ...x, ...patch } : x);
      if (patch.done !== true || !t || t.done || t.type !== 'task') return { ...p, thoughts: newT };
      const dom = DOMAINS.includes(t.domain) ? t.domain : 'Life';
      return applyGame({ ...p, thoughts: newT }, dom, 'tasks', 25);
    });
    if (patch.done === true && e) spawnFloat(25, e);
  }

  const deleteThought = id => setState(p => ({ ...p, thoughts: p.thoughts.filter(t => t.id !== id) }));

  function finishSession(mode, actDomain, focusMinutes, identityMode) {
    if (mode === 'focus') {
      const since = new Date(Date.now() - focusMinutes * 60000).toISOString();
      const cap = state.thoughts.filter(t => t.createdAt >= since).length;
      const mult = identityMode?.xpMult || 1;
      const xpEarned = Math.round(15 * mult);
      setState(p => {
        const newSess = [{
          id: crypto.randomUUID(), mode: 'focus', domain: actDomain,
          minutes: focusMinutes, captured: cap, at: new Date().toISOString(),
          identityMode: identityMode?.id, xpEarned,
        }, ...p.sessions].slice(0, 50);
        return applyGame({ ...p, sessions: newSess }, actDomain, 'session', xpEarned);
      });
    }
  }

  function saveIntention(v) {
    setState(p => {
      const base = {
        ...p, intention: v,
        intentionHistory: v.trim()
          ? [{ id: crypto.randomUUID(), text: v.trim(), at: new Date().toISOString() }, ...p.intentionHistory].slice(0, 30)
          : p.intentionHistory,
      };
      if (!v.trim()) return base;
      return applyGame(base, 'Life', 'intention', 5);
    });
  }

  function addTask(title, tier, domain) {
    setState(p => ({
      ...p,
      taskBoard: [{ id: crypto.randomUUID(), title, tier, domain, done: false, createdAt: new Date().toISOString() }, ...(p.taskBoard || [])],
    }));
  }

  function completeTask(id, e) {
    const task = (state.taskBoard || []).find(t => t.id === id);
    if (!task || task.done) return;
    setState(p => {
      const t = p.taskBoard.find(x => x.id === id);
      if (!t || t.done) return p;
      const xp = TIER_XP[t.tier] || 25;
      const newBoard = p.taskBoard.map(x => x.id === id ? { ...x, done: true, completedAt: new Date().toISOString() } : x);
      return applyGame({ ...p, taskBoard: newBoard }, t.domain || 'Life', 'tasks', xp);
    });
    if (e) {
      const xp = TIER_XP[task.tier] || 25;
      const count = task.tier === 'epic' ? 4 : task.tier === 'rare' ? 2 : 1;
      spawnBurst(xp, e, count);
    }
  }

  const deleteTask = id => setState(p => ({ ...p, taskBoard: (p.taskBoard || []).filter(t => t.id !== id) }));

  function toggleHabit(id, e) {
    const today = todayStr();
    setState(p => {
      const h = p.habits.find(x => x.id === id);
      if (!h) return p;
      const doneToday = h.dates.includes(today);
      const newDates = doneToday ? h.dates.filter(d => d !== today) : [...h.dates, today];
      const newHabits = p.habits.map(x => x.id === id ? { ...x, dates: newDates } : x);
      if (doneToday) return { ...p, habits: newHabits };
      return applyGame({ ...p, habits: newHabits }, 'Life', 'habit', h.xp || 15);
    });
    const h = state.habits.find(x => x.id === id);
    if (h && !h.dates.includes(today) && e) spawnFloat(h.xp || 15, e);
  }

  const addHabit = name => setState(p => ({ ...p, habits: [...(p.habits || []), { id: crypto.randomUUID(), name, dates: [], xp: 15 }] }));

  function setEnergy(level) {
    const today = todayStr();
    setState(p => ({ ...p, energyLog: [{ date: today, level }, ...(p.energyLog || []).filter(e => e.date !== today)].slice(0, 90) }));
  }

  function setPomodoro(focusMinutes) {
    setState(p => ({ ...p, pomodoro: { ...p.pomodoro, focusMinutes } }));
  }

  const setApiKey = key => setState(p => ({ ...p, apiKey: key }));

  function addProject(name) {
    setState(p => ({ ...p, projects: [...p.projects, { id: crypto.randomUUID(), name, progress: 0 }] }));
  }

  function updateProjectProgress(id, progress) {
    setState(p => ({ ...p, projects: p.projects.map(x => x.id === id ? { ...x, progress } : x) }));
  }

  function setIntentionText(v) {
    setState(p => ({ ...p, intention: v }));
  }

  function addQuestline({ goal, domain, quests }) {
    setState(p => ({
      ...p,
      questlines: [
        {
          id: crypto.randomUUID(),
          goal,
          domain,
          quests,
          completed: false,
          createdAt: new Date().toISOString(),
        },
        ...(p.questlines || []),
      ],
    }));
  }

  function completeQuestlineQuest(questlineId, questId, e) {
    setState(p => {
      const ql = (p.questlines || []).find(x => x.id === questlineId);
      if (!ql) return p;
      const quest = ql.quests.find(q => q.id === questId);
      if (!quest || quest.done) return p;
      const newQuests = ql.quests.map(q => q.id === questId ? { ...q, done: true } : q);
      const allDone = newQuests.every(q => q.done);
      const newQuestlines = p.questlines.map(x =>
        x.id === questlineId ? { ...x, quests: newQuests, completed: allDone, completedAt: allDone ? new Date().toISOString() : x.completedAt } : x
      );
      return applyGame({ ...p, questlines: newQuestlines }, ql.domain || 'Life', 'tasks', quest.xpReward);
    });
    const ql = state.questlines?.find(x => x.id === questlineId);
    const quest = ql?.quests?.find(q => q.id === questId);
    if (quest && !quest.done && e) spawnFloat(quest.xpReward, e);
  }

  function deleteQuestline(id) {
    setState(p => ({ ...p, questlines: (p.questlines || []).filter(x => x.id !== id) }));
  }

  function addBoss({ name, domain, phases }) {
    setState(p => ({
      ...p,
      bosses: [
        { id: crypto.randomUUID(), name, domain, phases, defeated: false, createdAt: new Date().toISOString() },
        ...(p.bosses || []),
      ],
    }));
  }

  function completeBossPhase(bossId, phaseId, e) {
    setState(p => {
      const boss = (p.bosses || []).find(b => b.id === bossId);
      if (!boss) return p;
      const phase = boss.phases.find(ph => ph.id === phaseId);
      if (!phase || phase.done) return p;
      const newPhases = boss.phases.map(ph => ph.id === phaseId ? { ...ph, done: true } : ph);
      const allDone = newPhases.every(ph => ph.done);
      const newBosses = p.bosses.map(b =>
        b.id === bossId ? { ...b, phases: newPhases, defeated: allDone, defeatedAt: allDone ? new Date().toISOString() : b.defeatedAt } : b
      );
      const bonusXp = allDone ? 200 : 0;
      return applyGame({ ...p, bosses: newBosses }, boss.domain || 'Life', 'tasks', phase.xpReward + bonusXp);
    });
    const boss = state.bosses?.find(b => b.id === bossId);
    const phase = boss?.phases?.find(ph => ph.id === phaseId);
    if (phase && !phase.done && e) spawnBurst(phase.xpReward, e, 3);
  }

  const deleteBoss = id => setState(p => ({ ...p, bosses: (p.bosses || []).filter(b => b.id !== id) }));

  function saveForge({ text, insight, domain, tags, type, priority }) {
    setState(p => {
      const thought = {
        id: crypto.randomUUID(), text, insight, domain, tags, type, priority,
        status: 'ready', done: false, createdAt: new Date().toISOString(),
        forged: true,
      };
      return applyGame(
        { ...p, thoughts: [thought, ...p.thoughts] },
        domain || 'Life', 'insight', 40
      );
    });
    spawnBurst(40, null, 3);
  }

  return {
    state, domains,
    toasts, setToasts,
    floats,
    submitThought,
    updateThought, deleteThought,
    finishSession,
    saveIntention, setIntentionText,
    addTask, completeTask, deleteTask,
    toggleHabit, addHabit,
    setEnergy,
    setPomodoro,
    setApiKey,
    addProject, updateProjectProgress,
    spawnFloat,
    addQuestline, completeQuestlineQuest, deleteQuestline,
    addBoss, completeBossPhase, deleteBoss,
    saveForge,
  };
}
