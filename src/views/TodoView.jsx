import { useState, useRef, useEffect, useMemo } from 'react';
import { expandTask, suggestTodos } from '../utils/todoAI.js';
import { ENERGY_LEVELS } from '../constants/index.js';

const P_COLORS = { 1: '#f87171', 2: '#fbbf24', 3: '#00d9b1', 4: '#6b7280' };
const P_LABELS = { 1: 'Critical', 2: 'Important', 3: 'Normal', 4: 'Someday' };

// ── Scope date helpers ───────────────────────────────────────────
function getMondayOfWeek() {
  const d = new Date();
  const day = d.getDay();
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
  return d.toISOString().split('T')[0];
}
function getFirstOfMonth() {
  return new Date().toISOString().slice(0, 8) + '01';
}

// ── Command bar natural-language parser ──────────────────────────
function parseInput(raw) {
  let text = raw;
  let priority = null;
  let estimate = null;
  const pMatch = text.match(/\b(p[1-4])\b/i);
  if (pMatch) { priority = parseInt(pMatch[1][1]); text = text.replace(pMatch[0], ''); }
  const tMatch = text.match(/\b(\d+(?:\.\d+)?)(m|h)\b/i);
  if (tMatch) {
    estimate = tMatch[2].toLowerCase() === 'h' ? Math.round(parseFloat(tMatch[1]) * 60) : parseInt(tMatch[1]);
    text = text.replace(tMatch[0], '');
  }
  return { text: text.replace(/\s+/g, ' ').trim(), priority, estimate };
}

// ── Sparkle burst on completion ──────────────────────────────────
function fireSparkle(el) {
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const colors = ['#ffffff', '#fbbf24', '#00d9b1', '#a78bfa', '#f9fafb', '#4ade80'];
  const glyphs = ['✦', '✧', '·', '✦', '✧'];
  for (let i = 0; i < 18; i++) {
    const angle = (i / 18) * Math.PI * 2 + (Math.random() - 0.5) * 0.7;
    const dist  = 22 + Math.random() * 52;
    const color = colors[i % colors.length];
    const p = document.createElement('div');
    if (i % 3 < 2) {
      const fs = 7 + Math.random() * 9;
      p.textContent = glyphs[i % glyphs.length];
      p.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;font-size:${fs}px;color:${color};pointer-events:none;z-index:9999;line-height:1;text-shadow:0 0 8px ${color};`;
    } else {
      const sz = 2 + Math.random() * 3.5;
      p.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;width:${sz}px;height:${sz}px;border-radius:50%;background:${color};pointer-events:none;z-index:9999;box-shadow:0 0 5px ${color};`;
    }
    document.body.appendChild(p);
    const rot = (Math.random() - 0.5) * 540;
    const dur = 420 + Math.random() * 280;
    p.animate([
      { transform: `translate(-50%,-50%) scale(1.2) rotate(0deg)`, opacity: 1 },
      { transform: `translate(calc(-50% + ${Math.cos(angle)*dist}px),calc(-50% + ${Math.sin(angle)*dist}px)) scale(0) rotate(${rot}deg)`, opacity: 0 },
    ], { duration: dur, easing: 'cubic-bezier(0,0.9,0.57,1)', fill: 'forwards' }).onfinish = () => p.remove();
  }
}

function fireRipple(el) {
  if (!el) return;
  const r = document.createElement('div');
  r.className = 'todo-completion-ripple';
  el.style.position = 'relative';
  el.appendChild(r);
  r.addEventListener('animationend', () => r.remove());
}

// ── Multi-Arc HUD — accepts pre-filtered todos ───────────────────
function MultiArcHUD({ todos }) {
  const total     = todos.length;
  const doneCount = todos.filter(t => t.done).length;
  const arcs = [1, 2, 3, 4].map(p => {
    const pAll  = todos.filter(t => t.priority === p);
    const pDone = pAll.filter(t => t.done);
    return { p, frac: pAll.length ? pDone.length / pAll.length : 0, done: pDone.length, tot: pAll.length };
  });
  const radii = [46, 37, 28, 19], strokes = [4.5, 3.5, 3, 2.5], S = 110, C = S / 2;
  return (
    <div className="todo-multi-arc-hud">
      <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`}>
        <g className="hud-scanner">
          <line x1={C} y1={C - radii[0] - 5} x2={C} y2={C - 12} stroke="var(--accent)" strokeWidth="1" opacity="0.5" />
        </g>
        {arcs.map(({ p, frac }, i) => {
          const R = radii[i], sw = strokes[i], circ = 2 * Math.PI * R;
          return (
            <g key={p}>
              <circle cx={C} cy={C} r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={sw} />
              {frac > 0 && (
                <circle cx={C} cy={C} r={R} fill="none" stroke={P_COLORS[p]} strokeWidth={sw}
                  strokeDasharray={circ} strokeDashoffset={circ * (1 - frac)}
                  strokeLinecap="round" transform={`rotate(-90 ${C} ${C})`}
                  style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.22,1,0.36,1)', filter: `drop-shadow(0 0 5px ${P_COLORS[p]}99)` }}
                />
              )}
            </g>
          );
        })}
        <text x={C} y={C - 3} textAnchor="middle" fill="var(--ink)" fontSize="13" fontWeight="700" fontFamily="var(--mono)">{doneCount}/{total}</text>
        <text x={C} y={C + 10} textAnchor="middle" fill="var(--muted)" fontSize="8" letterSpacing="0.08em">DONE</text>
      </svg>
      <div className="hud-legend">
        {arcs.map(({ p, done, tot }) => (
          <div key={p} className="hud-legend-item">
            <span className="hud-legend-dot" style={{ background: P_COLORS[p] }} />
            <span className="hud-legend-count">{done}/{tot}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Velocity Sparkline (daily only) ─────────────────────────────
function VelocitySpark({ todos, today }) {
  const points = useMemo(() => {
    return todos
      .filter(t => t.done && t.doneAt?.startsWith(today))
      .map(t => { const d = new Date(t.doneAt); return d.getHours() + d.getMinutes() / 60; })
      .sort((a, b) => a - b);
  }, [todos, today]);
  if (points.length < 2) return null;
  const W = 110, H = 22;
  const mn = Math.min(...points), mx = Math.max(...points), rng = mx - mn || 1;
  const pts = points.map((h, i) => `${(i / (points.length - 1)) * (W - 8) + 4},${H - 4 - ((h - mn) / rng) * (H - 8)}`);
  return (
    <div className="velocity-spark" title={`${points.length} done today`}>
      <span className="velocity-label">velocity</span>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <polyline points={pts.join(' ')} fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        {pts.map((pt, i) => { const [x, y] = pt.split(','); return <circle key={i} cx={x} cy={y} r="2.5" fill="var(--accent)" opacity="0.9" />; })}
      </svg>
    </div>
  );
}

// ── Living Background canvas ─────────────────────────────────────
function LivingBackground({ completionRatio }) {
  const canvasRef = useRef(null);
  const ratioRef  = useRef(completionRatio);
  useEffect(() => { ratioRef.current = completionRatio; }, [completionRatio]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    function resize() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const particles = Array.from({ length: 28 }, () => ({
      x: Math.random() * (canvas.width || 800),
      y: Math.random() * (canvas.height || 600),
      r: 1 + Math.random() * 1.8,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      a: 0.06 + Math.random() * 0.12,
    }));
    function tick() {
      const ratio = ratioRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const r = Math.round((1 - ratio) * 30  + ratio * 74);
      const g = Math.round((1 - ratio) * 150 + ratio * 222);
      const b = Math.round((1 - ratio) * 255 + ratio * 128);
      particles.forEach(p => {
        p.x = (p.x + p.vx + canvas.width)  % canvas.width;
        p.y = (p.y + p.vy + canvas.height) % canvas.height;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.a})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(tick);
    }
    tick();
    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
  }, []);
  return <canvas ref={canvasRef} className="todo-living-bg" />;
}

// ── Subtask row ──────────────────────────────────────────────────
function SubtaskRow({ sub, onToggle, onDelete, delay = 0 }) {
  return (
    <div className={`subtask-row stagger-in${sub.done ? ' done' : ''}`} style={{ animationDelay: `${delay}ms` }}>
      <button className="sub-check" onClick={onToggle}>{sub.done ? '✓' : ''}</button>
      <span className="sub-text">{sub.text}</span>
      <button className="sub-del icon ghost" onClick={onDelete}>×</button>
    </div>
  );
}

// ── Individual todo card ─────────────────────────────────────────
function TodoItem({ todo, onToggle, onDelete, onAddSubtask, onToggleSub, onDeleteSub, groqKey, onFocus, dragHandlers = {}, viewMode, completing = false }) {
  const [expanded,  setExpanded]  = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const itemRef  = useRef(null);
  const checkRef = useRef(null);

  const color     = P_COLORS[todo.priority] || P_COLORS[3];
  const isOverdue = !todo.done && todo.date < new Date().toISOString().split('T')[0];
  const daysOver  = useMemo(() => {
    if (!isOverdue) return 0;
    return Math.floor((Date.now() - new Date(todo.date)) / 86400000);
  }, [isOverdue, todo.date]);

  const overdueStyle = isOverdue ? {
    boxShadow: `inset -3px 0 ${6 + daysOver * 4}px rgba(248,113,113,${Math.min(0.12 + daysOver * 0.06, 0.45)}), 0 0 ${10 + daysOver * 8}px rgba(248,113,113,${Math.min(0.08 + daysOver * 0.04, 0.35)})`,
  } : {};

  async function handleExpand() {
    if (!groqKey) return;
    setAiLoading(true);
    try {
      const subs = await expandTask(todo.text, groqKey);
      subs.forEach(text => onAddSubtask(todo.id, text));
      setExpanded(true);
    } finally { setAiLoading(false); }
  }

  function handleCheck() {
    if (todo.done) { onToggle(todo.id); return; }
    if (completing) return;
    fireSparkle(checkRef.current);
    fireRipple(itemRef.current);
    onToggle(todo.id);
  }

  return (
    <div
      ref={itemRef}
      className={`todo-item energy-rail${todo.done ? ' done' : ''}${isOverdue ? ' overdue' : ''}${viewMode === 'board' ? ' board-card' : ''}${completing ? ' completing' : ''}`}
      style={{ '--pc': color, ...overdueStyle }}
      data-p={todo.priority}
      {...dragHandlers}
    >
      <div className="todo-main">
        <button ref={checkRef} className={`todo-check${todo.done ? ' checked' : ''}`} onClick={handleCheck}>
          {todo.done && <span className="check-mark">✓</span>}
        </button>
        <div className="todo-body">
          <span className="todo-text">{todo.text}</span>
          <div className="todo-meta-row">
            {todo.estimate && <span className="todo-est">~{todo.estimate}m</span>}
            {isOverdue && <span className="todo-overdue-badge">{daysOver > 0 ? `${daysOver}d overdue` : 'overdue'}</span>}
          </div>
        </div>
        <div className="todo-actions">
          {!todo.done && (
            <button className="todo-focus-btn" onClick={() => onFocus?.()} title="Launch focus session">⚡</button>
          )}
          {!todo.done && (
            <button className={`todo-ai-btn${aiLoading ? ' loading' : ''}`} onClick={handleExpand}
              title={groqKey ? 'AI: break into subtasks' : 'Add Groq API key in Profile'} disabled={!groqKey || aiLoading}>
              {aiLoading ? '⟳' : '✦'}
            </button>
          )}
          {(todo.subtasks?.length > 0) && (
            <button className="todo-expand-btn icon ghost" onClick={() => setExpanded(e => !e)}>
              {expanded ? '▾' : '▸'}
            </button>
          )}
          <button className="icon danger" onClick={() => onDelete(todo.id)}>×</button>
        </div>
      </div>

      {viewMode === 'board' && (
        <div className="board-priority-label" style={{ color }}>P{todo.priority} · {P_LABELS[todo.priority]}</div>
      )}

      {todo.subtasks?.length > 0 && expanded && (
        <div className="subtask-list">
          {todo.subtasks.map((sub, i) => (
            <SubtaskRow key={sub.id} sub={sub} delay={i * 90}
              onToggle={() => onToggleSub(todo.id, sub.id)}
              onDelete={() => onDeleteSub(todo.id, sub.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Victory overlay ──────────────────────────────────────────────
const V_LINES = [
  { prefix: 'SYS',  text: 'POLYMATH OS — BOARD STATUS',  delay: 0   },
  { prefix: '>',    text: 'scanning active tasks…',       delay: 150 },
  { prefix: 'OK',   text: 'all tasks resolved',           delay: 500 },
  { prefix: '>',    text: 'committing XP to ledger…',    delay: 850 },
  { prefix: 'OK',   text: 'streak updated',               delay: 1100 },
  { prefix: '///',  text: 'board cleared. well played.',  delay: 1500 },
];

function VictoryOverlay({ onDismiss }) {
  useEffect(() => { const t = setTimeout(onDismiss, 5500); return () => clearTimeout(t); }, [onDismiss]);
  return (
    <div className="victory-overlay" onClick={onDismiss}>
      <div className="victory-terminal">
        <div className="victory-scan-line" />
        <div className="victory-header">
          <span className="victory-dot" /><span className="victory-dot" /><span className="victory-dot v-accent" />
          <span className="victory-title-bar">polymath_os — task_runner</span>
          <span className="victory-dismiss-hint">click to dismiss</span>
        </div>
        <div className="victory-body">
          {V_LINES.map((line, i) => (
            <div key={i} className="v-line" style={{ '--vl-delay': `${line.delay}ms` }}>
              <span className={`v-prefix v-prefix-${line.prefix === 'OK' ? 'ok' : line.prefix === 'SYS' ? 'sys' : line.prefix === '///' ? 'done' : 'cmd'}`}>
                {line.prefix}
              </span>
              <span className="v-text">{line.text}</span>
            </div>
          ))}
          <div className="v-progress-wrap" style={{ '--vl-delay': '1800ms' }}>
            <div className="v-progress-bar">
              <div className="v-progress-fill" />
            </div>
            <span className="v-progress-label">100%</span>
          </div>
        </div>
        <div className="victory-countdown" />
      </div>
    </div>
  );
}

// ── Scope labels / headers ───────────────────────────────────────
const SCOPE_LABELS = {
  daily:   { title: 'TODAY',      section: 'Today',      done: 'Done today',      overdue: 'Overdue' },
  weekly:  { title: 'THIS WEEK',  section: 'This Week',  done: 'Done this week',  overdue: 'From last week' },
  monthly: { title: 'THIS MONTH', section: 'This Month', done: 'Done this month', overdue: 'From last month' },
};

// ── Main view ────────────────────────────────────────────────────
export default function TodoView({ state, addTodo, toggleTodo, deleteTodo, addSubtask, toggleSubtask, deleteSubtask, onNav }) {
  const [rawInput,    setRawInput]    = useState('');
  const [priority,    setPriority]    = useState(2);
  const [estimate,    setEstimate]    = useState('');
  const [suggesting,  setSuggesting]  = useState(false);
  const [suggestErr,  setSuggestErr]  = useState('');
  const [viewMode,    setViewMode]    = useState('list');
  const [flipping,    setFlipping]    = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [adaptSorted, setAdaptSorted] = useState(false);
  const [localOrder,  setLocalOrder]  = useState(null);
  const [fireTs,        setFireTs]        = useState([]);
  const [completingIds, setCompletingIds] = useState(() => new Set());
  const [todoScope,   setTodoScope]   = useState('daily');
  const inputRef    = useRef(null);
  const prevDoneRef = useRef(-1);

  const parsed         = useMemo(() => parseInput(rawInput), [rawInput]);
  const activePriority = parsed.priority ?? priority;
  const activeEstimate = parsed.estimate ?? (estimate ? parseInt(estimate) : null);
  const hasHints       = parsed.priority !== null || parsed.estimate !== null;

  const today      = new Date().toISOString().split('T')[0];
  const weekStart  = useMemo(getMondayOfWeek, []);
  const monthStart = useMemo(getFirstOfMonth, []);
  const allTodos   = state.todos || [];

  // Reset drag order when scope changes
  useEffect(() => { setLocalOrder(null); prevDoneRef.current = -1; }, [todoScope]);

  // Scope-filtered todo lists
  const { scopedAll, scopedActive, scopedDone, scopedOverdue, compRatio } = useMemo(() => {
    let all, active, done, overdue;
    if (todoScope === 'daily') {
      all     = allTodos.filter(t => (!t.scope || t.scope === 'daily') && t.date === today);
      overdue = allTodos.filter(t => (!t.scope || t.scope === 'daily') && !t.done && t.date < today);
    } else if (todoScope === 'weekly') {
      all     = allTodos.filter(t => t.scope === 'weekly' && t.date >= weekStart);
      overdue = allTodos.filter(t => t.scope === 'weekly' && !t.done && t.date < weekStart);
    } else {
      const monthPrefix = monthStart.slice(0, 7);
      all     = allTodos.filter(t => t.scope === 'monthly' && t.date.startsWith(monthPrefix));
      overdue = allTodos.filter(t => t.scope === 'monthly' && !t.done && !t.date.startsWith(monthPrefix));
    }
    done   = all.filter(t => t.done);
    active = all.filter(t => !t.done);
    return {
      scopedAll: all, scopedActive: active, scopedDone: done, scopedOverdue: overdue,
      compRatio: all.length ? done.length / all.length : 0,
    };
  }, [allTodos, todoScope, today, weekStart, monthStart]);

  // Date to stamp new todos with
  const scopeDate = todoScope === 'daily' ? today : todoScope === 'weekly' ? weekStart : monthStart;

  const latestEnergy = useMemo(() => {
    const log = state.energyLog || [];
    return log.filter(e => e.date === today).pop()?.level ?? 3;
  }, [state.energyLog, today]);

  const sortedActive = useMemo(() => {
    let base;
    if (!adaptSorted) {
      base = [...scopedActive].sort((a, b) => a.priority - b.priority);
    } else if (latestEnergy >= 4) {
      base = [...scopedActive].sort((a, b) => a.priority - b.priority);
    } else if (latestEnergy <= 2) {
      base = [...scopedActive].sort((a, b) => b.priority - a.priority);
    } else {
      const ord = [2, 1, 3, 4];
      base = [...scopedActive].sort((a, b) => ord.indexOf(a.priority) - ord.indexOf(b.priority));
    }
    if (!localOrder) return base;
    const map = new Map(localOrder.map((id, i) => [id, i]));
    return [...base].sort((a, b) => (map.get(a.id) ?? 999) - (map.get(b.id) ?? 999));
  }, [scopedActive, localOrder, adaptSorted, latestEnergy]);

  const sortedOverdue = [...scopedOverdue].sort((a, b) => new Date(a.date) - new Date(b.date));
  const activeIds     = sortedActive.map(t => t.id);

  // Victory trigger
  useEffect(() => {
    if (prevDoneRef.current === -1) { prevDoneRef.current = scopedDone.length; return; }
    const prev = prevDoneRef.current;
    prevDoneRef.current = scopedDone.length;
    if (scopedAll.length > 0 && scopedDone.length === scopedAll.length && scopedDone.length > prev) {
      setShowVictory(true);
    }
  }, [scopedDone.length, scopedAll.length]);

  const isOnFire = useMemo(() => {
    const now = Date.now();
    return fireTs.filter(t => now - t < 5 * 60 * 1000).length >= 3;
  }, [fireTs]);

  function handleAdd(e) {
    e?.preventDefault();
    const text = parsed.text || rawInput.trim();
    if (!text) return;
    addTodo({ text, priority: activePriority, estimate: activeEstimate, scope: todoScope, date: scopeDate });
    setRawInput('');
    setEstimate('');
    inputRef.current?.focus();
  }

  function handleToggle(id) {
    const todo = allTodos.find(t => t.id === id);
    if (todo && !todo.done) {
      setFireTs(prev => [...prev, Date.now()]);
      setCompletingIds(prev => new Set([...prev, id]));
      setTimeout(() => {
        toggleTodo(id);
        setCompletingIds(prev => { const n = new Set(prev); n.delete(id); return n; });
      }, 500);
    } else {
      toggleTodo(id);
    }
  }

  async function handleSuggest() {
    if (!state.groqKey) { setSuggestErr('Add Groq API key in Profile to use AI suggestions.'); setTimeout(() => setSuggestErr(''), 3000); return; }
    setSuggesting(true); setSuggestErr('');
    try {
      const suggs = await suggestTodos(state.thoughts || [], state.intention, state.groqKey);
      if (!suggs.length) { setSuggestErr('No suggestions — capture more thoughts.'); setTimeout(() => setSuggestErr(''), 3500); return; }
      suggs.forEach(s => addTodo({ text: s.text, priority: s.priority || 2, scope: todoScope, date: scopeDate }));
    } catch { setSuggestErr('AI error — check API key.'); setTimeout(() => setSuggestErr(''), 3000); }
    finally { setSuggesting(false); }
  }

  function toggleView() {
    setFlipping(true);
    setTimeout(() => { setViewMode(v => v === 'list' ? 'board' : 'list'); setFlipping(false); }, 320);
  }

  function makeDrag(todoId, listIds) {
    return {
      draggable: true,
      onDragStart: e => { e.dataTransfer.effectAllowed = 'move'; e.currentTarget.classList.add('dragging'); e.dataTransfer.setData('text/plain', todoId); },
      onDragOver:  e => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); },
      onDragLeave: e => { e.currentTarget.classList.remove('drag-over'); },
      onDrop: e => {
        e.preventDefault(); e.currentTarget.classList.remove('drag-over');
        const dragId = e.dataTransfer.getData('text/plain');
        if (dragId === todoId) return;
        const ids = [...listIds];
        const from = ids.indexOf(dragId), to = ids.indexOf(todoId);
        if (from === -1 || to === -1) return;
        ids.splice(from, 1); ids.splice(to, 0, dragId);
        setLocalOrder(ids);
      },
      onDragEnd: e => { e.currentTarget.classList.remove('dragging'); },
    };
  }

  const commonProps = {
    onToggle: handleToggle, onDelete: deleteTodo,
    onAddSubtask: addSubtask, onToggleSub: toggleSubtask, onDeleteSub: deleteSubtask,
    groqKey: state.groqKey, onFocus: () => onNav?.('focus'), viewMode,
  };

  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const energyMeta = ENERGY_LEVELS.find(e => e.level === latestEnergy);
  const labels = SCOPE_LABELS[todoScope];

  const boardCols = [
    { p: 1, label: 'Critical',  tasks: sortedActive.filter(t => t.priority === 1) },
    { p: 2, label: 'Important', tasks: sortedActive.filter(t => t.priority === 2) },
    { p: 3, label: 'Normal',    tasks: sortedActive.filter(t => t.priority === 3) },
    { p: 4, label: 'Done',      tasks: scopedDone },
  ];

  return (
    <div className="todo-view">
      <LivingBackground completionRatio={compRatio} />
      {showVictory && <VictoryOverlay onDismiss={() => setShowVictory(false)} />}

      {/* Header */}
      <div className="todo-view-header">
        <div className="todo-view-title-block">
          <span className="view-title">{labels.title}</span>
          <span className="todo-view-date">{dateStr}</span>
          {todoScope === 'daily' && <VelocitySpark todos={allTodos} today={today} />}
        </div>
        <div className="todo-view-header-right">
          <MultiArcHUD todos={scopedAll} />
          <div className="todo-header-controls">
            <button
              className={`todo-ctrl-btn${adaptSorted ? ' active' : ''}`}
              onClick={() => setAdaptSorted(v => !v)}
              title={`Adaptive sort by energy — current: ${energyMeta?.label ?? 'Okay'}`}
            >
              {energyMeta?.emoji ?? '😐'} {adaptSorted ? 'sorted' : 'sort'}
            </button>
            <button
              className={`todo-ctrl-btn view-toggle-btn${flipping ? ' flipping' : ''}`}
              onClick={toggleView}
              title={viewMode === 'list' ? 'Board view' : 'List view'}
            >
              {viewMode === 'list' ? '⊞ Board' : '≡ List'}
            </button>
          </div>
        </div>
      </div>

      {/* Scope toggle */}
      <div className="todo-scope-toggle">
        {['daily', 'weekly', 'monthly'].map(s => (
          <button
            key={s}
            className={`scope-btn${todoScope === s ? ' active' : ''}`}
            onClick={() => setTodoScope(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Command bar */}
      <form onSubmit={handleAdd}>
        <div className={`todo-cmd-bar${isOnFire ? ' on-fire' : ''}${rawInput ? ' has-input' : ''}`}>
          <div className="cmd-input-row">
            <span className="cmd-bar-icon">›</span>
            <input
              ref={inputRef}
              className="todo-cmd-input"
              value={rawInput}
              onChange={e => setRawInput(e.target.value)}
              placeholder={`Add a ${todoScope} task…`}
            />
            <button type="submit" className="todo-add-btn" disabled={!rawInput.trim()}>+</button>
          </div>
          <div className="cmd-toolbar">
            <div className="cmd-priority-btns">
              {[1, 2, 3, 4].map(p => (
                <button
                  key={p}
                  type="button"
                  className={`cmd-p-btn${(parsed.priority ?? priority) === p ? ' active' : ''}`}
                  style={{ '--pc': P_COLORS[p] }}
                  onClick={() => setPriority(p)}
                  title={P_LABELS[p]}
                >
                  P{p}
                </button>
              ))}
            </div>
            <div className="cmd-toolbar-sep" />
            <div className="cmd-time-row">
              <span className="cmd-time-icon">⏱</span>
              <input
                className="cmd-time-input"
                type="number"
                min="1"
                max="480"
                value={parsed.estimate ?? estimate}
                onChange={e => setEstimate(e.target.value)}
                placeholder="min"
              />
              <div className="cmd-time-presets">
                {[15, 30, 60].map(m => (
                  <button
                    key={m}
                    type="button"
                    className={`cmd-preset-btn${parseInt(estimate) === m && parsed.estimate === null ? ' active' : ''}`}
                    onClick={() => setEstimate(estimate === String(m) ? '' : String(m))}
                  >{m}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
        {hasHints && parsed.text && (
          <div className="cmd-parse-chips">
            <span className="parse-chip parse-chip-preview">"{parsed.text}"</span>
            {parsed.priority !== null && (
              <span className="parse-chip" style={{ '--pc': P_COLORS[parsed.priority] }}>
                P{parsed.priority} detected
              </span>
            )}
            {parsed.estimate !== null && (
              <span className="parse-chip parse-chip-time">⏱ {parsed.estimate}m detected</span>
            )}
          </div>
        )}
      </form>

      {/* AI suggest */}
      <div className="todo-view-ai-row">
        <button className={`ai-suggest-btn${suggesting ? ' loading' : ''}`} onClick={handleSuggest} disabled={suggesting}>
          {suggesting ? <><span className="ai-spin">⟳</span> Analyzing…</> : <><span>✦</span> AI: Suggest from thoughts</>}
        </button>
        {suggestErr && <span className="todo-err">{suggestErr}</span>}
      </div>

      {/* Content */}
      <div className={`todo-view-content${flipping ? ' view-flip-out' : ' view-flip-in'}`}>
        {viewMode === 'board' ? (
          <div className="todo-board">
            {boardCols.map(col => (
              <div key={col.p} className="board-col" style={{ '--pc': P_COLORS[col.p] }}>
                <div className="board-col-header">
                  <span className="board-col-dot" />
                  <span>{col.label}</span>
                  <span className="board-col-count">{col.tasks.length}</span>
                </div>
                <div className="board-col-body">
                  {col.tasks.map(t => (
                    <TodoItem key={t.id} todo={t} {...commonProps}
                      completing={completingIds.has(t.id)}
                      dragHandlers={col.p !== 4 ? makeDrag(t.id, activeIds) : {}} />
                  ))}
                  {col.tasks.length === 0 && <div className="board-empty">—</div>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {sortedOverdue.length > 0 && (
              <section className="todo-view-section">
                <div className="todo-view-section-label overdue-label">⚠ {labels.overdue} ({sortedOverdue.length})</div>
                {sortedOverdue.map(t => (
                  <TodoItem key={t.id} todo={t} {...commonProps}
                    completing={completingIds.has(t.id)}
                    dragHandlers={makeDrag(t.id, sortedOverdue.map(x => x.id))} />
                ))}
              </section>
            )}
            <section className="todo-view-section">
              <div className="todo-view-section-label">
                {labels.section}
                {sortedActive.length > 0 && <span className="todo-view-section-count">{sortedActive.length} left</span>}
                {adaptSorted && <span className="adapt-badge">{energyMeta?.emoji} energy-sorted</span>}
              </div>
              {sortedActive.length === 0 && scopedDone.length === 0 ? (
                <div className="todo-empty">
                  <div className="todo-empty-icon">◈</div>
                  <span>Nothing queued.</span>
                  <span>Add a task or let AI suggest.</span>
                </div>
              ) : (
                sortedActive.map(t => (
                  <TodoItem key={t.id} todo={t} {...commonProps}
                    completing={completingIds.has(t.id)}
                    dragHandlers={makeDrag(t.id, activeIds)} />
                ))
              )}
            </section>
            {scopedDone.length > 0 && (
              <details className="todo-view-section todo-done-section" open={compRatio === 1 && scopedAll.length > 0}>
                <summary className="todo-view-section-label done-label">✓ {labels.done} ({scopedDone.length})</summary>
                {scopedDone.map(t => <TodoItem key={t.id} todo={t} {...commonProps} completing={false} dragHandlers={{}} />)}
              </details>
            )}
          </>
        )}
      </div>
    </div>
  );
}
