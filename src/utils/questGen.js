import { DOMAINS } from '../constants/index.js';

const DOMAIN_KEYWORDS = {
  'AI/ML':    ['machine learning','ai','neural','model','data','python','llm','deep learning','gpt','transformer'],
  'Writing':  ['write','writing','blog','essay','story','book','content','article','journal','prose'],
  'Business': ['business','startup','revenue','market','product','launch','sales','growth','strategy','monetize'],
  'Design':   ['design','ui','ux','visual','figma','brand','logo','interface','aesthetic','color'],
  'Physics':  ['physics','math','quantum','calculus','science','research','formula','theory','mechanics'],
  'Health':   ['health','fitness','workout','diet','sleep','nutrition','exercise','run','gym','meditation'],
  'Learning': ['learn','study','course','read','book','skill','practice','understand','master','knowledge'],
  'Life':     ['life','habit','routine','goal','mindset','productivity','focus','balance','purpose','values'],
};

function inferDomain(goal) {
  const lower = goal.toLowerCase();
  let best = 'Learning', bestScore = 0;
  for (const [domain, kw] of Object.entries(DOMAIN_KEYWORDS)) {
    const score = kw.filter(k => lower.includes(k)).length;
    if (score > bestScore) { best = domain; bestScore = score; }
  }
  return best;
}

const QUEST_TEMPLATES = [
  { phase: 'Foundation',  titleFn: g => `Research: ${g.slice(0,30)}`,     descFn: g => `Gather foundational knowledge and resources for "${g}".`,          xp: 50  },
  { phase: 'Plan',        titleFn: g => 'Build Your Roadmap',              descFn: g => `Break down "${g}" into concrete milestones and write them out.`,    xp: 60  },
  { phase: 'First Step',  titleFn: g => 'Take the First Real Action',      descFn: g => `Complete one tangible action toward "${g}" — no planning, doing.`, xp: 80  },
  { phase: 'Deep Work',   titleFn: g => 'First Deep Work Session',         descFn: g => `Spend 90+ min in focused work on "${g}".`,                         xp: 100 },
  { phase: 'Checkpoint',  titleFn: g => 'Reflect & Adjust',                descFn: g => `Review progress on "${g}". What's working? What needs changing?`,  xp: 70  },
  { phase: 'Level Up',    titleFn: g => 'Share or Ship Something',         descFn: g => `Produce a visible output for "${g}" — post, demo, or artifact.`,   xp: 150 },
];

export function localGenerateQuestline(goal) {
  const domain = inferDomain(goal);
  return {
    domain,
    quests: QUEST_TEMPLATES.map((t, i) => ({
      id: crypto.randomUUID(),
      phase: t.phase,
      title: t.titleFn(goal),
      desc: t.descFn(goal),
      xpReward: t.xp,
      done: false,
      index: i,
    })),
  };
}

export async function generateQuestlineWithClaude(goal, apiKey) {
  const domain = inferDomain(goal);
  const prompt = `You are a game quest designer for POLYMATH OS — an ADHD-focused life gamification app.

The user's goal: "${goal}"
Inferred domain: ${domain}

Generate a structured questline of 5 quests that guides the user step-by-step from complete beginner to visible achievement of this goal. Each quest should be concrete, actionable, and dopamine-friendly (small wins building to big wins).

Return ONLY valid JSON with this exact structure:
{
  "domain": "${domain}",
  "quests": [
    {
      "phase": "Phase name (e.g. Foundation, Deep Dive, First Build, etc.)",
      "title": "Short quest title (max 40 chars)",
      "desc": "One concrete sentence — what exactly to do",
      "xpReward": 50
    }
  ]
}

XP rewards should range 40–150 based on difficulty/effort. No markdown, no explanation, just the JSON.`;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 700,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) throw new Error('Claude API error');
  const data = await res.json();
  const text = data.content?.[0]?.text || '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON in response');
  const parsed = JSON.parse(jsonMatch[0]);
  const dom = DOMAINS.includes(parsed.domain) ? parsed.domain : domain;
  return {
    domain: dom,
    quests: (parsed.quests || []).map((q, i) => ({
      id: crypto.randomUUID(),
      phase: q.phase || `Phase ${i + 1}`,
      title: q.title || 'Quest',
      desc: q.desc || '',
      xpReward: Math.min(200, Math.max(20, q.xpReward || 60)),
      done: false,
      index: i,
    })),
  };
}
