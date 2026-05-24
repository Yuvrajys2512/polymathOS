import { useMemo } from 'react';
import { ENERGY_LEVELS, DOMAIN_COLOR, TIER_XP } from '../../constants/index.js';
import { todayStr } from '../../utils/game.js';

const ARCHETYPES = {
  recovery: {
    label: 'Recovery Mode',
    icon: '◉',
    color: '#6b7280',
    glow: 'rgba(107,114,128,0.25)',
    tagline: 'Low fuel. Protect your energy.',
    why: 'Your energy is depleted. Small, frictionless actions keep momentum without burning out.',
    taskFilter: (tasks) => tasks.filter(t => t.tier === 'common' || (t.priority === 'low')),
    thoughtFilter: (thoughts) => thoughts.filter(t => t.type === 'note' || t.priority === 'low'),
    suggestions: [
      'Capture a loose thought — no pressure to be profound',
      'Review or organize your existing notes',
      'Do one easy habit from your Habit Stack',
      'Read something light for 10 min',
    ],
  },
  creative: {
    label: 'Creative Mode',
    icon: '◈',
    color: '#c084fc',
    glow: 'rgba(192,132,252,0.28)',
    tagline: 'Medium energy. Let ideas flow.',
    why: 'Mid-range energy is perfect for creative and exploratory work — your inner critic is quiet but your imagination is alive.',
    taskFilter: (tasks) => tasks.filter(t => t.domain === 'Writing' || t.domain === 'Design' || t.tier === 'rare'),
    thoughtFilter: (thoughts) => thoughts.filter(t => t.type === 'idea' || t.domain === 'Writing' || t.domain === 'Design'),
    suggestions: [
      'Write down 3 ideas — no filtering, just volume',
      'Sketch or prototype something rough',
      'Work on a medium-effort writing or design task',
      'Connect two unrelated ideas you captured recently',
    ],
  },
  deep: {
    label: 'Deep Work Mode',
    icon: '◆',
    color: '#00d9b1',
    glow: 'rgba(0,217,177,0.28)',
    tagline: 'High energy. Go hard.',
    why: 'You have peak cognitive fuel. Use it for the hardest, highest-leverage problems in your queue.',
    taskFilter: (tasks) => tasks.filter(t => t.tier === 'epic' || t.priority === 'high'),
    thoughtFilter: (thoughts) => thoughts.filter(t => t.type === 'question' || t.domain === 'AI/ML' || t.domain === 'Physics'),
    suggestions: [
      'Attack the hardest task on your board',
      'Do a 60-min focused session on an epic quest',
      'Work through a complex problem or concept',
      'Build or code something non-trivial',
    ],
  },
  admin: {
    label: 'Admin Mode',
    icon: '⚒',
    color: '#fbbf24',
    glow: 'rgba(251,191,36,0.25)',
    tagline: 'Moderate energy. Clear the decks.',
    why: 'Good-but-not-peak energy is ideal for clearing tasks, organizing, and maintaining systems.',
    taskFilter: (tasks) => tasks.filter(t => t.tier !== 'epic'),
    thoughtFilter: (thoughts) => thoughts.filter(t => t.type === 'task' || t.priority === 'medium'),
    suggestions: [
      'Knock out 2–3 medium tasks from your board',
      'Review your projects and update progress',
      'Clear any pending thoughts from your Thought Stream',
      'Plan tomorrow before your energy drops further',
    ],
  },
};

function getArchetype(energyLevel) {
  if (energyLevel <= 2) return 'recovery';
  if (energyLevel === 3) return 'creative';
  if (energyLevel === 4) return 'admin';
  return 'deep';
}

export default function AdaptiveEngine({ energyLog, taskBoard, thoughts, onCompleteTask }) {
  const today = todayStr();
  const todayEnergy = energyLog?.find(e => e.date === today);
  const energyLevel = todayEnergy?.level;

  const energyMeta = energyLevel ? ENERGY_LEVELS.find(e => e.level === energyLevel) : null;
  const archetypeKey = energyLevel ? getArchetype(energyLevel) : null;
  const archetype = archetypeKey ? ARCHETYPES[archetypeKey] : null;

  const pendingTasks = useMemo(() => (taskBoard || []).filter(t => !t.done), [taskBoard]);
  const pendingThoughts = useMemo(() => (thoughts || []).filter(t => !t.done), [thoughts]);

  const suggestedTasks = useMemo(() => {
    if (!archetype) return [];
    const fromBoard = archetype.taskFilter(pendingTasks).slice(0, 3);
    const fromThoughts = archetype.thoughtFilter(pendingThoughts.filter(t => t.type === 'task')).slice(0, 2);
    return [...fromBoard, ...fromThoughts].slice(0, 4);
  }, [archetype, pendingTasks, pendingThoughts]);

  if (!energyLevel) {
    return (
      <section className="panel">
        <div className="panel-head">
          <h2>Adaptive Engine</h2>
          <span className="badge">ADHD</span>
        </div>
        <div className="ae-empty">
          <div className="ae-empty-icon">⚡</div>
          <div className="ae-empty-title">Set your energy level</div>
          <div className="ae-empty-sub">Check in via the Habit Stack → Energy Check-in to unlock adaptive suggestions.</div>
        </div>
      </section>
    );
  }

  return (
    <section className="panel ae-panel" style={{ '--ae-color': archetype.color, '--ae-glow': archetype.glow }}>
      <div className="panel-head">
        <h2>Adaptive Engine</h2>
        <span className="badge">ADHD</span>
      </div>

      {/* Mode Banner */}
      <div className="ae-mode-banner">
        <div className="ae-mode-left">
          <span className="ae-mode-icon">{archetype.icon}</span>
          <div>
            <div className="ae-mode-label">{archetype.label}</div>
            <div className="ae-mode-tagline">{archetype.tagline}</div>
          </div>
        </div>
        <div className="ae-energy-badge">
          <span className="ae-energy-emoji">{energyMeta.emoji}</span>
          <span className="ae-energy-label">{energyMeta.label}</span>
        </div>
      </div>

      {/* Why */}
      <div className="ae-why">
        <span className="ae-why-label">Why:</span> {archetype.why}
      </div>

      {/* Suggested Tasks from Board */}
      {suggestedTasks.length > 0 && (
        <div className="ae-tasks-section">
          <div className="ae-section-label">Matched tasks from your board</div>
          {suggestedTasks.map(task => (
            <TaskSuggestion key={task.id} task={task} archetypeColor={archetype.color} onComplete={onCompleteTask} />
          ))}
        </div>
      )}

      {/* Generic Suggestions */}
      <div className="ae-tasks-section">
        <div className="ae-section-label">What to do right now</div>
        {archetype.suggestions.map((s, i) => (
          <div key={i} className="ae-suggestion-item">
            <span className="ae-suggestion-dot" style={{ background: archetype.color }} />
            <span>{s}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function TaskSuggestion({ task, archetypeColor, onComplete }) {
  const color = DOMAIN_COLOR[task.domain] || archetypeColor;
  const tierColor = task.tier === 'epic' ? '#f87171' : task.tier === 'rare' ? '#a78bfa' : '#6b7280';

  return (
    <div className="ae-task-card">
      <div className="ae-task-left">
        <button
          className="ae-task-check"
          style={{ '--check-color': archetypeColor }}
          onClick={e => onComplete && onComplete(task.id, e)}
          title="Complete task"
        >
          ○
        </button>
        <div>
          <div className="ae-task-title">{task.title}</div>
          <div className="ae-task-meta">
            <span style={{ color }}>{task.domain || 'Life'}</span>
            {task.tier && <span className="ae-task-tier" style={{ color: tierColor }}>{task.tier}</span>}
          </div>
        </div>
      </div>
      <span className="ae-task-xp">+{TIER_XP[task.tier] || 25}</span>
    </div>
  );
}
