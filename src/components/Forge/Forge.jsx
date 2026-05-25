import { useState, useMemo, useEffect } from 'react';
import { DOMAIN_COLOR, TYPE_ICON } from '../../constants/index.js';

const FORGE_MODES = [
  { id: 'connect',  icon: '◈', label: 'Connect',  desc: 'Find the hidden connection',  color: '#fbbf24' },
  { id: 'action',   icon: '⚡', label: 'Action',   desc: 'Turn ideas into next steps',  color: '#00d9b1' },
  { id: 'tension',  icon: '◆', label: 'Tension',  desc: 'Surface contradictions',      color: '#f87171' },
  { id: 'expand',   icon: '✦', label: 'Expand',   desc: 'Map unexplored territory',    color: '#a78bfa' },
];

const MODE_PROMPTS = {
  connect: `Find the unexpected connection, pattern, or emergent idea linking these thoughts. Make it feel like an "aha" moment — something invisible individually that becomes clear combined.`,
  action:  `These thoughts together suggest a direction. What 3 specific, high-leverage actions should the user take? Focus entirely on WHAT TO DO. Make actions concrete and immediately actionable.`,
  tension: `Find the hidden tensions, contradictions, or unexamined assumptions across these thoughts. Return 2-3 precise tensions that reveal where the ideas conflict or assume too much.`,
  expand:  `These thoughts together point toward unexplored territory. What 3 new questions, research directions, or creative possibilities emerge from their combination? Focus on frontiers.`,
};

const MODE_ITEMS_LABEL = { connect: null, action: 'Next Actions', tension: 'Tensions', expand: 'New Directions' };

// ── Smart combo suggester ─────────────────────────────────────────
function suggestCombos(thoughts) {
  const valid = thoughts.filter(t => !t.done && t.domain !== 'Sorting' && t.text);
  if (valid.length < 2) return [];

  const byDomain = {};
  valid.forEach(t => { (byDomain[t.domain] = byDomain[t.domain] || []).push(t); });
  const domains = Object.keys(byDomain);
  if (domains.length < 2) return [];

  const combos = [];

  // Combo 1: most recent thought from 3 most active domains
  const domsByRecency = domains
    .map(d => ({ d, t: byDomain[d][0] }))
    .sort((a, b) => new Date(b.t.createdAt) - new Date(a.t.createdAt));
  if (domsByRecency.length >= 2) {
    combos.push(domsByRecency.slice(0, 3).map(x => x.t));
  }

  // Combo 2: oldest thought + newest thought from different domains
  const allByAge = [...valid].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const oldest = allByAge[0];
  const newest = valid.find(t => t.domain !== oldest.domain);
  if (oldest && newest) {
    const c2 = [oldest, newest];
    const third = valid.find(t => t.domain !== oldest.domain && t.domain !== newest.domain);
    if (third) c2.push(third);
    combos.push(c2);
  }

  // Combo 3: 3 thoughts with max domain diversity (round-robin across domains)
  if (domains.length >= 3) {
    const c3 = domains.slice(0, 3).map(d => {
      const pool = byDomain[d];
      return pool[Math.floor(pool.length / 2)] || pool[0];
    });
    combos.push(c3);
  }

  // Deduplicate (remove combos that share all IDs with an existing one)
  const seen = new Set();
  return combos.filter(combo => {
    const key = [...combo].map(t => t.id).sort().join(',');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 3);
}

function getSurprise(thoughts) {
  const valid = thoughts.filter(t => !t.done && t.domain !== 'Sorting' && t.text);
  if (valid.length < 2) return [];
  const byDomain = {};
  valid.forEach(t => { (byDomain[t.domain] = byDomain[t.domain] || []).push(t); });
  const domains = Object.keys(byDomain).sort(() => Math.random() - 0.5);
  if (domains.length >= 3) {
    return domains.slice(0, 3).map(d => {
      const pool = byDomain[d];
      return pool[Math.floor(Math.random() * pool.length)];
    });
  }
  return valid.sort(() => Math.random() - 0.5).slice(0, Math.min(3, valid.length));
}

// ── API call ─────────────────────────────────────────────────────
async function synthesizeWithClaude(thoughts, apiKey, mode) {
  const excerpts = thoughts.map((t, i) =>
    `[${i + 1}] Domain: ${t.domain} | Type: ${t.type}\n"${t.text}"\nInsight: ${t.insight || 'none'}`
  ).join('\n\n');
  const hasItems = mode !== 'connect';
  const itemKey = mode === 'action' ? 'actions' : mode === 'tension' ? 'tensions' : 'directions';
  const itemsJson = hasItems ? `,\n  "${itemKey}": ["item1", "item2", "item3"]` : '';
  const prompt = `You are a synthesis engine for POLYMATH OS.

The user has selected ${thoughts.length} thoughts to forge in ${mode.toUpperCase()} mode:

${excerpts}

${MODE_PROMPTS[mode]}

Return ONLY valid JSON:
{
  "synthesis": "One sharp sentence (max 180 chars)",
  "insight": "2-3 sentences explaining the deeper meaning"${itemsJson},
  "domain": "The domain this belongs to",
  "tags": ["tag1", "tag2", "tag3"]
}

No markdown. Just JSON.`;
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
    connect: { synthesis: `Cross-domain signal: ${domains.join(' × ')}`, items: null },
    action:  { synthesis: `Action nexus: ${domains.join(' + ')}`, items: ['Review these thoughts together', 'Identify the shared constraint', 'Pick one domain to start'] },
    tension: { synthesis: `Tension: ${domains.join(' vs ')}`, items: ['These domains may have conflicting assumptions', 'The time horizons might differ', 'Check the base-rate assumptions'] },
    expand:  { synthesis: `Frontier: ${domains.join(' × ')} unexplored overlap`, items: ['What happens at the intersection?', 'What would an expert in each domain say?', 'What has never been tried here?'] },
  };
  const d = modeData[mode] || modeData.connect;
  const itemKey = mode === 'action' ? 'actions' : mode === 'tension' ? 'tensions' : 'directions';
  return {
    synthesis: d.synthesis,
    insight: `These thoughts from ${domains.join(', ')} share an underlying pattern worth exploring. Review them together for the common constraint or mechanism.`,
    domain: domains[0] || 'Life',
    tags: ['synthesis', 'cross-domain', mode],
    ...(d.items ? { [itemKey]: d.items } : {}),
  };
}

// ── Terminal loading animation ────────────────────────────────────
function ForgeTerminal({ thoughts, modeName }) {
  const [count, setCount] = useState(0);
  const domains = [...new Set(thoughts.map(t => t.domain))];
  const modeObj = FORGE_MODES.find(m => m.id === modeName) || FORGE_MODES[0];
  const lines = useMemo(() => [
    { prefix: 'SYS', text: 'FORGE SEQUENCE INITIATED',                delay: 0    },
    { prefix: '›',   text: `LOADING ${thoughts.length} THOUGHT VECTORS`, delay: 240  },
    { prefix: '›',   text: `DOMAIN BRIDGE: ${domains.join(' × ')}`,   delay: 560  },
    { prefix: '›',   text: `MODE: ${modeName.toUpperCase()}`,          delay: 820  },
    { prefix: '›',   text: 'SCANNING PATTERN SPACE…',                 delay: 1100 },
    { prefix: 'AI',  text: 'CROSS-DOMAIN RESONANCE DETECTED',          delay: 1700 },
    { prefix: '›',   text: 'CRYSTALLIZING SYNTHESIS…',                 delay: 2100 },
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
          <div key={i} className="ft-line ft-line-in">
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

// ── Combo suggestion card ─────────────────────────────────────────
function ComboCard({ combo, mode, onForge }) {
  const modeObj = FORGE_MODES.find(m => m.id === mode) || FORGE_MODES[0];
  const domains = [...new Set(combo.map(t => t.domain))];
  return (
    <div className="forge-combo-card" onClick={() => onForge(combo)}>
      <div className="forge-combo-domains">
        {domains.map(d => (
          <span key={d} className="forge-combo-domain-dot" style={{ background: DOMAIN_COLOR[d] || '#888', boxShadow: `0 0 6px ${DOMAIN_COLOR[d] || '#888'}55` }} />
        ))}
        <span className="forge-combo-domain-label">{domains.join(' · ')}</span>
      </div>
      <div className="forge-combo-snippets">
        {combo.slice(0, 2).map(t => (
          <div key={t.id} className="forge-combo-snippet">
            "{t.text.length > 60 ? t.text.slice(0, 58) + '…' : t.text}"
          </div>
        ))}
        {combo.length > 2 && <div className="forge-combo-more">+{combo.length - 2} more</div>}
      </div>
      <div className="forge-combo-cta">
        <span style={{ color: modeObj.color }}>{modeObj.icon}</span>
        <span>Forge this</span>
        <span className="forge-combo-arrow">→</span>
      </div>
    </div>
  );
}

// ── Past insight gallery card ─────────────────────────────────────
function InsightCard({ thought }) {
  const color = DOMAIN_COLOR[thought.domain] || 'var(--accent)';
  const ago = (() => {
    const ms = Date.now() - new Date(thought.createdAt).getTime();
    const h = Math.floor(ms / 3600000);
    if (h < 1) return 'just now';
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  })();
  return (
    <div className="forge-insight-card">
      <div className="forge-insight-header">
        <span className="forge-insight-domain" style={{ color }}>{thought.domain}</span>
        <span className="forge-insight-ago">{ago}</span>
      </div>
      <div className="forge-insight-text">{thought.text}</div>
      {thought.insight && <div className="forge-insight-body">{thought.insight}</div>}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────
export default function Forge({ thoughts, apiKey, onClose, onSaveForge }) {
  const [mode,        setMode]        = useState('connect');
  const [selected,    setSelected]    = useState([]);
  const [manualOpen,  setManualOpen]  = useState(false);
  const [search,      setSearch]      = useState('');
  const [domainFilt,  setDomainFilt]  = useState(null);
  const [result,      setResult]      = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [activeCombo, setActiveCombo] = useState(null);

  const modeObj = FORGE_MODES.find(m => m.id === mode);

  const validThoughts = useMemo(() =>
    thoughts.filter(t => !t.done && t.domain !== 'Sorting'),
    [thoughts]
  );

  const suggestedCombos = useMemo(() => suggestCombos(validThoughts), [validThoughts]);

  const pastInsights = useMemo(() =>
    thoughts.filter(t => t.forged && !t.done)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 8),
    [thoughts]
  );

  const allDomains = useMemo(() =>
    [...new Set(validThoughts.map(t => t.domain))].sort(),
    [validThoughts]
  );

  const filteredThoughts = useMemo(() => {
    const q = search.toLowerCase();
    return validThoughts
      .filter(t => !domainFilt || t.domain === domainFilt)
      .filter(t => !q || t.text.toLowerCase().includes(q) || t.domain.toLowerCase().includes(q))
      .slice(0, 40);
  }, [validThoughts, search, domainFilt]);

  const selectedItems = validThoughts.filter(t => selected.includes(t.id));
  const uniqueDomains = [...new Set(selectedItems.map(t => t.domain))];

  function toggleSelect(id) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 5 ? [...prev, id] : prev
    );
  }

  async function runForge(items) {
    if (items.length < 2) return;
    setActiveCombo(items);
    setLoading(true);
    setResult(null);
    try {
      const [r] = await Promise.all([
        apiKey
          ? synthesizeWithClaude(items, apiKey, mode).catch(() => localSynthesize(items, mode))
          : localSynthesize(items, mode),
        new Promise(res => setTimeout(res, 2600)),
      ]);
      setResult({ ...r, mode });
    } finally {
      setLoading(false);
    }
  }

  function handleComboForge(combo) {
    setSelected(combo.map(t => t.id));
    setManualOpen(false);
    runForge(combo);
  }

  function handleSurprise() {
    const combo = getSurprise(validThoughts);
    if (combo.length < 2) return;
    handleComboForge(combo);
  }

  function handleManualForge() {
    runForge(selectedItems);
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

  function reset() {
    setResult(null);
    setActiveCombo(null);
    setSelected([]);
  }

  const itemsKey = mode === 'action' ? 'actions' : mode === 'tension' ? 'tensions' : 'directions';
  const resultItems = result?.[itemsKey];

  const rightPanelState = loading ? 'loading' : result ? 'result' : 'idle';

  return (
    <div className="forge-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="forge-modal">

        {/* Header */}
        <div className="forge-header">
          <div>
            <h2 className="forge-title">◈ Insight Lab</h2>
            <p className="forge-sub">Combine thoughts. Discover what's hidden between them.</p>
          </div>
          <div className="forge-header-right">
            {/* Mode pills */}
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
            <button className="icon ghost" onClick={onClose} style={{ fontSize: 18, marginLeft: 8 }}>✕</button>
          </div>
        </div>

        <div className="forge-body">

          {/* ── LEFT PANEL ── */}
          <div className="forge-left">

            {/* Suggested combos */}
            {suggestedCombos.length > 0 && (
              <div className="forge-section">
                <div className="forge-section-label">READY TO FORGE</div>
                <div className="forge-combos">
                  {suggestedCombos.map((combo, i) => (
                    <ComboCard key={i} combo={combo} mode={mode} onForge={handleComboForge} />
                  ))}
                </div>
              </div>
            )}

            {/* Surprise button */}
            <button className="forge-surprise-btn" onClick={handleSurprise}>
              <span className="forge-surprise-icon">⚡</span>
              <div>
                <div className="forge-surprise-label">Surprise Forge</div>
                <div className="forge-surprise-sub">Let the machine pick for you</div>
              </div>
            </button>

            {/* Manual selection toggle */}
            <button
              className={`forge-manual-toggle${manualOpen ? ' open' : ''}`}
              onClick={() => setManualOpen(!manualOpen)}
            >
              <span>◈ Manual Selection</span>
              <span className="forge-manual-chevron">{manualOpen ? '▾' : '▸'}</span>
            </button>

            {manualOpen && (
              <div className="forge-manual">
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
                  {filteredThoughts.map(t => {
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
                  {filteredThoughts.length === 0 && (
                    <div className="empty" style={{ padding: 16 }}>No thoughts match.</div>
                  )}
                </div>
                {selectedItems.length >= 2 && (
                  <div className="forge-manual-footer">
                    <div className="forge-diversity">
                      <div className="forge-diversity-dots">
                        {uniqueDomains.map(d => (
                          <span key={d} className="fd-dot" style={{ background: DOMAIN_COLOR[d] || '#888', boxShadow: `0 0 6px ${DOMAIN_COLOR[d] || '#888'}` }} title={d} />
                        ))}
                      </div>
                      <span className="forge-diversity-text">
                        {uniqueDomains.length} domain{uniqueDomains.length > 1 ? 's' : ''}
                        {uniqueDomains.length >= 2 ? ' ✓' : ''}
                      </span>
                    </div>
                    <button
                      className="forge-fire-btn"
                      style={{ '--mc': modeObj?.color || '#fbbf24' }}
                      onClick={handleManualForge}
                    >
                      <span>{modeObj?.icon}</span>
                      <span>Forge {selectedItems.length} — {modeObj?.label}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="forge-right">

            {/* Loading */}
            {rightPanelState === 'loading' && activeCombo && (
              <ForgeTerminal thoughts={activeCombo} modeName={mode} />
            )}

            {/* Result */}
            {rightPanelState === 'result' && result && (
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
                    ✦ Save as Insight (+40 XP)
                  </button>
                  <button className="ghost" onClick={reset}>◈ Reset</button>
                </div>
              </div>
            )}

            {/* Idle: gallery or empty state */}
            {rightPanelState === 'idle' && (
              <div className="forge-idle-panel">
                {pastInsights.length > 0 ? (
                  <>
                    <div className="forge-section-label" style={{ padding: '0 0 12px' }}>YOUR INSIGHTS</div>
                    <div className="forge-gallery">
                      {pastInsights.map(t => <InsightCard key={t.id} thought={t} />)}
                    </div>
                  </>
                ) : (
                  <div className="forge-empty-state">
                    <div className="forge-empty-icon" style={{ color: modeObj?.color }}>◈</div>
                    <div className="forge-empty-title">Your insight gallery is empty</div>
                    <div className="forge-empty-sub">
                      Pick a suggested combo on the left or hit Surprise Forge to generate your first synthesis.
                    </div>
                    <div className="forge-empty-mode">
                      {modeObj?.icon} {modeObj?.label} mode — {modeObj?.desc.toLowerCase()}.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
