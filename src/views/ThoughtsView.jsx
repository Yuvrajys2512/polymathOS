import { useState, useEffect, useRef } from 'react';
import { TYPE_OPTS, PRIORITY_OPTS } from '../constants/index.js';
import ThoughtCard from '../components/Thoughts/ThoughtCard.jsx';
import ThoughtGraph from '../components/Thoughts/ThoughtGraph.jsx';

export default function ThoughtsView({
  visible, done,
  domainList,
  search, setSearch,
  domF, setDomF,
  typeF, setTypeF,
  priF, setPriF,
  showDone, setShowDone,
  updateThought, deleteThought,
  onStartFocus,
  onOpenTriage,
  groqKey,
}) {
  const [filterVersion, setFilterVersion] = useState(0);
  const [exiting,       setExiting]       = useState([]);
  const [viewMode,      setViewMode]      = useState('list'); // 'list' | 'graph'
  const prevVisibleRef = useRef(visible);
  const exitTimerRef   = useRef(null);

  useEffect(() => {
    const prev = prevVisibleRef.current;
    prevVisibleRef.current = visible;
    const leaving = prev.filter(t => !visible.some(x => x.id === t.id));
    if (!leaving.length) return;
    clearTimeout(exitTimerRef.current);
    setExiting(leaving);
    exitTimerRef.current = setTimeout(() => setExiting([]), 400);
    return () => clearTimeout(exitTimerRef.current);
  }, [visible]);

  function handleDomF(v)  { setDomF(v);  setFilterVersion(fv => fv + 1); }
  function handleTypeF(v) { setTypeF(v); setFilterVersion(fv => fv + 1); }
  function handlePriF(v)  { setPriF(v);  setFilterVersion(fv => fv + 1); }

  const activeThoughtsForTriage = visible.filter(t => !t.done);

  return (
    <div className="thoughts-view">
      <div className="view-header thoughts-view-header">
        <div className="tvh-left">
          <span className="view-title">THOUGHTS</span>
          <span className="thoughts-count view-hint">
            {visible.length} thought{visible.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* View mode toggle */}
        <div className="tv-toggle">
          <button
            className={`tvt-btn${viewMode === 'list' ? ' active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List view"
          >
            ≡ LIST
          </button>
          <button
            className={`tvt-btn${viewMode === 'graph' ? ' active' : ''}`}
            onClick={() => setViewMode('graph')}
            title="3D knowledge graph"
          >
            ◈ GRAPH
          </button>
        </div>
      </div>

      <div className="thoughts-filters">
        <div className="search-row">
          <input
            className="thoughts-search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search thoughts, tags, insights…"
          />
          {activeThoughtsForTriage.length >= 3 && (
            <button
              className="triage-trigger"
              onClick={() => onOpenTriage && onOpenTriage(activeThoughtsForTriage)}
              title="Hyper-Triage: clear your backlog fast"
            >
              ⚡ Triage
            </button>
          )}
        </div>

        <div className="filter-row">
          <div className="filters">
            <span
              className={`chip${domF === 'All' ? ' active' : ''}`}
              onClick={() => handleDomF('All')}
            >All</span>
            {(domainList || []).map(d => (
              <span
                key={d}
                className={`chip${domF === d ? ' active' : ''}`}
                onClick={() => handleDomF(d)}
              >{d}</span>
            ))}
          </div>
          <div className="filter-selects">
            <select value={typeF} onChange={e => handleTypeF(e.target.value)}>
              {TYPE_OPTS.map(t => <option key={t}>{t}</option>)}
            </select>
            <select value={priF} onChange={e => handlePriF(e.target.value)}>
              {PRIORITY_OPTS.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ── GRAPH VIEW ── */}
      {viewMode === 'graph' && (
        <ThoughtGraph
          thoughts={visible}
          updateThought={updateThought}
          deleteThought={deleteThought}
          groqKey={groqKey}
        />
      )}

      {/* ── LIST VIEW ── */}
      {viewMode === 'list' && (
        <>
          <div className="stream">
            {exiting.map(t => (
              <ThoughtCard
                key={t.id + '-exit'}
                thought={t}
                updateThought={updateThought}
                deleteThought={deleteThought}
                isExiting
              />
            ))}

            {visible.length === 0 ? (
              <div className="empty">
                Nothing matches this view.<br />
                Capture something raw or loosen the filters.
              </div>
            ) : visible.map((t, i) => (
              <ThoughtCard
                key={t.id + '-' + filterVersion}
                thought={t}
                index={i}
                updateThought={updateThought}
                deleteThought={deleteThought}
              />
            ))}
          </div>

          <div className="archive">
            <button
              className="ghost"
              style={{ fontSize: 12, color: 'var(--muted)', width: '100%', textAlign: 'left' }}
              onClick={() => setShowDone(!showDone)}
            >
              {showDone ? '▾' : '▸'} Archived ({done.length})
            </button>
            {showDone && (
              <div className="stream" style={{ marginTop: 8 }}>
                {done.map(t => (
                  <ThoughtCard key={t.id} thought={t}
                    updateThought={updateThought}
                    deleteThought={deleteThought} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
