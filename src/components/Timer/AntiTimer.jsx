import { useEffect, useRef, useMemo } from 'react';
import { fmt } from '../../utils/game.js';

const N = 52;
const FOV = 360;

function fibSphere(n, r) {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: n }, (_, i) => {
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(Math.max(0, 1 - y * y));
    const t = golden * i;
    return [rad * Math.cos(t) * r, y * r, rad * Math.sin(t) * r];
  });
}

function makeScatter(n, r) {
  return Array.from({ length: n }, () => {
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    const dr    = (0.4 + Math.random() * 0.8) * r * 2;
    return [dr * Math.sin(phi) * Math.cos(theta), dr * Math.cos(phi), dr * Math.sin(phi) * Math.sin(theta)];
  });
}

function lerp(a, b, t) { return a + (b - a) * t; }
function easeOut(t)     { return 1 - Math.pow(1 - t, 2.8); }

function rotY([x, y, z], a) { return [x * Math.cos(a) + z * Math.sin(a), y, -x * Math.sin(a) + z * Math.cos(a)]; }
function rotX([x, y, z], a) { return [x, y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)]; }
function proj([x, y, z], cx, cy) {
  const s = FOV / (FOV + z + 100);
  return [cx + x * s, cy + y * s, s];
}

function hexAlpha(color, alpha) {
  return color + Math.round(Math.max(0, Math.min(1, alpha)) * 255).toString(16).padStart(2, '0');
}

export default function AntiTimer({ remaining, totalSeconds, modeColor, running, mode }) {
  const canvasRef = useRef(null);
  const angleRef  = useRef(0);
  const rafRef    = useRef(null);
  const mouseRef  = useRef({ x: 0.5, y: 0.5 });

  // Stable refs for dynamic props (avoids restarting RAF on every tick)
  const remRef   = useRef(remaining);
  const totRef   = useRef(totalSeconds);
  const colRef   = useRef(modeColor);
  const runRef   = useRef(running);
  const modeRef2 = useRef(mode);
  useEffect(() => { remRef.current   = remaining;    }, [remaining]);
  useEffect(() => { totRef.current   = totalSeconds; }, [totalSeconds]);
  useEffect(() => { colRef.current   = modeColor;    }, [modeColor]);
  useEffect(() => { runRef.current   = running;      }, [running]);
  useEffect(() => { modeRef2.current = mode;         }, [mode]);

  const R       = 74;
  const targets = useMemo(() => fibSphere(N, R), []);
  const scatters = useMemo(() => makeScatter(N, R), []);

  const connections = useMemo(() => {
    const out = [];
    const THRESH = R * 0.85;
    for (let i = 0; i < N; i++)
      for (let j = i + 1; j < N; j++) {
        const [dx, dy, dz] = [targets[i][0] - targets[j][0], targets[i][1] - targets[j][1], targets[i][2] - targets[j][2]];
        if (Math.sqrt(dx*dx + dy*dy + dz*dz) < THRESH) out.push([i, j]);
      }
    return out;
  }, [targets]);

  useEffect(() => {
    const h = e => { mouseRef.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight }; };
    window.addEventListener('mousemove', h, { passive: true });
    return () => window.removeEventListener('mousemove', h);
  }, []);

  // Single RAF loop — reads everything from refs
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height, cx = W / 2, cy = H / 2;

    function frame() {
      const rem  = remRef.current;
      const tot  = totRef.current;
      const col  = colRef.current;
      const run  = runRef.current;
      const md   = modeRef2.current;

      ctx.clearRect(0, 0, W, H);

      const rawProg = md === 'focus' ? Math.max(0, Math.min(1, (tot - rem) / (tot || 1))) : 0;
      const ep      = easeOut(rawProg);
      const speed   = run ? 0.003 + rawProg * 0.007 : 0.0015;
      angleRef.current += speed;

      const mx = mouseRef.current.x, my = mouseRef.current.y;
      const tx = (my - 0.5) * 0.28, ty = (mx - 0.5) * 0.22;

      // Current positions (lerp scatter → target)
      const pts = targets.map((t, i) => {
        const s = scatters[i];
        let p = [lerp(s[0], t[0], ep), lerp(s[1], t[1], ep), lerp(s[2], t[2], ep)];
        p = rotX(p, tx);
        p = rotY(p, angleRef.current + ty);
        return p;
      });

      const baseAlpha = 0.25 + ep * 0.55;
      const glow      = 3 + ep * 16;

      // Connections
      ctx.lineWidth = 0.65;
      ctx.shadowColor = col;
      ctx.shadowBlur  = glow * 0.6;
      for (const [i, j] of connections) {
        const lineAlpha = ep * 0.45;
        if (lineAlpha < 0.015) continue;
        const [ax, ay] = proj(pts[i], cx, cy);
        const [bx, by] = proj(pts[j], cx, cy);
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.strokeStyle = hexAlpha(col, lineAlpha);
        ctx.stroke();
      }

      // Particles
      ctx.shadowBlur = glow;
      for (let i = 0; i < N; i++) {
        const [px, py, pz] = pts[i];
        const [sx, sy, sc] = proj([px, py, pz], cx, cy);
        const size = Math.max(0.8, (1.6 + ep * 1.6) * sc);
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fillStyle = hexAlpha(col, baseAlpha);
        ctx.fill();
      }

      // Central core glow as it crystallizes
      if (ep > 0.65) {
        const cAlpha = ((ep - 0.65) / 0.35) * 0.35;
        const cR     = 22 * ((ep - 0.65) / 0.35);
        const grad   = ctx.createRadialGradient(cx, cy, 0, cx, cy, cR);
        grad.addColorStop(0, hexAlpha(col, cAlpha));
        grad.addColorStop(1, hexAlpha(col, 0));
        ctx.fillStyle  = grad;
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(cx, cy, cR, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="anti-timer-wrap">
      <canvas ref={canvasRef} width={240} height={240} className="anti-timer-canvas" />
      <div className="anti-timer-overlay">
        <div className="timer-digits" style={{ '--mode-color': modeColor }}>{fmt(remaining)}</div>
        <div className="timer-mode-lbl">{mode}</div>
      </div>
    </div>
  );
}
