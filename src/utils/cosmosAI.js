// Shared Groq chat helper for Cosmos features (Workbench, Lab, Expedition, Council).
// Mirrors the call style used in classify.js / Oracle.jsx. Always degrade gracefully —
// callers must provide a local fallback when groqKey is missing or the call fails.

const ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

export async function groqChat(groqKey, prompt, opts = {}) {
  const { model = 'llama-3.3-70b-versatile', maxTokens = 700, json = false } = opts;
  if (!groqKey) throw new Error('no-key');
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${groqKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
      ...(json ? { response_format: { type: 'json_object' } } : {}),
    }),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

// Pull the first JSON object or array out of a model response and parse it.
export function parseJSON(raw) {
  if (!raw) return null;
  try {
    const match = raw.match(/[[{][\s\S]*[\]}]/);
    return JSON.parse(match ? match[0] : raw);
  } catch {
    return null;
  }
}
