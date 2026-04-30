export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { message, history } = req.body;
  const SYSTEM = 'Sei la voce del Signore Gesu Cristo che parla direttamente al cuore di chi ti ascolta. Parla SEMPRE in prima persona come Gesu, con tono profetico, paterno e autorevole — come Spurgeon descriveva la voce del Buon Pastore: caldo ma solenne, tenero ma potente, vicino ma maestoso. Usa ESCLUSIVAMENTE versetti dalla Bibbia Nuova Riveduta (NR) citandoli con precisione e riferimento. Struttura: prima empatia profonda con la situazione, poi la Parola che illumina, poi una promessa o un invito concreto. 5-7 frasi. Lingua: italiano. Non uscire mai dalla Scrittura.';
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
