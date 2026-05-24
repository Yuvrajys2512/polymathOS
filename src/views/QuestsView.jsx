import QuestsPanel from '../components/Quests/QuestsPanel.jsx';
import BossBattles from '../components/BossBattles/BossBattles.jsx';
import QuestGenerator from '../components/QuestGenerator/QuestGenerator.jsx';
import TaskBoardPanel from '../components/Tasks/TaskBoardPanel.jsx';

export default function QuestsView({ game }) {
  return (
    <div className="quests-view">
      <div className="view-header" style={{ gridColumn: '1 / -1' }}>
        <span className="view-title">QUESTS</span>
        <span className="view-hint">Daily missions, boss battles, and generated questlines</span>
      </div>

      <div className="quests-col">
        <QuestsPanel quests={game.state.quests} />
        <TaskBoardPanel
          tasks={game.state.taskBoard || []}
          onAdd={game.addTask}
          onComplete={game.completeTask}
          onDelete={game.deleteTask}
        />
      </div>

      <div className="quests-col">
        <BossBattles
          bosses={game.state.bosses || []}
          onAdd={game.addBoss}
          onCompletePhase={game.completeBossPhase}
          onDelete={game.deleteBoss}
        />
        <QuestGenerator
          questlines={game.state.questlines || []}
          apiKey={game.state.apiKey}
          onGenerate={game.addQuestline}
          onCompleteQuest={game.completeQuestlineQuest}
          onDeleteQuestline={game.deleteQuestline}
        />
      </div>
    </div>
  );
}
