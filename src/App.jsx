import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { DOMAINS, DOMAIN_COLOR } from './constants/index.js';
import { useGameState } from './hooks/useGameState.js';
import { useTimer } from './hooks/useTimer.js';
import { calcMomentumScore } from './utils/momentum.js';

import LandingPage    from './components/Landing/LandingPage.jsx';
import TutorialOverlay from './components/Tutorial/TutorialOverlay.jsx';
import TopBar         from './components/TopBar.jsx';
import Sidebar        from './components/Sidebar/Sidebar.jsx';
import ChaosMode      from './components/ChaosMode/ChaosMode.jsx';
import BrainMap       from './components/BrainMap/BrainMap.jsx';
import Forge          from './components/Forge/Forge.jsx';
import MorningBrief   from './components/MorningBrief/MorningBrief.jsx';
import TriageMode     from './components/Triage/TriageMode.jsx';
import SerendipityEngine from './components/Serendipity/SerendipityEngine.jsx';
import ToastStack     from './components/shared/ToastStack.jsx';
import XpFloats       from './components/shared/XpFloats.jsx';

import HomeView       from './views/HomeView.jsx';
import FocusView      from './views/FocusView.jsx';
import ThoughtsView   from './views/ThoughtsView.jsx';
import TodoView       from './views/TodoView.jsx';
import QuestsView     from './views/QuestsView.jsx';
import ProfileView    from './views/ProfileView.jsx';
import ProjectsView   from './views/ProjectsView.jsx';
import CosmosView     from './views/CosmosView.jsx';
import NeuralStorm    from './components/NeuralStorm/NeuralStorm.jsx';

function MainApp() {
  const game       = useGameState();
  const captureRef = useRef(null);

  const [activeView,   setActiveView]   = useState('home');
  const [search,       setSearch]       = useState('');
  const [domF,         setDomF]         = useState('All');
  const [typeF,        setTypeF]        = useState('All');
  const [priF,         setPriF]         = useState('All');
  const [showDone,     setShowDone]     = useState(false);
  const [actDomain,    setActDomain]    = useState('AI/ML');
  const [chaosOpen,    setChaosOpen]    = useState(false);
  const [brainMapOpen, setBrainMapOpen] = useState(false);
  const [forgeOpen,    setForgeOpen]    = useState(false);
  const [triageOpen,   setTriageOpen]   = useState(false);
  const [triageThoughts, setTriageThoughts] = useState([]);
  const [briefOpen,    setBriefOpen]    = useState(() => {
    const seen = localStorage.getItem('polymath-brief-seen');
    return seen !== new Date().toISOString().split('T')[0];
  });
  const [stormOpen,    setStormOpen]    = useState(false);
  const [serendipitySignal, setSerendipitySignal] = useState(null);
  const [tutorialOpen, setTutorialOpen] = useState(() => !localStorage.getItem('polymath-tutorial-seen'));

  const [actProject, setActProject] = useState(null);

  // Track when thoughts finish classifying → fire serendipity for that domain
  const prevPendingRef = useRef(new Set());
  useEffect(() => {
    const thoughts = game.state.thoughts || [];
    const nowPending = new Set(thoughts.filter(t => t.status === 'pending').map(t => t.id));
    const justClassified = [...prevPendingRef.current].filter(id => !nowPending.has(id));
    if (justClassified.length > 0) {
      const thought = thoughts.find(t => justClassified.includes(t.id));
      if (thought?.domain && thought.domain !== 'Sorting') {
        setSerendipitySignal({ domain: thought.domain, thoughtId: thought.id, ts: Date.now() });
      }
    }
    prevPendingRef.current = nowPending;
  }, [game.state.thoughts]);

  // Workbench helpers passed down to thought lists
  const workbenchIds = useMemo(() =>
    new Set((game.state.workbench?.nodes || []).filter(n => n.thoughtId).map(n => n.thoughtId)),
    [game.state.workbench]
  );
  const sendToWorkbench = useCallback((thought) => {
    if (workbenchIds.has(thought.id)) return;
    const nodeCount = game.state.workbench?.nodes?.length || 0;
    const x = 120 + (nodeCount % 5) * 260;
    const y = 120 + Math.floor(nodeCount / 5) * 180;
    game.addWorkbenchNode({
      kind: 'thought', text: thought.text,
      color: DOMAIN_COLOR[thought.domain] || '#00d9b1',
      domain: thought.domain, thoughtId: thought.id, x, y,
    });
  }, [workbenchIds, game.state.workbench, game.addWorkbenchNode]);

  const handleSessionFinish = useCallback((mode, focusMinutes, identityMode) => {
    game.finishSession(mode, actDomain, focusMinutes, identityMode, actProject);
  }, [game.finishSession, actDomain, actProject]);

  const timer = useTimer(25, handleSessionFinish);

  // / key always focuses capture (switches to home first)
  useEffect(() => {
    const h = e => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        setActiveView('home');
        setTimeout(() => captureRef.current?.focus(), 50);
      }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (game.state.thoughts || [])
      .filter(t => !t.done)
      .filter(t => domF  === 'All' || t.domain   === domF)
      .filter(t => typeF === 'All' || t.type     === typeF)
      .filter(t => priF  === 'All' || t.priority === priF)
      .filter(t => !q || [t.text, t.domain, t.type, t.insight, ...(t.tags || [])].join(' ').toLowerCase().includes(q))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [game.state.thoughts, search, domF, typeF, priF]);

  const done = (game.state.thoughts || [])
    .filter(t => t.done)
    .sort((a, b) => new Date(b.completedAt || b.createdAt) - new Date(a.completedAt || a.createdAt));

  function dismissBrief() {
    localStorage.setItem('polymath-brief-seen', new Date().toISOString().split('T')[0]);
    setBriefOpen(false);
  }

  return (
    <main className="app-shell" data-identity={timer.identityMode?.id || ''}>
      <TopBar state={game.state} onChaos={() => setChaosOpen(true)} onTutorial={() => setTutorialOpen(true)} />

      <div className={`shell-body${chaosOpen ? ' chaos-blur' : ''}`}>
        <Sidebar
          activeView={activeView}
          onNav={v => { if (!timer.running) setActiveView(v); }}
          onForge={() => setForgeOpen(true)}
          onBrainMap={() => setBrainMapOpen(true)}
          onHelp={() => setTutorialOpen(true)}
          focusLocked={timer.running && activeView === 'focus'}
          todoPendingCount={(game.state.todos || []).filter(t => !t.done && t.date === new Date().toISOString().split('T')[0]).length}
        />

        <div className="main-content">
          <div key={activeView} className="view-anim">
            {activeView === 'home' && (
              <HomeView
                game={game}
                captureRef={captureRef}
                onViewAll={() => setActiveView('thoughts')}
                momentum={calcMomentumScore(game.state.thoughts, game.state.taskBoard, game.state.sessions)}
                onStorm={() => setStormOpen(true)}
                sendToWorkbench={sendToWorkbench}
                workbenchIds={workbenchIds}
              />
            )}
            {activeView === 'focus' && (
              <FocusView
                actDomain={actDomain}
                setActDomain={setActDomain}
                domains={game.domains}
                timer={timer}
                sessions={game.state.sessions}
                identityModes={game.state.identityModes}
                addIdentityMode={game.addIdentityMode}
                deleteIdentityMode={game.deleteIdentityMode}
                addDomain={game.addDomain}
                deleteDomain={game.deleteDomain}
                submitThought={game.submitThought}
                groqKey={game.state.groqKey}
                projects={game.state.projects}
                actProject={actProject}
                setActProject={setActProject}
              />
            )}
            {activeView === 'thoughts' && (
              <ThoughtsView
                visible={visible}
                done={done}
                domainList={game.state.domainList}
                search={search}       setSearch={setSearch}
                domF={domF}           setDomF={setDomF}
                typeF={typeF}         setTypeF={setTypeF}
                priF={priF}           setPriF={setPriF}
                showDone={showDone}   setShowDone={setShowDone}
                updateThought={game.updateThought}
                deleteThought={game.deleteThought}
                onStartFocus={() => setActiveView('focus')}
                onOpenTriage={thoughts => { setTriageThoughts(thoughts); setTriageOpen(true); }}
                groqKey={game.state.groqKey}
                sendToWorkbench={sendToWorkbench}
                workbenchIds={workbenchIds}
              />
            )}
            {activeView === 'todo' && (
              <TodoView
                state={game.state}
                addTodo={game.addTodo}
                toggleTodo={game.toggleTodo}
                deleteTodo={game.deleteTodo}
                addSubtask={game.addSubtask}
                toggleSubtask={game.toggleSubtask}
                deleteSubtask={game.deleteSubtask}
                onNav={setActiveView}
              />
            )}
            {activeView === 'quests' && (
              <QuestsView
                game={game}
                onStartFocus={domain => { setActDomain(domain); setActiveView('focus'); }}
              />
            )}
            {activeView === 'projects' && (
              <ProjectsView game={game} />
            )}
            {activeView === 'profile' && (
              <ProfileView game={game} />
            )}
            {activeView === 'cosmos' && (
              <CosmosView game={game} />
            )}
          </div>
        </div>
      </div>

      {/* Overlays */}
      {triageOpen && (
        <TriageMode
          thoughts={triageThoughts}
          updateThought={game.updateThought}
          onClose={() => setTriageOpen(false)}
          onStartFocus={() => { setTriageOpen(false); setActiveView('focus'); }}
        />
      )}
      {forgeOpen && (
        <Forge
          thoughts={game.state.thoughts}
          groqKey={game.state.groqKey}
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
          onStartSession={() => {
            timer.startChaosSession();
            setChaosOpen(false);
            setActiveView('focus');
          }}
          onExit={() => setChaosOpen(false)}
        />
      )}
      {briefOpen && (
        <MorningBrief
          state={game.state}
          onDismiss={dismissBrief}
          onSetIntention={v => { game.saveIntention(v); dismissBrief(); }}
        />
      )}

      {stormOpen && (
        <NeuralStorm
          onClose={() => setStormOpen(false)}
          onSubmit={game.submitThought}
          groqKey={game.state.groqKey}
        />
      )}

      {tutorialOpen && (
        <TutorialOverlay onClose={() => setTutorialOpen(false)} />
      )}

      <SerendipityEngine thoughts={game.state.thoughts || []} captureSignal={serendipitySignal} />
      <ToastStack toasts={game.toasts} dismiss={id => game.setToasts(p => p.filter(t => t.tid !== id))} />
      <XpFloats floats={game.floats} />
    </main>
  );
}

export default function App() {
  const [landingUp,   setLandingUp]   = useState(() => !localStorage.getItem('polymath-entered'));
  const [swUpdate,    setSwUpdate]    = useState(false);
  const swReg = useRef(null);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').then(reg => {
      swReg.current = reg;
      reg.addEventListener('updatefound', () => {
        const newSW = reg.installing;
        newSW.addEventListener('statechange', () => {
          if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
            setSwUpdate(true);
          }
        });
      });
    }).catch(() => {});
  }, []);

  function applyUpdate() {
    if (swReg.current?.waiting) {
      swReg.current.waiting.postMessage('SKIP_WAITING');
    }
    window.location.reload();
  }

  function handleEnter() {
    localStorage.setItem('polymath-entered', '1');
    setTimeout(() => setLandingUp(false), 750);
  }

  return (
    <>
      <MainApp />
      {landingUp && <LandingPage onEnter={handleEnter} />}
      {swUpdate && (
        <div className="sw-update-banner">
          <span>✦ New version available</span>
          <button className="sw-update-btn" onClick={applyUpdate}>Update now</button>
          <button className="sw-update-dismiss" onClick={() => setSwUpdate(false)}>×</button>
        </div>
      )}
    </>
  );
}
