import { useState, useRef, useEffect } from 'react';

export default function CapturePanel({ onSubmit, captureRef, apiKey }) {
  const [draft, setDraft] = useState('');

  function handle() {
    if (!draft.trim()) return;
    onSubmit(draft.trim(), apiKey);
    setDraft('');
  }

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
        onKeyDown={e => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') { e.preventDefault(); handle(); } }}
        placeholder="Dump the raw thought. No categories, no cleanup."
      />
      <div className="capture-actions">
        <span className="char-count">{draft.length} chars</span>
        <button className="primary" onClick={handle}>Capture →</button>
      </div>
    </section>
  );
}
