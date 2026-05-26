import { useMemo, useState } from 'react';
import { DOMAINS, DOMAIN_COLOR, XP_PER_LEVEL, ACHIEVEMENTS, CHAR_STATS, TIER_XP } from '../constants/index.js';
import GalaxyMap from '../components/GalaxyMap/GalaxyMap.jsx';
import { xpToLevel, polymathScore } from '../utils/game.js';
import { calcMomentumScore } from '../utils/momentum.js';
import HabitStack from '../components/Habits/HabitStack.jsx';
import DomainRadar from '../components/RadarChart/DomainRadar.jsx';

const RANKS = [
  { minLevel: 40, title: 'Polymath Ascendant',   color: '#fbbf24' },
  { minLevel: 30, title: 'The Synthesizer',       color: '#f472b6' },
  { minLevel: 20, title: 'Knowledge Weaver',      color: '#a78bfa' },
  { minLevel: 15, title: 'Cross-Domain Thinker',  color: '#00d9b1' },
  { minLevel: 10, title: 'Domain Explorer',       color: '#4ade80' },
  { minLevel: 6,  title: 'Domain Apprentice',     color: '#60a5fa' },
  { minLevel: 3,  title: 'Curious Seeker',        color: '#6b7280' },
  { minLevel: 1,  title: 'The Wandering Mind',    color: '#4b5563' },
];

const STAT_COLORS = {
  streak:       '#f97316',
  momentum:     '#00d9b1',
  polymath:     '#a78bfa',
  bosses:       '#f43f5e',
  sessions:     '#60a5fa',
  thoughts:     '#4ade80',
  achievements: '#fbbf24',
  domains:      '#818cf8',
};

function getrank(level) {
  return RANKS.find(r => level >= r.minLevel) || RANKS[RANKS.length - 1];
}

function todayStr() { return new Date().toISOString().split('T')[0]; }

function calcTodayXP(state) {
  const today = todayStr();
  const thoughts = (state.thoughts || []).filter(t => t.createdAt?.startsWith(today)).length * 10;
  const sessions = (state.sessions || []).filter(s => s.at?.startsWith(today)).reduce((s, x) => s + (x.xpEarned || 0), 0);
  const todos    = (state.todos || []).filter(t => t.done && t.doneAt?.startsWith(today)).reduce((s, t) => s + ({ 1:30,2:20,3:15,4:10 }[t.priority] || 15), 0);
  const tasks    = (state.taskBoard || []).filter(t => t.done && t.completedAt?.startsWith(today)).reduce((s, t) => s + (TIER_XP[t.tier] || 25), 0);
  const habits   = (state.habits || []).filter(h => h.dates?.includes(today)).reduce((s, h) => s + (h.xp || 15), 0);
  return thoughts + sessions + todos + tasks + habits;
}

function formatFocusTime(minutes) {
  if (minutes === 0) return '0m';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function XpBar({ current, max, color }) {
  const pct = max > 0 ? Math.min(100, (current / max) * 100) : 0;
  return (
    <div className="prof-xpbar-track">
      <div className="prof-xpbar-fill" style={{ width: `${pct}%`, background: color || 'var(--accent)' }} />
    </div>
  );
}

function StatBox({ label, value, sub, color }) {
  return (
    <div className="prof-stat-box" style={{ '--sc': color || 'var(--accent)' }}>
      <span className="prof-stat-val" style={{ color: color || 'var(--ink)' }}>{value}</span>
      <span className="prof-stat-label">{label}</span>
      {sub && <span className="prof-stat-sub">{sub}</span>}
    </div>
  );
}

function RankProgression({ level }) {
  const nextRank = RANKS.find(r => r.minLevel > level);
  const currentRank = getrank(level);
  if (!nextRank) {
    return (
      <div className="prof-rank-prog">
        <div className="prof-rank-prog-labels">
          <span style={{ color: currentRank.color }}>MAX RANK ACHIEVED</span>
        </div>
      </div>
    );
  }
  const prevMin = currentRank.minLevel;
  const progress = Math.min(1, (level - prevMin) / Math.max(1, nextRank.minLevel - prevMin));
  const levelsLeft = nextRank.minLevel - level;
  return (
    <div className="prof-rank-prog">
      <div className="prof-rank-prog-labels">
        <span className="prof-rank-prog-current" style={{ color: currentRank.color }}>{currentRank.title}</span>
        <span className="prof-rank-prog-next" style={{ color: nextRank.color }}>
          {nextRank.title} · Lv.{nextRank.minLevel}
        </span>
      </div>
      <div className="prof-rank-prog-track">
        <div className="prof-rank-prog-fill" style={{ width: `${progress * 100}%`, background: nextRank.color }} />
      </div>
      <div className="prof-rank-prog-sub">{levelsLeft} level{levelsLeft !== 1 ? 's' : ''} to next rank</div>
    </div>
  );
}

function SevenDayActivity({ sessions, thoughts }) {
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000);
    const str = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('en', { weekday: 'short' }).slice(0, 2).toUpperCase();
    const isToday = str === todayStr();
    const domainSet = new Set([
      ...(sessions || []).filter(s => s.at?.startsWith(str)).map(s => s.domain),
      ...(thoughts || []).filter(t => t.createdAt?.startsWith(str) && t.domain !== 'Sorting').map(t => t.domain),
    ]);
    return { str, label, isToday, domains: [...domainSet].filter(Boolean).slice(0, 5) };
  }), [sessions, thoughts]);

  return (
    <div className="prof-7day">
      {days.map(day => (
        <div key={day.str} className={`prof-7day-col${day.isToday ? ' today' : ''}`}>
          <div className="prof-7day-dots">
            {day.domains.length > 0
              ? day.domains.map(d => (
                  <span
                    key={d}
                    className="prof-7day-dot"
                    style={{ background: DOMAIN_COLOR[d] || 'var(--accent)' }}
                    title={d}
                  />
                ))
              : <span className="prof-7day-dot prof-7day-dot--empty" />
            }
          </div>
          <div className="prof-7day-label">{day.label}</div>
          {day.isToday && <div className="prof-7day-today-pip" />}
        </div>
      ))}
    </div>
  );
}

export default function ProfileView({ game }) {
  const state = game.state;
  const today = todayStr();
  const [domainView, setDomainView] = useState('table'); // 'table' | 'galaxy'

  const totalXP = useMemo(
    () => DOMAINS.reduce((s, d) => s + (state.xp?.[d] || 0), 0),
    [state.xp]
  );

  const level      = xpToLevel(totalXP);
  const xpInLvl    = totalXP % XP_PER_LEVEL;
  const rank       = getrank(level);
  const todayXP    = useMemo(() => calcTodayXP(state), [state]);
  const momentum   = useMemo(
    () => calcMomentumScore(state.thoughts, state.taskBoard, state.sessions),
    [state.thoughts, state.taskBoard, state.sessions]
  );
  const polyScore  = useMemo(() => polymathScore(state.xp), [state.xp]);

  const bossKills     = (state.bosses || []).filter(b => b.defeated).length;
  const achUnlocked   = (state.achievements || []).length;
  const totalSess     = (state.sessions || []).length;
  const totalThoughts = (state.thoughts || []).length;
  const bestStreak    = state.streak?.best || state.streak?.count || 0;
  const totalMinutes  = useMemo(
    () => (state.sessions || []).reduce((s, x) => s + (x.minutes || 0), 0),
    [state.sessions]
  );
  const totalTasksDone = useMemo(
    () => (state.taskBoard || []).filter(t => t.done).length + (state.todos || []).filter(t => t.done).length,
    [state.taskBoard, state.todos]
  );

  const todaySessions = (state.sessions || []).filter(s => s.at?.startsWith(today)).length;
  const todayCaptures = (state.thoughts || []).filter(t => t.createdAt?.startsWith(today)).length;
  const todayTasks    = [
    ...(state.todos || []).filter(t => t.done && t.doneAt?.startsWith(today)),
    ...(state.taskBoard || []).filter(t => t.done && t.completedAt?.startsWith(today)),
  ].length;

  const domainRows = useMemo(() =>
    DOMAINS.map(d => ({
      name: d,
      xp: state.xp?.[d] || 0,
      level: Math.floor((state.xp?.[d] || 0) / XP_PER_LEVEL) + 1,
      inLvl: (state.xp?.[d] || 0) % XP_PER_LEVEL,
      color: DOMAIN_COLOR[d] || 'var(--accent)',
    })).sort((a, b) => b.xp - a.xp),
    [state.xp]
  );

  const unlockedAchs = ACHIEVEMENTS.filter(a => (state.achievements || []).includes(a.id));
  const lockedAchs   = ACHIEVEMENTS.filter(a => !(state.achievements || []).includes(a.id));

  return (
    <div className="profile-view">

      {/* ── Hero Card ── */}
      <div className="prof-hero" style={{ '--rank-color': rank.color }}>
        <div className="prof-hero-avatar">
          <span className="prof-avatar-glyph">◆</span>
        </div>

        <div className="prof-hero-info">
          <div className="prof-hero-top">
            <div>
              <div className="prof-rank-title" style={{ color: rank.color }}>{rank.title}</div>
              <div className="prof-name">POLYMATH OS</div>
            </div>
            <div className="prof-level-badge" style={{ '--rank-color': rank.color }}>
              <span className="prof-level-label">LV</span>
              <span className="prof-level-num">{level}</span>
            </div>
          </div>

          <div className="prof-xp-section">
            <XpBar current={xpInLvl} max={XP_PER_LEVEL} color={rank.color} />
            <div className="prof-xp-meta">
              <span className="prof-xp-progress">{xpInLvl} / {XP_PER_LEVEL} XP to next level</span>
              <span className="prof-xp-total">{totalXP.toLocaleString()} total</span>
            </div>
          </div>

          <RankProgression level={level} />

          {todayXP > 0 && (
            <div className="prof-today-xp">
              <span className="prof-today-badge">+{todayXP} XP today</span>
              {todayCaptures > 0 && <span className="prof-today-chip">{todayCaptures} captures</span>}
              {todaySessions > 0 && <span className="prof-today-chip">{todaySessions} sessions</span>}
              {todayTasks > 0    && <span className="prof-today-chip">{todayTasks} tasks</span>}
            </div>
          )}
        </div>
      </div>

      {/* ── Stats grid ── */}
      <div className="prof-stats-grid">
        <StatBox label="Streak"       value={state.streak?.count || 0} sub="days"    color={STAT_COLORS.streak} />
        <StatBox label="Best Streak"  value={bestStreak}               sub="days"    color={STAT_COLORS.streak} />
        <StatBox label="Momentum"     value={`${momentum}%`}                         color={STAT_COLORS.momentum} />
        <StatBox label="Polymath Pts" value={polyScore.toLocaleString()}              color={STAT_COLORS.polymath} />
        <StatBox label="Focus Time"   value={formatFocusTime(totalMinutes)}           color={STAT_COLORS.sessions} />
        <StatBox label="Sessions"     value={totalSess}                               color={STAT_COLORS.sessions} />
        <StatBox label="Thoughts"     value={totalThoughts}                           color={STAT_COLORS.thoughts} />
        <StatBox label="Tasks Done"   value={totalTasksDone}                          color={STAT_COLORS.achievements} />
        <StatBox label="Boss Kills"   value={bossKills}                               color={STAT_COLORS.bosses} />
        <StatBox label="Achievements" value={`${achUnlocked}/${ACHIEVEMENTS.length}`} color={STAT_COLORS.achievements} />
        <StatBox label="Active Domains" value={domainRows.filter(d => d.xp > 0).length} color={STAT_COLORS.domains} />
      </div>

      {/* ── 7-Day Activity ── */}
      <section className="prof-section">
        <div className="prof-section-head">7-Day Domain Activity</div>
        <SevenDayActivity sessions={state.sessions} thoughts={state.thoughts} />
      </section>

      {/* ── Domain Mastery ── */}
      <section className="prof-section">
        <div className="prof-section-head">
          Domain Mastery
          <div className="prof-domain-toggle">
            <button
              className={`pdt-btn${domainView === 'table' ? ' active' : ''}`}
              onClick={() => setDomainView('table')}
            >≡ TABLE</button>
            <button
              className={`pdt-btn${domainView === 'galaxy' ? ' active' : ''}`}
              onClick={() => setDomainView('galaxy')}
            >◈ GALAXY</button>
          </div>
        </div>

        {domainView === 'table' && (
          <div className="prof-domains">
            {domainRows.map(d => (
              <div key={d.name} className="prof-domain-row">
                <span className="prof-domain-dot" style={{ background: d.color }} />
                <span className="prof-domain-name">{d.name}</span>
                <span className="prof-domain-lv" style={{ color: d.color }}>Lv.{d.level}</span>
                <div className="prof-domain-bar-wrap">
                  <XpBar current={d.inLvl} max={XP_PER_LEVEL} color={d.color} />
                </div>
                <span className="prof-domain-xp">{d.xp} XP</span>
              </div>
            ))}
          </div>
        )}

        {domainView === 'galaxy' && (
          <GalaxyMap
            xp={state.xp}
            thoughts={state.thoughts || []}
            sessions={state.sessions || []}
          />
        )}
      </section>

      {/* ── Achievements ── */}
      <section className="prof-section">
        <div className="prof-section-head">
          Achievements
          <span className="prof-section-count">{achUnlocked} / {ACHIEVEMENTS.length}</span>
        </div>
        <div className="prof-achievements">
          {unlockedAchs.map(a => (
            <div key={a.id} className="prof-ach prof-ach--unlocked" title={`${a.title}: ${a.desc}`}>
              <span className="prof-ach-icon">{a.icon}</span>
              <span className="prof-ach-name">{a.title}</span>
            </div>
          ))}
          {lockedAchs.map(a => (
            <div key={a.id} className="prof-ach prof-ach--locked" title={a.desc}>
              <span className="prof-ach-icon">?</span>
              <span className="prof-ach-name">{a.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── RPG Stats ── */}
      <section className="prof-section">
        <div className="prof-section-head">Character Stats</div>
        <div className="prof-char-stats">
          {CHAR_STATS.map(stat => {
            const statXP = stat.domains.reduce((s, d) => s + (state.xp?.[d] || 0), 0);
            const statLv = Math.floor(statXP / XP_PER_LEVEL) + 1;
            const statIn = statXP % XP_PER_LEVEL;
            return (
              <div key={stat.key} className="prof-char-row">
                <span className="prof-char-key" style={{ color: stat.color }}>{stat.key}</span>
                <div className="prof-char-mid">
                  <div className="prof-char-label">{stat.label}</div>
                  <div className="prof-char-domains">{stat.domains.join(' · ')}</div>
                  <XpBar current={statIn} max={XP_PER_LEVEL} color={stat.color} />
                </div>
                <span className="prof-char-lv" style={{ color: stat.color }}>Lv.{statLv}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Habits & Energy ── */}
      <section className="prof-section">
        <HabitStack
          habits={state.habits || []}
          onToggle={game.toggleHabit}
          onAdd={game.addHabit}
          energyLog={state.energyLog || []}
          onSetEnergy={game.setEnergy}
        />
      </section>

      {/* ── Domain Radar ── */}
      <section className="prof-section">
        <DomainRadar
          thoughts={state.thoughts || []}
          taskBoard={state.taskBoard || []}
          sessions={state.sessions || []}
        />
      </section>

      {/* ── AI Settings ── */}
      <section className="prof-section">
        <div className="prof-section-head">AI Settings</div>
        <div className="panel">
          <div className="panel-head">
            <h2>Groq API Key</h2>
            <span className="api-status">
              <span className={`dot ${state.groqKey ? 'on' : 'off'}`} />
              {state.groqKey ? 'connected' : 'off — using local fallbacks'}
            </span>
          </div>
          <div className="api-row">
            <input
              type="password"
              value={state.groqKey}
              onChange={e => game.setGroqKey(e.target.value)}
              placeholder="gsk_…"
            />
            <button onClick={() => game.setGroqKey('')}>Clear</button>
          </div>
          <p className="notice">
            Powers all AI features: thought classification, Oracle, Forge synthesis, quest generation, todo AI.
            Free tier at <strong>console.groq.com</strong> — no credit card required. Stored only in your browser.
          </p>
        </div>
      </section>

    </div>
  );
}
