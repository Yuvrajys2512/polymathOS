import { useMemo } from 'react';
import { DOMAIN_COLOR } from '../../constants/index.js';

const DAYS = 30;
const CX = 110, CY = 110;
const INNER_R = 46;
const MAX_BAR = 50;
const STUB_H  = 4;

export default function RadialRing({ thoughts = [], sessions = [] }) {
  const { cells, activeDays, totalCaptures, maxCount } = useMemo(() => {
    const today = new Date();
    const dayCounts  = {};
    const dayDomains = {};

    thoughts.forEach(t => {
      const d = t.createdAt?.split('T')[0];
      if (!d) return;
      dayCounts[d]  = (dayCounts[d]  || 0) + 1;
      if (!dayDomains[d]) dayDomains[d] = {};
      dayDomains[d][t.domain] = (dayDomains[d][t.domain] || 0) + 1;
    });

    const cells = Array.from({ length: DAYS }, (_, i) => {
      const d   = new Date(today.getTime() - (DAYS - 1 - i) * 86400000);
      const ds  = d.toISOString().split('T')[0];
      const count = dayCounts[ds] || 0;
      const topDomain = Object.entries(dayDomains[ds] || {})
        .sort((a, b) => b[1] - a[1])[0]?.[0] || null;
      return { date: ds, count, domain: topDomain, isToday: i === DAYS - 1 };
    });

    const activeDays    = cells.filter(c => c.count > 0).length;
    const totalCaptures = thoughts.length;
    const maxCount      = Math.max(...cells.map(c => c.count), 1);

    return { cells, activeDays, totalCaptures, maxCount };
  }, [thoughts]);

  const todaySessions = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return (sessions || []).filter(s => s.at?.startsWith(today)).length;
  }, [sessions]);

  return (
    <div className="radial-ring-wrap">
      <svg
        width="220" height="220"
        viewBox="0 0 220 220"
        aria-label="30-day activity ring"
        className="radial-ring-svg"
      >
        {/* Outer dashed reference */}
        <circle
          cx={CX} cy={CY} r={INNER_R + MAX_BAR + 6}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
          strokeDasharray="3 5"
        />
        {/* Inner base ring */}
        <circle
          cx={CX} cy={CY} r={INNER_R}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />

        {/* Bars */}
        {cells.map((cell, i) => {
          /* today (i=29) at the top (−90°), clockwise */
          const angleDeg = -90 + (i / DAYS) * 360;
          const rad      = angleDeg * (Math.PI / 180);

          const barH  = cell.count > 0
            ? STUB_H + (cell.count / maxCount) * (MAX_BAR - STUB_H)
            : STUB_H;
          const outerR = INNER_R + barH;

          const x1 = CX + INNER_R * Math.cos(rad);
          const y1 = CY + INNER_R * Math.sin(rad);
          const x2 = CX + outerR  * Math.cos(rad);
          const y2 = CY + outerR  * Math.sin(rad);

          const domColor = cell.domain ? (DOMAIN_COLOR[cell.domain] || '#00d9b1') : '#00d9b1';
          const color    = cell.isToday ? '#00d9b1' : cell.count > 0 ? domColor : 'rgba(255,255,255,0.1)';
          const opacity  = cell.count === 0 ? 0.35 : 0.55 + (cell.count / maxCount) * 0.45;
          const sw       = cell.isToday ? 3.5 : cell.count > 0 ? 2.5 : 1.5;

          return (
            <line
              key={cell.date}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={color}
              strokeWidth={sw}
              strokeLinecap="round"
              opacity={opacity}
              style={cell.count > 0 ? {
                filter: `drop-shadow(0 0 ${cell.isToday ? 5 : 3}px ${color})`
              } : undefined}
            >
              <title>{cell.date}: {cell.count} capture{cell.count !== 1 ? 's' : ''}</title>
            </line>
          );
        })}

        {/* Today tick-mark label */}
        {(() => {
          const rad   = -90 * (Math.PI / 180); // straight up
          const labelR = INNER_R + MAX_BAR + 14;
          return (
            <text
              x={CX + labelR * Math.cos(rad)}
              y={CY + labelR * Math.sin(rad) + 4}
              textAnchor="middle"
              fontSize="7"
              fill="var(--accent)"
              fontFamily="var(--mono)"
              letterSpacing="1"
              opacity="0.85"
            >
              TODAY
            </text>
          );
        })()}

        {/* Center stats */}
        <text
          x={CX} y={CY - 12}
          textAnchor="middle"
          fontSize="26"
          fontWeight="700"
          fill="var(--ink)"
          fontFamily="var(--mono)"
        >
          {activeDays}
        </text>
        <text
          x={CX} y={CY + 5}
          textAnchor="middle"
          fontSize="8"
          fill="var(--muted)"
          fontFamily="var(--mono)"
          letterSpacing="1.5"
        >
          ACTIVE DAYS
        </text>
        <text
          x={CX} y={CY + 20}
          textAnchor="middle"
          fontSize="8"
          fill="var(--muted)"
          fontFamily="var(--mono)"
          opacity="0.7"
        >
          {totalCaptures} total
        </text>
      </svg>

      <div className="radial-ring-meta">
        <span className="radial-ring-title">30-DAY PULSE</span>
        {todaySessions > 0 && (
          <span className="radial-ring-sessions">{todaySessions} session{todaySessions !== 1 ? 's' : ''} today</span>
        )}
      </div>
    </div>
  );
}
