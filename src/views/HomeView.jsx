import { useState, useEffect } from 'react';
import CapturePanel from '../components/Capture/CapturePanel.jsx';
import StreakHeatmap from '../components/Heatmap/StreakHeatmap.jsx';
import ThoughtCard from '../components/Thoughts/ThoughtCard.jsx';
import MomentumOrb from '../components/MomentumOrb/MomentumOrb.jsx';

export default function HomeView({ game, captureRef, onViewAll, momentum = 0 }) {
  const [intentionLocal, setIntentionLocal] = useState(game.state.intention || '');
  useEffect(() => { setIntentionLocal(game.state.intention || ''); }, [game.state.intention]);

  const recent = [...(game.state.thoughts || [])]
    .filter(t => !t.done)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="home-view">

      {/* Ambient momentum orb — behind content */}
      <div className="home-orb-wrap" aria-hidden="true">
        <MomentumOrb momentum={momentum} />
      </div>

      {/* Capture hero */}
      <div className="home-hero">
        <div className="home-hero-label">
          <span className="view-title">CAPTURE</span>
          <span className="view-hint">Press <kbd className="kbd">/</kbd> from anywhere</span>
        </div>
        <div className="capture-hero-wrap">
          <CapturePanel
            captureRef={captureRef}
            onSubmit={game.submitThought}
            apiKey={game.state.apiKey}
          />
        </div>
      </div>

      {/* Intention */}
      <div className="intention-row">
        <span className="intention-label">TODAY'S INTENTION</span>
        <input
          className="intention-input"
          value={intentionLocal}
          onChange={e => {
            setIntentionLocal(e.target.value);
            game.setIntentionText(e.target.value);
          }}
          onBlur={e => game.saveIntention(e.target.value)}
          placeholder="One sentence that defines today…"
        />
      </div>

      {/* Activity strip */}
      <StreakHeatmap thoughts={game.state.thoughts} />

      {/* Recent thoughts */}
      <div className="home-recent">
        <div className="home-recent-head">
          <span className="view-title">RECENT</span>
          <button className="ghost view-all-btn" onClick={onViewAll}>
            View all →
          </button>
        </div>
        {recent.length === 0 ? (
          <div className="home-empty">
            Nothing captured yet — start dumping raw thoughts above.
          </div>
        ) : (
          <div className="stream">
            {recent.map(t => (
              <ThoughtCard
                key={t.id}
                thought={t}
                updateThought={game.updateThought}
                deleteThought={game.deleteThought}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
