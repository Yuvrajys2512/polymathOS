import { useState, useEffect } from 'react';
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

export default function FocusTimer({ actDomain, setActDomain, domains, timer, sessions, identityModes, addIdentityMode, deleteIdentityMode, addDomain, deleteDomain }) {
  const {
    mode, running, remaining, totalSec,
    focusMinutes, identityMode,
    lootPending, clearLoot,
    setIdentityMode, toggleRunning, reset, forceFinish,
    adjustFocus, selectPreset,
  } = timer;

  const [editMode, setEditMode]   = useState(false);
  const [form, setForm]           = useState({ icon: '', name: '', xpMult: '1.2', color: '#00d9b1', desc: '' });
  const [formErr, setFormErr]     = useState('');
  const [newDomain, setNewDomain] = useState('');
  const [domainErr, setDomainErr] = useState('');

  // If selected mode was deleted, fall back to first available
  useEffect(() => {
    if (identityModes.length > 0 && !identityModes.find(m => m.id === identityMode?.id)) {
      setIdentityMode(identityModes[0]);
    }
  }, [identityModes]);

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
      bg: hexToRgba(form.color, 0.06),
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

  const envClass = identityMode?.custom ? 'env-custom' : `env-${modeId}`;

  return (
    <>
      <div className={`focus-env-layer ${envClass}${running ? ' env-active' : ''}`} />

      <section
        className={`panel timer-section${running ? ' mode-active' : ''}`}
        style={sectionStyle}
        data-mode={modeId}
      >
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
          </div>
        </div>

        <IdentityModeSelector
          modes={identityModes}
          selected={identityMode}
          onSelect={setIdentityMode}
          disabled={running}
          editMode={editMode}
          onDelete={deleteIdentityMode}
        />

        {editMode && (
          <div className="add-mode-form">
            <div className="amf-row">
              <input
                className="amf-icon"
                value={form.icon}
                onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                placeholder="⚡"
                maxLength={2}
              />
              <input
                className="amf-name"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Mode name"
                maxLength={16}
              />
              <input
                type="number"
                className="amf-mult"
                value={form.xpMult}
                onChange={e => setForm(f => ({ ...f, xpMult: e.target.value }))}
                min="0.5" max="5" step="0.1"
                title="XP multiplier"
              />
              <span className="amf-mult-label">×XP</span>
              <input
                type="color"
                className="amf-color"
                value={form.color}
                onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                title="Mode color"
              />
            </div>
            <div className="amf-row">
              <input
                className="amf-desc"
                value={form.desc}
                onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
                placeholder="Short description (optional)"
                maxLength={32}
              />
              <button className="primary amf-save" onClick={handleAddMode}>Add Mode</button>
            </div>
            {formErr && <span className="amf-err">{formErr}</span>}

            <div className="amf-divider" />
            <div className="amf-section">Domains</div>
            <div className="amf-domain-list">
              {domains.map(d => (
                <div key={d.name} className="amf-domain-chip">
                  <span>{d.name}</span>
                  <button
                    className="amf-domain-del"
                    onClick={() => { if (d.name === actDomain) setActDomain(domains.find(x => x.name !== d.name)?.name || d.name); deleteDomain(d.name); }}
                    disabled={domains.length <= 1}
                    title="Remove domain"
                  >×</button>
                </div>
              ))}
            </div>
            <div className="amf-row">
              <input
                className="amf-name"
                value={newDomain}
                onChange={e => setNewDomain(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddDomain()}
                placeholder="New domain name"
                maxLength={20}
              />
              <button className="primary amf-save" onClick={handleAddDomain}>Add</button>
            </div>
            {domainErr && <span className="amf-err">{domainErr}</span>}
          </div>
        )}

        {identityMode && !editMode && (
          <div className="mode-banner" style={{ '--mode-color': modeColor, '--mode-bg': identityMode.bg, '--mode-border': identityMode.border }}>
            <span className="mode-banner-icon">{identityMode.icon}</span>
            <div className="mode-banner-text">
              <div className="mode-banner-name">{identityMode.label}</div>
              <div className="mode-banner-desc">{identityMode.desc}</div>
            </div>
            <span className="mode-banner-mult">{identityMode.xpMult}× XP</span>
          </div>
        )}

        <div className="timer-presets">
          {FOCUS_PRESETS.map(m => (
            <button key={m} className={`t-preset${focusMinutes === m ? ' active' : ''}`}
              disabled={running} onClick={() => selectPreset(m)}>{m}m</button>
          ))}
        </div>

        <AntiTimer
          remaining={remaining}
          totalSeconds={totalSec}
          modeColor={modeColor}
          running={running}
          mode={mode}
        />

        <div className="timer-adjust">
          <button className="adj-btn ghost" disabled={running || focusMinutes <= 5} onClick={() => adjustFocus(-5)}>−</button>
          <span className="timer-adj-lbl">{focusMinutes} min</span>
          <button className="adj-btn ghost" disabled={running || focusMinutes >= 90} onClick={() => adjustFocus(5)}>+</button>
        </div>

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

        <div className="focus-log">
          <div className="fl-item"><span className="fl-val">{todaySess.length}</span><span className="fl-lbl">sessions</span></div>
          <div className="fl-div" />
          <div className="fl-item"><span className="fl-val">{totalMin}</span><span className="fl-lbl">min today</span></div>
          <div className="fl-div" />
          <div className="fl-item"><span className="fl-val" style={{ color: modeColor }}>+{xpEarned}</span><span className="fl-lbl">XP today</span></div>
        </div>

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
