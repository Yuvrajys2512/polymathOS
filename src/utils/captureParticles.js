export function triggerCaptureParticles(fromEl) {
  const toEl = document.querySelector('.stat-pill');
  if (!fromEl || !toEl) return;

  const fromRect = fromEl.getBoundingClientRect();
  const toRect   = toEl.getBoundingClientRect();

  const canvas = document.createElement('canvas');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  Object.assign(canvas.style, {
    position: 'fixed', inset: '0', width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: '9998',
  });
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const COUNT = 22;
  const DURATION = 900;

  const x0 = fromRect.left + fromRect.width  * 0.5;
  const y0 = fromRect.top  + fromRect.height * 0.5;
  const x1 = toRect.left   + toRect.width    * 0.5;
  const y1 = toRect.top    + toRect.height   * 0.5;

  const particles = Array.from({ length: COUNT }, (_, i) => {
    const spreadX = (Math.random() - 0.5) * fromRect.width * 0.8;
    const spreadY = (Math.random() - 0.5) * fromRect.height * 0.5;
    // bezier control point — arc up and toward target
    const cx = (x0 + x1) * 0.5 + (Math.random() - 0.5) * 140;
    const cy = Math.min(y0, y1) - 60 - Math.random() * 100;
    return {
      sx: x0 + spreadX, sy: y0 + spreadY,
      cx, cy, ex: x1, ey: y1,
      delay: Math.random() * 0.25,
      speed: 0.9 + Math.random() * 0.3,
      size:  2 + Math.random() * 2.5,
      hue:   160 + Math.random() * 40,
    };
  });

  let start = null;

  function draw(ts) {
    if (!start) start = ts;
    const raw = (ts - start) / DURATION;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let allDone = true;
    for (const p of particles) {
      const t = Math.min(1, Math.max(0, (raw - p.delay) * p.speed));
      if (t < 1) allDone = false;
      if (t <= 0) continue;

      // quadratic bezier
      const bx = (1-t)*(1-t)*p.sx + 2*(1-t)*t*p.cx + t*t*p.ex;
      const by = (1-t)*(1-t)*p.sy + 2*(1-t)*t*p.cy + t*t*p.ey;

      const alpha = t < 0.8 ? 1 : 1 - (t - 0.8) / 0.2;
      const size  = p.size * (1 - t * 0.5);

      ctx.save();
      ctx.globalAlpha = alpha * 0.85;
      ctx.shadowColor = `hsl(${p.hue}, 100%, 65%)`;
      ctx.shadowBlur  = 10;
      ctx.fillStyle   = `hsl(${p.hue}, 100%, 72%)`;
      ctx.beginPath();
      ctx.arc(bx, by, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    if (allDone) {
      // pulse the XP pill
      toEl.classList.add('xp-pulse');
      setTimeout(() => toEl.classList.remove('xp-pulse'), 700);
      canvas.remove();
      return;
    }
    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}
