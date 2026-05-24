import { TYPE_OPTS, PRIORITY_OPTS } from '../constants/index.js';

export default function TopBar({ search, setSearch, typeF, setTypeF, priF, setPriF, onCaptureRef, onChaos, onBrainMap, onForge }) {
  return (
    <header className="topbar">
      <div>
        <div className="brand-logo">Polymath OS</div>
        <div className="brand-sub">capture first · level up · embrace the chaos</div>
      </div>
      <div className="topbar-center">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search thoughts, tags, insights…"
        />
        <select value={typeF} onChange={e => setTypeF(e.target.value)}>
          {TYPE_OPTS.map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={priF} onChange={e => setPriF(e.target.value)}>
          {PRIORITY_OPTS.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>
      <div className="topbar-right">
        <button
          className="ghost"
          style={{ fontSize: 12, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 8 }}
          onClick={onCaptureRef}
        >
          Quick capture <span className="kbd">/</span>
        </button>
        <button className="forge-topbar-btn" onClick={onForge}>
          ✦ Forge
        </button>
        <button className="brain-map-btn" onClick={onBrainMap}>
          ◈ Brain Map
        </button>
        <button className="chaos-trigger" onClick={onChaos}>
          ⚡ Overwhelmed
        </button>
      </div>
    </header>
  );
}
