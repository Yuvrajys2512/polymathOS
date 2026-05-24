import { useState, useMemo, useEffect, useRef } from 'react';
import { DOMAIN_COLOR, TYPE_ICON } from '../../constants/index.js';

// ── Forge modes ──────────────────────────────────────────────────
const FORGE_MODES = [
  { id: 'connect',  icon: '◈', label: 'Connect',  desc: 'Find the hidden connection',      color: '#fbbf24' },
  { id: 'action',   icon: '⚡', label: 'Action',   desc: 'Turn ideas into next steps',       color: '#00d9b1' },
  { id: 'tension',  icon: '◆', label: 'Tension',  desc: 'Surface contradictions',           color: '#f87171' },
  { id: 'expand',   icon: '✦', label: 'Expand',   desc: 'Map unexplored territory',         color: '#a78bfa' },
];

const MODE_PROMPTS = {
  connect:  `Find the unexpected connection, pattern, or emergent idea linking these thoughts. Make it feel like an "aha" moment — something invisible individually that becomes clear combined.`,
  action:   `These thoughts together suggest a direction. What 3 specific, high-leverage actions should the user take? Focus entirely on WHAT TO DO, not what to think. Make actions concrete and immediately actionable.`,
  tension:  `Find the hidden tensions, contradictions, or unexamined assumptions across these thoughts. What would a rigorous critic say? Return 2-3 precise tensions that reveal where the ideas conflict or assume too much.`,
  expand:   `These thoughts together point toward unexplored territory. What 3 new questions, research directions, or creative possibilities emerge from their combination? Focus on frontiers and unknowns.`,
};

const MODE_ITEMS_LABEL = {
  connect: null,
  action:  'Next Actions',
  tension: 'Tensions',
  expand:  'New Directions',
};

// ── API call ─────────────────────────────────────────────────────
async function synthesizeWithClaude(thoughts, apiKey, mode) {
  const excerpts = thoughts.map((t, i) =>
    `[${i + 1}] Domain: ${t.domain} | Type: ${t.type}\n"${t.text}"\nInsight: ${t.insight || 'none'}`
  ).join('\n\n');

  const hasItems = mode !== 'connect';
  const itemKey  = mode === 'action' ? 'actions' : mode === 'tension' ? 'tensions' : 'directions';
  const itemsJson = hasItems ? `,\n  "${itemKey}": ["item1", "item2", "item3"]` : '';

  const prompt = `You are a synthesis engine for POLYMATH OS — an ADHD-focused second brain.

The user has selected ${thoughts.length} thoughts to forge in ${mode.toUpperCase()} mode:

${excerpts}

${MODE_PROMPTS[mode]}

Return ONLY valid JSON:
{
  "synthesis": "One sharp sentence (max 180 chars) naming the ${mode === 'connect' ? 'connection' : mode === 'action' ? 'core opportunity' : mode === 'tension' ? 'central contradiction' : 'emerging frontier'}",
  "insight": "2-3 sentences explaining the deeper meaning and why it matters"${itemsJson},
  "domain": "The domain this synthesis belongs to most",
  "tags": ["tag1", "tag2", "tag3"]
}

No markdown, no explanation. Just JSON.`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 500, messages: [{ role: 'user', content: prompt }] }),
  });
  if (!res.ok) throw new Error('API error');
  const data = await res.json();
  const text = data.content?.[0]?.text || '';
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON');
  return JSON.parse(match[0]);
}

function localSynthesize(thoughts, mode) {
  const domains = [...new Set(thoughts.map(t => t.domain))];
  const modeData = {
    connect:  { synthesis: `Cross-domain connection: ${domains.join(' × ')}`, items: null },
    action:   { synthesis: `Action nexus: ${domains.join(' + ')}`, items: ['Review these thoughts together', 'Identify the shared constraint', 'Pick one domain to start'] },
    tension:  { synthesis: `Tension point: ${domains.join(' vs ')}`, items: ['These domains may have conflicting assumptions', 'The time horizons might differ', 'Check the base-rate assumptions'] },
    expand:   { synthesis: `Frontier: ${domains.join(' × ')} unexplored overlap`, items: ['What happens at the intersection?', 'What would a researcher in each domain think of this?', 'What has never been tried here?'] },
  };
  const d = modeData[mode] || modeData.connect;
  return {
    synthesis: d.synthesis,
    insight: `These thoughts from ${domains.join(', ')} share an underlying pattern worth exploring. Review them together and look for the common constraint or mechanism that cuts across all ${thoughts.length} ideas.`,
    domain: domains[0] || 'Life',
    tags: ['synthesis', 'cross-domain', mode],
    [mode === 'action' ? 'actions' : mode === 'tension' ? 'tensions' : mode === 'expand' ? 'directions' : '_']: d.items,
  };
}

// ── Terminal loading animation ───────────────────────────────────
function ForgeTerminal({ thoughts, modeName }) {
  const [count, setCount] = useState(0);
  const domains = [...new Set(thoughts.map(t => t.domain))];
  const modeObj = FORGE_MODES.find(m => m.id === modeName) || FORGE_MODES[0];

  const lines = useMemo(() => [
    { prefix: 'SYS', text: 'FORGE SEQUENCE INITIATED',              delay: 0    },
    { prefix: '›',   text: `LOADING ${thoughts.length} THOUGHT VECTORS`, delay: 240  },
    { prefix: '›',   text: `DOMAIN BRIDGE: ${domains.join(' × ')}`, delay: 560  },
    { prefix: '›',   text: `MODE: ${modeName.toUpperCase()}`,        delay: 820  },
    { prefix: '›',   text: 'SCANNING PATTERN SPACE…',               delay: 1100 },
    { prefix: 'AI',  text: 'CROSS-DOMAIN RESONANCE DETECTED',        delay: 1700 },
    { prefix: '›',   text: 'CRYSTALLIZING SYNTHESIS…',               delay: 2100 },
  ], []);

  useEffect(() => {
    const timers = lines.map((_, i) => setTimeout(() => setCount(i + 1), lines[i].delay));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="forge-terminal">
      <div className="forge-terminal-hdr">
        <span className="ft-dot" /><span className="ft-dot" /><span className="ft-dot" style={{ background: modeObj.color }} />
        <span className="ft-title">SYNTHESIS ENGINE · {modeName.toUpperCase()}</span>
      </div>
      <div className="forge-terminal-body">
        {lines.slice(0, count).map((line, i) => (
          <div key={i} className={`ft-line ft-line-in`} style={{ animationDelay: '0ms' }}>
            <span className={`ft-prefix ft-prefix-${line.prefix === 'SYS' ? 'sys' : line.prefix === 'AI' ? 'ai' : 'cmd'}`}>
              {line.prefix}
            </span>
            <span className="ft-text">{line.text}</span>
          </div>
        ))}
        <div className="ft-cursor">_</div>
      </div>
    </div>
  );
}

// ── History item pill ────────────────────────────────────────────
function HistoryItem({ item, onClick }) {
  const modeObj = FORGE_MODES.find(m => m.id === item.mode) || FORGE_MODES[0];
  return (
    <div className="forge-history-item" onClick={onClick} title={item.result.synthesis}>
      <span className="fhi-icon" style={{ color: modeObj.color }}>{modeObj.icon}</span>
      <span className="fhi-text">{item.result.synthesis.slice(0, 42)}{item.result.synthesis.length > 42 ? '…' : ''}</span>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────
export default function Forge({ thoughts, apiKey, onClose, onSaveForge }) {
  const [selected,   setSelected]   = useState([]);
  const [result,     setResult]     = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [search,     setSearch]     = useState('');
  const [domainFilt, setDomainFilt] = useState(null);
  const [mode,       setMode]       = useState('connect');
  const [history,    setHistory]    = useState([]);

  const allDomains = useMemo(() =>
    [...new Set(thoughts.filter(t => !t.done && t.domain !== 'Sorting').map(t => t.domain))].sort(),
    [thoughts]
  );

  const recent = useMemo(() => {
    const q = search.toLowerCase();
    return thoughts
      .filter(t => !t.done && t.domain !== 'Sorting')
      .filter(t => !domainFilt || t.domain === domainFilt)
      .filter(t => !q || t.text.toLowerCase().includes(q) || t.domain.toLowerCase().includes(q))
      .slice(0, 40);
  }, [thoughts, search, domainFilt]);

  const selectedItems = thoughts.filter(t => selected.includes(t.id));
  const uniqueDomains = [...new Set(selectedItems.map(t => t.domain))];
  const modeObj       = FORGE_MODES.find(m => m.id === mode);

  function toggleSelect(id) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 5 ? [...prev, id] : prev
    );
  }

  async function handleForge() {
    if (selectedItems.length < 2) return;
    setLoading(true);
    setResult(null);
    try {
      const [r] = await Promise.all([
        apiKey
          ? synthesizeWithClaude(selectedItems, apiKey, mode).catch(() => localSynthesize(selectedItems, mode))
          : localSynthesize(selectedItems, mode),
        new Promise(res => setTimeout(res, 2600)), // min terminal animation time
      ]);
      setResult({ ...r, mode });
      setHistory(prev => [{ mode, result: { ...r, mode } }, ...prev].slice(0, 5));
    } finally {
      setLoading(false);
    }
  }

  function handleSave() {
    if (!result) return;
    onSaveForge({
      text: result.synthesis,
      insight: result.insight,
      domain: result.domain,
      tags: result.tags || [],
      type: 'insight',
      priority: 'high',
    });
    onClose();
  }

  function forgeAgain() {
    setResult(null);
    setSelected([]);
  }

  const itemsKey    = mode === 'action' ? 'actions' : mode === 'tension' ? 'tensions' : 'directions';
  const resultItems = result?.[itemsKey];

  return (
    <div className="forge-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="forge-modal">
        {/* Header */}
        <div className="forge-header">
          <div>
            <h2 className="forge-title">◈ The Forge</h2>
            <p className="forge-sub">Select 2–5 thoughts. Choose a mode. Reveal what's hidden.</p>
          </div>
          <button className="icon ghost" onClick={onClose} style={{ fontSize: 18 }}>✕</button>
        </div>

        {/* Mode selector */}
        <div className="forge-modes">
          {FORGE_MODES.map(m => (
            <button
              key={m.id}
              className={`forge-mode-btn${mode === m.id ? ' active' : ''}`}
              style={{ '--mc': m.color }}
              onClick={() => setMode(m.id)}
              title={m.desc}
            >
              <span className="fmb-icon">{m.icon}</span>
              <span className="fmb-label">{m.label}</span>
            </button>
          ))}
        </div>

        <div className="forge-body">
          {/* Left: thought picker */}
          <div className="forge-left">
            {/* Domain filter chips */}
            <div className="forge-domain-filters">
              <button
                className={`forge-domain-chip${!domainFilt ? ' active' : ''}`}
                onClick={() => setDomainFilt(null)}
              >All</button>
              {allDomains.map(d => (
                <button
                  key={d}
                  className={`forge-domain-chip${domainFilt === d ? ' active' : ''}`}
                  style={{ '--dc': DOMAIN_COLOR[d] || 'var(--accent)' }}
                  onClick={() => setDomainFilt(domainFilt === d ? null : d)}
                >{d}</button>
              ))}
            </div>

            <div className="forge-search-row">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search thoughts…"
              />
              <span className="forge-sel-count">{selected.length}/5</span>
            </div>

            <div className="forge-thought-list">
              {recent.map(t => {
                const color = DOMAIN_COLOR[t.domain] || 'var(--accent)';
                const isSel = selected.includes(t.id);
                return (
                  <div
                    key={t.id}
                    className={`forge-thought-item${isSel ? ' selected' : ''}`}
                    style={{ '--ft-color': color }}
                    onClick={() => toggleSelect(t.id)}
                  >
                    <div className="forge-thought-check">{isSel ? '◆' : '○'}</div>
                    <div className="forge-thought-content">
                      <div className="forge-thought-text">{t.text}</div>
                      <div className="forge-thought-meta">
                        <span style={{ color }}>{t.domain}</span>
                        <span>{TYPE_ICON[t.type] || '·'} {t.type}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {recent.length === 0 && (
                <div className="empty" style={{ padding: 20 }}>No thoughts match.</div>
              )}
            </div>
          </div>

          {/* Right: forge output */}
          <div className="forge-right">
            {/* Loading: terminal */}
            {loading && <ForgeTerminal thoughts={selectedItems} modeName={mode} />}

            {/* Result: artifact card */}
            {!loading && result && (
              <div className="forge-artifact" style={{ '--mc': modeObj?.color || '#fbbf24' }}>
                <div className="forge-artifact-header">
                  <span className="forge-artifact-mode-icon">{modeObj?.icon}</span>
                  <span className="forge-artifact-label">{modeObj?.label} Synthesis</span>
                  <span className="forge-artifact-domain" style={{ color: DOMAIN_COLOR[result.domain] || 'var(--accent)' }}>
                    {result.domain}
                  </span>
                </div>
                <div className="forge-artifact-synthesis">{result.synthesis}</div>
                <div className="forge-artifact-insight">{result.insight}</div>

                {resultItems?.length > 0 && (
                  <div className="forge-artifact-items">
                    <div className="forge-artifact-items-label">{MODE_ITEMS_LABEL[mode]}</div>
                    {resultItems.map((item, i) => (
                      <div key={i} className="forge-artifact-item">
                        <span className="forge-artifact-item-num">{String(i + 1).padStart(2, '0')}</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                {result.tags?.length > 0 && (
                  <div className="forge-artifact-tags">
                    {result.tags.map(tag => <span key={tag} className="pill">#{tag}</span>)}
                  </div>
                )}

                <div className="forge-artifact-actions">
                  <button className="primary" style={{ flex: 1 }} onClick={handleSave}>
                    ✦ Save as Insight
                  </button>
                  <button className="ghost" onClick={forgeAgain}>
                    ◈ Again
                  </button>
                </div>
              </div>
            )}

            {/* Idle: selected state or empty hint */}
            {!loading && !result && (
              <>
                {selectedItems.length >= 2 ? (
                  <div className="forge-ready">
                    {/* Selected chips */}
                    <div className="forge-chips">
                      {selectedItems.map(t => {
                        const color = DOMAIN_COLOR[t.domain] || 'var(--accent)';
                        return (
                          <div key={t.id} className="forge-chip" style={{ '--fc': color }}>
                            <span className="forge-chip-dom">{t.domain}</span>
                            <span className="forge-chip-text">{t.text.slice(0, 42)}{t.text.length > 42 ? '…' : ''}</span>
                            <button className="forge-chip-remove" onClick={() => toggleSelect(t.id)}>✕</button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Domain diversity indicator */}
                    <div className="forge-diversity">
                      <div className="forge-diversity-dots">
                        {uniqueDomains.map(d => (
                          <span key={d} className="fd-dot" style={{ background: DOMAIN_COLOR[d] || '#888', boxShadow: `0 0 6px ${DOMAIN_COLOR[d] || '#888'}` }} title={d} />
                        ))}
                      </div>
                      <span className="forge-diversity-text">
                        {uniqueDomains.length} unique domain{uniqueDomains.length > 1 ? 's' : ''}
                        {uniqueDomains.length >= 2 ? ' ✓' : ' — add another domain for better synthesis'}
                      </span>
                    </div>

                    <button
                      className="forge-fire-btn"
                      style={{ '--mc': modeObj?.color || '#fbbf24' }}
                      onClick={handleForge}
                    >
                      <span className="ffb-icon">{modeObj?.icon}</span>
                      <span>Forge {selectedItems.length} thoughts — {modeObj?.label}</span>
                    </button>
                  </div>
                ) : (
                  <div className="forge-hint">
                    <div className="forge-hint-icon" style={{ color: modeObj?.color }}>◈</div>
                    <div className="forge-hint-mode">{modeObj?.icon} {modeObj?.label} mode</div>
                    <div className="forge-hint-text">{modeObj?.desc}.</div>
                    <div className="forge-hint-sub">Select 2+ thoughts from the left to begin.</div>
                  </div>
                )}

                {/* History */}
                {history.length > 0 && (
                  <div className="forge-history">
                    <div className="forge-history-label">RECENT FORGES</div>
                    {history.map((h, i) => (
                      <HistoryItem key={i} item={h} onClick={() => setResult(h.result)} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
