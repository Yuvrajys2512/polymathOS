import { useState, useEffect, useMemo } from 'react';
import { pickChaosTask, todayStr } from '../../utils/game.js';
import { DOMAIN_COLOR, ENERGY_LEVELS, TIER_XP } from '../../constants/index.js';

const BREATHE_MESSAGES = ['breathe in', 'hold', 'breathe out', 'hold'];
const CALM_MESSAGES = [
  "Let's slow down.",
  "One thing at a time.",
  "You've got this.",
  "Focus is a choice.",
];

export default function ChaosMode({ state, onStartSession, onExit }) {
  const [phase, setPhase]         = useState('breathe'); // 'breathe' | 'task'
  const [breathStep, setBreathStep] = useState(0);
  const [breathCount, setBreathCount] = useState(0);
  const [calmIdx, setCalmIdx]     = useState(0);
  const [exiting, setExiting]     = useState(false);

  const today = todayStr();
  const energyEntry = (state.energyLog || []).find(e => e.date === today);
  const energyLevel = energyEntry?.level ?? 3;
  const energyInfo  = ENERGY_LEVELS[energyLevel - 1];

  const chaosTask = useMemo(
    () => pickChaosTask(state.taskBoard, state.thoughts, energyLevel),
    [state.taskBoard, state.thoughts, energyLevel],
  );

  useEffect(() => {
    const id = setInterval(() => {
      setBreathStep(s => {
        const next = (s + 1) % 4;
        if (next === 0) setBreathCount(c => c + 1);
        return next;
      });
    }, 4000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (breathCount >= 4 && phase === 'breathe') setPhase('task');
  }, [breathCount, phase]);

  useEffect(() => {
    if (phase !== 'task') return;
    const id = setInterval(() => setCalmIdx(i => (i + 1) % CALM_MESSAGES.length), 3000);
    return () => clearInterval(id);
  }, [phase]);

  function handleExit() {
    setExiting(true);
    setTimeout(onExit, 300);
  }

  function handleStart() {
    onStartSession(chaosTask);
    handleExit();
  }

  function skipToTask() { setPhase('task'); }

  const taskColor = chaosTask
    ? (DOMAIN_COLOR[chaosTask.domain || chaosTask.priority] || '#00d9b1')
    : '#00d9b1';

  return (
    <div className={`chaos-overlay${exiting ? ' exiting' : ''}`} onClick={e => e.stopPropagation()}>
      {phase === 'breathe' ? (
        <div className="chaos-content">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 24 }}>
              CHAOS MODE
            </div>
            <div className="chaos-title">
              {CALM_MESSAGES[calmIdx % CALM_MESSAGES.length]}
            </div>
            <div className="chaos-sub" style={{ marginTop: 12 }}>
              {energyInfo.emoji} Energy: {energyInfo.label} · Follow the breath
            </div>
          </div>

          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div className="breathe-circle">
              <span className="breathe-instruction">
                {BREATHE_MESSAGES[breathStep]}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className={`chaos-dot${breathCount > i ? ' active' : ''}`} />
              ))}
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted-2)' }}>
              {Math.max(0, 4 - breathCount)} breath{4 - breathCount !== 1 ? 's' : ''} to go
            </div>
          </div>

          <button className="chaos-skip" onClick={skipToTask}>
            I'm ready →
          </button>
        </div>
      ) : (
        <div className="chaos-content">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>
              YOUR ONE THING
            </div>
            <div className="chaos-title" style={{ fontSize: 22 }}>
              Focus on just this.
            </div>
          </div>

          {chaosTask ? (
            <div className="chaos-task-card" style={{ '--accent': taskColor }}>
              <div className="chaos-task-label">
                {energyLevel <= 2 ? '⚡ Easy Win' : energyLevel >= 4 ? '🔥 High Impact' : '◈ Just Right'}
                {chaosTask.domain && <span style={{ marginLeft: 10, color: taskColor }}>{chaosTask.domain}</span>}
              </div>
              <div className="chaos-task-text">
                {chaosTask.title || chaosTask.text || 'Unnamed task'}
              </div>
              <div className="chaos-task-meta">
                {chaosTask.tier && (
                  <span className={`tier-badge ${chaosTask.tier}`}>{chaosTask.tier}</span>
                )}
                {chaosTask.priority && (
                  <span className={`pill ${chaosTask.priority}`}>{chaosTask.priority}</span>
                )}
                {chaosTask.tier && (
                  <span className="pill" style={{ color: 'var(--accent)', borderColor: 'rgba(0,217,177,0.2)' }}>
                    +{TIER_XP[chaosTask.tier] || 25} XP on complete
                  </span>
                )}
              </div>
              <div className="chaos-actions">
                <button className="primary" onClick={handleStart} style={{ fontSize: 14 }}>
                  ▶ Start Focus Session
                </button>
                <button onClick={handleExit} style={{ fontSize: 12 }}>
                  Skip
                </button>
              </div>
            </div>
          ) : (
            <div className="chaos-task-card">
              <div className="chaos-task-label">NO TASKS FOUND</div>
              <div className="chaos-no-tasks">
                Your task board is empty.<br />
                Take a breath — then capture one concrete action.
              </div>
              <div className="chaos-actions" style={{ gridTemplateColumns: '1fr' }}>
                <button className="primary" onClick={handleExit}>
                  Exit & Capture Something
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleExit}
            style={{ background: 'transparent', border: 'none', color: 'var(--muted)', fontSize: 12, cursor: 'pointer' }}
          >
            ← Exit Chaos Mode
          </button>
        </div>
      )}
    </div>
  );
}
