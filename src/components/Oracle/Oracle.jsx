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

function spawnParticle(cx, cy, baseR) {
  const angle = Math.random() * Math.PI * 2;
  const speed = 2.2 + Math.random() * 4;
  const tang  = (Math.random() - 0.5) * speed * 0.7;
  return {
    x:          cx + Math.cos(angle) * baseR * 0.92,
    y:          cy + Math.sin(angle) * baseR * 0.92,
    vx:         Math.cos(angle) * speed + Math.sin(angle) * tang,
    vy:         Math.sin(angle) * speed - Math.cos(angle) * tang,
    orbitR:     baseR * (1.65 + Math.random() * 1.8),
    orbitAngle: angle,
    orbitSpeed: (0.038 + Math.random() * 0.055) * (Math.random() > 0.5 ? 1 : -1),
    inc:        Math.PI * (0.12 + Math.random() * 0.76),  // 22°–158° — variety of tilted planes
    asc:        Math.random() * Math.PI * 2,               // ascending node — spreads orbits 360°
    r:          1.1 + Math.random() * 2.4,
    baseAlpha:  0.55 + Math.random() * 0.45,
    alpha:      0,
    depth:      0,
    hueOff:     (Math.random() - 0.5) * 45,
    state:      'flying',
    dead:       false,
  };
}

function drawRing(ctx, cx, cy, radius, scaleY, rotation, hue, alpha, lw, numNodes, nodeOff) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.scale(1, scaleY);
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.strokeStyle = `hsla(${hue}, 85%, 65%, ${alpha})`;
  ctx.lineWidth = lw;
  ctx.stroke();
  for (let i = 0; i < numNodes; i++) {
    const a = (i / numNodes) * Math.PI * 2 + nodeOff;
    ctx.beginPath();
    ctx.arc(Math.cos(a) * radius, Math.sin(a) * radius, lw * 2.2, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${hue}, 100%, 82%, ${Math.min(1, alpha * 2.8)})`;
    ctx.fill();
  }
  ctx.restore();
}

export default function Oracle({ state, groqKey }) {
  const canvasRef    = useRef(null);
  const frameRef     = useRef(null);
  const phaseRef     = useRef('idle');
  const particlesRef = useRef([]);
  const tRef         = useRef(0);
  const burstRef     = useRef(false);
  const returnRef    = useRef(false);

  const [question,  setQuestion]  = useState('');
  const [phase,     setPhase]     = useState('idle');
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

  useEffect(() => {
    if (phase !== 'revealing' || !response) return;
    let i = 0;
    const iv = setInterval(() => {
      setDisplayed(response.slice(0, i + 1));
      i++;
      if (i >= response.length) { clearInterval(iv); setPhase('answered'); }
    }, 14);
    return () => clearInterval(iv);
  }, [phase, response]);

  useEffect(() => {
    phaseRef.current = phase;
    if (phase === 'thinking') burstRef.current = true;
    if (phase === 'answered') returnRef.current = true;
  }, [phase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function frame() {
      const t = ++tRef.current;
      const W = canvas.offsetWidth || 480;
      const H = canvas.offsetHeight || 300;
      if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
      ctx.clearRect(0, 0, W, H);

      const cx = W / 2, cy = H / 2;
      const ph = phaseRef.current;
      const isThinking  = ph === 'thinking';
      const isRevealing = ph === 'revealing';
      const isAnswered  = ph === 'answered';
      const isActive    = isThinking || isRevealing;
      const baseR = Math.min(W, H) * 0.215;
      const spd   = isActive ? 1.0 : 0.22;

      let coreHue;
      if      (isThinking)  coreHue = (258 + t * 0.75) % 360;
      else if (isRevealing) coreHue = 42 + 10 * Math.sin(t * 0.04);
      else if (isAnswered)  coreHue = 200;
      else                  coreHue = 182;

      // ── burst trigger ──
      if (burstRef.current) {
        burstRef.current = false;
        const n = 58 + Math.floor(Math.random() * 18);
        particlesRef.current = Array.from({ length: n }, () => spawnParticle(cx, cy, baseR));
      }
      // ── return trigger ──
      if (returnRef.current) {
        returnRef.current = false;
        particlesRef.current.forEach(p => { if (!p.dead) p.state = 'returning'; });
      }

      // ── 1. deep space atmospheric glow ──
      const atm = ctx.createRadialGradient(cx, cy, baseR * 0.4, cx, cy, baseR * 4.8);
      const atmA = isActive ? 0.22 : 0.07;
      atm.addColorStop(0,    `hsla(${coreHue},100%,58%,${atmA})`);
      atm.addColorStop(0.35, `hsla(${coreHue},100%,44%,${atmA * 0.35})`);
      atm.addColorStop(1,    `hsla(${coreHue},100%,32%,0)`);
      ctx.beginPath(); ctx.arc(cx, cy, baseR * 4.8, 0, Math.PI * 2);
      ctx.fillStyle = atm; ctx.fill();

      // ── 2. three orbital rings ──
      const rA = isActive ? 0.48 : 0.17;
      drawRing(ctx, cx, cy, baseR * 1.88, 0.27,  t * 0.005 * spd,             coreHue,      rA,         0.7, 8, t * 0.005 * spd);
      drawRing(ctx, cx, cy, baseR * 1.62, 0.56, -t * 0.009 * spd + 0.85,     coreHue + 22, rA * 0.72,  0.55, 6, -t * 0.009 * spd);
      drawRing(ctx, cx, cy, baseR * 2.12, 0.17,  t * 0.003 * spd + 2.0,      coreHue - 18, rA * 0.42,  0.45, 4,  t * 0.003 * spd);

      // ── 3. plasma shell ──
      for (let s = 3; s >= 1; s--) {
        const wob  = s * 0.08 * Math.sin(t * 0.023 * spd + s * 1.4);
        const offX = wob * baseR * Math.cos(t * 0.019 * spd + s);
        const offY = wob * baseR * Math.sin(t * 0.016 * spd + s);
        const r    = baseR * (1.09 + s * 0.17);
        const g    = ctx.createRadialGradient(cx + offX, cy + offY, 0, cx, cy, r);
        g.addColorStop(0,   `hsla(${coreHue + s * 14},100%,62%,0)`);
        g.addColorStop(0.6, `hsla(${coreHue},100%,52%,${(isActive ? 0.11 : 0.032) + s * 0.008})`);
        g.addColorStop(1,   `hsla(${coreHue},100%,40%,0)`);
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = g; ctx.fill();
      }

      // ── 4. core sphere ──
      const hlA = t * 0.007 * spd;
      const hlX = cx + Math.cos(hlA) * baseR * 0.30;
      const hlY = cy + Math.sin(hlA * 0.72) * baseR * 0.30;
      const cg  = ctx.createRadialGradient(hlX - baseR * 0.18, hlY - baseR * 0.18, 0, cx, cy, baseR);
      const br  = isThinking ? 0.94 : isAnswered ? 0.88 : 0.84;
      cg.addColorStop(0,    `hsla(${coreHue + 38},52%,97%,${br})`);
      cg.addColorStop(0.17, `hsla(${coreHue + 16},88%,78%,${br * 0.9})`);
      cg.addColorStop(0.55, `hsla(${coreHue},100%,52%,${br * 0.85})`);
      cg.addColorStop(0.85, `hsla(${coreHue - 14},100%,34%,${br * 0.48})`);
      cg.addColorStop(1,    `hsla(${coreHue - 26},100%,20%,0.04)`);
      ctx.beginPath(); ctx.arc(cx, cy, baseR, 0, Math.PI * 2);
      ctx.shadowBlur  = isActive ? 72 : 30;
      ctx.shadowColor = `hsl(${coreHue},100%,60%)`;
      ctx.fillStyle   = cg; ctx.fill();
      ctx.shadowBlur  = 0;

      // ── 5. inner gyroscope ring ──
      {
        const gr  = baseR * 0.66;
        const rot = t * 0.02 * spd;
        ctx.save();
        ctx.translate(cx, cy); ctx.rotate(rot); ctx.scale(1, 0.32);
        ctx.beginPath(); ctx.arc(0, 0, gr, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${coreHue + 28},100%,82%,${isActive ? 0.42 : 0.14})`;
        ctx.lineWidth = 1.1; ctx.stroke();
        // counter-rotate second inner ring
        ctx.rotate(Math.PI / 3 - rot * 2);
        ctx.scale(1, 2.8); // undo scaleY, add different tilt
        ctx.scale(1, 0.15);
        ctx.beginPath(); ctx.arc(0, 0, gr * 0.85, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${coreHue - 20},100%,80%,${isActive ? 0.28 : 0.08})`;
        ctx.lineWidth = 0.9; ctx.stroke();
        ctx.restore();
      }

      // ── 6. scanning arcs (active only) ──
      if (isActive) {
        const s1 = t * 0.10 * spd;
        ctx.beginPath();
        ctx.arc(cx, cy, baseR * 1.08, s1, s1 + Math.PI * 0.58);
        ctx.strokeStyle = `hsla(${coreHue},100%,86%,0.62)`;
        ctx.lineWidth = 2.2;
        ctx.shadowBlur = 14; ctx.shadowColor = `hsl(${coreHue},100%,72%)`;
        ctx.stroke(); ctx.shadowBlur = 0;

        const s2 = -t * 0.065 * spd + Math.PI * 1.3;
        ctx.beginPath();
        ctx.arc(cx, cy, baseR * 1.14, s2, s2 + Math.PI * 0.38);
        ctx.strokeStyle = `hsla(${coreHue + 28},100%,80%,0.32)`;
        ctx.lineWidth = 1.1; ctx.stroke();

        // outer data ring pulse
        const pulse = 0.3 + 0.25 * Math.sin(t * 0.18);
        ctx.beginPath();
        ctx.arc(cx, cy, baseR * (1.22 + pulse * 0.04), 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${coreHue},100%,70%,${pulse * 0.25})`;
        ctx.lineWidth = 0.8; ctx.stroke();
      }

      // ── 7. lens flare spikes ──
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const numSpikes  = 6;
      const spikeAlpha = isActive ? 0.28 : 0.08;
      for (let s = 0; s < numSpikes; s++) {
        const sa  = (s / numSpikes) * Math.PI * 2 + t * 0.0007;
        const len = baseR * (1.55 + 0.28 * Math.sin(t * 0.038 + s * 1.4));
        const ex  = cx + Math.cos(sa) * len;
        const ey  = cy + Math.sin(sa) * len;
        const nx  = Math.sin(sa) * 2.2;
        const ny  = -Math.cos(sa) * 2.2;
        const sg  = ctx.createLinearGradient(cx, cy, ex, ey);
        sg.addColorStop(0,    `hsla(${coreHue},100%,92%,${spikeAlpha})`);
        sg.addColorStop(0.22, `hsla(${coreHue},100%,80%,${spikeAlpha * 0.45})`);
        sg.addColorStop(1,    `hsla(${coreHue},100%,70%,0)`);
        ctx.beginPath();
        ctx.moveTo(cx + nx, cy + ny);
        ctx.lineTo(ex, ey);
        ctx.lineTo(cx - nx, cy - ny);
        ctx.closePath();
        ctx.fillStyle = sg; ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.restore();

      // ── 8. specular highlight ──
      const sg2 = ctx.createRadialGradient(
        cx - baseR * 0.28, cy - baseR * 0.28, 0,
        cx - baseR * 0.28, cy - baseR * 0.28, baseR * 0.50
      );
      sg2.addColorStop(0, `rgba(255,255,255,${isActive ? 0.65 : 0.48})`);
      sg2.addColorStop(0.45, 'rgba(255,255,255,0.06)');
      sg2.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, baseR, 0, Math.PI * 2); ctx.clip();
      ctx.fillStyle = sg2; ctx.fillRect(0, 0, W, H);
      ctx.restore();

      // ── 9. particles ──
      particlesRef.current = particlesRef.current.filter(p => !p.dead);
      // depth-sort: draw back particles first so front ones render on top
      const toRender = [...particlesRef.current].sort((a, b) => (a.depth || 0) - (b.depth || 0));
      for (const p of toRender) {
        if (p.state !== 'returning' && p.alpha < p.baseAlpha) {
          p.alpha = Math.min(p.baseAlpha, p.alpha + 0.045);
        }

        if (p.state === 'flying') {
          p.x += p.vx; p.y += p.vy;
          p.vx *= 0.963; p.vy *= 0.963;
          const d = Math.hypot(p.x - cx, p.y - cy);
          if (d >= p.orbitR || (Math.abs(p.vx) + Math.abs(p.vy) < 0.45)) {
            p.state      = 'orbiting';
            p.orbitAngle = Math.atan2(p.y - cy, p.x - cx);
            p.orbitR     = Math.max(d, baseR * 1.5);
          }
        } else if (p.state === 'orbiting') {
          p.orbitAngle += p.orbitSpeed;
          // 3D orbital projection: inclination (inc) + ascending node (asc)
          // Standard Keplerian rotation: Rz(asc) * Rx(inc)
          const cosI = Math.cos(p.inc), sinI = Math.sin(p.inc);
          const cosA = Math.cos(p.asc), sinA = Math.sin(p.asc);
          const cosO = Math.cos(p.orbitAngle), sinO = Math.sin(p.orbitAngle);
          p.x     = cx + (cosA * cosO - sinA * sinO * cosI) * p.orbitR;
          p.y     = cy + (sinA * cosO + cosA * sinO * cosI) * p.orbitR;
          p.depth = sinI * sinO * p.orbitR;  // positive = toward viewer
        } else if (p.state === 'returning') {
          const dx   = cx - p.x, dy = cy - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < baseR * 0.18) { p.dead = true; continue; }
          const acc = 0.32 + (1 - Math.min(1, dist / (baseR * 3.2))) * 0.62;
          p.vx += (dx / dist) * acc;
          p.vy += (dy / dist) * acc;
          const sp = Math.hypot(p.vx, p.vy);
          if (sp > 9.5) { p.vx = p.vx / sp * 9.5; p.vy = p.vy / sp * 9.5; }
          p.x += p.vx; p.y += p.vy;
          p.alpha = p.baseAlpha * Math.min(1, (dist - baseR * 0.12) / (baseR * 1.1));
        }

        if (p.dead) continue;
        const pa = Math.max(0, p.alpha);
        if (pa < 0.01) continue;

        // depth scaling: front particles are larger and brighter
        const rawDepth    = p.state === 'orbiting' ? (p.depth || 0) / p.orbitR : 0;
        const depthFactor = 0.45 + 0.55 * (rawDepth + 1) / 2; // 0.45 → 1.0

        // occlude particles passing behind the sphere
        const distFromOrb = Math.hypot(p.x - cx, p.y - cy);
        const isBehind    = rawDepth < -0.08 && distFromOrb < baseR * 1.05;
        const drawAlpha   = isBehind ? pa * 0.05 : pa * depthFactor;
        const drawR       = p.r * (isBehind ? 0.4 : depthFactor);
        if (drawAlpha < 0.01) continue;

        // trail on return
        if (p.state === 'returning') {
          const sp = Math.hypot(p.vx, p.vy);
          if (sp > 0.6) {
            const tl  = Math.min(16, sp * 1.6);
            const tex = p.x - (p.vx / sp) * tl;
            const tey = p.y - (p.vy / sp) * tl;
            const tg  = ctx.createLinearGradient(p.x, p.y, tex, tey);
            tg.addColorStop(0, `hsla(${coreHue},100%,75%,${drawAlpha * 0.85})`);
            tg.addColorStop(1, `hsla(${coreHue},100%,75%,0)`);
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(tex, tey);
            ctx.strokeStyle = tg; ctx.lineWidth = drawR * 0.85; ctx.stroke();
          }
        }

        ctx.beginPath(); ctx.arc(p.x, p.y, drawR, 0, Math.PI * 2);
        ctx.fillStyle   = `hsla(${coreHue + p.hueOff},100%,74%,${drawAlpha})`;
        ctx.shadowBlur  = 10 * depthFactor;
        ctx.shadowColor = `hsl(${coreHue},100%,68%)`;
        ctx.fill(); ctx.shadowBlur = 0;
      }

      // ── 10. bright center core ──
      const cc = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseR * 0.2);
      cc.addColorStop(0, `hsla(${coreHue + 42},38%,100%,${isActive ? 0.96 : 0.78})`);
      cc.addColorStop(1, `hsla(${coreHue},100%,78%,0)`);
      ctx.beginPath(); ctx.arc(cx, cy, baseR * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = cc; ctx.fill();

      frameRef.current = requestAnimationFrame(frame);
    }

    frameRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const statusLabel =
    phase === 'idle'      ? 'ORACLE · DORMANT'      :
    phase === 'thinking'  ? 'ORACLE · PROCESSING'   :
    phase === 'revealing' ? 'ORACLE · TRANSMITTING' :
                            'ORACLE · COMPLETE';

  return (
    <div className="oracle-root">
      <div className="oracle-status-label">{statusLabel}</div>
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
            <button key={i} className="oracle-chip" onClick={() => setQuestion(p)}>{p}</button>
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
          <button className="primary" onClick={ask} disabled={phase === 'thinking'}>ASK</button>
        </div>
      </div>
    </div>
  );
}
