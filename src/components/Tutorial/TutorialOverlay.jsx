import { useState } from 'react';

// ── Slide Visuals ─────────────────────────────────────────────────────────────

function VisWelcome() {
  return (
    <div className="tut-vis">
      <div className="tut-mock-topbar">
        <span className="tut-mock-pill cyan">Lv 1  ·  0 XP</span>
        <span className="tut-mock-pill amber">0-day streak</span>
        <span className="tut-mock-pill muted">0 captures</span>
      </div>
      <div className="tut-mock-capture">
        <div className="tut-mock-input">type anything on your mind…</div>
        <div className="tut-mock-hint">↵  capture  ·  AI classifies</div>
      </div>
      <div className="tut-mock-thoughts">
        {[
          { color: '#00d9b1', domain: 'AI/ML',   text: 'neural nets and sleep rhythms' },
          { color: '#a78bfa', domain: 'Physics', text: 'entropy in open systems' },
          { color: '#60a5fa', domain: 'Writing', text: 'structure of long essays' },
        ].map(t => (
          <div key={t.domain} className="tut-mock-row">
            <span className="tut-mock-dot" style={{ background: t.color }} />
            <span className="tut-mock-text">{t.text}</span>
            <span className="tut-mock-chip" style={{ color: t.color, borderColor: t.color + '44' }}>{t.domain}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function VisCapture() {
  return (
    <div className="tut-vis">
      <div className="tut-classify-flow">
        <div className="tut-classify-input">
          <div className="tut-classify-label">You type anything:</div>
          <div className="tut-classify-quote">"I wonder if quantum effects play a role in how neurons bind into conscious experience…"</div>
        </div>
        <div className="tut-classify-arrow">
          <div className="tut-arrow-bar" />
          <span className="tut-arrow-chip">AI classifies</span>
          <div className="tut-arrow-bar" />
        </div>
        <div className="tut-classify-result">
          <div className="tut-result-chips">
            <span className="tut-mock-chip" style={{ color: '#a78bfa', borderColor: '#a78bfa44' }}>Physics</span>
            <span className="tut-mock-chip" style={{ color: '#60a5fa', borderColor: '#60a5fa44' }}>idea</span>
            <span className="tut-mock-chip" style={{ color: '#fbbf24', borderColor: '#fbbf2444' }}>P2</span>
          </div>
          <div className="tut-result-insight">↳ "Explores quantum effects as a mechanism for consciousness in biological systems"</div>
          <div className="tut-result-xp">+10 XP  ·  Physics domain</div>
        </div>
      </div>
    </div>
  );
}

function VisThoughts() {
  const thoughts = [
    { color: '#00d9b1', domain: 'AI/ML',    type: 'idea',    pri: 'P1', text: 'attention mechanism visualizer for transformers' },
    { color: '#a78bfa', domain: 'Physics',  type: 'question',pri: 'P2', text: 'does entropy apply to information storage?' },
    { color: '#60a5fa', domain: 'Writing',  type: 'task',    pri: 'P1', text: 'finish chapter 3 outline before Friday' },
    { color: '#fbbf24', domain: 'Business', type: 'insight', pri: 'P3', text: 'pricing anchoring matters more than the price itself' },
  ];
  return (
    <div className="tut-vis">
      <div className="tut-thoughts-header">
        <div className="tut-filter-row">
          <span className="tut-filter-chip active">All</span>
          <span className="tut-filter-chip">AI/ML</span>
          <span className="tut-filter-chip">Physics</span>
          <span className="tut-filter-chip">Writing</span>
        </div>
        <div className="tut-filter-row">
          <span className="tut-filter-chip active">All types</span>
          <span className="tut-filter-chip">idea</span>
          <span className="tut-filter-chip">task</span>
        </div>
      </div>
      <div className="tut-thoughts-list">
        {thoughts.map(t => (
          <div key={t.text} className="tut-thought-card">
            <div className="tut-thought-top">
              <span className="tut-mock-dot" style={{ background: t.color }} />
              <span className="tut-mock-chip" style={{ color: t.color, borderColor: t.color + '44' }}>{t.domain}</span>
              <span className="tut-mock-chip muted">{t.type}</span>
              <span className="tut-mock-chip muted">{t.pri}</span>
            </div>
            <div className="tut-thought-body">{t.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Brain Map visual — SVG knowledge graph ────────────────────────────────────
const BM_CLUSTERS = [
  {
    color: '#a855f7',
    nodes: [
      [152,72,'consciousness'],[170,78,'quantum mind'],[182,90,'free will'],
      [174,104,'identity'],[190,98,'emergence'],[200,84,'reality'],
      [178,117,'paradox'],[160,120,'time'],[194,114,'entropy'],
      [167,130,'ethics'],[186,127,'ontology'],
    ],
  },
  {
    color: '#f97316',
    nodes: [
      [462,52,'pricing'],[478,48,'moats'],[492,60,'CAC'],
      [504,70,'retention'],[488,80,'growth'],[474,74,'LTV'],
    ],
  },
  {
    color: '#2dd4bf',
    nodes: [
      [230,164,'attention'],[248,172,'backprop'],[262,184,'transformers'],
      [274,177,'embeddings'],[288,184,'RLHF'],[272,197,'sparse'],
      [260,202,'inference'],[284,210,'gradients'],[300,200,'activation'],
      [294,217,'LLM'],[270,222,'fine-tune'],[252,217,'RAG'],
      [310,207,'LoRA'],[257,230,'tokenize'],[278,234,'neurons'],
    ],
  },
  {
    color: '#eab308',
    nodes: [
      [350,180,'orbital'],[364,174,'entropy'],[378,184,'protein'],
      [372,197,'dark matter'],[358,198,'field eq.'],[364,187,'quanta'],
    ],
  },
  {
    color: '#f472b6',
    nodes: [
      [350,254,'narrative'],[364,260,'structure'],[380,267,'voice'],
      [394,260,'rhythm'],[382,272,'drafting'],[366,274,'clarity'],
      [352,268,'tension'],[392,280,'arc'],[410,267,'hook'],
      [380,284,'theme'],
    ],
  },
  {
    color: '#4ade80',
    nodes: [
      [510,200,'sleep'],[522,210,'exercise'],[512,217,'cortisol'],
    ],
  },
];

const BM_CROSS = [
  [[167,130],[230,164]],
  [[182,90], [248,172]],
  [[294,217],[364,174]],
  [[284,210],[372,197]],
  [[278,234],[350,254]],
  [[372,197],[382,272]],
  [[462,52], [300,200]],
];

function VisBrainMap() {
  return (
    <div className="tut-vis tut-vis-brainmap">
      <div className="tut-brainmap-header">
        <span className="tut-bm-stat">48 nodes</span>
        <span className="tut-bm-sep">·</span>
        <span className="tut-bm-stat">207 links</span>
        <span className="tut-bm-sep">·</span>
        <span className="tut-bm-hint">drag  ·  scroll/pinch  ·  tap</span>
        <span className="tut-bm-clusters">6 clusters</span>
      </div>
      <div className="tut-brainmap-canvas">
        <svg viewBox="0 0 580 295" width="100%" style={{ display: 'block', overflow: 'visible' }}>
          {/* Cross-cluster long lines */}
          {BM_CROSS.map(([a, b], i) => (
            <line key={`cx${i}`}
              x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}
              stroke="rgba(255,255,255,0.10)" strokeWidth="0.7"
            />
          ))}
          {/* Per-cluster edges + nodes */}
          {BM_CLUSTERS.map(cluster => (
            <g key={cluster.color}>
              {cluster.nodes.map((n, i) =>
                cluster.nodes.slice(i + 1).map((m, j) => {
                  const d = Math.hypot(n[0] - m[0], n[1] - m[1]);
                  if (d > 42) return null;
                  return (
                    <line key={`${i}-${j}`}
                      x1={n[0]} y1={n[1]} x2={m[0]} y2={m[1]}
                      stroke={cluster.color}
                      strokeOpacity="0.28"
                      strokeWidth="0.85"
                    />
                  );
                })
              )}
              {cluster.nodes.map((n, i) => (
                <g key={i}>
                  <circle cx={n[0]} cy={n[1]} r="3.8"
                    fill={cluster.color}
                    style={{ filter: `drop-shadow(0 0 5px ${cluster.color}99)` }}
                  />
                  <text x={n[0] + 6} y={n[1] + 3}
                    fontSize="5.8" fontFamily="monospace"
                    fill={cluster.color} fillOpacity="0.65"
                  >{n[2]}</text>
                </g>
              ))}
            </g>
          ))}
          {/* Isolated small dot */}
          <circle cx="74" cy="264" r="2.2" fill="#60a5fa" fillOpacity="0.55"
            style={{ filter: 'drop-shadow(0 0 3px #60a5fa88)' }} />
          <text x="80" y="267" fontSize="5.5" fontFamily="monospace" fill="#60a5fa" fillOpacity="0.5">design</text>
        </svg>
      </div>
      <div className="tut-brainmap-legend">
        {BM_CLUSTERS.map(c => (
          <span key={c.color} className="tut-bm-legend-item">
            <span className="tut-bm-legend-dot" style={{ background: c.color }} />
            <span>{['Philosophy','Business','AI/ML','Science','Writing','Health'][BM_CLUSTERS.indexOf(c)]}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function VisFocus() {
  return (
    <div className="tut-vis">
      <div className="tut-mode-row">
        {[
          { label: 'Builder',     color: '#00d9b1', mult: '1.5×', active: true },
          { label: 'Researcher',  color: '#a78bfa', mult: '1.2×', active: false },
          { label: 'Night Grind', color: '#fbbf24', mult: '2.0×', active: false },
          { label: 'Philosopher', color: '#60a5fa', mult: '1.3×', active: false },
        ].map(m => (
          <div key={m.label} className={`tut-mode-card${m.active ? ' active' : ''}`} style={{ '--mc': m.color }}>
            <div className="tut-mode-name">{m.label}</div>
            <div className="tut-mode-mult">{m.mult} XP</div>
          </div>
        ))}
      </div>
      <div className="tut-timer-area">
        <div className="tut-timer-ring">
          <svg viewBox="0 0 100 100" width="90" height="90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="#00d9b1" strokeWidth="6"
              strokeDasharray="251" strokeDashoffset="70" strokeLinecap="round"
              transform="rotate(-90 50 50)" />
          </svg>
          <div className="tut-timer-text">24:12</div>
        </div>
        <div className="tut-timer-info">
          <div className="tut-timer-mode">Builder mode</div>
          <div className="tut-timer-domain">AI/ML domain</div>
          <div className="tut-timer-earn">Earning 1.5× XP</div>
        </div>
      </div>
    </div>
  );
}

function VisQuests() {
  return (
    <div className="tut-vis tut-vis-2col">
      <div className="tut-quests-col">
        <div className="tut-col-label">Daily Quests  ·  resets midnight</div>
        {[
          { title: 'Capture 5 thoughts',    prog: 3, total: 5,  xp: 50,  done: false },
          { title: 'Complete focus session', prog: 1, total: 1,  xp: 75,  done: true  },
          { title: 'Log 3 habits',           prog: 1, total: 3,  xp: 40,  done: false },
        ].map(q => (
          <div key={q.title} className="tut-quest-item">
            <div className="tut-quest-row">
              <span className={`tut-quest-title${q.done ? ' done' : ''}`}>{q.title}</span>
              <span className="tut-quest-xp" style={{ color: q.done ? '#4ade80' : '#fbbf24' }}>+{q.xp} XP</span>
            </div>
            <div className="tut-quest-track">
              <div className="tut-quest-fill" style={{ width: `${(q.prog / q.total) * 100}%`, background: q.done ? '#4ade80' : '#00d9b1' }} />
            </div>
            <div className="tut-quest-frac">{q.prog}/{q.total}</div>
          </div>
        ))}
      </div>
      <div className="tut-habits-col">
        <div className="tut-col-label">Habits</div>
        {[
          { name: 'Morning pages', streak: 7,  done: true  },
          { name: 'Cold shower',   streak: 3,  done: true  },
          { name: 'Deep work',     streak: 0,  done: false },
          { name: 'Exercise',      streak: 12, done: true  },
        ].map(h => (
          <div key={h.name} className="tut-habit-item">
            <div className={`tut-habit-check${h.done ? ' done' : ''}`}>{h.done ? '✓' : ''}</div>
            <span className="tut-habit-name">{h.name}</span>
            {h.streak > 0 && <span className="tut-streak">{h.streak}d</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function VisDomains() {
  const domains = [
    { name: 'AI/ML',    color: '#00d9b1', xp: 840,  lv: 6 },
    { name: 'Physics',  color: '#a78bfa', xp: 450,  lv: 3 },
    { name: 'Writing',  color: '#60a5fa', xp: 310,  lv: 2 },
    { name: 'Business', color: '#fbbf24', xp: 120,  lv: 1 },
    { name: 'Health',   color: '#4ade80', xp: 75,   lv: 1 },
  ];
  return (
    <div className="tut-vis">
      <div className="tut-col-label">Domain XP  ·  level up across 8 fields</div>
      {domains.map(d => (
        <div key={d.name} className="tut-domain-row">
          <span className="tut-domain-lv" style={{ color: d.color }}>Lv{d.lv}</span>
          <span className="tut-domain-name">{d.name}</span>
          <div className="tut-domain-track">
            <div className="tut-domain-fill" style={{ width: `${Math.round((d.xp % 150) / 150 * 100)}%`, background: d.color }} />
          </div>
          <span className="tut-domain-xp" style={{ color: d.color }}>{d.xp}</span>
        </div>
      ))}
      <div className="tut-ach-row">
        {['◈', '⚡', '◆', '✦', '◉', '▣'].map((icon, i) => (
          <div key={i} className={`tut-ach-badge${i < 3 ? ' unlocked' : ''}`}>{icon}</div>
        ))}
        <span className="tut-ach-label">3 / 12 achievements unlocked</span>
      </div>
    </div>
  );
}

function VisCosmos() {
  const tabs = [
    { icon: '◎', label: 'Oracle',     desc: 'Ask AI about your data',   color: '#00d9b1' },
    { icon: '▣', label: 'Workbench',  desc: 'Spatial idea canvas',       color: '#a78bfa' },
    { icon: '⚗', label: 'Lab',        desc: 'Track n=1 experiments',     color: '#fbbf24' },
    { icon: '◈', label: 'Expedition', desc: 'AI learning routes',         color: '#60a5fa' },
    { icon: '⚔', label: 'Council',    desc: 'AI decision war room',       color: '#f472b6' },
    { icon: '∞', label: 'DNA',        desc: 'Your knowledge helix',       color: '#4ade80' },
  ];
  return (
    <div className="tut-vis">
      <div className="tut-cosmos-grid">
        {tabs.map(t => (
          <div key={t.label} className="tut-cosmos-tab">
            <span className="tut-cosmos-icon" style={{ color: t.color }}>{t.icon}</span>
            <div>
              <div className="tut-cosmos-name">{t.label}</div>
              <div className="tut-cosmos-desc">{t.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VisApiKeys() {
  return (
    <div className="tut-vis tut-vis-keys">
      <div className="tut-key-block primary">
        <div className="tut-key-header">
          <span className="tut-key-icon" style={{ color: '#00d9b1' }}>◎</span>
          <span className="tut-key-title">Groq API Key</span>
          <span className="tut-key-badge free">FREE</span>
        </div>
        <ol className="tut-key-steps">
          <li>Go to <strong>console.groq.com</strong> — no credit card</li>
          <li>Sign up or log in</li>
          <li>Sidebar → API Keys → Create new key</li>
          <li>Copy key  →  paste in <strong>Character tab</strong></li>
        </ol>
        <div className="tut-key-unlocks">Unlocks: Oracle, Morning Brief, Lab, Expedition, Council</div>
      </div>
      <div className="tut-key-block secondary">
        <div className="tut-key-header">
          <span className="tut-key-icon" style={{ color: '#a78bfa' }}>◆</span>
          <span className="tut-key-title">Claude API Key</span>
          <span className="tut-key-badge optional">optional</span>
        </div>
        <ol className="tut-key-steps">
          <li>Go to <strong>console.anthropic.com</strong></li>
          <li>Create account, add credits</li>
          <li>API Keys → Create key → paste in <strong>Character tab</strong></li>
        </ol>
        <div className="tut-key-unlocks">Unlocks: smarter classification, AI questlines</div>
      </div>
    </div>
  );
}

// ── Slide Definitions ─────────────────────────────────────────────────────────

const SLIDES = [
  {
    step: '01',
    tag: 'WELCOME',
    title: 'Your Polymathic OS',
    body: 'Polymath OS is a personal life-management system built for ADHD minds with many interests. Capture raw thoughts, earn XP across knowledge domains, run focus sessions, and level up your actual life — all in your browser, no account needed.',
    Visual: VisWelcome,
  },
  {
    step: '02',
    tag: 'CORE LOOP',
    title: 'Capture Anything, AI Handles the Rest',
    body: 'Type a raw thought — an idea, question, task, or observation. The AI instantly classifies it into a domain, type, and priority, extracts a key insight, and awards you XP. No manual tagging. Capture speed is everything.',
    Visual: VisCapture,
  },
  {
    step: '03',
    tag: 'THOUGHTS TAB',
    title: 'Your Thought Stream',
    body: 'Every capture lands in the Thoughts stream. Filter by domain, type, or priority. Once you have 3+ unresolved thoughts, a triage mode unlocks — swipe through and decide what to act on. Archive or complete thoughts to keep the stream clean.',
    Visual: VisThoughts,
  },
  {
    step: '04',
    tag: 'KNOWLEDGE GRAPH',
    title: 'Your Mind, Mapped',
    body: 'Open the Brain Map (◎ in the sidebar) to see all your thoughts as a live knowledge graph. Nodes cluster by domain — purple for Philosophy, cyan for AI/ML, pink for Writing. The more you capture, the richer the map becomes. Drag nodes, zoom, and spot hidden connections.',
    Visual: VisBrainMap,
  },
  {
    step: '05',
    tag: 'FOCUS TAB',
    title: 'Identity Modes + Focus Sessions',
    body: 'Pick an identity mode before each session — Builder, Researcher, Night Grind, and more. Each mode sets a vibe, a CSS environment, and an XP multiplier. Complete a session to earn multiplied XP and unlock loot drops. The AntiTimer shows a 3D point-cloud that collapses as time runs out.',
    Visual: VisFocus,
  },
  {
    step: '06',
    tag: 'QUESTS & HABITS',
    title: 'Daily Quests, Tasks & Habits',
    body: '3 quests refresh every midnight based on your current gaps. The task board has tiered bounties (common/rare/epic). Daily habits build streaks. Boss Battles let you tackle multi-phase projects with a 200 XP defeat bonus. Everything funnels XP back into your domains.',
    Visual: VisQuests,
  },
  {
    step: '07',
    tag: 'CHARACTER TAB',
    title: 'Level Up Your Domains',
    body: 'The Character tab shows your XP progress across all domains, INT/WIS/CRE/STR character stats, achievements, habit streaks, and a radar chart. With enough captures, your domain bars fill fast — leveling up is visible and satisfying. 12 achievements to unlock.',
    Visual: VisDomains,
  },
  {
    step: '08',
    tag: 'COSMOS TAB',
    title: 'The Cosmos: Advanced Intelligence',
    body: 'The Cosmos tab unlocks six advanced tools: Oracle (ask AI about your mind-data), Workbench (spatial canvas for connecting ideas), Lab (n=1 experiment tracker with graphs), Expedition (AI-charted learning routes with fog-of-war), Council (AI advisors for decisions), and DNA helix visualization.',
    Visual: VisCosmos,
  },
  {
    step: '09',
    tag: 'API KEYS',
    title: 'Unlock AI Features',
    body: 'Two optional API keys power the AI features. The Groq key is free and takes 60 seconds to get — it unlocks Oracle, Morning Brief, Lab conclusions, Expedition routes, and Council advisors. The Claude key (paid) upgrades thought classification and questline generation. Both are stored only in your browser.',
    Visual: VisApiKeys,
  },
];

// ── Main Component ────────────────────────────────────────────────────────────

export default function TutorialOverlay({ onClose }) {
  const [idx, setIdx]         = useState(0);
  const [exiting, setExiting] = useState(false);

  function close() {
    setExiting(true);
    localStorage.setItem('polymath-tutorial-seen', '1');
    setTimeout(onClose, 400);
  }

  function next() {
    if (idx < SLIDES.length - 1) setIdx(idx + 1);
    else close();
  }

  function prev() {
    if (idx > 0) setIdx(idx - 1);
  }

  const slide = SLIDES[idx];

  return (
    <div className={`tut-overlay${exiting ? ' exiting' : ''}`}>
      <div className="tut-modal">

        <div className="tut-header">
          <div className="tut-meta">
            <span className="tut-tag">{slide.tag}</span>
            <span className="tut-progress">{slide.step} / {SLIDES.length}</span>
          </div>
          <button className="ghost tut-skip" onClick={close}>Skip tutorial</button>
        </div>

        <div className="tut-visual-wrap">
          <slide.Visual />
        </div>

        <div className="tut-body">
          <div className="tut-title">{slide.title}</div>
          <div className="tut-desc">{slide.body}</div>
        </div>

        <div className="tut-foot">
          <div className="tut-dots">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                className={`tut-dot${i === idx ? ' active' : ''}`}
                onClick={() => setIdx(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <div className="tut-nav-btns">
            {idx > 0 && (
              <button className="ghost tut-back" onClick={prev}>← Back</button>
            )}
            <button className="primary tut-next" onClick={next}>
              {idx < SLIDES.length - 1 ? 'Next →' : 'Start using it →'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
