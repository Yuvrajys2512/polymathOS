import { useEffect, useRef, useState } from 'react';
import { DOMAIN_COLOR } from '../../constants/index.js';

const TAGLINES = [
  'A personal OS for the polymathic mind.',
  'Capture raw thought. Structure emerges.',
  'Level up your actual life.',
  'Your mind, gamified.',
  'Built for the beautifully scattered.',
];

const FEATS = [
  { icon:'◈', title:'Instant Capture', desc:'Dump raw thought. AI classifies domain, type, and priority — in seconds.', color:'#00d9b1' },
  { icon:'⚡', title:'Domain XP System', desc:'Level up across 8 knowledge domains. Your intellectual growth — visible and real.', color:'#fbbf24' },
  { icon:'◆', title:'Focus Identity Modes', desc:'Builder, Researcher, Night Grind. Each session has a vibe and an XP multiplier.', color:'#a78bfa' },
];

export default function LandingPage({ onEnter }) {
  const canvasRef = useRef(null);
  const [phase, setPhase]     = useState(0);
  const [tagline, setTagline] = useState('');
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const colors = Object.values(DOMAIN_COLOR);
    const N = 70;
    const pts = Array.from({ length: N }, (_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.8,
      c: colors[i % colors.length],
    }));
    const mouse = { x: null, y: null };
    const onMove = e => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener('mousemove', onMove);

    let raf;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.hypot(dx, dy);
        if (d < 160) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = pts[i].c;
          ctx.globalAlpha = (1 - d / 160) * 0.13;
          ctx.lineWidth = 0.75;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
      pts.forEach(p => {
        if (mouse.x !== null) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
          if (d < 120 && d > 0) { const f = ((120 - d) / 120) * 0.6; p.vx += (dx / d) * f; p.vy += (dy / d) * f; }
        }
        const spd = Math.hypot(p.vx, p.vy);
        if (spd > 1.8) { p.vx *= 1.8 / spd; p.vy *= 1.8 / spd; }
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.shadowBlur = 20;
        ctx.shadowColor = p.c;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMove); };
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 250);
    const t2 = setTimeout(() => setPhase(2), 950);
    const t3 = setTimeout(() => setPhase(3), 1600);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  useEffect(() => {
    let idx = 0, text = '', typing = true, tid;
    function tick() {
      const target = TAGLINES[idx];
      if (typing) {
        if (text.length < target.length) { text += target[text.length]; setTagline(text); tid = setTimeout(tick, 44); }
        else { tid = setTimeout(() => { typing = false; tick(); }, 2500); }
      } else {
        if (text.length > 0) { text = text.slice(0, -1); setTagline(text); tid = setTimeout(tick, 18); }
        else { idx = (idx + 1) % TAGLINES.length; typing = true; tid = setTimeout(tick, 280); }
      }
    }
    tid = setTimeout(tick, 900);
    return () => clearTimeout(tid);
  }, []);

  function enter() { setExiting(true); setTimeout(onEnter, 700); }

  return (
    <div className={`landing${exiting ? ' exiting' : ''}`}>
      <div className="landing-bg" />
      <canvas ref={canvasRef} className="neural-canvas" />
      <div className="landing-content">
        <div className={`fu${phase >= 1 ? ' show' : ''}`} style={{ transitionDelay: '0ms' }}>
          <div className="landing-logo">Polymath OS</div>
          <div className="landing-logo-sub">capture first · level up · embrace the chaos</div>
        </div>
        <div className={`landing-tagline fu${phase >= 1 ? ' show' : ''}`} style={{ transitionDelay: '140ms' }}>
          {tagline}<span className="cursor">|</span>
        </div>
        <div className="landing-features">
          {FEATS.map((f, i) => (
            <div key={f.title} className={`feat-card${phase >= 2 ? ' show' : ''}`} style={{ transitionDelay: `${i * 110}ms` }}>
              <div className="feat-icon" style={{ color: f.color }}>{f.icon}</div>
              <div className="feat-title">{f.title}</div>
              <div className="feat-desc">{f.desc}</div>
            </div>
          ))}
        </div>
        <div className={`landing-cta fu${phase >= 3 ? ' show' : ''}`} style={{ transitionDelay: '0ms' }}>
          <button className="enter-btn" onClick={enter}>
            Enter the OS<span className="enter-arrow">→</span>
          </button>
          <div className="landing-note">No account needed · All data stays in your browser</div>
        </div>
      </div>
    </div>
  );
}
