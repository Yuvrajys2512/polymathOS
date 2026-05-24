import { DOMAIN_COLOR, XP_PER_LEVEL } from '../../constants/index.js';
import { xpToLevel, xpInLevel } from '../../utils/game.js';

export default function DomainsPanel({ domains, xp, domF, setDomF, totalCount }) {
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Domains</h2>
        <span className="badge">{totalCount}</span>
      </div>
      <div className="domain-grid">
        <div
          className={`domain-tile${domF === 'All' ? ' active' : ''}`}
          style={{ '--dc': 'rgba(255,255,255,0.45)' }}
          onClick={() => setDomF('All')}
        >
          <div className="domain-tile-top"><strong>All</strong></div>
          <span className="domain-count">{totalCount} captured</span>
        </div>
        {domains.map(d => {
          const lv   = xpToLevel(xp?.[d.name] || 0);
          const prog = xpInLevel(xp?.[d.name] || 0);
          const col  = DOMAIN_COLOR[d.name] || 'var(--accent)';
          return (
            <div
              key={d.name}
              className={`domain-tile${domF === d.name ? ' active' : ''}`}
              style={{ '--dc': col }}
              onClick={() => setDomF(d.name)}
            >
              <div className="domain-tile-top">
                <strong>{d.name}</strong>
                <span className="level-badge" style={{ '--dc': col }}>Lv.{lv}</span>
              </div>
              <span className="domain-count">{d.count} captured</span>
              <div className="xp-track">
                <div className="xp-fill" style={{ width: `${(prog / XP_PER_LEVEL) * 100}%`, '--dc': col }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
