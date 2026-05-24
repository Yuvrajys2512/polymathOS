import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { DOMAINS } from './constants/index.js';
import { useGameState } from './hooks/useGameState.js';
import { useTimer } from './hooks/useTimer.js';
import { calcMomentumScore } from './utils/momentum.js';

import LandingPage    from './components/Landing/LandingPage.jsx';
import TopBar         from './components/TopBar.jsx';
import Sidebar        from './components/Sidebar/Sidebar.jsx';
import ChaosMode      from './components/ChaosMode/ChaosMode.jsx';
import BrainMap       from './components/BrainMap/BrainMap.jsx';
import Forge          from './components/Forge/Forge.jsx';
import MorningBrief   from './components/MorningBrief/MorningBrief.jsx';
import SerendipityEngine from './components/Serendipity/SerendipityEngine.jsx';
import ToastStack     from './components/shared/ToastStack.jsx';
import XpFloats       from './components/shared/XpFloats.jsx';

import HomeView       from './views/HomeView.jsx';
import FocusView      from './views/FocusView.jsx';
import ThoughtsView   from './views/ThoughtsView.jsx';
import TodoView       from './views/TodoView.jsx';
import QuestsView     from './views/QuestsView.jsx';
import CharacterView  from './views/CharacterView.jsx';
import ProfileView    from './views/ProfileView.jsx';

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
  const [briefOpen,    setBriefOpen]    = useState(() => {
    const seen = localStorage.getItem('polymath-brief-seen');
    return seen !== new Date().toISOString().split('T')[0];
  });

  const handleSessionFinish = useCallback((mode, focusMinutes, identityMode) => {
    game.finishSession(mode, actDomain, focusMinutes, identityMode);
  }, [game.finishSession, actDomain]);

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
    <main className="app-shell">
      <TopBar state={game.state} onChaos={() => setChaosOpen(true)} />

      <div className={`shell-body${chaosOpen ? ' chaos-blur' : ''}`}>
        <Sidebar
          activeView={activeView}
          onNav={v => { if (!timer.running) setActiveView(v); }}
          onForge={() => setForgeOpen(true)}
          onBrainMap={() => setBrainMapOpen(true)}
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
              />
            )}
            {activeView === 'quests' && (
              <QuestsView game={game} />
            )}
            {activeView === 'character' && (
              <CharacterView game={game} />
            )}
            {activeView === 'profile' && (
              <ProfileView state={game.state} />
            )}
          </div>
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

      <SerendipityEngine thoughts={game.state.thoughts || []} />
      <ToastStack toasts={game.toasts} dismiss={id => game.setToasts(p => p.filter(t => t.tid !== id))} />
      <XpFloats floats={game.floats} />
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
