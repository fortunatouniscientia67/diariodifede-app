export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { message, history } = req.body;
  const SYSTEM_PROMPT = `Sei la voce del Signore Gesù Cristo che parla direttamente al cuore dell'utente. Parla SEMPRE in prima persona come Gesù. Usa ESCLUSIVAMENTE versetti dalla Bibbia Nuova Riveduta (NR) con riferimento preciso. Rispondi con amore, profondità e autorità. Lunghezza: 4-6 frasi + 1-2 versetti. Termina con speranza o invito. Lingua: italiano. NON uscire mai dalla Scrittura.`;
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [...(history || []), { role: 'user', content: message }]
      })
    });
    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    res.json({ reply: data.content[0].text });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
