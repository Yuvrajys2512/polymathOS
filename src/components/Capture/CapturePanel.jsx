import { useState, useRef, useEffect, useCallback } from 'react';
import { localClassify } from '../../utils/classify.js';
import { triggerCaptureParticles } from '../../utils/captureParticles.js';

const ROUTING_DELAY = 380;

export default function CapturePanel({ onSubmit, captureRef, groqKey, placeholder, onStorm }) {
  const [draft,         setDraft]         = useState('');
  const [isFocused,     setIsFocused]     = useState(false);
  const [routingState,  setRoutingState]  = useState('idle');
  const [routingResult, setRoutingResult] = useState(null);
  const [isSuper,       setIsSuper]       = useState(false);
  const [voiceActive,   setVoiceActive]   = useState(false);
  const [interimText,   setInterimText]   = useState('');
  const debounceRef    = useRef(null);
  const recognitionRef = useRef(null);

  // Live classification as user types
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!isFocused)       { setRoutingState('idle'); return; }
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
    if (captureRef?.current) triggerCaptureParticles(captureRef.current);
    onSubmit(draft.trim(), groqKey, { superposition: isSuper });
    setDraft('');
    setRoutingState('idle');
    setRoutingResult(null);
    setIsSuper(false);
  }, [draft, groqKey, onSubmit, captureRef, isSuper]);

  // Voice capture
  function startVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Voice capture is not supported in this browser.'); return; }
    const r = new SR();
    r.continuous      = true;
    r.interimResults  = true;
    r.lang            = 'en-US';
    r.onresult = e => {
      let final = '', interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final  += e.results[i][0].transcript + ' ';
        else                       interim += e.results[i][0].transcript;
      }
      if (final) setDraft(prev => (prev + final).trim() + ' ');
      setInterimText(interim);
    };
    r.onend = () => { setVoiceActive(false); setInterimText(''); };
    r.onerror = () => { setVoiceActive(false); setInterimText(''); };
    recognitionRef.current = r;
    r.start();
    setVoiceActive(true);
  }

  function stopVoice() {
    recognitionRef.current?.stop();
    setVoiceActive(false);
    setInterimText('');
  }

  useEffect(() => () => recognitionRef.current?.stop(), []);

  const pri      = routingResult?.priority;
  const priColor = pri === 'high' ? '#f87171' : pri === 'medium' ? '#fbbf24' : 'var(--muted)';

  return (
    <section className={`panel capture-panel${isSuper ? ' capture-super' : ''}`}>
      <div className="panel-head">
        <h2>Capture</h2>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {/* Superposition toggle */}
          <button
            className={`capture-super-btn${isSuper ? ' active' : ''}`}
            onClick={() => setIsSuper(v => !v)}
            title="Quantum superposition — uncertain thought, will collapse on action"
          >
            ⟨ψ⟩
          </button>
          {/* Voice capture */}
          <button
            className={`capture-voice-btn${voiceActive ? ' recording' : ''}`}
            onClick={voiceActive ? stopVoice : startVoice}
            title={voiceActive ? 'Stop listening' : 'Voice capture'}
          >
            {voiceActive ? (
              <span className="voice-wave">
                <span /><span /><span /><span />
              </span>
            ) : '♪'}
          </button>
          {onStorm && (
            <button
              className="capture-storm-btn"
              onClick={onStorm}
              title="Neural Storm — rapid-fire capture mode"
            >
              ⚡
            </button>
          )}
        </div>
      </div>

      <div className="capture-textarea-wrap">
        <textarea
          ref={captureRef}
          className={`capture-textarea${isSuper ? ' super-shimmer' : ''}`}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={e => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); handle(); }
          }}
          placeholder={
            voiceActive
              ? 'Listening…'
              : isSuper
              ? 'Uncertain thought — reality undecided until observed…'
              : placeholder || 'Dump the raw thought. No categories, no cleanup.'
          }
        />
        {voiceActive && interimText && (
          <div className="voice-interim">{interimText}</div>
        )}
      </div>

      {/* Agentic routing terminal */}
      <div className={`routing-terminal${routingState === 'idle' ? ' routing-hidden' : ''}`}>
        <span className="routing-prompt">›</span>
        {routingState === 'focus' && (
          <span className="routing-text routing-dim">AWAITING INPUT<span className="routing-cursor" /></span>
        )}
        {routingState === 'analyzing' && (
          <span className="routing-text">PARSING CONTEXT<span className="routing-cursor" /></span>
        )}
        {routingState === 'routed' && routingResult && (
          <span className="routing-text routing-done">
            {isSuper && <span style={{ color: '#a78bfa', marginRight: 6 }}>[SUPERPOSITION]</span>}
            ROUTING <span className="routing-arrow">→</span>{' '}
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
        <button className="primary" onClick={handle}>
          {isSuper ? '⟨ψ⟩ Superpose' : 'Capture →'}
        </button>
      </div>
    </section>
  );
}
