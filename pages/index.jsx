import React, { useState, useEffect, useRef } from 'react';
import { X, Send, MessageCircle, Mail, CheckCircle } from 'lucide-react';

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactData, setContactData] = useState({
    email: '',
    company: '',
    message: ''
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

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
          name: contactData.company || 'Contact'
        })
      });

      if (response.ok) {
        setContactSuccess(true);
        setContactData({ email: '', company: '', message: '' });
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

  return (
    <div className="w-full bg-white overflow-hidden" style={{ fontFamily: '"Big Caslon", serif' }}>
      {/* Hero / Header */}
      <div style={{ backgroundColor: '#F5F1ED', minHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '300', marginBottom: '1rem', color: '#4A1F1F' }}>Océane Maligoi</h1>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '300', marginBottom: '2rem', color: '#4A1F1F' }}>Agence Stratégique Mode</h2>
        <p style={{ fontSize: '1.25rem', marginBottom: '1rem', opacity: 0.85, color: '#4A1F1F' }}>
          Accompagnement stratégique pour marques de luxe premium & distributeurs
        </p>
        <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: 0.85, color: '#4A1F1F' }}>
          Stratégie Achat, Prix & Produit - Pilotage de Marque - Développement Business
        </p>
        <button 
          onClick={() => setShowChat(true)}
          style={{ backgroundColor: '#4A1F1F', color: '#F5F1ED', padding: '1rem 2rem', fontSize: '1rem', fontWeight: '300', marginBottom: '1rem', cursor: 'pointer', borderRadius: '0.5rem', border: 'none' }}
        >
          UNE QUESTION ? DISCUTER AVEC NOTRE EXPERT 💬
        </button>
        <button 
          onClick={() => setShowContactForm(true)}
          style={{ backgroundColor: '#F5F1ED', color: '#4A1F1F', padding: '1rem 2rem', fontSize: '1rem', fontWeight: '300', border: '2px solid #4A1F1F', cursor: 'pointer', borderRadius: '0.5rem' }}
        >
          DEMANDER UN AUDIT
        </button>
      </div>

      {/* Services Section */}
      <section className="py-20 px-4 text-center bg-white">
        <h2 className="text-4xl font-light mb-12" style={{ color: '#4A1F1F' }}>Nos Services</h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="p-8 rounded-lg border bg-[#FEFDFB] text-left">
            <div className="text-4xl mb-4">🛍</div>
            <h3 className="text-2xl mb-3" style={{ color: '#4A1F1F' }}>Stratégie d'Achat de Collection</h3>
            <p className="mb-4">Optimisez vos achats de collections pour maximiser vos marges et la rotation des stocks.</p>
            <ul className="mb-4 list-none">
              <li>✅ Analyse de vos fournisseurs</li>
              <li>✅ Négociation commerciale</li>
              <li>✅ Planning d'achat optimisé</li>
              <li>✅ Gestion des risques</li>
            </ul>
          </div>

          <div className="p-8 rounded-lg border bg-[#FEFDFB] text-left">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-2xl mb-3" style={{ color: '#4A1F1F' }}>Stratégie de Pricing</h3>
            <p className="mb-4">Développez une stratégie tarifaire alignée avec votre positionnement et vos objectifs de marge.</p>
            <ul className="mb-4 list-none">
              <li>✅ Analyse concurrentielle</li>
              <li>✅ Optimisation des marges</li>
              <li>✅ Politique de réduction</li>
              <li>✅ Système de promotion</li>
            </ul>
          </div>

          <div className="p-8 rounded-lg border bg-[#FEFDFB] text-left">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-2xl mb-3" style={{ color: '#4A1F1F' }}>Pilotage de Marque</h3>
            <p className="mb-4">Accompagnement stratégique orienté performance pour aligner la marque avec les objectifs business, piloter les décisions par les KPI et transformer la stratégie en levier de croissance.</p>
            <ul className="mb-4 list-none">
              <li>✅ Structuration de la marque</li>
              <li>✅ Mise en place de process</li>
              <li>✅ Révision stratégique</li>
              <li>✅ Accompagnement du dirigeant</li>
            </ul>
          </div>

          <div className="p-8 rounded-lg border bg-[#FEFDFB] text-left">
            <div className="text-4xl mb-4">👗</div>
            <h3 className="text-2xl mb-3" style={{ color: '#4A1F1F' }}>Développement Produits</h3>
            <p className="mb-4">Accompagnement stratégique pour transformer les analyses de performance et les dynamiques du marché en opportunités produits à forte valeur pour la marque.</p>
            <ul className="mb-4 list-none">
              <li>✅ Analyse des performances et des tendances</li>
              <li>✅ Identification d'opportunités de développement</li>
              <li>✅ Conception et développement de produits</li>
              <li>✅ Accompagnement stratégique au lancement</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Notre Approche Section */}
      <section className="py-20 px-4 bg-[#F5F1ED] text-center">
        <h2 className="text-4xl font-light mb-12" style={{ color: '#4A1F1F' }}>Notre Approche</h2>
        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { num: '01', title: 'Diagnostic', desc: 'Audit approfondi de votre situation' },
            { num: '02', title: 'Stratégie', desc: 'Co-création d\'un plan d\'action' },
            { num: '03', title: 'Implémentation', desc: 'Accompagnement opérationnel' },
            { num: '04', title: 'Suivi', desc: 'Pilotage et optimisation continue' }
          ].map((step, i) => (
            <div key={i}>
              <div className="text-3xl mb-2" style={{ color: '#4A1F1F' }}>{step.num}</div>
              <h3 className="text-xl mb-2" style={{ color: '#4A1F1F' }}>{step.title}</h3>
              <p style={{ color: '#4A1F1F', opacity: 0.7 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cas Clients Section */}
      <section className="py-20 px-4 text-center bg-white">
        <h2 className="text-4xl font-light mb-12" style={{ color: '#4A1F1F' }}>Nos Succès</h2>
        <div className="max-w-6xl mx-auto space-y-8">
          {[
            { client: 'Distributeur Multi-Marques (ETI)', issue: 'Rotation des stocks faible, marges érodées', solution: 'Stratégie d\'achat & pricing', result: '+23% de marge, -18% d\'invendus', industry: 'Mode Féminin Premium' },
            { client: 'Chaîne Retail (PME Groupe)', issue: 'Identité marque peu claire, croissance bloquée', solution: 'Pilotage de marque complet', result: '+40% de notoriété, +15% de CA', industry: 'Mode Urbaine' }
          ].map((cas, i) => (
            <div key={i} className="p-8 rounded-lg border-l-4 border-[#4A1F1F] bg-[#FEFDFB] text-left">
              <h3 className="text-lg mb-2" style={{ color: '#4A1F1F' }}>{cas.client}</h3>
              <p style={{ opacity: 0.7 }}><strong>Enjeu:</strong> {cas.issue}</p>
              <p style={{ opacity: 0.7 }}><strong>Solution:</strong> {cas.solution}</p>
              <div className="mt-4 p-6 bg-[#F5F1ED] rounded">
                <p className="text-2xl" style={{ color: '#4A1F1F' }}>{cas.result}</p>
                <p style={{ opacity: 0.5 }}>{cas.industry}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Offres / Packages Section */}
      <section className="py-20 px-4 bg-[#F5F1ED] text-center">
        <h2 className="text-4xl font-light mb-12" style={{ color: '#4A1F1F' }}>Nos Offres</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { title: 'Diagnostic Stratégique', duration: '6 semaines', desc: 'Audit complet de votre activité ou marque', features: ['Analyse détaillée de votre positionnement', 'Étude des forces/faiblesses', 'Recommandations stratégiques', 'Rapport d\'audit complet'], featured: false },
            { title: 'Accompagnement Stratégique', duration: '3-6 mois', desc: 'Pilotage de votre transformation', features: ['Implémentation du plan d\'action', 'Support opérationnel hebdomadaire', 'Formation de vos équipes', 'Tableaux de bord personnalisés'], featured: true },
            { title: 'Pilotage Annuel', duration: '12 mois', desc: 'Support continu de vos enjeux', features: ['Disponibilité conseil régulière', 'Ateliers stratégiques trimestriels', 'Suivi des indicateurs clés', 'Adaptations stratégiques'], featured: false }
          ].map((pkg, i) => (
            <div 
              key={i}
              className="p-8 rounded-lg"
              style={{
                backgroundColor: pkg.featured ? '#4A1F1F' : '#F5F1ED',
                color: pkg.featured ? '#F5F1ED' : '#4A1F1F',
                transform: pkg.featured ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              <h3 className="text-2xl mb-2">{pkg.title}</h3>
              <p className="text-xs mb-2 opacity-70">{pkg.duration}</p>
              <p className="text-3xl mb-2">{pkg.desc}</p>
              <p className="text-sm mb-4 opacity-85">Sur demande</p>
              <ul className="mb-4 text-left list-none">
                {pkg.features.map((feature, j) => (
                  <li key={j}>✅ {feature}</li>
                ))}
              </ul>
              <button 
                onClick={() => setShowContactForm(true)}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: pkg.featured ? '#F5F1ED' : '#4A1F1F',
                  color: pkg.featured ? '#4A1F1F' : '#F5F1ED',
                  cursor: 'pointer',
                  borderRadius: '0.5rem',
                  border: 'none',
                  fontWeight: '300'
                }}
              >
                NOUS CONTACTER
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 text-center bg-white">
        <h2 className="text-4xl font-light mb-12" style={{ color: '#4A1F1F' }}>Témoignages</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            { initials: 'FD', quote: 'L\'accompagnement d\'Océane Maligoi a transformé notre approche du pricing et débloqué 2M€ de marge supplémentaire.', role: 'Directeur Général - Groupe Mode ETI' },
            { initials: 'MC', quote: 'Une réelle expertise en stratégie d\'achat. Les résultats ont dépassé nos attentes dès les 3 premiers mois.', role: 'Responsable Merchandising - Chaîne Retail' },
            { initials: 'SB', quote: 'Enfin quelqu\'un qui comprend vraiment les enjeux du retail mode. Je recommande vivement.', role: 'PDG - Distributeur Multi-Marques' }
          ].map((testimonial, i) => (
            <div key={i} className="p-8 rounded-lg bg-[#F5F1ED] border-t-4 border-[#4A1F1F]">
              <div className="mb-4">
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#4A1F1F', color: '#D4C4B0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {testimonial.initials}
                </div>
              </div>
              <p style={{ opacity: 0.8 }}>"{testimonial.quote}"</p>
              <p className="mt-2 opacity-70">{testimonial.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:w-2xl h-[80vh] sm:h-[600px] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-gray-200" style={{ backgroundColor: '#F5F1ED' }}>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-light" style={{ color: '#4A1F1F', fontFamily: '"Big Caslon CC", serif' }}>
                  Chatbot IA
                </h2>
                <button onClick={() => setShowChat(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-center" style={{ color: '#4A1F1F', opacity: 0.6 }}>
                    Posez une question sur nos services de consulting mode
                  </p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className="max-w-xs px-4 py-3 rounded-lg"
                    style={{
                      backgroundColor: msg.role === 'user' ? '#4A1F1F' : '#F5F1ED',
                      color: msg.role === 'user' ? '#D4C4B0' : '#4A1F1F'
                    }}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-lg" style={{ backgroundColor: '#F5F1ED' }}>
                    <p className="text-sm" style={{ color: '#4A1F1F' }}>⏳ Réflexion...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-200" style={{ backgroundColor: '#FEFDFB' }}>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Posez une question..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none text-sm"
                  disabled={loading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={loading}
                  className="p-3 rounded-lg transition"
                  style={{ backgroundColor: '#4A1F1F', color: '#D4C4B0', cursor: 'pointer', border: 'none' }}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full sm:w-2xl shadow-2xl">
            <div className="p-8 border-b border-gray-200" style={{ backgroundColor: '#F5F1ED' }}>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-light" style={{ color: '#4A1F1F', fontFamily: '"Big Caslon CC", serif' }}>
                  Discutons de Vos Enjeux
                </h2>
                <button onClick={() => setShowContactForm(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleContactSubmit} className="p-8 space-y-4">
              {contactSuccess && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-sm text-green-600">
                    Message envoyé avec succès ! Nous vous contacterons très bientôt.
                  </p>
                </div>
              )}

              <input
                type="email"
                placeholder="votre@email.com"
                value={contactData.email}
                onChange={(e) => setContactData({...contactData, email: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none text-sm"
                required
              />

              <input
                type="text"
                placeholder="Votre entreprise"
                value={contactData.company}
                onChange={(e) => setContactData({...contactData, company: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none text-sm"
              />

              <textarea
                placeholder="Votre message"
                value={contactData.message}
                onChange={(e) => setContactData({...contactData, message: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none text-sm h-32 resize-none"
                required
              ></textarea>

              <button
                type="submit"
                disabled={contactLoading}
                className="w-full py-3 font-light tracking-widest text-sm transition"
                style={{ backgroundColor: '#4A1F1F', color: '#F5F1ED', cursor: 'pointer', borderRadius: '0.5rem', border: 'none' }}
              >
                {contactLoading ? 'Envoi...' : 'DEMANDER UN AUDIT'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-8 text-center bg-[#F5F1ED]" style={{ color: '#4A1F1F' }}>
        <p>© 2024 Océane Maligoi Consulting</p>
      </footer>
    </div>
  );
}
