import { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { DOMAIN_COLOR } from '../../constants/index.js';

const WORLD_W = 4000;
const WORLD_H = 3000;
const NODE_W  = 220;
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
  const [drag, setDrag]       = useState(null);
  const [linking, setLinking] = useState(null);
  const [picker, setPicker]   = useState(false);
  const [search, setSearch]   = useState('');

  useEffect(() => { camRef.current = cam; }, [cam]);

  const nodeById = useMemo(() => Object.fromEntries(nodes.map(n => [n.id, n])), [nodes]);
  const posOf = n => (drag && drag.id === n.id) ? { x: drag.x, y: drag.y } : { x: n.x, y: n.y };

  function centerWorld() {
    const r = viewportRef.current?.getBoundingClientRect();
    const w = r?.width || 600, h = r?.height || 400;
    return {
      x: (w / 2 - cam.x) / cam.zoom - NODE_W / 2,
      y: (h / 2 - cam.y) / cam.zoom - 40,
    };
  }

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

  function addNote() {
    const { x, y } = centerWorld();
    game.addWorkbenchNode({ kind: 'note', text: '', color: '#00d9b1', x, y });
  }
  function addThought(t) {
    const { x, y } = centerWorld();
    const jitter = nodes.length % 5 * 28;
    game.addWorkbenchNode({
      kind: 'thought', text: t.text, color: DOMAIN_COLOR[t.domain] || '#00d9b1',
      domain: t.domain, thoughtId: t.id, x: x + jitter, y: y + jitter,
    });
    setPicker(false);
    setSearch('');
  }

  const usedThoughtIds = new Set(nodes.filter(n => n.thoughtId).map(n => n.thoughtId));
  const availThoughts = (state.thoughts || [])
    .filter(t => !t.done && !usedThoughtIds.has(t.id))
    .slice(0, 80);

  const searchLower = search.toLowerCase();
  const filteredThoughts = search
    ? availThoughts.filter(t =>
        (t.text || '').toLowerCase().includes(searchLower) ||
        (t.domain || '').toLowerCase().includes(searchLower)
      )
    : availThoughts;

  function closePicker() {
    setPicker(false);
    setSearch('');
  }

  return (
    <div className="wb-root">
      <div className="wb-toolbar">
        <button className="wb-tool-btn" onClick={addNote}>+ NOTE</button>
        <button className="wb-tool-btn" onClick={() => setPicker(true)}>+ THOUGHT</button>
        {nodes.length > 0 && (
          <span className="wb-node-count">
            {nodes.length} node{nodes.length !== 1 ? 's' : ''} · {edges.length} link{edges.length !== 1 ? 's' : ''}
          </span>
        )}
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
            <div className="wb-empty-icon">
              <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                <rect x="4" y="4" width="20" height="15" rx="2" stroke="currentColor" strokeWidth="1.4"/>
                <rect x="28" y="4" width="20" height="15" rx="2" stroke="currentColor" strokeWidth="1.4"/>
                <rect x="16" y="33" width="20" height="15" rx="2" stroke="currentColor" strokeWidth="1.4"/>
                <line x1="14" y1="19" x2="26" y2="33" stroke="currentColor" strokeWidth="1.4" strokeDasharray="3 2.5"/>
                <line x1="38" y1="19" x2="26" y2="33" stroke="currentColor" strokeWidth="1.4" strokeDasharray="3 2.5"/>
              </svg>
            </div>
            <div className="wb-empty-title">WORKBENCH</div>
            <div className="wb-empty-sub">infinite spatial canvas</div>
            <div className="wb-empty-body">
              Drop notes and thoughts onto the board.<br />
              Drag them into clusters. Draw edges to connect ideas.
            </div>
            <div className="wb-empty-actions">
              <button className="wb-tool-btn" onClick={addNote}>Place note</button>
              <button className="wb-tool-btn" onClick={() => setPicker(true)}>Drop thought</button>
            </div>
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
            <defs>
              <filter id="wb-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            {edges.map(ed => {
              const a = nodeById[ed.from], b = nodeById[ed.to];
              if (!a || !b) return null;
              const pa = posOf(a), pb = posOf(b);
              const x1 = pa.x + NODE_W / 2, y1 = pa.y + 34;
              const x2 = pb.x + NODE_W / 2, y2 = pb.y + 34;
              const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
              const edgeColor = a.color || '#00d9b1';
              return (
                <g key={ed.id} className="wb-edge" onClick={() => game.deleteWorkbenchEdge(ed.id)}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} className="wb-edge-hit" />
                  <line x1={x1} y1={y1} x2={x2} y2={y2} className="wb-edge-line" stroke={edgeColor} />
                  <circle cx={mx} cy={my} r="3.5" className="wb-edge-dot" fill={edgeColor} />
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
                  <span className="wb-node-kind">
                    {n.kind === 'thought' ? (n.domain || 'THOUGHT') : 'NOTE'}
                  </span>
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
                  <div className="wb-node-text ro">{n.text || '—'}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {picker && (
        <div className="wb-picker-overlay" onClick={closePicker}>
          <div className="wb-picker" onClick={e => e.stopPropagation()}>
            <div className="wb-picker-head">
              <span>SELECT A THOUGHT</span>
              <button className="wb-picker-close" onClick={closePicker}>×</button>
            </div>
            <div className="wb-picker-search">
              <input
                className="wb-picker-search-input"
                placeholder="Search by text or domain…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                autoFocus
              />
            </div>
            <div className="wb-picker-list">
              {filteredThoughts.length === 0 && (
                <div className="wb-picker-empty">
                  {search ? 'No matching thoughts.' : 'No thoughts available — capture some first.'}
                </div>
              )}
              {filteredThoughts.map(t => (
                <button
                  key={t.id}
                  className="wb-picker-item"
                  style={{ '--nc': DOMAIN_COLOR[t.domain] || '#00d9b1' }}
                  onClick={() => addThought(t)}
                >
                  <span className="wb-picker-dom">{t.domain || 'UNKNOWN'}</span>
                  <span className="wb-picker-text">{t.text || '(empty thought)'}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
