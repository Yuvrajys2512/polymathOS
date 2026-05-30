import { useState, useEffect, useRef, useCallback } from 'react';
import { DOMAIN_COLOR } from '../../constants/index.js';

const TIMER_SECS = 8;

function TriageComplete({ stats, onClose }) {
  return (
    <div className="triage-backdrop">
      <div className="triage-complete">
        <div className="triage-complete-icon">⚡</div>
        <h2 className="triage-complete-title">Backlog Cleared</h2>
        <p className="triage-complete-sub">You actually did it.</p>
        <div className="triage-complete-stats">
          <div className="tcs-item"><span className="tcs-val">{stats.kept}</span><span className="tcs-lbl">kept</span></div>
          <div className="tcs-item"><span className="tcs-val tcs-archived">{stats.archived}</span><span className="tcs-lbl">archived</span></div>
          <div className="tcs-item"><span className="tcs-val tcs-focused">{stats.focused}</span><span className="tcs-lbl">focused</span></div>
        </div>
        <button className="primary" onClick={onClose}>Back to Stream</button>
      </div>
    </div>
  );
}

export default function TriageMode({ thoughts, updateThought, onClose, onStartFocus }) {
  const [index,       setIndex]       = useState(0);
  const [phase,       setPhase]       = useState('idle');
  const [timeLeft,    setTimeLeft]    = useState(TIMER_SECS);
  const [stats,       setStats]       = useState({ kept: 0, archived: 0, focused: 0 });
  const [hoverAction, setHoverAction] = useState(null);
  const timerRef  = useRef(null);
  const phaseRef  = useRef('idle');
  phaseRef.current = phase;

  const queue   = thoughts;
  const thought = queue[index];
  const color   = thought ? (DOMAIN_COLOR[thought.domain] || 'var(--accent)') : 'var(--accent)';

  const advance = useCallback((direction, extraAction) => {
    if (phaseRef.current !== 'idle') return;
    clearInterval(timerRef.current);
    setPhase('exit-' + direction);
    extraAction?.();
    setTimeout(() => {
      setIndex(i => i + 1);
      setPhase('idle');
      setTimeLeft(TIMER_SECS);
    }, 380);
  }, []);

  const handleKeep = useCallback(() => {
    advance('right', () => setStats(s => ({ ...s, kept: s.kept + 1 })));
  }, [advance]);

  const handleArchive = useCallback(() => {
    if (!thought) return;
    advance('left', () => {
      updateThought(thought.id, { done: true, completedAt: new Date().toISOString() });
      setStats(s => ({ ...s, archived: s.archived + 1 }));
    });
  }, [advance, thought, updateThought]);

  const handleFocus = useCallback(() => {
    if (!thought) return;
    advance('up', () => {
      updateThought(thought.id, { priority: 'high' });
      setStats(s => ({ ...s, focused: s.focused + 1 }));
      setTimeout(() => { onClose(); onStartFocus(); }, 420);
    });
  }, [advance, thought, updateThought, onClose, onStartFocus]);

  useEffect(() => {
    if (!thought) return;
    setTimeLeft(TIMER_SECS);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); handleKeep(); return TIMER_SECS; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [index]);

  useEffect(() => {
    const h = e => {
      if (['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) return;
      if (e.key === 'ArrowRight' || e.key === 'd') handleKeep();
      if (e.key === 'ArrowLeft'  || e.key === 'a') handleArchive();
      if (e.key === 'ArrowUp'    || e.key === 'w') handleFocus();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [handleKeep, handleArchive, handleFocus, onClose]);

  if (!thought || index >= queue.length) {
    return <TriageComplete stats={stats} onClose={onClose} />;
  }

  const timerFrac   = timeLeft / TIMER_SECS;
  const urgentColor = timeLeft <= 3 ? '#f87171' : color;
  const ghost1      = queue[index + 1];
  const ghost2      = queue[index + 2];

  return (
    <div
      className={`triage-backdrop${hoverAction ? ` triage-hover-${hoverAction}` : ''}`}
      style={{ '--tc': color }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      {/* Progress bar */}
      <div className="triage-progress-track">
        <div className="triage-progress-fill" style={{ width: `${(index / queue.length) * 100}%`, background: color, boxShadow: `0 0 10px ${color}` }} />
      </div>

      {/* Header */}
      <div className="triage-header">
        <div className="triage-header-left">
          <span className="triage-title">◈ HYPER-TRIAGE</span>
          <div className="triage-live-stats">
            {stats.archived > 0 && <span key="a" className="tls-chip tls-archived">↙ {stats.archived}</span>}
            {stats.focused  > 0 && <span key="f" className="tls-chip tls-focused">↑ {stats.focused}</span>}
            {stats.kept     > 0 && <span key="k" className="tls-chip tls-kept">↗ {stats.kept}</span>}
          </div>
        </div>
        <span className="triage-count" style={{ color }}>{index + 1} / {queue.length}</span>
        <button className="icon ghost" style={{ fontSize: 16 }} onClick={onClose}>✕</button>
      </div>

      {/* Card stack */}
      <div className="triage-card-stack">
        {ghost2 && <div className="triage-ghost triage-ghost-2" />}
        {ghost1 && (
          <div
            className="triage-ghost triage-ghost-1"
            style={{ '--gc': DOMAIN_COLOR[ghost1.domain] || 'rgba(255,255,255,0.1)' }}
          />
        )}

        <div
          className={`triage-card${phase !== 'idle' ? ` triage-${phase}` : ' triage-enter'}`}
          key={thought.id}
          style={{ '--tc': color }}
        >
          {/* Card header row */}
          <div className="tc-top-row">
            <div className="tc-domain" style={{ color }}>
              <span className="tc-domain-dot" style={{ background: color }} />
              {thought.domain}
            </div>
            <div className="tc-timer-display" style={{ color: urgentColor }}>
              <span className="tc-timer-num">{timeLeft}</span>
              <span className="tc-timer-s">s</span>
            </div>
          </div>

          {/* Thought text */}
          <p className="tc-text">{thought.text}</p>

          {/* Insight */}
          {thought.insight && thought.insight !== 'Classifying…' && (
            <p className="tc-insight">◎ {thought.insight}</p>
          )}

          {/* Pills */}
          <div className="tc-pills">
            <span className="pill typ">{thought.type}</span>
            <span className={`pill ${thought.priority}`}>{thought.priority}</span>
            {(thought.tags || []).slice(0, 3).map(tag => (
              <span className="pill" key={tag}>#{tag}</span>
            ))}
          </div>

          {/* Timer bar at bottom of card */}
          <div className="tc-timer-track">
            <div
              className="tc-timer-fill"
              style={{
                width: `${timerFrac * 100}%`,
                background: urgentColor,
                boxShadow: `0 0 12px ${urgentColor}`,
                transition: 'width 1s linear, background 0.4s ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="triage-actions">
        <button
          className="triage-btn triage-btn-left"
          onClick={handleArchive}
          onMouseEnter={() => setHoverAction('archive')}
          onMouseLeave={() => setHoverAction(null)}
        >
          <span className="tba-arrow">←</span>
          <span className="tba-label">ARCHIVE</span>
          <span className="tba-key">A</span>
        </button>
        <button
          className="triage-btn triage-btn-up"
          onClick={handleFocus}
          onMouseEnter={() => setHoverAction('focus')}
          onMouseLeave={() => setHoverAction(null)}
        >
          <span className="tba-arrow">↑</span>
          <span className="tba-label">FOCUS NOW</span>
          <span className="tba-key">W</span>
        </button>
        <button
          className="triage-btn triage-btn-right"
          onClick={handleKeep}
          onMouseEnter={() => setHoverAction('keep')}
          onMouseLeave={() => setHoverAction(null)}
        >
          <span className="tba-arrow">→</span>
          <span className="tba-label">KEEP</span>
          <span className="tba-key">D</span>
        </button>
      </div>

      <p className="triage-hint">swipe direction · auto-keeps on timeout</p>
    </div>
  );
}
