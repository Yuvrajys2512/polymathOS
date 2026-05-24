import { useState, useRef } from 'react';
import { expandTask, suggestTodos } from '../utils/todoAI.js';

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
  const [expanded,   setExpanded]   = useState(false);
  const [aiLoading,  setAiLoading]  = useState(false);
  const [completing, setCompleting] = useState(false);

  const color = P_COLORS[todo.priority] || P_COLORS[3];
  const isOverdue = !todo.done && todo.date < new Date().toISOString().split('T')[0];

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

  return (
    <div
      className={`todo-item${todo.done ? ' done' : ''}${completing ? ' completing' : ''}${isOverdue ? ' overdue' : ''}`}
      style={{ '--pc': color }}
      data-p={todo.priority}
    >
      <div className="todo-main">
        <button
          className={`todo-check${todo.done ? ' checked' : ''}${completing ? ' completing' : ''}`}
          onClick={handleCheck}
        >
          {(todo.done || completing) && <span className="check-mark">✓</span>}
        </button>

        <div className="todo-body">
          <span className="todo-text">{todo.text}</span>
          {todo.estimate && <span className="todo-est">~{todo.estimate}m</span>}
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

export default function TodoView({ state, addTodo, toggleTodo, deleteTodo, addSubtask, toggleSubtask, deleteSubtask }) {
  const [input,      setInput]      = useState('');
  const [priority,   setPriority]   = useState(2);
  const [estimate,   setEstimate]   = useState('');
  const [suggesting, setSuggesting] = useState(false);
  const [suggestErr, setSuggestErr] = useState('');
  const inputRef = useRef(null);

  const today        = new Date().toISOString().split('T')[0];
  const allActive    = (state.todos || []).filter(t => !t.done);
  const todayAll     = (state.todos || []).filter(t => t.date === today);
  const todayDone    = todayAll.filter(t => t.done);
  const todayActive  = allActive.filter(t => t.date === today);
  const overdueActive = allActive.filter(t => t.date < today);

  const sortedToday   = [...todayActive].sort((a, b) => a.priority - b.priority);
  const sortedOverdue = [...overdueActive].sort((a, b) => a.priority - b.priority);

  const total    = sortedToday.length + todayDone.length;
  const doneCount = todayDone.length;
  const ringFrac = total > 0 ? doneCount / total : 0;
  const R = 34;
  const circ = 2 * Math.PI * R;

  const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  function handleAdd(e) {
    e?.preventDefault();
    if (!input.trim()) return;
    addTodo({ text: input.trim(), priority, estimate: estimate ? parseInt(estimate) : null });
    setInput('');
    setEstimate('');
    inputRef.current?.focus();
  }

  async function handleSuggest() {
    if (!state.apiKey) {
      setSuggestErr('Set API key in Profile view first.');
      setTimeout(() => setSuggestErr(''), 3000);
      return;
    }
    setSuggesting(true);
    setSuggestErr('');
    try {
      const suggestions = await suggestTodos(state.thoughts || [], state.intention, state.apiKey);
      if (!suggestions.length) {
        setSuggestErr('No suggestions — capture more thoughts first.');
        setTimeout(() => setSuggestErr(''), 3500);
        return;
      }
      suggestions.forEach(s => addTodo({ text: s.text, priority: s.priority || 2 }));
    } catch {
      setSuggestErr('AI error — check API key.');
      setTimeout(() => setSuggestErr(''), 3000);
    } finally {
      setSuggesting(false);
    }
  }

  const commonItemProps = {
    onToggle: toggleTodo,
    onDelete: deleteTodo,
    onAddSubtask: addSubtask,
    onToggleSub: toggleSubtask,
    onDeleteSub: deleteSubtask,
    apiKey: state.apiKey,
  };

  return (
    <div className="todo-view">
      {/* Page header */}
      <div className="todo-view-header">
        <div className="todo-view-title-block">
          <span className="view-title">TODAY</span>
          <span className="todo-view-date">{dateStr}</span>
        </div>

        <div className="todo-view-progress">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
            <circle
              cx="40" cy="40" r={R}
              fill="none"
              stroke={ringFrac === 1 ? '#4ade80' : 'var(--accent)'}
              strokeWidth="4"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - ringFrac)}
              strokeLinecap="round"
              transform="rotate(-90 40 40)"
              style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.22,1,0.36,1), stroke 0.4s ease' }}
            />
          </svg>
          <div className="todo-view-progress-label">
            <span className="todo-view-progress-count">{doneCount}/{total}</span>
            <span className="todo-view-progress-sub">done</span>
          </div>
        </div>
      </div>

      {/* Add form */}
      <form className="todo-view-add-form" onSubmit={handleAdd}>
        <div className="todo-view-add-row">
          <input
            ref={inputRef}
            className="todo-add-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Add a task…"
            autoFocus
          />
          <div className="priority-picker">
            {[1, 2, 3, 4].map(p => (
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
          <button type="submit" className="todo-add-btn" disabled={!input.trim()}>+</button>
        </div>
      </form>

      {/* AI suggest */}
      <div className="todo-view-ai-row">
        <button
          className={`ai-suggest-btn${suggesting ? ' loading' : ''}`}
          onClick={handleSuggest}
          disabled={suggesting}
        >
          {suggesting
            ? <><span className="ai-spin">⟳</span> Analyzing thoughts…</>
            : <><span>✦</span> AI: Suggest from thoughts</>}
        </button>
        {suggestErr && <span className="todo-err">{suggestErr}</span>}
      </div>

      {/* Content */}
      <div className="todo-view-content">
        {/* Overdue */}
        {sortedOverdue.length > 0 && (
          <section className="todo-view-section">
            <div className="todo-view-section-label overdue-label">⚠ Overdue ({sortedOverdue.length})</div>
            {sortedOverdue.map(t => <TodoItem key={t.id} todo={t} {...commonItemProps} />)}
          </section>
        )}

        {/* Today active */}
        <section className="todo-view-section">
          <div className="todo-view-section-label">
            Today
            {sortedToday.length > 0 && <span className="todo-view-section-count">{sortedToday.length} left</span>}
          </div>
          {sortedToday.length === 0 && doneCount === 0 ? (
            <div className="todo-empty">
              <span>Nothing yet.</span>
              <span>Add a task or let AI suggest.</span>
            </div>
          ) : (
            sortedToday.map(t => <TodoItem key={t.id} todo={t} {...commonItemProps} />)
          )}
        </section>

        {/* Done */}
        {todayDone.length > 0 && (
          <details className="todo-view-section todo-done-section" open={doneCount === total && total > 0}>
            <summary className="todo-view-section-label done-label">
              ✓ Done today ({todayDone.length})
            </summary>
            {todayDone.map(t => <TodoItem key={t.id} todo={t} {...commonItemProps} />)}
          </details>
        )}
      </div>
    </div>
  );
}
