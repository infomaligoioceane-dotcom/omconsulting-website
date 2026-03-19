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

    // Email 1 — Notification à Océane
    const notifResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'contact@oceanemaligoi.com',
        to: process.env.CONTACT_EMAIL || 'info.maligoi.oceane@gmail.com',
        subject: `Nouvelle demande de contact — ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #F5F1ED;">
            <div style="background-color: #4A1F1F; padding: 30px; text-align: center;">
              <img src="https://www.oceanemaligoi.com/logo.png" alt="Océane Maligoi Consulting" style="max-width: 200px; height: auto;" />
            </div>
            <div style="padding: 40px 30px;">
              <h2 style="color: #4A1F1F; font-size: 22px; margin-bottom: 24px;">Nouvelle demande de contact</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #4A1F1F; font-weight: bold; width: 120px;">Nom</td>
                  <td style="padding: 10px 0; color: #4A1F1F;">${name}</td>
                </tr>
                <tr style="background-color: #fff;">
                  <td style="padding: 10px; color: #4A1F1F; font-weight: bold;">Email</td>
                  <td style="padding: 10px; color: #4A1F1F;"><a href="mailto:${email}" style="color: #4A1F1F;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #4A1F1F; font-weight: bold;">Entreprise</td>
                  <td style="padding: 10px 0; color: #4A1F1F;">${company || 'Non renseignée'}</td>
                </tr>
                <tr style="background-color: #fff;">
                  <td style="padding: 10px; color: #4A1F1F; font-weight: bold; vertical-align: top;">Message</td>
                  <td style="padding: 10px; color: #4A1F1F;">${message.replace(/\n/g, '<br>')}</td>
                </tr>
              </table>
              <div style="text-align: center; margin: 30px 0;">
                <a href="mailto:${email}" style="background-color: #4A1F1F; color: #F5F1ED; padding: 14px 30px; text-decoration: none; border-radius: 4px; font-size: 16px;">
                  Répondre à ${name}
                </a>
              </div>
            </div>
            <div style="background-color: #4A1F1F; padding: 20px; text-align: center;">
              <p style="color: #F5F1ED; font-size: 12px; margin: 0;">
                © 2026 Océane Maligoi Consulting · <a href="https://www.oceanemaligoi.com" style="color: #F5F1ED;">oceanemaligoi.com</a>
              </p>
            </div>
          </div>
        `
      })
    });

    if (!notifResponse.ok) {
      const error = await notifResponse.json();
      console.error('Resend error (notif):', error);
      return res.status(500).json({ error: 'Failed to send notification email' });
    }

    // Email 2 — Confirmation au client
    const confirmResponse = await fetch('https://api.resend.com/emails', {
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
              <p style="color: #4A1F1F; font-size: 16px; line-height: 1.6;">
                Nous avons bien reçu votre demande et nous vous recontacterons sous 48h.
              </p>
              <p style="color: #4A1F1F; font-size: 16px; line-height: 1.6;">
                En attendant, n'hésitez pas à visiter notre site pour en savoir plus sur nos services.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://www.oceanemaligoi.com" style="background-color: #4A1F1F; color: #F5F1ED; padding: 14px 30px; text-decoration: none; border-radius: 4px; font-size: 16px;">
                  Visiter notre site
                </a>
              </div>
            </div>
            <div style="text-align: center; padding: 20px 30px;">
              <p style="color: #4A1F1F; font-size: 14px; margin-bottom: 10px;">Suivez-nous sur Instagram</p>
              <a href="https://www.instagram.com/oceanemaligoi" style="background-color: #4A1F1F; color: #F5F1ED; padding: 10px 24px; text-decoration: none; border-radius: 4px; font-size: 14px;">
                📸 @oceanemaligoi
              </a>
            </div>
            <div style="background-color: #4A1F1F; padding: 20px; text-align: center; margin-top: 20px;">
              <p style="color: #F5F1ED; font-size: 12px; margin: 0;">
                © 2026 Océane Maligoi Consulting · <a href="https://www.oceanemaligoi.com" style="color: #F5F1ED;">oceanemaligoi.com</a>
              </p>
            </div>
          </div>
        `
      })
    });

    if (!confirmResponse.ok) {
      const error = await confirmResponse.json();
      console.error('Resend error (confirm):', error);
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
