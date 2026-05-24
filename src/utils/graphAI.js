const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL    = 'llama-3.1-8b-instant'; // fast, free tier

async function groqCall(groqKey, prompt, maxTokens = 400) {
  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${groqKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
      temperature: 0.6,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq ${res.status}: ${err}`);
  }
  const data = await res.json();
  return data.choices[0].message.content.trim();
}

// Returns [{ label, ids: [fullId], insight }] or null
export async function analyzeGraphClusters(thoughts, groqKey) {
  if (!groqKey || thoughts.length < 3) return null;

  const list = thoughts.slice(0, 50).map(t =>
    `[${t.id.slice(-8)}] [${t.domain}] ${t.text.slice(0, 80)}`
  ).join('\n');

  const prompt = `You are analyzing a knowledge graph of thoughts from a polymath thinker. Group them into 2-4 meaningful thematic clusters.

Thoughts (id_suffix | domain | text):
${list}

Return ONLY a valid JSON array — no explanation, no markdown, no extra text:
[{"label":"Short Label","ids":["suffix1","suffix2"],"insight":"one sharp insight about this cluster"}]

Rules:
- Use only the last 8 characters of each id shown above
- Each id must appear in exactly one cluster
- Labels should be 2-4 words max
- Insights should be one punchy, non-obvious sentence`;

  try {
    const raw = await groqCall(groqKey, prompt, 400);
    const match = raw.match(/\[[\s\S]*?\]/);
    if (!match) return null;
    const clusters = JSON.parse(match[0]);
    return clusters.map(c => ({
      label: c.label,
      insight: c.insight,
      ids: thoughts
        .filter(t => (c.ids || []).some(sid => t.id.endsWith(sid)))
        .map(t => t.id),
    })).filter(c => c.ids.length > 0);
  } catch {
    return null;
  }
}

// Returns synthesis string or null
export async function analyzeNodeSynthesis(thought, relatedThoughts, groqKey) {
  if (!groqKey || !relatedThoughts.length) return null;

  const related = relatedThoughts
    .slice(0, 4)
    .map(r => `"${(r.thought.text || '').slice(0, 80)}"`)
    .join('\n');

  const prompt = `In exactly 1-2 sentences, reveal the hidden connection or emergent insight between this thought:
"${thought.text.slice(0, 100)}"

And these related ideas:
${related}

Be sharp, non-obvious, and direct. No filler phrases. Write like a brilliant polymath connecting dots.`;

  try {
    return await groqCall(groqKey, prompt, 120);
  } catch {
    return null;
  }
}
