import { useState, useRef, useEffect } from 'react';
import { xpToLevel } from '../../utils/game.js';

const PROMPTS = [
  "What patterns do you see in my thinking?",
  "Which domain am I neglecting most?",
  "What is my strongest recurring insight?",
  "Where should I focus my next deep session?",
  "What's connecting across my different domains?",
  "Am I making real progress or just staying busy?",
];

function buildContext(state) {
  const totalXP   = Object.values(state.xp || {}).reduce((s, v) => s + v, 0);
  const level     = xpToLevel(totalXP);
  const domains   = Object.entries(state.xp || {})
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([d, xp]) => `${d}(${xp}xp)`)
    .join(', ');
  const recent    = (state.thoughts || []).slice(0, 20)
    .map(t => `[${t.domain}|${t.type}] ${t.text.slice(0, 55)}`)
    .join('\n');
  const streak    = state.streak?.count || 0;
  const sessions  = (state.sessions || []).length;
  const topDomain = Object.entries(state.xp || {}).sort(([, a], [, b]) => b - a)[0]?.[0] || 'none';
  const habits    = (state.habits || [])
    .filter(h => h.dates?.length > 0)
    .map(h => `${h.name}(${h.dates.length}×)`)
    .join(', ');
  const bosses    = (state.bosses || []).filter(b => b.defeated).length;

  return `Level ${level} | Total XP: ${totalXP} | Streak: ${streak} days
Sessions: ${sessions} | Boss kills: ${bosses}
Strongest domain: ${topDomain}
Domain mastery: ${domains}
Active habits: ${habits || 'none'}
20 most recent captures:
${recent}`;
}

export default function Oracle({ state, groqKey }) {
  const canvasRef  = useRef(null);
  const frameRef   = useRef(null);
  const phaseRef   = useRef('idle');
  const [question,  setQuestion]  = useState('');
  const [phase,     setPhase]     = useState('idle'); // idle | thinking | revealing | answered
  const [response,  setResponse]  = useState('');
  const [displayed, setDisplayed] = useState('');

  async function ask() {
    const q = question.trim();
    if (!q) return;
    if (!groqKey) {
      setPhase('answered');
      setResponse('Connect your Groq API key in Profile → AI Settings to awaken the Oracle. Free tier at console.groq.com — no credit card needed.');
      return;
    }
    setPhase('thinking');
    setResponse('');
    setDisplayed('');

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 300,
          messages: [{
            role: 'user',
            content:
              `You are the Oracle of POLYMATH OS — an intelligence that has studied this user's complete intellectual journey. You speak with precision and insight. No filler, no generic advice. Everything you say must reference their actual data.\n\n` +
              `USER PROFILE:\n${buildContext(state)}\n\n` +
              `QUESTION: ${q}\n\n` +
              `Answer in exactly 2-4 sentences. Be specific to their data. Reference actual domain names, numbers, patterns you notice. Speak like a brilliant mentor who has studied their mind.`,
          }],
        }),
      });
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content || 'The Oracle sees silence where there should be patterns.';
      setResponse(text);
      setPhase('revealing');
    } catch {
      setResponse('The Oracle is unreachable. Verify your Groq API key in Profile.');
      setPhase('answered');
    }
  }

  // Typewriter reveal — runs during 'revealing', sets phase to 'answered' when done
  useEffect(() => {
    if (phase !== 'revealing' || !response) return;
    let i = 0;
    const iv = setInterval(() => {
      setDisplayed(response.slice(0, i + 1));
      i++;
      if (i >= response.length) {
        clearInterval(iv);
        setPhase('answered');
      }
    }, 14);
    return () => clearInterval(iv);
  }, [phase, response]);

  // Sync phaseRef for RAF
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  // Orb canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let t = 0;

    function frame() {
      t++;
      const W = canvas.offsetWidth || 280;
      const H = canvas.offsetHeight || 220;
      if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
      ctx.clearRect(0, 0, W, H);

      const cx = W / 2, cy = H / 2;
      const isThinking = phaseRef.current === 'thinking' || phaseRef.current === 'revealing';
      const isAnswered = phaseRef.current === 'answered';
      const baseR = Math.min(W, H) * 0.26;
      const speed = isThinking ? 0.07 : 0.018;

      // Outer rings
      for (let ring = 3; ring >= 1; ring--) {
        const rMult = 1 + ring * 0.32 + 0.07 * Math.sin(t * speed * ring * 0.7);
        const hue   = isThinking
          ? (168 + t * 0.6 + ring * 20) % 360
          : isAnswered ? 210 : 168;
        const alpha = (isThinking ? 0.12 : 0.05) - ring * 0.02 + 0.04 * Math.sin(t * speed);
        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseR * rMult);
        grd.addColorStop(0, `hsla(${hue},100%,65%,${Math.max(0, alpha)})`);
        grd.addColorStop(1, `hsla(${hue},100%,65%,0)`);
        ctx.beginPath();
        ctx.arc(cx, cy, baseR * rMult, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      // Core
      const coreHue   = isThinking ? (168 + t * 0.9) % 360 : isAnswered ? 200 : 168;
      const coreAlpha = 0.80 + 0.12 * Math.sin(t * (isThinking ? 0.12 : 0.025));
      const coreGrd   = ctx.createRadialGradient(
        cx - baseR * 0.22, cy - baseR * 0.22, 0,
        cx, cy, baseR
      );
      coreGrd.addColorStop(0, `hsla(${coreHue},70%,88%,${coreAlpha})`);
      coreGrd.addColorStop(0.5, `hsla(${coreHue},100%,58%,${coreAlpha * 0.8})`);
      coreGrd.addColorStop(1, `hsla(${coreHue},100%,38%,0.05)`);

      ctx.beginPath();
      ctx.arc(cx, cy, baseR, 0, Math.PI * 2);
      ctx.fillStyle  = coreGrd;
      ctx.shadowBlur = isThinking ? 50 : 22;
      ctx.shadowColor = `hsl(${coreHue},100%,65%)`;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Orbiting dots while thinking
      if (isThinking) {
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2 + t * 0.065;
          const or    = baseR * 1.55 + 6 * Math.sin(t * 0.04 + i);
          const dx    = cx + Math.cos(angle) * or;
          const dy    = cy + Math.sin(angle) * or;
          ctx.beginPath();
          ctx.arc(dx, dy, 2.5, 0, Math.PI * 2);
          ctx.fillStyle   = `hsla(${coreHue},100%,70%,0.85)`;
          ctx.shadowBlur  = 8;
          ctx.shadowColor = `hsl(${coreHue},100%,65%)`;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      frameRef.current = requestAnimationFrame(frame);
    }
    frameRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <div className="oracle-root">
      <canvas ref={canvasRef} className="oracle-canvas" />

      <div className="oracle-ui">
        <div className="oracle-response-area">
          {phase === 'idle' && (
            <p className="oracle-idle">
              The Oracle has studied your patterns.<br />Ask it anything about your mind.
            </p>
          )}
          {phase === 'thinking' && (
            <p className="oracle-thinking">
              ◌ consulting the patterns<span className="routing-cursor" />
            </p>
          )}
          {(phase === 'revealing' || phase === 'answered') && response && (
            <p className="oracle-answer">
              {displayed}
              {displayed.length < response.length && <span className="routing-cursor" />}
            </p>
          )}
        </div>

        <div className="oracle-chips">
          {PROMPTS.map((p, i) => (
            <button
              key={i}
              className="oracle-chip"
              onClick={() => { setQuestion(p); }}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="oracle-input-row">
          <input
            className="oracle-input"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && ask()}
            placeholder="Ask the Oracle…"
          />
          <button
            className="primary"
            onClick={ask}
            disabled={phase === 'thinking'}
          >
            ASK
          </button>
        </div>
      </div>
    </div>
  );
}
