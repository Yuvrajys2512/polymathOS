import { useEffect, useRef, useState, useMemo } from 'react';
import { DOMAINS, DOMAIN_COLOR } from '../../constants/index.js';
import { xpToLevel } from '../../utils/game.js';

/* ── Graph builder ── */
function buildGraph(state) {
  const nodes = DOMAINS.map(d => ({
    id: `d:${d}`,
    type: 'domain',
    label: d,
    color: DOMAIN_COLOR[d] || '#00d9b1',
    xp:    state.xp?.[d] || 0,
    level: xpToLevel(state.xp?.[d] || 0),
    count: state.thoughts.filter(t => t.domain === d).length,
    size:  22 + Math.min((state.xp?.[d] || 0) / 28, 26),
    vx: 0, vy: 0, fx: 0, fy: 0,
    x: 0, y: 0,
  }));

  // Co-occurrence: how many days both domains had captures
  const byDay = {};
  state.thoughts.forEach(t => {
    const day = t.createdAt?.split('T')[0];
    if (!day || !DOMAINS.includes(t.domain)) return;
    if (!byDay[day]) byDay[day] = new Set();
    byDay[day].add(t.domain);
  });

  const coCount = {};
  Object.values(byDay).forEach(doms => {
    const arr = [...doms];
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        const key = [arr[i], arr[j]].sort().join('|||');
        coCount[key] = (coCount[key] || 0) + 1;
      }
    }
  });

  // Tag overlap per domain
  const domTags = {};
  state.thoughts.forEach(t => {
    if (!DOMAINS.includes(t.domain)) return;
    if (!domTags[t.domain]) domTags[t.domain] = new Set();
    (t.tags || []).forEach(tag => domTags[t.domain].add(tag));
  });

  const edges = [];
  Object.entries(coCount).forEach(([key, count]) => {
    const [a, b] = key.split('|||');
    const tagsA  = domTags[a] || new Set();
    const tagsB  = domTags[b] || new Set();
    const shared = [...tagsA].filter(t => tagsB.has(t)).length;
    const strength = Math.min((count + shared * 2) / 12, 1);
    if (strength > 0) edges.push({ source: `d:${a}`, target: `d:${b}`, strength, count, shared });
  });

  return { nodes, edges };
}

/* ── Physics simulation step ── */
function simulateStep(nodes, edges, w, h) {
  const REPULSION = 6500;
  const K         = 0.045;
  const REST_LEN  = 190;
  const DAMP      = 0.86;
  const GRAVITY   = 0.0006;
  const cx = w / 2, cy = h / 2;

  nodes.forEach(n => { n.fx = 0; n.fy = 0; });

  // Repulsion
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const d  = Math.max(Math.hypot(dx, dy), 1);
      const f  = REPULSION / (d * d);
      const fx = (dx / d) * f, fy = (dy / d) * f;
      a.fx += fx; a.fy += fy;
      b.fx -= fx; b.fy -= fy;
    }
  }

  // Springs along edges
  edges.forEach(e => {
    const a = nodes.find(n => n.id === e.source);
    const b = nodes.find(n => n.id === e.target);
    if (!a || !b) return;
    const dx  = b.x - a.x, dy = b.y - a.y;
    const d   = Math.max(Math.hypot(dx, dy), 1);
    const len = REST_LEN - e.strength * 60;
    const f   = (d - len) * K;
    const fx = (dx / d) * f, fy = (dy / d) * f;
    a.fx += fx; a.fy += fy;
    b.fx -= fx; b.fy -= fy;
  });

  // Center gravity
  nodes.forEach(n => {
    n.fx += (cx - n.x) * GRAVITY;
    n.fy += (cy - n.y) * GRAVITY;
  });

  // Integrate
  nodes.forEach(n => {
    n.vx = (n.vx + n.fx) * DAMP;
    n.vy = (n.vy + n.fy) * DAMP;
    n.x  = Math.max(n.size + 24, Math.min(w - n.size - 24, n.x + n.vx));
    n.y  = Math.max(n.size + 24, Math.min(h - n.size - 24, n.y + n.vy));
  });
}

/* ── Draw frame ── */
function drawFrame(ctx, nodes, edges, w, h, hoveredId, selectedId, t) {
  ctx.clearRect(0, 0, w, h);

  // Background glow spots
  nodes.forEach(n => {
    if (n.count === 0 && n.xp === 0) return;
    const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.size * 3.5);
    g.addColorStop(0, `${n.color}18`);
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.size * 3.5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Edges
  edges.forEach(e => {
    const a = nodes.find(n => n.id === e.source);
    const b = nodes.find(n => n.id === e.target);
    if (!a || !b) return;
    const isLit = selectedId && (selectedId === a.id || selectedId === b.id);
    const isDim = selectedId && !isLit;
    const isHov = !selectedId && (hoveredId === a.id || hoveredId === b.id);

    const alpha = isDim ? 0.04 : isLit ? 0.75 : isHov ? 0.55 : 0.2 + e.strength * 0.3;
    const width = isDim ? 0.5 : isLit ? 2.5 : 1 + e.strength * 1.5;

    // Pulsing animated edges
    const pulse = isLit ? 0.85 + 0.15 * Math.sin(t * 0.003) : 1;

    // Gradient edge
    const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
    grad.addColorStop(0, `${a.color}${Math.round(alpha * pulse * 255).toString(16).padStart(2,'0')}`);
    grad.addColorStop(1, `${b.color}${Math.round(alpha * pulse * 255).toString(16).padStart(2,'0')}`);

    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = grad;
    ctx.lineWidth = width;
    ctx.stroke();

    // Strength label on hover
    if (isHov && e.count > 0) {
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(232,232,240,0.5)';
      ctx.textAlign = 'center';
      ctx.fillText(`${e.count}d`, mx, my);
    }
  });

  // Nodes
  nodes.forEach(n => {
    const isHov = n.id === hoveredId;
    const isSel = n.id === selectedId;
    const isDim = selectedId && !isSel;
    const hasData = n.count > 0 || n.xp > 0;

    const baseAlpha = hasData ? 1 : 0.35;
    const alpha = isDim ? 0.2 : baseAlpha;
    const glowSz = isHov ? 36 : isSel ? 30 : hasData ? 16 : 6;
    const pulse  = (isHov || isSel) ? 0.8 + 0.2 * Math.sin(t * 0.004) : 1;

    // Outer glow ring (animated when active)
    if (isHov || isSel) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.size + 8 + 4 * Math.sin(t * 0.004), 0, Math.PI * 2);
      ctx.strokeStyle = `${n.color}40`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Glow
    ctx.shadowBlur = glowSz * pulse;
    ctx.shadowColor = n.color;

    // Circle fill
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.size * pulse, 0, Math.PI * 2);
    const fillAlpha = isDim ? 0.15 : isHov || isSel ? 0.92 : hasData ? 0.72 : 0.25;
    ctx.fillStyle = `${n.color}${Math.round(fillAlpha * 255).toString(16).padStart(2,'0')}`;
    ctx.fill();

    // Border
    ctx.strokeStyle = `${n.color}${Math.round(alpha * 255).toString(16).padStart(2,'0')}`;
    ctx.lineWidth = isSel ? 2.5 : 1.5;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Level badge inside node
    if (n.level > 1 && !isDim) {
      ctx.font = `bold ${n.size > 28 ? 11 : 9}px "JetBrains Mono", monospace`;
      ctx.fillStyle = isDim ? 'rgba(0,0,0,0.3)' : '#06060f';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${n.level}`, n.x, n.y);
    }

    // Label below
    if (!isDim || isHov) {
      ctx.font = `${isSel || isHov ? '600 ' : ''}12px "Space Grotesk", sans-serif`;
      ctx.fillStyle = isDim
        ? 'rgba(232,232,240,0.2)'
        : isSel || isHov
        ? '#e8e8f0'
        : 'rgba(232,232,240,0.65)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(n.label, n.x, n.y + n.size + 7);
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
  const rafRef      = useRef(null);

  const [hoveredNode,  setHoveredNode]  = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [ready, setReady]               = useState(false);

  const { nodes: initNodes, edges: initEdges } = useMemo(() => buildGraph(state), [state]);

  // Init positions in a circle so nodes start spread out
  useEffect(() => {
    const w = window.innerWidth, h = window.innerHeight;
    const cx = w / 2, cy = h / 2;
    const R  = Math.min(w, h) * 0.3;
    nodesRef.current = initNodes.map((n, i) => ({
      ...n,
      x:  cx + R * Math.cos((i / initNodes.length) * Math.PI * 2),
      y:  cy + R * Math.sin((i / initNodes.length) * Math.PI * 2),
    }));
    edgesRef.current = initEdges;
    setReady(true);
  }, [initNodes.length]);

  // Animation loop
  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    let t = 0;
    function frame() {
      const { width: w, height: h } = canvas;
      simulateStep(nodesRef.current, edgesRef.current, w, h);
      drawFrame(ctx, nodesRef.current, edgesRef.current, w, h, hoveredRef.current, selectedRef.current, t);
      t += 16;
      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);

    function getNodeAt(x, y) {
      return nodesRef.current.find(n => Math.hypot(n.x - x, n.y - y) < n.size + 10);
    }
    function onMove(e) {
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

  // Connected edge count for selected node
  const connectedEdges = selectedNode
    ? edgesRef.current.filter(e => e.source === selectedNode.id || e.target === selectedNode.id)
    : [];

  const hasAnyData = initEdges.length > 0 || initNodes.some(n => n.xp > 0);

  return (
    <div className="brain-map-overlay">
      <canvas ref={canvasRef} className="brain-map-canvas" />

      {/* Header */}
      <div className="brain-map-header">
        <div className="brain-map-title">
          <span style={{ fontSize: 18, marginRight: 10 }}>◈</span>
          Brain Map
          <span className="brain-map-sub">your mind, visualized</span>
        </div>
        <button className="brain-map-close" onClick={onClose}>
          × Close
        </button>
      </div>

      {/* Node tooltip */}
      {hoveredNode && !selectedNode && (
        <div className="brain-map-tooltip" style={{ '--node-color': hoveredNode.color }}>
          <div className="bmt-domain">{hoveredNode.label}</div>
          <div className="bmt-row">
            <span>Level</span>
            <span style={{ color: hoveredNode.color }}>{hoveredNode.level}</span>
          </div>
          <div className="bmt-row">
            <span>XP</span>
            <span style={{ color: hoveredNode.color }}>{hoveredNode.xp}</span>
          </div>
          <div className="bmt-row">
            <span>Captures</span>
            <span>{hoveredNode.count}</span>
          </div>
          {connectedEdges.length > 0 && (
            <div className="bmt-row">
              <span>Connections</span>
              <span>{connectedEdges.length}</span>
            </div>
          )}
        </div>
      )}

      {/* Selected node panel */}
      {selectedNode && (
        <div className="brain-map-node-panel" style={{ '--node-color': selectedNode.color }}>
          <div className="bmnp-header">
            <div className="bmnp-name" style={{ color: selectedNode.color }}>{selectedNode.label}</div>
            <div className="bmnp-level">Lv.{selectedNode.level}</div>
          </div>
          <div className="bmnp-stats">
            <div className="bmnp-stat">
              <span className="bmnp-val">{selectedNode.xp}</span>
              <span className="bmnp-lbl">XP</span>
            </div>
            <div className="bmnp-stat">
              <span className="bmnp-val">{selectedNode.count}</span>
              <span className="bmnp-lbl">captures</span>
            </div>
            <div className="bmnp-stat">
              <span className="bmnp-val">{connectedEdges.length}</span>
              <span className="bmnp-lbl">links</span>
            </div>
          </div>
          {connectedEdges.length > 0 && (
            <div className="bmnp-connections">
              <div className="bmnp-connections-label">Connected to</div>
              {connectedEdges.map(e => {
                const otherId = e.source === selectedNode.id ? e.target : e.source;
                const other   = nodesRef.current.find(n => n.id === otherId);
                if (!other) return null;
                return (
                  <div key={otherId} className="bmnp-conn-item" style={{ '--other-color': other.color }}>
                    <span className="bmnp-conn-dot" />
                    <span style={{ color: other.color }}>{other.label}</span>
                    <span className="bmnp-conn-days">{e.count}d</span>
                  </div>
                );
              })}
            </div>
          )}
          <button className="ghost" style={{ fontSize: 11, color: 'var(--muted)', marginTop: 10, width: '100%' }}
            onClick={() => { selectedRef.current = null; setSelectedNode(null); }}>
            Deselect
          </button>
        </div>
      )}

      {/* Empty state */}
      {!hasAnyData && (
        <div className="brain-map-empty">
          <div style={{ fontSize: 32, marginBottom: 12 }}>◈</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Your Brain Map is blank</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.65, maxWidth: 300 }}>
            Capture thoughts across different domains to reveal the connections between your interests.
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="brain-map-legend">
        <div className="bml-item">
          <span className="bml-dot" style={{ width: 10, height: 10 }} />
          Node size = XP level
        </div>
        <div className="bml-item">
          <span className="bml-line" />
          Edge thickness = connection strength
        </div>
        <div className="bml-item" style={{ color: 'var(--muted-2)' }}>
          Click node to inspect · Click again to deselect
        </div>
      </div>
    </div>
  );
}
