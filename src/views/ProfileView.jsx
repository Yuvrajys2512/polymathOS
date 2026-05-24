import { useMemo } from 'react';
import { DOMAINS, DOMAIN_COLOR, XP_PER_LEVEL, ACHIEVEMENTS, CHAR_STATS, TIER_XP } from '../constants/index.js';
import { xpToLevel, polymathScore } from '../utils/game.js';
import { calcMomentumScore } from '../utils/momentum.js';

const RANKS = [
  { minLevel: 40, title: 'Polymath Ascendant', color: '#fbbf24' },
  { minLevel: 30, title: 'The Synthesizer',    color: '#f472b6' },
  { minLevel: 20, title: 'Knowledge Weaver',   color: '#a78bfa' },
  { minLevel: 15, title: 'Cross-Domain Thinker', color: '#00d9b1' },
  { minLevel: 10, title: 'Domain Explorer',    color: '#4ade80' },
  { minLevel: 6,  title: 'Domain Apprentice',  color: '#60a5fa' },
  { minLevel: 3,  title: 'Curious Seeker',     color: '#6b7280' },
  { minLevel: 1,  title: 'The Wandering Mind', color: '#4b5563' },
];

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

function XpBar({ current, max, color }) {
  const pct = max > 0 ? Math.min(100, (current / max) * 100) : 0;
  return (
    <div className="prof-xpbar-track">
      <div
        className="prof-xpbar-fill"
        style={{ width: `${pct}%`, background: color || 'var(--accent)' }}
      />
    </div>
  );
}

function StatBox({ icon, label, value, sub }) {
  return (
    <div className="prof-stat-box">
      <span className="prof-stat-icon">{icon}</span>
      <span className="prof-stat-val">{value}</span>
      <span className="prof-stat-label">{label}</span>
      {sub && <span className="prof-stat-sub">{sub}</span>}
    </div>
  );
}

export default function ProfileView({ state }) {
  const today = todayStr();

  const totalXP = useMemo(
    () => DOMAINS.reduce((s, d) => s + (state.xp?.[d] || 0), 0),
    [state.xp]
  );

  const level     = xpToLevel(totalXP);
  const xpInLvl   = totalXP % XP_PER_LEVEL;
  const rank      = getrank(level);
  const todayXP   = useMemo(() => calcTodayXP(state), [state]);
  const momentum  = useMemo(
    () => calcMomentumScore(state.thoughts, state.taskBoard, state.sessions),
    [state.thoughts, state.taskBoard, state.sessions]
  );
  const polyScore = useMemo(() => polymathScore(state.xp), [state.xp]);

  const bossKills    = (state.bosses || []).filter(b => b.defeated).length;
  const achUnlocked  = (state.achievements || []).length;
  const totalSess    = (state.sessions || []).length;
  const totalThoughts = (state.thoughts || []).length;

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
      <div className="prof-hero">
        <div className="prof-hero-avatar" style={{ '--rank-color': rank.color }}>
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
        <StatBox icon="🔥" label="Streak"       value={state.streak?.count || 0} sub="days" />
        <StatBox icon="⚡" label="Momentum"     value={`${momentum}%`} />
        <StatBox icon="✦"  label="Polymath Pts" value={polyScore.toLocaleString()} />
        <StatBox icon="⚔"  label="Boss Kills"   value={bossKills} />
        <StatBox icon="◉"  label="Sessions"     value={totalSess} />
        <StatBox icon="💡" label="Thoughts"     value={totalThoughts} />
        <StatBox icon="🏆" label="Achievements" value={`${achUnlocked}/${ACHIEVEMENTS.length}`} />
        <StatBox icon="◆"  label="Domains"      value={domainRows.filter(d => d.xp > 0).length} sub="active" />
      </div>

      {/* ── Domain Mastery ── */}
      <section className="prof-section">
        <div className="prof-section-head">Domain Mastery</div>
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

    </div>
  );
}
