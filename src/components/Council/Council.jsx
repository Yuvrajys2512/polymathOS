import { useState, useEffect } from 'react';
import { xpToLevel } from '../../utils/game.js';
import { groqChat, parseJSON } from '../../utils/cosmosAI.js';

const SEAT_COLORS = ['#00d9b1', '#60a5fa', '#f472b6', '#fbbf24', '#a78bfa'];

const EXAMPLES = [
  'Should I go deep on one domain or stay broad?',
  'Should I ship the unfinished version or keep polishing?',
  'Is it time to abandon this project?',
];

function localCouncil(q) {
  return {
    advisors: [
      { role: 'The Strategist', argument: `Zoom out. Ask which choice still looks right in a year, not today. For "${q.slice(0, 40)}", the option that compounds beats the one that merely feels productive now.` },
      { role: 'The Skeptic', argument: `What are you avoiding by asking this? Name the real fear underneath the decision — usually that's the thing actually blocking you, not the choice itself.` },
      { role: 'The Builder', argument: `Decisions die in abstraction. Pick the path you can take a concrete first step on within 24 hours, then let reality correct your course.` },
      { role: 'The Visionary', argument: `Which choice makes you a more interesting person to be five years from now? Optimize for the version of you that you'd respect.` },
    ],
    verdict: 'The council is offline (no Groq key), so this is generic counsel: choose the option with the smallest reversible first step, commit fully for a fixed window, and re-decide with real data. Add a key in Profile for a verdict grounded in your actual thinking.',
  };
}

export default function Council({ game }) {
  const { state } = game;
  const sessions = state.councilSessions || [];

  const [question, setQuestion] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [revealed, setRevealed] = useState(0);
  const [showHistory, setShowHistory] = useState(false);

  // sequential reveal of advisors
  useEffect(() => {
    if (!result) return;
    if (revealed >= result.advisors.length) return;
    const t = setTimeout(() => setRevealed(r => r + 1), 760);
    return () => clearTimeout(t);
  }, [result, revealed]);

  function buildContext() {
    const xp = state.xp || {};
    const totalXP = Object.values(xp).reduce((s, v) => s + v, 0);
    const top = Object.entries(xp).filter(([, v]) => v > 0).sort(([, a], [, b]) => b - a).slice(0, 4)
      .map(([d, v]) => `${d}(${v}xp)`).join(', ');
    const recent = (state.thoughts || []).slice(0, 8).map(t => `[${t.domain}] ${t.text.slice(0, 50)}`).join('\n');
    return `Level ${xpToLevel(totalXP)}. Strongest domains: ${top || 'none yet'}.\nRecent thoughts:\n${recent || 'none'}`;
  }

  async function convene() {
    const q = question.trim();
    if (!q || busy) return;
    setBusy(true); setResult(null); setRevealed(0);
    let data;
    try {
      const raw = await groqChat(state.groqKey,
        `You are convening an internal council of advisors inside this person's mind to help them decide. ` +
        `Each advisor is a distinct facet of their own thinking.\n\n` +
        `THEIR PROFILE:\n${buildContext()}\n\n` +
        `DECISION: "${q}"\n\n` +
        `Create exactly 4 advisors with roles that fit their domains and this decision (e.g. The Strategist, The Skeptic, The Builder, The Visionary, The Realist). ` +
        `Each argues a clear position on the decision, referencing their situation where possible. Then give a final synthesized verdict — decisive, not wishy-washy.\n` +
        `Return ONLY JSON: {"advisors":[{"role":"...","argument":"..."}],"verdict":"..."}. ` +
        `Each argument 2-3 sentences. verdict 2-3 sentences. No markdown.`,
        { json: true, maxTokens: 850 });
      const parsed = parseJSON(raw);
      if (parsed?.advisors?.length && parsed.verdict) {
        data = {
          advisors: parsed.advisors.slice(0, 5).map(a => ({
            role: String(a.role || 'Advisor').slice(0, 28),
            argument: String(a.argument || '').slice(0, 400),
          })),
          verdict: String(parsed.verdict).slice(0, 520),
        };
      } else data = localCouncil(q);
    } catch {
      data = localCouncil(q);
    }
    setResult(data);
    setRevealed(0);
    game.addCouncilSession({ question: q, advisors: data.advisors, verdict: data.verdict });
    setBusy(false);
  }

  function loadSession(s) {
    setResult({ advisors: s.advisors, verdict: s.verdict });
    setQuestion(s.question);
    setRevealed(s.advisors.length);
    setShowHistory(false);
  }

  const N = result?.advisors.length || 0;
  const verdictReady = result && revealed >= N;

  return (
    <div className="council-root">
      <div className="council-input-row">
        <input
          className="council-input"
          placeholder="Bring a decision to the council…"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && convene()}
        />
        <button className="primary" onClick={convene} disabled={busy || !question.trim()}>
          {busy ? 'CONVENING…' : 'CONVENE'}
        </button>
      </div>

      {!result && !busy && (
        <div className="council-chips">
          {EXAMPLES.map((e, i) => (
            <button key={i} className="council-chip" onClick={() => setQuestion(e)}>{e}</button>
          ))}
        </div>
      )}

      {(result || busy) && (
        <div className="council-stage">
          <div className={`council-center${busy ? ' thinking' : ''}`}>
            <span className="council-center-glyph">⊜</span>
            <span className="council-center-label">{busy ? 'gathering the council' : 'THE COUNCIL'}</span>
          </div>
          {result && result.advisors.map((a, i) => {
            const angle = (-90 + i * (360 / N)) * Math.PI / 180;
            const x = 50 + 40 * Math.cos(angle);
            const y = 50 + 40 * Math.sin(angle);
            const lit = i < revealed;
            return (
              <div
                key={i}
                className={`council-seat${lit ? ' lit' : ''}`}
                style={{ left: `${x}%`, top: `${y}%`, '--sc': SEAT_COLORS[i % SEAT_COLORS.length] }}
              >
                <span className="council-seat-dot" />
                <span className="council-seat-role">{a.role}</span>
              </div>
            );
          })}
        </div>
      )}

      {result && (
        <div className="council-transcript">
          {result.advisors.slice(0, revealed).map((a, i) => (
            <div key={i} className="council-arg" style={{ '--sc': SEAT_COLORS[i % SEAT_COLORS.length] }}>
              <div className="council-arg-role">{a.role}</div>
              <div className="council-arg-text">{a.argument}</div>
            </div>
          ))}
          {verdictReady && (
            <div className="council-verdict">
              <div className="council-verdict-label">◆ THE VERDICT</div>
              <p className="council-verdict-text">{result.verdict}</p>
            </div>
          )}
        </div>
      )}

      {sessions.length > 0 && (
        <div className="council-history">
          <button className="council-history-toggle" onClick={() => setShowHistory(h => !h)}>
            {showHistory ? '▾' : '▸'} PAST RULINGS ({sessions.length})
          </button>
          {showHistory && (
            <div className="council-history-list">
              {sessions.map(s => (
                <div key={s.id} className="council-history-item">
                  <button className="council-history-q" onClick={() => loadSession(s)}>{s.question}</button>
                  <button className="council-history-del" onClick={() => game.deleteCouncilSession(s.id)}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
