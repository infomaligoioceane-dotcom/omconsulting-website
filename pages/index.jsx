import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Send, MessageCircle, CheckCircle, ArrowRight } from 'lucide-react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [language, setLanguage] = useState('fr');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userCompany, setUserCompany] = useState('');
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const translations = {
    fr: {
      nav: {
        services: 'SERVICES',
        expertise: 'EXPERTISE',
        offres: 'OFFRES',
        contact: 'CONTACT'
      },
      hero: {
        title: 'Agence de Consulting Mode',
        subtitle: 'Accompagnement stratégique et opérationnel pour distributeurs et entreprises de mode. Optimisez votre stratégie d\'achat, votre pricing, votre marque et vos produits.',
        btn1: 'DEMANDER UN AUDIT',
        btn2: 'DISCUTER AVEC L\'IA'
      },
      chat: {
        title: 'Chatbot Conseil IA',
        subtitle: 'Posez vos questions et recevez des recommandations personnalisées',
        placeholder: 'Posez votre question...',
        send: 'Envoyer',
        welcome: 'Bonjour 👋 Je suis votre consultant IA Océane Maligoi. Comment puis-je vous aider ? Parlez-moi de votre situation dans le domaine de la mode et du retail.',
        leadForm: {
          title: 'Pour continuer, créez un compte',
          name: 'Nom complet',
          email: 'Email',
          company: 'Entreprise',
          submit: 'Continuer',
          placeholder: 'Votre nom...'
        }
      }
    },
    en: {
      nav: {
        services: 'SERVICES',
        expertise: 'EXPERTISE',
        offres: 'OFFERS',
        contact: 'CONTACT'
      },
      hero: {
        title: 'Fashion Consulting Agency',
        subtitle: 'Strategic and operational support for distributors and fashion companies. Optimize your collection buying strategy, pricing, brand management and product development.',
        btn1: 'REQUEST AN AUDIT',
        btn2: 'CHAT WITH AI'
      },
      chat: {
        title: 'AI Consulting Chatbot',
        subtitle: 'Ask your questions and receive personalized recommendations',
        placeholder: 'Ask your question...',
        send: 'Send',
        welcome: 'Hello 👋 I\'m your Océane Maligoi AI consultant. How can I help you? Tell me about your situation in fashion and retail.',
        leadForm: {
          title: 'To continue, create an account',
          name: 'Full name',
          email: 'Email',
          company: 'Company',
          submit: 'Continue',
          placeholder: 'Your name...'
        }
      }
    }
  };

  const t = translations[language];

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    if (!isAuthenticated && messages.length === 0) {
      setShowLeadForm(true);
      return;
    }

    const userMessage = {
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputValue,
          language: language,
          conversationLength: messages.length,
          userEmail: userEmail,
          userName: userName,
          userCompany: userCompany
        })
      });

      const data = await response.json();
      
      const assistantMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (messages.filter(m => m.role === 'user').length >= 3) {
        setTimeout(() => {
          setShowLeadForm(true);
        }, 1000);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: language === 'fr' ? 'Erreur de connexion. Réessayez.' : 'Connection error. Please try again.',
        timestamp: new Date()
      }]);
    }

    setLoading(false);
  };

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    if (userName && userEmail && userCompany) {
      setIsAuthenticated(true);
      setShowLeadForm(false);
      
      const welcomeMsg = language === 'fr' 
        ? `Merci ${userName}! Continuons... Parlez-moi plus de vos défis.`
        : `Thank you ${userName}! Let's continue... Tell me more about your challenges.`;
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: welcomeMsg,
        timestamp: new Date()
      }]);
    }
  };

  const handleLanguageToggle = (lang) => {
    setLanguage(lang);
    setMessages([{
      role: 'assistant',
      content: lang === 'fr' ? t.chat.welcome : translations.en.chat.welcome,
      timestamp: new Date()
    }]);
  };

  return (
    <div className="w-full bg-white overflow-hidden" style={{ fontFamily: '"Big Caslon", serif' }}>
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div className="text-3xl font-light" style={{ color: '#4A1F1F', fontFamily: '"Big Caslon CC", serif', letterSpacing: '0.05em' }}>
                OM
              </div>
              <div className="text-xs font-light tracking-widest" style={{ color: '#4A1F1F' }}>
                CONSULTING
              </div>
            </div>

            <div className="hidden md:flex gap-10 items-center">
              <a href="#services" className="text-sm tracking-wide hover:opacity-60 transition" style={{ color: '#4A1F1F' }}>
                {t.nav.services}
              </a>
              <a href="#expertise" className="text-sm tracking-wide hover:opacity-60 transition" style={{ color: '#4A1F1F' }}>
                {t.nav.expertise}
              </a>
              <a href="#offres" className="text-sm tracking-wide hover:opacity-60 transition" style={{ color: '#4A1F1F' }}>
                {t.nav.offres}
              </a>
              <button 
                onClick={() => setShowChat(!showChat)}
                className="text-sm tracking-wide hover:opacity-60 transition flex items-center gap-2"
                style={{ color: '#4A1F1F' }}
              >
                <MessageCircle className="w-4 h-4" />
                CHAT IA
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => handleLanguageToggle('fr')}
                  className="px-3 py-1 text-xs font-light transition"
                  style={{
                    backgroundColor: language === 'fr' ? '#4A1F1F' : 'transparent',
                    color: language === 'fr' ? '#D4C4B0' : '#4A1F1F'
                  }}
                >
                  FR
                </button>
                <button
                  onClick={() => handleLanguageToggle('en')}
                  className="px-3 py-1 text-xs font-light transition"
                  style={{
                    backgroundColor: language === 'en' ? '#4A1F1F' : 'transparent',
                    color: language === 'en' ? '#D4C4B0' : '#4A1F1F'
                  }}
                >
                  EN
                </button>
              </div>

              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2">
                {isMenuOpen ? <X className="w-5 h-5" style={{ color: '#4A1F1F' }} /> : <Menu className="w-5 h-5" style={{ color: '#4A1F1F' }} />}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden pb-6 space-y-4 border-t border-gray-200 pt-4">
              <a href="#services" className="block text-sm tracking-wide" style={{ color: '#4A1F1F' }}>
                {t.nav.services}
              </a>
              <button 
                onClick={() => {
                  setShowChat(!showChat);
                  setIsMenuOpen(false);
                }}
                className="block text-sm tracking-wide w-full text-left"
                style={{ color: '#4A1F1F' }}
              >
                CHAT IA
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#D4C4B0' }}>
        <div className="absolute inset-0" style={{
          background: `linear-gradient(135deg, #D4C4B0 0%, #E8DCD0 50%, #D4C4B0 100%)`,
        }}></div>

        <div className="absolute top-20 right-10 w-64 h-64 opacity-10" style={{
          borderRadius: '50%',
          backgroundColor: '#4A1F1F',
        }}></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div style={{ fontFamily: '"Le Jour Script", cursive', fontSize: '3.5rem', color: '#4A1F1F', letterSpacing: '0.02em', fontWeight: '400' }}>
              Océane Maligoi
            </div>
            
            <h1 className="text-5xl md:text-6xl font-light leading-tight" style={{ color: '#4A1F1F', fontFamily: '"Big Caslon CC", serif', letterSpacing: '0.03em' }}>
              {t.hero.title}
            </h1>
            
            <p className="text-lg md:text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: '#4A1F1F', opacity: 0.85, fontFamily: '"Arboria", sans-serif', fontWeight: '300' }}>
              {t.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <button className="px-12 py-4 font-light tracking-widest transition transform hover:scale-105 text-sm" style={{
                backgroundColor: '#4A1F1F',
                color: '#D4C4B0',
                fontFamily: '"Arboria", sans-serif'
              }}>
                {t.hero.btn1}
              </button>
              <button 
                onClick={() => setShowChat(true)}
                className="px-12 py-4 font-light tracking-widest transition border-2 text-sm flex items-center justify-center gap-2" 
                style={{
                  borderColor: '#4A1F1F',
                  color: '#4A1F1F',
                  fontFamily: '"Arboria", sans-serif'
                }}
              >
                <MessageCircle className="w-4 h-4" />
                {t.hero.btn2}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:w-2xl h-[80vh] sm:h-[600px] flex flex-col shadow-2xl">
            {/* Chat Header */}
            <div className="p-6 border-b border-gray-200" style={{ backgroundColor: '#F5F1ED' }}>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-light" style={{ color: '#4A1F1F', fontFamily: '"Big Caslon CC", serif' }}>
                  {t.chat.title}
                </h2>
                <button 
                  onClick={() => setShowChat(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm" style={{ color: '#4A1F1F', opacity: 0.6, fontFamily: '"Arboria", sans-serif' }}>
                {t.chat.subtitle}
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#4A1F1F', opacity: 0.3 }} />
                    <p className="text-sm" style={{ color: '#4A1F1F', opacity: 0.6, fontFamily: '"Arboria", sans-serif' }}>
                      {t.chat.welcome}
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className="max-w-xs px-4 py-3 rounded-lg"
                      style={{
                        backgroundColor: msg.role === 'user' ? '#4A1F1F' : '#F5F1ED',
                        color: msg.role === 'user' ? '#D4C4B0' : '#4A1F1F'
                      }}
                    >
                      <p className="text-sm" style={{ fontFamily: '"Arboria", sans-serif', fontWeight: '300' }}>
                        {msg.content}
                      </p>
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-lg" style={{ backgroundColor: '#F5F1ED' }}>
                    <p className="text-sm" style={{ color: '#4A1F1F', fontFamily: '"Arboria", sans-serif' }}>
                      ⏳ {language === 'fr' ? 'Réflexion...' : 'Thinking...'}
                    </p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Lead Form Modal */}
            {showLeadForm && !isAuthenticated && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-3xl sm:rounded-3xl">
                <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full m-4">
                  <h3 className="text-xl font-light mb-4" style={{ color: '#4A1F1F', fontFamily: '"Big Caslon CC", serif' }}>
                    {t.chat.leadForm.title}
                  </h3>
                  
                  <form onSubmit={handleLeadSubmit} className="space-y-4">
                    <input
                      type="text"
                      placeholder={t.chat.leadForm.name}
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none text-sm"
                      style={{ fontFamily: '"Arboria", sans-serif' }}
                      required
                    />
                    <input
                      type="email"
                      placeholder={t.chat.leadForm.email}
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none text-sm"
                      style={{ fontFamily: '"Arboria", sans-serif' }}
                      required
                    />
                    <input
                      type="text"
                      placeholder={t.chat.leadForm.company}
                      value={userCompany}
                      onChange={(e) => setUserCompany(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none text-sm"
                      style={{ fontFamily: '"Arboria", sans-serif' }}
                      required
                    />
                    <button
                      type="submit"
                      className="w-full py-3 font-light tracking-widest text-sm transition"
                      style={{ backgroundColor: '#4A1F1F', color: '#D4C4B0', fontFamily: '"Arboria", sans-serif' }}
                    >
                      {t.chat.leadForm.submit}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200" style={{ backgroundColor: '#FEFDFB' }}>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder={t.chat.placeholder}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none text-sm"
                  style={{ fontFamily: '"Arboria", sans-serif' }}
                  disabled={loading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={loading}
                  className="p-3 rounded-lg transition"
                  style={{ backgroundColor: '#4A1F1F', color: '#D4C4B0' }}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-200 py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div style={{ fontFamily: '"Big Caslon CC", serif', fontSize: '1.5rem', color: '#4A1F1F', marginBottom: '1rem', fontWeight: '400' }}>
              OM
            </div>
            <p className="text-sm" style={{ color: '#4A1F1F', opacity: 0.6, fontFamily: '"Arboria", sans-serif', fontWeight: '300' }}>
              Agence de Consulting Mode
            </p>
            <p className="text-xs mt-6" style={{ color: '#4A1F1F', opacity: 0.5, fontFamily: '"Arboria", sans-serif' }}>
              &copy; 2024 Océane Maligoi Consulting. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
