import { useRef, useEffect, useMemo, useState } from 'react';
import { DOMAIN_COLOR } from '../../constants/index.js';

const SPACING   = 46;   // px between nodes
const AMPLITUDE = 58;   // helix wave height
const PERIOD    = 210;  // px per full cycle

export default function DNAHelix({ thoughts }) {
  const canvasRef  = useRef(null);
  const frameRef   = useRef(null);
  const panRef     = useRef(0);
  const [selected, setSelected] = useState(null);

  const nodes = useMemo(() =>
    (thoughts || [])
      .slice(0, 80)
      .map((t, i) => ({ t, i, col: DOMAIN_COLOR[t.domain] || '#6b7280' })),
    [(thoughts || []).map(t => t.id).join(',')]
  );

  // Pan interaction
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let startX = 0, startPan = 0, active = false;

    const down = e => {
      active = true;
      const c = e.touches ? e.touches[0] : e;
      startX = c.clientX; startPan = panRef.current;
    };
    const move = e => {
      if (!active) return;
      if (e.cancelable) e.preventDefault();
      const c = e.touches ? e.touches[0] : e;
      panRef.current = startPan + (c.clientX - startX);
    };
    const up = () => { active = false; };

    canvas.addEventListener('touchstart', down, { passive: true });
    canvas.addEventListener('touchmove',  move, { passive: false });
    canvas.addEventListener('touchend',   up);
    canvas.addEventListener('mousedown',  down);
    window.addEventListener('mousemove',  move);
    window.addEventListener('mouseup',    up);
    return () => {
      canvas.removeEventListener('touchstart', down);
      canvas.removeEventListener('touchmove',  move);
      canvas.removeEventListener('touchend',   up);
      canvas.removeEventListener('mousedown',  down);
      window.removeEventListener('mousemove',  move);
      window.removeEventListener('mouseup',    up);
    };
  }, []);

  // Tap to select
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cs = { x: 0, t: 0 };
    const down = e => {
      const c = e.touches ? e.touches[0] : e;
      cs = { x: c.clientX, y: c.clientY, t: Date.now() };
    };
    const up = e => {
      const c = e.changedTouches ? e.changedTouches[0] : e;
      if (Math.abs(c.clientX - cs.x) + Math.abs(c.clientY - cs.y) > 12 || Date.now() - cs.t > 320) return;
      const rect = canvas.getBoundingClientRect();
      const sx = c.clientX - rect.left, sy = c.clientY - rect.top;
      const W = canvas.offsetWidth, H = canvas.offsetHeight;
      const cy = H / 2, originX = W * 0.1 + panRef.current;
      let hit = null;
      for (const nd of nodes) {
        const ix   = originX + nd.i * SPACING;
        const wave = AMPLITUDE * Math.sin((ix / PERIOD) * Math.PI * 2);
        if (Math.sqrt((sx-ix)**2 + (sy-(cy+wave))**2) < 16 ||
            Math.sqrt((sx-ix)**2 + (sy-(cy-wave))**2) < 16) {
          hit = nd.t; break;
        }
      }
      setSelected(prev => hit ? (prev?.id === hit.id ? null : hit) : null);
    };
    canvas.addEventListener('mousedown',  down);
    canvas.addEventListener('mouseup',    up);
    canvas.addEventListener('touchstart', down, { passive: true });
    canvas.addEventListener('touchend',   up,   { passive: true });
    return () => {
      canvas.removeEventListener('mousedown',  down);
      canvas.removeEventListener('mouseup',    up);
      canvas.removeEventListener('touchstart', down);
      canvas.removeEventListener('touchend',   up);
    };
  }, [nodes]);

  // Draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let t = 0;

    function draw() {
      t++;
      const W = canvas.offsetWidth || 600;
      const H = canvas.offsetHeight || 260;
      if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
      ctx.clearRect(0, 0, W, H);

      const cy      = H / 2;
      const originX = W * 0.1 + panRef.current;

      // Draw backbone spines
      for (let strand = 0; strand < 2; strand++) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(0,217,177,0.12)';
        ctx.lineWidth = 1.5;
        for (let px = -10; px <= W + 10; px += 3) {
          const wave = AMPLITUDE * Math.sin(((px - originX) / PERIOD) * Math.PI * 2);
          const py   = cy + (strand === 0 ? wave : -wave);
          if (px === -10) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      // Nodes + base pairs
      for (const nd of nodes) {
        const ix   = originX + nd.i * SPACING;
        if (ix < -30 || ix > W + 30) continue;
        const wave  = AMPLITUDE * Math.sin((ix / PERIOD) * Math.PI * 2);
        const ayS   = cy + wave;
        const byS   = cy - wave;
        const isSel = selected?.id === nd.t.id;
        const col   = nd.col;

        // Base pair
        const pa = 0.12 + 0.06 * Math.sin(t * 0.025 + nd.i);
        ctx.strokeStyle = `rgba(255,255,255,${pa})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(ix, ayS); ctx.lineTo(ix, byS); ctx.stroke();

        // Node A (primary)
        const r = isSel ? 10 : 6.5;
        const b = 1 + 0.1 * Math.sin(t * 0.025 + nd.i * 0.7);
        ctx.beginPath(); ctx.arc(ix, ayS, r * b, 0, Math.PI * 2);
        ctx.fillStyle   = col;
        ctx.shadowBlur  = isSel ? 20 : 9;
        ctx.shadowColor = col;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Node B (mirror, faded)
        ctx.beginPath(); ctx.arc(ix, byS, (r * b) * 0.65, 0, Math.PI * 2);
        ctx.globalAlpha = 0.38;
        ctx.fillStyle   = col;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Selection ring
        if (isSel) {
          const pulse = (Math.sin(t * 0.1) + 1) / 2;
          ctx.beginPath(); ctx.arc(ix, ayS, r + 5 + pulse * 6, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255,255,255,${0.25 + pulse * 0.3})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }

      frameRef.current = requestAnimationFrame(draw);
    }
    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, [nodes, selected]);

  return (
    <div className="dna-root">
      <div className="dna-hint">drag to scroll · tap a node to inspect</div>
      <canvas ref={canvasRef} className="dna-canvas" />
      {selected && (
        <div className="dna-detail" style={{ '--dc': DOMAIN_COLOR[selected.domain] || '#6b7280' }}>
          <button className="dna-detail-close" onClick={() => setSelected(null)}>✕</button>
          <div className="dna-detail-domain">{selected.domain}</div>
          <div className="dna-detail-text">{selected.text}</div>
          {selected.insight && selected.insight !== 'Classifying…' && (
            <div className="dna-detail-insight">◆ {selected.insight}</div>
          )}
          <div className="dna-detail-meta">
            <span className="pill typ">{selected.type}</span>
            <span className={`pill ${selected.priority}`}>{selected.priority}</span>
          </div>
        </div>
      )}
    </div>
  );
}
