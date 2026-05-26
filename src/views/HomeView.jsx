import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import CapturePanel  from '../components/Capture/CapturePanel.jsx';
import RadialRing    from '../components/Heatmap/RadialRing.jsx';
import ThoughtCard   from '../components/Thoughts/ThoughtCard.jsx';
import MomentumOrb   from '../components/MomentumOrb/MomentumOrb.jsx';
import { DOMAINS, DOMAIN_COLOR, TIER_XP } from '../constants/index.js';

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

export default function HomeView({ game, captureRef, onViewAll, momentum = 0, onStorm }) {
  const [intentionLocal, setIntentionLocal] = useState(game.state.intention || '');
  useEffect(() => { setIntentionLocal(game.state.intention || ''); }, [game.state.intention]);

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

      {/* Intention */}
      <div className="intention-row">
        <span className="intention-label">TODAY'S INTENTION</span>
        <input
          className="intention-input"
          value={intentionLocal}
          onChange={e => { setIntentionLocal(e.target.value); game.setIntentionText(e.target.value); }}
          onBlur={e => game.saveIntention(e.target.value)}
          placeholder="One sentence that defines today…"
        />
      </div>

      {/* Activity section: HUD + Radial Ring */}
      <div className="activity-section">

        {/* Today's HUD */}
        <div className="today-hud">
          <div className="hud-section-label">TODAY</div>
          <div className="hud-stats">
            <div className="hud-stat">
              <span className="hud-stat-val">{todayCaptures}</span>
              <span className="hud-stat-label">captures</span>
            </div>
            <div className="hud-stat">
              <span className="hud-stat-val">{todaySessions}</span>
              <span className="hud-stat-label">sessions</span>
            </div>
            <div className="hud-stat">
              <span className="hud-stat-val">{todayTasks}</span>
              <span className="hud-stat-label">done</span>
            </div>
            <div className="hud-stat hud-stat--xp">
              <span className="hud-stat-val">+{todayXP}</span>
              <span className="hud-stat-label">XP today</span>
            </div>
          </div>

          {streak > 0 && (
            <div className="hud-streak">
              <span className="hud-streak-flame">
                {streak >= 30 ? '🔵' : streak >= 7 ? '🔥' : '🔥'}
              </span>
              <span className="hud-streak-count">{streak}</span>
              <span className="hud-streak-label">day streak</span>
            </div>
          )}

          <div className="hud-domains">
            {DOMAINS.map(d => {
              const count = (game.state.thoughts || [])
                .filter(t => t.createdAt?.startsWith(today) && t.domain === d).length;
              if (count === 0) return null;
              return (
                <span
                  key={d}
                  className="hud-domain-pip"
                  style={{ '--dc': DOMAIN_COLOR[d] || 'var(--accent)' }}
                  title={`${d}: ${count}`}
                >
                  {d.split('/')[0]}
                </span>
              );
            })}
          </div>
        </div>

        {/* Radial ring */}
        <RadialRing
          thoughts={game.state.thoughts || []}
          sessions={game.state.sessions || []}
        />
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
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
