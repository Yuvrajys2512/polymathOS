import { useMemo } from 'react';
import { DOMAINS, DOMAIN_COLOR } from '../../constants/index.js';
import { todayStr } from '../../utils/game.js';

function last7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - i * 86400000);
    return d.toISOString().split('T')[0];
  });
}

function domainScore(domain, thoughts, taskBoard, sessions, days) {
  const captures = thoughts.filter(t => t.domain === domain && days.some(d => t.createdAt?.startsWith(d))).length;
  const tasks    = (taskBoard || []).filter(t => t.domain === domain && days.some(d => t.completedAt?.startsWith(d))).length;
  const focused  = (sessions || []).filter(s => s.domain === domain && days.some(d => s.at?.startsWith(d))).length;
  return captures * 0.4 + tasks * 0.6 + focused * 0.7;
}

export default function DomainRadar({ thoughts, taskBoard, sessions }) {
  const days = useMemo(last7Days, []);

  const scores = useMemo(() => {
    const raw = DOMAINS.map(d => domainScore(d, thoughts, taskBoard, sessions, days));
    const max = Math.max(...raw, 1);
    return raw.map(s => s / max);
  }, [thoughts, taskBoard, sessions, days]);

  const hasActivity = scores.some(s => s > 0);

  const CX = 120, CY = 120, R = 88;
  const N = DOMAINS.length;

  function angle(i) { return (i / N) * 2 * Math.PI - Math.PI / 2; }
  function gridPoint(i, frac) {
    return [CX + R * frac * Math.cos(angle(i)), CY + R * frac * Math.sin(angle(i))];
  }
  function dataPoint(i) {
    const s = Math.max(0.04, scores[i]);
    return [CX + R * s * Math.cos(angle(i)), CY + R * s * Math.sin(angle(i))];
  }

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const gridPolygons = gridLevels.map(frac =>
    DOMAINS.map((_, i) => gridPoint(i, frac).join(',')).join(' ')
  );
  const dataPolygon = DOMAINS.map((_, i) => dataPoint(i).join(',')).join(' ');

  return (
    <section className="panel radar-panel">
      <div className="panel-head">
        <h2>Domain Radar</h2>
        <span className="badge">7-day</span>
      </div>

      <div className="radar-wrap">
        <svg width={240} height={240} viewBox="0 0 240 240">
          {/* Grid */}
          {gridPolygons.map((pts, gi) => (
            <polygon key={gi} points={pts} fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={gi === 3 ? 1.5 : 1}
            />
          ))}

          {/* Spokes */}
          {DOMAINS.map((_, i) => {
            const [x, y] = gridPoint(i, 1);
            return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth={1} />;
          })}

          {/* Data fill */}
          {hasActivity && (
            <>
              <polygon
                points={dataPolygon}
                fill="rgba(0,217,177,0.1)"
                stroke="rgba(0,217,177,0.5)"
                strokeWidth={1.5}
                strokeLinejoin="round"
              />
              {DOMAINS.map((_, i) => {
                const [x, y] = dataPoint(i);
                const color = DOMAIN_COLOR[DOMAINS[i]];
                return (
                  <circle key={i} cx={x} cy={y} r={3.5} fill={color}
                    style={{ filter: `drop-shadow(0 0 4px ${color})` }}
                  />
                );
              })}
            </>
          )}

          {/* Domain labels */}
          {DOMAINS.map((d, i) => {
            const ang = angle(i);
            const lx = CX + (R + 22) * Math.cos(ang);
            const ly = CY + (R + 22) * Math.sin(ang);
            const anchor = Math.abs(Math.cos(ang)) < 0.1 ? 'middle' : Math.cos(ang) > 0 ? 'start' : 'end';
            const color = DOMAIN_COLOR[d];
            const active = scores[i] > 0.05;
            return (
              <text key={d} x={lx} y={ly + 4}
                textAnchor={anchor}
                fontSize={9}
                fontFamily="JetBrains Mono, monospace"
                fontWeight={active ? '700' : '400'}
                fill={active ? color : 'rgba(232,232,240,0.25)'}
                style={{ filter: active ? `drop-shadow(0 0 6px ${color}88)` : 'none' }}
              >
                {d.replace('/', '/\n')}
              </text>
            );
          })}

          {/* Center dot */}
          <circle cx={CX} cy={CY} r={2} fill="rgba(255,255,255,0.2)" />
        </svg>

        <div className="radar-legend">
          {DOMAINS.map((d, i) => {
            const pct = Math.round(scores[i] * 100);
            const color = DOMAIN_COLOR[d];
            return (
              <div key={d} className="radar-legend-row">
                <span className="radar-legend-dot" style={{ background: color, boxShadow: pct > 0 ? `0 0 6px ${color}88` : 'none' }} />
                <span className="radar-legend-name" style={{ color: pct > 0 ? 'var(--ink-2)' : 'var(--muted)' }}>{d}</span>
                <div className="radar-legend-bar-wrap">
                  <div className="radar-legend-bar-fill" style={{ width: `${pct}%`, background: color }} />
                </div>
                <span className="radar-legend-pct" style={{ color: pct > 0 ? color : 'var(--muted)' }}>{pct}%</span>
              </div>
            );
          })}
          {!hasActivity && (
            <div className="empty" style={{ fontSize: 11, padding: '8px 0' }}>
              No activity this week yet.<br />Start capturing to see your balance.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
