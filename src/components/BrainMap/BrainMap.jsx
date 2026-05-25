import { useEffect, useRef, useState, useMemo } from 'react';
import { DOMAINS, DOMAIN_COLOR } from '../../constants/index.js';
import { xpToLevel } from '../../utils/game.js';

function easeOutCubic(x) { return 1 - Math.pow(1 - Math.max(0, Math.min(1, x)), 3); }

/* ── Graph builder ── */
function buildGraph(state) {
  const nodes = DOMAINS.map((d, i) => ({
    id: `d:${d}`,
    label: d,
    color: DOMAIN_COLOR[d] || '#00d9b1',
    xp: state.xp?.[d] || 0,
    level: xpToLevel(state.xp?.[d] || 0),
    count: (state.thoughts || []).filter(t => t.domain === d).length,
    size: 22 + Math.min((state.xp?.[d] || 0) / 28, 26),
    phase: (i / DOMAINS.length) * Math.PI * 2,
    vx: 0, vy: 0, fx: 0, fy: 0, x: 0, y: 0,
  }));

  const byDay = {};
  (state.thoughts || []).forEach(t => {
    const day = t.createdAt?.split('T')[0];
    if (!day || !DOMAINS.includes(t.domain)) return;
    if (!byDay[day]) byDay[day] = new Set();
    byDay[day].add(t.domain);
  });

  const coCount = {};
  Object.values(byDay).forEach(doms => {
    const arr = [...doms];
    for (let i = 0; i < arr.length; i++)
      for (let j = i + 1; j < arr.length; j++) {
        const key = [arr[i], arr[j]].sort().join('|||');
        coCount[key] = (coCount[key] || 0) + 1;
      }
  });

  const domTags = {};
  (state.thoughts || []).forEach(t => {
    if (!DOMAINS.includes(t.domain)) return;
    if (!domTags[t.domain]) domTags[t.domain] = new Set();
    (t.tags || []).forEach(tag => domTags[t.domain].add(tag));
  });

  const edges = [];
  Object.entries(coCount).forEach(([key, count]) => {
    const [a, b] = key.split('|||');
    const shared = [...(domTags[a] || new Set())].filter(t => (domTags[b] || new Set()).has(t)).length;
    const strength = Math.min((count + shared * 2) / 12, 1);
    if (strength > 0) edges.push({ source: `d:${a}`, target: `d:${b}`, strength, count, shared });
  });

  return { nodes, edges };
}

/* ── Physics ── */
function simulateStep(nodes, edges, w, h) {
  const cx = w / 2, cy = h / 2;
  nodes.forEach(n => { n.fx = 0; n.fy = 0; });

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const d = Math.max(Math.hypot(dx, dy), 1);
      const f = 6500 / (d * d);
      a.fx += (dx / d) * f; a.fy += (dy / d) * f;
      b.fx -= (dx / d) * f; b.fy -= (dy / d) * f;
    }
  }

  edges.forEach(e => {
    const a = nodes.find(n => n.id === e.source);
    const b = nodes.find(n => n.id === e.target);
    if (!a || !b) return;
    const dx = b.x - a.x, dy = b.y - a.y;
    const d = Math.max(Math.hypot(dx, dy), 1);
    const len = 190 - e.strength * 60;
    const f = (d - len) * 0.045;
    const fx = (dx / d) * f, fy = (dy / d) * f;
    a.fx += fx; a.fy += fy;
    b.fx -= fx; b.fy -= fy;
  });

  nodes.forEach(n => {
    n.fx += (cx - n.x) * 0.0006;
    n.fy += (cy - n.y) * 0.0006;
    n.vx = (n.vx + n.fx) * 0.86;
    n.vy = (n.vy + n.fy) * 0.86;
    n.x = Math.max(n.size + 36, Math.min(w - n.size - 36, n.x + n.vx));
    n.y = Math.max(n.size + 64, Math.min(h - n.size - 36, n.y + n.vy));
  });
}

/* ── Draw ── */
function drawFrame(ctx, nodes, edges, w, h, hoveredId, selectedId, t, entry) {
  ctx.clearRect(0, 0, w, h);

  // Dot grid overlay
  const gridSpacing = 44;
  ctx.fillStyle = 'rgba(0,217,177,0.025)';
  for (let x = gridSpacing / 2; x < w; x += gridSpacing)
    for (let y = gridSpacing / 2; y < h; y += gridSpacing) {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }

  // Scanning beam
  const scanY = (t * 0.045) % h;
  const sg = ctx.createLinearGradient(0, scanY - 100, 0, scanY + 100);
  sg.addColorStop(0, 'transparent');
  sg.addColorStop(0.35, 'rgba(0,217,177,0.006)');
  sg.addColorStop(0.5, 'rgba(0,217,177,0.02)');
  sg.addColorStop(0.65, 'rgba(0,217,177,0.006)');
  sg.addColorStop(1, 'transparent');
  ctx.fillStyle = sg;
  ctx.fillRect(0, 0, w, h);

  const entryE = easeOutCubic(entry);

  // Node ambient halos
  nodes.forEach(n => {
    if ((n.count === 0 && n.xp === 0) || (selectedId && n.id !== selectedId)) return;
    const a = 0.14 * entryE;
    const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.size * 4.5);
    g.addColorStop(0, `${n.color}${Math.round(a * 255).toString(16).padStart(2, '0')}`);
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.size * 4.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Edges + particles
  edges.forEach(e => {
    const a = nodes.find(n => n.id === e.source);
    const b = nodes.find(n => n.id === e.target);
    if (!a || !b) return;

    const isLit = selectedId && (selectedId === a.id || selectedId === b.id);
    const isDim = selectedId && !isLit;
    const isHov = !selectedId && (hoveredId === a.id || hoveredId === b.id);

    const alpha = isDim ? 0.03 : isLit ? 0.85 : isHov ? 0.55 : 0.13 + e.strength * 0.22;
    const lw    = isDim ? 0.4  : isLit ? 2.8  : isHov ? 1.8  : 0.5 + e.strength * 1.6;
    const pulse = (isLit || isHov) ? 0.85 + 0.15 * Math.sin(t * 0.003) : 1;
    const ea    = Math.round(alpha * pulse * entryE * 255).toString(16).padStart(2, '0');

    const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
    grad.addColorStop(0, `${a.color}${ea}`);
    grad.addColorStop(1, `${b.color}${ea}`);
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = grad;
    ctx.lineWidth = lw;
    ctx.stroke();

    if (isHov && e.count > 0) {
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(232,232,240,0.45)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${e.count}d`, mx, my);
    }

    // Particles
    if (!isDim && e.particles) {
      e.particles.forEach(p => {
        p.t = (p.t + p.speed) % 1;
        const fade = Math.sin(p.t * Math.PI);
        const pa = (isLit ? 0.9 : isHov ? 0.65 : 0.4) * fade * entryE;
        if (pa < 0.05) return;
        const px = a.x + (b.x - a.x) * p.t;
        const py = a.y + (b.y - a.y) * p.t;
        ctx.shadowBlur = 8;
        ctx.shadowColor = a.color;
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `${a.color}${Math.round(pa * 220).toString(16).padStart(2, '0')}`;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    }
  });

  // Nodes
  nodes.forEach(n => {
    const isHov = n.id === hoveredId;
    const isSel = n.id === selectedId;
    const isDim = selectedId && !isSel;
    const hasData = n.count > 0 || n.xp > 0;
    const drawSize = n.size * entryE;
    const pulse = (isHov || isSel) ? 0.85 + 0.15 * Math.sin(t * 0.004 + n.phase) : 1;

    // Animated outer rings
    if (hasData && !isDim) {
      const r1 = drawSize + 10 + 5 * Math.sin(t * 0.003 + n.phase);
      const ra1 = (isHov || isSel ? 0.55 : 0.18) * entryE;
      ctx.beginPath();
      ctx.arc(n.x, n.y, r1, 0, Math.PI * 2);
      ctx.strokeStyle = `${n.color}${Math.round(ra1 * 255).toString(16).padStart(2, '0')}`;
      ctx.lineWidth = 1;
      ctx.stroke();

      if (n.level >= 3) {
        const r2 = drawSize + 20 + 3 * Math.sin(t * 0.003 + n.phase + Math.PI);
        ctx.beginPath();
        ctx.arc(n.x, n.y, r2, 0, Math.PI * 2);
        ctx.strokeStyle = `${n.color}${Math.round(0.08 * entryE * 255).toString(16).padStart(2, '0')}`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Orbital tick marks (for selected/hovered)
      if (isSel || isHov) {
        const tickR = drawSize + 32;
        for (let k = 0; k < 8; k++) {
          const angle = (k / 8) * Math.PI * 2 + t * 0.0015;
          const x1 = n.x + tickR * Math.cos(angle);
          const y1 = n.y + tickR * Math.sin(angle);
          const x2 = n.x + (tickR + 5) * Math.cos(angle);
          const y2 = n.y + (tickR + 5) * Math.sin(angle);
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = `${n.color}60`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Glow
    ctx.shadowBlur = (isHov ? 36 : isSel ? 30 : hasData ? 16 : 5) * pulse;
    ctx.shadowColor = n.color;

    // Fill
    ctx.beginPath();
    ctx.arc(n.x, n.y, drawSize * pulse, 0, Math.PI * 2);
    const fa = isDim ? 0.1 : isHov || isSel ? 0.88 : hasData ? 0.65 : 0.18;
    ctx.fillStyle = `${n.color}${Math.round(fa * 255).toString(16).padStart(2, '0')}`;
    ctx.fill();

    // Border
    const ba = isDim ? 0.15 : hasData ? 1 : 0.35;
    ctx.strokeStyle = `${n.color}${Math.round(ba * entryE * 255).toString(16).padStart(2, '0')}`;
    ctx.lineWidth = isSel ? 2.5 : 1.5;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Level number
    if (n.level > 1 && !isDim && drawSize > 16) {
      ctx.font = `bold ${drawSize > 28 ? 11 : 9}px "JetBrains Mono", monospace`;
      ctx.fillStyle = 'rgba(6,6,15,0.85)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${n.level}`, n.x, n.y);
    }

    // Label
    if (!isDim || isHov) {
      ctx.shadowBlur = isSel || isHov ? 10 : 0;
      ctx.shadowColor = n.color;
      ctx.font = `${isSel || isHov ? '600 ' : '500 '}11px "Space Grotesk", sans-serif`;
      ctx.fillStyle = isDim
        ? 'rgba(232,232,240,0.15)'
        : isSel || isHov ? '#ffffff' : 'rgba(232,232,240,0.7)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(n.label, n.x, n.y + drawSize * pulse + 8);
      ctx.shadowBlur = 0;
    }
  });
}

/* ── Main component ── */
export default function BrainMap({ state, onClose }) {
  const canvasRef   = useRef(null);
  const nodesRef    = useRef([]);
  const edgesRef    = useRef([]);
  const hoveredRef  = useRef(null);
  const selectedRef = useRef(null);
  const entryRef    = useRef(0);
  const rafRef      = useRef(null);

  const [hoveredNode,  setHoveredNode]  = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [mousePos,     setMousePos]     = useState({ x: 0, y: 0 });
  const [ready,        setReady]        = useState(false);

  const { nodes: initNodes, edges: initEdges } = useMemo(() => buildGraph(state), [state]);

  // Header stats
  const activeDomains  = initNodes.filter(n => n.xp > 0 || n.count > 0).length;
  const totalThoughts  = (state.thoughts || []).length;
  const strongestEdge  = initEdges.length > 0
    ? initEdges.reduce((b, e) => e.strength > b.strength ? e : b, initEdges[0])
    : null;
  const strongestLabel = strongestEdge
    ? `${strongestEdge.source.replace('d:', '')} ↔ ${strongestEdge.target.replace('d:', '')}`
    : null;

  // Init
  useEffect(() => {
    const w = window.innerWidth, h = window.innerHeight;
    const R = Math.min(w, h) * 0.3;
    nodesRef.current = initNodes.map((n, i) => ({
      ...n,
      x: w / 2 + R * Math.cos((i / initNodes.length) * Math.PI * 2),
      y: h / 2 + R * Math.sin((i / initNodes.length) * Math.PI * 2),
    }));
    edgesRef.current = initEdges.map(e => ({
      ...e,
      particles: Array.from({ length: Math.max(1, Math.ceil(e.strength * 3)) }, () => ({
        t: Math.random(),
        speed: 0.0005 + e.strength * 0.001,
      })),
    }));
    entryRef.current = 0;
    setReady(true);
  }, [initNodes.length]);

  // Animation loop
  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize();
    window.addEventListener('resize', resize);

    let t = 0;
    function frame() {
      entryRef.current = Math.min(entryRef.current + 1, 55);
      const { width: w, height: h } = canvas;
      simulateStep(nodesRef.current, edgesRef.current, w, h);
      drawFrame(ctx, nodesRef.current, edgesRef.current, w, h,
        hoveredRef.current, selectedRef.current, t, entryRef.current / 55);
      t += 16;
      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);

    function getNodeAt(x, y) {
      return nodesRef.current.find(n => Math.hypot(n.x - x, n.y - y) < n.size + 14);
    }
    function onMove(e) {
      setMousePos({ x: e.clientX, y: e.clientY });
      const node = getNodeAt(e.clientX, e.clientY);
      hoveredRef.current = node?.id || null;
      setHoveredNode(node || null);
      canvas.style.cursor = node ? 'pointer' : 'default';
    }
    function onClick(e) {
      const node = getNodeAt(e.clientX, e.clientY);
      if (node) {
        const next = selectedRef.current === node.id ? null : node.id;
        selectedRef.current = next;
        setSelectedNode(next ? node : null);
      } else {
        selectedRef.current = null;
        setSelectedNode(null);
      }
    }

    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('click', onClick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('click', onClick);
    };
  }, [ready]);

  const connectedEdges = selectedNode
    ? edgesRef.current.filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
        .sort((a, b) => b.strength - a.strength)
    : [];

  const domainThoughts = selectedNode
    ? (state.thoughts || [])
        .filter(t => t.domain === selectedNode.label && !t.done)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4)
    : [];

  const hasAnyData = initEdges.length > 0 || initNodes.some(n => n.xp > 0);

  return (
    <div className="brain-map-overlay">
      <canvas ref={canvasRef} className="brain-map-canvas" />

      {/* ── Header ── */}
      <div className="bm-header">
        <div className="bm-header-brand">
          <span className="bm-header-icon">◈</span>
          <div>
            <div className="bm-header-title">NEURAL MAP</div>
            <div className="bm-header-sub">live knowledge graph</div>
          </div>
        </div>

        <div className="bm-header-stats">
          <div className="bm-hstat">
            <span className="bm-hstat-val">{activeDomains}</span>
            <span className="bm-hstat-lbl">domains</span>
          </div>
          <div className="bm-hstat-sep" />
          <div className="bm-hstat">
            <span className="bm-hstat-val">{initEdges.length}</span>
            <span className="bm-hstat-lbl">links</span>
          </div>
          <div className="bm-hstat-sep" />
          <div className="bm-hstat">
            <span className="bm-hstat-val">{totalThoughts}</span>
            <span className="bm-hstat-lbl">captures</span>
          </div>
          {strongestLabel && (
            <>
              <div className="bm-hstat-sep" />
              <div className="bm-hstat bm-hstat--strong">
                <span className="bm-hstat-lbl">strongest link</span>
                <span className="bm-hstat-strong-val">{strongestLabel}</span>
              </div>
            </>
          )}
        </div>

        <button className="bm-close-btn" onClick={onClose}>✕ CLOSE</button>
      </div>

      {/* ── Hover tooltip (follows cursor) ── */}
      {hoveredNode && !selectedNode && (
        <div
          className="bm-tooltip"
          style={{
            '--nc': hoveredNode.color,
            left: Math.min(mousePos.x + 18, window.innerWidth - 220),
            top: Math.max(mousePos.y - 50, 80),
          }}
        >
          <div className="bmt-name" style={{ color: hoveredNode.color }}>{hoveredNode.label}</div>
          <div className="bmt-row">
            <span>Level</span><span style={{ color: hoveredNode.color }}>{hoveredNode.level}</span>
          </div>
          <div className="bmt-row">
            <span>XP</span><span style={{ color: hoveredNode.color }}>{hoveredNode.xp}</span>
          </div>
          <div className="bmt-row">
            <span>Captures</span><span>{hoveredNode.count}</span>
          </div>
        </div>
      )}

      {/* ── Selection panel (right rail) ── */}
      {selectedNode && (
        <div className="bm-panel" style={{ '--nc': selectedNode.color }}>
          <div className="bm-panel-top">
            <div className="bm-panel-domain" style={{ color: selectedNode.color }}>{selectedNode.label}</div>
            <div className="bm-panel-meta">
              <span className="bm-panel-level">LV {selectedNode.level}</span>
              <button className="bm-panel-close" onClick={() => { selectedRef.current = null; setSelectedNode(null); }}>✕</button>
            </div>
          </div>

          <div className="bm-panel-stats">
            <div className="bm-ps">
              <span className="bm-ps-val" style={{ color: selectedNode.color }}>{selectedNode.xp}</span>
              <span className="bm-ps-lbl">XP</span>
            </div>
            <div className="bm-ps">
              <span className="bm-ps-val">{selectedNode.count}</span>
              <span className="bm-ps-lbl">captures</span>
            </div>
            <div className="bm-ps">
              <span className="bm-ps-val">{connectedEdges.length}</span>
              <span className="bm-ps-lbl">links</span>
            </div>
          </div>

          {connectedEdges.length > 0 && (
            <div className="bm-panel-block">
              <div className="bm-panel-section-label">CONNECTIONS</div>
              {connectedEdges.map(e => {
                const otherId = e.source === selectedNode.id ? e.target : e.source;
                const other = nodesRef.current.find(n => n.id === otherId);
                if (!other) return null;
                const barW = Math.round(e.strength * 100);
                return (
                  <div key={otherId} className="bm-conn">
                    <span className="bm-conn-dot" style={{ background: other.color, boxShadow: `0 0 6px ${other.color}` }} />
                    <span className="bm-conn-name" style={{ color: other.color }}>{other.label}</span>
                    <div className="bm-conn-bar-wrap">
                      <div className="bm-conn-bar" style={{ width: `${barW}%`, background: other.color }} />
                    </div>
                    <span className="bm-conn-days">{e.count}d</span>
                  </div>
                );
              })}
            </div>
          )}

          {domainThoughts.length > 0 && (
            <div className="bm-panel-block">
              <div className="bm-panel-section-label">RECENT CAPTURES</div>
              {domainThoughts.map(th => (
                <div key={th.id} className="bm-thought">
                  <div className="bm-thought-text">{th.text.slice(0, 90)}{th.text.length > 90 ? '…' : ''}</div>
                  {th.type && <span className="bm-thought-tag">{th.type}</span>}
                </div>
              ))}
            </div>
          )}

          {domainThoughts.length === 0 && connectedEdges.length === 0 && (
            <div className="bm-panel-empty">No data yet in this domain.</div>
          )}
        </div>
      )}

      {/* ── Empty state ── */}
      {!hasAnyData && (
        <div className="bm-empty">
          <div className="bm-empty-icon">◈</div>
          <div className="bm-empty-title">Neural map is blank</div>
          <div className="bm-empty-sub">Capture thoughts across multiple domains to reveal the connections between your interests.</div>
        </div>
      )}

      {/* ── Status bar ── */}
      <div className="bm-statusbar">
        <span className="bm-status-dot" />
        <span className="bm-status-text">Node size = XP level · Edge = co-occurrence · Particles = connection activity</span>
        <span className="bm-status-hint">Click node to explore · Click again to deselect</span>
      </div>
    </div>
  );
}
