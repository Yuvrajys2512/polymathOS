async function callAI(prompt, apiKey, maxTokens = 400) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!r.ok) throw new Error('API error ' + r.status);
  const d = await r.json();
  return d.content[0].text;
}

function parseJsonArray(text) {
  const match = text.match(/\[[\s\S]*?\]/);
  if (!match) return [];
  try { return JSON.parse(match[0]); } catch { return []; }
}

export async function expandTask(taskText, apiKey) {
  const text = await callAI(
    `Break this task into 3-5 short, concrete, actionable subtasks. Return ONLY a JSON array of strings. Keep each under 65 chars. No markdown.
Task: "${taskText}"
Example: ["Research competitors", "Write outline", "Set up repo"]`,
    apiKey, 300
  );
  return parseJsonArray(text).filter(s => typeof s === 'string').slice(0, 5);
}

export async function suggestTodos(thoughts, intention, apiKey) {
  const thoughtList = thoughts
    .filter(t => !t.done)
    .slice(0, 15)
    .map(t => `[${t.type}/${t.domain}] ${t.text}`)
    .join('\n');

  const text = await callAI(
    `You're helping an ADHD creator prioritize today. Based on their captured thoughts and intention, suggest 3-5 specific actionable todos. Be concrete and short (under 70 chars each).

Today's intention: "${intention || 'none set'}"

Recent thoughts:
${thoughtList || 'none yet'}

Return ONLY a JSON array: [{"text": "...", "priority": 2}]
Priority scale: 1=critical/urgent, 2=important, 3=normal
Example: [{"text": "Finish landing page copy", "priority": 2}]`,
    apiKey, 450
  );
  return parseJsonArray(text)
    .filter(s => s && typeof s.text === 'string')
    .slice(0, 5);
}
