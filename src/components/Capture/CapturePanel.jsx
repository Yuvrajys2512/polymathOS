import { useState, useRef, useEffect, useCallback } from 'react';
import { localClassify } from '../../utils/classify.js';
import { triggerCaptureParticles } from '../../utils/captureParticles.js';

const ROUTING_DELAY = 380;

export default function CapturePanel({ onSubmit, captureRef, apiKey }) {
  const [draft,         setDraft]         = useState('');
  const [isFocused,     setIsFocused]     = useState(false);
  const [routingState,  setRoutingState]  = useState('idle');
  const [routingResult, setRoutingResult] = useState(null);
  const debounceRef = useRef(null);

  // Live classification as user types
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!isFocused)      { setRoutingState('idle'); return; }
    if (draft.length < 4) { setRoutingState('focus'); setRoutingResult(null); return; }

    setRoutingState('analyzing');
    debounceRef.current = setTimeout(() => {
      setRoutingResult(localClassify(draft));
      setRoutingState('routed');
    }, ROUTING_DELAY);

    return () => clearTimeout(debounceRef.current);
  }, [draft, isFocused]);

  const handle = useCallback(() => {
    if (!draft.trim()) return;
    // fire particles before clearing
    if (captureRef?.current) triggerCaptureParticles(captureRef.current);
    onSubmit(draft.trim(), apiKey);
    setDraft('');
    setRoutingState('idle');
    setRoutingResult(null);
  }, [draft, apiKey, onSubmit, captureRef]);

  const pri = routingResult?.priority;
  const priColor = pri === 'high' ? '#f87171' : pri === 'medium' ? '#fbbf24' : 'var(--muted)';

  return (
    <section className="panel capture-panel">
      <div className="panel-head">
        <h2>Capture</h2>
        <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <span className="kbd">Ctrl</span>
          <span style={{ color: 'var(--muted)', fontSize: 11 }}>+</span>
          <span className="kbd">↵</span>
        </span>
      </div>

      <textarea
        ref={captureRef}
        className="capture-textarea"
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => { setIsFocused(false); }}
        onKeyDown={e => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); handle(); }
        }}
        placeholder="Dump the raw thought. No categories, no cleanup."
      />

      {/* Agentic routing terminal */}
      <div className={`routing-terminal${routingState === 'idle' ? ' routing-hidden' : ''}`}>
        <span className="routing-prompt">›</span>
        {routingState === 'focus' && (
          <span className="routing-text routing-dim">
            AWAITING INPUT<span className="routing-cursor" />
          </span>
        )}
        {routingState === 'analyzing' && (
          <span className="routing-text">
            PARSING CONTEXT<span className="routing-cursor" />
          </span>
        )}
        {routingState === 'routed' && routingResult && (
          <span className="routing-text routing-done">
            ROUTING{' '}
            <span className="routing-arrow">→</span>{' '}
            <span className="routing-domain">[{routingResult.domain}]</span>
            <span className="routing-sep"> · </span>
            <span className="routing-type">{routingResult.type}</span>
            <span className="routing-sep"> · </span>
            <span style={{ color: priColor }}>{routingResult.priority}</span>
            <span className="routing-cursor" />
          </span>
        )}
      </div>

      <div className="capture-actions">
        <span className="char-count">{draft.length} chars</span>
        <button className="primary" onClick={handle}>Capture →</button>
      </div>
    </section>
  );
}
