export default async function handler(req, res) {
  // CORS
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
    const { name, email, company, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Option 1 : Envoyer via Resend (gratuit et facile)
    if (process.env.RESEND_API_KEY) {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'oceanemaligoi.com',
          to: process.env.CONTACT_EMAIL || 'info.maligoi.oceane@gmail.com',
          subject: `Nouveau contact de ${name}`,
          html: `
            <h2>Nouveau message de contact</h2>
            <p><strong>Nom:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Entreprise:</strong> ${company || 'Non spécifiée'}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `
        })
      });

      if (emailResponse.ok) {
        // Envoyer aussi une confirmation à l'utilisateur
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
          },
          body: JSON.stringify({
            from: 'contact@oceanemaligoi.com',
            to: email,
            subject: 'Merci pour votre message',
            html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #F5F1ED;">
    <div style="background-color: #4A1F1F; padding: 30px; text-align: center;">
      <img src="https://www.oceanemaligoi.com/logo.png" alt="Océane Maligoi Consulting" style="max-width: 200px; height: auto;" />
    </div>
    <div style="padding: 40px 30px;">
      <h2 style="color: #4A1F1F; font-size: 22px;">Merci ${name} !</h2>
      <p style="color: #4A1F1F; font-size: 16px; line-height: 1.6;">Nous avons bien reçu votre demande et nous vous recontacterons sous 48h.</p>
      <p style="color: #4A1F1F; font-size: 16px; line-height: 1.6;">En attendant, n'hésitez pas à visiter notre site pour en savoir plus sur nos services.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://www.oceanemaligoi.com" style="background-color: #4A1F1F; color: #F5F1ED; padding: 14px 30px; text-decoration: none; border-radius: 4px; font-size: 16px;">Visiter notre site</a>
      </div>
    </div>
    <div style="text-align: center; padding: 20px 30px;">
      <p style="color: #4A1F1F; font-size: 14px; margin-bottom: 10px;">Suivez-nous sur Instagram</p>
      <a href="https://www.instagram.com/oceanemaligoi" style="background-color: #4A1F1F; color: #F5F1ED; padding: 10px 24px; text-decoration: none; border-radius: 4px; font-size: 14px;">📸 @oceanemaligoi</a>
    </div>
    <div style="background-color: #4A1F1F; padding: 20px; text-align: center; margin-top: 20px;">
      <p style="color: #F5F1ED; font-size: 12px; margin: 0;">© 2026 Océane Maligoi Consulting · <a href="https://www.oceanemaligoi.com" style="color: #F5F1ED;">oceanemaligoi.com</a></p>
    </div>
  </div>
`,
          })
        });

        return res.status(200).json({ success: true });
      }
    }

    // Option 2 : Sauvegarder dans Supabase (backup)
    if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
      await fetch(`${process.env.SUPABASE_URL}/rest/v1/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_KEY}`
        },
        body: JSON.stringify({
          name,
          email,
          company,
          message,
          created_at: new Date().toISOString()
        })
      }).catch(err => console.log('Supabase save:', err));
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
