import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { DOMAIN_COLOR, DOMAINS } from '../../constants/index.js';

const toRgb = hex => [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];

// Each domain occupies a defined spherical lobe (phi = polar 0–PI, theta = azimuth 0–2PI)
const LOBES = {
  'AI/ML':    { p0: 0,            p1: Math.PI*0.38, t0: 0,            t1: Math.PI       },
  'Writing':  { p0: 0,            p1: Math.PI*0.38, t0: Math.PI,      t1: Math.PI*2     },
  'Business': { p0: Math.PI*0.32, p1: Math.PI*0.65, t0: 0,            t1: Math.PI*0.5   },
  'Design':   { p0: Math.PI*0.32, p1: Math.PI*0.65, t0: Math.PI*0.5,  t1: Math.PI       },
  'Physics':  { p0: Math.PI*0.32, p1: Math.PI*0.65, t0: Math.PI,      t1: Math.PI*1.5   },
  'Health':   { p0: Math.PI*0.32, p1: Math.PI*0.65, t0: Math.PI*1.5,  t1: Math.PI*2     },
  'Learning': { p0: Math.PI*0.62, p1: Math.PI,      t0: 0,            t1: Math.PI       },
  'Life':     { p0: Math.PI*0.62, p1: Math.PI,      t0: Math.PI,      t1: Math.PI*2     },
};

function lobePoint(L) {
  const phi   = L.p0 + Math.random() * (L.p1 - L.p0);
  const theta = L.t0 + Math.random() * (L.t1 - L.t0);
  const sp = Math.sin(phi);
  return [sp * Math.cos(theta), Math.cos(phi), sp * Math.sin(theta)];
}

function lobeCentroid(L) {
  const phi   = (L.p0 + L.p1) / 2;
  const theta = (L.t0 + L.t1) / 2;
  const sp = Math.sin(phi);
  return [sp * Math.cos(theta), Math.cos(phi), sp * Math.sin(theta)];
}

function proj(x, y, z, cx, cy, S, ry) {
  const cos = Math.cos(ry), sin = Math.sin(ry);
  const rx = x * cos - z * sin;
  const rz = x * sin + z * cos;
  const f  = 360 / (360 + rz * S);
  return { px: cx + rx * S * f, py: cy + y * S * f, depth: rz, f };
}

const PER_DOMAIN = 16; // nodes per domain lobe

export default function NeuralStorm({ game }) {
  const canvasRef     = useRef(null);
  const rafRef        = useRef(null);
  const fireRef       = useRef(null);
  const dragRef       = useRef({ active: false, lastX: 0, ry: 0.3 });
  const mouseRef      = useRef({ x: -9999, y: -9999 });
  const focusRef      = useRef(null);
  const domDataRef    = useRef([]);
  const [focusDomain, setFocusDomain] = useState(null);
  const [hovDomain,   setHovDomain]   = useState(null);
  const [synapseRate, setSynapseRate] = useState(0);
  const [brainState,  setBrainState]  = useState('IDLE');
  const { state } = game;

  const domainData = useMemo(() => {
    const xp  = state.xp || {};
    const maxXp = Math.max(1, ...DOMAINS.map(d => xp[d] || 0));
    const counts = {};
    (state.thoughts || []).forEach(t => { counts[t.domain] = (counts[t.domain] || 0) + 1; });
    return DOMAINS.map(d => ({
      domain: d,
      xp:     xp[d] || 0,
      xpNorm: (xp[d] || 0) / maxXp,
      count:  counts[d] || 0,
      color:  DOMAIN_COLOR[d] || '#00d9b1',
      rgb:    toRgb(DOMAIN_COLOR[d] || '#00d9b1'),
    }));
  }, [state.xp, state.thoughts]);

  // Brain state
  useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayS = (state.sessions  || []).filter(s => s.at?.startsWith(today)).length;
    const todayT = (state.thoughts  || []).filter(t => t.createdAt?.startsWith(today));
    const domains = new Set(todayT.map(t => t.domain));
    if (todayS >= 2)          setBrainState('DEEP FOCUS');
    else if (domains.size >= 4) setBrainState('DIVERGENT');
    else if (todayT.length >= 10) setBrainState('HIGH FLOW');
    else if (todayT.length >= 3)  setBrainState('ACTIVE');
    else                          setBrainState('IDLE');
  }, [state.sessions, state.thoughts]);

  // Keep refs current every render (no effect re-run)
  domDataRef.current  = domainData;
  focusRef.current    = focusDomain;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Build domain-clustered nodes
    const nodes = [];
    const byDomain = {}; // domain → node indices
    DOMAINS.forEach(domain => {
      byDomain[domain] = [];
      for (let i = 0; i < PER_DOMAIN; i++) {
        const [x, y, z] = lobePoint(LOBES[domain]);
        const [r, g, b] = toRgb(DOMAIN_COLOR[domain] || '#00d9b1');
        byDomain[domain].push(nodes.length);
        nodes.push({ x, y, z, r, g, b, domain, fire: 0, sz: 1.8 + Math.random() * 1.0, ph: Math.random() * 6.28 });
      }
    });
    const N = nodes.length;

    // Edges — prefer intra-domain, allow inter-domain at larger distance
    const edges = [];
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dz = nodes[i].z - nodes[j].z;
        const d  = Math.sqrt(dx*dx + dy*dy + dz*dz);
        const sameDomain = nodes[i].domain === nodes[j].domain;
        const thresh = sameDomain ? 0.62 : 0.38;
        if (d < thresh) edges.push({ i, j, d, same: sameDomain });
      }
    }

    // Domain centroids for floating labels
    const centroids = {};
    DOMAINS.forEach(d => { centroids[d] = lobeCentroid(LOBES[d]); });

    const bolts = [];
    let lastFire = 0;
    let boltCount = 0;
    let lastRateReset = 0;

    function spawnBolt(domain) {
      const pool = domain ? byDomain[domain] : null;
      const fi = pool
        ? pool[Math.floor(Math.random() * pool.length)]
        : Math.floor(Math.random() * N);
      const conn = edges.filter(e => (e.i === fi || e.j === fi));
      if (!conn.length) return;
      const edge = conn[Math.floor(Math.random() * conn.length)];
      const ti   = edge.i === fi ? edge.j : edge.i;
      bolts.push({
        fi, ti, life: 1,
        decay: 0.024 + Math.random() * 0.04,
        r: nodes[fi].r, g: nodes[fi].g, b: nodes[fi].b,
        cross: !edge.same,
        jitter: Array.from({ length: 10 }, () => (Math.random() - 0.5) * 0.075),
      });
      nodes[fi].fire = 1;
      nodes[ti].fire = 0.82;
      boltCount++;
      if (Math.random() < 0.45) setTimeout(() => spawnBolt(domain), 65 + Math.random() * 95);
    }

    fireRef.current = (domain) => {
      const n = domain ? 16 : 14;
      for (let i = 0; i < n; i++) setTimeout(() => spawnBolt(domain), i * 48);
    };

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
      const S  = Math.min(W, H) * 0.38;
      const t  = now * 0.001;
      const ry = dragRef.current.ry;

      // Auto-rotate when not dragging
      if (!dragRef.current.active) dragRef.current.ry += 0.0025;

      // Synapse rate
      if (now - lastRateReset > 1000) {
        setSynapseRate(boltCount);
        boltCount = 0;
        lastRateReset = now;
      }

      // Auto-fire
      const focus = focusRef.current;
      if (now - lastFire > (focus ? 350 : 550) + Math.random() * 350) {
        spawnBolt(focus || undefined);
        lastFire = now;
      }

      ctx.clearRect(0, 0, W, H);

      // Deep background pulse
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, S * 1.4);
      bg.addColorStop(0, 'rgba(0,30,50,0.35)');
      bg.addColorStop(0.6, 'rgba(0,10,20,0.15)');
      bg.addColorStop(1, 'transparent');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      // Sphere wireframe outline — makes the globe legible
      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, S, 0, 6.28);
      ctx.strokeStyle = 'rgba(0,217,177,0.09)'; ctx.lineWidth = 1; ctx.stroke();
      // Latitude rings
      for (const lat of [0.35, 0.65]) {
        const latY   = cy - S * Math.cos(lat * Math.PI) * 0.18;
        const latRad = S * Math.sin(lat * Math.PI) * 0.92;
        ctx.beginPath(); ctx.ellipse(cx, cy, latRad, latRad * 0.12, 0, 0, 6.28);
        ctx.strokeStyle = 'rgba(0,217,177,0.05)'; ctx.lineWidth = 0.6; ctx.stroke();
      }
      // Vertical meridian
      ctx.beginPath(); ctx.ellipse(cx, cy, S * 0.08, S, 0, 0, 6.28);
      ctx.strokeStyle = 'rgba(0,217,177,0.05)'; ctx.lineWidth = 0.6; ctx.stroke();
      ctx.restore();

      const cos = Math.cos(ry), sin = Math.sin(ry);
      const domData = domDataRef.current;

      const ps = nodes.map(n => {
        const rx = n.x * cos - n.z * sin;
        const rz = n.x * sin + n.z * cos;
        const f  = 360 / (360 + rz * S);
        return { px: cx + rx * S * f, py: cy + n.y * S * f, depth: rz, f };
      });

      // Edges
      for (const { i, j, d, same } of edges) {
        const pi = ps[i], pj = ps[j];
        const ni = nodes[i], nj = nodes[j];
        const focused = focus ? (ni.domain === focus || nj.domain === focus) : true;
        if (!focused) continue;
        const avg   = (pi.depth + pj.depth) / 2;
        const depA  = Math.max(0, (avg + 1) * 0.5);
        const fireB = (ni.fire + nj.fire) * 0.2;
        const base  = same ? 0.32 : 0.1;
        const alpha = (1 - d / (same ? 0.62 : 0.38)) * base * depA + fireB;
        if (alpha < 0.006) continue;
        ctx.lineWidth = same ? 0.6 : 0.35;
        ctx.strokeStyle = same
          ? `rgba(${ni.r},${ni.g},${ni.b},${Math.min(0.8, alpha)})`
          : `rgba(0,217,177,${Math.min(0.4, alpha)})`;
        ctx.beginPath(); ctx.moveTo(pi.px, pi.py); ctx.lineTo(pj.px, pj.py); ctx.stroke();
      }

      // Bolts
      for (let bi = bolts.length - 1; bi >= 0; bi--) {
        const b = bolts[bi]; b.life -= b.decay;
        if (b.life <= 0) { bolts.splice(bi, 1); continue; }
        const pf = ps[b.fi], pt2 = ps[b.ti];
        ctx.save();
        ctx.shadowBlur   = b.cross ? 22 : 15;
        ctx.shadowColor  = `rgb(${b.r},${b.g},${b.b})`;
        ctx.strokeStyle  = `rgba(${b.r},${b.g},${b.b},${b.life * 0.94})`;
        ctx.lineWidth    = (b.cross ? 2.8 : 2.2) * b.life;
        ctx.beginPath(); ctx.moveTo(pf.px, pf.py);
        for (let s = 1; s < 10; s++) {
          const tt = s / 10, perp = 1 - Math.abs(tt - 0.5) * 2;
          ctx.lineTo(
            pf.px + (pt2.px - pf.px) * tt + b.jitter[s % 10] * S * perp,
            pf.py + (pt2.py - pf.py) * tt + b.jitter[(s + 5) % 10] * S * 0.38 * perp,
          );
        }
        ctx.lineTo(pt2.px, pt2.py); ctx.stroke(); ctx.restore();
      }

      // Domain lobe labels (floating on sphere surface)
      ctx.textAlign = 'center';
      for (const domain of DOMAINS) {
        const c  = centroids[domain];
        const rx = c[0] * cos - c[2] * sin;
        const rz = c[0] * sin + c[2] * cos;
        if (rz < 0.05) continue; // behind sphere
        const f   = 360 / (360 + rz * S);
        const lx  = cx + rx * S * f;
        const ly  = cy + c[1] * S * f;
        const isFocus = focus === domain;
        const [r, g, b] = toRgb(DOMAIN_COLOR[domain]);
        const depA = Math.max(0, rz + 0.8) * 0.55;
        ctx.font  = `${isFocus ? '600 ' : ''}9.5px monospace`;
        ctx.fillStyle = `rgba(${r},${g},${b},${isFocus ? Math.min(0.9, depA * 2) : depA * 0.7})`;
        ctx.fillText(domain.toUpperCase(), lx, ly - 6);
        if (isFocus) {
          ctx.fillStyle = `rgba(${r},${g},${b},${depA * 0.4})`;
          ctx.font = '8px monospace';
          const dd = domData.find(d => d.domain === domain);
          ctx.fillText(`${dd?.count || 0}t · ${dd?.xp || 0}xp`, lx, ly + 6);
        }
      }

      // Nodes (back to front), with hover detection
      const mx = mouseRef.current.x, my = mouseRef.current.y;
      let newHov = null;
      const order = [...nodes.keys()].sort((a, b) => ps[a].depth - ps[b].depth);

      for (const i of order) {
        const n = nodes[i], p = ps[i];
        const isFocused = !focus || n.domain === focus;
        const dd        = domData.find(d => d.domain === n.domain);
        const xpMult    = 1 + (dd?.xpNorm || 0) * 1.6; // bigger nodes = more XP
        const pulse     = 0.7 + Math.sin(t * 1.8 + n.ph) * 0.3;
        const sz        = Math.max(0.5, (n.sz * xpMult * pulse + n.fire * 6) * p.f * (isFocused ? 1 : 0.25));
        const depth     = Math.max(0.06, (p.depth + 1) * 0.46);
        const alpha     = Math.min(1, depth + n.fire * 0.65) * (isFocused ? 1 : 0.1);

        // Hover hit-test (only visible front nodes)
        if (isFocused && p.depth > -0.2 && Math.hypot(mx - p.px, my - p.py) < sz + 10) {
          newHov = n.domain;
        }

        // Halo on fire
        if (n.fire > 0.12) {
          ctx.beginPath(); ctx.arc(p.px, p.py, sz * 3, 0, 6.28);
          ctx.fillStyle = `rgba(${n.r},${n.g},${n.b},${n.fire * 0.22})`; ctx.fill();
        }

        // Core node
        if (n.fire > 0.42) { ctx.save(); ctx.shadowBlur = 18; ctx.shadowColor = `rgb(${n.r},${n.g},${n.b})`; }
        ctx.beginPath(); ctx.arc(p.px, p.py, Math.max(0.4, sz), 0, 6.28);
        ctx.fillStyle = `rgba(${n.r},${n.g},${n.b},${alpha})`; ctx.fill();
        if (n.fire > 0.42) ctx.restore();

        n.fire = Math.max(0, n.fire - 0.02);
      }

      // Hover tooltip
      if (newHov) {
        const dd = domData.find(d => d.domain === newHov);
        const hcol = DOMAIN_COLOR[newHov];
        const hx = mx + 16, hy = my;
        ctx.fillStyle = 'rgba(6,6,15,0.82)';
        ctx.beginPath(); ctx.roundRect?.(hx - 4, hy - 14, 130, 36, 6);
        ctx.fill?.();
        ctx.font = 'bold 11px monospace'; ctx.textAlign = 'left';
        ctx.fillStyle = hcol;
        ctx.fillText(newHov, hx, hy + 2);
        ctx.font = '9px monospace'; ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText(`${dd?.count || 0} thoughts  ·  ${dd?.xp || 0} XP`, hx, hy + 16);
      }
      if (newHov !== hovDomain) setHovDomain(newHov);

      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, []); // runs once — reads dynamic data via refs

  // Mouse drag handlers
  const onMouseDown = useCallback(e => {
    dragRef.current.active = true;
    dragRef.current.lastX  = e.clientX;
    canvasRef.current.style.cursor = 'grabbing';
  }, []);
  const onMouseMove = useCallback(e => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) { mouseRef.current.x = e.clientX - rect.left; mouseRef.current.y = e.clientY - rect.top; }
    if (dragRef.current.active) {
      dragRef.current.ry += (e.clientX - dragRef.current.lastX) * 0.009;
      dragRef.current.lastX = e.clientX;
    }
  }, []);
  const onMouseUp   = useCallback(() => { dragRef.current.active = false; if (canvasRef.current) canvasRef.current.style.cursor = 'grab'; }, []);
  const onMouseLeave = useCallback(() => { dragRef.current.active = false; mouseRef.current = { x: -9999, y: -9999 }; }, []);

  const handleDomainClick = (domain) => {
    const next = focusDomain === domain ? null : domain;
    setFocusDomain(next);
    if (next) fireRef.current?.(next);
  };

  const stateColor = { 'DEEP FOCUS': '#60a5fa', 'DIVERGENT': '#a78bfa', 'HIGH FLOW': '#00d9b1', 'ACTIVE': '#4ade80', 'IDLE': 'rgba(255,255,255,0.3)' };

  return (
    <div className="neural-root">
      <div className="neural-canvas-wrap">
        <canvas
          ref={canvasRef}
          className="neural-canvas"
          style={{ cursor: 'grab' }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseLeave}
        />
        <div className="neural-overlay-tl">
          <span className="neural-state-dot" style={{ background: stateColor[brainState] }} />
          <span className="neural-state-txt" style={{ color: stateColor[brainState] }}>{brainState}</span>
        </div>
        <div className="neural-overlay-tr">
          <span className="neural-hz">{synapseRate}</span>
          <span className="neural-hz-lbl">syn/s</span>
        </div>
        <div className="neural-hint">drag to rotate · hover nodes · click domain to isolate lobe</div>
      </div>

      <div className="neural-sidebar">
        <div className="cosmos-feat-title">NEURAL MAP</div>
        <p className="cosmos-feat-desc">
          Domain-clustered brain. Each lobe contains nodes weighted by XP. Cross-lobe bolts show knowledge connections.
        </p>

        <div className="neural-state-card">
          <div className="neural-state-card-label">BRAIN STATE</div>
          <div className="neural-state-card-val" style={{ color: stateColor[brainState] }}>{brainState}</div>
          <div className="neural-state-card-sub">{synapseRate} synapses / sec</div>
        </div>

        <div className="neural-domain-list">
          {domainData.map(d => {
            const isFocus = focusDomain === d.domain;
            const isHov   = hovDomain   === d.domain;
            return (
              <div
                key={d.domain}
                className={`neural-domain-row${isFocus ? ' focus' : ''}${isHov ? ' hov' : ''}`}
                style={{ '--dc': d.color }}
                onClick={() => handleDomainClick(d.domain)}
              >
                <div className="neural-dot" style={{ background: d.color, boxShadow: isFocus ? `0 0 8px ${d.color}` : 'none' }} />
                <div className="neural-domain-mid">
                  <span className="neural-dn">{d.domain}</span>
                  <div className="neural-xp-track">
                    <div className="neural-xp-fill" style={{
                      width: `${d.xpNorm * 100}%`,
                      background: d.color,
                      boxShadow: isFocus ? `0 0 5px ${d.color}` : 'none',
                    }} />
                  </div>
                </div>
                <div className="neural-domain-right">
                  <span className="neural-dc">{d.count}</span>
                  <span className="neural-xp-num">{d.xp} xp</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="neural-actions">
          <button
            className="neural-storm-btn"
            onClick={() => fireRef.current?.(focusDomain || undefined)}
          >
            ⚡ {focusDomain ? `STORM ${focusDomain.slice(0,6).toUpperCase()}` : 'TRIGGER STORM'}
          </button>
          {focusDomain && (
            <button className="neural-clear-btn" onClick={() => setFocusDomain(null)}>
              ✕ CLEAR
            </button>
          )}
        </div>

        <div className="neural-stats-grid">
          <div className="neural-stat">
            <b>{(state.thoughts||[]).length}</b>
            <span>signals</span>
          </div>
          <div className="neural-stat">
            <b>{(state.sessions||[]).length}</b>
            <span>sessions</span>
          </div>
        </div>
      </div>
    </div>
  );
}
