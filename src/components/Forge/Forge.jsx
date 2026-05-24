import { useState, useMemo } from 'react';
import { DOMAIN_COLOR, TYPE_ICON } from '../../constants/index.js';

async function synthesizeWithClaude(thoughts, apiKey) {
  const excerpts = thoughts.map((t, i) =>
    `[${i + 1}] Domain: ${t.domain} | Type: ${t.type}\n"${t.text}"\nInsight: ${t.insight || 'none'}`
  ).join('\n\n');

  const prompt = `You are a synthesis engine for POLYMATH OS — an ADHD-focused second brain.

The user has selected ${thoughts.length} thoughts from different domains to forge into a connection:

${excerpts}

Find the unexpected connection, pattern, or emergent idea that links these thoughts. This should feel like an "aha" moment — something the user couldn't see individually but becomes clear when combined.

Return ONLY valid JSON:
{
  "synthesis": "One sharp, punchy sentence (max 200 chars) that names the connection",
  "insight": "2-3 sentences expanding on why this connection matters and what to do with it",
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
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) throw new Error('API error');
  const data = await res.json();
  const text = data.content?.[0]?.text || '';
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON');
  return JSON.parse(match[0]);
}

function localSynthesize(thoughts) {
  const domains = [...new Set(thoughts.map(t => t.domain))];
  return {
    synthesis: `Cross-domain connection: ${domains.join(' × ')}`,
    insight: `These thoughts from ${domains.join(', ')} share an underlying pattern. Review them together and look for the common constraint, mechanism, or opportunity that cuts across all ${thoughts.length} ideas.`,
    domain: domains[0] || 'Life',
    tags: ['synthesis', 'cross-domain'],
  };
}

export default function Forge({ thoughts, apiKey, onClose, onSaveForge }) {
  const [selected, setSelected]  = useState([]);
  const [result, setResult]      = useState(null);
  const [loading, setLoading]    = useState(false);
  const [search, setSearch]      = useState('');

  const recent = useMemo(() => {
    const q = search.toLowerCase();
    return thoughts
      .filter(t => !t.done)
      .filter(t => !q || t.text.toLowerCase().includes(q) || t.domain.toLowerCase().includes(q))
      .slice(0, 30);
  }, [thoughts, search]);

  function toggleSelect(id) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 5 ? [...prev, id] : prev
    );
  }

  async function handleForge() {
    const items = thoughts.filter(t => selected.includes(t.id));
    if (items.length < 2) return;
    setLoading(true);
    setResult(null);
    try {
      const r = apiKey
        ? await synthesizeWithClaude(items, apiKey)
        : localSynthesize(items);
      setResult(r);
    } catch {
      setResult(localSynthesize(items));
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

  const selectedItems = thoughts.filter(t => selected.includes(t.id));

  return (
    <div className="forge-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="forge-modal">
        <div className="forge-header">
          <div>
            <h2 className="forge-title">◈ The Forge</h2>
            <p className="forge-sub">Select 2–5 thoughts from different domains. Claude will find the connection.</p>
          </div>
          <button className="icon ghost" onClick={onClose} style={{ fontSize: 18 }}>✕</button>
        </div>

        <div className="forge-body">
          {/* Left: thought picker */}
          <div className="forge-left">
            <div className="forge-search-row">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Filter thoughts…"
              />
              <span className="forge-sel-count">{selected.length}/5 selected</span>
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
            <div className="forge-input-preview">
              <div className="forge-preview-label">Selected for forging</div>
              {selected.length === 0 ? (
                <div className="forge-preview-empty">Pick thoughts from the left →</div>
              ) : (
                <div className="forge-chips">
                  {selectedItems.map(t => {
                    const color = DOMAIN_COLOR[t.domain] || 'var(--accent)';
                    return (
                      <div key={t.id} className="forge-chip" style={{ '--fc': color }}>
                        <span className="forge-chip-dom">{t.domain}</span>
                        <span className="forge-chip-text">{t.text.slice(0, 40)}{t.text.length > 40 ? '…' : ''}</span>
                        <button className="forge-chip-remove" onClick={() => toggleSelect(t.id)}>✕</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              className="primary forge-btn"
              onClick={handleForge}
              disabled={selected.length < 2 || loading}
            >
              {loading ? (
                <span className="forge-loading">
                  <span className="forge-flame">◈</span> Forging…
                </span>
              ) : (
                `◈ Forge ${selected.length >= 2 ? selected.length + ' thoughts' : '(select 2+)'}`
              )}
            </button>

            {result && (
              <div className="forge-result">
                <div className="forge-result-header">
                  <span className="forge-result-icon">✦</span>
                  <span className="forge-result-label">Synthesis</span>
                  <span className="forge-result-domain" style={{ color: DOMAIN_COLOR[result.domain] || 'var(--accent)' }}>
                    {result.domain}
                  </span>
                </div>
                <div className="forge-result-synthesis">{result.synthesis}</div>
                <div className="forge-result-insight">{result.insight}</div>
                {result.tags?.length > 0 && (
                  <div className="forge-result-tags">
                    {result.tags.map(tag => <span key={tag} className="pill">#{tag}</span>)}
                  </div>
                )}
                <button className="primary" style={{ marginTop: 14, width: '100%' }} onClick={handleSave}>
                  ✦ Save as Insight
                </button>
              </div>
            )}

            {!result && !loading && selected.length < 2 && (
              <div className="forge-hint">
                <div className="forge-hint-icon">◈</div>
                <div className="forge-hint-text">Select 2+ thoughts from different domains to reveal hidden connections.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
