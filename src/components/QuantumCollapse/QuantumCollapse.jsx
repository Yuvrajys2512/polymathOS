import { useEffect, useRef, useState, useMemo } from 'react';
import { DOMAIN_COLOR } from '../../constants/index.js';

const toRgb = hex => {
  if (!hex || hex.length < 7) return [0, 217, 177];
  return [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];
};

// Equal-angle orbital layout — no overlaps ever
function orbitalPos(idx, total, cx, cy, R) {
  const angle = (idx / Math.max(total, 1)) * Math.PI * 2 - Math.PI / 2;
  return [cx + Math.cos(angle) * R, cy + Math.sin(angle) * R];
}

function drawHexGrid(ctx, W, H, spacing, alpha) {
  const h = spacing * 0.866;
  ctx.strokeStyle = `rgba(0,217,177,${alpha})`;
  ctx.lineWidth = 0.3;
  for (let row = -1; row < H / h + 2; row++) {
    for (let col = -1; col < W / (spacing * 1.5) + 2; col++) {
      const x = col * spacing * 1.5 + (row % 2) * spacing * 0.75;
      const y = row * h;
      ctx.beginPath();
      for (let s = 0; s < 6; s++) {
        const a = (s / 6) * 6.28 - 1.047;
        s === 0 ? ctx.moveTo(x + Math.cos(a) * spacing * 0.5, y + Math.sin(a) * spacing * 0.5)
                : ctx.lineTo(x + Math.cos(a) * spacing * 0.5, y + Math.sin(a) * spacing * 0.5);
      }
      ctx.closePath(); ctx.stroke();
    }
  }
}

function drawRadar(ctx, cx, cy, R, angle) {
  // Fading sweep wedge
  for (let i = 0; i < 40; i++) {
    const a = angle - (i / 40) * Math.PI * 0.7;
    const alpha = ((40 - i) / 40) * 0.06;
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R);
    ctx.strokeStyle = `rgba(0,217,177,${alpha})`; ctx.lineWidth = 1.5; ctx.stroke();
  }
  // Sweep edge line
  ctx.save(); ctx.shadowBlur = 8; ctx.shadowColor = 'rgba(0,217,177,.6)';
  ctx.beginPath(); ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(angle) * R, cy + Math.sin(angle) * R);
  ctx.strokeStyle = 'rgba(0,217,177,0.4)'; ctx.lineWidth = 1; ctx.stroke(); ctx.restore();
  // Rings
  for (const frac of [0.33, 0.66, 1]) {
    ctx.beginPath(); ctx.arc(cx, cy, R * frac, 0, 6.28);
    ctx.strokeStyle = `rgba(0,217,177,${frac === 1 ? 0.12 : 0.06})`; ctx.lineWidth = 0.5; ctx.stroke();
  }
  // Cross hairs
  ctx.beginPath();
  ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy);
  ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R);
  ctx.strokeStyle = 'rgba(0,217,177,0.04)'; ctx.lineWidth = 0.4; ctx.stroke();
}

const TYPE_ICON = { todo: '◻', task: '◈', quest: '⟁' };
const TYPE_COLOR = { todo: '#e879f9', task: '#00d9b1', quest: '#fbbf24' };

export default function QuantumCollapse({ game }) {
  const canvasRef  = useRef(null);
  const rafRef     = useRef(null);
  const animRef    = useRef({});
  const itemsRef   = useRef([]);
  const selRef     = useRef(null);
  const collRef    = useRef({});
  const [selected,  setSelected]  = useState(null);
  const [collapsed, setCollapsed] = useState({});
  const [filter,    setFilter]    = useState('all');
  const { state } = game;

  const allItems = useMemo(() => {
    const todos  = (state.todos    || []).filter(t => !t.done).slice(0, 5).map(t => ({
      id: t.id, label: t.text.slice(0, 36), type: 'todo', domain: 'Life',
    }));
    const tasks  = (state.taskBoard || []).filter(t => !t.done).slice(0, 5).map(t => ({
      id: t.id, label: t.title.slice(0, 36), type: 'task', domain: t.domain || 'Life',
    }));
    const quests = (state.quests?.list || []).filter(q => !q.done).slice(0, 3).map(q => ({
      id: q.id, label: (q.title || q.text || 'Quest').slice(0, 36), type: 'quest', domain: 'Life',
    }));
    return [...todos, ...tasks, ...quests];
  }, [state.todos, state.taskBoard, state.quests]);

  const items = useMemo(() =>
    filter === 'all' ? allItems : allItems.filter(i => i.type === filter),
  [allItems, filter]);

  itemsRef.current = items;
  selRef.current   = selected;
  collRef.current  = collapsed;

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

    function tick(now) {
      const W = canvas.width, H = canvas.height;
      const cx = W / 2, cy = H / 2;
      const t  = now * 0.001;
      const items = itemsRef.current, sel = selRef.current, coll = collRef.current;

      // Clear
      ctx.fillStyle = '#06060f'; ctx.fillRect(0, 0, W, H);

      // Hex grid backdrop
      drawHexGrid(ctx, W, H, 38, 0.028);

      // Central glow
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(W, H) * 0.5);
      cg.addColorStop(0, 'rgba(0,217,177,0.04)'); cg.addColorStop(1, 'transparent');
      ctx.fillStyle = cg; ctx.fillRect(0, 0, W, H);

      // Radar sweep
      const radarR   = Math.min(W, H) * 0.46;
      const sweepAng = (t * 0.7) % (Math.PI * 2);
      drawRadar(ctx, cx, cy, radarR, sweepAng);

      const total = items.length;
      const orbR  = Math.min(radarR * 0.72, total > 0 ? (radarR * 0.72) : 60);

      // Interference lines between nearby items
      for (let a = 0; a < total; a++) {
        for (let b = a + 1; b < total; b++) {
          if (coll[items[a].id] || coll[items[b].id]) continue;
          const [ax, ay] = orbitalPos(a, total, cx, cy, orbR);
          const [bx, by] = orbitalPos(b, total, cx, cy, orbR);
          const dist = Math.hypot(ax - bx, ay - by);
          if (dist > orbR * 0.9) continue;
          const alpha = (1 - dist / (orbR * 0.9)) * 0.12;
          const wave  = Math.sin(t * 2 + a + b) * 0.5 + 0.5;
          ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by);
          ctx.strokeStyle = `rgba(0,217,177,${alpha * wave})`; ctx.lineWidth = 0.6; ctx.stroke();
        }
      }

      // Items
      items.forEach((item, idx) => {
        if (!animRef.current[item.id]) animRef.current[item.id] = { ph: Math.random() * 6.28, cp: 0, flash: 0 };
        const ai = animRef.current[item.id];
        if (coll[item.id]) ai.cp = Math.min(1, ai.cp + 0.02);
        ai.flash = Math.max(0, ai.flash - 0.03);

        const [itemX, itemY] = orbitalPos(idx, total, cx, cy, orbR);
        const [r, g, b] = toRgb(DOMAIN_COLOR[item.domain] || TYPE_COLOR[item.type] || '#00d9b1');
        const isSel = sel === item.id;

        // Radar ping — flash when sweep line passes near
        const itemAngle = Math.atan2(itemY - cy, itemX - cx);
        const sweepDiff = ((sweepAng - itemAngle) + 6.28) % 6.28;
        if (sweepDiff < 0.12) ai.flash = 1;

        // ── Crystallized ──
        if (ai.cp >= 1) {
          ctx.save(); ctx.shadowBlur = 20; ctx.shadowColor = `rgb(${r},${g},${b})`;
          ctx.strokeStyle = `rgba(${r},${g},${b},.9)`; ctx.fillStyle = `rgba(${r},${g},${b},.12)`; ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (let s = 0; s < 6; s++) {
            const a = (s / 6) * 6.28 - 1.047;
            const x2 = itemX + Math.cos(a) * 20, y2 = itemY + Math.sin(a) * 20;
            s === 0 ? ctx.moveTo(x2, y2) : ctx.lineTo(x2, y2);
          }
          ctx.closePath(); ctx.fill(); ctx.stroke();
          // Inner spokes
          ctx.strokeStyle = `rgba(${r},${g},${b},.35)`; ctx.lineWidth = 0.5;
          for (let s = 0; s < 6; s++) {
            const a = (s / 6) * 6.28 - 1.047;
            ctx.beginPath(); ctx.moveTo(itemX, itemY);
            ctx.lineTo(itemX + Math.cos(a) * 20, itemY + Math.sin(a) * 20); ctx.stroke();
          }
          ctx.restore();
          // Glow ring
          ctx.beginPath(); ctx.arc(itemX, itemY, 24, 0, 6.28);
          ctx.strokeStyle = `rgba(${r},${g},${b},.15)`; ctx.lineWidth = 1; ctx.stroke();
          ctx.font = '8px monospace'; ctx.fillStyle = `rgba(${r},${g},${b},.7)`;
          ctx.textAlign = 'center'; ctx.fillText('◆ COLLAPSED', itemX, itemY + 34);
          return;
        }

        const fade   = 1 - ai.cp;
        const baseR  = (isSel ? 30 : 22) * fade;
        const pingA  = ai.flash * 0.6;

        // Radar ping flash ring
        if (pingA > 0.05) {
          ctx.beginPath(); ctx.arc(itemX, itemY, baseR * (1.8 + (1 - ai.flash) * 0.8), 0, 6.28);
          ctx.strokeStyle = `rgba(0,217,177,${pingA * 0.5})`; ctx.lineWidth = 1; ctx.stroke();
        }

        // Probability cloud — 5 layers
        for (let l = 4; l >= 0; l--) {
          const lr  = baseR * (1 + l * 0.22);
          const osc = Math.sin(t * 1.8 + ai.ph + l * 1.1) * 0.14;
          const la  = (0.09 - l * 0.014) * (isSel ? 2.5 : 1) * fade;
          if (la <= 0.003) continue;
          ctx.beginPath(); ctx.arc(itemX, itemY, lr * (1 + osc), 0, 6.28);
          ctx.fillStyle = `rgba(${r},${g},${b},${la})`; ctx.fill();
        }

        // Orbit ring particles
        const orbitCount = isSel ? 10 : 6;
        const orbitRad   = baseR * (isSel ? 1.45 : 1.3);
        for (let p = 0; p < orbitCount; p++) {
          const oa = (p / orbitCount) * 6.28 + t * (isSel ? 2.2 : 1.1) + ai.ph;
          const op = (isSel ? 0.75 : 0.28) * fade;
          const psize = isSel ? 2.5 : 1.5;
          const px = itemX + Math.cos(oa) * orbitRad;
          const py = itemY + Math.sin(oa) * orbitRad;
          if (isSel) { ctx.save(); ctx.shadowBlur = 6; ctx.shadowColor = `rgb(${r},${g},${b})`; }
          ctx.beginPath(); ctx.arc(px, py, psize, 0, 6.28);
          ctx.fillStyle = `rgba(${r},${g},${b},${op})`; ctx.fill();
          if (isSel) ctx.restore();
        }

        // Core node
        ctx.save();
        if (isSel) { ctx.shadowBlur = 28; ctx.shadowColor = `rgb(${r},${g},${b})`; }
        ctx.beginPath(); ctx.arc(itemX, itemY, 5.5 * fade, 0, 6.28);
        ctx.fillStyle = `rgba(${r},${g},${b},${(isSel ? 0.95 : 0.7) * fade})`; ctx.fill();
        ctx.restore();

        // Collapse vortex
        if (ai.cp > 0.04) {
          ctx.save(); ctx.shadowBlur = 8; ctx.shadowColor = `rgb(${r},${g},${b})`;
          for (let p = 0; p < 12; p++) {
            const oa = (p / 12) * 6.28 + t * 5;
            const pr = baseR * 1.5 * (1 - ai.cp * 0.9);
            ctx.beginPath(); ctx.arc(itemX + Math.cos(oa) * pr, itemY + Math.sin(oa) * pr, 2.5 * (1 - ai.cp * 0.6), 0, 6.28);
            ctx.fillStyle = `rgba(${r},${g},${b},${ai.cp * 0.9})`; ctx.fill();
          }
          ctx.restore();
        }

        // Type icon + label
        ctx.textAlign = 'center';
        ctx.font = '11px monospace';
        ctx.fillStyle = `rgba(${r},${g},${b},${(isSel ? 0.95 : 0.5) * fade})`;
        ctx.fillText(TYPE_ICON[item.type] || '◉', itemX, itemY - baseR - 10);
        ctx.font = `${isSel ? '600 ' : ''}9px monospace`;
        ctx.fillStyle = `rgba(255,255,255,${(isSel ? 0.88 : 0.38) * fade})`;
        ctx.fillText(item.label.slice(0, 18), itemX, itemY + baseR + 16);
        ctx.font = '8px monospace';
        ctx.fillStyle = `rgba(${r},${g},${b},${(isSel ? 0.7 : 0.3) * fade})`;
        ctx.fillText(item.type.toUpperCase(), itemX, itemY + baseR + 27);
      });

      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, []);

  const collapseItem = id => setCollapsed(p => ({ ...p, [id]: true }));

  const handleCanvasClick = e => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left, my = e.clientY - rect.top;
    const W  = canvasRef.current.offsetWidth, H = canvasRef.current.offsetHeight;
    const cx = W / 2, cy = H / 2;
    const orbR = Math.min(W, H) * 0.46 * 0.72;
    itemsRef.current.forEach((item, idx) => {
      const [ix, iy] = orbitalPos(idx, itemsRef.current.length, cx, cy, orbR);
      if (Math.hypot(mx - ix, my - iy) < 45) setSelected(s => s === item.id ? null : item.id);
    });
  };

  const activeItems = items.filter(i => !collapsed[i.id]);
  const collapsedCount = Object.keys(collapsed).length;

  return (
    <div className="quantum-root">
      <div className="quantum-canvas-wrap">
        <canvas ref={canvasRef} className="quantum-canvas" onClick={handleCanvasClick} />
        {items.length === 0 && (
          <div className="quantum-empty-canvas">
            All quantum states collapsed.<br />
            <span style={{ color: 'rgba(0,217,177,.4)', fontSize: 11 }}>Perfect clarity achieved.</span>
          </div>
        )}
        <div className="quantum-hud-tl">
          <span className="quantum-hud-val">{activeItems.length}</span>
          <span className="quantum-hud-lbl">superposed</span>
        </div>
        <div className="quantum-hud-tr">
          <span className="quantum-hud-val" style={{ color: '#00d9b1' }}>{collapsedCount}</span>
          <span className="quantum-hud-lbl">collapsed</span>
        </div>
      </div>

      <div className="quantum-sidebar">
        <div className="cosmos-feat-title">QUANTUM STATES</div>
        <p className="cosmos-feat-desc">Unresolved items exist in superposition. Select on canvas or list, then collapse the wavefunction.</p>

        <div className="quantum-filters">
          {['all', 'todo', 'task', 'quest'].map(f => (
            <button key={f}
              className={`quantum-filter-btn${filter === f ? ' active' : ''}`}
              style={filter === f ? { borderColor: TYPE_COLOR[f] || 'var(--accent)', color: TYPE_COLOR[f] || 'var(--accent)' } : {}}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'ALL' : `${TYPE_ICON[f]} ${f.toUpperCase()}`}
            </button>
          ))}
        </div>

        <div className="quantum-list">
          {items.length === 0 && <p className="quantum-empty">No active quantum states.</p>}
          {items.map(item => {
            const col = DOMAIN_COLOR[item.domain] || TYPE_COLOR[item.type] || '#00d9b1';
            return (
              <div key={item.id}
                className={`quantum-item${selected === item.id ? ' sel' : ''}${collapsed[item.id] ? ' done' : ''}`}
                style={selected === item.id ? { borderColor: col, background: `rgba(${toRgb(col).join(',')},0.08)` } : {}}
                onClick={() => setSelected(s => s === item.id ? null : item.id)}
              >
                <span className="quantum-type-icon" style={{ color: TYPE_COLOR[item.type] || col }}>
                  {TYPE_ICON[item.type] || '◉'}
                </span>
                <div className="quantum-item-info">
                  <span className="quantum-label" style={collapsed[item.id] ? { textDecoration: 'line-through', opacity: 0.4 } : {}}>
                    {item.label.slice(0, 26)}
                  </span>
                  <span className="quantum-meta" style={{ color: TYPE_COLOR[item.type] }}>
                    {item.type} · {item.domain}
                  </span>
                </div>
                {collapsed[item.id]
                  ? <span className="quantum-crystal" style={{ color: col }}>◆</span>
                  : selected === item.id
                    ? <button className="quantum-collapse-btn" style={{ borderColor: col, color: col }}
                        onClick={e => { e.stopPropagation(); collapseItem(item.id); }}>
                        COLLAPSE
                      </button>
                    : null
                }
              </div>
            );
          })}
        </div>

        {selected && !collapsed[selected] && (
          <button className="quantum-collapse-main"
            onClick={() => collapseItem(selected)}>
            ⧫ COLLAPSE SELECTED
          </button>
        )}
      </div>
    </div>
  );
}
