import { useState, useEffect, useRef, useMemo } from 'react';
import { FOCUS_PRESETS } from '../../constants/index.js';
import AntiTimer from './AntiTimer.jsx';
import LootDrop from './LootDrop.jsx';

function hexToRgba(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

function relTime(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? 'yesterday' : `${d}d ago`;
}

// ── CONSTANTS ──────────────────────────────────────────────────────────────

const FLOW_ZONES = [
  { key: 'idle',  label: 'IDLE',    min: 0,  color: '#6b7280' },
  { key: 'warm',  label: 'WARM',    min: 8,  color: '#f59e0b' },
  { key: 'zone',  label: 'ZONE',    min: 18, color: '#60a5fa' },
  { key: 'flow',  label: 'FLOW',    min: 30, color: '#a78bfa' },
  { key: 'ultra', label: 'ULTRA',   min: 45, color: null      },
];
const ZONE_MAX = 50;

// ── IDENTITY MODE SELECTOR ──────────────────────────────────────────────────

function IdentityModeSelector({ modes, selected, onSelect, disabled, editMode, onDelete }) {
  return (
    <div className="identity-modes">
      {modes.map(m => (
        <div key={m.id} className="mode-card-wrap">
          <button
            className={`mode-card${selected?.id === m.id ? ' active' : ''}`}
            style={{ '--mode-color': m.color, '--mode-glow': m.glow }}
            onClick={() => !disabled && !editMode && onSelect(m)}
            disabled={disabled && !editMode}
            title={`${m.label} · ${m.xpMult}× XP`}
          >
            <span className="mode-card-icon">{m.icon}</span>
            <span className="mode-card-name">{m.label.split(' ')[0]}</span>
            <span className="mode-card-mult">{m.xpMult}×</span>
          </button>
          {editMode && (
            <button
              className="mode-delete-btn"
              onClick={() => onDelete(m.id)}
              disabled={modes.length <= 1}
              title="Remove mode"
            >×</button>
          )}
        </div>
      ))}
    </div>
  );
}

// ── FLOW DEPTH GAUGE ────────────────────────────────────────────────────────

function FlowDepthGauge({ elapsedMin, modeColor, running, pauseCount }) {
  const zoneIdx = FLOW_ZONES.reduce((acc, z, i) => elapsedMin >= z.min ? i : acc, 0);
  const zone    = FLOW_ZONES[zoneIdx];
  const zCol    = zone.color || modeColor;
  const fillPct = Math.min(1, elapsedMin / ZONE_MAX);
  const xpBonus = zoneIdx >= 4 ? '2.0×' : zoneIdx >= 3 ? '1.5×' : zoneIdx >= 2 ? '1.2×' : null;

  return (
    <div className={`flow-gauge${running ? ' flow-gauge-active' : ''}`}>
      <div className="flow-gauge-header">
        <span className="flow-gauge-zone" style={{ color: zCol }}>◈ {zone.label}</span>
        <div className="flow-gauge-meta">
          {running && <span className="flow-gauge-time">{Math.floor(elapsedMin)}m in</span>}
          {pauseCount > 0 && <span className="flow-gauge-pauses">⏸ {pauseCount}</span>}
          {xpBonus && running && (
            <span className="flow-gauge-bonus" style={{ color: zCol }}>{xpBonus} XP</span>
          )}
        </div>
      </div>
      <div className="flow-gauge-track">
        <div
          className="flow-gauge-fill"
          style={{
            width: `${fillPct * 100}%`,
            background: `linear-gradient(90deg, #6b728055 0%, ${zCol} 100%)`,
            boxShadow: running && fillPct > 0 ? `0 0 10px ${zCol}55` : 'none',
          }}
        />
        {FLOW_ZONES.slice(1).map(z => (
          <div
            key={z.key}
            className={`flow-gauge-marker${elapsedMin >= z.min ? ' passed' : ''}`}
            style={{
              left: `${(z.min / ZONE_MAX) * 100}%`,
              background: elapsedMin >= z.min ? (z.color || modeColor) : 'var(--border-h)',
            }}
          />
        ))}
      </div>
      <div className="flow-gauge-zones">
        {FLOW_ZONES.map((z, i) => (
          <span
            key={z.key}
            className={`fgz-label${i === zoneIdx ? ' active' : ''}${i < zoneIdx ? ' passed' : ''}`}
            style={i === zoneIdx ? { color: zCol } : {}}
          >{z.label}</span>
        ))}
      </div>
    </div>
  );
}

// ── SESSION QUICK CAPTURE ───────────────────────────────────────────────────

function SessionCapture({ running, submitThought, groqKey }) {
  const [text, setText]       = useState('');
  const [captured, setCaptured] = useState([]);

  if (!running) return null;

  function handle() {
    const t = text.trim();
    if (!t) return;
    if (submitThought) submitThought(t, groqKey || '');
    setCaptured(prev => [{ id: crypto.randomUUID(), text: t }, ...prev].slice(0, 4));
    setText('');
  }

  return (
    <div className="session-capture">
      <div className="sc-label">💭 capture without breaking flow</div>
      <div className="sc-row">
        <input
          className="sc-input"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handle(); } }}
          placeholder="idea, question, anything…"
        />
        <button className="sc-btn" onClick={handle} disabled={!text.trim()}>+</button>
      </div>
      {captured.length > 0 && (
        <div className="sc-chips">
          {captured.map(c => (
            <span key={c.id} className="sc-chip">
              {c.text.length > 48 ? c.text.slice(0, 48) + '…' : c.text}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── INTENT LOCK ─────────────────────────────────────────────────────────────

function IntentRating({ intent, onRate }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="intent-rate">
      <div className="intent-rate-q">How well did you execute?</div>
      <div className="intent-rate-intent">"{intent}"</div>
      <div className="intent-rate-stars">
        {[1, 2, 3, 4, 5].map(s => (
          <button
            key={s}
            className={`irate-star${s <= hover ? ' lit' : ''}`}
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onRate(s)}
          >★</button>
        ))}
      </div>
    </div>
  );
}

// ── LIVE SESSION PANEL ───────────────────────────────────────────────────────

function LiveSessionPanel({ elapsedFocusSec, elapsedMin, modeColor, identityMode }) {
  const m    = Math.floor(elapsedFocusSec / 60);
  const s    = elapsedFocusSec % 60;
  const zone = FLOW_ZONES.reduce((acc, z) => elapsedMin >= z.min ? z : acc, FLOW_ZONES[0]);
  const zCol = zone.color || modeColor;
  const bonus = zone.key === 'ultra' ? '2.0×' : zone.key === 'flow' ? '1.5×' : zone.key === 'zone' ? '1.2×' : null;

  return (
    <div className="live-session-panel" style={{ '--mc': modeColor, '--zc': zCol }}>
      <div className="lsp-header">
        <span className="lsp-dot" />
        <span className="lsp-title">SESSION ACTIVE</span>
      </div>
      <div className="lsp-time">
        {String(m).padStart(2,'0')}:{String(s).padStart(2,'0')}
      </div>
      <div className="lsp-zone" style={{ color: zCol }}>◈ {zone.label}</div>
      {bonus && (
        <div className="lsp-bonus">
          <span className="lsp-bonus-val" style={{ color: zCol }}>{bonus}</span>
          <span className="lsp-bonus-lbl">FLOW BONUS</span>
        </div>
      )}
      <div className="lsp-mode-row">
        <span style={{ color: modeColor }}>{identityMode?.icon}</span>
        <span className="lsp-mode-name">{identityMode?.label?.split(' ')[0] || 'FOCUS'}</span>
        <span className="lsp-mode-mult" style={{ color: modeColor }}>{identityMode?.xpMult}× XP</span>
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ──────────────────────────────────────────────────────────

export default function FocusTimer({
  actDomain, setActDomain, domains, timer, sessions,
  identityModes, addIdentityMode, deleteIdentityMode,
  addDomain, deleteDomain,
  submitThought, groqKey,
  projects, actProject, setActProject,
}) {
  const {
    mode, running, remaining, totalSec,
    focusMinutes, identityMode,
    lootPending, clearLoot,
    pauseCount, elapsedFocusSec,
    setIdentityMode, toggleRunning, reset, forceFinish,
    adjustFocus, selectPreset,
  } = timer;

  const [editMode,  setEditMode]  = useState(false);
  const [form,      setForm]      = useState({ icon: '', name: '', xpMult: '1.2', color: '#00d9b1', desc: '' });
  const [formErr,   setFormErr]   = useState('');
  const [newDomain, setNewDomain] = useState('');
  const [domainErr, setDomainErr] = useState('');

  // Intent state
  const [intent,       setIntent]       = useState('');
  const [intentLocked, setIntentLocked] = useState(false);
  const [intentRated,  setIntentRated]  = useState(false);
  const [sessionDone,  setSessionDone]  = useState(false);

  // Void state
  const [voidDismissed, setVoidDismissed] = useState(false);

  // Session end detection
  const prevRunningRef = useRef(running);
  const prevModeRef    = useRef(mode);
  useEffect(() => {
    const wasRunning = prevRunningRef.current;
    const wasMode    = prevModeRef.current;
    prevRunningRef.current = running;
    prevModeRef.current    = mode;

    if (wasRunning && !running && wasMode === 'focus') {
      if (intentLocked) setSessionDone(true);
    }
    if (running) {
      setSessionDone(false);
      setVoidDismissed(false);
    }
  }, [running, mode]);

  // Effect cleanup so intentLocked is current inside the closure
  useEffect(() => {}, [intentLocked]);

  const elapsedMin = elapsedFocusSec / 60;
  const voidLevel  = running && !voidDismissed
    ? (elapsedMin >= 40 ? 2 : elapsedMin >= 25 ? 1 : 0)
    : 0;

  const today     = new Date().toISOString().split('T')[0];
  const todaySess = sessions.filter(s => s.at?.startsWith(today));
  const totalMin  = todaySess.reduce((s, x) => s + (x.minutes || 0), 0);
  const xpEarned  = todaySess.reduce((s, x) => s + (x.xpEarned || 15), 0);
  const modeColor = identityMode?.color || '#00d9b1';
  const modeId    = identityMode?.id    || 'builder';

  const sectionStyle = {
    '--mode-color':  modeColor,
    '--mode-glow':   identityMode?.glow   || 'rgba(0,217,177,0.35)',
    '--mode-bg':     identityMode?.bg     || 'rgba(0,217,177,0.06)',
    '--mode-border': identityMode?.border || 'rgba(0,217,177,0.22)',
  };

  function handleAddMode() {
    if (!form.name.trim()) { setFormErr('Name required'); return; }
    if (!form.icon.trim()) { setFormErr('Icon required'); return; }
    const mult = parseFloat(form.xpMult);
    if (isNaN(mult) || mult < 0.5 || mult > 5) { setFormErr('XP mult 0.5–5'); return; }
    addIdentityMode({
      id: crypto.randomUUID(),
      label: form.name.trim(),
      icon: form.icon.trim(),
      color: form.color,
      glow: hexToRgba(form.color, 0.35),
      bg:   hexToRgba(form.color, 0.06),
      border: hexToRgba(form.color, 0.22),
      desc: form.desc.trim() || 'Custom mode',
      xpMult: mult,
      custom: true,
    });
    setForm({ icon: '', name: '', xpMult: '1.2', color: '#00d9b1', desc: '' });
    setFormErr('');
  }

  function handleAddDomain() {
    const trimmed = newDomain.trim();
    if (!trimmed) { setDomainErr('Name required'); return; }
    if (domains.find(d => d.name.toLowerCase() === trimmed.toLowerCase())) {
      setDomainErr('Already exists'); return;
    }
    addDomain(trimmed);
    setNewDomain('');
    setDomainErr('');
  }

  function handleReset() {
    reset();
    setIntentLocked(false);
    setIntent('');
    setIntentRated(false);
    setSessionDone(false);
  }

  const envClass = identityMode?.custom ? 'env-custom' : `env-${modeId}`;

  return (
    <>
      <div className={`focus-env-layer ${envClass}${running ? ' env-active' : ''}`} />

      {voidLevel > 0 && (
        <button className="void-restore-btn" onClick={() => setVoidDismissed(true)}>
          ◎ EXIT VOID
        </button>
      )}

      <div className="focus-layout">

        {/* ── LEFT / MAIN PANEL ── */}
        <section
          className={`panel timer-section${running ? ' mode-active' : ''}${voidLevel === 2 ? ' void-2' : voidLevel === 1 ? ' void-1' : ''}`}
          style={sectionStyle}
          data-mode={modeId}
        >
          {/* Header */}
          <div className="panel-head">
            <h2>Focus Timer</h2>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button
                className={`icon ghost mode-edit-toggle${editMode ? ' active' : ''}`}
                onClick={() => { setEditMode(e => !e); setFormErr(''); }}
                title={editMode ? 'Done' : 'Customize modes'}
                disabled={running}
              >
                {editMode ? '✓' : '⊕'}
              </button>
              <select value={actDomain} onChange={e => setActDomain(e.target.value)} style={{ width: 108, fontSize: 11 }}>
                {domains.map(d => <option key={d.name}>{d.name}</option>)}
              </select>
              {projects?.length > 0 && (
                <select
                  value={actProject || ''}
                  onChange={e => setActProject?.(e.target.value || null)}
                  disabled={running}
                  className="focus-project-sel"
                  title="Link session to a project"
                >
                  <option value="">no project</option>
                  {projects.filter(p => p.status !== 'completed').map(p => (
                    <option key={p.id} value={p.id}>{p.name.length > 18 ? p.name.slice(0, 18) + '…' : p.name}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Mode cards */}
          <IdentityModeSelector
            modes={identityModes}
            selected={identityMode}
            onSelect={setIdentityMode}
            disabled={running}
            editMode={editMode}
            onDelete={deleteIdentityMode}
          />

          {/* Mode customization form */}
          {editMode && (
            <div className="add-mode-form">
              <div className="amf-row">
                <input className="amf-icon" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="⚡" maxLength={2} />
                <input className="amf-name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Mode name" maxLength={16} />
                <input type="number" className="amf-mult" value={form.xpMult} onChange={e => setForm(f => ({ ...f, xpMult: e.target.value }))} min="0.5" max="5" step="0.1" title="XP multiplier" />
                <span className="amf-mult-label">×XP</span>
                <input type="color" className="amf-color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} title="Mode color" />
              </div>
              <div className="amf-row">
                <input className="amf-desc" value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder="Short description (optional)" maxLength={32} />
                <button className="primary amf-save" onClick={handleAddMode}>Add Mode</button>
              </div>
              {formErr && <span className="amf-err">{formErr}</span>}
              <div className="amf-divider" />
              <div className="amf-section">Domains</div>
              <div className="amf-domain-list">
                {domains.map(d => (
                  <div key={d.name} className="amf-domain-chip">
                    <span>{d.name}</span>
                    <button className="amf-domain-del"
                      onClick={() => { if (d.name === actDomain) setActDomain(domains.find(x => x.name !== d.name)?.name || d.name); deleteDomain(d.name); }}
                      disabled={domains.length <= 1} title="Remove domain">×</button>
                  </div>
                ))}
              </div>
              <div className="amf-row">
                <input className="amf-name" value={newDomain} onChange={e => setNewDomain(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddDomain()} placeholder="New domain name" maxLength={20} />
                <button className="primary amf-save" onClick={handleAddDomain}>Add</button>
              </div>
              {domainErr && <span className="amf-err">{domainErr}</span>}
            </div>
          )}

          {/* Intent rating (post-session) */}
          {sessionDone && intentLocked && !intentRated && (
            <IntentRating intent={intent} onRate={s => { setIntentRated(true); setSessionDone(false); }} />
          )}

          {/* Intent lock input (pre-session, not locked) */}
          {!running && !intentLocked && !editMode && (
            <div className="intent-lock-wrap">
              <input
                className="intent-input"
                value={intent}
                onChange={e => setIntent(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && intent.trim() && setIntentLocked(true)}
                placeholder="What will you build this session? (optional)"
                maxLength={80}
              />
              {intent.trim() && (
                <button className="intent-lock-btn" onClick={() => setIntentLocked(true)}>
                  Lock In →
                </button>
              )}
            </div>
          )}

          {/* Intent banner (locked in, before OR during session) */}
          {intentLocked && !sessionDone && (
            <div className={`intent-banner${running ? ' intent-banner-active' : ''}`} style={{ '--ic': modeColor }}>
              <span className="intent-banner-eye">◎</span>
              <span className="intent-banner-text">{intent}</span>
              {!running && (
                <button className="intent-clear-btn" onClick={() => { setIntentLocked(false); setIntent(''); }}>✕</button>
              )}
            </div>
          )}

          {/* Mode banner (pre-session, not locked in) */}
          {identityMode && !editMode && !running && !intentLocked && (
            <div className="mode-banner" style={{ '--mode-color': modeColor, '--mode-bg': identityMode.bg, '--mode-border': identityMode.border }}>
              <span className="mode-banner-icon">{identityMode.icon}</span>
              <div className="mode-banner-text">
                <div className="mode-banner-name">{identityMode.label}</div>
                <div className="mode-banner-desc">{identityMode.desc}</div>
              </div>
              <span className="mode-banner-mult">{identityMode.xpMult}× XP</span>
            </div>
          )}

          {/* Compact mode indicator during session */}
          {identityMode && running && (
            <div className="mode-compact" style={{ '--mc': modeColor }}>
              <span className="mc-icon">{identityMode.icon}</span>
              <span className="mc-label">{identityMode.label.split(' ')[0]}</span>
              <span className="mc-mult">{identityMode.xpMult}× XP</span>
            </div>
          )}

          {/* Time presets */}
          <div className="timer-presets">
            {FOCUS_PRESETS.map(m => (
              <button key={m} className={`t-preset${focusMinutes === m ? ' active' : ''}`}
                disabled={running} onClick={() => selectPreset(m)}>{m}m</button>
            ))}
          </div>

          {/* 3D point-cloud timer */}
          <AntiTimer
            remaining={remaining}
            totalSeconds={totalSec}
            modeColor={modeColor}
            running={running}
            mode={mode}
          />

          {/* Flow Depth Gauge */}
          <FlowDepthGauge
            elapsedMin={elapsedMin}
            modeColor={modeColor}
            running={running}
            pauseCount={pauseCount}
          />

          {/* Duration adjust */}
          <div className="timer-adjust">
            <button className="adj-btn ghost" disabled={running || focusMinutes <= 5} onClick={() => adjustFocus(-5)}>−</button>
            <span className="timer-adj-lbl">{focusMinutes} min</span>
            <button className="adj-btn ghost" disabled={running || focusMinutes >= 90} onClick={() => adjustFocus(5)}>+</button>
          </div>

          {/* Controls */}
          <div className="timer-controls">
            <button
              className={`primary${running ? ' timer-btn-running' : ''}`}
              style={{
                background: `linear-gradient(135deg, ${modeColor}, ${modeColor}cc)`,
                borderColor: modeColor,
                boxShadow: `0 0 24px ${identityMode?.glow || 'rgba(0,217,177,0.35)'}`,
                '--mc': modeColor,
              }}
              onClick={toggleRunning}
            >
              {running ? '⏸ Pause' : '▶ Start'}
            </button>
            <button onClick={forceFinish}>Finish</button>
            <button className="icon ghost" title="Reset" onClick={handleReset}>↺</button>
          </div>

          {/* In-session thought capture */}
          <SessionCapture running={running} submitThought={submitThought} groqKey={groqKey} />

          {/* Today stats */}
          <div className="focus-log">
            <div className="fl-item"><span className="fl-val">{todaySess.length}</span><span className="fl-lbl">sessions</span></div>
            <div className="fl-div" />
            <div className="fl-item"><span className="fl-val">{totalMin}</span><span className="fl-lbl">min today</span></div>
            <div className="fl-div" />
            <div className="fl-item"><span className="fl-val" style={{ color: modeColor }}>+{xpEarned}</span><span className="fl-lbl">XP today</span></div>
          </div>

          {/* Session history */}
          {sessions.length > 0 && (
            <>
              <div className="session-log-header">Session Log</div>
              <div className="session-log">
                {sessions.slice(0, 25).map(s => {
                  const mData  = identityModes.find(m => m.id === s.identityMode);
                  const mCol   = mData?.color || '#6b7280';
                  const mIcon  = mData?.icon  || '◉';
                  const mLabel = mData ? mData.label.split(' ')[0] : (s.identityMode || '—');
                  return (
                    <div key={s.id} className="session-item">
                      <span className="si-mode" style={{ color: mCol }}>{mIcon}</span>
                      <span className="si-label" style={{ color: mCol }}>{mLabel}</span>
                      <span className="si-domain">{s.domain}</span>
                      <span className="si-dur">{s.minutes}m</span>
                      <span className="si-xp" style={{ color: mCol }}>+{s.xpEarned || 15} XP</span>
                      <span className="si-time">{relTime(s.at)}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </section>

        {/* ── RIGHT COLUMN — live panel only when session is running ── */}
        {running && (
          <div className="focus-right-col">
            <LiveSessionPanel
              elapsedFocusSec={elapsedFocusSec}
              elapsedMin={elapsedMin}
              modeColor={modeColor}
              identityMode={identityMode}
            />
          </div>
        )}

      </div>

      {lootPending && (
        <LootDrop
          sessionMinutes={focusMinutes}
          xpMult={identityMode?.xpMult || 1}
          modeLabel={identityMode?.label}
          modeColor={modeColor}
          onClose={clearLoot}
        />
      )}
    </>
  );
}
