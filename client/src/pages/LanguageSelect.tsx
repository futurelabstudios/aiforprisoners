import { useNavigate } from 'react-router-dom';
import { useApp, Language } from '../context/AppContext';
import { speakWithElevenLabs } from '../utils/tts';

const languages = [
  {
    id: 'hindi' as Language,
    label: 'हिंदी',
    sub: 'Hindi',
    desc: 'सिर्फ हिंदी में',
    flag: '🇮🇳',
  },
  {
    id: 'hinglish' as Language,
    label: 'Hinglish',
    sub: 'हिंदी + English',
    desc: 'Hindi aur English mix',
    flag: '💬',
  },
  {
    id: 'english' as Language,
    label: 'English',
    sub: 'अंग्रेज़ी',
    desc: 'Simple English only',
    flag: '🔤',
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
    <div className="min-h-dvh bg-[#F7F6F3] flex flex-col">
      {/* Top brand bar */}
      <div className="bg-[#1C0A02] px-6 py-4 flex items-center gap-3">
        <span className="text-2xl">⚖️</span>
        <div>
          <span className="text-white font-extrabold text-lg tracking-tight">न्याय सेतु</span>
          <span className="text-[#C85828] text-sm font-medium ml-2">Nyay Setu</span>
        </div>
      </div>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center">
        <div className="w-20 h-20 rounded-3xl bg-[#C85828] flex items-center justify-center text-4xl shadow-lg mb-6">
          ⚖️
        </div>
        <h1 className="text-[#111827] text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-2">
          Bridge to Justice
        </h1>
        <p className="text-[#6B7280] text-base max-w-sm mb-1">
          Free legal help for prisoners & families in India
        </p>
        <p className="text-[#6B7280] text-sm mb-10">
          Qanooni Madad • कानूनी सहायता
        </p>

        {/* Voice instructions button */}
        <button
          onClick={() => speakWithElevenLabs('Namaste. Kripya apni bhasha chuniye. Hindi, Hinglish, ya English.')}
          className="mb-6 flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#E5E7EB] bg-white text-sm font-semibold text-[#6B7280] hover:border-[#C85828] hover:text-[#C85828] transition-all"
        >
          🔊 Tap to hear instructions
        </button>

        {/* Language label */}
        <p className="text-[#111827] font-bold text-lg mb-4">
          अपनी भाषा चुनें / Choose your language
        </p>

        {/* Language buttons */}
        <div className="w-full max-w-sm space-y-3">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => handleSelect(lang.id)}
              className="w-full bg-white border-2 border-[#E5E7EB] rounded-2xl px-5 py-4
                         flex items-center gap-4 active:scale-95 transition-all duration-150
                         hover:border-[#C85828] hover:shadow-md group text-left"
            >
              <span className="text-3xl">{lang.flag}</span>
              <div className="flex-1">
                <div className="text-xl font-extrabold text-[#111827] group-hover:text-[#C85828] transition-colors">
                  {lang.label}
                </div>
                <div className="text-sm text-[#6B7280]">{lang.desc}</div>
              </div>
              <div className="text-[#C85828] text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#E5E7EB] bg-white px-6 py-4 text-center">
        <p className="text-[#9CA3AF] text-xs mb-0.5">Kunji Helpline (Toll Free) — Daily 8am–11pm</p>
        <a href="tel:18003134963" className="text-[#C85828] font-extrabold text-xl">
          1800-313-4963
        </a>
        <p className="text-[#9CA3AF] text-xs mt-0.5">Project Second Chance • TYCIA Foundation</p>
      </div>
    </div>
  );
}
