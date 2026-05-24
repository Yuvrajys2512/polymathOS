import { FOCUS_PRESETS, IDENTITY_MODES } from '../../constants/index.js';
import { fmt } from '../../utils/game.js';

function TimerFace({ remaining, totalSeconds, mode, running, modeColor }) {
  const r = 72, circ = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, (totalSeconds - remaining) / totalSeconds));
  const angle = pct * 2 * Math.PI - Math.PI / 2;
  const dotX = 90 + r * Math.cos(angle);
  const dotY = 90 + r * Math.sin(angle);
  const strokeColor = mode === 'focus' ? modeColor : '#8b5cf6';

  return (
    <div className={`timer-wrap${running ? ' running' : ''}`} style={{ '--mode-glow': `${strokeColor}60` }}>
      <svg viewBox="0 0 180 180">
        <circle cx="90" cy="90" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
        <circle cx="90" cy="90" r={r} fill="none" stroke={strokeColor} strokeWidth="5" strokeLinecap="round"
          style={{
            strokeDasharray: circ,
            strokeDashoffset: circ * (1 - pct),
            filter: `drop-shadow(0 0 ${running ? 12 : 6}px ${strokeColor})`,
            transition: 'stroke-dashoffset 0.95s linear, stroke 0.5s ease, filter 0.4s ease',
          }} />
        {running && pct > 0 && (
          <circle cx={dotX} cy={dotY} r="5" fill={strokeColor}
            style={{ filter: `drop-shadow(0 0 10px ${strokeColor}) drop-shadow(0 0 20px ${strokeColor})` }} />
        )}
      </svg>
      <div className="timer-overlay">
        <div className={`timer-digits${running ? ' running' : ''}`}
          style={{ '--mode-color': strokeColor }}>{fmt(remaining)}</div>
        <div className="timer-mode-lbl">{mode}</div>
      </div>
    </div>
  );
}

function IdentityModeSelector({ selected, onSelect, disabled }) {
  return (
    <div className="identity-modes">
      {IDENTITY_MODES.map(m => (
        <button
          key={m.id}
          className={`mode-card${selected?.id === m.id ? ' active' : ''}`}
          style={{ '--mode-color': m.color, '--mode-glow': m.glow }}
          onClick={() => !disabled && onSelect(m)}
          disabled={disabled}
          title={`${m.label} · ${m.xpMult}× XP`}
        >
          <span className="mode-card-icon">{m.icon}</span>
          <span className="mode-card-name">{m.label.split(' ')[0]}</span>
          <span className="mode-card-mult">{m.xpMult}×</span>
        </button>
      ))}
    </div>
  );
}

export default function FocusTimer({
  actDomain, setActDomain, domains,
  timer,
  sessions,
}) {
  const {
    mode, running, remaining, totalSec,
    focusMinutes, identityMode,
    setIdentityMode, toggleRunning, reset, forceFinish,
    adjustFocus, selectPreset,
  } = timer;

  const today = new Date().toISOString().split('T')[0];
  const todaySess = sessions.filter(s => s.at?.startsWith(today));
  const totalMin  = todaySess.reduce((s, x) => s + (x.minutes || 0), 0);
  const xpEarned  = todaySess.reduce((s, x) => s + (x.xpEarned || 15), 0);

  const modeColor = identityMode?.color || '#00d9b1';

  const sectionStyle = {
    '--mode-color':  modeColor,
    '--mode-glow':   identityMode?.glow  || 'rgba(0,217,177,0.35)',
    '--mode-bg':     identityMode?.bg    || 'rgba(0,217,177,0.06)',
    '--mode-border': identityMode?.border || 'rgba(0,217,177,0.22)',
  };

  return (
    <section className={`panel timer-section${running ? ' mode-active' : ''}`} style={sectionStyle}>
      <div className="panel-head">
        <h2>Focus Timer</h2>
        <select
          value={actDomain}
          onChange={e => setActDomain(e.target.value)}
          style={{ width: 108, fontSize: 11 }}
        >
          {domains.map(d => <option key={d.name}>{d.name}</option>)}
        </select>
      </div>

      {/* Identity Mode Selector */}
      <IdentityModeSelector selected={identityMode} onSelect={setIdentityMode} disabled={running} />

      {/* Active mode banner */}
      {identityMode && (
        <div className="mode-banner" style={{
          '--mode-color': modeColor,
          '--mode-bg': identityMode.bg,
          '--mode-border': identityMode.border,
        }}>
          <span className="mode-banner-icon">{identityMode.icon}</span>
          <div className="mode-banner-text">
            <div className="mode-banner-name">{identityMode.label}</div>
            <div className="mode-banner-desc">{identityMode.desc}</div>
          </div>
          <span className="mode-banner-mult">{identityMode.xpMult}× XP</span>
        </div>
      )}

      {/* Presets */}
      <div className="timer-presets">
        {FOCUS_PRESETS.map(m => (
          <button key={m}
            className={`t-preset${focusMinutes === m ? ' active' : ''}`}
            disabled={running}
            onClick={() => selectPreset(m)}
          >{m}m</button>
        ))}
      </div>

      {/* Timer face */}
      <TimerFace
        remaining={remaining}
        totalSeconds={totalSec}
        mode={mode}
        running={running}
        modeColor={modeColor}
      />

      {/* Adjust */}
      <div className="timer-adjust">
        <button className="adj-btn ghost" disabled={running || focusMinutes <= 5} onClick={() => adjustFocus(-5)}>−</button>
        <span className="timer-adj-lbl">{focusMinutes} min</span>
        <button className="adj-btn ghost" disabled={running || focusMinutes >= 90} onClick={() => adjustFocus(5)}>+</button>
      </div>

      {/* Controls */}
      <div className="timer-controls">
        <button
          className="primary"
          style={{ background: `linear-gradient(135deg, ${modeColor}, ${modeColor}cc)`, borderColor: modeColor, boxShadow: `0 0 24px ${identityMode?.glow || 'rgba(0,217,177,0.35)'}` }}
          onClick={toggleRunning}
        >
          {running ? '⏸ Pause' : '▶ Start'}
        </button>
        <button onClick={forceFinish}>Finish</button>
        <button className="icon ghost" title="Reset" onClick={reset}>↺</button>
      </div>

      {/* Focus log */}
      <div className="focus-log">
        <div className="fl-item">
          <span className="fl-val">{todaySess.length}</span>
          <span className="fl-lbl">sessions</span>
        </div>
        <div className="fl-div" />
        <div className="fl-item">
          <span className="fl-val">{totalMin}</span>
          <span className="fl-lbl">min today</span>
        </div>
        <div className="fl-div" />
        <div className="fl-item">
          <span className="fl-val" style={{ color: modeColor }}>+{xpEarned}</span>
          <span className="fl-lbl">XP today</span>
        </div>
      </div>
    </section>
  );
}
