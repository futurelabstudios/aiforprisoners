import { useNavigate } from 'react-router-dom';
import { useApp, t } from '../context/AppContext';
import { Language } from '../context/AppContext';

const cards = [
  {
    emoji: '⚖️',
    bg: '#C85828',
    path: '/chat',
    titles: { hindi: 'कानूनी मदद', english: 'Legal Help', hinglish: 'Kanoon Ki Madad' },
    subs: { hindi: 'FIR, जमानत, धारा समझें', english: 'FIR, Bail, Sections', hinglish: 'FIR, Bail, Sections' },
  },
  {
    emoji: '🏠',
    bg: '#16A34A',
    path: '/post-release',
    titles: { hindi: 'जेल के बाद', english: 'After Release', hinglish: 'Jail Ke Baad' },
    subs: { hindi: 'नौकरी, घर, दस्तावेज़', english: 'Jobs, Shelter, Documents', hinglish: 'Naukri, Ghar, Docs' },
  },
  {
    emoji: '📞',
    bg: '#DC2626',
    path: '/helpline',
    titles: { hindi: 'हेल्पलाइन', english: 'Helplines', hinglish: 'Helpline' },
    subs: { hindi: 'आपातकालीन नंबर', english: 'Emergency numbers', hinglish: 'Emergency numbers' },
  },
  {
    emoji: '👨‍👩‍👧',
    bg: '#7C3AED',
    path: '/chat',
    titles: { hindi: 'परिवार', english: 'Family', hinglish: 'Parivaar' },
    subs: { hindi: 'मुलाकात, केस जानकारी', english: 'Visits, case info', hinglish: 'Mulakat, case info' },
  },
];

const quickQs = [
  { hindi: '🔒 जमानत मिलेगी?', english: '🔒 Can I get bail?', hinglish: '🔒 Bail milegi kya?' },
  { hindi: '📋 FIR में क्या है?', english: '📋 What is in FIR?', hinglish: '📋 FIR mein kya hai?' },
  { hindi: '⚠️ धाराएं कितनी गंभीर हैं?', english: '⚠️ How serious are sections?', hinglish: '⚠️ Sections kitne serious hain?' },
];

export default function Home() {
  const { language } = useApp();
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-[#F7F6F3] flex flex-col">
      {/* Header */}
      <div className="bg-[#1C0A02] px-5 pt-10 pb-5 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C85828] flex items-center justify-center text-xl">⚖️</div>
            <div>
              <div className="font-extrabold text-lg leading-tight">न्याय सेतु</div>
              <div className="text-[#C85828] text-xs font-medium">Nyay Setu</div>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-white/10 hover:bg-white/20 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all"
          >
            🌐 {language === 'hindi' ? 'हिंदी' : language === 'english' ? 'EN' : 'HG'}
          </button>
        </div>
        <div className="text-xl font-bold mb-0.5">
          {t(language, { hindi: 'नमस्ते 🙏', english: 'Welcome 🙏', hinglish: 'Namaste 🙏' })}
        </div>
        <div className="text-white/60 text-sm">
          {t(language, {
            hindi: 'आज हम आपकी कैसे मदद करें?',
            english: 'How can we help you today?',
            hinglish: 'Aaj hum aapki kaise madad karein?',
          })}
        </div>
      </div>

      {/* Emergency Banner */}
      <a href="tel:18003134963" className="emergency-banner">
        <span>📞</span>
        <span className="font-bold">Kunji Helpline: 1800-313-4963</span>
        <span className="text-amber-700 font-normal">Free • Daily 8am–11pm</span>
      </a>

      {/* Main content */}
      <div className="flex-1 content-shell py-5 pb-24">

        {/* Feature cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
          {cards.map((card, i) => (
            <button
              key={i}
              onClick={() => navigate(card.path)}
              className="rounded-2xl p-4 text-left active:scale-95 transition-all duration-150 text-white flex flex-col gap-3 min-h-[130px]"
              style={{ background: card.bg, boxShadow: `0 4px 16px ${card.bg}40` }}
            >
              <span className="text-3xl">{card.emoji}</span>
              <div>
                <div className="font-extrabold text-sm leading-tight">{card.titles[language as Language]}</div>
                <div className="text-xs opacity-75 mt-0.5 leading-tight">{card.subs[language as Language]}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Voice CTA */}
        <button
          onClick={() => navigate('/voice-guide')}
          className="w-full mb-4 rounded-2xl p-4 text-left active:scale-95 transition-all flex items-center gap-4"
          style={{ background: '#1C0A02', boxShadow: '0 4px 20px rgba(28,10,2,0.25)' }}
        >
          <div className="w-12 h-12 rounded-xl bg-[#C85828] flex items-center justify-center text-2xl flex-shrink-0">
            🎙️
          </div>
          <div>
            <div className="text-white font-extrabold text-base">
              {t(language, { hindi: 'आवाज़ में मदद लें', english: 'Get Voice Help', hinglish: 'Voice Mein Madad Lo' })}
            </div>
            <div className="text-white/50 text-sm">
              {t(language, { hindi: 'बटन दबाएँ और बोलें', english: 'Tap and speak', hinglish: 'Tap karo aur bolo' })}
            </div>
          </div>
          <div className="ml-auto text-[#C85828] text-xl">→</div>
        </button>

        {/* Quick questions */}
        <div className="card mb-4">
          <p className="text-[#9CA3AF] text-xs font-bold uppercase tracking-widest mb-3">
            {t(language, { hindi: '⚡ जल्दी पूछें', english: '⚡ Quick Questions', hinglish: '⚡ Jaldi Puchein' })}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {quickQs.map((q, i) => (
              <button
                key={i}
                onClick={() => navigate('/chat', { state: { question: q[language as Language] } })}
                className="quick-btn"
              >
                {q[language as Language]}
              </button>
            ))}
          </div>
          <button
            onClick={() => navigate('/chat')}
            className="mt-3 w-full rounded-xl py-3 font-bold text-sm text-white active:scale-95 transition-all"
            style={{ background: '#C85828' }}
          >
            {t(language, { hindi: 'AI से पूछें →', english: 'Ask AI →', hinglish: 'AI Se Puchein →' })}
          </button>
        </div>

        {/* Disclaimer */}
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
          <p className="text-amber-800 text-sm font-medium">
            {t(language, {
              hindi: '⚠️ यह सामान्य जानकारी है। अपने मामले के लिए कृपया वकील से सलाह लें।',
              english: '⚠️ General information only. Please consult a lawyer for your specific case.',
              hinglish: '⚠️ Yeh general jaankari hai. Apne case ke liye vakeel se zaroor milein.',
            })}
          </p>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="bottom-nav">
        {[
          { icon: '🏠', label: { hindi: 'होम', english: 'Home', hinglish: 'Home' }, path: '/home' },
          { icon: '⚖️', label: { hindi: 'मदद', english: 'Chat', hinglish: 'Chat' }, path: '/chat' },
          { icon: '🏗️', label: { hindi: 'बाद में', english: 'After', hinglish: 'Baad Mein' }, path: '/post-release' },
          { icon: '🎙️', label: { hindi: 'वॉइस', english: 'Voice', hinglish: 'Voice' }, path: '/voice-guide' },
          { icon: '📞', label: { hindi: 'हेल्पलाइन', english: 'Helpline', hinglish: 'Helpline' }, path: '/helpline' },
        ].map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex-1 flex flex-col items-center py-3 gap-0.5 text-xs font-semibold transition-colors
                       ${item.path === '/home' ? 'nav-item-active' : 'nav-item-inactive'}`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label[language as Language]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
