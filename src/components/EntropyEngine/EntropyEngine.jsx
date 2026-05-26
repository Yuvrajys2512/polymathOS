import { useEffect, useRef, useMemo } from 'react';
import { todayStr } from '../../utils/game.js';

function calcEntropy(state) {
  const today = todayStr();
  const streakBonus  = Math.min(1, (state.streak?.count || 0) / 21);
  const habits       = state.habits || [];
  const habitsToday  = habits.filter(h => h.dates?.includes(today)).length;
  const habitBonus   = habits.length > 0 ? habitsToday / habits.length : 0;
  const sessions     = state.sessions || [];
  const lastSession  = sessions.length > 0 ? sessions[sessions.length - 1] : null;
  const hoursSince   = lastSession
    ? (Date.now() - new Date(lastSession.at).getTime()) / 3600000
    : 72;
  const sessionBonus = Math.max(0, 1 - hoursSince / 48);
  const todos        = state.todos || [];
  const todosToday   = todos.filter(t => t.done && t.doneAt?.startsWith(today)).length;
  const todoBonus    = Math.min(1, todosToday / 5);
  const order        = streakBonus * 0.38 + habitBonus * 0.28 + sessionBonus * 0.2 + todoBonus * 0.14;
  return {
    level: Math.max(0.02, Math.min(0.98, 1 - order)),
    streakBonus, habitBonus, sessionBonus, todoBonus,
    habitsToday, habitsTotal: habits.length,
    todosToday, streakDays: state.streak?.count || 0,
  };
}

const SPACING = 38;

function buildLattice(W, H) {
  const pts = [];
  const rows = Math.ceil(H / (SPACING * 0.866)) + 2;
  const cols = Math.ceil(W / SPACING) + 2;
  for (let r = -1; r < rows; r++) {
    for (let c = -1; c < cols; c++) {
      pts.push([c * SPACING + (r % 2) * (SPACING / 2), r * SPACING * 0.866]);
    }
  }
  return pts;
}

function drawHex(ctx, x, y, r) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
    if (i === 0) ctx.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
    else ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
  }
  ctx.closePath();
}

export default function EntropyEngine({ game }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const entrRef   = useRef(null);
  const { state } = game;

  const entr = useMemo(() => calcEntropy(state), [state.streak, state.habits, state.sessions, state.todos]);
  entrRef.current = entr;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let lattice = [];
    const crystalLevels = new Map();
    const ripples = [];
    let prevOrder = -1;

    const ro = new ResizeObserver(() => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      lattice = buildLattice(canvas.width, canvas.height);
      crystalLevels.clear();
    });
    ro.observe(canvas);
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    lattice = buildLattice(canvas.width, canvas.height);

    const N = 220;
    const particles = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 1.8,
      vy: (Math.random() - 0.5) * 1.8,
      nearD: SPACING,
    }));

    // Energy arcs between crystals when highly ordered
    const arcs = [];

    function tick(now) {
      const W = canvas.width, H = canvas.height;
      const entr = entrRef.current;
      const el   = entr.level;
      const order = 1 - el;

      // Detect order change → spawn ripple
      if (prevOrder >= 0 && Math.abs(order - prevOrder) > 0.04) {
        ripples.push({ x: W / 2, y: H / 2, r: 10, maxR: Math.min(W, H) * 0.72, alpha: 0.8 });
      }
      prevOrder = order;

      // Background — deep blue (ordered) ↔ dark crimson (chaotic)
      ctx.fillStyle = el < 0.4
        ? '#030d1c'
        : el < 0.7
        ? `rgb(${Math.round(3 + (el - 0.4) / 0.3 * 18)},${Math.round(13 - (el - 0.4) / 0.3 * 10)},${Math.round(28 - (el - 0.4) / 0.3 * 22)})`
        : '#150305';
      ctx.fillRect(0, 0, W, H);

      // Ambient background gradient
      const bg2 = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.min(W, H) * 0.6);
      if (el < 0.5) {
        bg2.addColorStop(0, `rgba(0,80,140,${order * 0.12})`);
        bg2.addColorStop(1, 'transparent');
      } else {
        bg2.addColorStop(0, `rgba(120,10,10,${el * 0.1})`);
        bg2.addColorStop(1, 'transparent');
      }
      ctx.fillStyle = bg2; ctx.fillRect(0, 0, W, H);

      // === HEX GRID (always visible) ===
      const hexR = SPACING * 0.53;
      const gridAlpha = 0.07 + order * 0.2;
      ctx.save();
      ctx.globalAlpha = gridAlpha;
      ctx.strokeStyle = el < 0.5 ? '#00d9b1' : '#f43f5e';
      ctx.lineWidth = 0.5;
      for (const [lx, ly] of lattice) {
        if (lx < -hexR || lx > W + hexR || ly < -hexR || ly > H + hexR) continue;
        drawHex(ctx, lx, ly, hexR * 0.88);
        ctx.stroke();
      }
      ctx.restore();

      // === CRYSTALS at lattice points ===
      if (order > 0.28) {
        const snapDist = SPACING * 0.52 * order;
        for (let li = 0; li < lattice.length; li++) {
          const [lx, ly] = lattice[li];
          if (lx < 0 || lx > W || ly < 0 || ly > H) continue;

          let cl = crystalLevels.get(li) || 0;
          let hasParticle = false;
          for (const p of particles) {
            if (Math.hypot(p.x - lx, p.y - ly) < snapDist) { hasParticle = true; break; }
          }
          cl = hasParticle && order > 0.45
            ? Math.min(1, cl + 0.025)
            : Math.max(0, cl - 0.012);
          crystalLevels.set(li, cl);
          if (cl < 0.04) continue;

          const cr = hexR * 0.72 * cl;
          ctx.save();
          ctx.globalAlpha = cl * order * 0.85;

          // Crystal fill
          const cg = ctx.createRadialGradient(lx, ly, 0, lx, ly, cr);
          cg.addColorStop(0, 'rgba(0,217,177,0.45)');
          cg.addColorStop(0.6, 'rgba(0,170,140,0.15)');
          cg.addColorStop(1, 'transparent');
          ctx.fillStyle = cg;
          drawHex(ctx, lx, ly, cr);
          ctx.fill();

          // Crystal outline with glow
          ctx.strokeStyle = `rgba(0,217,177,${Math.min(1, cl * 1.1)})`;
          ctx.lineWidth = 0.8 + cl * 1.2;
          ctx.shadowBlur = 10 * cl;
          ctx.shadowColor = '#00d9b1';
          drawHex(ctx, lx, ly, cr);
          ctx.stroke();

          // Inner spoke lines
          ctx.shadowBlur = 0;
          ctx.strokeStyle = `rgba(0,217,177,${cl * 0.35})`;
          ctx.lineWidth = 0.4;
          for (let k = 0; k < 6; k++) {
            const sa = (k / 6) * Math.PI * 2 - Math.PI / 6;
            ctx.beginPath();
            ctx.moveTo(lx, ly);
            ctx.lineTo(lx + Math.cos(sa) * cr * 0.85, ly + Math.sin(sa) * cr * 0.85);
            ctx.stroke();
          }

          // Center dot
          ctx.globalAlpha = cl * order;
          ctx.beginPath(); ctx.arc(lx, ly, 1.5 * cl, 0, 6.28);
          ctx.fillStyle = '#00d9b1'; ctx.fill();
          ctx.restore();
        }
      }

      // === RIPPLE WAVES ===
      for (let ri = ripples.length - 1; ri >= 0; ri--) {
        const rip = ripples[ri];
        rip.r += (rip.maxR - rip.r) * 0.04 + 3;
        rip.alpha *= 0.965;
        if (rip.alpha < 0.015 || rip.r > rip.maxR) { ripples.splice(ri, 1); continue; }
        ctx.save();
        ctx.globalAlpha = rip.alpha * 0.6;
        ctx.strokeStyle = order > 0.5 ? '#00d9b1' : '#f43f5e';
        ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.arc(rip.x, rip.y, rip.r, 0, 6.28); ctx.stroke();
        ctx.restore();
      }

      // === PARTICLES ===
      for (const p of particles) {
        let nearX = p.x, nearY = p.y, nearD = Infinity;
        for (const [lx, ly] of lattice) {
          const d = Math.hypot(lx - p.x, ly - p.y);
          if (d < nearD) { nearD = d; nearX = lx; nearY = ly; }
        }
        p.nearD = nearD;

        // Attraction
        const attract = order * 0.055;
        p.vx += (nearX - p.x) * attract;
        p.vy += (nearY - p.y) * attract;

        // Chaos
        p.vx += (Math.random() - 0.5) * el * 2.0;
        p.vy += (Math.random() - 0.5) * el * 2.0;

        const speed = Math.hypot(p.vx, p.vy);
        const maxSpeed = 1.1 + el * 3.8;
        if (speed > maxSpeed) { p.vx *= maxSpeed / speed; p.vy *= maxSpeed / speed; }

        p.vx *= 0.9; p.vy *= 0.9;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x += W; if (p.x > W) p.x -= W;
        if (p.y < 0) p.y += H; if (p.y > H) p.y -= H;

        // Color by proximity to lattice
        const proximity = Math.max(0, 1 - nearD / (SPACING * 0.75));
        let r, g, b;
        if (el < 0.5) {
          const f = 1 - proximity * 0.8;
          r = Math.round(f * 251);
          g = Math.round(217 - f * 26);
          b = Math.round(177 - f * 141);
        } else {
          const f = (el - 0.5) * 2;
          r = Math.round(251 + f * (244 - 251));
          g = Math.round(191 + f * (63 - 191));
          b = Math.round(36  + f * (94 - 36));
        }
        const pSize = 2.8 + order * 2.8 + proximity * 2.2;
        const alpha = 0.5 + order * 0.38 + proximity * 0.12;

        if (proximity > 0.45 && order > 0.35) {
          ctx.shadowBlur = 7 * proximity * order;
          ctx.shadowColor = `rgb(${r},${g},${b})`;
        }
        ctx.beginPath(); ctx.arc(p.x, p.y, pSize, 0, 6.28);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // === PARTICLE CONNECTIONS (ordered) ===
      if (order > 0.45) {
        const connDist = SPACING * 1.15;
        ctx.save();
        ctx.globalAlpha = order * 0.12;
        ctx.strokeStyle = '#00d9b1';
        ctx.lineWidth = 0.45;
        for (let i = 0; i < particles.length; i++) {
          if (Math.random() > 0.12) continue;
          for (let j = i + 1; j < particles.length; j++) {
            const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
            if (d < connDist && particles[i].nearD < SPACING * 0.48 && particles[j].nearD < SPACING * 0.48) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
        ctx.restore();
      }

      // === ENERGY ARCS between crystals (high order) ===
      if (order > 0.72 && now % 3000 < 80) {
        const crystalPts = lattice.filter((_, li) => (crystalLevels.get(li) || 0) > 0.6);
        if (crystalPts.length > 1) {
          const a = crystalPts[Math.floor(Math.random() * crystalPts.length)];
          const b = crystalPts[Math.floor(Math.random() * crystalPts.length)];
          if (a !== b) {
            arcs.push({ x1: a[0], y1: a[1], x2: b[0], y2: b[1], life: 0.18 });
          }
        }
      }
      for (let ai = arcs.length - 1; ai >= 0; ai--) {
        const arc = arcs[ai];
        arc.life -= 0.016;
        if (arc.life <= 0) { arcs.splice(ai, 1); continue; }
        ctx.save();
        ctx.globalAlpha = arc.life * 4;
        ctx.strokeStyle = '#00d9b1';
        ctx.lineWidth = 0.8;
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#00d9b1';
        ctx.setLineDash([3, 5]);
        ctx.beginPath();
        ctx.moveTo(arc.x1, arc.y1);
        const mx = (arc.x1 + arc.x2) / 2 + (Math.random() - 0.5) * 30;
        const my = (arc.y1 + arc.y2) / 2 + (Math.random() - 0.5) * 30;
        ctx.quadraticCurveTo(mx, my, arc.x2, arc.y2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, []);

  const { level, streakDays, habitsToday, habitsTotal, todosToday } = entr;
  const orderPct = Math.round((1 - level) * 100);

  const entropyLabel = () => {
    if (level < 0.2) return 'CRYSTALLIZED';
    if (level < 0.4) return 'STRUCTURED';
    if (level < 0.6) return 'FLUCTUATING';
    if (level < 0.8) return 'TURBULENT';
    return 'CHAOTIC';
  };

  return (
    <div className="entropy-root">
      <div className="entropy-canvas-wrap">
        <canvas ref={canvasRef} className="entropy-canvas" />
        <div className="entropy-hud-state">{entropyLabel()}</div>
      </div>
      <div className="entropy-sidebar">
        <div className="cosmos-feat-title">ENTROPY ENGINE</div>
        <p className="cosmos-feat-desc">
          Particle field reflects your mental order. Habits, streaks, and sessions crystallize the system into structure. Neglect dissolves it into noise.
        </p>

        <div className="entropy-gauge-wrap">
          <div className="entropy-state-label">{entropyLabel()}</div>
          <div className="entropy-gauge">
            <div className="entropy-gauge-fill"
              style={{
                height: `${orderPct}%`,
                background: level < 0.4
                  ? 'linear-gradient(to top,#00d9b1,#4ade80)'
                  : level < 0.7
                  ? 'linear-gradient(to top,#fbbf24,#f97316)'
                  : 'linear-gradient(to top,#f43f5e,#ef4444)',
                boxShadow: level < 0.4
                  ? '0 0 22px rgba(0,217,177,.6)'
                  : level < 0.7
                  ? '0 0 22px rgba(251,191,36,.5)'
                  : '0 0 22px rgba(244,63,94,.6)',
              }}
            />
          </div>
          <div className="entropy-pct">{orderPct}% ORDER</div>
        </div>

        <div className="entropy-factors">
          <div className="entropy-factor-title">STABILIZERS</div>
          {[
            { label: 'Streak',  val: entr.streakBonus,  detail: `${streakDays}d` },
            { label: 'Habits',  val: entr.habitBonus,   detail: `${habitsToday}/${habitsTotal}` },
            { label: 'Session', val: entr.sessionBonus, detail: 'recency' },
            { label: 'Tasks',   val: entr.todoBonus,    detail: `${todosToday} done` },
          ].map(f => (
            <div key={f.label} className="entropy-factor">
              <span className="entropy-factor-label">{f.label}</span>
              <div className="entropy-factor-bar">
                <div style={{ width: `${f.val * 100}%`, height: '100%',
                  background: '#00d9b1', borderRadius: 2,
                  boxShadow: `0 0 7px rgba(0,217,177,${f.val * 0.85})` }} />
              </div>
              <span className="entropy-factor-detail">{f.detail}</span>
            </div>
          ))}
        </div>

        <p className="entropy-tip">
          {level > 0.7
            ? 'High entropy detected. Complete a focus session to begin crystallization.'
            : level > 0.4
            ? 'Moderate turbulence. Check off habits to stabilize the field.'
            : 'System approaching order. Maintain the streak to crystallize fully.'}
        </p>
      </div>
    </div>
  );
}
