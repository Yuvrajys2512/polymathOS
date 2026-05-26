import { useRef, useEffect, useMemo, useState } from 'react';
import { DOMAIN_COLOR, DOMAINS } from '../../constants/index.js';

function domSeed(name) {
  let h = 0;
  for (const c of name) h = ((h << 5) - h) + c.charCodeAt(0);
  return Math.abs(h);
}
function hexRgb(hex) {
  if (!hex?.startsWith('#')) return '120,120,140';
  return `${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)}`;
}

export default function GalaxyMap({ xp, thoughts, sessions }) {
  const canvasRef = useRef(null);
  const frameRef  = useRef(null);
  const [selected, setSelected] = useState(null);

  const stars = useMemo(() => {
    const sevenAgo = new Date(Date.now() - 7 * 86400000).toISOString();
    return DOMAINS.map(d => {
      const h      = domSeed(d);
      const angle  = (h % 1000) / 1000 * Math.PI * 2;
      const dist   = 0.12 + ((h >> 10) % 1000) / 1000 * 0.52;
      const xpVal  = xp?.[d] || 0;
      const r      = Math.min(30, 4 + Math.sqrt(xpVal) * 0.55);
      const recent =
        (sessions || []).some(s => s.domain === d && s.at > sevenAgo) ||
        (thoughts || []).some(t => t.domain === d && t.createdAt > sevenAgo);
      const tc = (thoughts || []).filter(t => t.domain === d).length;
      return { domain: d, angle, dist, r, xp: xpVal, recent, tc, col: DOMAIN_COLOR[d] || '#6b7280' };
    });
  }, [xp, (thoughts||[]).length, (sessions||[]).length]);

  // Tap
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cs = { x: 0, t: 0 };
    const down = e => { const c = e.touches?.[0]??e; cs = { x: c.clientX, y: c.clientY, t: Date.now() }; };
    const up = e => {
      const c = e.changedTouches?.[0]??e;
      if (Math.abs(c.clientX - cs.x) + Math.abs(c.clientY - cs.y) > 14 || Date.now() - cs.t > 380) return;
      const rect = canvas.getBoundingClientRect();
      const sx = c.clientX - rect.left, sy = c.clientY - rect.top;
      const W = canvas.offsetWidth, H = canvas.offsetHeight;
      const cx = W/2, cy = H/2, rad = Math.min(W,H)*0.42;
      let hit = null;
      for (const s of stars) {
        const nx = cx + Math.cos(s.angle)*s.dist*rad;
        const ny = cy + Math.sin(s.angle)*s.dist*rad;
        if (Math.sqrt((sx-nx)**2+(sy-ny)**2) < s.r + 18) { hit = s; break; }
      }
      setSelected(p => hit ? (p?.domain===hit.domain ? null : hit) : null);
    };
    canvas.addEventListener('mousedown',  down);
    canvas.addEventListener('mouseup',    up);
    canvas.addEventListener('touchstart', down, { passive: true });
    canvas.addEventListener('touchend',   up,   { passive: true });
    return () => {
      canvas.removeEventListener('mousedown',  down);
      canvas.removeEventListener('mouseup',    up);
      canvas.removeEventListener('touchstart', down);
      canvas.removeEventListener('touchend',   up);
    };
  }, [stars]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let t = 0;

    function draw() {
      t++;
      const W = canvas.offsetWidth||400, H = canvas.offsetHeight||400;
      if (canvas.width!==W||canvas.height!==H) { canvas.width=W; canvas.height=H; }
      ctx.clearRect(0,0,W,H);
      const cx=W/2, cy=H/2, rad=Math.min(W,H)*0.42;

      // Nebula
      const neb = ctx.createRadialGradient(cx,cy,0,cx,cy,rad*1.5);
      neb.addColorStop(0,'rgba(0,217,177,0.04)');
      neb.addColorStop(0.4,'rgba(139,92,246,0.025)');
      neb.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=neb; ctx.fillRect(0,0,W,H);

      // Background star field
      for (let i=0;i<90;i++) {
        const bx=(Math.sin(i*127.1)*0.5+0.5)*W;
        const by=(Math.sin(i*311.7)*0.5+0.5)*H;
        const ba=0.08+0.10*Math.sin(i+t*0.004);
        ctx.beginPath(); ctx.arc(bx,by,0.7,0,Math.PI*2);
        ctx.fillStyle=`rgba(255,255,255,${ba})`; ctx.fill();
      }

      // Connection lines between active stars
      const active = stars.filter(s=>s.xp>0);
      for (let i=0;i<active.length;i++) {
        for (let j=i+1;j<active.length;j++) {
          const a=active[i], b=active[j];
          const ax=cx+Math.cos(a.angle)*a.dist*rad, ay=cy+Math.sin(a.angle)*a.dist*rad;
          const bx2=cx+Math.cos(b.angle)*b.dist*rad, by2=cy+Math.sin(b.angle)*b.dist*rad;
          const shimmer=0.025+0.008*Math.sin(t*0.012+i+j);
          ctx.strokeStyle=`rgba(255,255,255,${shimmer})`;
          ctx.lineWidth=0.5;
          ctx.beginPath(); ctx.moveTo(ax,ay); ctx.lineTo(bx2,by2); ctx.stroke();
        }
      }

      // Stars
      for (const star of stars) {
        const nx=cx+Math.cos(star.angle)*star.dist*rad;
        const ny=cy+Math.sin(star.angle)*star.dist*rad;
        const isSel=selected?.domain===star.domain;
        const rgb=hexRgb(star.col);
        const hasXP=star.xp>0;

        if (!hasXP) {
          ctx.beginPath(); ctx.arc(nx,ny,2.5,0,Math.PI*2);
          ctx.fillStyle='rgba(255,255,255,0.07)'; ctx.fill();
          ctx.fillStyle='rgba(255,255,255,0.12)';
          ctx.font='7px system-ui'; ctx.textAlign='center';
          ctx.fillText(star.domain,nx,ny+star.r+11);
          continue;
        }

        // Glow
        const glowR=star.r*(isSel?5.5:star.recent?3.8:2.8);
        const glowA=(isSel?0.28:star.recent?0.18:0.09)+0.04*Math.sin(t*0.022+star.angle);
        const glow=ctx.createRadialGradient(nx,ny,0,nx,ny,glowR);
        glow.addColorStop(0,`rgba(${rgb},${glowA})`);
        glow.addColorStop(1,`rgba(${rgb},0)`);
        ctx.beginPath(); ctx.arc(nx,ny,glowR,0,Math.PI*2);
        ctx.fillStyle=glow; ctx.fill();

        // Core
        const b=1+0.08*Math.sin(t*0.02+star.angle*2);
        ctx.beginPath(); ctx.arc(nx,ny,star.r*b,0,Math.PI*2);
        ctx.fillStyle=star.col;
        ctx.shadowBlur=isSel?22:star.recent?14:8;
        ctx.shadowColor=star.col;
        ctx.fill(); ctx.shadowBlur=0;

        // Recent pulse ring
        if (star.recent) {
          const pp=(t*0.04+star.angle)%(Math.PI*2);
          const rr=star.r+5+5*Math.sin(pp);
          ctx.beginPath(); ctx.arc(nx,ny,rr,0,Math.PI*2);
          ctx.strokeStyle=`rgba(${rgb},${0.42+0.2*Math.sin(pp)})`;
          ctx.lineWidth=1; ctx.stroke();
        }

        // Label
        ctx.fillStyle=isSel?star.col:`rgba(${rgb},0.65)`;
        ctx.font=`${isSel?'bold ':''}9px system-ui`;
        ctx.textAlign='center';
        ctx.fillText(star.domain,nx,ny+star.r+13);
      }

      frameRef.current=requestAnimationFrame(draw);
    }
    frameRef.current=requestAnimationFrame(draw);
    return ()=>cancelAnimationFrame(frameRef.current);
  }, [stars, selected]);

  return (
    <div className="galaxy-root">
      <canvas ref={canvasRef} className="galaxy-canvas" />
      {selected && (
        <div className="galaxy-detail" style={{ '--dc': selected.col }}>
          <span className="galaxy-d-domain" style={{ color: selected.col }}>{selected.domain}</span>
          <span className="galaxy-d-sep">·</span>
          <span className="galaxy-d-xp">{selected.xp} XP</span>
          <span className="galaxy-d-sep">·</span>
          <span className="galaxy-d-tc">{selected.tc} thoughts</span>
          {selected.recent && <span className="galaxy-d-active">◉ active</span>}
        </div>
      )}
    </div>
  );
}
