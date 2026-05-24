import QuestsPanel from '../components/Quests/QuestsPanel.jsx';
import BossBattles from '../components/BossBattles/BossBattles.jsx';
import QuestGenerator from '../components/QuestGenerator/QuestGenerator.jsx';
import TaskBoardPanel from '../components/Tasks/TaskBoardPanel.jsx';
import CampaignMap from '../components/CampaignMap/CampaignMap.jsx';

export default function QuestsView({ game }) {
  return (
    <div className="quests-view">
      <div className="view-header" style={{ gridColumn: '1 / -1' }}>
        <span className="view-title">QUESTS</span>
        <span className="view-hint">Campaign map, weekly objectives, boss battles</span>
      </div>

      <div style={{ gridColumn: '1 / -1' }}>
        <CampaignMap
          questlines={game.state.questlines || []}
          bosses={game.state.bosses || []}
        />
      </div>

      <div className="quests-col">
        <QuestsPanel
          quests={game.state.quests}
          weeklyQuest={game.weeklyQuest}
          dailyComboStreak={game.dailyComboStreak}
        />
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
          thoughts={game.state.thoughts || []}
          todos={game.state.todos || []}
        />
        <QuestGenerator
          questlines={game.state.questlines || []}
          apiKey={game.state.apiKey}
          onGenerate={game.addQuestline}
          onCompleteQuest={game.completeQuestlineQuest}
          onDeleteQuestline={game.deleteQuestline}
          intention={game.state.intention || ''}
        />
      </div>
    </div>
  );
}
