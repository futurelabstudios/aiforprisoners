import { useNavigate } from 'react-router-dom';
import { useApp, Language } from '../context/AppContext';

const languages = [
  {
    id: 'hindi' as Language,
    label: 'हिंदी',
    sub: 'सिर्फ हिंदी में',
    flag: '🇮🇳',
    desc: 'Sirf Hindi',
  },
  {
    id: 'hinglish' as Language,
    label: 'Hinglish',
    sub: 'Hindi + English mix',
    flag: '💬',
    desc: 'Hindi aur English',
  },
  {
    id: 'english' as Language,
    label: 'English',
    sub: 'Simple English only',
    flag: '🔤',
    desc: 'Only English',
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
    <div className="min-h-dvh flex flex-col" style={{ background: 'var(--c-bg)' }}>

      {/* ── Top hero section ── */}
      <div
        className="flex flex-col items-center justify-center text-center px-6 pt-16 pb-10"
        style={{
          background: 'linear-gradient(160deg, #0D0603 0%, #180A04 50%, #251006 100%)',
        }}
      >
        {/* Brand badge */}
        <div className="mb-6">
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-4"
            style={{
              background: 'linear-gradient(135deg, #B8521E, #D4753A)',
              boxShadow: '0 8px 32px rgba(184,82,30,0.45), 0 0 0 1px rgba(255,255,255,0.07)',
            }}
          >
            ⚖️
          </div>
          <h1 className="text-white text-4xl font-extrabold tracking-tight leading-none mb-1">
            न्याय सेतु
          </h1>
          <p className="text-[#C85828] text-base font-semibold tracking-wide">
            Nyay Setu
          </p>
        </div>

        {/* Hero text */}
        <h2 className="text-white text-2xl font-bold leading-snug mb-2 max-w-xs">
          Bridge to Justice
        </h2>
        <p className="text-white/60 text-sm max-w-xs leading-relaxed mb-6">
          Free legal help for prisoners &amp; families across India
        </p>

        {/* Trust pill */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold"
          style={{
            background: 'rgba(184,82,30,0.14)',
            color: '#F5B07A',
            border: '1px solid rgba(184,82,30,0.22)',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
          Available 24×7 • Bilkul Free
        </div>
      </div>

      {/* ── Wave divider ── */}
      <div style={{ background: 'linear-gradient(160deg, #251006 0%, #180A04 100%)', lineHeight: 0 }}>
        <svg viewBox="0 0 390 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 0 Q195 24 390 0 L390 24 L0 24 Z" fill="var(--c-bg)" />
        </svg>
      </div>

      {/* ── Language section ── */}
      <div className="flex-1 px-5 pt-6 pb-6">

        {/* Label */}
        <div className="text-center mb-5">
          <p className="text-xs font-extrabold uppercase tracking-widest mb-1" style={{ color: 'var(--c-label)' }}>
            Step 1 of 1
          </p>
          <h3 className="text-lg font-extrabold" style={{ color: 'var(--c-heading)' }}>
            अपनी भाषा चुनें
          </h3>
          <p className="text-sm mt-0.5" style={{ color: 'var(--c-muted)' }}>
            Choose your language to continue
          </p>
        </div>

        {/* Language cards */}
        <div className="max-w-sm mx-auto space-y-3">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => handleSelect(lang.id)}
              className="lang-card group"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 transition-all"
                style={{
                  background: 'var(--c-primary-l)',
                  boxShadow: '0 2px 8px rgba(200,88,40,0.12)',
                }}
              >
                {lang.flag}
              </div>
              <div className="flex-1">
                <div
                  className="text-xl font-extrabold leading-tight transition-colors group-hover:text-[#C85828]"
                  style={{ color: 'var(--c-heading)' }}
                >
                  {lang.label}
                </div>
                <div className="text-sm mt-0.5" style={{ color: 'var(--c-muted)' }}>
                  {lang.sub}
                </div>
              </div>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                           opacity-0 group-hover:opacity-100 transition-all"
                style={{ background: 'var(--c-primary)', color: 'white' }}
              >
                →
              </div>
            </button>
          ))}
        </div>

        {/* Disclaimer note */}
        <p className="text-center text-xs mt-6 max-w-xs mx-auto leading-relaxed" style={{ color: 'var(--c-label)' }}>
          यह जानकारी शैक्षिक उद्देश्य के लिए है।
          <br />
          For educational purposes. Always consult a lawyer.
        </p>
      </div>

      {/* ── Footer helpline ── */}
      <div
        className="px-5 py-5 text-center"
        style={{
          background: 'var(--c-surface)',
          borderTop: '1px solid var(--c-border)',
        }}
      >
        <p className="text-xs font-semibold mb-1" style={{ color: 'var(--c-muted)' }}>
          📞 Kunji Helpline — Free — Daily 8am to 11pm
        </p>
        <a
          href="tel:18003134963"
          className="text-2xl font-extrabold block"
          style={{ color: 'var(--c-primary)' }}
        >
          1800-313-4963
        </a>
        <p className="text-xs mt-1" style={{ color: 'var(--c-label)' }}>
          Project Second Chance • TYCIA Foundation
        </p>
      </div>
    </div>
  );
}
