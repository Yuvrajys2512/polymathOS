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
  const [index,   setIndex]   = useState(0);
  const [phase,   setPhase]   = useState('idle'); // idle | exit-left | exit-right | exit-up
  const [timeLeft, setTimeLeft] = useState(TIMER_SECS);
  const [stats,   setStats]   = useState({ kept: 0, archived: 0, focused: 0 });
  const timerRef  = useRef(null);
  const phaseRef  = useRef('idle');
  phaseRef.current = phase;

  const queue   = thoughts;
  const thought = queue[index];
  const color   = thought ? (DOMAIN_COLOR[thought.domain] || 'var(--accent)') : 'var(--accent)';
  const radius  = 44;
  const circ    = 2 * Math.PI * radius;

  const advance = useCallback((direction, extraAction) => {
    if (phaseRef.current !== 'idle') return;
    clearInterval(timerRef.current);
    setPhase('exit-' + direction);
    extraAction?.();
    setTimeout(() => {
      setIndex(i => i + 1);
      setPhase('idle');
      setTimeLeft(TIMER_SECS);
    }, 360);
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

  // Per-card countdown
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

  // Keyboard
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

  const timerFrac = timeLeft / TIMER_SECS;
  const urgentColor = timeLeft <= 3 ? '#f87171' : color;

  return (
    <div className="triage-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      {/* Header */}
      <div className="triage-header">
        <span className="triage-title">HYPER-TRIAGE</span>
        <span className="triage-count" style={{ color }}>{index + 1} / {queue.length}</span>
        <button className="icon ghost" style={{ fontSize: 16 }} onClick={onClose}>✕</button>
      </div>

      {/* Progress */}
      <div className="triage-progress-track">
        <div
          className="triage-progress-fill"
          style={{ width: `${(index / queue.length) * 100}%`, background: color }}
        />
      </div>

      {/* Timer ring */}
      <div className="triage-timer-ring">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
          <circle
            cx="50" cy="50" r={radius}
            fill="none" stroke={urgentColor}
            strokeWidth="3"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - timerFrac)}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.4s ease' }}
          />
        </svg>
        <span className="triage-timer-num" style={{ color: urgentColor }}>{timeLeft}</span>
      </div>

      {/* Thought card */}
      <div
        className={`triage-card${phase !== 'idle' ? ` triage-${phase}` : ' triage-enter'}`}
        key={thought.id}
        style={{ '--tc': color }}
      >
        <div className="tc-domain" style={{ color }}>{thought.domain}</div>
        <p className="tc-text">{thought.text}</p>
        {thought.insight && thought.insight !== 'Classifying…' && (
          <p className="tc-insight">{thought.insight}</p>
        )}
        <div className="tc-pills">
          <span className="pill typ">{thought.type}</span>
          <span className={`pill ${thought.priority}`}>{thought.priority}</span>
          {(thought.tags || []).slice(0, 3).map(tag => (
            <span className="pill" key={tag}>#{tag}</span>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="triage-actions">
        <button className="triage-btn triage-btn-left" onClick={handleArchive}>
          <span className="tba-key">←</span>
          <span className="tba-label">Archive</span>
        </button>
        <button className="triage-btn triage-btn-up" onClick={handleFocus}>
          <span className="tba-key">↑</span>
          <span className="tba-label">Focus</span>
        </button>
        <button className="triage-btn triage-btn-right" onClick={handleKeep}>
          <span className="tba-key">→</span>
          <span className="tba-label">Keep</span>
        </button>
      </div>

      <p className="triage-hint">arrow keys · auto-keeps on timeout</p>
    </div>
  );
}
