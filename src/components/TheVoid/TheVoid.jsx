import { useEffect, useRef, useState, useCallback } from 'react';

export default function TheVoid({ game }) {
  const canvasRef   = useRef(null);
  const rafRef      = useRef(null);
  const inputRef    = useRef(null);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const particlesRef = useRef([]);
  const echoesRef    = useRef([]);
  const ripplesRef   = useRef([]);
  const thoughtsRef  = useRef([]);
  const { state }    = game;

  thoughtsRef.current = state.thoughts || [];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const ro = new ResizeObserver(() => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    });
    ro.observe(canvas);
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Ambient field — tiny slow drifting dots
    const ambientPts = Array.from({ length: 60 }, () => ({
      x: Math.random() * 2000, y: Math.random() * 1000,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      alpha: 0.03 + Math.random() * 0.07,
      r: 0.8 + Math.random() * 0.8,
    }));

    let lastEcho = 0;

    function spawnEcho(W, H) {
      const thoughts = thoughtsRef.current;
      if (thoughts.length === 0) return;
      const t = thoughts[Math.floor(Math.random() * thoughts.length)];
      const txt = t.text?.slice(0, 50) || '';
      if (!txt) return;
      const fromLeft = Math.random() > 0.5;
      echoesRef.current.push({
        text: txt,
        x: fromLeft ? -200 : W + 200,
        y: H * (0.2 + Math.random() * 0.6),
        vx: fromLeft ? 0.4 + Math.random() * 0.3 : -(0.4 + Math.random() * 0.3),
        alpha: 0,
        maxAlpha: 0.22 + Math.random() * 0.12,
        life: 1,
        fadeIn: true,
      });
    }

    function tick(now) {
      const W = canvas.width, H = canvas.height;
      const cx = W / 2, cy = H / 2;
      ctx.clearRect(0, 0, W, H);

      // void background
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, W, H);

      // center very subtle glow
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.4);
      cg.addColorStop(0, 'rgba(0,217,177,0.025)');
      cg.addColorStop(1, 'transparent');
      ctx.fillStyle = cg; ctx.fillRect(0, 0, W, H);

      // ambient dots
      for (const p of ambientPts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.28);
        ctx.fillStyle = `rgba(0,217,177,${p.alpha})`; ctx.fill();
      }

      // ripples
      for (let ri = ripplesRef.current.length - 1; ri >= 0; ri--) {
        const rp = ripplesRef.current[ri];
        rp.r += 2.5; rp.alpha -= 0.008;
        if (rp.alpha <= 0) { ripplesRef.current.splice(ri, 1); continue; }
        ctx.beginPath(); ctx.arc(rp.x, rp.y, rp.r, 0, 6.28);
        ctx.strokeStyle = `rgba(0,217,177,${rp.alpha})`; ctx.lineWidth = 1; ctx.stroke();
      }

      // text burst particles
      for (let pi = particlesRef.current.length - 1; pi >= 0; pi--) {
        const p = particlesRef.current[pi];
        p.x += p.vx; p.y += p.vy;
        p.vx *= 0.97; p.vy *= 0.97;
        p.alpha -= 0.008;
        p.size  *= 0.995;
        if (p.alpha <= 0) { particlesRef.current.splice(pi, 1); continue; }
        ctx.font = `${p.size}px monospace`;
        ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${p.alpha})`;
        ctx.fillText(p.char, p.x, p.y);
      }

      // echoes
      if (now - lastEcho > 5000 + Math.random() * 4000) {
        spawnEcho(W, H);
        lastEcho = now;
      }
      for (let ei = echoesRef.current.length - 1; ei >= 0; ei--) {
        const e = echoesRef.current[ei];
        e.x += e.vx;
        if (e.fadeIn) {
          e.alpha = Math.min(e.maxAlpha, e.alpha + 0.004);
          if (e.alpha >= e.maxAlpha) e.fadeIn = false;
        } else {
          e.alpha -= 0.001;
        }
        if (e.alpha <= 0 || e.x < -300 || e.x > W + 300) {
          echoesRef.current.splice(ei, 1); continue;
        }
        ctx.font = '11px monospace';
        ctx.fillStyle = `rgba(0,217,177,${e.alpha})`;
        ctx.fillText(e.text, e.x, e.y);
      }

      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, []);

  const burstText = useCallback((str) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cx = canvas.width / 2, cy = canvas.height / 2;
    const chars = str.split('');
    chars.forEach((ch, i) => {
      const angle = (i / chars.length) * Math.PI * 2 + Math.random() * 0.3;
      const speed = 1.5 + Math.random() * 2.5;
      const bright = Math.random() > 0.7;
      particlesRef.current.push({
        char: ch,
        x: cx + (Math.random() - 0.5) * 40,
        y: cy + (Math.random() - 0.5) * 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        alpha: 0.9,
        size: bright ? 18 + Math.random() * 8 : 12 + Math.random() * 4,
        r: bright ? 0 : 200,
        g: bright ? 217 : 220,
        b: bright ? 177 : 240,
      });
    });
    // ripple at center
    ripplesRef.current.push({ x: cx, y: cy, r: 10, alpha: 0.5 });
    ripplesRef.current.push({ x: cx, y: cy, r: 2,  alpha: 0.3 });
  }, []);

  const handleSubmit = () => {
    if (!text.trim() || sending) return;
    const txt = text.trim();
    burstText(txt);
    setText('');
    setSending(true);
    game.submitThought(txt, state.apiKey).finally(() => setSending(false));
  };

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    ripplesRef.current.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, r: 5, alpha: 0.4 });
    inputRef.current?.focus();
  };

  return (
    <div className="void-root">
      <canvas ref={canvasRef} className="void-canvas" onClick={handleCanvasClick} />
      <div className="void-hint">speak into the void · thoughts drift · echoes return</div>
      <div className="void-input-wrap">
        <input
          ref={inputRef}
          className="void-input"
          value={text}
          placeholder="type here..."
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
          disabled={sending}
          autoComplete="off"
          spellCheck="false"
        />
        <button
          className="void-send"
          onClick={handleSubmit}
          disabled={!text.trim() || sending}
        >
          {sending ? '···' : '↑'}
        </button>
      </div>
    </div>
  );
}
