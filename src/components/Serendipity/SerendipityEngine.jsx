import { useState, useEffect, useRef } from 'react';
import { DOMAIN_COLOR, TYPE_ICON } from '../../constants/index.js';

const INTERVAL_MS = 45 * 60 * 1000; // 45 min background fallback
const DISPLAY_MS  = 14 * 1000;       // 14 sec visible

function pickFromDomain(thoughts, domain, excludeId) {
  const cutoff = Date.now() - 7 * 86400000;
  const pool = thoughts.filter(t =>
    !t.done &&
    t.id !== excludeId &&
    new Date(t.createdAt).getTime() < cutoff &&
    t.domain === domain
  );
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

function pickRandom(thoughts) {
  const cutoff = Date.now() - 7 * 86400000;
  const pool = thoughts.filter(t =>
    !t.done &&
    new Date(t.createdAt).getTime() < cutoff &&
    (t.type === 'insight' || (t.insight && t.insight.length > 10))
  );
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function SerendipityEngine({ thoughts, captureSignal }) {
  const [card, setCard]       = useState(null);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);
  const hideRef  = useRef(null);

  function show(t) {
    if (!t) return;
    setCard(t);
    setVisible(true);
    clearTimeout(hideRef.current);
    hideRef.current = setTimeout(() => setVisible(false), DISPLAY_MS);
  }

  // Trigger on capture: surface an old thought from the same domain
  useEffect(() => {
    if (!captureSignal) return;
    show(pickFromDomain(thoughts, captureSignal.domain, captureSignal.thoughtId));
  }, [captureSignal]);

  // Background fallback: surface any old insight every 45 min
  useEffect(() => {
    timerRef.current = setInterval(() => show(pickRandom(thoughts)), INTERVAL_MS);
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(hideRef.current);
    };
  }, [thoughts]);

  if (!card || !visible) return null;

  const color = DOMAIN_COLOR[card.domain] || 'var(--accent)';

  return (
    <div className="serendipity-card" style={{ '--sc': color }} onClick={() => setVisible(false)}>
      <div className="serendipity-header">
        <span className="serendipity-label">✦ Resurfaced</span>
        <span className="serendipity-domain" style={{ color }}>{card.domain}</span>
        <button className="serendipity-close" onClick={() => setVisible(false)}>✕</button>
      </div>
      <div className="serendipity-text">{card.text}</div>
      {card.insight && card.insight !== 'Classifying…' && (
        <div className="serendipity-insight">{card.insight}</div>
      )}
      <div className="serendipity-footer">
        <span>{TYPE_ICON[card.type] || '·'} {card.type}</span>
        <span>{new Date(card.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
      </div>
      <div className="serendipity-progress" />
    </div>
  );
}
