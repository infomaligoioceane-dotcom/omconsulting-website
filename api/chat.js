// api/chat.js - Vercel Serverless Function
// Ce fichier gère la communication avec Claude et Supabase

const Anthropic = require('@anthropic-ai/sdk');
const { createClient } = require('@supabase/supabase-js');

const client = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY
});

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const systemPrompts = {
  fr: `Tu es un consultant stratégique en mode et retail pour l'agence Océane Maligoi. 
  
  Ton rôle :
  1. Poser des questions consultatives pour comprendre la situation de l'entreprise
  2. Donner des conseils limités mais pertinents basés sur l'expertise en :
     - Stratégie d'achat de collections
     - Stratégie de pricing
     - Pilotage de marque
     - Développement de produits
  3. Après 3-4 échanges, recommander nos services payants
  
  Services proposés :
  - Diagnostic Stratégique (audit 4 semaines)
  - Accompagnement Stratégique (3-6 mois)
  - Retainer Annuel (support continu)
  
  Style :
  - Professionnel mais accessible
  - Consultative (poser des questions avant de recommander)
  - Basée sur l'expertise mode/retail
  - Créer du besoin sans être agressif
  
  Quand rediriger vers offre payante :
  - Après avoir identifié 3+ enjeux
  - Proposer le Diagnostic Stratégique en priorité
  - Message : "Pour une analyse personnalisée approfondie, notre Diagnostic Stratégique est idéal. Souhaitez-vous prendre rendez-vous ?"`,
  
  en: `You are a strategic fashion and retail consultant for Océane Maligoi agency.
  
  Your role:
  1. Ask consultative questions to understand the company's situation
  2. Provide limited but relevant advice based on expertise in:
     - Collection buying strategy
     - Pricing strategy
     - Brand management
     - Product development
  3. After 3-4 exchanges, recommend our paid services
  
  Services offered:
  - Strategic Diagnosis (4-week audit)
  - Strategic Support (3-6 months)
  - Annual Retainer (continuous support)
  
  Style:
  - Professional but accessible
  - Consultative (ask questions before recommending)
  - Based on fashion/retail expertise
  - Create need without being aggressive
  
  When to redirect to paid offer:
  - After identifying 3+ issues
  - Suggest Strategic Diagnosis as priority
  - Message: "For an in-depth personalized analysis, our Strategic Diagnosis is ideal. Would you like to schedule an appointment?"`
};

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
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
    const { message, language, conversationLength, userEmail, userName, userCompany } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    const lang = language === 'en' ? 'en' : 'fr';

    // Sauvegarder la conversation dans Supabase
    if (userEmail) {
      // Vérifier ou créer l'utilisateur
      let { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('email', userEmail)
        .single();

      if (!user) {
        const { data: newUser } = await supabase
          .from('users')
          .insert([{ email: userEmail, name: userName, company: userCompany, language: lang }])
          .select()
          .single();
        user = newUser;
      }

      // Sauvegarder le message utilisateur
      await supabase
        .from('conversations')
        .insert([{
          user_id: user.id,
          role: 'user',
          content: message,
          language: lang
        }]);
    }

    // Appeler Claude API
    const systemPrompt = systemPrompts[lang];
    
    // Contexte des enjeux identifiés (pour redirection après 3 messages)
    let redirectMessage = '';
    if (conversationLength >= 5) {
      redirectMessage = lang === 'fr' 
        ? '\n\nNote: Cette conversation a atteint 3 échanges. Proposer une offre payante (Diagnostic Stratégique).'
        : '\n\nNote: This conversation has reached 3 exchanges. Propose a paid offer (Strategic Diagnosis).';
    }

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: systemPrompt + redirectMessage,
      messages: [
        {
          role: 'user',
          content: message
        }
      ]
    });

    const assistantMessage = response.content[0].text;

    // Sauvegarder la réponse de Claude
    if (userEmail) {
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('email', userEmail)
        .single();

      if (user) {
        await supabase
          .from('conversations')
          .insert([{
            user_id: user.id,
            role: 'assistant',
            content: assistantMessage,
            language: lang
          }]);
      }
    }

    return res.status(200).json({ response: assistantMessage });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: error.message,
      response: 'Erreur de traitement. Veuillez réessayer.'
    });
  }
};
