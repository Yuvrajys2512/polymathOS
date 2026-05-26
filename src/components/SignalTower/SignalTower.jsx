import { useEffect, useRef, useMemo, useState } from 'react';
import { DOMAIN_COLOR, DOMAINS } from '../../constants/index.js';
import { todayStr } from '../../utils/game.js';

const toRgb = hex => [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];

export default function SignalTower({ game }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const dataRef   = useRef(null);
  const [tuned, setTuned] = useState(null);
  const tunedRef  = useRef(null);
  const { state } = game;

  const domainData = useMemo(() => {
    const today = todayStr();
    const xp = state.xp || {};
    const maxXp = Math.max(1, ...DOMAINS.map(d => xp[d] || 0));
    const recentThoughts = (state.thoughts || []).filter(t => {
      try { return Date.now() - new Date(t.createdAt).getTime() < 3600000; } catch { return false; }
    });
    return DOMAINS.map(d => ({
      domain: d,
      xp:    xp[d] || 0,
      norm:  (xp[d] || 0) / maxXp,
      color: DOMAIN_COLOR[d] || '#00d9b1',
      rgb:   toRgb(DOMAIN_COLOR[d] || '#00d9b1'),
      recentCapture: recentThoughts.some(t => t.domain === d),
    }));
  }, [state.xp, state.thoughts]);

  dataRef.current  = domainData;
  tunedRef.current = tuned;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const waves = []; // expanding rings from antenna
    let lastWave = 0;
    const spikes = {}; // domain → spikeLevel (0-1, decaying)

    const ro = new ResizeObserver(() => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    });
    ro.observe(canvas);
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    function tick(now) {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // background
      ctx.fillStyle = '#06060f'; ctx.fillRect(0, 0, W, H);

      const data   = dataRef.current;
      const tuned2 = tunedRef.current;

      // tower layout
      const towerX = W * 0.5;
      const towerY = H * 0.06;
      const towerH = H * 0.22;
      const baseY  = towerY + towerH;

      // antenna top glow
      const antTop = towerY - 8;
      const blinkOn = Math.sin(now * 0.0035) > 0;
      ctx.save();
      if (blinkOn) { ctx.shadowBlur = 18; ctx.shadowColor = '#ff3333'; }
      ctx.beginPath(); ctx.arc(towerX, antTop, blinkOn ? 4 : 2.5, 0, 6.28);
      ctx.fillStyle = blinkOn ? '#ff4444' : '#440000'; ctx.fill();
      ctx.restore();

      // antenna mast
      ctx.beginPath(); ctx.moveTo(towerX, antTop); ctx.lineTo(towerX, baseY);
      ctx.strokeStyle = 'rgba(0,217,177,.7)'; ctx.lineWidth = 2; ctx.stroke();

      // cross arms
      for (const y of [towerY + towerH * 0.25, towerY + towerH * 0.5, towerY + towerH * 0.75]) {
        const hw = towerH * 0.2 * ((y - towerY) / towerH + 0.5);
        ctx.beginPath(); ctx.moveTo(towerX - hw, y); ctx.lineTo(towerX + hw, y);
        ctx.strokeStyle = 'rgba(0,217,177,.4)'; ctx.lineWidth = 1; ctx.stroke();
        // diagonals
        ctx.beginPath(); ctx.moveTo(towerX - hw, y); ctx.lineTo(towerX, baseY);
        ctx.moveTo(towerX + hw, y); ctx.lineTo(towerX, baseY);
        ctx.strokeStyle = 'rgba(0,217,177,.15)'; ctx.lineWidth = .5; ctx.stroke();
      }

      // ground line
      ctx.beginPath(); ctx.moveTo(towerX - towerH * 0.7, baseY); ctx.lineTo(towerX + towerH * 0.7, baseY);
      ctx.strokeStyle = 'rgba(0,217,177,.3)'; ctx.lineWidth = 1; ctx.stroke();

      // spawn wave every 2s
      if (now - lastWave > 2000) {
        waves.push({ r: 8, alpha: 0.55, speed: 1.2 + Math.random() * 0.8 });
        lastWave = now;
      }

      // draw waves
      for (let wi = waves.length - 1; wi >= 0; wi--) {
        const wv = waves[wi];
        wv.r += wv.speed; wv.alpha -= 0.007;
        if (wv.alpha <= 0) { waves.splice(wi, 1); continue; }
        ctx.beginPath(); ctx.arc(towerX, antTop, wv.r, 0, 6.28);
        ctx.strokeStyle = `rgba(0,217,177,${wv.alpha})`; ctx.lineWidth = 1; ctx.stroke();
      }

      // frequency spectrum bars
      const nBars   = data.length;
      const barAreaW = Math.min(W * 0.9, 600);
      const barW    = barAreaW / nBars;
      const barX0   = (W - barAreaW) / 2;
      const specY   = baseY + 28;
      const maxBarH = H - specY - 48;

      data.forEach((d, i) => {
        const isTuned = tuned2 === d.domain;
        if (d.recentCapture && !spikes[d.domain]) spikes[d.domain] = 1;
        if (spikes[d.domain]) spikes[d.domain] = Math.max(0, spikes[d.domain] - 0.015);

        const spike = spikes[d.domain] || 0;
        const breath = Math.sin(now * 0.0015 + i * 0.7) * 0.06 + 1;
        const barH = Math.max(4, (d.norm + spike * 0.4) * maxBarH * breath * (isTuned ? 1.15 : 1));
        const bx = barX0 + i * barW + barW * 0.15;
        const bw = barW * 0.7;
        const by = specY + maxBarH - barH;

        const [r, g, b] = d.rgb;
        const alpha = isTuned ? 0.95 : 0.55 + d.norm * 0.35;

        // bar glow
        if (isTuned || spike > 0.1) {
          ctx.save(); ctx.shadowBlur = 18; ctx.shadowColor = d.color; ctx.restore();
        }

        // bar fill gradient
        const grd = ctx.createLinearGradient(bx, by + barH, bx, by);
        grd.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
        grd.addColorStop(1, `rgba(${r},${g},${b},${alpha * 0.4})`);
        ctx.fillStyle = grd;
        ctx.fillRect(bx, by, bw, barH);

        // top cap
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fillRect(bx, by - 2, bw, 2);

        // spike highlight line
        if (spike > 0.05) {
          ctx.fillStyle = `rgba(255,255,255,${spike * 0.8})`;
          ctx.fillRect(bx, by - 1, bw, 1);
        }

        // domain label
        ctx.fillStyle = isTuned
          ? d.color
          : `rgba(255,255,255,${0.22 + d.norm * 0.3})`;
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(d.domain.slice(0, 5).toUpperCase(), bx + bw / 2, specY + maxBarH + 14);
      });

      // tuned domain indicator
      if (tuned2) {
        const td = data.find(d => d.domain === tuned2);
        if (td) {
          ctx.fillStyle = td.color;
          ctx.font = '10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`▶ TUNED: ${tuned2.toUpperCase()}  ·  ${td.xp} XP`, W / 2, specY - 10);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, []);

  const dominant = useMemo(() => {
    return domainData.reduce((best, d) => d.xp > (best?.xp || 0) ? d : best, null);
  }, [domainData]);

  return (
    <div className="signal-root">
      <div className="signal-canvas-wrap">
        <canvas ref={canvasRef} className="signal-canvas"
          onClick={e => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const W  = canvas.offsetWidth;
            const barAreaW = Math.min(W * 0.9, 600);
            const barW = barAreaW / DOMAINS.length;
            const barX0 = (W - barAreaW) / 2;
            const idx = Math.floor((mx - barX0) / barW);
            if (idx >= 0 && idx < DOMAINS.length) {
              const d = DOMAINS[idx];
              setTuned(t => t === d ? null : d);
            }
          }}
        />
        <div className="signal-hint">click a frequency band to tune</div>
      </div>
      <div className="signal-sidebar">
        <div className="cosmos-feat-title">SIGNAL TOWER</div>
        <p className="cosmos-feat-desc">
          Your knowledge broadcasts as radio frequencies. Each domain is a channel. XP = signal strength.
        </p>
        {dominant && (
          <div className="signal-dominant">
            <div className="signal-dominant-label">DOMINANT SIGNAL</div>
            <div className="signal-dominant-domain" style={{ color: dominant.color }}>
              {dominant.domain}
            </div>
            <div className="signal-dominant-xp">{dominant.xp} XP</div>
          </div>
        )}
        <div className="signal-legend">
          {domainData.map(d => (
            <div key={d.domain}
              className={`signal-legend-item${tuned === d.domain ? ' active' : ''}`}
              onClick={() => setTuned(t => t === d.domain ? null : d.domain)}
              style={{ borderColor: tuned === d.domain ? d.color : 'transparent' }}
            >
              <div className="signal-legend-dot" style={{ background: d.color }} />
              <span className="signal-legend-domain">{d.domain}</span>
              <span className="signal-legend-xp" style={{ color: tuned === d.domain ? d.color : undefined }}>
                {d.xp}
              </span>
              {d.recentCapture && <span className="signal-live">LIVE</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
