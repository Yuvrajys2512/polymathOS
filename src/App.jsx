import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { DOMAINS } from './constants/index.js';
import { useGameState } from './hooks/useGameState.js';
import { useTimer } from './hooks/useTimer.js';

import LandingPage from './components/Landing/LandingPage.jsx';
import TopBar from './components/TopBar.jsx';
import HeroBar from './components/HeroBar.jsx';
import StreakHeatmap from './components/Heatmap/StreakHeatmap.jsx';
import CapturePanel from './components/Capture/CapturePanel.jsx';
import DomainsPanel from './components/Domains/DomainsPanel.jsx';
import FocusTimer from './components/Timer/FocusTimer.jsx';
import ChaosMode from './components/ChaosMode/ChaosMode.jsx';
import BrainMap from './components/BrainMap/BrainMap.jsx';
import ThoughtCard from './components/Thoughts/ThoughtCard.jsx';
import TaskBoardPanel from './components/Tasks/TaskBoardPanel.jsx';
import QuestsPanel from './components/Quests/QuestsPanel.jsx';
import HabitStack from './components/Habits/HabitStack.jsx';
import CharacterSheet from './components/Character/CharacterSheet.jsx';
import AchievementsPanel from './components/Achievements/AchievementsPanel.jsx';
import ProjectsPanel from './components/Projects/ProjectsPanel.jsx';
import QuestGenerator from './components/QuestGenerator/QuestGenerator.jsx';
import AdaptiveEngine from './components/AdaptiveEngine/AdaptiveEngine.jsx';
import BossBattles from './components/BossBattles/BossBattles.jsx';
import Forge from './components/Forge/Forge.jsx';
import DomainRadar from './components/RadarChart/DomainRadar.jsx';
import SerendipityEngine from './components/Serendipity/SerendipityEngine.jsx';
import MorningBrief from './components/MorningBrief/MorningBrief.jsx';
import ToastStack from './components/shared/ToastStack.jsx';
import XpFloats from './components/shared/XpFloats.jsx';

function MainApp() {
  const game = useGameState();
  const captureRef = useRef(null);

  const [search,   setSearch]   = useState('');
  const [domF,     setDomF]     = useState('All');
  const [typeF,    setTypeF]    = useState('All');
  const [priF,     setPriF]     = useState('All');
  const [showDone, setShowDone] = useState(false);
  const [actDomain, setActDomain] = useState('AI/ML');
  const [chaosOpen, setChaosOpen]       = useState(false);
  const [brainMapOpen, setBrainMapOpen] = useState(false);
  const [forgeOpen, setForgeOpen]       = useState(false);
  const [briefOpen, setBriefOpen]       = useState(() => {
    const seen = localStorage.getItem('polymath-brief-seen');
    return seen !== new Date().toISOString().split('T')[0];
  });

  const handleSessionFinish = useCallback((mode, focusMinutes, identityMode) => {
    game.finishSession(mode, actDomain, focusMinutes, identityMode);
  }, [game.finishSession, actDomain]);

  const timer = useTimer(25, handleSessionFinish);

  // Global keyboard shortcut: / to focus capture
  useEffect(() => {
    const h = e => {
      if (e.key === '/' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        captureRef.current?.focus();
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return game.state.thoughts
      .filter(t => !t.done)
      .filter(t => domF === 'All' || t.domain === domF)
      .filter(t => typeF === 'All' || t.type === typeF)
      .filter(t => priF === 'All' || t.priority === priF)
      .filter(t => !q || [t.text, t.domain, t.type, t.insight, ...(t.tags || [])].join(' ').toLowerCase().includes(q))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [game.state.thoughts, search, domF, typeF, priF]);

  const done = game.state.thoughts
    .filter(t => t.done)
    .sort((a, b) => new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt));

  function handleChaosStart(task) {
    timer.startChaosSession();
  }

  // Intention panel
  const [intentionLocal, setIntentionLocal] = useState(game.state.intention);
  useEffect(() => { setIntentionLocal(game.state.intention); }, [game.state.intention]);

  return (
    <main className="app">
      <TopBar
        search={search} setSearch={setSearch}
        typeF={typeF} setTypeF={setTypeF}
        priF={priF} setPriF={setPriF}
        onCaptureRef={() => captureRef.current?.focus()}
        onChaos={() => setChaosOpen(true)}
        onBrainMap={() => setBrainMapOpen(true)}
        onForge={() => setForgeOpen(true)}
      />

      <HeroBar state={game.state} />
      <StreakHeatmap thoughts={game.state.thoughts} />

      <div className="layout">
        {/* LEFT COLUMN */}
        <div className="stack">
          <CapturePanel
            captureRef={captureRef}
            onSubmit={game.submitThought}
            apiKey={game.state.apiKey}
          />

          {/* Intention */}
          <section className="panel">
            <div className="panel-head">
              <h2>Today's Intention</h2>
              <span className="int-status">
                <span className={`dot ${game.state.intention ? 'on' : 'off'}`} />
                {game.state.intention ? 'set' : 'empty'}
              </span>
            </div>
            <input
              value={intentionLocal}
              onChange={e => { setIntentionLocal(e.target.value); game.setIntentionText(e.target.value); }}
              onBlur={e => game.saveIntention(e.target.value)}
              placeholder="One sentence for today…"
            />
          </section>

          <DomainsPanel
            domains={game.domains}
            xp={game.state.xp}
            domF={domF}
            setDomF={setDomF}
            totalCount={game.state.thoughts.length}
          />

          <TaskBoardPanel
            tasks={game.state.taskBoard || []}
            onAdd={game.addTask}
            onComplete={game.completeTask}
            onDelete={game.deleteTask}
          />

          <QuestsPanel quests={game.state.quests} />
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
          <AchievementsPanel unlockedIds={game.state.achievements} />
        </div>

        {/* CENTER COLUMN */}
        <div className="stack">
          <div>
            <div className="filters">
              <span className={`chip${domF === 'All' ? ' active' : ''}`} onClick={() => setDomF('All')}>All</span>
              {DOMAINS.map(d => (
                <span key={d} className={`chip${domF === d ? ' active' : ''}`} onClick={() => setDomF(d)}>{d}</span>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>
                {visible.length} thought{visible.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="stream">
              {visible.length === 0 ? (
                <div className="empty">
                  Nothing matches this view.<br />Capture something raw or loosen the filters.
                </div>
              ) : visible.map(t => (
                <ThoughtCard key={t.id} thought={t}
                  updateThought={game.updateThought}
                  deleteThought={game.deleteThought} />
              ))}
            </div>
          </div>

          {/* Archive */}
          <div className="archive">
            <button className="ghost"
              style={{ fontSize: 12, color: 'var(--muted)', width: '100%', textAlign: 'left' }}
              onClick={() => setShowDone(!showDone)}>
              {showDone ? '▾' : '▸'} Archived ({done.length})
            </button>
            {showDone && (
              <div className="stream" style={{ marginTop: 8 }}>
                {done.map(t => (
                  <ThoughtCard key={t.id} thought={t}
                    updateThought={game.updateThought}
                    deleteThought={game.deleteThought} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="stack">
          <FocusTimer
            actDomain={actDomain}
            setActDomain={setActDomain}
            domains={game.domains}
            timer={timer}
            sessions={game.state.sessions}
          />

          <HabitStack
            habits={game.state.habits || []}
            onToggle={game.toggleHabit}
            onAdd={game.addHabit}
            energyLog={game.state.energyLog || []}
            onSetEnergy={game.setEnergy}
          />

          <AdaptiveEngine
            energyLog={game.state.energyLog || []}
            taskBoard={game.state.taskBoard || []}
            thoughts={game.state.thoughts || []}
            onCompleteTask={game.completeTask}
          />

          <DomainRadar
            thoughts={game.state.thoughts || []}
            taskBoard={game.state.taskBoard || []}
            sessions={game.state.sessions || []}
          />

          <CharacterSheet xp={game.state.xp} />

          <ProjectsPanel
            projects={game.state.projects}
            onAdd={game.addProject}
            onUpdateProgress={game.updateProjectProgress}
            sessions={game.state.sessions}
          />

          {/* API Key */}
          <section className="panel">
            <div className="panel-head">
              <h2>Claude API</h2>
              <span className="api-status">
                <span className={`dot ${game.state.apiKey ? 'on' : 'off'}`} />
                {game.state.apiKey ? 'connected' : 'local'}
              </span>
            </div>
            <div className="api-row">
              <input type="password" value={game.state.apiKey}
                onChange={e => game.setApiKey(e.target.value)}
                placeholder="sk-ant-…" />
              <button onClick={() => game.setApiKey('')}>Clear</button>
            </div>
            <p className="notice">
              Without a key, local heuristic classification runs instead.
              Key is stored only in your browser's localStorage.
            </p>
          </section>
        </div>
      </div>

      {/* Overlays */}
      {forgeOpen && (
        <Forge
          thoughts={game.state.thoughts}
          apiKey={game.state.apiKey}
          onClose={() => setForgeOpen(false)}
          onSaveForge={game.saveForge}
        />
      )}
      {brainMapOpen && (
        <BrainMap state={game.state} onClose={() => setBrainMapOpen(false)} />
      )}
      {chaosOpen && (
        <ChaosMode
          state={game.state}
          onStartSession={handleChaosStart}
          onExit={() => setChaosOpen(false)}
        />
      )}

      <SerendipityEngine thoughts={game.state.thoughts || []} />
      <ToastStack toasts={game.toasts} dismiss={id => game.setToasts(p => p.filter(t => t.tid !== id))} />
      <XpFloats floats={game.floats} />

      {briefOpen && (
        <MorningBrief
          state={game.state}
          onDismiss={() => {
            localStorage.setItem('polymath-brief-seen', new Date().toISOString().split('T')[0]);
            setBriefOpen(false);
          }}
          onSetIntention={v => {
            game.saveIntention(v);
            localStorage.setItem('polymath-brief-seen', new Date().toISOString().split('T')[0]);
            setBriefOpen(false);
          }}
        />
      )}
    </main>
  );
}

export default function App() {
  const [landingUp, setLandingUp] = useState(() => !localStorage.getItem('polymath-entered'));

  function handleEnter() {
    localStorage.setItem('polymath-entered', '1');
    setTimeout(() => setLandingUp(false), 750);
  }

  return (
    <>
      <MainApp />
      {landingUp && <LandingPage onEnter={handleEnter} />}
    </>
  );
}
