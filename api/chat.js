export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, language } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    const lang = language === 'en' ? 'en' : 'fr';

    // Appel à Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: lang === 'fr' 
          ? 'Tu es un consultant expert en mode et retail pour Océane Maligoi. Réponds de manière professionnelle et accessible. Donne des conseils sur : stratégie d\'achat, pricing, pilotage de marque, développement produits.'
          : 'You are an expert fashion and retail consultant for Océane Maligoi. Answer professionally and accessibly. Give advice on: buying strategy, pricing, brand management, product development.',
        messages: [
          {
            role: 'user',
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Claude API error:', data);
      return res.status(500).json({ 
        response: lang === 'fr' 
          ? 'Erreur API Claude. Vérifiez votre clé API.' 
          : 'Claude API error. Check your API key.'
      });
    }

    const assistantMessage = data.content[0].text;

    return res.status(200).json({ response: assistantMessage });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      response: 'Erreur serveur'
    });
  }
}
