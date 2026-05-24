import { useState } from 'react';
import { ENERGY_LEVELS } from '../../constants/index.js';
import { getHabitStreak, todayStr } from '../../utils/game.js';

function EnergyCheckin({ energyLog, onSet }) {
  const today   = todayStr();
  const todayE  = energyLog.find(e => e.date === today);
  return (
    <div className="energy-section">
      <div className="energy-row">
        <span className="energy-label">Energy today</span>
        {todayE && (
          <span className="energy-status">
            {ENERGY_LEVELS[todayE.level - 1].emoji} {ENERGY_LEVELS[todayE.level - 1].label}
          </span>
        )}
      </div>
      <div className="energy-btns">
        {ENERGY_LEVELS.map(l => (
          <button key={l.level}
            className={`energy-btn${todayE?.level === l.level ? ' active' : ''}`}
            style={{ '--ec': l.color, '--ec-g': l.glow }}
            onClick={() => onSet(l.level)}
            title={l.label}
          >
            {l.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function HabitStack({ habits, onToggle, onAdd, energyLog, onSetEnergy }) {
  const [newH, setNewH] = useState('');
  const today     = todayStr();
  const doneCount = habits.filter(h => h.dates.includes(today)).length;

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Habit Stack</h2>
        <span className="badge"
          style={doneCount === habits.length && habits.length > 0
            ? { color: 'var(--accent)', borderColor: 'rgba(0,217,177,0.3)' } : {}}>
          {doneCount}/{habits.length}
        </span>
      </div>
      <div className="habit-list">
        {habits.map(h => {
          const done   = h.dates.includes(today);
          const streak = getHabitStreak(h.dates);
          return (
            <div key={h.id} className={`habit-item${done ? ' done' : ''}`} onClick={e => onToggle(h.id, e)}>
              <div className="habit-check">{done ? '✓' : ''}</div>
              <span className="habit-name">{h.name}</span>
              <div className="habit-streak">
                <span className="habit-streak-num" style={{ color: streak > 0 ? 'var(--accent)' : 'var(--muted)' }}>
                  {streak}
                </span>
                <span className="habit-streak-lbl">day{streak !== 1 ? 's' : ''}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mini-form" style={{ marginTop: 10 }}>
        <input value={newH} onChange={e => setNewH(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && newH.trim()) { onAdd(newH.trim()); setNewH(''); } }}
          placeholder="Add habit…" />
        <button onClick={() => { if (newH.trim()) { onAdd(newH.trim()); setNewH(''); } }}>Add</button>
      </div>
      <EnergyCheckin energyLog={energyLog} onSet={onSetEnergy} />
    </section>
  );
}
