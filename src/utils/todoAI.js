async function callAI(prompt, groqKey, maxTokens = 400) {
  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${groqKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
  if (!r.ok) throw new Error('API error ' + r.status);
  const d = await r.json();
  return d.choices[0].message.content;
}

function parseJsonArray(text) {
  const match = text.match(/\[[\s\S]*?\]/);
  if (!match) return [];
  try { return JSON.parse(match[0]); } catch { return []; }
}

export async function expandTask(taskText, groqKey) {
  const text = await callAI(
    `Break this task into 3-5 short, concrete, actionable subtasks. Return ONLY a JSON array of strings. Keep each under 65 chars. No markdown.
Task: "${taskText}"
Example: ["Research competitors", "Write outline", "Set up repo"]`,
    groqKey, 300
  );
  return parseJsonArray(text).filter(s => typeof s === 'string').slice(0, 5);
}

export async function suggestTodos(thoughts, intention, groqKey) {
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
    groqKey, 450
  );
  return parseJsonArray(text)
    .filter(s => s && typeof s.text === 'string')
    .slice(0, 5);
}
