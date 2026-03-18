import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp, t, Theme } from './context/AppContext';
import LanguageSelect from './pages/LanguageSelect';
import Home from './pages/Home';
import LegalChat from './pages/LegalChat';
import PostRelease from './pages/PostRelease';
import Helpline from './pages/Helpline';
import VoiceGuide from './pages/VoiceGuide';
import Manual from './pages/Manual';

/* ── Left brand panel ── */
function LeftPanel() {
  const { language } = useApp();
  return (
    <div className="flex flex-col justify-between h-full py-12 px-10">
      <div>
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6"
          style={{ background: 'linear-gradient(135deg, #CF7859, #8C3A1E)', boxShadow: '0 8px 32px rgba(207,120,89,0.30)' }}
        >⚖️</div>
        <h1 className="text-4xl font-extrabold leading-tight mb-1" style={{ color: '#FAF7F4', letterSpacing: '-0.03em' }}>
          न्याय सेतु
        </h1>
        <p className="text-base font-semibold mb-1" style={{ color: '#CF7859' }}>Nyay Setu</p>
        <p className="text-base font-medium mb-10" style={{ color: 'rgba(250,247,244,0.45)' }}>Bridge to Justice</p>

        <div className="space-y-6">
          {[
            { icon: '⚖️', color: '#CF7859', head: { hindi: 'AI कानूनी सहायक', english: 'AI Legal Advisor', hinglish: 'AI Legal Advisor' }, sub: { hindi: 'FIR, जमानत, धाराएं', english: 'FIR, bail, court sections', hinglish: 'FIR, bail, sections' } },
            { icon: '🎙️', color: '#A78BFA', head: { hindi: 'आवाज़ में बात करें', english: 'Real-Time Voice AI', hinglish: 'Voice AI' }, sub: { hindi: 'हिंदी/अंग्रेजी में बोलें', english: 'Speak in Hindi or English', hinglish: 'Hindi ya English mein' } },
            { icon: '📖', color: '#34D399', head: { hindi: 'कानूनी गाइड', english: 'Legal Knowledge Base', hinglish: 'Legal Guide' }, sub: { hindi: 'आपके अधिकार — सरल भाषा में', english: 'Your rights, explained simply', hinglish: 'Aapke rights — simple bhasha mein' } },
            { icon: '📞', color: '#F87171', head: { hindi: 'हेल्पलाइन नंबर', english: 'Emergency Helplines', hinglish: 'Helplines' }, sub: { hindi: 'सभी ज़रूरी नंबर', english: 'All critical numbers', hinglish: 'Saare numbers' } },
          ].map((f, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: `${f.color}18`, color: f.color }}>{f.icon}</div>
              <div>
                <div className="font-bold text-sm mb-0.5" style={{ color: '#FAF7F4' }}>{f.head[language]}</div>
                <div className="text-xs" style={{ color: 'rgba(250,247,244,0.40)' }}>{f.sub[language]}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 rounded-2xl px-4 py-3"
          style={{ background: 'rgba(207,120,89,0.08)', border: '1px solid rgba(207,120,89,0.18)' }}>
          <span className="text-lg">🆓</span>
          <div>
            <div className="text-xs font-bold" style={{ color: '#CF7859' }}>
              {t(language, { hindi: 'बिल्कुल मुफ्त', english: 'Completely Free', hinglish: 'Bilkul Free' })}
            </div>
            <div className="text-xs" style={{ color: 'rgba(250,247,244,0.35)' }}>Project Second Chance • TYCIA Foundation</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Right info panel ── */
function RightPanel() {
  const { language } = useApp();
  const nums = [
    { emoji: '🔑', name: 'Kunji Helpline', number: '1800-313-4963', color: '#CF7859', note: { hindi: 'मुफ्त • रोज 8am–11pm', english: 'Free • Daily 8am–11pm', hinglish: 'Free • Daily 8am–11pm' } },
    { emoji: '⚖️', name: 'NALSA Legal Aid', number: '1516', color: '#A78BFA', note: { hindi: 'मुफ्त वकील • 24/7', english: 'Free lawyer • 24/7', hinglish: 'Free lawyer • 24/7' } },
    { emoji: '🚔', name: 'Police', number: '100', color: '#60A5FA', note: { hindi: 'आपातकाल', english: 'Emergency', hinglish: 'Emergency' } },
    { emoji: '🚑', name: 'Ambulance', number: '108', color: '#F87171', note: { hindi: 'मुफ्त • 24/7', english: 'Free • 24/7', hinglish: 'Free • 24/7' } },
  ];
  const rights = [
    { hindi: '📋 FIR की एक प्रति पाना आपका अधिकार है — मुफ्त।', english: '📋 You have the right to a free copy of your FIR.', hinglish: '📋 FIR ki copy paana aapka haq hai — free mein.' },
    { hindi: '⚖️ 60 दिनों में चार्जशीट नहीं? डिफ़ॉल्ट जमानत का हक।', english: '⚖️ No chargesheet in 60 days? You earn Default Bail.', hinglish: '⚖️ 60 din mein chargesheet nahi? Default Bail milti hai.' },
    { hindi: '🆓 मुफ्त सरकारी वकील — NALSA: 1516', english: '🆓 Entitled to a free lawyer — NALSA: 1516', hinglish: '🆓 Free sarkari vakeel — NALSA: 1516' },
  ];
  const tipIdx = new Date().getDate() % rights.length;

  return (
    <div className="flex flex-col gap-6 h-full py-12 px-10">
      <div>
        <p className="text-xs font-extrabold uppercase tracking-widest mb-4" style={{ color: 'rgba(250,247,244,0.30)' }}>
          {t(language, { hindi: '📞 आपातकालीन नंबर', english: '📞 Emergency Numbers', hinglish: '📞 Emergency Numbers' })}
        </p>
        <div className="space-y-2">
          {nums.map((e, i) => (
            <a key={i} href={`tel:${e.number.replace(/[-\s]/g, '')}`}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                style={{ background: `${e.color}18`, color: e.color }}>{e.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold" style={{ color: '#FAF7F4' }}>{e.name}</div>
                <div className="text-xs" style={{ color: 'rgba(250,247,244,0.35)' }}>{e.note[language]}</div>
              </div>
              <div className="text-sm font-extrabold flex-shrink-0" style={{ color: e.color }}>{e.number}</div>
            </a>
          ))}
        </div>
      </div>

      <div className="rounded-2xl p-5" style={{ background: 'rgba(207,120,89,0.08)', border: '1px solid rgba(207,120,89,0.18)' }}>
        <p className="text-xs font-extrabold uppercase tracking-widest mb-3" style={{ color: '#CF7859' }}>
          📖 {t(language, { hindi: 'आज का अधिकार', english: "Today's Right", hinglish: 'Aaj Ka Adhikar' })}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(250,247,244,0.70)' }}>{rights[tipIdx][language]}</p>
      </div>

      <div className="rounded-2xl p-4 mt-auto"
        style={{ background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.15)' }}>
        <p className="text-xs leading-relaxed" style={{ color: 'rgba(251,191,36,0.65)' }}>
          ⚠️ {t(language, {
            hindi: 'यह जानकारी शैक्षिक उद्देश्य के लिए है। अपने मामले के लिए वकील से परामर्श लें।',
            english: 'For educational purposes only. Consult a lawyer for your specific case.',
            hinglish: 'Yeh educational hai. Apne case ke liye vakeel se zaroor milein.',
          })}
        </p>
      </div>
    </div>
  );
}

function PanelDivider() {
  return (
    <div className="hidden xl:block w-px self-stretch my-8 flex-shrink-0"
      style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.07) 20%, rgba(255,255,255,0.07) 80%, transparent)' }} />
  );
}

/* ── Bottom desktop controls — only on lg+ ── */
function DesktopControls() {
  const { theme, setTheme, language } = useApp();

  return (
    <div
      className="hidden lg:flex fixed bottom-5 left-1/2 -translate-x-1/2 z-[9999] items-center gap-1 rounded-full px-1 py-1"
      style={{
        background: 'rgba(17,14,12,0.88)',
        border: '1px solid rgba(255,255,255,0.10)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.50)',
      }}
    >
      {/* Theme toggle */}
      {([['dark', '🌙'], ['light', '☀️']] as [Theme, string][]).map(([value, icon]) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          title={value === 'dark' ? 'Dark theme' : 'Light theme'}
          className="rounded-full px-4 py-2 text-sm font-bold transition-all"
          style={theme === value
            ? { background: 'rgba(255,255,255,0.15)', color: '#FAF7F4' }
            : { color: 'rgba(255,255,255,0.35)' }}
        >{icon}</button>
      ))}
    </div>
  );
}

/* ── Inner app with route awareness ── */
function AppShell() {
  const location = useLocation();
  const isLangSelect = location.pathname === '/';
  const { theme } = useApp();

  /* Outer background for desktop */
  const outerBg = isLangSelect
    ? 'var(--c-header)'
    : theme === 'light'
      ? `radial-gradient(ellipse at 30% 20%, rgba(184,90,60,0.07) 0%, transparent 55%),
         radial-gradient(ellipse at 75% 75%, rgba(60,80,130,0.05) 0%, transparent 55%),
         #EDE8E0`
      : `radial-gradient(ellipse at 30% 20%, rgba(207,120,89,0.09) 0%, transparent 55%),
         radial-gradient(ellipse at 75% 75%, rgba(80,100,160,0.07) 0%, transparent 55%),
         #0C0A09`;

  const ROUTES = (
    <Routes>
      <Route path="/"             element={<LanguageSelect />} />
      <Route path="/home"         element={<Home />} />
      <Route path="/chat"         element={<LegalChat />} />
      <Route path="/post-release" element={<PostRelease />} />
      <Route path="/helpline"     element={<Helpline />} />
      <Route path="/voice-guide"  element={<VoiceGuide />} />
      <Route path="/manual"       element={<Manual />} />
      <Route path="*"             element={<Navigate to="/" replace />} />
    </Routes>
  );

  /* Desktop/laptop layout — wide center on laptop, 3-column on xl */
  const centeredColumnClass = !isLangSelect
    ? 'md:max-w-[960px] md:w-full md:mx-auto md:pb-20 lg:pb-24 xl:max-w-none xl:mx-0 xl:pb-0 xl:w-[520px] xl:border-x xl:shadow-[0_0_0_1px_rgba(207,120,89,0.10),0_36px_96px_rgba(0,0,0,0.45)]'
    : '';

  return (
    <>
      <div
        className={`min-h-dvh xl:h-dvh flex items-stretch ${!isLangSelect ? 'md:px-6 lg:px-10 xl:items-stretch xl:justify-start xl:px-0' : ''}`}
        style={{ background: outerBg }}
      >
        {!isLangSelect && (
          <>
            <div className="hidden xl:flex flex-1 flex-col"><LeftPanel /></div>
            <PanelDivider />
          </>
        )}

        {/* Center content */}
        <div
          className={`
            flex flex-col flex-1 xl:flex-none xl:overflow-y-auto xl:overflow-x-hidden
            ${centeredColumnClass}
          `}
          style={!isLangSelect ? { background: 'var(--c-bg)', borderColor: 'rgba(207,120,89,0.18)' } : {}}
        >
          {ROUTES}
        </div>

        {!isLangSelect && (
          <>
            <PanelDivider />
            <div className="hidden xl:flex flex-1 flex-col"><RightPanel /></div>
          </>
        )}
      </div>

      {/* Bottom controls — only on desktop */}
      {!isLangSelect && <DesktopControls />}
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AppProvider>
  );
}
