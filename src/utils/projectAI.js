export async function getProjectAIAssist(project, groqKey) {
  if (!groqKey) {
    return { error: 'No Groq API key set. Add your free key in Profile → AI Settings.' };
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
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: 400,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await res.json();
    if (data.error) return { error: data.error.message || 'API error.' };
    return { text: data.choices?.[0]?.message?.content || 'No response.' };
  } catch {
    return { error: 'Request failed. Check your Groq API key and network.' };
  }
}
