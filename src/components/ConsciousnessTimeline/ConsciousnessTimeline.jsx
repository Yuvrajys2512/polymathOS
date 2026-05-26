import { useRef, useEffect, useMemo } from 'react';
import { DOMAIN_COLOR, DOMAINS } from '../../constants/index.js';

const DAY_W   = 52;  // px per day at zoom 1
const LANE_H  = 32;  // px per domain lane
const TOP_PAD = 46;  // px for time axis

function hexRgb(hex) {
  if (!hex?.startsWith('#')) return '120,120,140';
  return `${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)}`;
}

export default function ConsciousnessTimeline({ thoughts, sessions }) {
  const canvasRef = useRef(null);
  const camRef    = useRef({ x: 0 });
  const frameRef  = useRef(null);

  const events = useMemo(() => {
    const todayMs = new Date().setHours(0,0,0,0);
    const toX = iso => {
      if (!iso) return null;
      const d = new Date(iso); d.setHours(0,0,0,0);
      return -Math.round((todayMs - d) / 86400000) * DAY_W;
    };
    const out = [];
    for (const t of (thoughts || [])) {
      const x = toX(t.createdAt);
      if (x === null) continue;
      const li = DOMAINS.indexOf(t.domain);
      if (li < 0) continue;
      out.push({ kind: 'thought', x, li, col: DOMAIN_COLOR[t.domain] || '#6b7280', done: t.done, text: t.text });
    }
    for (const s of (sessions || [])) {
      const x = toX(s.at);
      if (x === null) continue;
      const li = DOMAINS.indexOf(s.domain);
      if (li < 0) continue;
      out.push({ kind: 'session', x, li, col: DOMAIN_COLOR[s.domain] || '#6b7280', minutes: s.minutes || 0 });
    }
    return out;
  }, [thoughts?.length, sessions?.length]);

  // Touch / mouse pan
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let startX = 0, startCam = 0, active = false;

    const downFn = e => {
      active = true;
      const c = e.touches ? e.touches[0] : e;
      startX = c.clientX; startCam = camRef.current.x;
    };
    const moveFn = e => {
      if (!active) return;
      if (e.cancelable) e.preventDefault();
      const c = e.touches ? e.touches[0] : e;
      camRef.current.x = startCam + (c.clientX - startX);
    };
    const upFn = () => { active = false; };

    canvas.addEventListener('touchstart', downFn, { passive: true });
    canvas.addEventListener('touchmove',  moveFn, { passive: false });
    canvas.addEventListener('touchend',   upFn);
    canvas.addEventListener('mousedown',  downFn);
    window.addEventListener('mousemove',  moveFn);
    window.addEventListener('mouseup',    upFn);
    return () => {
      canvas.removeEventListener('touchstart', downFn);
      canvas.removeEventListener('touchmove',  moveFn);
      canvas.removeEventListener('touchend',   upFn);
      canvas.removeEventListener('mousedown',  downFn);
      window.removeEventListener('mousemove',  moveFn);
      window.removeEventListener('mouseup',    upFn);
    };
  }, []);

  // Draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let t = 0;

    function draw() {
      t++;
      const W = canvas.offsetWidth || 600;
      const H = canvas.offsetHeight || 340;
      if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
      ctx.clearRect(0, 0, W, H);

      const camX   = camRef.current.x;
      const originX = W * 0.82; // "today" sits at 82% from left

      // Lane backgrounds
      DOMAINS.forEach((d, li) => {
        const y   = TOP_PAD + li * LANE_H;
        const rgb = hexRgb(DOMAIN_COLOR[d] || '#6b7280');
        ctx.fillStyle = `rgba(${rgb},0.035)`;
        ctx.fillRect(0, y, W, LANE_H - 1);
        ctx.fillStyle = `rgba(${rgb},0.45)`;
        ctx.font = '9px system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(d, 4, y + LANE_H / 2 + 3);
      });

      // Today line
      const todayX = originX + camX;
      ctx.strokeStyle = 'rgba(0,217,177,0.65)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 4]);
      ctx.beginPath(); ctx.moveTo(todayX, 0); ctx.lineTo(todayX, H); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(0,217,177,0.85)';
      ctx.font = 'bold 8px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('TODAY', todayX, 16);

      // Day grid + date labels
      const leftDay  = Math.floor(-(todayX) / DAY_W) - 1;
      const rightDay = Math.ceil((W - todayX) / DAY_W) + 1;
      for (let d = leftDay; d <= rightDay; d++) {
        const lx = todayX + d * DAY_W;
        if (lx < 0 || lx > W) continue;
        ctx.strokeStyle = 'rgba(255,255,255,0.035)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(lx, TOP_PAD); ctx.lineTo(lx, H); ctx.stroke();
        if (d % 7 === 0 && d !== 0) {
          const date  = new Date(Date.now() + d * 86400000);
          const label = date.toLocaleDateString('en', { month: 'short', day: 'numeric' });
          ctx.fillStyle = 'rgba(255,255,255,0.22)';
          ctx.font = '8px system-ui, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(label, lx, 30);
        }
      }

      // Events
      for (const ev of events) {
        const ex = originX + camX + ev.x;
        if (ex < -30 || ex > W + 30) continue;
        const ey  = TOP_PAD + ev.li * LANE_H + LANE_H / 2;
        const rgb = hexRgb(ev.col);

        if (ev.kind === 'session') {
          const pulse = 0.28 + 0.18 * Math.sin(t * 0.03 + ex * 0.05);
          const g = ctx.createRadialGradient(ex, ey, 0, ex, ey, 16);
          g.addColorStop(0, `rgba(${rgb},${pulse + 0.3})`);
          g.addColorStop(1, `rgba(${rgb},0)`);
          ctx.beginPath(); ctx.arc(ex, ey, 16, 0, Math.PI * 2);
          ctx.fillStyle = g; ctx.fill();
          ctx.beginPath(); ctx.arc(ex, ey, 5, 0, Math.PI * 2);
          ctx.fillStyle   = ev.col;
          ctx.shadowBlur  = 12; ctx.shadowColor = ev.col;
          ctx.fill(); ctx.shadowBlur = 0;
        } else {
          const a = ev.done ? 0.25 : 0.72;
          ctx.beginPath(); ctx.arc(ex, ey, 3.5, 0, Math.PI * 2);
          ctx.fillStyle   = `rgba(${rgb},${a})`;
          ctx.shadowBlur  = 5; ctx.shadowColor = ev.col;
          ctx.fill(); ctx.shadowBlur = 0;
        }
      }

      frameRef.current = requestAnimationFrame(draw);
    }
    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, [events]);

  return (
    <div className="timeline-root">
      <div className="timeline-hint">← drag to travel through time →  ·  dots = thoughts  ·  glows = sessions</div>
      <canvas ref={canvasRef} className="timeline-canvas" />
    </div>
  );
}
