import { useEffect, useRef, useMemo } from 'react';
import { todayStr } from '../../utils/game.js';

function calcWeather(state) {
  const today = todayStr();
  const streak = state.streak?.count || 0;
  const sessions = state.sessions || [];
  const thoughts = state.thoughts || [];
  const habits   = state.habits   || [];
  const sessionsWeek = sessions.filter(s => {
    try { return Date.now() - new Date(s.at).getTime() < 7 * 864e5; } catch { return false; }
  }).length;
  const thoughtsToday = thoughts.filter(t => t.createdAt?.startsWith(today)).length;
  const habitsToday   = habits.filter(h => h.dates?.includes(today)).length;
  const clarity       = Math.min(1, streak / 14);
  const pressure      = Math.min(1, sessionsWeek / 8);
  const precipitation = Math.min(1, thoughtsToday / 15);
  const storminess    = Math.max(0, precipitation - pressure * 0.6 - clarity * 0.4);
  return { clarity, pressure, precipitation, storminess, streak, sessionsWeek, thoughtsToday, habitsToday };
}

function spawnLightning(cx, cy, PR, storminess) {
  const sx = cx + (Math.random() - 0.5) * PR * 0.7;
  const sy = cy - PR * 0.05 + (Math.random() - 0.5) * PR * 0.35;
  const len = PR * (0.35 + storminess * 0.45);
  const pts = [[sx, sy]];
  let x = sx, y = sy;
  const segments = 6 + Math.floor(Math.random() * 7);
  for (let i = 0; i < segments; i++) {
    x += (Math.random() - 0.35) * len / segments * 1.4;
    y += (len / segments) * 0.65 + (Math.random() - 0.5) * 18;
    pts.push([x, y]);
  }
  return pts;
}

export default function CognitiveWeather({ game }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const wxRef     = useRef(null);
  const { state } = game;

  const wx = useMemo(() => calcWeather(state), [state.streak, state.sessions, state.thoughts, state.habits]);
  wxRef.current = wx;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const stars = Array.from({ length: 240 }, () => ({
      x: Math.random(), y: Math.random(),
      r: 0.3 + Math.random() * 1.3,
      twinkle: Math.random() * 6.28,
      speed: 0.6 + Math.random() * 2.2,
    }));

    const clouds = Array.from({ length: 14 }, () => ({
      ox: (Math.random() - 0.5) * 1.55,
      oy: (Math.random() - 0.5) * 1.55,
      r:  0.22 + Math.random() * 0.3,
      sp: 0.14 + Math.random() * 0.22,
      ph: Math.random() * 6.28,
      baseAlpha: 0.38 + Math.random() * 0.28,
      layers: 3 + Math.floor(Math.random() * 3),
    }));

    const windParts = Array.from({ length: 90 }, () => ({
      x: Math.random(),
      y: Math.random(),
      speed: 0.0012 + Math.random() * 0.0028,
      len: 0.025 + Math.random() * 0.045,
      alpha: 0.25 + Math.random() * 0.45,
      vy: (Math.random() - 0.5) * 0.0004,
    }));

    const rainDrops = Array.from({ length: 110 }, () => ({
      ox: (Math.random() - 0.5) * 1.9,
      oy: (Math.random() - 0.5) * 1.9,
      spd: 0.009 + Math.random() * 0.018,
      len: 0.04 + Math.random() * 0.065,
      alpha: 0.4 + Math.random() * 0.4,
    }));

    const lightnings = Array.from({ length: 6 }, () => ({
      timer: Math.random() * 4,
      lifetime: 0,
      pts: [],
    }));

    const pressureSystems = Array.from({ length: 3 }, (_, i) => ({
      ox: (Math.random() - 0.5) * 0.88,
      oy: (Math.random() - 0.5) * 0.88,
      r:  0.17 + Math.random() * 0.22,
      rotSp: 0.003 * (i % 2 ? 1 : -1),
      ph: Math.random() * 6.28,
    }));

    const stormParts = Array.from({ length: 90 }, () => ({
      angle: Math.random() * 6.28,
      rad:   0.04 + Math.random() * 0.3,
      sp:    0.006 + Math.random() * 0.01,
      ry:    0.28 + Math.random() * 0.72,
    }));

    const auroras = [
      { yOff: -0.82, hue: 155, w: 0.07, ph: 0.0,  sp: 0.28, amp: 0.033 },
      { yOff: -0.70, hue: 175, w: 0.06, ph: 1.1,  sp: 0.35, amp: 0.028 },
      { yOff: -0.58, hue: 195, w: 0.05, ph: 2.3,  sp: 0.42, amp: 0.022 },
      { yOff:  0.58, hue: 190, w: 0.06, ph: 0.8,  sp: 0.31, amp: 0.027 },
      { yOff:  0.72, hue: 165, w: 0.07, ph: 1.8,  sp: 0.25, amp: 0.035 },
    ];

    const ro = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    });
    ro.observe(canvas);
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    function tick(now) {
      const W = canvas.width, H = canvas.height;
      const cx = W / 2, cy = H / 2;
      const PR = Math.min(W, H) * 0.41;
      const t  = now * 0.001;
      const wx = wxRef.current;

      // Space background
      ctx.fillStyle = '#030508';
      ctx.fillRect(0, 0, W, H);

      // Stars
      for (const s of stars) {
        const alpha = 0.35 + Math.sin(t * s.speed + s.twinkle) * 0.28;
        ctx.globalAlpha = Math.max(0.08, alpha);
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, 6.28);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Outer atmosphere halo
      const atmR = PR * 1.38;
      const outerGlow = ctx.createRadialGradient(cx, cy, PR * 0.9, cx, cy, atmR);
      const atmTeal = wx.clarity > 0.4;
      outerGlow.addColorStop(0, atmTeal ? `rgba(0,200,160,${0.07 + wx.clarity * 0.11})` : `rgba(40,90,210,${0.06 + wx.pressure * 0.1})`);
      outerGlow.addColorStop(0.6, atmTeal ? `rgba(0,160,130,${0.03 + wx.clarity * 0.05})` : `rgba(30,60,160,0.04)`);
      outerGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = outerGlow;
      ctx.beginPath(); ctx.arc(cx, cy, atmR, 0, 6.28); ctx.fill();

      // Planet disc
      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, PR, 0, 6.28); ctx.clip();

      // Planet base — rich deep blue/purple, not near-black
      const bg = ctx.createRadialGradient(cx - PR * 0.25, cy - PR * 0.25, 0, cx, cy, PR * 1.05);
      if (wx.storminess > 0.35) {
        bg.addColorStop(0, '#1e103c');
        bg.addColorStop(0.45, '#14082a');
        bg.addColorStop(1, '#08040f');
      } else if (wx.clarity > 0.5) {
        bg.addColorStop(0, '#103a6e');
        bg.addColorStop(0.45, '#08275a');
        bg.addColorStop(1, '#040e28');
      } else {
        bg.addColorStop(0, '#0c2e5c');
        bg.addColorStop(0.45, '#081e44');
        bg.addColorStop(1, '#040c22');
      }
      ctx.fillStyle = bg; ctx.fillRect(cx - PR, cy - PR, PR * 2, PR * 2);

      // Subtle latitude lines
      ctx.save();
      ctx.globalAlpha = 0.05;
      ctx.strokeStyle = '#4488cc';
      ctx.lineWidth = 0.5;
      for (let lat = 1; lat < 5; lat++) {
        const ly = cy + (lat - 2.5) * PR * 0.4;
        const halfW = Math.sqrt(Math.max(0, PR * PR - (ly - cy) * (ly - cy)));
        if (halfW < 4) continue;
        ctx.beginPath();
        ctx.ellipse(cx, ly, halfW, halfW * 0.18, 0, 0, 6.28);
        ctx.stroke();
      }
      ctx.restore();

      // Aurora bands
      const auroraStrength = Math.max(wx.clarity, wx.pressure * 0.6);
      if (auroraStrength > 0.04) {
        ctx.save();
        for (const au of auroras) {
          const yBase = cy + au.yOff * PR;
          const bandH = au.w * PR;
          ctx.globalAlpha = auroraStrength * 0.55;
          for (let xi = -PR; xi <= PR; xi += 3) {
            const wave = Math.sin(xi * 0.025 + t * au.sp + au.ph) * au.amp * PR;
            const yp = yBase + wave;
            if (Math.abs(yp - cy) > PR * 0.99) continue;
            const ag = ctx.createLinearGradient(0, yp - bandH / 2, 0, yp + bandH / 2);
            ag.addColorStop(0, 'transparent');
            ag.addColorStop(0.5, `hsla(${au.hue},100%,62%,0.72)`);
            ag.addColorStop(1, 'transparent');
            ctx.fillStyle = ag;
            ctx.fillRect(cx + xi, yp - bandH / 2, 3, bandH + 1);
          }
        }
        ctx.restore();
      }

      // Sun / clarity glow
      if (wx.clarity > 0.04) {
        const sunX = cx - PR * 0.12, sunY = cy - PR * 0.52;
        const sunR = PR * (0.18 + wx.clarity * 0.62);
        const sg = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunR);
        sg.addColorStop(0, `rgba(255,242,190,${Math.min(0.92, wx.clarity * 0.88)})`);
        sg.addColorStop(0.12, `rgba(255,210,110,${wx.clarity * 0.55})`);
        sg.addColorStop(0.45, `rgba(0,210,170,${wx.clarity * 0.18})`);
        sg.addColorStop(1, 'transparent');
        ctx.fillStyle = sg;
        ctx.beginPath(); ctx.arc(sunX, sunY, sunR, 0, 6.28); ctx.fill();

        if (wx.clarity > 0.3) {
          ctx.save();
          ctx.globalAlpha = wx.clarity * 0.065;
          const rayCount = 14;
          for (let ri = 0; ri < rayCount; ri++) {
            const ra = (ri / rayCount) * 6.28 + t * 0.035;
            const rLen = PR * (0.55 + (ri % 4) * 0.22);
            ctx.beginPath();
            ctx.moveTo(sunX, sunY);
            ctx.lineTo(sunX + Math.cos(ra) * rLen, sunY + Math.sin(ra) * rLen);
            ctx.strokeStyle = 'rgba(255,230,120,1)';
            ctx.lineWidth = PR * 0.11;
            ctx.stroke();
          }
          ctx.restore();
        }
      }

      // Pressure ring systems
      if (wx.pressure > 0.07) {
        pressureSystems.forEach((ps, pi) => {
          if (pi >= Math.ceil(wx.pressure * 3)) return;
          const bx = cx + ps.ox * PR * (0.38 + wx.pressure * 0.32);
          const by = cy + ps.oy * PR * (0.38 + wx.pressure * 0.32);
          const rot = t * ps.rotSp * 480 + ps.ph;
          const baseOp = 0.14 + wx.pressure * 0.28;
          for (let ring = 0; ring < 5; ring++) {
            const rr = ps.r * PR * (0.75 + ring * 0.38);
            if (rr > PR * 0.95) break;
            ctx.beginPath();
            ctx.setLineDash([4, 7]);
            ctx.lineDashOffset = -rot * (ring + 1) * 14;
            ctx.arc(bx, by, rr, 0, 6.28);
            const op = Math.max(0, baseOp - ring * 0.022);
            ctx.strokeStyle = `rgba(100,175,255,${op.toFixed(3)})`;
            ctx.lineWidth = 1.1 - ring * 0.14;
            ctx.stroke();
            ctx.setLineDash([]);
          }
          const dg = ctx.createRadialGradient(bx, by, 0, bx, by, ps.r * PR * 0.48);
          dg.addColorStop(0, `rgba(80,155,255,${wx.pressure * 0.1})`);
          dg.addColorStop(1, 'transparent');
          ctx.fillStyle = dg;
          ctx.beginPath(); ctx.arc(bx, by, ps.r * PR * 0.48, 0, 6.28); ctx.fill();
        });
      }

      // Cloud blobs — visible
      clouds.forEach(c => {
        const bx = cx + c.ox * PR, by = cy + c.oy * PR;
        const drift = Math.sin(t * c.sp + c.ph) * PR * 0.038;
        const baseR = c.r * PR;
        const opacity = c.baseAlpha * (0.45 + wx.precipitation * 0.85);
        for (let li = 0; li < c.layers; li++) {
          const lr = baseR * (1 + li * 0.28) * (1 + wx.precipitation * 0.45);
          const lx = bx + drift + li * 7;
          const la = opacity / (li + 1);
          if (Math.hypot(lx - cx, by - cy) > PR * 1.04) continue;
          const cg = ctx.createRadialGradient(lx, by, 0, lx, by, lr);
          cg.addColorStop(0, `rgba(205,222,255,${la})`);
          cg.addColorStop(0.55, `rgba(165,190,245,${la * 0.48})`);
          cg.addColorStop(1, 'transparent');
          ctx.fillStyle = cg;
          ctx.beginPath(); ctx.arc(lx, by, lr, 0, 6.28); ctx.fill();
        }
      });

      // Wind stream particles
      if (wx.pressure > 0.04 || wx.precipitation > 0.08) {
        const windPower = wx.pressure * 0.55 + wx.precipitation * 0.3;
        ctx.save();
        for (const w of windParts) {
          w.x += w.speed * (0.25 + wx.pressure * 1.6);
          w.y += w.vy;
          if (w.x > 1) w.x -= 1;
          if (w.y < 0) w.y += 1; if (w.y > 1) w.y -= 1;
          const wx2 = w.x * W, wy2 = w.y * H;
          if (Math.hypot(wx2 - cx, wy2 - cy) > PR) continue;
          ctx.globalAlpha = windPower * w.alpha * 0.55;
          ctx.beginPath();
          ctx.moveTo(wx2, wy2);
          ctx.lineTo(wx2 - w.len * W * (0.25 + wx.pressure * 0.75), wy2 + w.vy * H * 4);
          ctx.strokeStyle = 'rgba(160,205,255,1)';
          ctx.lineWidth = 0.55;
          ctx.stroke();
        }
        ctx.restore();
      }

      // Rain streaks
      if (wx.precipitation > 0.06) {
        ctx.save();
        for (const rd of rainDrops) {
          rd.oy += rd.spd;
          if (rd.oy > 1) rd.oy -= 1.85;
          const rx = cx + rd.ox * PR, ry = cy + rd.oy * PR;
          if (Math.hypot(rx - cx, ry - cy) > PR * 0.97) continue;
          ctx.globalAlpha = wx.precipitation * rd.alpha * 0.65;
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx + rd.len * PR * 0.28, ry + rd.len * PR);
          ctx.strokeStyle = 'rgba(180,215,255,1)';
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }
        ctx.restore();
      }

      // Storm vortex
      if (wx.storminess > 0.07) {
        const sCx = cx + PR * 0.1, sCy = cy + PR * 0.16;
        for (const p of stormParts) {
          p.angle += p.sp * wx.storminess * 3.2;
          const r2 = p.rad * PR * wx.storminess * 0.88;
          const px2 = sCx + Math.cos(p.angle) * r2;
          const py2 = sCy + Math.sin(p.angle) * r2 * p.ry;
          ctx.beginPath(); ctx.arc(px2, py2, 1.4 + wx.storminess * 1.8, 0, 6.28);
          ctx.fillStyle = `rgba(255,75,75,${wx.storminess * 0.68})`;
          ctx.fill();
        }
        const sgr = ctx.createRadialGradient(sCx, sCy, 0, sCx, sCy, PR * 0.32 * wx.storminess);
        sgr.addColorStop(0, `rgba(220,45,45,${wx.storminess * 0.2})`);
        sgr.addColorStop(1, 'transparent');
        ctx.fillStyle = sgr;
        ctx.beginPath(); ctx.arc(sCx, sCy, PR * 0.32 * wx.storminess, 0, 6.28); ctx.fill();
      }

      // Lightning bolts
      if (wx.storminess > 0.1) {
        for (const bolt of lightnings) {
          bolt.timer -= 0.016;
          if (bolt.lifetime > 0) {
            bolt.lifetime -= 0.016;
            if (bolt.pts.length > 1) {
              ctx.save();
              ctx.globalAlpha = Math.min(1, bolt.lifetime * 6);
              ctx.shadowBlur = 16;
              ctx.shadowColor = '#c080ff';
              // bright core
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 1.2;
              ctx.beginPath();
              ctx.moveTo(bolt.pts[0][0], bolt.pts[0][1]);
              for (let bi = 1; bi < bolt.pts.length; bi++) ctx.lineTo(bolt.pts[bi][0], bolt.pts[bi][1]);
              ctx.stroke();
              // purple glow
              ctx.strokeStyle = 'rgba(200,150,255,0.75)';
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.moveTo(bolt.pts[0][0], bolt.pts[0][1]);
              for (let bi = 1; bi < bolt.pts.length; bi++) ctx.lineTo(bolt.pts[bi][0], bolt.pts[bi][1]);
              ctx.stroke();
              ctx.restore();
            }
          }
          if (bolt.timer <= 0 && wx.storminess > 0.1) {
            bolt.timer = 1.2 + Math.random() * 2.8 * (1.1 - wx.storminess);
            bolt.lifetime = 0.1 + Math.random() * 0.18;
            bolt.pts = spawnLightning(cx, cy, PR, wx.storminess);
          }
        }
      }

      ctx.restore(); // end planet clip

      // Planet rim glow
      ctx.save();
      ctx.beginPath(); ctx.arc(cx, cy, PR, 0, 6.28);
      let rimColor;
      if (wx.clarity > 0.5) rimColor = `rgba(0,220,180,${0.32 + wx.clarity * 0.28})`;
      else if (wx.storminess > 0.25) rimColor = `rgba(200,80,80,${0.18 + wx.storminess * 0.28})`;
      else rimColor = `rgba(60,130,255,${0.22 + wx.pressure * 0.22})`;
      ctx.strokeStyle = rimColor;
      ctx.lineWidth = 2.2;
      ctx.shadowBlur = 14;
      ctx.shadowColor = rimColor;
      ctx.stroke();
      ctx.restore();

      // Precipitation orbit ring
      if (wx.precipitation > 0.07) {
        const nDrops = Math.floor(wx.precipitation * 32);
        for (let d2 = 0; d2 < nDrops; d2++) {
          const ang = ((d2 / nDrops) * 6.28 + t * 0.18) % 6.28;
          const orbitR = PR * (1.03 + ((d2 * 29) % 100) / 900);
          const px2 = cx + Math.cos(ang) * orbitR;
          const py2 = cy + Math.sin(ang) * orbitR;
          ctx.beginPath(); ctx.arc(px2, py2, 1.4, 0, 6.28);
          ctx.fillStyle = `rgba(140,195,255,${wx.precipitation * 0.72})`;
          ctx.fill();
        }
      }

      // Canvas HUD readout
      ctx.save();
      ctx.font = '10px monospace';
      ctx.fillStyle = 'rgba(0,217,177,0.45)';
      ctx.fillText(`LAT: ${(wx.clarity * 90).toFixed(1)}°N`, 12, 18);
      ctx.fillText(`LON: ${(wx.pressure * 180).toFixed(1)}°E`, 12, 31);
      ctx.fillText(`ALT: ${Math.round(3800 + wx.precipitation * 6200)}m`, 12, 44);
      ctx.fillText(`STORM: ${Math.round(wx.storminess * 100)}%`, 12, 57);
      ctx.restore();

      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, []);

  const weatherLabel = () => {
    if (wx.storminess > 0.4)    return 'COGNITIVE STORM';
    if (wx.clarity > 0.7)       return 'CRYSTAL CLARITY';
    if (wx.pressure > 0.6)      return 'HIGH PRESSURE FOCUS';
    if (wx.precipitation > 0.5) return 'HEAVY THOUGHT FLOW';
    return 'PARTLY CLOUDY';
  };

  return (
    <div className="weather-root">
      <div className="weather-canvas-wrap">
        <canvas ref={canvasRef} className="weather-canvas" />
        <div className="weather-status">{weatherLabel()}</div>
      </div>
      <div className="weather-sidebar">
        <div className="cosmos-feat-title">COGNITIVE WEATHER</div>
        <p className="cosmos-feat-desc">
          Your mental climate system. Streak builds clarity. Sessions spawn pressure fronts. Thoughts are precipitation.
        </p>
        <div className="weather-metrics">
          {[
            { label: 'CLARITY',       val: wx.clarity,       color: '#fbbf24', tip: `${wx.streak}d streak` },
            { label: 'PRESSURE',      val: wx.pressure,      color: '#60a5fa', tip: `${wx.sessionsWeek} sessions/wk` },
            { label: 'PRECIPITATION', val: wx.precipitation, color: '#a78bfa', tip: `${wx.thoughtsToday} thoughts today` },
            { label: 'STORMINESS',    val: wx.storminess,    color: '#f43f5e', tip: 'chaos index' },
          ].map(m => (
            <div key={m.label} className="weather-metric">
              <div className="weather-metric-head">
                <span className="weather-metric-label">{m.label}</span>
                <span className="weather-metric-tip">{m.tip}</span>
              </div>
              <div className="weather-bar-track">
                <div className="weather-bar-fill"
                  style={{ width: `${m.val * 100}%`, background: m.color, boxShadow: `0 0 8px ${m.color}` }} />
              </div>
              <span className="weather-metric-pct">{Math.round(m.val * 100)}%</span>
            </div>
          ))}
        </div>
        <div className="weather-forecast">
          <div className="weather-fc-title">FORECAST</div>
          <p className="weather-fc-body">
            {wx.clarity > 0.6 && wx.pressure > 0.4
              ? 'Optimal flow state. High-pressure clarity front moving in.'
              : wx.storminess > 0.3
              ? 'Cognitive storm detected. A focus session will stabilize pressure.'
              : wx.precipitation > 0.5
              ? 'Dense thought cloud. Triage and process captured signals.'
              : 'Mild conditions. Building your streak will clear the cognitive skies.'}
          </p>
        </div>
      </div>
    </div>
  );
}
