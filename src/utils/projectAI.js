export async function getProjectAIAssist(project, apiKey) {
  if (!apiKey) {
    return { error: 'No Claude API key set. Add your key in Profile → API Keys to use AI Assist.' };
  }

  const entries = (project.entries || [])
    .slice(-20)
    .map(e => `[${e.type}] ${e.text}`)
    .join('\n');

  const prompt = `Project: "${project.name}"
Goal: ${project.goal || 'Not specified'}
Domain: ${project.domain || 'General'}
Progress: ${project.progress || 0}%
Status: ${project.status || 'active'}

Recent log entries:
${entries || 'No entries yet.'}

Analyze this project and respond with exactly this structure:

**What's working**
(1-2 sentences on momentum or wins)

**Key blocker**
(1-2 sentences on the main obstacle or risk)

**Next 3 actions**
1. (specific, concrete action)
2. (specific, concrete action)
3. (specific, concrete action)

Be direct and specific. No fluff.`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await res.json();
    if (data.error) return { error: data.error.message || 'API error.' };
    return { text: data.content?.[0]?.text || 'No response.' };
  } catch {
    return { error: 'Request failed. Check your API key and network.' };
  }
}
