import { useState } from 'react';
import Oracle from '../components/Oracle/Oracle.jsx';
import ConsciousnessTimeline from '../components/ConsciousnessTimeline/ConsciousnessTimeline.jsx';
import DNAHelix from '../components/DNAHelix/DNAHelix.jsx';
import Workbench from '../components/Workbench/Workbench.jsx';
import Lab from '../components/Lab/Lab.jsx';
import Expedition from '../components/Expedition/Expedition.jsx';
import Council from '../components/Council/Council.jsx';

const TABS = [
  { id: 'oracle',    icon: '◉', label: 'ORACLE'    },
  { id: 'timeline',  icon: '∿', label: 'TIMELINE'  },
  { id: 'dna',       icon: '⌬', label: 'DNA'       },
  { id: 'workbench', icon: '⊞', label: 'WORKBENCH' },
  { id: 'lab',       icon: '⏣', label: 'LAB'       },
  { id: 'expedition',icon: '⟁', label: 'EXPEDITION'},
  { id: 'council',   icon: '⊜', label: 'COUNCIL'   },
  { id: 'memento',   icon: '◌', label: 'MEMENTO'   },
];

// ── Memento Mori ─────────────────────────────────────────────────────────────

function MementoMori({ mementoMori, setMementoMori, totalCaptures }) {
  const { enabled, birthDate } = mementoMori || {};

  if (!enabled) {
    return (
      <div className="memento-gate">
        <div className="memento-gate-icon">◌</div>
        <div className="memento-gate-title">MEMENTO MORI</div>
        <div className="memento-gate-body">
          "Remember you will die."<br />
          Not morbid — liberating. Your time is finite and your curiosity is real.
          Staring at the number forces you to spend it well.
        </div>
        <button className="primary" onClick={() => setMementoMori({ enabled: true })}>
          Activate
        </button>
      </div>
    );
  }

  if (!birthDate) {
    return (
      <div className="memento-setup">
        <div className="memento-setup-title">When were you born?</div>
        <div className="memento-setup-sub">Stored only in your browser. Never transmitted.</div>
        <input
          type="date"
          className="memento-date-input"
          onChange={e => setMementoMori({ birthDate: e.target.value })}
        />
        <button
          className="ghost"
          style={{ marginTop: 16, fontSize: 11 }}
          onClick={() => setMementoMori({ enabled: false })}
        >
          Disable
        </button>
      </div>
    );
  }

  const now           = new Date();
  const birth         = new Date(birthDate);
  const livedMs       = now - birth;
  const livedDays     = livedMs / 86400000;
  const livedYears    = livedDays / 365.25;
  const expectancy    = 78;
  const remainDays    = Math.max(0, Math.floor((expectancy - livedYears) * 365.25));
  const remainYears   = Math.floor(remainDays / 365);
  const remainMod     = remainDays % 365;
  const pctUsed       = Math.min(100, (livedYears / expectancy) * 100);
  const capturesPer100 = livedDays > 0 ? ((totalCaptures / livedDays) * 100).toFixed(1) : '0';
  const daysPerCapture  = totalCaptures > 0 ? (livedDays / totalCaptures).toFixed(1) : '—';

  return (
    <div className="memento-root">
      <div className="memento-counter">
        <div className="memento-days">{remainDays.toLocaleString()}</div>
        <div className="memento-days-label">DAYS REMAINING</div>
        <div className="memento-years-sub">{remainYears}y {remainMod}d</div>
      </div>

      <div className="memento-bar-wrap">
        <div className="memento-bar-track">
          <div className="memento-bar-fill" style={{ width: `${pctUsed}%` }} />
        </div>
        <div className="memento-bar-labels">
          <span>{livedYears.toFixed(1)}y lived</span>
          <span>{(expectancy - livedYears).toFixed(1)}y left</span>
        </div>
      </div>

      <div className="memento-stats-grid">
        <div className="memento-stat">
          <span className="memento-stat-val">{totalCaptures.toLocaleString()}</span>
          <span className="memento-stat-lbl">total thoughts</span>
        </div>
        <div className="memento-stat">
          <span className="memento-stat-val">{capturesPer100}</span>
          <span className="memento-stat-lbl">captures / 100 days</span>
        </div>
        <div className="memento-stat">
          <span className="memento-stat-val">{daysPerCapture}</span>
          <span className="memento-stat-lbl">days between captures</span>
        </div>
      </div>

      <p className="memento-quote">
        "Your time is finite. Your curiosity is not.<br />Use one to honor the other."
      </p>

      <button
        className="ghost"
        style={{ fontSize: 11, marginTop: 20, opacity: 0.5 }}
        onClick={() => setMementoMori({ enabled: false, birthDate: null })}
      >
        Disable
      </button>
    </div>
  );
}

// ── CosmosView ────────────────────────────────────────────────────────────────

export default function CosmosView({ game }) {
  const [active, setActive] = useState('oracle');
  const { state } = game;

  return (
    <div className="cosmos-view">
      <div className="view-header cosmos-header">
        <span className="view-title">COSMOS</span>
        <span className="view-hint">Beyond the ordinary</span>
      </div>

      <div className="cosmos-tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`cosmos-tab${active === tab.id ? ' active' : ''}`}
            onClick={() => setActive(tab.id)}
          >
            <span className="cosmos-tab-icon">{tab.icon}</span>
            <span className="cosmos-tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="cosmos-body">
        {active === 'oracle' && (
          <Oracle state={state} groqKey={state.groqKey} />
        )}
        {active === 'timeline' && (
          <ConsciousnessTimeline
            thoughts={state.thoughts || []}
            sessions={state.sessions || []}
          />
        )}
        {active === 'dna' && (
          <DNAHelix
            thoughts={(state.thoughts || []).filter(t => !t.done)}
          />
        )}
        {active === 'workbench'  && <Workbench  game={game} />}
        {active === 'lab'        && <Lab        game={game} />}
        {active === 'expedition' && <Expedition game={game} />}
        {active === 'council'    && <Council    game={game} />}
        {active === 'memento' && (
          <MementoMori
            mementoMori={state.mementoMori}
            setMementoMori={game.setMementoMori}
            totalCaptures={(state.thoughts || []).length}
          />
        )}
      </div>
    </div>
  );
}
