import React, { useState, useEffect, useRef } from 'react';
import { X, Send, CheckCircle } from 'lucide-react';

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageCount, setMessageCount] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    if (messageCount >= 3) return;

    const userMessage = { role: 'user', content: inputValue };
    setMessages([...messages, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputValue,
          conversationLength: messages.length
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      setMessageCount(prev => prev + 1);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Erreur de connexion. Réessayez.'
      }]);
    }
    setLoading(false);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactData.email || !contactData.message) return;

    setContactLoading(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...contactData,
          name: contactData.name || contactData.company || 'Contact'
        })
      });

      if (response.ok) {
        setContactSuccess(true);
        setContactData({ name: '', email: '', company: '', message: '' });
        setTimeout(() => {
          setShowContactForm(false);
          setContactSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setContactLoading(false);
  };

  const styles = {
    container: {
      fontFamily: '"Big Caslon", serif',
      width: '100%',
      backgroundColor: '#fff',
      overflowX: 'hidden'
    },
    hero: {
      backgroundColor: '#F5F1ED',
      minHeight: '90vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: isMobile ? '1.5rem 1rem' : '2rem'
    },
    title: {
      fontSize: isMobile ? '2rem' : '3.5rem',
      fontWeight: '300',
      marginBottom: '1rem',
      color: '#4A1F1F'
    },
    subtitle: {
      fontSize: isMobile ? '1.5rem' : '2.5rem',
      fontWeight: '300',
      marginBottom: '2rem',
      color: '#4A1F1F'
    },
    description: {
      fontSize: isMobile ? '1rem' : '1.25rem',
      marginBottom: '1rem',
      opacity: 0.85,
      color: '#4A1F1F'
    },
    button: {
      padding: isMobile ? '0.875rem 1.5rem' : '1rem 2rem',
      fontSize: '1rem',
      fontWeight: '300',
      cursor: 'pointer',
      borderRadius: '0.5rem',
      border: 'none',
      marginBottom: '1rem',
      width: isMobile ? '100%' : 'auto'
    },
    buttonPrimary: {
      backgroundColor: '#4A1F1F',
      color: '#F5F1ED'
    },
    buttonSecondary: {
      backgroundColor: '#F5F1ED',
      color: '#4A1F1F',
      border: '2px solid #4A1F1F'
    },
    section: {
      padding: isMobile ? '3rem 1rem' : '5rem 1rem',
      textAlign: 'center'
    },
    sectionTitle: {
      fontSize: isMobile ? '1.75rem' : '2.25rem',
      fontWeight: '300',
      marginBottom: '2rem',
      color: '#4A1F1F'
    },
    gridContainer: {
      maxWidth: '1280px',
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
      gap: '1.5rem'
    },
    card: {
      padding: '1.5rem',
      borderRadius: '0.5rem',
      border: '1px solid #ddd',
      backgroundColor: '#FEFDFB',
      textAlign: 'left'
    },
    cardTitle: {
      fontSize: '1.25rem',
      marginBottom: '0.75rem',
      color: '#4A1F1F'
    },
    cardText: {
      marginBottom: '1rem',
      opacity: 0.85,
      color: '#4A1F1F'
    },
    listItem: {
      marginBottom: '0.5rem'
    }
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <img src="/logo.png" alt="Logo" style={{ height: isMobile ? '70px' : '100px', width: 'auto', marginBottom: '1rem' }} />
        <h1 style={styles.title}>Océane Maligoi</h1>
        <h2 style={styles.subtitle}>Agence Stratégique Mode</h2>
        <p style={styles.description}>
          Accompagnement stratégique pour marques de luxe premium & distributeurs
        </p>
        <p style={styles.description}>
          Stratégie Achat, Prix & Produit - Pilotage de Marque - Développement Business
        </p>
        <div style={{ width: isMobile ? '100%' : 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button
            onClick={() => setShowChat(true)}
            style={{ ...styles.button, ...styles.buttonPrimary }}
          >
            UNE QUESTION ? DISCUTER AVEC NOTRE EXPERTE 💬
          </button>
          <button
            onClick={() => setShowContactForm(true)}
            style={{ ...styles.button, ...styles.buttonSecondary }}
          >
            DEMANDER UN AUDIT
          </button>
        </div>
      </div>

      {/* Services Section */}
      <section style={{ ...styles.section, backgroundColor: '#fff' }}>
        <h2 style={styles.sectionTitle}>Nos Services</h2>
        <div style={styles.gridContainer}>
          {[
            { emoji: '🛍', title: 'Stratégie d\'Achat de Collection', desc: 'Optimisez vos achats de collections pour maximiser vos marges et la rotation des stocks.', items: ['Analyse de vos fournisseurs', 'Négociation commerciale', 'Planning d\'achat optimisé', 'Gestion des risques'] },
            { emoji: '💰', title: 'Stratégie de Pricing', desc: 'Développez une stratégie tarifaire alignée avec votre positionnement et vos objectifs de marge.', items: ['Analyse concurrentielle', 'Optimisation des marges', 'Politique de réduction', 'Système de promotion'] },
            { emoji: '📊', title: 'Pilotage de Marque', desc: 'Accompagnement stratégique orienté performance pour aligner la marque avec les objectifs business.', items: ['Structuration de la marque', 'Mise en place de process', 'Révision stratégique', 'Accompagnement du dirigeant'] },
            { emoji: '👗', title: 'Développement Produits', desc: 'Transformation des analyses de performance en opportunités produits à forte valeur.', items: ['Analyse des performances', 'Identification d\'opportunités', 'Conception et développement', 'Accompagnement au lancement'] }
          ].map((service, i) => (
            <div key={i} style={styles.card}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{service.emoji}</div>
              <h3 style={styles.cardTitle}>{service.title}</h3>
              <p style={styles.cardText}>{service.desc}</p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {service.items.map((item, j) => (
                  <li key={j} style={styles.listItem}>✅ {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Notre Approche */}
      <section style={{ ...styles.section, backgroundColor: '#F5F1ED' }}>
        <h2 style={styles.sectionTitle}>Notre Approche</h2>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '1.5rem' }}>
          {[
            { num: '01', title: 'Diagnostic', desc: 'Audit approfondi de votre situation' },
            { num: '02', title: 'Stratégie', desc: 'Co-création d\'un plan d\'action' },
            { num: '03', title: 'Implémentation', desc: 'Accompagnement opérationnel' },
            { num: '04', title: 'Suivi', desc: 'Pilotage et optimisation continue' }
          ].map((step, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.875rem', marginBottom: '0.5rem', color: '#4A1F1F' }}>{step.num}</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#4A1F1F' }}>{step.title}</h3>
              <p style={{ color: '#4A1F1F', opacity: 0.7, fontSize: isMobile ? '0.875rem' : '1rem' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cas Clients */}
      <section style={{ ...styles.section, backgroundColor: '#fff' }}>
        <h2 style={styles.sectionTitle}>Nos Succès</h2>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          {[
            { client: 'Distributeur Multi-Marques (ETI)', issue: 'Rotation des stocks faible, marges érodées', solution: 'Stratégie d\'achat & pricing', result: '+23% de marge, -18% d\'invendus', industry: 'Mode Féminin Premium' },
            { client: 'Chaîne Retail (PME Groupe)', issue: 'Identité marque peu claire, croissance bloquée', solution: 'Pilotage de marque complet', result: '+40% de notoriété, +15% de CA', industry: 'Mode Urbaine' }
          ].map((cas, i) => (
            <div key={i} style={{ ...styles.card, borderLeftWidth: '4px', borderLeftStyle: 'solid', borderLeftColor: '#4A1F1F' }}>
              <h3 style={styles.cardTitle}>{cas.client}</h3>
              <p style={styles.cardText}><strong>Enjeu:</strong> {cas.issue}</p>
              <p style={styles.cardText}><strong>Solution:</strong> {cas.solution}</p>
              <div style={{ marginTop: '1rem', padding: '1.5rem', backgroundColor: '#F5F1ED', borderRadius: '0.5rem' }}>
                <p style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', color: '#4A1F1F', margin: 0 }}>{cas.result}</p>
                <p style={{ opacity: 0.5, margin: '0.5rem 0 0 0' }}>{cas.industry}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Offres */}
      <section style={{ ...styles.section, backgroundColor: '#F5F1ED' }}>
        <h2 style={styles.sectionTitle}>Nos Offres</h2>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
          {[
            { title: 'Diagnostic Stratégique', duration: '6 semaines', desc: 'Audit complet', features: ['Analyse détaillée', 'Étude des forces/faiblesses', 'Recommandations', 'Rapport d\'audit'], featured: false },
            { title: 'Accompagnement Stratégique', duration: '3-6 mois', desc: 'Pilotage de votre transformation', features: ['Implémentation du plan', 'Support opérationnel', 'Formation des équipes', 'Tableaux de bord'], featured: true },
            { title: 'Pilotage Annuel', duration: '12 mois', desc: 'Support continu', features: ['Disponibilité conseil', 'Ateliers trimestriels', 'Suivi indicateurs', 'Adaptations'], featured: false }
          ].map((pkg, i) => (
            <div
              key={i}
              style={{
                ...styles.card,
                backgroundColor: pkg.featured ? '#4A1F1F' : '#F5F1ED',
                color: pkg.featured ? '#F5F1ED' : '#4A1F1F',
                transform: (!isMobile && pkg.featured) ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              <h3 style={{ ...styles.cardTitle, color: pkg.featured ? '#F5F1ED' : '#4A1F1F' }}>{pkg.title}</h3>
              <p style={{ fontSize: '0.75rem', marginBottom: '0.5rem', opacity: 0.7 }}>{pkg.duration}</p>
              <p style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: pkg.featured ? '#F5F1ED' : '#4A1F1F' }}>{pkg.desc}</p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1rem' }}>
                {pkg.features.map((f, j) => (
                  <li key={j} style={{ marginBottom: '0.25rem' }}>✅ {f}</li>
                ))}
              </ul>
              <button
                onClick={() => setShowContactForm(true)}
                style={{
                  ...styles.button,
                  backgroundColor: pkg.featured ? '#F5F1ED' : '#4A1F1F',
                  color: pkg.featured ? '#4A1F1F' : '#F5F1ED',
                  width: '100%'
                }}
              >
                NOUS CONTACTER
              </button>
            </div>
          ))}
        </div>

        {/* Conseil Ponctuel */}
        <div style={{ maxWidth: '1280px', margin: '2rem auto 0 auto', padding: '2rem', backgroundColor: '#fff', borderRadius: '0.5rem', border: '1px solid #ddd', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.5rem', color: '#4A1F1F', marginBottom: '0.5rem' }}>Conseil Ponctuel</h3>
          <p style={{ fontSize: '0.75rem', color: '#4A1F1F', opacity: 0.7, marginBottom: '0.5rem' }}>À la demande</p>
          <p style={{ fontSize: '1.1rem', color: '#4A1F1F', marginBottom: '1rem' }}>Expertise sur mesure</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: isMobile ? '1rem' : '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {['Sessions stratégiques', 'Analyse ciblée', 'Recommandations express', 'Flexibilité totale'].map((f, i) => (
              <span key={i} style={{ color: '#4A1F1F', fontSize: isMobile ? '0.875rem' : '1rem' }}>✅ {f}</span>
            ))}
          </div>
          <button
            onClick={() => setShowContactForm(true)}
            style={{ ...styles.button, backgroundColor: '#4A1F1F', color: '#F5F1ED' }}
          >
            NOUS CONTACTER
          </button>
        </div>
      </section>

      {/* Témoignages */}
      <section style={{ ...styles.section, backgroundColor: '#fff' }}>
        <h2 style={styles.sectionTitle}>Témoignages</h2>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {[
            { initials: 'FD', quote: 'L\'accompagnement d\'Océane Maligoi a transformé notre approche du pricing et débloqué 2M€ de marge supplémentaire.', role: 'Directeur Général - Groupe Mode ETI' },
            { initials: 'MC', quote: 'Une réelle expertise en stratégie d\'achat. Les résultats ont dépassé nos attentes dès les 3 premiers mois.', role: 'Responsable Merchandising - Chaîne Retail' },
            { initials: 'SB', quote: 'Enfin quelqu\'un qui comprend vraiment les enjeux du retail mode. Je recommande vivement.', role: 'PDG - Distributeur Multi-Marques' }
          ].map((testimonial, i) => (
            <div key={i} style={{ ...styles.card, borderTopWidth: '4px', borderTopStyle: 'solid', borderTopColor: '#4A1F1F' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#4A1F1F', color: '#D4C4B0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginBottom: '1rem' }}>
                {testimonial.initials}
              </div>
              <p style={{ opacity: 0.8, marginBottom: '1rem' }}>"{testimonial.quote}"</p>
              <p style={{ opacity: 0.7, fontSize: '0.875rem' }}>{testimonial.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Chat Modal */}
      {showChat && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: isMobile ? 'flex-end' : 'center', justifyContent: 'center', padding: isMobile ? '0' : '1rem' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: isMobile ? '1.5rem 1.5rem 0 0' : '1.5rem', width: '100%', maxWidth: '512px', height: isMobile ? '85vh' : '600px', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb', backgroundColor: '#F5F1ED', borderRadius: isMobile ? '1.5rem 1.5rem 0 0' : '1.5rem 1.5rem 0 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '300', color: '#4A1F1F' }}>Votre Experte Mode</h2>
                <button onClick={() => setShowChat(false)} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>✕</button>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {messages.length === 0 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <p style={{ fontSize: '0.875rem', textAlign: 'center', color: '#4A1F1F', opacity: 0.6 }}>
                    Posez une question sur nos services de consulting mode
                  </p>
                </div>
              )}
              {messages.map((msg, i) => {
                const hasLink = msg.role === 'assistant' && msg.content.includes('https://www.oceanemaligoi.com');
                const cleanContent = hasLink
                  ? msg.content.replace(/Pour en savoir plus ou souscrire, contactez-nous ici\s*:\s*https:\/\/www\.oceanemaligoi\.com/g, '').trim()
                  : msg.content;
                return (
                  <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div
                      style={{
                        maxWidth: '80%',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        backgroundColor: msg.role === 'user' ? '#4A1F1F' : '#F5F1ED',
                        color: msg.role === 'user' ? '#D4C4B0' : '#4A1F1F',
                        fontSize: '0.875rem'
                      }}
                    >
                      {cleanContent}
                      {hasLink && (
                        <div style={{ marginTop: '0.75rem' }}>
                          <button
                            onClick={() => { setShowChat(false); setShowContactForm(true); }}
                            style={{ backgroundColor: '#4A1F1F', color: '#F5F1ED', border: 'none', borderRadius: '0.5rem', padding: '0.6rem 1.2rem', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '300' }}
                          >
                            Nous contacter →
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{ padding: '1rem', borderRadius: '0.5rem', backgroundColor: '#F5F1ED', color: '#4A1F1F', fontSize: '0.875rem' }}>
                    ⏳ Réflexion...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {messageCount >= 3 ? (
              <div style={{ padding: '1.5rem', backgroundColor: '#F5F1ED', borderTop: '1px solid #e5e7eb', textAlign: 'center' }}>
                <p style={{ color: '#4A1F1F', fontSize: '0.875rem', marginBottom: '1rem' }}>
                  Vous aurez bientôt accès à votre Experte Mode en illimité grâce à votre abonnement ! En attendant, n'hésitez pas à nous contacter.
                </p>
                <button
                  onClick={() => { setShowChat(false); setShowContactForm(true); }}
                  style={{ padding: '0.75rem 1.5rem', backgroundColor: '#4A1F1F', color: '#F5F1ED', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.875rem' }}
                >
                  Nous contacter
                </button>
              </div>
            ) : (
              <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb', backgroundColor: '#FEFDFB', display: 'flex', gap: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="Posez une question..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  style={{ flex: 1, padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none', fontSize: '0.875rem' }}
                  disabled={loading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={loading}
                  style={{ padding: '0.75rem', borderRadius: '0.5rem', backgroundColor: '#4A1F1F', color: '#D4C4B0', cursor: 'pointer', border: 'none' }}
                >
                  ➤
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contact Form Modal */}
      {showContactForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: isMobile ? 'flex-end' : 'center', justifyContent: 'center', padding: isMobile ? '0' : '1rem' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: isMobile ? '1.5rem 1.5rem 0 0' : '1.5rem', width: '100%', maxWidth: '512px', maxHeight: isMobile ? '90vh' : 'auto', overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ padding: '2rem', borderBottom: '1px solid #e5e7eb', backgroundColor: '#F5F1ED', borderRadius: isMobile ? '1.5rem 1.5rem 0 0' : '1.5rem 1.5rem 0 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 style={{ fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: '300', color: '#4A1F1F' }}>Discutons de Vos Enjeux</h2>
                <button onClick={() => setShowContactForm(false)} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>✕</button>
              </div>
            </div>

            <form onSubmit={handleContactSubmit} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {contactSuccess && (
                <div style={{ padding: '1rem', backgroundColor: '#dcfce7', border: '1px solid #bbf7d0', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: '#16a34a' }}>✓</span>
                  <p style={{ fontSize: '0.875rem', color: '#16a34a', margin: 0 }}>
                    Message envoyé avec succès ! Nous vous contacterons très bientôt.
                  </p>
                </div>
              )}

              <input
                type="text"
                placeholder="Votre prénom et nom"
                value={contactData.name}
                onChange={(e) => setContactData({...contactData, name: e.target.value})}
                style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none', fontSize: '0.875rem' }}
                required
              />

              <input
                type="email"
                placeholder="votre@email.com"
                value={contactData.email}
                onChange={(e) => setContactData({...contactData, email: e.target.value})}
                style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none', fontSize: '0.875rem' }}
                required
              />

              <input
                type="text"
                placeholder="Votre entreprise"
                value={contactData.company}
                onChange={(e) => setContactData({...contactData, company: e.target.value})}
                style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none', fontSize: '0.875rem' }}
              />

              <textarea
                placeholder="Votre message"
                value={contactData.message}
                onChange={(e) => setContactData({...contactData, message: e.target.value})}
                style={{ padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.5rem', outline: 'none', fontSize: '0.875rem', minHeight: '128px', resize: 'none' }}
                required
              ></textarea>

              <button
                type="submit"
                disabled={contactLoading}
                style={{ padding: '0.75rem', backgroundColor: '#4A1F1F', color: '#F5F1ED', cursor: 'pointer', borderRadius: '0.5rem', border: 'none', fontWeight: '300', fontSize: '0.875rem' }}
              >
                {contactLoading ? 'Envoi...' : 'DEMANDER UN AUDIT'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#F5F1ED', color: '#4A1F1F' }}>
        <p>© 2026 Océane Maligoi Consulting</p>
      </footer>
    </div>
  );
}
