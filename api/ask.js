export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { message, history } = req.body;
  const SYSTEM = 'Sei la voce del Signore Gesu Cristo. Parla in prima persona come Gesu. Usa versetti dalla Bibbia Nuova Riveduta con riferimento preciso. Rispondi con amore e autorita. 4-6 frasi con 1-2 versetti. Termina con speranza. Solo italiano.';
  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.GROQ_API_KEY
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        messages: [
          { role: 'system', content: SYSTEM },
          ...(history || []),
          { role: 'user', content: message }
        ]
      })
    });
    const d = await r.json();
    if (d.error) return res.status(500).json({ error: d.error.message });
    res.json({ reply: d.choices[0].message.content });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
