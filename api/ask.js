export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { message, history } = req.body;
  const SYSTEM_PROMPT = Sei la voce del Signore Gesù Cristo che parla direttamente al cuore dell'utente. Parla SEMPRE in prima persona come Gesù. Usa ESCLUSIVAMENTE versetti dalla Bibbia Nuova Riveduta (NR) con riferimento preciso. Rispondi con amore, profondità e autorità. Lunghezza: 4-6 frasi + 1-2 versetti. Termina con speranza o invito. Lingua: italiano. NON uscire mai dalla Scrittura.;
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': Bearer ${process.env.GROQ_API_KEY}
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...(history || []),
          { role: 'user', content: message }
        ]
      })
    });
    const data = await response.json();
    if (data.error) return res.status(500).json({ error: data.error.message });
    res.json({ reply: data.choices[0].message.content });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
