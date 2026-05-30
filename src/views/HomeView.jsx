import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import CapturePanel  from '../components/Capture/CapturePanel.jsx';
import RadialRing    from '../components/Heatmap/RadialRing.jsx';
import ThoughtCard   from '../components/Thoughts/ThoughtCard.jsx';
import MomentumOrb   from '../components/MomentumOrb/MomentumOrb.jsx';
import { DOMAINS, DOMAIN_COLOR, TIER_XP } from '../constants/index.js';

const STOPWORDS = new Set(['about','their','there','would','could','should','think','where','which','these','those','other','after','before','while','still','every','first','since','your','have','this','that','with','from','they','will','what','when','into','more','like','just','been','also','over','than','then','very','only','both','each','such','same','through','here','even','well','know','time','people','work','want','need','feel','make','does','made','really','something','anything','nothing','everything']);

function findConnections(thought, allThoughts) {
  const keywords = thought.text.toLowerCase()
    .split(/\W+/)
    .filter(w => w.length > 4 && !STOPWORDS.has(w));
  if (keywords.length === 0) return [];
  const origin = new Date(thought.createdAt).getTime();
  return allThoughts
    .filter(t => t.id !== thought.id && !t.done && t.status !== 'pending' && new Date(t.createdAt).getTime() < origin)
    .map(t => {
      const tWords = new Set(t.text.toLowerCase().split(/\W+/));
      return { t, score: keywords.filter(w => tWords.has(w)).length };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ t }) => t);
}

function DashStat({ value, label, icon, color, hot = false }) {
  return (
    <div className={`dash-stat${hot ? ' dash-stat--hot' : ''}`} style={{ '--sc': color }}>
      <span className="ds-icon">{icon}</span>
      <span className="ds-value">{value}</span>
      <span className="ds-label">{label}</span>
    </div>
  );
}

const COMBO_WINDOW = 3 * 60 * 1000; // 3 min
const COMBO_NAMES  = ['', '', 'DOUBLE TAP', 'THOUGHT STORM', 'MIND FLOOD', 'NEURAL BURST', 'OMEGA SURGE'];
const COMBO_XP     = [0, 0, 20, 45, 80, 120, 200];

function todayStr() { return new Date().toISOString().split('T')[0]; }

function calcTodayXP(state) {
  const today = todayStr();
  return (
    (state.thoughts  || []).filter(t => t.createdAt?.startsWith(today)).length * 10 +
    (state.sessions  || []).filter(s => s.at?.startsWith(today)).reduce((s, x) => s + (x.xpEarned || 0), 0) +
    (state.todos     || []).filter(t => t.done && t.doneAt?.startsWith(today)).reduce((s, t) => s + ({ 1:30,2:20,3:15,4:10 }[t.priority] || 15), 0) +
    (state.taskBoard || []).filter(t => t.done && t.completedAt?.startsWith(today)).reduce((s, t) => s + (TIER_XP[t.tier] || 25), 0) +
    (state.habits    || []).filter(h => h.dates?.includes(today)).reduce((s, h) => s + (h.xp || 15), 0)
  );
}

function getAdaptivePrompt(state) {
  const hour        = new Date().getHours();
  const today       = todayStr();
  const thoughts    = state.thoughts || [];
  const todayCount  = thoughts.filter(t => t.createdAt?.startsWith(today)).length;
  const tenDaysAgo  = new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0];
  const recentDoms  = new Set(thoughts.filter(t => t.createdAt >= tenDaysAgo).map(t => t.domain));
  const coldDomain  = DOMAINS.find(d => !recentDoms.has(d) && (state.xp?.[d] || 0) > 0);

  if (coldDomain)                          return `You haven't captured anything in ${coldDomain} for 10+ days. What's still open there?`;
  if (todayCount === 0 && hour < 11)       return "What's the first thing your brain wants to chew on today?";
  if (todayCount === 0 && hour >= 21)      return "Last thoughts before you sign off — what happened today?";
  if (todayCount === 0)                    return "What's been on your mind?";
  if (todayCount >= 5)                     return "You're on a roll. What else?";
  const sessions = (state.sessions || []).filter(s => s.at?.startsWith(today));
  if (sessions.length > 0)                return "Fresh out of a session — what did you just discover?";
  return "Dump the raw thought. No categories, no cleanup.";
}

export default function HomeView({ game, captureRef, onViewAll, momentum = 0, onStorm, sendToWorkbench, workbenchIds }) {
  const [intentionLocal, setIntentionLocal] = useState(game.state.intention || '');
  useEffect(() => { setIntentionLocal(game.state.intention || ''); }, [game.state.intention]);

  /* ── Thought connections ── */
  const [connections, setConnections]   = useState([]);
  const [connAnchor,  setConnAnchor]    = useState(null);
  const connTimerRef   = useRef(null);
  const prevPendingRef = useRef(new Set());

  useEffect(() => {
    const thoughts = game.state.thoughts || [];
    const nowPending = new Set(thoughts.filter(t => t.status === 'pending').map(t => t.id));
    const justClassified = [...prevPendingRef.current].filter(id => !nowPending.has(id));
    if (justClassified.length > 0) {
      const thought = thoughts.find(t => justClassified.includes(t.id));
      if (thought) {
        const conns = findConnections(thought, thoughts);
        if (conns.length > 0) {
          setConnAnchor(thought);
          setConnections(conns);
          clearTimeout(connTimerRef.current);
          connTimerRef.current = setTimeout(() => { setConnections([]); setConnAnchor(null); }, 10000);
        }
      }
    }
    prevPendingRef.current = nowPending;
  }, [game.state.thoughts]);

  useEffect(() => () => clearTimeout(connTimerRef.current), []);

  /* ── Combo counter ── */
  const [captureTimes, setCaptureTimes]   = useState([]);
  const [combo,        setCombo]          = useState(0);
  const [comboVisible, setComboVisible]   = useState(false);
  const comboTimerRef = useRef(null);

  const handleCapture = useCallback((text, groqKey) => {
    const now = Date.now();
    setCaptureTimes(prev => {
      const recent = [...prev.filter(t => now - t < COMBO_WINDOW), now];
      const count  = recent.length;
      if (count >= 2) {
        setCombo(count);
        setComboVisible(true);
        clearTimeout(comboTimerRef.current);
        comboTimerRef.current = setTimeout(() => setComboVisible(false), 2800);
      }
      return recent;
    });
    game.submitThought(text, groqKey);
  }, [game.submitThought]);

  useEffect(() => () => clearTimeout(comboTimerRef.current), []);

  /* ── Derived stats ── */
  const today        = todayStr();
  const todayXP      = useMemo(() => calcTodayXP(game.state), [game.state]);
  const todaySessions = useMemo(() =>
    (game.state.sessions || []).filter(s => s.at?.startsWith(today)).length,
    [game.state.sessions, today]
  );
  const todayCaptures = useMemo(() =>
    (game.state.thoughts || []).filter(t => t.createdAt?.startsWith(today)).length,
    [game.state.thoughts, today]
  );
  const todayTasks = useMemo(() => [
    ...(game.state.todos     || []).filter(t => t.done && t.doneAt?.startsWith(today)),
    ...(game.state.taskBoard || []).filter(t => t.done && t.completedAt?.startsWith(today)),
  ].length, [game.state.todos, game.state.taskBoard, today]);

  const streak = game.state.streak?.count || 0;

  const activeDomains = useMemo(() => {
    const counts = {};
    (game.state.thoughts || [])
      .filter(t => t.createdAt?.startsWith(today) && t.domain && t.domain !== 'Sorting')
      .forEach(t => { counts[t.domain] = (counts[t.domain] || 0) + 1; });
    const entries = Object.entries(counts).sort(([,a],[,b]) => b - a);
    const max = entries[0]?.[1] || 1;
    return entries.map(([name, count]) => ({ name, count, pct: Math.round((count / max) * 100) }));
  }, [game.state.thoughts, today]);

  const adaptivePrompt = useMemo(() => getAdaptivePrompt(game.state), [
    game.state.thoughts, game.state.sessions, game.state.xp
  ]);

  const recent = useMemo(() =>
    [...(game.state.thoughts || [])]
      .filter(t => !t.done)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5),
    [game.state.thoughts]
  );

  const comboLabel = COMBO_NAMES[Math.min(combo, COMBO_NAMES.length - 1)] || `×${combo}`;
  const comboBonusXP = COMBO_XP[Math.min(combo, COMBO_XP.length - 1)] || combo * 15;

  return (
    <div className="home-view">

      {/* Ambient orb */}
      <div className="home-orb-wrap" aria-hidden="true">
        <MomentumOrb momentum={momentum} />
      </div>

      {/* Combo burst */}
      {comboVisible && (
        <div className={`combo-burst combo-burst--${Math.min(combo, 5)}`} aria-live="polite">
          <span className="combo-name">{comboLabel}</span>
          <span className="combo-xp">+{comboBonusXP} XP</span>
        </div>
      )}

      {/* Capture hero */}
      <div className="home-hero">
        <div className="home-hero-label">
          <span className="view-title">CAPTURE</span>
          <span className="view-hint">Press <kbd className="kbd">/</kbd> from anywhere</span>
        </div>
        <div className="capture-hero-wrap">
          <CapturePanel
            captureRef={captureRef}
            onSubmit={handleCapture}
            groqKey={game.state.groqKey}
            placeholder={adaptivePrompt}
            onStorm={onStorm}
          />
        </div>
      </div>

      {/* Thought connections */}
      {connections.length > 0 && (
        <div className="conn-panel">
          <div className="conn-header">
            <span className="conn-label">⟆ Connects to {connections.length} older thought{connections.length > 1 ? 's' : ''}</span>
            <button className="conn-dismiss" onClick={() => { setConnections([]); setConnAnchor(null); }}>×</button>
          </div>
          {connections.map(t => (
            <div key={t.id} className="conn-item" style={{ '--dc': DOMAIN_COLOR[t.domain] || 'var(--accent)' }}>
              <span className="conn-domain">{t.domain}</span>
              <span className="conn-text">{t.text.length > 72 ? t.text.slice(0, 72) + '…' : t.text}</span>
              <span className="conn-age">{Math.max(1, Math.floor((Date.now() - new Date(t.createdAt).getTime()) / 86400000))}d</span>
            </div>
          ))}
        </div>
      )}

      {/* Intention banner */}
      <div className={`intention-banner${intentionLocal ? ' has-intention' : ''}`}>
        <span className="ib-label">◈ MISSION</span>
        <input
          className="ib-input"
          value={intentionLocal}
          onChange={e => { setIntentionLocal(e.target.value); game.setIntentionText(e.target.value); }}
          onBlur={e => game.saveIntention(e.target.value)}
          placeholder="Define your mission for today…"
        />
      </div>

      {/* Dashboard */}
      <div className="home-dashboard">

        {/* Status bar */}
        <div className="dash-bar">
          <div className="dash-bar-left">
            <span className="dash-sys-label">⬡ SYSTEM STATUS</span>
            <span className="dash-date">
              {new Date().toLocaleDateString('en', { weekday:'short', month:'short', day:'numeric' }).toUpperCase()}
            </span>
          </div>
          {streak > 0 && (
            <div className="dash-streak">
              <span className="dash-streak-icon">{streak >= 7 ? '🔥' : '◉'}</span>
              <span className="dash-streak-val">{streak}</span>
              <span className="dash-streak-lbl">DAY STREAK</span>
            </div>
          )}
        </div>

        {/* Stat cells */}
        <div className="dash-stats">
          <DashStat value={todayCaptures} label="CAPTURES"  icon="◎" color="var(--accent)" />
          <DashStat value={todaySessions} label="SESSIONS"  icon="⏱" color="#60a5fa" />
          <DashStat value={todayTasks}    label="COMPLETED" icon="✓" color="#4ade80" />
          <DashStat value={`+${todayXP}`} label="XP TODAY"  icon="⚡" color="#fbbf24" hot />
        </div>

        {/* Lower: domain bars + ring */}
        <div className="dash-lower">
          <div className="dash-domains-col">
            <div className="dash-col-label">DOMAINS ACTIVE TODAY</div>
            {activeDomains.length > 0 ? (
              <div className="dash-domain-bars">
                {activeDomains.map(({ name, count, pct }) => (
                  <div key={name} className="ddb" style={{ '--dc': DOMAIN_COLOR[name] || 'var(--accent)' }}>
                    <span className="ddb-name">{name.split('/')[0]}</span>
                    <div className="ddb-track">
                      <div className="ddb-fill" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="ddb-count">{count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="dash-no-domains">No captures yet — first one earns 10 XP</div>
            )}
          </div>
          <div className="dash-ring-col">
            <div className="dash-col-label">30-DAY PULSE</div>
            <RadialRing
              thoughts={game.state.thoughts || []}
              sessions={game.state.sessions || []}
            />
          </div>
        </div>

      </div>

      {/* Recent thoughts */}
      <div className="home-recent">
        <div className="home-recent-head">
          <span className="view-title">RECENT</span>
          <button className="ghost view-all-btn" onClick={onViewAll}>View all →</button>
        </div>
        {recent.length === 0 ? (
          <div className="home-empty">Nothing captured yet — start dumping raw thoughts above.</div>
        ) : (
          <div className="stream">
            {recent.map(t => (
              <ThoughtCard
                key={t.id}
                thought={t}
                updateThought={game.updateThought}
                deleteThought={game.deleteThought}
                onSendToWorkbench={sendToWorkbench}
                inWorkbench={workbenchIds?.has(t.id)}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
