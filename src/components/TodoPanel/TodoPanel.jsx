import { useState, useRef, useCallback } from 'react';
import { expandTask, suggestTodos } from '../../utils/todoAI.js';

const P_COLORS = { 1: '#f87171', 2: '#fbbf24', 3: '#00d9b1', 4: '#6b7280' };
const P_LABELS = { 1: 'Critical', 2: 'Important', 3: 'Normal', 4: 'Someday' };

function PriorityDot({ p, active, onClick }) {
  return (
    <button
      className={`p-dot${active ? ' active' : ''}`}
      style={{ '--pc': P_COLORS[p] }}
      onClick={onClick}
      title={`P${p} – ${P_LABELS[p]}`}
    >
      P{p}
    </button>
  );
}

function SubtaskRow({ sub, onToggle, onDelete }) {
  return (
    <div className={`subtask-row${sub.done ? ' done' : ''}`}>
      <button className="sub-check" onClick={onToggle}>
        {sub.done ? '✓' : ''}
      </button>
      <span className="sub-text">{sub.text}</span>
      <button className="sub-del icon ghost" onClick={onDelete}>×</button>
    </div>
  );
}

function TodoItem({ todo, onToggle, onDelete, onAddSubtask, onToggleSub, onDeleteSub, apiKey }) {
  const [expanded,    setExpanded]    = useState(false);
  const [aiLoading,   setAiLoading]   = useState(false);
  const [completing,  setCompleting]  = useState(false);
  const checkRef = useRef(null);

  const color = P_COLORS[todo.priority] || P_COLORS[3];

  async function handleExpand() {
    if (!apiKey) return;
    setAiLoading(true);
    try {
      const subs = await expandTask(todo.text, apiKey);
      subs.forEach(text => onAddSubtask(todo.id, text));
      setExpanded(true);
    } finally {
      setAiLoading(false);
    }
  }

  function handleCheck() {
    if (todo.done) { onToggle(todo.id); return; }
    setCompleting(true);
    setTimeout(() => { onToggle(todo.id); setCompleting(false); }, 520);
  }

  const isOverdue = !todo.done && todo.date < new Date().toISOString().split('T')[0];

  return (
    <div
      className={`todo-item${todo.done ? ' done' : ''}${completing ? ' completing' : ''}${isOverdue ? ' overdue' : ''}`}
      style={{ '--pc': color }}
      data-p={todo.priority}
    >
      <div className="todo-main">
        <button
          ref={checkRef}
          className={`todo-check${todo.done ? ' checked' : ''}${completing ? ' completing' : ''}`}
          onClick={handleCheck}
        >
          {(todo.done || completing) && <span className="check-mark">✓</span>}
        </button>

        <div className="todo-body">
          <span className="todo-text">{todo.text}</span>
          {todo.estimate && (
            <span className="todo-est">~{todo.estimate}m</span>
          )}
          {isOverdue && <span className="todo-overdue-badge">overdue</span>}
        </div>

        <div className="todo-actions">
          {!todo.done && (
            <button
              className={`todo-ai-btn${aiLoading ? ' loading' : ''}`}
              onClick={handleExpand}
              title={apiKey ? 'AI: break into subtasks' : 'Add API key in Profile to use AI'}
              disabled={!apiKey || aiLoading}
            >
              {aiLoading ? '⟳' : '✦'}
            </button>
          )}
          {todo.subtasks?.length > 0 && (
            <button
              className="todo-expand-btn icon ghost"
              onClick={() => setExpanded(e => !e)}
              title="Toggle subtasks"
            >
              {expanded ? '▾' : '▸'}
            </button>
          )}
          <button className="icon danger" onClick={() => onDelete(todo.id)}>×</button>
        </div>
      </div>

      {/* Subtasks */}
      {todo.subtasks?.length > 0 && expanded && (
        <div className="subtask-list">
          {todo.subtasks.map(sub => (
            <SubtaskRow
              key={sub.id}
              sub={sub}
              onToggle={() => onToggleSub(todo.id, sub.id)}
              onDelete={() => onDeleteSub(todo.id, sub.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TodoPanel({ state, addTodo, toggleTodo, deleteTodo, addSubtask, toggleSubtask, deleteSubtask, onClose }) {
  const [input,       setInput]       = useState('');
  const [priority,    setPriority]    = useState(2);
  const [estimate,    setEstimate]    = useState('');
  const [suggesting,  setSuggesting]  = useState(false);
  const [suggestErr,  setSuggestErr]  = useState('');
  const inputRef = useRef(null);

  const today     = new Date().toISOString().split('T')[0];
  const allActive = (state.todos || []).filter(t => !t.done);
  const todayAll  = (state.todos || []).filter(t => t.date === today);
  const todayDone = todayAll.filter(t => t.done);
  const todayActive  = allActive.filter(t => t.date === today);
  const overdueActive = allActive.filter(t => t.date < today);

  // Sort active: P1→P4
  const sortedToday   = [...todayActive].sort((a, b) => a.priority - b.priority);
  const sortedOverdue = [...overdueActive].sort((a, b) => a.priority - b.priority);

  const total    = sortedToday.length + todayDone.length;
  const doneCount = todayDone.length;
  const ringFrac = total > 0 ? doneCount / total : 0;
  const R = 22;
  const circ = 2 * Math.PI * R;

  function handleAdd(e) {
    e?.preventDefault();
    if (!input.trim()) return;
    addTodo({ text: input.trim(), priority, estimate: estimate ? parseInt(estimate) : null });
    setInput('');
    setEstimate('');
    inputRef.current?.focus();
  }

  async function handleSuggest() {
    if (!state.apiKey) { setSuggestErr('Set API key in Profile view first.'); setTimeout(() => setSuggestErr(''), 3000); return; }
    setSuggesting(true);
    setSuggestErr('');
    try {
      const suggestions = await suggestTodos(state.thoughts || [], state.intention, state.apiKey);
      if (!suggestions.length) { setSuggestErr('No suggestions — capture more thoughts first.'); setTimeout(() => setSuggestErr(''), 3500); return; }
      suggestions.forEach(s => addTodo({ text: s.text, priority: s.priority || 2 }));
    } catch {
      setSuggestErr('AI error — check API key.');
      setTimeout(() => setSuggestErr(''), 3000);
    } finally {
      setSuggesting(false);
    }
  }

  return (
    <div className="todo-panel" role="dialog" aria-label="Daily To-Do">
      {/* Header */}
      <div className="todo-header">
        <div className="todo-header-left">
          <div className="todo-ring-wrap">
            <svg width="56" height="56" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
              <circle
                cx="28" cy="28" r={R}
                fill="none"
                stroke={ringFrac === 1 ? '#4ade80' : 'var(--accent)'}
                strokeWidth="3"
                strokeDasharray={circ}
                strokeDashoffset={circ * (1 - ringFrac)}
                strokeLinecap="round"
                transform="rotate(-90 28 28)"
                style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.22,1,0.36,1), stroke 0.4s ease' }}
              />
            </svg>
            <span className="todo-ring-count">{doneCount}/{total}</span>
          </div>
          <div>
            <div className="todo-title">TODAY</div>
            <div className="todo-date">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
          </div>
        </div>
        <button className="icon ghost" onClick={onClose} style={{ fontSize: 18 }}>✕</button>
      </div>

      {/* Quick add */}
      <form className="todo-add-form" onSubmit={handleAdd}>
        <div className="todo-add-row">
          <input
            ref={inputRef}
            className="todo-add-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Add a task…"
            autoFocus
          />
          <button type="submit" className="todo-add-btn" disabled={!input.trim()}>+</button>
        </div>
        <div className="todo-add-meta">
          <div className="priority-picker">
            {[1,2,3,4].map(p => (
              <PriorityDot key={p} p={p} active={priority === p} onClick={() => setPriority(p)} />
            ))}
          </div>
          <input
            className="todo-est-input"
            type="number"
            min="1" max="480"
            value={estimate}
            onChange={e => setEstimate(e.target.value)}
            placeholder="min"
            title="Estimated minutes"
          />
        </div>
      </form>

      {/* AI Suggest */}
      <button
        className={`ai-suggest-btn${suggesting ? ' loading' : ''}`}
        onClick={handleSuggest}
        disabled={suggesting}
      >
        {suggesting
          ? <><span className="ai-spin">⟳</span> Analyzing thoughts…</>
          : <><span>✦</span> AI: Suggest from thoughts</>}
      </button>
      {suggestErr && <p className="todo-err">{suggestErr}</p>}

      {/* Overdue tasks */}
      {sortedOverdue.length > 0 && (
        <div className="todo-section overdue-section">
          <div className="todo-section-label overdue-label">⚠ Overdue ({sortedOverdue.length})</div>
          {sortedOverdue.map(t => (
            <TodoItem
              key={t.id}
              todo={t}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onAddSubtask={addSubtask}
              onToggleSub={toggleSubtask}
              onDeleteSub={deleteSubtask}
              apiKey={state.apiKey}
            />
          ))}
        </div>
      )}

      {/* Today's active */}
      <div className="todo-section">
        {sortedToday.length === 0 && doneCount === 0 ? (
          <div className="todo-empty">
            <span>Nothing yet.</span>
            <span>Add a task or let AI suggest.</span>
          </div>
        ) : sortedToday.map(t => (
          <TodoItem
            key={t.id}
            todo={t}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onAddSubtask={addSubtask}
            onToggleSub={toggleSubtask}
            onDeleteSub={deleteSubtask}
            apiKey={state.apiKey}
          />
        ))}
      </div>

      {/* Done today */}
      {todayDone.length > 0 && (
        <details className="todo-done-section">
          <summary className="todo-section-label done-label">
            ✓ Done ({todayDone.length})
          </summary>
          {todayDone.map(t => (
            <TodoItem
              key={t.id}
              todo={t}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onAddSubtask={addSubtask}
              onToggleSub={toggleSubtask}
              onDeleteSub={deleteSubtask}
              apiKey={state.apiKey}
            />
          ))}
        </details>
      )}
    </div>
  );
}
