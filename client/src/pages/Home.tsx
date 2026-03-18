import { useNavigate } from 'react-router-dom';
import { useApp, t } from '../context/AppContext';
import { Language } from '../context/AppContext';

const cards = [
  {
    emoji: '⚖️',
    color: 'from-[#8B3215] to-[#C85828]',
    border: 'border-[#D4C4A0]',
    path: '/chat',
    titles: {
      hindi: 'कानूनी मदद',
      english: 'Legal Help',
      hinglish: 'Kanoon Mein Madad',
    },
    subs: {
      hindi: 'FIR, जमानत, धारा की जानकारी',
      english: 'FIR, Bail, Sections explained',
      hinglish: 'FIR, Bail, Sections samjhein',
    },
  },
  {
    emoji: '🏠',
    color: 'from-emerald-600 to-green-700',
    border: 'border-green-200',
    path: '/post-release',
    titles: {
      hindi: 'जेल के बाद',
      english: 'After Release',
      hinglish: 'Jail Ke Baad',
    },
    subs: {
      hindi: 'नौकरी, घर, दस्तावेज़, स्वास्थ्य',
      english: 'Jobs, Shelter, Documents, Health',
      hinglish: 'Naukri, Ghar, Documents, Sehat',
    },
  },
  {
    emoji: '📞',
    color: 'from-rose-600 to-red-700',
    border: 'border-red-200',
    path: '/helpline',
    titles: {
      hindi: 'हेल्पलाइन',
      english: 'Helplines',
      hinglish: 'Helpline Numbers',
    },
    subs: {
      hindi: 'आपातकालीन नंबर, मुफ़्त सहायता',
      english: 'Emergency numbers, Free help',
      hinglish: 'Emergency numbers, Free help',
    },
  },
  {
    emoji: '👨‍👩‍👧',
    color: 'from-[#C85828] to-[#E07C35]',
    border: 'border-[#D4C4A0]',
    path: '/chat',
    titles: {
      hindi: 'परिवार की मदद',
      english: 'Family Support',
      hinglish: 'Parivaar Ki Madad',
    },
    subs: {
      hindi: 'मुलाकात, केस की जानकारी, मदद',
      english: 'Visiting, case info, support',
      hinglish: 'Mulakat, case info, support',
    },
  },
];

const greetings = {
  hindi: 'नमस्ते 🙏',
  english: 'Welcome 🙏',
  hinglish: 'Namaste 🙏',
};

const subtitles = {
  hindi: 'आज हम आपकी कैसे मदद करें?',
  english: 'How can we help you today?',
  hinglish: 'Aaj hum aapki kaise madad karein?',
};

export default function Home() {
  const { language } = useApp();
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh bg-[#F0E8D5] flex flex-col">
      {/* Header */}
      <div className="theme-header px-5 pt-10 pb-6 text-white relative">
        {/* Language toggle */}
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 right-4 bg-white/10 rounded-xl px-3 py-1 text-xs font-semibold"
        >
          🌐 {language === 'hindi' ? 'हिंदी' : language === 'english' ? 'EN' : 'HG'}
        </button>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">⚖️</span>
          <div>
            <h1 className="text-2xl font-extrabold">न्याय सेतु</h1>
            <p className="text-gray-300 text-sm">Nyay Setu</p>
          </div>
        </div>

        <div className="ai-chip mb-3">✨ AI Justice Copilot</div>

        <p className="text-xl font-bold">{t(language, greetings)}</p>
        <p className="text-gray-300 text-base mt-1">{t(language, subtitles)}</p>
      </div>

      {/* Emergency Banner */}
      <a href="tel:18003134963" className="emergency-banner flex items-center justify-center gap-2">
        <span>📞</span>
        <span>Kunji Helpline (Free): 1800-313-4963 | Daily 8am–11pm</span>
      </a>

      {/* Main Cards */}
      <div className="flex-1 content-shell py-5 md:py-6">
        <div className="premium-card mb-4">
          <div className="section-kicker mb-2">AI-FIRST EXPERIENCE</div>
          <p className="text-sm text-gray-700 font-semibold leading-relaxed">
            {t(language, {
              hindi: 'हर स्क्रीन में आवाज़, चैट और त्वरित मदद जोड़ी गई है ताकि कम पढ़े-लिखे यूज़र भी आसानी से उपयोग कर सकें।',
              english: 'Every screen now supports voice, chat, and instant help so even non-literate users can navigate easily.',
              hinglish: 'Har screen mein voice, chat aur turant help hai taaki low-literacy users bhi easily use kar saken.',
            })}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {cards.map((card, i) => (
            <button
              key={i}
              onClick={() => navigate(card.path)}
              className={`bg-gradient-to-br ${card.color} text-white rounded-2xl p-5
                         shadow-lg active:scale-95 transition-all duration-150 text-left
                         flex flex-col gap-2 min-h-[140px] border border-white/25`}
            >
              <span className="text-4xl">{card.emoji}</span>
              <div>
                <div className="font-extrabold text-base leading-tight">
                  {card.titles[language]}
                </div>
                <div className="text-xs opacity-80 mt-1 leading-tight">
                  {card.subs[language]}
                </div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => navigate('/voice-guide')}
          className="w-full mb-4 rounded-2xl bg-gradient-to-r from-[#6B2010] via-[#C85828] to-[#E07C35] text-white
                     py-4 px-4 text-left shadow-xl active:scale-95 transition-all border border-white/20"
        >
          <div className="text-xl font-extrabold">🎙️ {t(language, {
            hindi: 'आवाज़ में मदद लें',
            english: 'Get Voice Help',
            hinglish: 'Voice Mein Madad Lo',
          })}</div>
          <div className="text-sm text-orange-50 mt-1">
            {t(language, {
              hindi: 'बटन दबाएँ, बोलें, और जवाब सुनें',
              english: 'Tap, speak, and hear legal guidance',
              hinglish: 'Tap karo, bolo, aur jawab awaaz mein suno',
            })}
          </div>
        </button>

        {/* Quick Action — Legal Chat */}
        <div className="card glass-panel mb-4">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-3">
            {t(language, {
              hindi: '⚡ जल्दी पूछें',
              english: '⚡ Quick Questions',
              hinglish: '⚡ Jaldi Puchein',
            })}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              {
                q: { hindi: '🔒 जमानत मिलेगी?', english: '🔒 Can I get bail?', hinglish: '🔒 Bail milegi kya?' },
              },
              {
                q: { hindi: '📋 FIR में क्या है?', english: '📋 What is in FIR?', hinglish: '📋 FIR mein kya hai?' },
              },
              {
                q: { hindi: '⚠️ धाराएं कितनी गंभीर हैं?', english: '⚠️ How serious are the sections?', hinglish: '⚠️ Sections kitne serious hain?' },
              },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => navigate('/chat', { state: { question: item.q[language] } })}
                className="quick-btn text-left"
              >
                {item.q[language]}
              </button>
            ))}
          </div>
          <button
            onClick={() => navigate('/chat')}
            className="mt-3 w-full bg-saffron-500 text-white rounded-xl py-3 font-bold text-sm
                       active:scale-95 transition-all"
          >
            {t(language, {
              hindi: 'AI से पूछें →',
              english: 'Ask AI →',
              hinglish: 'AI Se Puchein →',
            })}
          </button>
        </div>

        {/* Info strip */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-amber-800 text-sm font-medium">
            {t(language, {
              hindi: '⚠️ यह सामान्य जानकारी है। अपने मामले के लिए कृपया वकील से सलाह लें।',
              english: '⚠️ This is general information. Please consult a lawyer for your specific case.',
              hinglish: '⚠️ Yeh general jaankari hai. Apne case ke liye ek vakeel se zaroor milein.',
            })}
          </p>
        </div>
      </div>

      {/* Bottom Nav */}
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
            className={`flex-1 flex flex-col items-center py-3 gap-1 text-xs font-semibold
                       transition-colors ${item.path === '/home' ? 'nav-item-active' : 'nav-item-inactive'}`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label[language]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
