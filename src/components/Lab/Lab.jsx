import { useState, useRef, useEffect } from 'react';
import { groqChat } from '../../utils/cosmosAI.js';
import { todayStr } from '../../utils/game.js';

const ACCENT = '#00d9b1';

function localVerdict(exp) {
  const vals = exp.logs.map(l => l.value);
  if (vals.length === 0) return 'Not enough data to draw a conclusion.';
  const avg = vals.reduce((s, v) => s + v, 0) / vals.length;
  const delta = vals[vals.length - 1] - vals[0];
  const dir = Math.abs(delta) < 0.01 ? 'held flat' : delta > 0 ? `rose by ${delta.toFixed(1)}` : `fell by ${Math.abs(delta).toFixed(1)}`;
  const supports = delta > 0 ? 'leans in favor of your hypothesis' : delta < 0 ? 'runs against your hypothesis' : 'is inconclusive';
  return `Across ${vals.length} data points, ${exp.metric} averaged ${avg.toFixed(1)} and ${dir} from start to finish. The trend ${supports}. Collect more points across varied conditions to firm up the signal.`;
}

// ── Canvas line graph that animates itself in ──
function LabGraph({ logs, color }) {
  const ref = useRef(null);
  const raf = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const pts = logs.map(l => l.value);
    let start = null;
    const DUR = 650;

    function draw(ts) {
      if (start === null) start = ts;
      const progress = Math.min(1, (ts - start) / DUR);
      const W = canvas.offsetWidth || 480, H = canvas.offsetHeight || 170;
      if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
        canvas.width = W * dpr; canvas.height = H * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      const padL = 30, padR = 14, padT = 16, padB = 22;
      const gw = W - padL - padR, gh = H - padT - padB;
      let lo = Math.min(...pts), hi = Math.max(...pts);
      if (!isFinite(lo)) { lo = 0; hi = 1; }
      if (lo === hi) { lo -= 1; hi += 1; }
      const X = i => padL + (pts.length <= 1 ? gw / 2 : (i / (pts.length - 1)) * gw);
      const Y = v => padT + gh - ((v - lo) / (hi - lo)) * gh;

      // gridlines
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.font = '9px monospace';
      ctx.fillStyle = 'rgba(255,255,255,0.28)';
      for (let g = 0; g <= 3; g++) {
        const yy = padT + (gh / 3) * g;
        ctx.beginPath(); ctx.moveTo(padL, yy); ctx.lineTo(W - padR, yy); ctx.stroke();
        const val = hi - ((hi - lo) / 3) * g;
        ctx.fillText(val.toFixed(0), 4, yy + 3);
      }

      if (pts.length === 0) {
        raf.current = requestAnimationFrame(draw);
        return;
      }

      const shown = pts.length <= 1 ? pts.length : 1 + (pts.length - 1) * progress;
      const full = Math.floor(shown);
      const frac = shown - full;

      // area fill
      ctx.beginPath();
      ctx.moveTo(X(0), Y(pts[0]));
      for (let i = 1; i <= Math.min(full, pts.length - 1); i++) ctx.lineTo(X(i), Y(pts[i]));
      if (frac > 0 && full < pts.length - 1) {
        const ix = X(full) + (X(full + 1) - X(full)) * frac;
        const iy = Y(pts[full]) + (Y(pts[full + 1]) - Y(pts[full])) * frac;
        ctx.lineTo(ix, iy);
      }
      const lastX = (frac > 0 && full < pts.length - 1)
        ? X(full) + (X(full + 1) - X(full)) * frac
        : X(Math.min(full, pts.length - 1));
      ctx.lineTo(lastX, padT + gh);
      ctx.lineTo(X(0), padT + gh);
      ctx.closePath();
      const grd = ctx.createLinearGradient(0, padT, 0, padT + gh);
      grd.addColorStop(0, color + '44');
      grd.addColorStop(1, color + '02');
      ctx.fillStyle = grd;
      ctx.fill();

      // line
      ctx.beginPath();
      ctx.moveTo(X(0), Y(pts[0]));
      for (let i = 1; i <= Math.min(full, pts.length - 1); i++) ctx.lineTo(X(i), Y(pts[i]));
      if (frac > 0 && full < pts.length - 1) {
        const ix = X(full) + (X(full + 1) - X(full)) * frac;
        const iy = Y(pts[full]) + (Y(pts[full + 1]) - Y(pts[full])) * frac;
        ctx.lineTo(ix, iy);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10; ctx.shadowColor = color;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // points
      for (let i = 0; i <= Math.min(full, pts.length - 1); i++) {
        ctx.beginPath();
        ctx.arc(X(i), Y(pts[i]), 3, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.shadowBlur = 6; ctx.shadowColor = color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      if (progress < 1) raf.current = requestAnimationFrame(draw);
    }

    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [logs, color]);

  return <canvas ref={ref} className="lab-graph" />;
}

export default function Lab({ game }) {
  const { state } = game;
  const experiments = state.experiments || [];

  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: '', hypothesis: '', variable: '', metric: '' });
  const [selId, setSelId] = useState(experiments[0]?.id || null);
  const [logVal, setLogVal] = useState('');
  const [logNote, setLogNote] = useState('');
  const [busy, setBusy] = useState(false);

  const sel = experiments.find(e => e.id === selId) || experiments[0] || null;
  const today = todayStr();

  function create() {
    if (!form.title.trim() || !form.metric.trim()) return;
    game.addExperiment({
      title: form.title.trim(),
      hypothesis: form.hypothesis.trim(),
      variable: form.variable.trim(),
      metric: form.metric.trim(),
    });
    setForm({ title: '', hypothesis: '', variable: '', metric: '' });
    setCreating(false);
  }

  function logToday() {
    if (logVal === '' || isNaN(Number(logVal)) || !sel) return;
    game.logExperiment(sel.id, Number(logVal), logNote.trim());
    setLogVal(''); setLogNote('');
  }

  async function conclude() {
    if (!sel || busy) return;
    setBusy(true);
    let verdict;
    try {
      const series = sel.logs.map(l => `${l.date}: ${l.value}${l.note ? ` (${l.note})` : ''}`).join('\n');
      const raw = await groqChat(state.groqKey,
        `You are a rigorous personal-science analyst reviewing an n=1 self-experiment.\n` +
        `Title: ${sel.title}\nHypothesis: ${sel.hypothesis}\nVariable changed: ${sel.variable}\nMetric measured: ${sel.metric}\n` +
        `Daily data:\n${series}\n\n` +
        `In 2-3 sentences: state whether the data supports the hypothesis, describe the trend using the actual numbers, and give one concrete recommendation. Be direct. No preamble, no markdown.`,
        { maxTokens: 240 });
      verdict = raw.trim() || localVerdict(sel);
    } catch {
      verdict = localVerdict(sel);
    }
    game.concludeExperiment(sel.id, verdict);
    setBusy(false);
  }

  const loggedToday = sel?.logs?.some(l => l.date === today);

  return (
    <div className="lab-root">
      <div className="lab-list">
        <button className="lab-new-btn" onClick={() => setCreating(c => !c)}>
          {creating ? '× CANCEL' : '+ NEW EXPERIMENT'}
        </button>

        {creating && (
          <div className="lab-create">
            <input className="lab-in" placeholder="Title — e.g. Cold showers & focus"
              value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <input className="lab-in" placeholder="Hypothesis — what you expect to happen"
              value={form.hypothesis} onChange={e => setForm({ ...form, hypothesis: e.target.value })} />
            <input className="lab-in" placeholder="Variable — what you're changing"
              value={form.variable} onChange={e => setForm({ ...form, variable: e.target.value })} />
            <input className="lab-in" placeholder="Metric — what you measure (e.g. focus 1–10)"
              value={form.metric} onChange={e => setForm({ ...form, metric: e.target.value })} />
            <button className="primary" onClick={create}>BEGIN TRIAL</button>
          </div>
        )}

        {experiments.length === 0 && !creating && (
          <div className="lab-empty">
            <div className="lab-empty-icon">⏣</div>
            <div className="lab-empty-body">Run experiments on yourself. Form a hypothesis, change one variable, log the data, let the verdict develop.</div>
          </div>
        )}

        {experiments.map(e => (
          <button
            key={e.id}
            className={`lab-card${sel?.id === e.id ? ' active' : ''}${e.status === 'concluded' ? ' done' : ''}`}
            onClick={() => setSelId(e.id)}
          >
            <span className="lab-card-status">{e.status === 'concluded' ? '✓' : '◌'}</span>
            <span className="lab-card-title">{e.title}</span>
            <span className="lab-card-n">{e.logs?.length || 0} pts</span>
          </button>
        ))}
      </div>

      <div className="lab-detail">
        {!sel ? (
          <div className="lab-detail-empty">Select or start an experiment.</div>
        ) : (
          <>
            <div className="lab-detail-head">
              <span className={`lab-badge ${sel.status}`}>{sel.status === 'concluded' ? 'CONCLUDED' : 'RUNNING'}</span>
              <span className="lab-detail-title">{sel.title}</span>
              <button className="lab-del" onClick={() => { game.deleteExperiment(sel.id); setSelId(null); }}>×</button>
            </div>

            <div className="lab-meta">
              {sel.hypothesis && <div className="lab-meta-row"><span>HYPOTHESIS</span>{sel.hypothesis}</div>}
              {sel.variable && <div className="lab-meta-row"><span>VARIABLE</span>{sel.variable}</div>}
              <div className="lab-meta-row"><span>METRIC</span>{sel.metric}</div>
            </div>

            <LabGraph logs={sel.logs || []} color={ACCENT} />

            {sel.status === 'running' && (
              <div className="lab-log">
                <input
                  className="lab-log-val" type="number" step="any"
                  placeholder={loggedToday ? 'Update today' : 'Value'}
                  value={logVal} onChange={e => setLogVal(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && logToday()}
                />
                <input
                  className="lab-log-note" placeholder="Note (optional)"
                  value={logNote} onChange={e => setLogNote(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && logToday()}
                />
                <button className="lab-log-btn" onClick={logToday}>LOG</button>
              </div>
            )}

            {(sel.logs?.length || 0) > 0 && (
              <div className="lab-points">
                {sel.logs.map(l => (
                  <span key={l.date} className="lab-point" title={l.note || ''}>
                    {l.date.slice(5)} · <b>{l.value}</b>
                  </span>
                ))}
              </div>
            )}

            {sel.status === 'running' ? (
              <button
                className="lab-conclude"
                disabled={(sel.logs?.length || 0) < 2 || busy}
                onClick={conclude}
              >
                {busy ? 'ANALYZING…' : (sel.logs?.length || 0) < 2 ? 'NEED 2+ DATA POINTS' : 'CONCLUDE EXPERIMENT'}
              </button>
            ) : (
              <div className="lab-verdict">
                <div className="lab-verdict-label">VERDICT</div>
                <p className="lab-verdict-text">{sel.conclusion}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
