import { DOMAINS, TYPE_OPTS, PRIORITY_OPTS } from '../constants/index.js';

function normType(v) {
  const t = String(v || 'note').toLowerCase();
  return t === 'ask' ? 'question' : TYPE_OPTS.slice(1).includes(t) ? t : 'note';
}

export function localClassify(text) {
  const lc = text.toLowerCase();
  const domain =
    DOMAINS.find(d => lc.includes(d.toLowerCase().split('/')[0])) ||
    (/(model|agent|prompt|llm|ai\b|ml\b|neural|gpt|claude|openai)/.test(lc) ? 'AI/ML' :
     /(write|essay|story|blog|draft|poem|novel)/.test(lc)            ? 'Writing' :
     /(startup|revenue|customer|market|sales|business|saas)/.test(lc) ? 'Business' :
     /(layout|ui|ux|brand|visual|figma|design)/.test(lc)              ? 'Design' :
     /(physics|quantum|energy|field|math|calculus)/.test(lc)          ? 'Physics' :
     /(gym|sleep|diet|run|health|workout|exercise)/.test(lc)          ? 'Health' :
     /(learn|course|book|study|tutorial|read)/.test(lc)               ? 'Learning' : 'Life');

  const type =
    /\?$|how |why |what if|should i/.test(lc)                          ? 'question' :
    /\b(todo|task|need to|must|ship|finish|call|email|build|do)\b/.test(lc) ? 'task' :
    /\b(realized|insight|pattern|connection|principle|noticed)\b/.test(lc)  ? 'insight' :
    /\b(idea|could|maybe|concept|imagine|what if)\b/.test(lc)              ? 'idea' : 'note';

  const priority =
    /\b(urgent|today|asap|deadline|important|critical)\b/.test(lc) ? 'high' :
    /\b(soon|next|should|this week)\b/.test(lc)                     ? 'medium' : 'low';

  const words = text.replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean);
  return {
    domain, type, priority,
    insight: words.slice(0, 8).join(' ') || 'Captured thought',
    tags: [...new Set(words.filter(w => w.length > 5).slice(0, 2).map(w => w.toLowerCase()))],
  };
}

export async function classifyWithClaude(text, apiKey) {
  if (!apiKey) return localClassify(text);
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 220,
      messages: [{
        role: 'user',
        content:
          `Classify this thought for POLYMATH OS. Return ONLY JSON with keys: domain, type, insight, priority, tags.\n` +
          `domain: one of ${DOMAINS.join(', ')}. type: idea|task|question|insight|note. ` +
          `insight: ≤8 words. priority: high|medium|low. tags: 1-2 strings.\n\nThought: ${text}`,
      }],
    }),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json();
  const raw = data.content?.[0]?.text || '{}';
  const p = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] || raw);
  const fb = localClassify(text);
  return {
    domain:   DOMAINS.includes(p.domain) ? p.domain : fb.domain,
    type:     normType(p.type),
    insight:  String(p.insight || fb.insight).slice(0, 80),
    priority: PRIORITY_OPTS.slice(1).includes(String(p.priority).toLowerCase())
      ? String(p.priority).toLowerCase() : 'medium',
    tags: Array.isArray(p.tags) ? p.tags.slice(0, 2).map(String) : [],
  };
}
