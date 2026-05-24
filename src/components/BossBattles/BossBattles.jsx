import { useState, useEffect, useRef } from 'react';
import { DOMAIN_COLOR, DOMAINS } from '../../constants/index.js';

const DEFAULT_PHASES = [
  { name: 'Research & Prep',     xpReward: 50  },
  { name: 'First Real Attack',   xpReward: 80  },
  { name: 'Deep Work Assault',   xpReward: 120 },
  { name: 'Break Through',       xpReward: 150 },
  { name: 'Final Strike',        xpReward: 200 },
];

export default function BossBattles({ bosses, onAdd, onCompletePhase, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName]         = useState('');
  const [domain, setDomain]     = useState('Learning');
  const [phaseCount, setPhaseCount] = useState(3);
  const [defeated, setDefeated] = useState(null);

  const activeBosses  = bosses.filter(b => !b.defeated);
  const defeatedBosses = bosses.filter(b => b.defeated);

  function handleAdd() {
    if (!name.trim()) return;
    const phases = DEFAULT_PHASES.slice(0, phaseCount).map((p, i) => ({
      id: crypto.randomUUID(),
      name: p.name,
      xpReward: p.xpReward,
      done: false,
      index: i,
    }));
    onAdd({ name: name.trim(), domain, phases });
    setName(''); setShowForm(false);
  }

  function handlePhase(bossId, phaseId, e) {
    const boss = bosses.find(b => b.id === bossId);
    if (!boss) return;
    const isLastPhase = boss.phases.filter(p => !p.done).length === 1;
    onCompletePhase(bossId, phaseId, e);
    if (isLastPhase) {
      setDefeated(bossId);
      setTimeout(() => setDefeated(null), 3200);
    }
  }

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Boss Battles</h2>
        <button
          className="ghost"
          style={{ fontSize: 11, padding: '4px 10px' }}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕' : '+ New Boss'}
        </button>
      </div>

      {showForm && (
        <div className="boss-form">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="Name your nemesis… (e.g. Launch MVP)"
            autoFocus
          />
          <div className="boss-form-row">
            <select value={domain} onChange={e => setDomain(e.target.value)}>
              {DOMAINS.map(d => <option key={d}>{d}</option>)}
            </select>
            <select value={phaseCount} onChange={e => setPhaseCount(Number(e.target.value))}>
              {[3,4,5].map(n => <option key={n} value={n}>{n} phases</option>)}
            </select>
            <button className="primary" onClick={handleAdd} disabled={!name.trim()}>
              Summon
            </button>
          </div>
        </div>
      )}

      {bosses.length === 0 && !showForm && (
        <div className="empty" style={{ padding: '20px 0 8px' }}>
          No bosses yet. Summon an intimidating goal and fight it phase by phase.
        </div>
      )}

      <div className="boss-list">
        {activeBosses.map(boss => (
          <BossCard
            key={boss.id}
            boss={boss}
            isDefeating={defeated === boss.id}
            onPhase={handlePhase}
            onDelete={onDelete}
          />
        ))}

        {defeatedBosses.length > 0 && (
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>
              ⚔ {defeatedBosses.length} defeated
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

function BossCard({ boss, isDefeating, onPhase, onDelete }) {
  const [expanded, setExpanded] = useState(true);
  const color    = DOMAIN_COLOR[boss.domain] || '#00d9b1';
  const total    = boss.phases.length;
  const done     = boss.phases.filter(p => p.done).length;
  const hp       = Math.round(((total - done) / total) * 100);
  const hpColor  = hp > 60 ? '#f87171' : hp > 30 ? '#fbbf24' : '#4ade80';
  const nextPhase = boss.phases.find(p => !p.done);
  const totalXp  = boss.phases.reduce((s, p) => s + p.xpReward, 0);

  return (
    <div className={`boss-card${boss.defeated ? ' boss-defeated' : ''}${isDefeating ? ' boss-defeating' : ''}`} style={{ '--boss-color': color, '--hp-color': hpColor }}>
      {isDefeating && <DefeatedOverlay bossName={boss.name} />}

      <div className="boss-header" onClick={() => setExpanded(!expanded)}>
        <div className="boss-skull">⚔</div>
        <div className="boss-info">
          <div className="boss-name">{boss.name}</div>
          <div className="boss-domain-tag" style={{ color }}>{boss.domain}</div>
        </div>
        <div className="boss-header-right">
          {!boss.defeated && (
            <div className="boss-hp-mini">
              <span className="boss-hp-num" style={{ color: hpColor }}>{hp}%</span>
              <span className="boss-hp-label">HP</span>
            </div>
          )}
          {boss.defeated && <span className="boss-defeated-badge">DEFEATED</span>}
          <span className="ql-chevron">{expanded ? '▾' : '▸'}</span>
        </div>
      </div>

      {!boss.defeated && (
        <div className="boss-hp-bar-wrap">
          <div className="boss-hp-track">
            <div
              className="boss-hp-fill"
              style={{ width: `${hp}%`, background: hpColor, boxShadow: `0 0 12px ${hpColor}88` }}
            />
          </div>
          <span className="boss-hp-phases">{done}/{total} phases</span>
        </div>
      )}

      {expanded && (
        <div className="boss-phases">
          {boss.phases.map((phase, i) => {
            const isActive = !boss.defeated && phase.id === nextPhase?.id;
            return (
              <div key={phase.id} className={`boss-phase${phase.done ? ' done' : ''}${isActive ? ' active' : ''}`}>
                <button
                  className="boss-phase-check"
                  disabled={!isActive}
                  onClick={e => isActive && onPhase(boss.id, phase.id, e)}
                  style={{ '--pc': color }}
                >
                  {phase.done ? '✓' : isActive ? '○' : '–'}
                </button>
                <div className="boss-phase-info">
                  <span className="boss-phase-num">Phase {i + 1}</span>
                  <span className="boss-phase-name">{phase.name}</span>
                </div>
                <span className="boss-phase-xp">+{phase.xpReward}</span>
              </div>
            );
          })}
          <div style={{ padding: '6px 12px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>◆ {totalXp} XP total</span>
            <button className="ghost" style={{ fontSize: 11, color: 'var(--muted)', padding: '3px 8px' }} onClick={() => onDelete(boss.id)}>
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DefeatedOverlay({ bossName }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = Array.from({ length: 60 }, () => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.8) * 8,
      r: Math.random() * 4 + 1,
      color: ['#fbbf24','#f87171','#00d9b1','#a78bfa','#fb923c'][Math.floor(Math.random() * 5)],
      life: 1,
    }));

    let raf;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.18; p.life -= 0.018;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      if (particles.some(p => p.life > 0)) raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="boss-defeat-overlay">
      <canvas ref={canvasRef} className="boss-defeat-canvas" />
      <div className="boss-defeat-text">
        <span className="boss-defeat-icon">⚔</span>
        <span className="boss-defeat-label">DEFEATED</span>
        <span className="boss-defeat-name">{bossName}</span>
      </div>
    </div>
  );
}
