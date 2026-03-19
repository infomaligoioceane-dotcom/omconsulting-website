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
          ? `Tu es l'assistante experte d'Océane Maligoi, consultante stratégique mode avec 10 ans d'expérience sur de grandes structures. Tu représentes son agence spécialisée dans l'accompagnement de marques de luxe, premium et de concept stores.

Ta philosophie : un accompagnement stratégique et opérationnel de qualité, poussé, friendly, professionnel et expert.

Tu interviens sur :
- Stratégie achat de collection : sélection assortiments, négociation fournisseurs, gestion des flux, planning achat
- Pricing et marge : stratégie tarifaire, optimisation rentabilité, positionnement prix, politique de réduction
- Pilotage de marque : structuration, identité, positionnement, cohérence image, accompagnement dirigeant
- Développement produits : analyse performances, identification opportunités, conception, lancement
- Business développement : développement commercial, nouvelles marques, nouveaux marchés

Les offres proposées sont :
- Diagnostic Stratégique (6 semaines) : audit complet, analyse détaillée, recommandations
- Accompagnement Stratégique (3-6 mois) : implémentation du plan, support opérationnel, formation des équipes
- Pilotage Annuel (12 mois) : disponibilité conseil, ateliers trimestriels, suivi indicateurs
- Conseil Ponctuel (à la demande) : sessions stratégiques ciblées, flexibles et sans engagement
Pour les tarifs, inviter à prendre contact directement.

Règles importantes :
- Réponds de façon courte, claire et professionnelle, sans dépasser 3-4 phrases
- N'utilise JAMAIS de formatage markdown (pas de **, pas de #, pas de tirets)
- Sois chaleureuse, experte et directe
- Si la question dépasse tes domaines, invite à contacter Océane directement`
          : `You are the expert assistant of Océane Maligoi, a fashion strategy consultant with 10 years of experience in large structures. You represent her agency specialized in supporting luxury, premium brands and concept stores.

Your philosophy: high-quality, thorough, friendly, professional and expert strategic and operational support.

You work on: buying strategy, pricing, brand management, product development and business development.

Keep answers short, clear and professional, max 3-4 sentences. Never use markdown formatting (no **, no #, no dashes). Be warm, expert and direct.`,
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

    return res.status(200).json({
      response: data.content[0].text
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      response: 'Erreur de connexion. Réessayez.'
    });
  }
}
