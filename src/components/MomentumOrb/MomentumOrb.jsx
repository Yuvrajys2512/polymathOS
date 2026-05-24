import { useEffect, useRef } from 'react';

const RINGS = [
  { tiltX: 0,          tiltZ: 0,           speedMul: 1.0 },
  { tiltX: Math.PI/2,  tiltZ: 0,           speedMul: 0.7 },
  { tiltX: Math.PI/4,  tiltZ: Math.PI/4,   speedMul: 1.3 },
];
const N = 64;

function rotX(x, y, z, a) {
  return [x, y * Math.cos(a) - z * Math.sin(a), y * Math.sin(a) + z * Math.cos(a)];
}
function rotY(x, y, z, a) {
  return [x * Math.cos(a) + z * Math.sin(a), y, -x * Math.sin(a) + z * Math.cos(a)];
}
function rotZ(x, y, z, a) {
  return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a), z];
}

function ringPoints(tiltX, tiltZ, yAngle, R) {
  const pts = [];
  for (let i = 0; i <= N; i++) {
    const a = (i / N) * Math.PI * 2;
    let [x, y, z] = [R * Math.cos(a), R * Math.sin(a), 0];
    ;[x, y, z] = rotX(x, y, z, tiltX);
    ;[x, y, z] = rotZ(x, y, z, tiltZ);
    ;[x, y, z] = rotY(x, y, z, yAngle);
    const fov = 500;
    const scale = fov / (fov + z + 200);
    pts.push({ sx: x * scale, sy: y * scale, z, scale });
  }
  return pts;
}

export default function MomentumOrb({ momentum = 0 }) {
  const canvasRef = useRef(null);
  const mouseRef  = useRef({ x: 0.5, y: 0.5 });
  const angleRef  = useRef(0);
  const rafRef    = useRef(null);

  useEffect(() => {
    const h = e => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };
    window.addEventListener('mousemove', h, { passive: true });
    return () => window.removeEventListener('mousemove', h);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;

    const norm = Math.max(0, Math.min(100, momentum)) / 100;
    const baseSpeed = 0.003 + norm * 0.014;

    // Color band
    const r = norm >= 0.6 ? 74  : norm >= 0.3 ? 251 : 248;
    const g = norm >= 0.6 ? 222 : norm >= 0.3 ? 191 : 113;
    const b = norm >= 0.6 ? 128 : norm >= 0.3 ? 36  : 113;
    const glowIntensity = 6 + norm * 22;
    const lineAlpha     = 0.18 + norm * 0.45;
    const R = 90 + norm * 25;

    function frame() {
      ctx.clearRect(0, 0, W, H);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const parallaxX = (mx - 0.5) * 0.5;
      const parallaxY = (my - 0.5) * 0.4;

      angleRef.current += baseSpeed;

      RINGS.forEach(({ tiltX, tiltZ, speedMul }) => {
        const pts = ringPoints(
          tiltX + parallaxY,
          tiltZ + parallaxX,
          angleRef.current * speedMul,
          R
        );

        ctx.save();
        ctx.translate(cx, cy);
        ctx.beginPath();
        pts.forEach((p, i) => {
          if (i === 0) ctx.moveTo(p.sx, p.sy);
          else ctx.lineTo(p.sx, p.sy);
        });
        ctx.closePath();
        ctx.strokeStyle = `rgba(${r},${g},${b},${lineAlpha})`;
        ctx.lineWidth   = 1;
        ctx.shadowColor = `rgb(${r},${g},${b})`;
        ctx.shadowBlur  = glowIntensity;
        ctx.stroke();

        // Glowing vertices every 8th point
        pts.forEach((p, i) => {
          if (i % 8 !== 0) return;
          ctx.beginPath();
          ctx.arc(p.sx, p.sy, 1.5 * p.scale, 0, Math.PI * 2);
          ctx.fillStyle   = `rgba(${r},${g},${b},${lineAlpha * 1.6})`;
          ctx.shadowBlur  = glowIntensity * 1.5;
          ctx.fill();
        });
        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [momentum]);

  return (
    <canvas
      ref={canvasRef}
      className="momentum-orb"
      width={340}
      height={340}
    />
  );
}
