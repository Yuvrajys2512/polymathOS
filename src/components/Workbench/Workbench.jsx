import { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { DOMAIN_COLOR } from '../../constants/index.js';

const WORLD_W = 4000;
const WORLD_H = 3000;
const NODE_W  = 172;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export default function Workbench({ game }) {
  const { state } = game;
  const nodes = state.workbench?.nodes || [];
  const edges = state.workbench?.edges || [];

  const viewportRef = useRef(null);
  const panRef  = useRef(null);
  const dragRef = useRef(null);
  const camRef  = useRef({ x: 60, y: 60, zoom: 1 });

  const [cam, setCam]         = useState({ x: 60, y: 60, zoom: 1 });
  const [drag, setDrag]       = useState(null);   // { id, x, y }
  const [linking, setLinking] = useState(null);   // source node id
  const [picker, setPicker]   = useState(false);

  useEffect(() => { camRef.current = cam; }, [cam]);

  const nodeById = useMemo(() => Object.fromEntries(nodes.map(n => [n.id, n])), [nodes]);
  const posOf = n => (drag && drag.id === n.id) ? { x: drag.x, y: drag.y } : { x: n.x, y: n.y };

  // viewport center → world coords
  function centerWorld() {
    const r = viewportRef.current?.getBoundingClientRect();
    const w = r?.width || 600, h = r?.height || 400;
    return {
      x: (w / 2 - cam.x) / cam.zoom - NODE_W / 2,
      y: (h / 2 - cam.y) / cam.zoom - 40,
    };
  }

  // ── pan (drag empty space) ──
  function onWorldPointerDown(e) {
    if (e.target.closest('.wb-node')) return;
    if (linking) { setLinking(null); return; }
    panRef.current = { sx: e.clientX, sy: e.clientY, cx: cam.x, cy: cam.y };
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
  }
  function onWorldPointerMove(e) {
    if (!panRef.current) return;
    const { sx, sy, cx, cy } = panRef.current;
    setCam(c => ({ ...c, x: cx + (e.clientX - sx), y: cy + (e.clientY - sy) }));
  }
  function onWorldPointerUp(e) {
    panRef.current = null;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
  }

  // ── node drag ──
  function onNodePointerDown(e, node) {
    e.stopPropagation();
    if (linking) {
      if (linking !== node.id) game.addWorkbenchEdge(linking, node.id);
      setLinking(null);
      return;
    }
    dragRef.current = { id: node.id, sx: e.clientX, sy: e.clientY, ox: node.x, oy: node.y, moved: false };
    setDrag({ id: node.id, x: node.x, y: node.y });
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
  }
  function onNodePointerMove(e) {
    const d = dragRef.current;
    if (!d) return;
    d.moved = true;
    const z = camRef.current.zoom;
    setDrag({ id: d.id, x: d.ox + (e.clientX - d.sx) / z, y: d.oy + (e.clientY - d.sy) / z });
  }
  function onNodePointerUp(e) {
    const d = dragRef.current;
    if (d) {
      if (d.moved) {
        const z = camRef.current.zoom;
        game.updateWorkbenchNode(d.id, {
          x: d.ox + (e.clientX - d.sx) / z,
          y: d.oy + (e.clientY - d.sy) / z,
        });
      }
      dragRef.current = null;
      setDrag(null);
    }
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
  }

  // ── zoom ──
  function zoomBy(factor) {
    const r = viewportRef.current?.getBoundingClientRect();
    const mx = (r?.width || 600) / 2, my = (r?.height || 400) / 2;
    setCam(c => {
      const z = clamp(c.zoom * factor, 0.3, 2.5);
      const wx = (mx - c.x) / c.zoom, wy = (my - c.y) / c.zoom;
      return { zoom: z, x: mx - wx * z, y: my - wy * z };
    });
  }
  const resetView = () => setCam({ x: 60, y: 60, zoom: 1 });

  // wheel zoom anchored to cursor (non-passive so we can preventDefault)
  const onWheel = useCallback((e) => {
    const vp = viewportRef.current;
    if (!vp) return;
    e.preventDefault();
    const r = vp.getBoundingClientRect();
    const mx = e.clientX - r.left, my = e.clientY - r.top;
    setCam(c => {
      const z = clamp(c.zoom * (e.deltaY < 0 ? 1.1 : 1 / 1.1), 0.3, 2.5);
      const wx = (mx - c.x) / c.zoom, wy = (my - c.y) / c.zoom;
      return { zoom: z, x: mx - wx * z, y: my - wy * z };
    });
  }, []);
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    vp.addEventListener('wheel', onWheel, { passive: false });
    return () => vp.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  // ── add nodes ──
  function addNote() {
    const { x, y } = centerWorld();
    game.addWorkbenchNode({ kind: 'note', text: '', color: '#00d9b1', x, y });
  }
  function addThought(t) {
    const { x, y } = centerWorld();
    const jitter = nodes.length % 5 * 26;
    game.addWorkbenchNode({
      kind: 'thought', text: t.text, color: DOMAIN_COLOR[t.domain] || '#00d9b1',
      domain: t.domain, thoughtId: t.id, x: x + jitter, y: y + jitter,
    });
    setPicker(false);
  }

  const usedThoughtIds = new Set(nodes.filter(n => n.thoughtId).map(n => n.thoughtId));
  const availThoughts  = (state.thoughts || []).filter(t => !t.done && !usedThoughtIds.has(t.id)).slice(0, 60);

  return (
    <div className="wb-root">
      <div className="wb-toolbar">
        <button className="wb-tool-btn" onClick={addNote}>+ NOTE</button>
        <button className="wb-tool-btn" onClick={() => setPicker(true)}>+ THOUGHT</button>
        <span className="wb-zoom">
          <button onClick={() => zoomBy(1 / 1.2)}>−</button>
          <span className="wb-zoom-val">{Math.round(cam.zoom * 100)}%</span>
          <button onClick={() => zoomBy(1.2)}>+</button>
          <button onClick={resetView} title="Reset view">⟲</button>
        </span>
      </div>

      {linking && (
        <div className="wb-link-hint">Click another card to connect · click empty space to cancel</div>
      )}

      <div ref={viewportRef} className={`wb-viewport${linking ? ' linking' : ''}`}>
        {nodes.length === 0 && (
          <div className="wb-empty">
            <div className="wb-empty-icon">⊞</div>
            <div className="wb-empty-title">THE WORKBENCH</div>
            <div className="wb-empty-body">
              An infinite space to think. Drop notes and thoughts, drag them into clusters,<br />
              draw connections by hand. Where loose captures become real plans.
            </div>
            <button className="primary" onClick={addNote}>Place first note</button>
          </div>
        )}

        <div
          className="wb-world"
          style={{ transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.zoom})` }}
          onPointerDown={onWorldPointerDown}
          onPointerMove={onWorldPointerMove}
          onPointerUp={onWorldPointerUp}
        >
          <svg className="wb-edges" width={WORLD_W} height={WORLD_H}>
            {edges.map(ed => {
              const a = nodeById[ed.from], b = nodeById[ed.to];
              if (!a || !b) return null;
              const pa = posOf(a), pb = posOf(b);
              const x1 = pa.x + NODE_W / 2, y1 = pa.y + 34;
              const x2 = pb.x + NODE_W / 2, y2 = pb.y + 34;
              return (
                <g key={ed.id} className="wb-edge" onClick={() => game.deleteWorkbenchEdge(ed.id)}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} className="wb-edge-hit" />
                  <line x1={x1} y1={y1} x2={x2} y2={y2} className="wb-edge-line" />
                </g>
              );
            })}
          </svg>

          {nodes.map(n => {
            const pos = posOf(n);
            return (
              <div
                key={n.id}
                className={`wb-node ${n.kind}${linking === n.id ? ' linking-src' : ''}`}
                style={{ left: pos.x, top: pos.y, '--nc': n.color || '#00d9b1' }}
              >
                <div
                  className="wb-node-head"
                  onPointerDown={e => onNodePointerDown(e, n)}
                  onPointerMove={onNodePointerMove}
                  onPointerUp={onNodePointerUp}
                >
                  <span className="wb-node-dot" />
                  <span className="wb-node-kind">{n.kind === 'thought' ? (n.domain || 'THOUGHT') : 'NOTE'}</span>
                  <button
                    className="wb-node-link"
                    title="Connect to another card"
                    onPointerDown={e => { e.stopPropagation(); setLinking(n.id); }}
                  >⤳</button>
                  <button
                    className="wb-node-del"
                    title="Remove"
                    onPointerDown={e => { e.stopPropagation(); game.deleteWorkbenchNode(n.id); }}
                  >×</button>
                </div>
                {n.kind === 'note' ? (
                  <textarea
                    className="wb-node-text"
                    value={n.text}
                    placeholder="Type a thought…"
                    onChange={e => game.updateWorkbenchNode(n.id, { text: e.target.value })}
                  />
                ) : (
                  <div className="wb-node-text ro">{n.text}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {picker && (
        <div className="wb-picker-overlay" onClick={() => setPicker(false)}>
          <div className="wb-picker" onClick={e => e.stopPropagation()}>
            <div className="wb-picker-head">
              <span>DROP A THOUGHT ONTO THE BOARD</span>
              <button className="wb-picker-close" onClick={() => setPicker(false)}>×</button>
            </div>
            <div className="wb-picker-list">
              {availThoughts.length === 0 && (
                <div className="wb-picker-empty">No more thoughts to add — capture some first.</div>
              )}
              {availThoughts.map(t => (
                <button
                  key={t.id}
                  className="wb-picker-item"
                  style={{ '--nc': DOMAIN_COLOR[t.domain] || '#00d9b1' }}
                  onClick={() => addThought(t)}
                >
                  <span className="wb-picker-dom">{t.domain}</span>
                  <span className="wb-picker-text">{t.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
