import { useState, useRef, useCallback, useMemo } from 'react';
import { DOMAINS, DOMAIN_COLOR } from '../constants/index.js';
import { getProjectAIAssist } from '../utils/projectAI.js';

const TYPE_CYCLE = ['idea', 'progress', 'challenge', 'note'];
const TYPE_META  = {
  idea:      { color: '#00d9b1', glyph: '◈' },
  progress:  { color: '#4ade80', glyph: '▲' },
  challenge: { color: '#f97316', glyph: '⚡' },
  note:      { color: '#818cf8', glyph: '◆' },
};
const STATUS_META = {
  active:    { color: '#4ade80' },
  paused:    { color: '#fbbf24' },
  completed: { color: '#a78bfa' },
};

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en', { month: 'short', day: 'numeric' });
}
function fmtMinutes(m) {
  if (!m) return null;
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`;
}

/* ── Type Cycler ── */
function TypeCycler({ value, onChange }) {
  const meta = TYPE_META[value];
  return (
    <button
      type="button"
      className="proj-type-cycler"
      style={{ '--tc': meta.color }}
      onClick={() => onChange(TYPE_CYCLE[(TYPE_CYCLE.indexOf(value) + 1) % TYPE_CYCLE.length])}
      title="Click to cycle type"
    >
      <span className="proj-type-cycler-glyph">{meta.glyph}</span>
      <span className="proj-type-cycler-label">{value}</span>
    </button>
  );
}

/* ── Countdown Chip ── */
function CountdownChip({ targetDate }) {
  if (!targetDate) return null;
  const days = Math.ceil((new Date(targetDate).setHours(23,59,59,999) - Date.now()) / 86400000);
  if (days > 0) {
    const color = days <= 3 ? '#f97316' : days <= 7 ? '#fbbf24' : '#4ade80';
    return <span className="proj-countdown" style={{ color, borderColor: color }}>{days}d left</span>;
  }
  return <span className="proj-countdown proj-countdown--over">OVERDUE {Math.abs(days)}d</span>;
}

/* ── Stats Strip ── */
function StatsStrip({ project, sessions }) {
  const entries = project.entries || [];
  const byType  = { idea: 0, progress: 0, challenge: 0, note: 0 };
  entries.forEach(e => { if (byType[e.type] !== undefined) byType[e.type]++; });

  const daysActive    = Math.max(0, Math.floor((Date.now() - new Date(project.createdAt).getTime()) / 86400000));
  const lastEntryDate = entries.length > 0 ? new Date(entries[entries.length - 1].createdAt) : new Date(project.createdAt);
  const daysAgo       = Math.floor((Date.now() - lastEntryDate.getTime()) / 86400000);
  const focusMinutes  = (sessions || [])
    .filter(s => s.projectId === project.id)
    .reduce((sum, s) => sum + (s.minutes || 0), 0);

  return (
    <div className="proj-stats-strip">
      <div className="proj-stat-item">
        <span className="proj-stat-val">{daysActive}</span>
        <span className="proj-stat-lbl">days active</span>
      </div>
      <div className="proj-stat-div" />
      <div className="proj-stat-item">
        <span className="proj-stat-val">{entries.length}</span>
        <span className="proj-stat-lbl">entries</span>
      </div>
      <div className="proj-stat-div" />
      <div className="proj-stat-item proj-stat-types">
        <span style={{ color: TYPE_META.idea.color }}>{byType.idea}</span>
        <span className="proj-stat-type-sep">·</span>
        <span style={{ color: TYPE_META.progress.color }}>{byType.progress}</span>
        <span className="proj-stat-type-sep">·</span>
        <span style={{ color: TYPE_META.challenge.color }}>{byType.challenge}</span>
        <span className="proj-stat-type-sep">·</span>
        <span style={{ color: TYPE_META.note.color }}>{byType.note}</span>
        <span className="proj-stat-lbl">i·p·c·n</span>
      </div>
      <div className="proj-stat-div" />
      <div className="proj-stat-item">
        <span className="proj-stat-val">{daysAgo === 0 ? 'today' : `${daysAgo}d ago`}</span>
        <span className="proj-stat-lbl">last entry</span>
      </div>
      {focusMinutes > 0 && (
        <>
          <div className="proj-stat-div" />
          <div className="proj-stat-item">
            <span className="proj-stat-val" style={{ color: 'var(--accent)' }}>{fmtMinutes(focusMinutes)}</span>
            <span className="proj-stat-lbl">focused</span>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Completion Ceremony Modal ── */
function CompletionCeremony({ project, onConfirm, onCancel }) {
  const [reflection, setReflection] = useState('');
  return (
    <div className="proj-ceremony">
      <div className="proj-ceremony-scan" />
      <div className="proj-ceremony-head">
        <span className="proj-ceremony-title">◈ SEAL PROJECT</span>
        <span className="proj-ceremony-xp">+100 XP</span>
      </div>
      <div className="proj-ceremony-name">{project.name}</div>
      <textarea
        className="proj-ceremony-textarea"
        placeholder="One reflection — what did you accomplish? What would you do differently?"
        value={reflection}
        onChange={e => setReflection(e.target.value)}
        autoFocus
        rows={3}
      />
      <div className="proj-ceremony-actions">
        <button className="proj-ceremony-cancel" onClick={onCancel}>Cancel</button>
        <button
          className="proj-ceremony-seal"
          onClick={() => onConfirm(reflection)}
        >
          Seal It →
        </button>
      </div>
    </div>
  );
}

/* ── Project Todo Panel ── */
function ProjectTodoPanel({ project, onAdd, onToggle, onDelete }) {
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  const todos  = project.projectTodos || [];
  const open   = todos.filter(t => !t.done);
  const done   = todos.filter(t => t.done);
  const total  = todos.length;
  const doneN  = done.length;
  const pct    = total > 0 ? Math.round((doneN / total) * 100) : 0;

  function handleAdd(e) {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(project.id, text.trim());
    setText('');
    inputRef.current?.focus();
  }

  return (
    <div className="proj-todo-panel">

      {/* Progress header */}
      <div className="proj-todo-head">
        <div className="proj-todo-progress-wrap">
          <div className="proj-todo-progress-bar">
            <div
              className="proj-todo-progress-fill"
              style={{ width: `${pct}%`, background: pct === 100 ? '#4ade80' : 'var(--dc)' }}
            />
          </div>
          <span className="proj-todo-progress-label">
            {doneN}/{total} done
            {pct === 100 && total > 0 && <span className="proj-todo-all-done"> ✓ ALL DONE</span>}
          </span>
        </div>
      </div>

      {/* Open items */}
      <div className="proj-todo-list">
        {open.length === 0 && done.length === 0 && (
          <div className="proj-todo-empty">No tasks yet — add one below.</div>
        )}
        {open.map((t, i) => (
          <div key={t.id} className="proj-todo-item" style={{ animationDelay: `${i * 0.03}s` }}>
            <button
              className="proj-todo-check"
              onClick={() => onToggle(project.id, t.id)}
              title="Mark done"
            />
            <span className="proj-todo-text">{t.text}</span>
            <button className="proj-todo-del" onClick={() => onDelete(project.id, t.id)}>✕</button>
          </div>
        ))}

        {/* Done items (collapsed under a divider) */}
        {done.length > 0 && (
          <>
            <div className="proj-todo-divider">
              <span>{done.length} completed</span>
            </div>
            {done.map(t => (
              <div key={t.id} className="proj-todo-item proj-todo-item--done">
                <button
                  className="proj-todo-check proj-todo-check--done"
                  onClick={() => onToggle(project.id, t.id)}
                  title="Mark undone"
                >✓</button>
                <span className="proj-todo-text">{t.text}</span>
                <button className="proj-todo-del" onClick={() => onDelete(project.id, t.id)}>✕</button>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Add input */}
      <form className="proj-todo-form" onSubmit={handleAdd}>
        <input
          ref={inputRef}
          className="proj-todo-input"
          placeholder="Add a task for this project…"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button type="submit" className="proj-todo-add">Add</button>
      </form>

    </div>
  );
}

/* ── Main View ── */
export default function ProjectsView({ game }) {
  const [selectedId,      setSelectedId]      = useState(null);
  const [activeTab,       setActiveTab]        = useState('log');
  const [creating,        setCreating]         = useState(false);
  const [newName,         setNewName]          = useState('');
  const [newGoal,         setNewGoal]          = useState('');
  const [newDomain,       setNewDomain]        = useState('Life');
  const [entryText,       setEntryText]        = useState('');
  const [entryType,       setEntryType]        = useState('idea');
  const [aiLoading,       setAiLoading]        = useState(false);
  const [aiResponse,      setAiResponse]       = useState(null);
  const [ceremonyPending, setCeremonyPending]  = useState(false);
  const entryRef   = useRef(null);
  const notesTimer = useRef(null);

  const projects   = game.state.projects || [];
  const selected   = projects.find(p => p.id === selectedId);
  const domainList = game.state.domainList || DOMAINS;

  const sortedEntries = useMemo(() => {
    if (!selected) return [];
    return [...(selected.entries || [])].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [selected?.entries]);

  function handleCreate(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    game.addProject(newName.trim(), newGoal.trim(), newDomain);
    setNewName(''); setNewGoal(''); setNewDomain('Life');
    setCreating(false);
  }

  function handleAddEntry(e) {
    e.preventDefault();
    if (!entryText.trim() || !selectedId) return;
    game.addProjectEntry(selectedId, entryType, entryText.trim());
    setEntryText('');
    entryRef.current?.focus();
  }

  const handleNotesChange = useCallback((val) => {
    clearTimeout(notesTimer.current);
    notesTimer.current = setTimeout(() => {
      game.updateProject(selectedId, { notes: val });
    }, 400);
  }, [selectedId, game]);

  async function handleAIAssist() {
    if (!selected) return;
    setAiLoading(true);
    setAiResponse(null);
    const result = await getProjectAIAssist(selected, game.state.apiKey);
    setAiResponse(result);
    setAiLoading(false);
  }

  function selectProject(id) {
    if (selectedId === id) { setSelectedId(null); return; }
    setSelectedId(id);
    setActiveTab('log');
    setAiResponse(null);
    setEntryText('');
    setCeremonyPending(false);
  }

  function handleStatusChange(newStatus) {
    if (!selected) return;
    if (newStatus === 'completed' && selected.status !== 'completed') {
      setCeremonyPending(true);
    } else {
      game.updateProject(selected.id, { status: newStatus });
    }
  }

  function handleSeal(reflection) {
    game.completeProject(selected.id, reflection);
    setCeremonyPending(false);
  }

  const dc = selected ? (DOMAIN_COLOR[selected.domain] || 'var(--accent)') : 'var(--accent)';

  return (
    <div className="projects-view">

      {/* Header */}
      <div className="view-header">
        <span className="view-title">PROJECTS</span>
        <span className="view-hint">Active work spaces</span>
        <button
          className={`proj-new-btn${creating ? ' proj-new-btn--cancel' : ''}`}
          onClick={() => setCreating(p => !p)}
        >
          {creating ? '✕ Cancel' : '+ New'}
        </button>
      </div>

      {/* Create form */}
      {creating && (
        <form className="proj-create-form" onSubmit={handleCreate}>
          <div className="proj-create-scan" />
          <div className="proj-create-fields">
            <input autoFocus className="proj-create-input" placeholder="Project name…" value={newName} onChange={e => setNewName(e.target.value)} />
            <input className="proj-create-input proj-create-goal-input" placeholder="One-line goal (optional)" value={newGoal} onChange={e => setNewGoal(e.target.value)} />
            <select className="proj-create-domain" value={newDomain} onChange={e => setNewDomain(e.target.value)}>
              {domainList.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <button type="submit" className="proj-create-submit">Initialize</button>
          </div>
        </form>
      )}

      {/* Cards grid */}
      {projects.length === 0 ? (
        <div className="proj-empty">
          <span className="proj-empty-glyph">▣</span>
          <span>No projects initialized.</span>
          <span className="proj-empty-sub">Create one to build a dedicated work space.</span>
        </div>
      ) : (
        <div className="proj-grid">
          {projects.map((p, idx) => {
            const pdc     = DOMAIN_COLOR[p.domain] || 'var(--accent)';
            const sMeta   = STATUS_META[p.status || 'active'] || STATUS_META.active;
            const entries = (p.entries || []).length;
            const isOpen  = selectedId === p.id;
            const isSealed = p.status === 'completed';
            return (
              <div
                key={p.id}
                className={`proj-card${isOpen ? ' proj-card--open' : ''}${isSealed ? ' proj-card--sealed' : ''}`}
                style={{ '--dc': pdc, '--delay': `${idx * 0.05}s` }}
                onClick={() => selectProject(p.id)}
              >
                <div className="proj-card-glow" />
                <div className="proj-card-top">
                  <span className="proj-card-icon">▣</span>
                  <span className="proj-card-name">{p.name}</span>
                  {isSealed && <span className="proj-card-sealed-badge">✓</span>}
                </div>
                {p.goal && <div className="proj-card-goal">{p.goal}</div>}
                <div className="proj-card-bar-wrap">
                  <div className="proj-card-bar">
                    <div className="proj-card-bar-fill" style={{ width: `${p.progress || 0}%` }} />
                  </div>
                  <span className="proj-card-pct">{p.progress || 0}%</span>
                </div>
                <div className="proj-card-foot">
                  <span className="proj-card-status-dot" style={{ background: sMeta.color }} />
                  <span className="proj-card-status-label" style={{ color: sMeta.color }}>{p.status || 'active'}</span>
                  {p.targetDate && <CountdownChip targetDate={p.targetDate} />}
                  <span className="proj-card-count">{entries} {entries === 1 ? 'entry' : 'entries'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Workspace */}
      {selected && (
        <div className="proj-ws" style={{ '--dc': dc }}>
          <div className="proj-ws-scan" />

          {/* Header */}
          <div className="proj-ws-head">
            <div className="proj-ws-head-left">
              <span className="proj-ws-chevron">▣</span>
              <span className="proj-ws-title">{selected.name}</span>
              <span className="proj-ws-domain">{selected.domain}</span>
              <select
                className="proj-ws-status"
                value={selected.status || 'active'}
                onChange={e => handleStatusChange(e.target.value)}
              >
                <option value="active">active</option>
                <option value="paused">paused</option>
                <option value="completed">completed</option>
              </select>
            </div>
            <div className="proj-ws-head-right">
              <div className="proj-ws-tabs">
                <button className={`proj-ws-tab${activeTab === 'log'   ? ' proj-ws-tab--on' : ''}`} onClick={() => setActiveTab('log')}>LOG</button>
                <button className={`proj-ws-tab${activeTab === 'notes' ? ' proj-ws-tab--on' : ''}`} onClick={() => setActiveTab('notes')}>NOTES</button>
                <button className={`proj-ws-tab proj-ws-tab--todo${activeTab === 'todo' ? ' proj-ws-tab--on' : ''}`} onClick={() => setActiveTab('todo')}>
                  TODO
                  {(selected.projectTodos || []).filter(t => !t.done).length > 0 && (
                    <span className="proj-todo-tab-badge">{(selected.projectTodos || []).filter(t => !t.done).length}</span>
                  )}
                </button>
              </div>
              <button className={`proj-ai-btn${aiLoading ? ' proj-ai-btn--spin' : ''}`} onClick={handleAIAssist} disabled={aiLoading}>
                {aiLoading ? '⟳' : '◈'} {aiLoading ? 'Analyzing…' : 'AI'}
              </button>
              <button className="proj-ws-del" onClick={() => { game.deleteProject(selected.id); setSelectedId(null); }}>✕</button>
            </div>
          </div>

          {/* Stats strip */}
          <StatsStrip project={selected} sessions={game.state.sessions} />

          {/* Meta: goal + target date + progress */}
          <div className="proj-ws-meta">
            {selected.goal && <span className="proj-ws-goal">{selected.goal}</span>}
            <div className="proj-ws-meta-row">
              <div className="proj-ws-date-wrap">
                <span className="proj-ws-date-label">Target</span>
                <input
                  type="date"
                  className="proj-ws-date-input"
                  value={selected.targetDate || ''}
                  onChange={e => game.updateProject(selected.id, { targetDate: e.target.value || null })}
                />
                <CountdownChip targetDate={selected.targetDate} />
              </div>
              <div className="proj-ws-prog-row">
                <span className="proj-ws-pct">{selected.progress || 0}%</span>
                <input
                  type="range" min="0" max="100"
                  value={selected.progress || 0}
                  onChange={e => game.updateProject(selected.id, { progress: +e.target.value })}
                  className="proj-ws-slider"
                />
              </div>
            </div>
          </div>

          {/* Completion Ceremony */}
          {ceremonyPending && (
            <CompletionCeremony
              project={selected}
              onConfirm={handleSeal}
              onCancel={() => setCeremonyPending(false)}
            />
          )}

          {/* AI response */}
          {aiResponse && (
            <div className={`proj-ai-out${aiResponse.error ? ' proj-ai-out--err' : ''}`}>
              <div className="proj-ai-out-head">
                <span>◈ AI ANALYSIS</span>
                <button onClick={() => setAiResponse(null)}>✕</button>
              </div>
              <pre className="proj-ai-out-body">{aiResponse.error || aiResponse.text}</pre>
            </div>
          )}

          {/* LOG tab */}
          {activeTab === 'log' && !ceremonyPending && (
            <>
              <div className="proj-entries">
                {sortedEntries.length === 0 ? (
                  <div className="proj-entries-empty">Nothing logged yet — drop your first entry below.</div>
                ) : (
                  sortedEntries.map((entry, i) => {
                    const tm = TYPE_META[entry.type] || TYPE_META.note;
                    return (
                      <div
                        key={entry.id}
                        className={`proj-entry${entry.pinned ? ' proj-entry--pinned' : ''}${entry.resolved ? ' proj-entry--resolved' : ''}`}
                        style={{ '--tc': tm.color, animationDelay: `${i * 0.035}s` }}
                      >
                        <span className="proj-entry-glyph">{entry.pinned ? '◆' : tm.glyph}</span>
                        <span className="proj-entry-type" style={{ color: tm.color }}>{entry.type}</span>
                        <span className="proj-entry-text">{entry.text}</span>
                        <span className="proj-entry-date">{fmtDate(entry.createdAt)}</span>
                        <div className="proj-entry-actions">
                          <button
                            className={`proj-entry-pin${entry.pinned ? ' active' : ''}`}
                            onClick={() => game.togglePinEntry(selected.id, entry.id)}
                            title={entry.pinned ? 'Unpin' : 'Pin to top'}
                          >◆</button>
                          {entry.type === 'challenge' && (
                            <button
                              className={`proj-entry-resolve${entry.resolved ? ' active' : ''}`}
                              onClick={() => game.toggleResolveEntry(selected.id, entry.id)}
                              title={entry.resolved ? 'Unresolve' : 'Mark resolved'}
                            >✓</button>
                          )}
                          <button className="proj-entry-del" onClick={() => game.deleteProjectEntry(selected.id, entry.id)}>✕</button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form className="proj-entry-form" onSubmit={handleAddEntry}>
                <div className="proj-entry-input-wrap">
                  <input
                    ref={entryRef}
                    className="proj-entry-input"
                    placeholder="Log an idea, progress update, or challenge…"
                    value={entryText}
                    onChange={e => setEntryText(e.target.value)}
                  />
                  <TypeCycler value={entryType} onChange={setEntryType} />
                </div>
                <button type="submit" className="proj-entry-submit">Log</button>
              </form>
            </>
          )}

          {/* NOTES tab */}
          {activeTab === 'notes' && (
            <div className="proj-notes-wrap">
              <textarea
                className="proj-notes-area"
                placeholder={`Write anything about "${selected.name}"…\n\nThis is your space to think, plan, and draft freely.`}
                defaultValue={selected.notes || ''}
                onChange={e => handleNotesChange(e.target.value)}
              />
              <div className="proj-notes-hint">Auto-saved · {(selected.notes || '').length} chars</div>
            </div>
          )}

          {/* TODO tab */}
          {activeTab === 'todo' && (
            <ProjectTodoPanel
              project={selected}
              onAdd={game.addProjectTodo}
              onToggle={game.toggleProjectTodo}
              onDelete={game.deleteProjectTodo}
            />
          )}

        </div>
      )}

    </div>
  );
}
