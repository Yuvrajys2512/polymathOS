import { useMemo } from 'react';
import QuestsPanel from '../components/Quests/QuestsPanel.jsx';
import BossBattles from '../components/BossBattles/BossBattles.jsx';
import QuestGenerator from '../components/QuestGenerator/QuestGenerator.jsx';
import TaskBoardPanel from '../components/Tasks/TaskBoardPanel.jsx';
import { DOMAIN_COLOR, TIER_XP } from '../constants/index.js';
import { todayStr } from '../utils/game.js';

// ── Next Objective logic ──────────────────────────────────────────
function getNextObjective(state) {
  // 1. Active boss with a next phase
  const activeBoss = (state.bosses || []).find(b => !b.defeated);
  if (activeBoss) {
    const nextPhase = activeBoss.phases.find(p => !p.done);
    if (nextPhase) {
      const done = activeBoss.phases.filter(p => p.done).length;
      const total = activeBoss.phases.length;
      const hp = Math.round(((total - done) / total) * 100);
      return {
        type: 'boss',
        title: nextPhase.name,
        context: activeBoss.name,
        domain: activeBoss.domain,
        xp: nextPhase.xpReward,
        hp,
        bossId: activeBoss.id,
        phaseId: nextPhase.id,
      };
    }
  }

  // 2. First incomplete daily quest
  const activeQuest = (state.quests?.list || []).find(q => !q.completed);
  if (activeQuest) {
    const remaining = activeQuest.goal - activeQuest.progress;
    return {
      type: 'quest',
      title: activeQuest.title,
      context: `${activeQuest.progress}/${activeQuest.goal} — ${remaining} to go`,
      domain: 'Life',
      xp: activeQuest.xpReward,
    };
  }

  // 3. Highest-tier pending task
  const pending = (state.taskBoard || []).filter(t => !t.done);
  const task = pending.find(t => t.tier === 'epic') || pending.find(t => t.tier === 'rare') || pending[0];
  if (task) {
    return {
      type: 'task',
      title: task.title,
      context: `${task.tier} task`,
      domain: task.domain || 'Life',
      xp: TIER_XP[task.tier] || 25,
    };
  }

  return null;
}

// ── Mission feed ──────────────────────────────────────────────────
function getMissionFeed(state) {
  const events = [];

  // Completed boss phases
  (state.bosses || []).forEach(boss => {
    boss.phases.filter(p => p.done).forEach(p => {
      events.push({
        id: `bp-${boss.id}-${p.id}`,
        label: p.name,
        context: boss.name,
        xp: p.xpReward,
        domain: boss.domain,
        at: boss.defeatedAt || boss.createdAt,
        icon: '⚔',
      });
    });
    if (boss.defeated) {
      events.push({
        id: `bd-${boss.id}`,
        label: `BOSS DEFEATED`,
        context: boss.name,
        xp: 200,
        domain: boss.domain,
        at: boss.defeatedAt,
        icon: '◆',
        highlight: true,
      });
    }
  });

  // Completed questline quests
  (state.questlines || []).forEach(ql => {
    ql.quests.filter(q => q.done).forEach(q => {
      events.push({
        id: `qq-${ql.id}-${q.id}`,
        label: q.title,
        context: ql.goal,
        xp: q.xpReward,
        domain: ql.domain,
        at: ql.completedAt || ql.createdAt,
        icon: '✦',
      });
    });
  });

  // Completed taskboard items
  (state.taskBoard || []).filter(t => t.done).forEach(t => {
    events.push({
      id: `tb-${t.id}`,
      label: t.title,
      context: `${t.tier} task`,
      xp: TIER_XP[t.tier] || 25,
      domain: t.domain || 'Life',
      at: t.completedAt || t.createdAt,
      icon: t.tier === 'epic' ? '◆' : t.tier === 'rare' ? '◈' : '○',
    });
  });

  // Completed daily quests (for today)
  const today = todayStr();
  if (state.quests?.date === today) {
    (state.quests.list || []).filter(q => q.completed).forEach(q => {
      events.push({
        id: `dq-${q.id}`,
        label: q.title,
        context: 'Daily Quest',
        xp: q.xpReward,
        domain: 'Life',
        at: today,
        icon: '⚡',
      });
    });
  }

  return events
    .sort((a, b) => new Date(b.at || 0) - new Date(a.at || 0))
    .slice(0, 10);
}

// ── Next Objective Card ───────────────────────────────────────────
function NextObjectiveCard({ objective, onStartFocus }) {
  if (!objective) {
    return (
      <div className="next-obj-card next-obj-clear">
        <div className="next-obj-clear-icon">◆</div>
        <div className="next-obj-clear-title">All objectives complete</div>
        <div className="next-obj-clear-sub">Start a new boss battle or set a daily intention to keep the momentum going.</div>
      </div>
    );
  }

  const color = DOMAIN_COLOR[objective.domain] || 'var(--accent)';
  const typeLabel = objective.type === 'boss' ? '⚔ ACTIVE BOSS' : objective.type === 'quest' ? '⚡ DAILY QUEST' : '◈ TASK BOARD';

  return (
    <div className="next-obj-card" style={{ '--obj-color': color }}>
      <div className="next-obj-type">{typeLabel}</div>
      <div className="next-obj-main">
        <div className="next-obj-content">
          <div className="next-obj-title">{objective.title}</div>
          <div className="next-obj-context">{objective.context}</div>
          {objective.type === 'boss' && (
            <div className="next-obj-hp">
              <div className="next-obj-hp-track">
                <div
                  className="next-obj-hp-fill"
                  style={{
                    width: `${objective.hp}%`,
                    background: objective.hp > 60 ? '#f87171' : objective.hp > 30 ? '#fbbf24' : '#4ade80',
                  }}
                />
              </div>
              <span className="next-obj-hp-label">{objective.hp}% HP remaining</span>
            </div>
          )}
        </div>
        <div className="next-obj-actions">
          <div className="next-obj-xp">+{objective.xp} XP</div>
          <button
            className="next-obj-focus-btn"
            style={{ '--obj-color': color }}
            onClick={() => onStartFocus(objective.domain)}
          >
            <span>⚡ Focus Session</span>
            <span className="next-obj-arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Mission Feed ──────────────────────────────────────────────────
function MissionFeed({ events }) {
  if (events.length === 0) return null;
  return (
    <div className="mission-feed">
      <div className="mission-feed-header">MISSION FEED</div>
      <div className="mission-feed-list">
        {events.map(ev => {
          const color = DOMAIN_COLOR[ev.domain] || 'var(--accent)';
          return (
            <div key={ev.id} className={`mission-event${ev.highlight ? ' highlight' : ''}`}>
              <span className="mission-event-icon" style={{ color }}>{ev.icon}</span>
              <div className="mission-event-body">
                <span className="mission-event-label">{ev.label}</span>
                <span className="mission-event-context">{ev.context}</span>
              </div>
              <span className="mission-event-xp" style={{ color }}>+{ev.xp}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main view ─────────────────────────────────────────────────────
export default function QuestsView({ game, onStartFocus }) {
  const objective = useMemo(() => getNextObjective(game.state), [game.state]);
  const feed = useMemo(() => getMissionFeed(game.state), [game.state]);

  const questsDoneToday = (game.state.quests?.list || []).filter(q => q.completed).length;
  const questsTotal = (game.state.quests?.list || []).length;
  const allQuestsDone = questsDoneToday === questsTotal && questsTotal > 0;

  return (
    <div className="war-room">

      {/* Header */}
      <div className="war-room-header">
        <div>
          <span className="view-title">WAR ROOM</span>
          <span className="view-hint">
            {allQuestsDone
              ? '◆ Daily sweep complete — bonus XP earned'
              : `${questsDoneToday}/${questsTotal} daily quests · ${(game.state.bosses || []).filter(b => !b.defeated).length} active boss${(game.state.bosses || []).filter(b => !b.defeated).length !== 1 ? 'es' : ''}`
            }
          </span>
        </div>
      </div>

      {/* Next Objective — full width hero */}
      <div className="war-room-hero">
        <div className="war-room-section-label">NEXT OBJECTIVE</div>
        <NextObjectiveCard objective={objective} onStartFocus={onStartFocus} />
      </div>

      {/* Two columns */}
      <div className="war-room-columns">

        {/* Left col: Daily Quests + Task Board */}
        <div className="war-room-col">
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

        {/* Right col: Boss Battles + Quest Generator */}
        <div className="war-room-col">
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
            groqKey={game.state.groqKey}
            onGenerate={game.addQuestline}
            onCompleteQuest={game.completeQuestlineQuest}
            onDeleteQuestline={game.deleteQuestline}
            intention={game.state.intention || ''}
          />
        </div>
      </div>

      {/* Mission Feed — full width */}
      <MissionFeed events={feed} />
    </div>
  );
}
