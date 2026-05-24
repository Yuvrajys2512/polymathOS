import { useEffect, useState } from 'react';

const QUOTES = [
  "That session just paid compound interest on your future self.",
  "No pause. No mercy. Full send.",
  "You did the work while they planned to do the work.",
  "The distraction didn't win today. You did.",
  "Every uninterrupted session is proof your brain can be trusted.",
  "Something real was built here. The output proves it.",
  "Locked in. Completely. That's what it looks like.",
  "Your future self just got marginally less chaotic.",
  "25 minutes of actual work beats 3 hours of pretending.",
  "You absolute machine.",
  // roasts
  "Finally. Your idea backlog is still embarrassing, but this helped.",
  "One session completed. Your open tab count remains a crime against RAM.",
  "You focused without pausing. File the incident report.",
  "Technically a win. The bar was on the floor, but you cleared it.",
  "Bold of you to assume one session fixes everything. Start another.",
  "You resisted the urge to switch tabs. Barely, probably. Still counts.",
  "Congratulations on doing the thing you said you'd do. Groundbreaking.",
  "Your brain cooperated this time. Don't get cocky.",
  "The minimum viable focus session. Fortunately, the minimum compounds.",
  "The universe noticed. It's already plotting your next distraction.",
];

function randomLoot(sessionMinutes, xpMult) {
  const base  = Math.round(sessionMinutes * 1.5);
  const bonus = Math.round(base * (xpMult || 1) * (0.6 + Math.random() * 0.8));
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  const tier  = sessionMinutes >= 45 ? 'EPIC' : sessionMinutes >= 25 ? 'RARE' : 'UNCOMMON';
  return { bonus, quote, tier };
}

export default function LootDrop({ sessionMinutes, xpMult, modeLabel, modeColor, onClose, onAwardBonus }) {
  const [loot] = useState(() => randomLoot(sessionMinutes, xpMult));
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    if (onAwardBonus) onAwardBonus(loot.bonus);
    const t = setTimeout(() => handleClose(), 7000);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 350);
  }

  const tierColor = loot.tier === 'EPIC' ? '#f59e0b' : loot.tier === 'RARE' ? '#818cf8' : '#6ee7b7';

  return (
    <div className={`loot-backdrop${visible ? ' visible' : ''}`} onClick={handleClose}>
      <div className={`loot-card${visible ? ' visible' : ''}`}
        style={{ '--loot-color': modeColor, '--tier-color': tierColor }}
        onClick={e => e.stopPropagation()}
      >
        {/* Tier badge */}
        <div className="loot-tier">{loot.tier} DROP</div>

        {/* Mode completed */}
        <div className="loot-mode" style={{ color: modeColor }}>
          {modeLabel || 'Focus Session'} Complete
        </div>

        {/* XP reward */}
        <div className="loot-xp">
          <span className="loot-xp-plus">+</span>
          <span className="loot-xp-val">{loot.bonus}</span>
          <span className="loot-xp-label">BONUS XP</span>
        </div>

        {/* Quote */}
        <div className="loot-quote">"{loot.quote}"</div>

        <button className="loot-close" onClick={handleClose}>
          Claim &amp; Continue →
        </button>
      </div>
    </div>
  );
}
