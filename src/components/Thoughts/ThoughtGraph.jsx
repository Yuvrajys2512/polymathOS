import { useState, useEffect, useRef, useMemo } from 'react';
import { DOMAIN_COLOR } from '../../constants/index.js';
import { computeRelationships } from '../../utils/similarity.js';
import { analyzeGraphClusters, analyzeNodeSynthesis } from '../../utils/graphAI.js';

const EDGE_THRESHOLD = 0.18;
const CLUSTER_COLORS = ['#8b5cf6', '#06b6d4', '#f59e0b', '#10b981', '#f43f5e'];

// Physics constants
const K_REPULSE = 1600;
const K_SPRING  = 0.055;
const K_CENTER  = 0.012;
const MIN_DIST  = 38;
const DAMPING   = 0.86;
const REST_MIN  = 45;
const REST_SPAN = 75;

function hexAlpha(hex, a) {
  if (!hex?.startsWith('#')) return `rgba(120,120,140,${a})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${Math.max(0, Math.min(1, a))})`;
}

// Seed initial positions (run once per thought-set change)
function seedLayout(thoughts, edges) {
  const n = thoughts.length;
  if (n === 0) return [];
  const R = Math.max(55, n * 12);
  const nodes = thoughts.map((t, i) => {
    const degree   = edges.filter(e => e.i === i || e.j === i).length;
    const pMass    = t.priority === 'high' ? 2.4 : t.priority === 'low' ? 0.65 : 1.3;
    const mass     = Math.max(0.5, pMass + degree * 0.38);
    return {
      x:    R * Math.cos((2 * Math.PI * i) / n) + (Math.random() - 0.5) * 20,
      y:    R * Math.sin((2 * Math.PI * i) / n) + (Math.random() - 0.5) * 20,
      vx: 0, vy: 0,
      mass,
    };
  });

  // Run 300 warm-up steps so nodes start spread out (not live — just init)
  const fx = new Float32Array(n);
  const fy = new Float32Array(n);
  for (let step = 0; step < 300; step++) {
    const cool = 1 - step / 300;
    const dt   = 0.35 * (0.15 + cool * 0.85);
    const damp = 0.72 + (step / 300) * 0.2;
    fx.fill(0); fy.fill(0);
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        let dx = nodes[i].x - nodes[j].x;
        let dy = nodes[i].y - nodes[j].y;
        let d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 0.5) { dx = Math.random() - 0.5; dy = Math.random() - 0.5; d = 0.5; }
        const eff = Math.max(d, MIN_DIST);
        const f   = K_REPULSE / (eff * eff * eff) * d;
        fx[i] += f * dx; fy[i] += f * dy;
        fx[j] -= f * dx; fy[j] -= f * dy;
      }
    }
    for (const { i, j, s } of edges) {
      const dx   = nodes[j].x - nodes[i].x;
      const dy   = nodes[j].y - nodes[i].y;
      const d    = Math.sqrt(dx * dx + dy * dy) + 0.001;
      const rest = REST_MIN + (1 - s) * REST_SPAN;
      const f    = K_SPRING * (d - rest) / d;
      fx[i] += f * dx; fy[i] += f * dy;
      fx[j] -= f * dx; fy[j] -= f * dy;
    }
    for (let i = 0; i < n; i++) {
      fx[i] -= 0.022 * nodes[i].x;
      fy[i] -= 0.022 * nodes[i].y;
      nodes[i].vx = (nodes[i].vx + fx[i] * dt) * damp;
      nodes[i].vy = (nodes[i].vy + fy[i] * dt) * damp;
      nodes[i].x += nodes[i].vx;
      nodes[i].y += nodes[i].vy;
    }
  }
  // Zero velocities before handing off to live sim
  nodes.forEach(n => { n.vx = 0; n.vy = 0; });
  return nodes;
}

// ── component ────────────────────────────────────────────────────────────────

export default function ThoughtGraph({ thoughts, updateThought, deleteThought, groqKey }) {
  const canvasRef = useRef(null);
  const camRef    = useRef({ x: 0, y: 0, z: 1 });
  const timeRef   = useRef(0);

  // Live physics state (mutable, never causes re-render)
  const nodesRef     = useRef([]);
  const draggingRef  = useRef(null); // {idx, lastVx, lastVy} | null
  const particlesRef = useRef([]);
  const phasesRef    = useRef([]);

  // Stable mirrors for RAF
  const thoughtsRef  = useRef([]);
  const edgesRef     = useRef([]);
  const selectedRef  = useRef(null);
  const clustersRef  = useRef([]); // enriched with .indices + .color

  // React state (only for UI re-renders)
  const [selected,  setSelected]  = useState(null);
  const [clusters,  setClusters]  = useState([]);
  const [synthesis, setSynthesis] = useState(null);
  const [aiStatus,  setAiStatus]  = useState('idle');

  // ── derived (React) ──────────────────────────────────────────────────────────

  const { matrix, edges } = useMemo(() => {
    if (!thoughts.length) return { matrix: [], edges: [] };
    const m = computeRelationships(thoughts);
    const e = [];
    for (let i = 0; i < thoughts.length; i++)
      for (let j = i + 1; j < thoughts.length; j++)
        if (m[i][j] >= EDGE_THRESHOLD) e.push({ i, j, s: m[i][j] });
    return { matrix: m, edges: e };
  }, [thoughts.map(t => `${t.id}${t.domain}${t.type}`).join('|')]);

  const relatedThoughts = useMemo(() => {
    if (!selected || !matrix.length) return [];
    const idx = thoughts.findIndex(t => t.id === selected.id);
    if (idx === -1) return [];
    return thoughts
      .map((t, j) => ({ thought: t, score: matrix[idx]?.[j] || 0 }))
      .filter((_, j) => j !== idx && (matrix[idx]?.[j] || 0) >= EDGE_THRESHOLD)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [selected, matrix, thoughts]);

  // ── sync refs ────────────────────────────────────────────────────────────────

  useEffect(() => { thoughtsRef.current = thoughts; }, [thoughts]);
  useEffect(() => { edgesRef.current    = edges;    }, [edges]);
  useEffect(() => { selectedRef.current = selected; }, [selected]);

  useEffect(() => {
    clustersRef.current = clusters.map((c, ci) => ({
      ...c,
      color:   CLUSTER_COLORS[ci % CLUSTER_COLORS.length],
      indices: c.ids
        .map(id => thoughts.findIndex(t => t.id === id))
        .filter(i => i >= 0),
    }));
  }, [clusters, thoughts]);

  // ── initialise physics nodes when thought set changes ─────────────────────────

  const thoughtKeyRef = useRef('');
  useEffect(() => {
    const key = thoughts.map(t => t.id).join(',');
    if (key === thoughtKeyRef.current && nodesRef.current.length === thoughts.length) return;
    thoughtKeyRef.current = key;

    nodesRef.current = seedLayout(thoughts, edges);

    // Fit to view
    const canvas = canvasRef.current;
    if (canvas && nodesRef.current.length) {
      const W = canvas.offsetWidth || 600;
      const H = canvas.offsetHeight || 500;
      const ns = nodesRef.current;
      const xs = ns.map(n => n.x), ys = ns.map(n => n.y);
      const minX = Math.min(...xs), maxX = Math.max(...xs);
      const minY = Math.min(...ys), maxY = Math.max(...ys);
      const pad = 90;
      const sx = (W - pad * 2) / Math.max(1, maxX - minX);
      const sy = (H - pad * 2) / Math.max(1, maxY - minY);
      const z  = Math.min(2.0, Math.max(0.4, Math.min(sx, sy)));
      camRef.current = { x: -(minX + maxX) / 2 * z, y: -(minY + maxY) / 2 * z, z };
    }

    // Particles & phases
    phasesRef.current = thoughts.map(() => Math.random() * Math.PI * 2);
    const particles = [];
    edges.forEach((edge, edgeIdx) => {
      const count = edge.s < 0.35 ? 1 : edge.s < 0.65 ? 2 : 3;
      for (let k = 0; k < count; k++)
        particles.push({ edgeIdx, t: Math.random(), speed: 0.001 + edge.s * 0.0018 + Math.random() * 0.001 });
    });
    particlesRef.current = particles;
  }, [thoughts.map(t => t.id).join(',')]);

  // ── AI cluster analysis ─────────────────────────────────────────────────────

  useEffect(() => {
    if (!groqKey || thoughts.length < 3) { setClusters([]); setAiStatus('idle'); return; }
    setAiStatus('loading');
    analyzeGraphClusters(thoughts, groqKey)
      .then(r => { setClusters(r || []); setAiStatus('done'); })
      .catch(() => { setClusters([]); setAiStatus('error'); });
  }, [thoughts.map(t => t.id).join(','), groqKey]);

  // ── AI node synthesis ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (!selected || !groqKey || !relatedThoughts.length) { setSynthesis(null); return; }
    setSynthesis('loading');
    analyzeNodeSynthesis(selected, relatedThoughts, groqKey)
      .then(t => setSynthesis(t || null))
      .catch(() => setSynthesis(null));
  }, [selected?.id, groqKey, relatedThoughts.length]);

  // ── interactions ─────────────────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let panning    = false;
    let prevMouse  = { x: 0, y: 0 };
    let clickStart = { x: 0, y: 0, t: 0 };
    let pinchDist  = null;

    const toWorld = (sx, sy) => {
      const W = canvas.offsetWidth || 600, H = canvas.offsetHeight || 500;
      const { x, y, z } = camRef.current;
      return [(sx - W / 2 - x) / z, (sy - H / 2 - y) / z];
    };

    const hitTest = (sx, sy) => {
      const [wx, wy] = toWorld(sx, sy);
      const nodes    = nodesRef.current;
      const ts       = thoughtsRef.current;
      let best = null, bestD = 30 / camRef.current.z;
      nodes.forEach((nd, idx) => {
        const baseR = ts[idx]?.priority === 'high' ? 11 : ts[idx]?.priority === 'low' ? 7 : 9;
        const d = Math.sqrt((nd.x - wx) ** 2 + (nd.y - wy) ** 2);
        if (d < Math.max(bestD, baseR + 6)) { bestD = d; best = idx; }
      });
      return best;
    };

    const zoomAt = (sx, sy, factor) => {
      const W = canvas.offsetWidth || 600, H = canvas.offsetHeight || 500;
      const cam = camRef.current;
      const wx = (sx - W / 2 - cam.x) / cam.z;
      const wy = (sy - H / 2 - cam.y) / cam.z;
      cam.z = Math.max(0.15, Math.min(5, cam.z * factor));
      cam.x = sx - W / 2 - wx * cam.z;
      cam.y = sy - H / 2 - wy * cam.z;
    };

    // ── mouse ──
    const onDown = e => {
      const rect = canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left, sy = e.clientY - rect.top;
      clickStart = { x: e.clientX, y: e.clientY, t: Date.now() };
      prevMouse  = { x: e.clientX, y: e.clientY };
      const hitIdx = hitTest(sx, sy);
      if (hitIdx !== null) {
        draggingRef.current = { idx: hitIdx, lastVx: 0, lastVy: 0 };
        canvas.style.cursor = 'grabbing';
      } else {
        panning = true;
        canvas.style.cursor = 'grabbing';
      }
    };

    const onMove = e => {
      const rect = canvas.getBoundingClientRect();
      const sx = e.clientX - rect.left, sy = e.clientY - rect.top;
      const dx = e.clientX - prevMouse.x, dy = e.clientY - prevMouse.y;
      prevMouse = { x: e.clientX, y: e.clientY };

      const dragging = draggingRef.current;
      if (dragging !== null) {
        const [wx, wy] = toWorld(sx, sy);
        const nd = nodesRef.current[dragging.idx];
        if (nd) {
          nd.x = wx; nd.y = wy;
          nd.vx = 0; nd.vy = 0;
          dragging.lastVx = dx / camRef.current.z;
          dragging.lastVy = dy / camRef.current.z;
        }
      } else if (panning) {
        camRef.current.x += dx;
        camRef.current.y += dy;
      } else {
        const hitIdx = hitTest(sx, sy);
        canvas.style.cursor = hitIdx !== null ? 'grab' : 'default';
      }
    };

    const onUp = e => {
      const dragging = draggingRef.current;
      if (dragging !== null) {
        const nd = nodesRef.current[dragging.idx];
        if (nd) {
          nd.vx = dragging.lastVx * 0.45;
          nd.vy = dragging.lastVy * 0.45;
        }
        const moved = Math.abs(e.clientX - clickStart.x) + Math.abs(e.clientY - clickStart.y);
        if (moved < 8 && Date.now() - clickStart.t < 300) {
          setSelected(thoughtsRef.current[dragging.idx] || null);
        }
        draggingRef.current = null;
      }
      panning = false;
      canvas.style.cursor = 'default';
    };

    const onWheel = e => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      zoomAt(e.clientX - rect.left, e.clientY - rect.top, e.deltaY < 0 ? 1.12 : 0.9);
    };

    // ── touch ──
    const onTouchStart = e => {
      if (e.touches.length === 1) {
        const t = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const sx = t.clientX - rect.left, sy = t.clientY - rect.top;
        clickStart = { x: t.clientX, y: t.clientY, t: Date.now() };
        prevMouse  = { x: t.clientX, y: t.clientY };
        const hitIdx = hitTest(sx, sy);
        if (hitIdx !== null) {
          draggingRef.current = { idx: hitIdx, lastVx: 0, lastVy: 0 };
        } else {
          panning = true;
        }
      } else if (e.touches.length === 2) {
        draggingRef.current = null;
        panning = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        pinchDist = Math.sqrt(dx * dx + dy * dy);
      }
    };

    const onTouchMove = e => {
      e.preventDefault();
      if (e.touches.length === 1) {
        const t = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const sx = t.clientX - rect.left, sy = t.clientY - rect.top;
        const dx = t.clientX - prevMouse.x, dy = t.clientY - prevMouse.y;
        prevMouse = { x: t.clientX, y: t.clientY };
        const dragging = draggingRef.current;
        if (dragging !== null) {
          const [wx, wy] = toWorld(sx, sy);
          const nd = nodesRef.current[dragging.idx];
          if (nd) {
            nd.x = wx; nd.y = wy; nd.vx = 0; nd.vy = 0;
            dragging.lastVx = dx / camRef.current.z;
            dragging.lastVy = dy / camRef.current.z;
          }
        } else if (panning) {
          camRef.current.x += dx;
          camRef.current.y += dy;
        }
      } else if (e.touches.length === 2 && pinchDist !== null) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const d  = Math.sqrt(dx * dx + dy * dy);
        const mx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const my = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        const rect = canvas.getBoundingClientRect();
        zoomAt(mx - rect.left, my - rect.top, d / pinchDist);
        pinchDist = d;
      }
    };

    const onTouchEnd = e => {
      const dragging = draggingRef.current;
      if (dragging !== null && e.changedTouches.length === 1) {
        const t  = e.changedTouches[0];
        const nd = nodesRef.current[dragging.idx];
        if (nd) { nd.vx = dragging.lastVx * 0.45; nd.vy = dragging.lastVy * 0.45; }
        const mv = Math.abs(t.clientX - clickStart.x) + Math.abs(t.clientY - clickStart.y);
        if (mv < 10 && Date.now() - clickStart.t < 350)
          setSelected(thoughtsRef.current[dragging.idx] || null);
        draggingRef.current = null;
      }
      panning = false;
      pinchDist = null;
    };

    canvas.addEventListener('mousedown',  onDown);
    window.addEventListener('mousemove',  onMove);
    window.addEventListener('mouseup',    onUp);
    canvas.addEventListener('wheel',      onWheel,      { passive: false });
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove',  onTouchMove,  { passive: false });
    canvas.addEventListener('touchend',   onTouchEnd);
    return () => {
      canvas.removeEventListener('mousedown',  onDown);
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('mouseup',    onUp);
      canvas.removeEventListener('wheel',      onWheel);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove',  onTouchMove);
      canvas.removeEventListener('touchend',   onTouchEnd);
    };
  }, []); // stable — all data through refs

  // ── RAF: physics + draw ───────────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frameId;

    function physicsStep() {
      const nodes    = nodesRef.current;
      const edges    = edgesRef.current;
      const n        = nodes.length;
      const dragIdx  = draggingRef.current?.idx ?? -1;
      if (!n) return;

      const fx = new Float32Array(n);
      const fy = new Float32Array(n);

      // Repulsion between all pairs — dragged node still pushes others
      for (let i = 0; i < n; i++) {
        if (i === dragIdx) continue;
        for (let j = 0; j < n; j++) {
          if (i === j) continue;
          let dx = nodes[i].x - nodes[j].x;
          let dy = nodes[i].y - nodes[j].y;
          let d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 0.5) { dx = Math.random() - 0.5; dy = Math.random() - 0.5; d = 0.5; }
          const eff = Math.max(d, MIN_DIST);
          const f   = (K_REPULSE / (eff * eff * eff)) * d / nodes[i].mass;
          fx[i] += f * dx;
          fy[i] += f * dy;
        }
      }

      // Spring forces along edges — stretch pulls neighbors toward dragged node
      for (const { i, j, s } of edges) {
        const dx   = nodes[j].x - nodes[i].x;
        const dy   = nodes[j].y - nodes[i].y;
        const d    = Math.sqrt(dx * dx + dy * dy) + 0.001;
        const rest = REST_MIN + (1 - s) * REST_SPAN;
        const sf   = K_SPRING * (d - rest);
        if (i !== dragIdx) { fx[i] += sf * (dx / d) / nodes[i].mass; fy[i] += sf * (dy / d) / nodes[i].mass; }
        if (j !== dragIdx) { fx[j] -= sf * (dx / d) / nodes[j].mass; fy[j] -= sf * (dy / d) / nodes[j].mass; }
      }

      // Weak centering (keeps graph from drifting off-screen)
      for (let i = 0; i < n; i++) {
        if (i === dragIdx) continue;
        fx[i] -= K_CENTER * nodes[i].x / nodes[i].mass;
        fy[i] -= K_CENTER * nodes[i].y / nodes[i].mass;
      }

      // Integrate velocities + positions
      for (let i = 0; i < n; i++) {
        if (i === dragIdx) continue;
        nodes[i].vx = (nodes[i].vx + fx[i]) * DAMPING;
        nodes[i].vy = (nodes[i].vy + fy[i]) * DAMPING;
        nodes[i].x += nodes[i].vx;
        nodes[i].y += nodes[i].vy;
      }
    }

    function frame() {
      timeRef.current++;
      const T = timeRef.current;

      physicsStep();

      const nodes    = nodesRef.current;
      const edges    = edgesRef.current;
      const thoughts = thoughtsRef.current;
      const selected = selectedRef.current;
      const clusters = clustersRef.current;
      const particles = particlesRef.current;
      const phases   = phasesRef.current;
      const dragIdx  = draggingRef.current?.idx ?? -1;

      const W = canvas.offsetWidth  || 600;
      const H = canvas.offsetHeight || 500;
      if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
      ctx.clearRect(0, 0, W, H);

      if (!nodes.length) {
        ctx.fillStyle = 'rgba(255,255,255,0.14)';
        ctx.font = '13px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Capture some thoughts to build your knowledge graph', W / 2, H / 2);
        frameId = requestAnimationFrame(frame);
        return;
      }

      const { x: camX, y: camY, z: zoom } = camRef.current;
      ctx.save();
      ctx.translate(W / 2 + camX, H / 2 + camY);
      ctx.scale(zoom, zoom);

      // ── 1. Cluster blobs ──────────────────────────────────────────────────
      clusters.forEach((c, ci) => {
        const members = c.indices.map(i => nodes[i]).filter(Boolean);
        if (!members.length) return;
        const cx = members.reduce((s, n) => s + n.x, 0) / members.length;
        const cy = members.reduce((s, n) => s + n.y, 0) / members.length;
        const rad = Math.max(65, members.reduce((s, n) => s + Math.sqrt((n.x-cx)**2+(n.y-cy)**2), 0) / members.length + 42);

        const pulse = 0.07 + 0.025 * Math.sin(T * 0.010 + ci * 1.7);
        const blob = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        blob.addColorStop(0, hexAlpha(c.color, pulse));
        blob.addColorStop(1, hexAlpha(c.color, 0));
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.fillStyle = blob;
        ctx.fill();

        const la = 0.5 + 0.2 * Math.sin(T * 0.013 + ci * 1.3);
        ctx.font = '600 10px system-ui, sans-serif';
        ctx.fillStyle = hexAlpha(c.color, la);
        ctx.textAlign = 'center';
        ctx.fillText(c.label.toUpperCase(), cx, cy - rad - 5);
      });

      // ── 2. Edges (with stretch glow) ──────────────────────────────────────
      edges.forEach(({ i, j, s }) => {
        const a = nodes[i], b = nodes[j];
        if (!a || !b) return;
        const tA = thoughts[i], tB = thoughts[j];
        const colA = tA?.done ? '#4b5563' : (DOMAIN_COLOR[tA?.domain] || '#6b7280');
        const colB = tB?.done ? '#4b5563' : (DOMAIN_COLOR[tB?.domain] || '#6b7280');

        // How much is the spring stretched?
        const dist    = Math.sqrt((b.x-a.x)**2 + (b.y-a.y)**2);
        const rest    = REST_MIN + (1 - s) * REST_SPAN;
        const stretch = Math.max(0, Math.min(1, (dist - rest) / rest));

        const shimmer = 0.07 + s * 0.25 + stretch * 0.42 + 0.03 * Math.sin(T * 0.018 + i + j);
        const width   = (0.5 + s * 2.0) * (1 + stretch * 1.4);

        const grd = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        grd.addColorStop(0, hexAlpha(colA, shimmer));
        grd.addColorStop(1, hexAlpha(colB, shimmer));

        if (stretch > 0.15) {
          ctx.shadowBlur  = 4 + stretch * 12;
          ctx.shadowColor = hexAlpha(colA, stretch * 0.6);
        }
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = grd;
        ctx.lineWidth   = width;
        ctx.stroke();
        ctx.shadowBlur  = 0;
      });

      // ── 3. Edge flow particles ────────────────────────────────────────────
      ctx.save();
      particles.forEach(p => {
        p.t = (p.t + p.speed) % 1;
        const edge = edges[p.edgeIdx];
        if (!edge) return;
        const a = nodes[edge.i], b = nodes[edge.j];
        if (!a || !b) return;
        const px    = a.x + (b.x - a.x) * p.t;
        const py    = a.y + (b.y - a.y) * p.t;
        const col   = DOMAIN_COLOR[thoughts[edge.i]?.domain] || '#6b7280';
        const alpha = 0.4 + 0.45 * Math.sin(T * 0.07 + p.t * Math.PI * 4);
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle   = hexAlpha(col, alpha);
        ctx.shadowBlur  = 7;
        ctx.shadowColor = col;
        ctx.fill();
      });
      ctx.shadowBlur = 0;
      ctx.restore();

      // ── 4. Nodes ──────────────────────────────────────────────────────────
      nodes.forEach((nd, idx) => {
        if (!nd) return;
        const th = thoughts[idx];
        if (!th) return;

        const isSelected = selected?.id === th.id;
        const isDragged  = idx === dragIdx;
        const col     = th.done ? '#4b5563' : (DOMAIN_COLOR[th.domain] || '#6b7280');
        const baseR   = th.priority === 'high' ? 11 : th.priority === 'low' ? 7 : 9;
        const phase   = phases[idx] || 0;
        const breathe = isDragged ? 1.18 : (1 + 0.10 * Math.sin(T * 0.022 + phase));
        const r       = baseR * breathe;

        // Speed glow (dragged nodes get bright from momentum)
        const speed = isDragged ? 0 : Math.sqrt(nd.vx**2 + nd.vy**2);
        const speedGlow = Math.min(1, speed * 3);

        // Halo
        const haloMult = isSelected ? 5.5 : isDragged ? 6 : (3 + 0.6 * Math.sin(T * 0.022 + phase));
        const halo = ctx.createRadialGradient(nd.x, nd.y, 0, nd.x, nd.y, r * haloMult);
        const haloAlpha = isDragged ? 0.35 : isSelected ? 0.28 : (0.10 + 0.04 * Math.sin(T * 0.022 + phase) + speedGlow * 0.2);
        halo.addColorStop(0, hexAlpha(col, haloAlpha));
        halo.addColorStop(1, hexAlpha(col, 0));
        ctx.beginPath();
        ctx.arc(nd.x, nd.y, r * haloMult, 0, Math.PI * 2);
        ctx.fillStyle = halo;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(nd.x, nd.y, r, 0, Math.PI * 2);
        ctx.fillStyle  = hexAlpha(col, th.done ? 0.38 : (isSelected || isDragged) ? 1 : 0.88);
        ctx.shadowBlur = isDragged ? 30 : isSelected ? 22 : (8 + speedGlow * 10);
        ctx.shadowColor = col;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Border
        ctx.beginPath();
        ctx.arc(nd.x, nd.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = hexAlpha(col, (isSelected || isDragged) ? 1 : 0.5);
        ctx.lineWidth   = (isSelected || isDragged) ? 2.5 : 1;
        ctx.stroke();

        // Mass ring for dragged node (shows weight visually)
        if (isDragged) {
          const massR = r + 4 + nd.mass * 1.8;
          ctx.beginPath();
          ctx.arc(nd.x, nd.y, massR, 0, Math.PI * 2);
          ctx.strokeStyle = hexAlpha(col, 0.22);
          ctx.lineWidth   = 1;
          ctx.setLineDash([3, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Selection pulse
        if (isSelected) {
          const pulse = (Math.sin(T * 0.09) + 1) / 2;
          ctx.beginPath();
          ctx.arc(nd.x, nd.y, r + 6 + pulse * 7, 0, Math.PI * 2);
          ctx.strokeStyle = hexAlpha(col, 0.28 + pulse * 0.35);
          ctx.lineWidth   = 1.5;
          ctx.stroke();
        }

        // High-priority red dot
        if (th.priority === 'high' && !th.done) {
          ctx.beginPath();
          ctx.arc(nd.x + r * 0.68, nd.y - r * 0.68, Math.max(2.5, r * 0.28), 0, Math.PI * 2);
          ctx.fillStyle = '#f87171';
          ctx.fill();
        }

        // Label
        const raw     = th.insight || th.text || '';
        const label   = raw.slice(0, 34) + (raw.length > 34 ? '…' : '');
        const fs      = (isSelected || isDragged) ? 12 : 10;
        ctx.font      = `${(isSelected || isDragged) ? 600 : 400} ${fs}px system-ui, sans-serif`;
        ctx.fillStyle = hexAlpha('#ffffff', (isSelected || isDragged) ? 0.95 : 0.58);
        ctx.textAlign = 'left';
        ctx.fillText(label, nd.x + r + 5, nd.y + 4);
      });

      ctx.restore();
      frameId = requestAnimationFrame(frame);
    }

    frameId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(frameId);
  }, []); // intentionally stable

  // ── UI ───────────────────────────────────────────────────────────────────────

  const domCol = selected ? (DOMAIN_COLOR[selected.domain] || '#6b7280') : '#6b7280';

  return (
    <div className="thought-graph-root">
      <div className="tg-stats">
        <span className="tg-stat">{thoughts.length} nodes</span>
        <span className="tg-stat-div" />
        <span className="tg-stat">{edges.length} link{edges.length !== 1 ? 's' : ''}</span>
        <span className="tg-stat-div" />
        <span className="tg-hint">drag nodes · scroll/pinch · tap</span>
        {groqKey ? (
          <span className={`tg-ai-badge tg-ai-${aiStatus}`}>
            {aiStatus === 'loading' ? '◌ AI mapping…' :
             aiStatus === 'done'    ? `◈ ${clusters.length} cluster${clusters.length !== 1 ? 's' : ''}` :
             aiStatus === 'error'   ? '⚠ AI error' : '◈ AI'}
          </span>
        ) : (
          <span className="tg-ai-badge tg-ai-off" title="Add Groq key in Character page">◌ no AI key</span>
        )}
      </div>

      <div className="thought-graph-wrap">
        <canvas ref={canvasRef} className="thought-graph-canvas" />

        {selected && (
          <div className="tg-detail" style={{ '--dc': domCol }}>
            <div className="tgd-header">
              <div className="tgd-pills">
                <span className="tgd-domain" style={{ color: domCol, borderColor: `${domCol}44`, background: `${domCol}14` }}>
                  {selected.domain}
                </span>
                <span className="tgd-pill">{selected.type}</span>
                <span className={`tgd-pill tgd-pri-${selected.priority}`}>{selected.priority}</span>
              </div>
              <button className="tgd-close" onClick={() => setSelected(null)}>✕</button>
            </div>

            <div className="tgd-text">{selected.text}</div>

            {selected.insight && selected.insight !== selected.text && (
              <div className="tgd-insight">◆ {selected.insight}</div>
            )}

            {(selected.tags || []).length > 0 && (
              <div className="tgd-tags">
                {selected.tags.map(tag => <span key={tag} className="tgd-tag">#{tag}</span>)}
              </div>
            )}

            {relatedThoughts.length > 0 && (
              <div className="tgd-synthesis">
                <div className="tgd-synthesis-label">
                  <span>◈ AI SYNTHESIS</span>
                  {!groqKey && <span className="tgd-synthesis-hint">add Groq key in Character</span>}
                </div>
                {synthesis === 'loading' ? (
                  <div className="tgd-synthesis-loading"><span className="tgd-pulse" />analyzing connections…</div>
                ) : synthesis ? (
                  <div className="tgd-synthesis-text">{synthesis}</div>
                ) : groqKey ? (
                  <div className="tgd-synthesis-empty">no insight generated</div>
                ) : null}
              </div>
            )}

            {relatedThoughts.length > 0 && (
              <div className="tgd-related">
                <div className="tgd-related-label">CONNECTED THOUGHTS</div>
                {relatedThoughts.map(({ thought: rt, score }) => (
                  <div key={rt.id} className="tgd-related-row" onClick={() => setSelected(rt)}>
                    <div className="tgd-rel-bar" style={{ width: `${score * 100}%`, background: DOMAIN_COLOR[rt.domain] || '#6b7280', opacity: 0.4 }} />
                    <span className="tgd-rel-domain" style={{ color: DOMAIN_COLOR[rt.domain] || '#6b7280' }}>{rt.domain}</span>
                    <span className="tgd-rel-text">{(rt.insight || rt.text).slice(0, 52)}{(rt.insight || rt.text).length > 52 ? '…' : ''}</span>
                    <span className="tgd-rel-score">{Math.round(score * 100)}%</span>
                  </div>
                ))}
              </div>
            )}

            <div className="tgd-actions">
              {!selected.done && (
                <button className="tgd-btn tgd-done" onClick={() => {
                  updateThought(selected.id, { done: true, completedAt: new Date().toISOString() });
                  setSelected(null);
                }}>✓ Done</button>
              )}
              <button className="tgd-btn tgd-del" onClick={() => {
                deleteThought(selected.id);
                setSelected(null);
              }}>✕ Delete</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
