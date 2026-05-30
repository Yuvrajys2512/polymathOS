import DomainsPanel from '../components/Domains/DomainsPanel.jsx';
import CharacterSheet from '../components/Character/CharacterSheet.jsx';
import AchievementsPanel from '../components/Achievements/AchievementsPanel.jsx';
import HabitStack from '../components/Habits/HabitStack.jsx';
import DomainRadar from '../components/RadarChart/DomainRadar.jsx';

export default function CharacterView({ game }) {
  return (
    <div className="character-view">
      <div className="view-header" style={{ gridColumn: '1 / -1' }}>
        <span className="view-title">CHARACTER</span>
        <span className="view-hint">Your stats, domains, habits, and achievements</span>
      </div>

      <div className="character-col">
        <CharacterSheet xp={game.state.xp} />
        <DomainsPanel
          domains={game.domains}
          xp={game.state.xp}
          domF="All"
          setDomF={() => {}}
          totalCount={(game.state.thoughts || []).length}
        />
        <AchievementsPanel unlockedIds={game.state.achievements} />
      </div>

      <div className="character-col">
        <HabitStack
          habits={game.state.habits || []}
          onToggle={game.toggleHabit}
          onAdd={game.addHabit}
          energyLog={game.state.energyLog || []}
          onSetEnergy={game.setEnergy}
        />
        <DomainRadar
          thoughts={game.state.thoughts || []}
          taskBoard={game.state.taskBoard || []}
          sessions={game.state.sessions || []}
        />
        <ApiKeyPanel game={game} />
        <DataPanel game={game} />
      </div>
    </div>
  );
}

function DataPanel({ game }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Your Data</h2>
        <span className="api-status">stored locally on this device</span>
      </div>
      <p className="notice" style={{ marginBottom: 12 }}>
        Export a backup file you can restore anytime — on this device or another.
        Your data never leaves your device unless you share the file.
      </p>
      <div className="data-panel-btns">
        <button className="primary" style={{ flex: 1 }} onClick={game.exportData}>
          ↓ Export Backup
        </button>
        <label className="data-import-label">
          ↑ Import Backup
          <input
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={e => { if (e.target.files[0]) game.importData(e.target.files[0]); }}
          />
        </label>
      </div>
    </section>
  );
}

function ApiKeyPanel({ game }) {
  const hasKey = !!game.state.groqKey;
  return (
    <>
      <section className="panel">
        <div className="panel-head">
          <h2>Groq AI</h2>
          <span className="api-status">
            <span className={`dot ${hasKey ? 'on' : 'off'}`} />
            {hasKey ? 'connected' : 'off — using local fallbacks'}
          </span>
        </div>
        {!hasKey && (
          <div className="groq-callout">
            <div className="groq-callout-title">AI features need a free Groq key</div>
            <ol className="groq-callout-steps">
              <li>Go to <strong>console.groq.com</strong> — takes 60 seconds, no credit card</li>
              <li>Create an API key</li>
              <li>Paste it below — it never leaves your device</li>
            </ol>
          </div>
        )}
        <div className="api-row">
          <input
            type="password"
            value={game.state.groqKey}
            onChange={e => game.setGroqKey(e.target.value)}
            placeholder="gsk_…"
          />
          {hasKey && <button onClick={() => game.setGroqKey('')}>Clear</button>}
        </div>
        <p className="notice">
          Powers Oracle, thought classification, quest generation, and todo AI.
          Stored only in your browser.
        </p>
      </section>
    </>
  );
}
