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
      </div>
    </div>
  );
}

function ApiKeyPanel({ game }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Claude API</h2>
        <span className="api-status">
          <span className={`dot ${game.state.apiKey ? 'on' : 'off'}`} />
          {game.state.apiKey ? 'connected' : 'local'}
        </span>
      </div>
      <div className="api-row">
        <input
          type="password"
          value={game.state.apiKey}
          onChange={e => game.setApiKey(e.target.value)}
          placeholder="sk-ant-…"
        />
        <button onClick={() => game.setApiKey('')}>Clear</button>
      </div>
      <p className="notice">
        Without a key, local heuristic classification runs instead.
        Stored only in your browser's localStorage.
      </p>
    </section>
  );
}
