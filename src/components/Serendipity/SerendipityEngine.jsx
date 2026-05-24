import { useState, useEffect, useRef } from 'react';
import { DOMAIN_COLOR, TYPE_ICON } from '../../constants/index.js';

const INTERVAL_MS = 20 * 60 * 1000; // 20 min
const DISPLAY_MS  = 12 * 1000;       // 12 sec visible

function pickOldInsight(thoughts) {
  const cutoff = Date.now() - 7 * 86400000;
  const pool = thoughts.filter(t =>
    !t.done &&
    new Date(t.createdAt).getTime() < cutoff &&
    (t.type === 'insight' || (t.insight && t.insight.length > 10))
  );
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function SerendipityEngine({ thoughts }) {
  const [card, setCard]       = useState(null);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);
  const hideRef  = useRef(null);

  function fire() {
    const t = pickOldInsight(thoughts);
    if (!t) return;
    setCard(t);
    setVisible(true);
    clearTimeout(hideRef.current);
    hideRef.current = setTimeout(() => setVisible(false), DISPLAY_MS);
  }

  useEffect(() => {
    timerRef.current = setInterval(fire, INTERVAL_MS);
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
