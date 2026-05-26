import { useState, useEffect } from 'react';
import { DOMAIN_COLOR, ENERGY_LEVELS } from '../../constants/index.js';
import { todayStr, xpToLevel } from '../../utils/game.js';

const CACHE_KEY = 'polymath-brief-';

function getHour() { return new Date().getHours(); }
function greeting() {
  const h = getHour();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function buildContext(state) {
  const today = todayStr();
  const cutoff3 = Date.now() - 3 * 86400000;

  const openTasks   = (state.taskBoard || []).filter(t => !t.done);
  const epicTasks   = openTasks.filter(t => t.tier === 'epic');
  const coldThreads = (state.thoughts || []).filter(t =>
    !t.done && new Date(t.createdAt).getTime() < cutoff3 &&
    (t.type === 'task' || t.type === 'question')
  ).slice(0, 3);

  const todayEnergy = (state.energyLog || []).find(e => e.date === today);
  const energy = todayEnergy ? ENERGY_LEVELS.find(e => e.level === todayEnergy.level) : null;

  const recentDomains = [...new Set(
    (state.thoughts || [])
      .filter(t => t.createdAt?.startsWith(today))
      .map(t => t.domain)
  )];

  const allDomains = ['AI/ML','Writing','Business','Design','Physics','Health','Learning','Life'];
  const last7 = Array.from({length:7},(_,i) => {
    const d = new Date(Date.now() - i*86400000);
    return d.toISOString().split('T')[0];
  });
  const domainActivity = allDomains.map(d => ({
    domain: d,
    count: (state.thoughts||[]).filter(t => t.domain===d && last7.some(day => t.createdAt?.startsWith(day))).length,
  }));
  const neglected = domainActivity.filter(d => d.count === 0 && (state.xp?.[d.domain]||0) > 0).map(d => d.domain);
  const topDomain = domainActivity.sort((a,b) => b.count - a.count)[0];

  const doneQuests = (state.quests?.list || []).filter(q => q.completed).length;
  const totalQuests = state.quests?.list?.length || 0;

  const activeBoss = (state.bosses || []).find(b => !b.defeated);
  const activeQuestline = (state.questlines || []).find(q => !q.completed);

  return {
    openTasks, epicTasks, coldThreads, energy,
    recentDomains, neglected, topDomain,
    doneQuests, totalQuests, activeBoss, activeQuestline,
    streak: state.streak,
    totalThoughts: state.thoughts?.length || 0,
  };
}

async function generateBriefWithClaude(ctx, groqKey) {
  const cached = localStorage.getItem(CACHE_KEY + todayStr());
  if (cached) return JSON.parse(cached);

  const prompt = `You are POLYMATH OS — an ADHD-focused life operating system. Write a concise morning brief for the user.

Context:
- Open tasks: ${ctx.openTasks.length} (${ctx.epicTasks.length} epic)
- Cold threads (untouched 3+ days): ${ctx.coldThreads.map(t => `"${t.text.slice(0,60)}"`).join(', ') || 'none'}
- Today's energy: ${ctx.energy ? `${ctx.energy.emoji} ${ctx.energy.label}` : 'not set yet'}
- Active boss battle: ${ctx.activeBoss ? `"${ctx.activeBoss.name}"` : 'none'}
- Active questline: ${ctx.activeQuestline ? `"${ctx.activeQuestline.goal}"` : 'none'}
- Neglected domains (no activity this week): ${ctx.neglected.join(', ') || 'none'}
- Streak: ${ctx.streak?.count || 0} days

Return ONLY valid JSON:
{
  "focus": "One sentence: the single most important thing to work on today (be specific, not generic)",
  "nudge": "One short ADHD-friendly nudge — direct, slightly provocative, max 120 chars",
  "domain": "The domain to prioritize today based on context"
}`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${groqKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!res.ok) throw new Error('API error');
  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || '';
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON');
  const result = JSON.parse(match[0]);
  localStorage.setItem(CACHE_KEY + todayStr(), JSON.stringify(result));
  return result;
}

function localBrief(ctx) {
  const cached = localStorage.getItem(CACHE_KEY + todayStr());
  if (cached) return JSON.parse(cached);

  let focus = 'Start by capturing one raw thought — anything on your mind right now.';
  let nudge = "The hardest part is starting. You already opened the app. That's step one.";
  let domain = 'Life';

  if (ctx.epicTasks.length > 0) {
    focus = `You have ${ctx.epicTasks.length} epic task${ctx.epicTasks.length > 1 ? 's' : ''} open — at least one deserves your best hours today.`;
    domain = ctx.epicTasks[0].domain || 'Life';
  } else if (ctx.coldThreads.length > 0) {
    focus = `"${ctx.coldThreads[0].text.slice(0, 80)}" has been untouched for 3+ days. Today it gets attention.`;
    domain = ctx.coldThreads[0].domain || 'Life';
  } else if (ctx.activeBoss) {
    focus = `Your boss battle "${ctx.activeBoss.name}" is waiting. Hit the next phase.`;
    domain = ctx.activeBoss.domain || 'Life';
  } else if (ctx.activeQuestline) {
    focus = `Next up on "${ctx.activeQuestline.goal}": ${ctx.activeQuestline.quests.find(q => !q.done)?.title || 'continue the questline'}.`;
    domain = ctx.activeQuestline.domain || 'Life';
  }

  if (ctx.neglected.length > 0) {
    nudge = `${ctx.neglected[0]} hasn't seen any action this week. Don't let it go cold.`;
  } else if (ctx.streak?.count >= 3) {
    nudge = `${ctx.streak.count}-day streak active. Don't be the one who breaks it.`;
  } else if (ctx.energy?.level >= 4) {
    nudge = `${ctx.energy.emoji} Peak energy. Stop reading this and go do the hard thing.`;
  }

  const result = { focus, nudge, domain };
  localStorage.setItem(CACHE_KEY + todayStr(), JSON.stringify(result));
  return result;
}

export default function MorningBrief({ state, onDismiss, onSetIntention }) {
  const [brief, setBrief]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [intention, setIntention] = useState('');
  const [exiting, setExiting]   = useState(false);

  const ctx = buildContext(state);

  useEffect(() => {
    async function load() {
      try {
        const result = state.groqKey
          ? await generateBriefWithClaude(ctx, state.groqKey)
          : localBrief(ctx);
        setBrief(result);
      } catch {
        setBrief(localBrief(ctx));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function dismiss() {
    setExiting(true);
    setTimeout(onDismiss, 500);
  }

  function handleStart() {
    if (intention.trim()) onSetIntention(intention.trim());
    dismiss();
  }

  const domainColor = brief ? (DOMAIN_COLOR[brief.domain] || 'var(--accent)') : 'var(--accent)';
  const todayEnergy = ctx.energy;

  return (
    <div className={`brief-overlay${exiting ? ' exiting' : ''}`}>
      <div className="brief-modal">

        {/* Top bar */}
        <div className="brief-topbar">
          <span className="brief-date">{new Date().toLocaleDateString([], { weekday:'long', month:'long', day:'numeric' })}</span>
          <button className="ghost brief-skip" onClick={dismiss}>Skip →</button>
        </div>

        {/* Greeting */}
        <div className="brief-greeting">
          <span className="brief-hello">{greeting()},</span>
          <span className="brief-name">Polymath.</span>
        </div>

        {loading ? (
          <div className="brief-loading">
            <div className="brief-spinner" />
            <span>Preparing your brief…</span>
          </div>
        ) : (
          <>
            {/* AI Focus */}
            <div className="brief-focus-card" style={{ '--bc': domainColor }}>
              <div className="brief-focus-label">Today's Focus</div>
              <div className="brief-focus-text">{brief?.focus}</div>
              {brief?.domain && (
                <span className="brief-focus-domain" style={{ color: domainColor }}>{brief.domain}</span>
              )}
            </div>

            {/* Nudge */}
            {brief?.nudge && (
              <div className="brief-nudge">"{brief.nudge}"</div>
            )}

            {/* Quick stats row */}
            <div className="brief-stats">
              <div className="brief-stat">
                <span className="brief-stat-val">{ctx.openTasks.length}</span>
                <span className="brief-stat-lbl">open tasks</span>
              </div>
              <div className="brief-stat">
                <span className="brief-stat-val">{ctx.coldThreads.length}</span>
                <span className="brief-stat-lbl">cold threads</span>
              </div>
              <div className="brief-stat">
                <span className="brief-stat-val">{ctx.streak?.count || 0}</span>
                <span className="brief-stat-lbl">day streak</span>
              </div>
              <div className="brief-stat">
                <span className="brief-stat-val">{ctx.doneQuests}/{ctx.totalQuests}</span>
                <span className="brief-stat-lbl">quests done</span>
              </div>
            </div>

            {/* Cold threads */}
            {ctx.coldThreads.length > 0 && (
              <div className="brief-cold">
                <div className="brief-section-label">Cold threads — need your attention</div>
                {ctx.coldThreads.map(t => (
                  <div key={t.id} className="brief-cold-item">
                    <span className="brief-cold-dot" style={{ background: DOMAIN_COLOR[t.domain] || 'var(--muted)' }} />
                    <span className="brief-cold-text">{t.text.slice(0, 70)}{t.text.length > 70 ? '…' : ''}</span>
                    <span className="brief-cold-age" style={{ color: DOMAIN_COLOR[t.domain] }}>{t.domain}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Intention setter */}
            <div className="brief-intention">
              <div className="brief-section-label">Set today's intention</div>
              <div className="brief-intention-row">
                <input
                  value={intention}
                  onChange={e => setIntention(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleStart()}
                  placeholder={state.intention || 'One sentence for today…'}
                  autoFocus
                />
                <button className="primary" onClick={handleStart}>
                  {intention.trim() ? 'Set & Start →' : 'Start Day →'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
