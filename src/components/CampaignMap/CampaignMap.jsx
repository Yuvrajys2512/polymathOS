import { useRef, useEffect, useState } from 'react';
import { DOMAIN_COLOR } from '../../constants/index.js';

export default function CampaignMap({ questlines = [], bosses = [] }) {
  const canvasRef = useRef(null);
  const nodesRef  = useRef([]);
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let t = 0, raf, W = 0, H = 0;

    const activeQL = questlines.filter(q => !q.completed);
    const activeB  = bosses.filter(b => !b.defeated);

    function resize() {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width  = Math.round(W * devicePixelRatio);
      canvas.height = Math.round(H * devicePixelRatio);
      ctx.resetTransform();
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Width reserved for questline labels on the left
    const LABEL_W = 122;
    const LEGEND_H = 22;

    function buildScene() {
      const nodes = [], edges = [];
      const PAD    = 18;
      const hasB   = activeB.length > 0;
      const bossW  = hasB ? Math.min(160, W * 0.24) : 0;
      const drawH  = H - LEGEND_H;
      const totalW = W - bossW - PAD;
      const nodeAreaW = totalW - LABEL_W - PAD;
      const rowCount  = activeQL.length;
      const rowH      = rowCount > 0 ? (drawH - PAD * 2) / rowCount : drawH;

      activeQL.forEach((ql, qi) => {
        const color  = DOMAIN_COLOR[ql.domain] || '#00d9b1';
        const rowY   = PAD + qi * rowH + rowH / 2;
        const qc     = ql.quests.length;
        const stepX  = qc > 1 ? nodeAreaW / (qc - 1) : 0;
        const startX = qc === 1 ? PAD + LABEL_W + nodeAreaW / 2 : PAD + LABEL_W;
        const qlNodes = [];

        ql.quests.forEach((q, ni) => {
          const x = startX + ni * stepX;
          const n = {
            id: q.id, x, y: rowY, color,
            label: q.title, xp: q.xpReward,
            done: q.done,
            isActive: !q.done && ql.quests.findIndex(x => !x.done) === ni,
            type: 'quest',
            qlGoal: ql.goal,
          };
          nodes.push(n);
          qlNodes.push(n);
        });

        for (let i = 0; i < qlNodes.length - 1; i++) {
          edges.push({ from: qlNodes[i], to: qlNodes[i + 1], color, lit: qlNodes[i].done });
        }
      });

      if (hasB) {
        const bx = W - bossW * 0.5 - 4;
        activeB.forEach((boss, bi) => {
          const color   = DOMAIN_COLOR[boss.domain] || '#f87171';
          const y       = PAD + (bi + 0.5) * (drawH - PAD * 2) / activeB.length;
          const totalPh = boss.phases.length;
          const donePh  = boss.phases.filter(p => p.done).length;
          const hp      = totalPh > 0 ? (totalPh - donePh) / totalPh : 1;
          nodes.push({ id: boss.id, x: bx, y, color, label: boss.name, hp, type: 'boss', donePh, totalPh });
        });
      }

      nodesRef.current = nodes;
      return { nodes, edges, hasB, bossW, rowH };
    }

    function draw() {
      t += 0.018;
      ctx.clearRect(0, 0, W, H);

      const drawH = H - LEGEND_H;

      // Dot-grid background (only in main area)
      ctx.fillStyle = 'rgba(255,255,255,0.03)';
      for (let x = 16; x < W; x += 32) {
        for (let y = 16; y < drawH; y += 32) {
          ctx.beginPath(); ctx.arc(x, y, 0.8, 0, Math.PI * 2); ctx.fill();
        }
      }

      // Legend strip at bottom
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fillRect(0, drawH, W, LEGEND_H);
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.font = '9px monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText('◆ quest step', 14, drawH + LEGEND_H / 2);
      ctx.fillText('⚔ boss', 110, drawH + LEGEND_H / 2);
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.fillText('complete actions in the panels below to advance', 170, drawH + LEGEND_H / 2);

      const empty = activeQL.length === 0 && activeB.length === 0;
      if (empty) {
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.font = '11px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('NO ACTIVE CAMPAIGNS', W / 2, drawH / 2 - 12);
        ctx.fillStyle = 'rgba(255,255,255,0.04)';
        ctx.font = '9px monospace';
        ctx.fillText('generate a questline or summon a boss in the panels below', W / 2, drawH / 2 + 9);
        raf = requestAnimationFrame(draw);
        return;
      }

      const { nodes, edges, hasB, bossW, rowH } = buildScene();
      const PAD = 18;
      const totalW = W - (hasB ? Math.min(160, W * 0.24) : 0) - PAD;

      // Boss zone separator
      if (hasB) {
        const sepX = W - Math.min(160, W * 0.24) - 12;
        ctx.save();
        ctx.setLineDash([3, 9]);
        ctx.strokeStyle = 'rgba(248,113,113,0.13)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(sepX, 12); ctx.lineTo(sepX, drawH - 10); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = 'rgba(248,113,113,0.25)';
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText('BOSSES', W - Math.min(160, W * 0.24) * 0.5 - 4, 10);
      }

      // Row separators + questline labels
      activeQL.forEach((ql, qi) => {
        const color = DOMAIN_COLOR[ql.domain] || '#00d9b1';
        const rowY  = PAD + qi * rowH + rowH / 2;

        // Row separator line (between rows, not above first)
        if (qi > 0) {
          ctx.strokeStyle = 'rgba(255,255,255,0.04)';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(0, PAD + qi * rowH); ctx.lineTo(totalW, PAD + qi * rowH); ctx.stroke();
        }

        // Domain color indicator dot
        ctx.save();
        ctx.shadowColor = color;
        ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(PAD + 7, rowY, 4, 0, Math.PI * 2);
        ctx.fillStyle = color; ctx.fill();
        ctx.restore();

        // Questline goal text
        const goalText = ql.goal.length > 15 ? ql.goal.slice(0, 13) + '…' : ql.goal;
        ctx.fillStyle = 'rgba(232,232,240,0.78)';
        ctx.font = '500 10px monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(goalText, PAD + 18, rowY - 6);

        // Progress + domain beneath
        const done  = ql.quests.filter(q => q.done).length;
        const total = ql.quests.length;
        ctx.fillStyle = `${color}88`;
        ctx.font = '9px monospace';
        ctx.fillText(`${done}/${total} · ${ql.domain}`, PAD + 18, rowY + 7);
      });

      // Edges
      edges.forEach(({ from, to, color, lit }) => {
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = lit ? `${color}50` : 'rgba(255,255,255,0.05)';
        ctx.lineWidth = lit ? 1.5 : 1;
        ctx.stroke();

        if (lit) {
          const p  = (t * 0.55) % 1;
          const px = from.x + (to.x - from.x) * p;
          const py = from.y + (to.y - from.y) * p;
          ctx.save();
          ctx.shadowColor = color; ctx.shadowBlur = 9;
          ctx.fillStyle = color;
          ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }
      });

      // Nodes
      nodes.forEach(n => {
        ctx.save();
        if (n.type === 'boss') {
          const pulse  = 0.68 + Math.sin(t * 2 + n.x * 0.01) * 0.32;
          const r      = 13 + Math.sin(t * 1.6) * 1.5;
          const hpCol  = n.hp > 0.6 ? '#f87171' : n.hp > 0.3 ? '#fbbf24' : '#4ade80';

          ctx.beginPath(); ctx.arc(n.x, n.y, r + 6, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(248,113,113,0.08)'; ctx.lineWidth = 2; ctx.stroke();

          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 6, -Math.PI / 2, -Math.PI / 2 + n.hp * Math.PI * 2);
          ctx.strokeStyle = hpCol; ctx.lineWidth = 2.5;
          ctx.shadowColor = hpCol; ctx.shadowBlur = 10; ctx.stroke(); ctx.shadowBlur = 0;

          ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
          ctx.fillStyle   = `rgba(248,113,113,${0.11 * pulse})`;
          ctx.strokeStyle = `rgba(248,113,113,${0.65 * pulse})`;
          ctx.lineWidth = 1.5;
          ctx.shadowColor = '#f87171'; ctx.shadowBlur = 14 * pulse;
          ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;

          ctx.font = '11px sans-serif';
          ctx.fillStyle = `rgba(248,113,113,${0.88 * pulse})`;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText('⚔', n.x, n.y);

          // Boss name below node
          const short = n.label.length > 11 ? n.label.slice(0, 9) + '…' : n.label;
          ctx.fillStyle = 'rgba(255,255,255,0.55)';
          ctx.font = '9px monospace';
          ctx.textBaseline = 'top';
          ctx.fillText(short, n.x, n.y + r + 8);

          // Phase count
          ctx.fillStyle = `${hpCol}88`;
          ctx.font = '8px monospace';
          ctx.fillText(`${n.donePh}/${n.totalPh} phases`, n.x, n.y + r + 19);
        } else {
          const r = n.isActive ? 9 + Math.sin(t * 3) * 1.8 : n.done ? 8 : 5;

          if (n.isActive) {
            ctx.beginPath();
            ctx.arc(n.x, n.y, r + 9 + Math.sin(t * 2.5) * 4, 0, Math.PI * 2);
            ctx.strokeStyle = `${n.color}1e`; ctx.lineWidth = 1; ctx.stroke();
          }

          ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
          ctx.fillStyle   = n.done ? n.color : n.isActive ? `${n.color}44` : 'rgba(255,255,255,0.05)';
          ctx.shadowColor = n.color;
          ctx.shadowBlur  = n.done ? 10 : n.isActive ? 18 : 0;
          ctx.fill(); ctx.shadowBlur = 0;

          ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
          ctx.strokeStyle = n.done ? n.color : n.isActive ? `${n.color}cc` : `${n.color}30`;
          ctx.lineWidth = 1.5; ctx.stroke();

          if (n.done) {
            ctx.font = `bold ${Math.max(8, r)}px monospace`;
            ctx.fillStyle = 'rgba(0,0,0,0.9)';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText('✓', n.x, n.y + 0.5);
          }
        }
        ctx.restore();
      });

      raf = requestAnimationFrame(draw);
    }

    draw();
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [questlines, bosses]);

  function handleMouseMove(e) {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const hit = nodesRef.current.find(n => Math.hypot(n.x - mx, n.y - my) < (n.type === 'boss' ? 22 : 14));
    setTooltip(hit ? { node: hit, mx, my } : null);
  }

  return (
    <div className="campaign-map-wrap">
      <canvas
        ref={canvasRef}
        className="campaign-map-canvas"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setTooltip(null)}
      />
      {tooltip && (
        <div className="campaign-tooltip" style={{ left: tooltip.mx + 14, top: tooltip.my - 14 }}>
          <div className="campaign-tooltip-title">{tooltip.node.label}</div>
          {tooltip.node.xp != null && <div className="campaign-tooltip-xp">+{tooltip.node.xp} XP</div>}
          {tooltip.node.hp != null && (
            <div className="campaign-tooltip-hp">{Math.round(tooltip.node.hp * 100)}% HP remaining</div>
          )}
          {tooltip.node.done && <div className="campaign-tooltip-done">complete</div>}
          {tooltip.node.isActive && <div className="campaign-tooltip-active">next up</div>}
        </div>
      )}
    </div>
  );
}
