import { useNavigate } from 'react-router-dom';
import { useApp, Language } from '../context/AppContext';
import { speakWithElevenLabs } from '../utils/tts';

const languages = [
  {
    id: 'hindi' as Language,
    label: 'हिंदी',
    sub: 'Hindi',
    desc: 'सिर्फ हिंदी में बात करें',
    flag: '🇮🇳',
    color: 'from-[#8B3215] to-[#C85828]',
  },
  {
    id: 'hinglish' as Language,
    label: 'Hinglish',
    sub: 'हिंदी + English',
    desc: 'Mix of Hindi and English',
    flag: '💬',
    color: 'from-[#6B2010] to-[#A84420]',
  },
  {
    id: 'english' as Language,
    label: 'English',
    sub: 'अंग्रेज़ी',
    desc: 'Simple English only',
    flag: '🔤',
    color: 'from-[#C85828] to-[#E07C35]',
  },
];

export default function LanguageSelect() {
  const { setLanguage } = useApp();
  const navigate = useNavigate();

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    navigate('/home');
  };

  return (
    <div className="min-h-dvh bg-gradient-to-b from-[#EDE3CC] via-[#F5EDD8] to-[#FAF6EE] flex flex-col items-center justify-between px-6 py-10">
      {/* Logo */}
      <div className="flex flex-col items-center pt-8">
        <div className="text-6xl mb-4">⚖️</div>
        <h1 className="text-navy-900 text-4xl font-extrabold tracking-tight text-center">
          न्याय सेतु
        </h1>
        <p className="text-saffron-500 text-xl font-semibold mt-1">Nyay Setu</p>
        <p className="text-gray-600 text-base text-center mt-3 leading-relaxed">
          Bridge to Justice
          <br />
          <span className="text-gray-500 text-sm">Qanooni Madad • Legal Aid • कानूनी सहायता</span>
        </p>
      </div>

      {/* Language Selection */}
      <div className="w-full max-w-4xl">
        <div className="flex justify-center mb-3">
          <div className="section-kicker">PERSONALIZED AI EXPERIENCE</div>
        </div>
        <button
          onClick={() => speakWithElevenLabs('Namaste. Kripya apni bhasha chuniye. Hindi, Hinglish, ya English button dabaiye.')}
          className="w-full mb-4 bg-gradient-to-r from-[#8B3215] to-[#C85828] text-white rounded-2xl py-3 px-4 font-bold text-base md:max-w-xl md:mx-auto shadow-lg"
        >
          🔊 Tap to Hear Instructions
        </button>
        <p className="text-gray-600 text-center text-base mb-5 font-medium">
          Apni Bhasha Chuniye / अपनी भाषा चुनें
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => handleSelect(lang.id)}
              className={`w-full bg-gradient-to-r ${lang.color} text-white rounded-2xl py-5 px-5
                         flex items-center gap-4 shadow-xl active:scale-95 transition-all duration-150
                         border border-white/25
                         hover:opacity-90`}
            >
              <span className="text-3xl">{lang.flag}</span>
              <div className="text-left">
                <div className="text-2xl font-extrabold">{lang.label}</div>
                <div className="text-sm opacity-80">{lang.desc}</div>
              </div>
              <span className="ml-auto text-xl opacity-70">›</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center">
        <p className="text-gray-500 text-xs">
          Kunji Helpline (Toll Free)
        </p>
        <a href="tel:18003134963" className="text-saffron-500 font-bold text-lg">
          1800-313-4963
        </a>
        <p className="text-gray-600 text-xs mt-1">Project Second Chance • TYCIA Foundation</p>
      </div>
    </div>
  );
}
