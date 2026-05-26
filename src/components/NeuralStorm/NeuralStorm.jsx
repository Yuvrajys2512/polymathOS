import { useState, useRef, useEffect, useCallback } from 'react';

export default function NeuralStorm({ onClose, onSubmit, groqKey }) {
  const [draft,    setDraft]    = useState('');
  const [captures, setCaptures] = useState([]);
  const [ended,    setEnded]    = useState(false);
  const canvasRef    = useRef(null);
  const textRef      = useRef(null);
  const idleRef      = useRef(null);
  const particlesRef = useRef([]);
  const frameRef     = useRef(null);
  const capturesRef  = useRef([]);

  useEffect(() => { textRef.current?.focus(); }, []);

  const resetIdle = useCallback(() => {
    clearTimeout(idleRef.current);
    idleRef.current = setTimeout(() => setEnded(true), 8000);
  }, []);

  useEffect(() => {
    resetIdle();
    return () => clearTimeout(idleRef.current);
  }, [resetIdle]);

  const fire = useCallback(() => {
    const text = draft.trim();
    if (!text) return;
    onSubmit(text, groqKey);
    const updated = [text, ...capturesRef.current];
    capturesRef.current = updated;
    setCaptures([...updated]);
    setDraft('');
    resetIdle();
    const canvas = canvasRef.current;
    const W = canvas?.offsetWidth || 350;
    const H = canvas?.offsetHeight || 600;
    for (let k = 0; k < 8; k++) {
      particlesRef.current.push({
        x: W / 2 + (Math.random() - 0.5) * 60,
        y: H * 0.52,
        vx: (Math.random() - 0.5) * 5,
        vy: -3 - Math.random() * 5,
        life: 1,
        decay: 0.010 + Math.random() * 0.008,
        r: 1.5 + Math.random() * 3,
        hue: Math.random() > 0.5 ? 168 : 270,
      });
    }
  }, [draft, groqKey, onSubmit, resetIdle]);

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let t = 0;

    function frame() {
      t++;
      const W = canvas.offsetWidth, H = canvas.offsetHeight;
      if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
      ctx.clearRect(0, 0, W, H);

      // Scanline grid
      ctx.strokeStyle = 'rgba(0,217,177,0.025)';
      ctx.lineWidth = 1;
      for (let y = 0; y < H; y += 28) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
      for (let x = 0; x < W; x += 48) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }

      // Particles
      particlesRef.current = particlesRef.current.filter(p => p.life > 0);
      for (const p of particlesRef.current) {
        p.x  += p.vx;
        p.y  += p.vy;
        p.vy -= 0.06;
        p.vx *= 0.98;
        p.life -= p.decay;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},100%,65%,${p.life * 0.85})`;
        ctx.shadowBlur  = 10;
        ctx.shadowColor = `hsl(${p.hue},100%,65%)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Big count
      const n = capturesRef.current.length;
      if (n > 0) {
        const pulse = 0.06 + 0.04 * Math.sin(t * 0.05);
        const sz = Math.min(140, 52 + n * 3);
        ctx.font = `bold ${sz}px monospace`;
        ctx.fillStyle = `rgba(0,217,177,${pulse})`;
        ctx.textAlign = 'center';
        ctx.fillText(String(n), W / 2, H * 0.2);
      }

      frameRef.current = requestAnimationFrame(frame);
    }
    frameRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  if (ended) {
    const count = capturesRef.current.length;
    return (
      <div className="storm-backdrop">
        <div className="storm-report">
          <div className="storm-report-num">{count}</div>
          <div className="storm-report-label">thoughts fired</div>
          <div className="storm-report-list">
            {capturesRef.current.slice(0, 6).map((c, i) => (
              <div key={i} className="storm-report-item">
                <span className="sri-bullet">›</span>
                {c.slice(0, 68)}{c.length > 68 ? '…' : ''}
              </div>
            ))}
            {count > 6 && (
              <div className="storm-report-more">+{count - 6} more — being classified in background</div>
            )}
          </div>
          <button className="primary" onClick={onClose}>Back to Base</button>
        </div>
      </div>
    );
  }

  return (
    <div className="storm-backdrop">
      <canvas ref={canvasRef} className="storm-canvas" />
      <div className="storm-ui">
        <div className="storm-header">
          <span className="storm-title">⚡ NEURAL STORM</span>
          <span className="storm-cap-count">{captures.length} fired</span>
          <button className="storm-end-btn" onClick={() => setEnded(true)}>END</button>
        </div>

        <textarea
          ref={textRef}
          className="storm-textarea"
          value={draft}
          onChange={e => { setDraft(e.target.value); resetIdle(); }}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); fire(); }
          }}
          placeholder="Fire. Don't think. Just capture…"
        />

        <button className="storm-fire-btn" onClick={fire}>
          FIRE →
        </button>

        <div className="storm-feed">
          {captures.slice(0, 4).map((c, i) => (
            <div key={i} className="storm-feed-item" style={{ opacity: 1 - i * 0.22 }}>
              › {c.slice(0, 62)}{c.length > 62 ? '…' : ''}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
