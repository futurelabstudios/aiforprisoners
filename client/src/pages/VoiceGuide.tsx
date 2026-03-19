import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, t, Language } from '../context/AppContext';
import { ArrowLeft, Mic, Scale, BookOpen, House, Phone } from 'lucide-react';


/* ── Tell TypeScript about the ElevenLabs custom element ── */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { 'agent-id'?: string },
        HTMLElement
      >;
    }
  }
}

const AGENT_ID = 'agent_9101km0pktmbfqk9swtj8zrqvtvr';

export default function VoiceGuide() {
  const { language } = useApp();
  const navigate = useNavigate();
  const scriptLoaded = useRef(false);
  const [ready, setReady] = useState(false);

  /* ── Load the ElevenLabs ConvAI widget script once ── */
  useEffect(() => {
    if (scriptLoaded.current) { setReady(true); return; }
    const existing = document.querySelector(
      'script[src="https://unpkg.com/@elevenlabs/convai-widget-embed"]'
    );
    if (existing) { scriptLoaded.current = true; setReady(true); return; }

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
    script.async = true;
    script.type = 'text/javascript';
    script.onload = () => { scriptLoaded.current = true; setReady(true); };
    document.body.appendChild(script);
    return () => { /* script persists intentionally */ };
  }, []);

  return (
    <div className="flex flex-col h-dvh xl:h-full" style={{ background: 'var(--c-bg)' }}>

      {/* ── Header ── */}
      <div
        className="theme-header px-4 pt-10 pb-4 flex items-center gap-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <button
          onClick={() => navigate('/home')}
          className="text-xl p-1 -ml-1 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: 'var(--c-primary)' }}
        >
          <Mic size={20} color="#fff" />
        </div>
        <div className="flex-1">
          <h1 className="text-white font-extrabold text-base leading-tight">
            {t(language, {
              hindi: 'आवाज़ में बात करें',
              english: 'Talk to AI Voice',
              hinglish: 'Awaaz Mein Baat Karein',
            })}
          </h1>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {t(language, {
              hindi: 'FutureLabs रियल-टाइम Voice AI',
              english: 'FutureLabs Real-Time Voice AI',
              hinglish: 'FutureLabs Real-Time Voice AI',
            })}
          </p>
        </div>
      
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
          style={{ background: 'rgba(22,163,74,0.15)', color: '#4ADE80', border: '1px solid rgba(22,163,74,0.25)' }}
        >
          <span className="dot-live" />
          LIVE
        </div>
      </div>

      {/* ── Main content: clean, centered widget ── */}
      <div className="flex-1 content-shell flex flex-col items-center justify-center pb-24 pt-6">
        <div className="w-full max-w-xl">
          <div className="text-center mb-4">
            <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--c-label)' }}>
              {t(language, { hindi: 'वॉइस असिस्टेंट', english: 'Voice Assistant', hinglish: 'Voice Assistant' })}
            </p>
            <h2 className="text-xl font-extrabold" style={{ color: 'var(--c-heading)' }}>
              {t(language, {
                hindi: 'सीधे बोलें, तुरंत जवाब पाएं',
                english: 'Speak directly, get instant answers',
                hinglish: 'Seedha bolo, turant jawab pao',
              })}
            </h2>
          </div>

          {ready ? (
            <div
              className="w-full rounded-3xl overflow-hidden flex items-center justify-center p-3"
              style={{
                minHeight: '340px',
                background: 'var(--c-surface)',
                border: '1px solid var(--c-border)',
              }}
            >
              <elevenlabs-convai agent-id={AGENT_ID} />
            </div>
          ) : (
            <div
              className="w-full rounded-3xl flex flex-col items-center justify-center gap-3"
              style={{
                minHeight: '340px',
                background: 'var(--c-surface)',
                border: '1px solid var(--c-border)',
              }}
            >
              <div className="flex gap-2">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
              <p className="text-sm" style={{ color: 'var(--c-muted)' }}>
                Voice AI loading...
              </p>
            </div>
          )}

          <button
            onClick={() => navigate('/chat')}
            className="w-full mt-4 py-3 rounded-2xl text-sm font-bold transition-all active:scale-95"
            style={{
              background: 'var(--c-primary-l)',
              color: 'var(--c-primary)',
              border: '1px solid rgba(200,88,40,0.25)',
            }}
          >
            {t(language, {
              hindi: 'टाइप करके पूछें',
              english: 'Switch to Text Chat',
              hinglish: 'Text chat pe jao',
            })}
          </button>
        </div>
      </div>

      {/* ── Bottom Nav ── */}
      <div className="bottom-nav">
        {[
          { Icon: Scale, label: { hindi: 'मदद', english: 'Chat', hinglish: 'Chat' }, path: '/chat' },
          { Icon: BookOpen, label: { hindi: 'गाइड', english: 'Guide', hinglish: 'Guide' }, path: '/manual' },
          { Icon: House, label: { hindi: 'होम', english: 'Home', hinglish: 'Home' }, path: '/home' },
          { Icon: Mic, label: { hindi: 'वॉइस', english: 'Voice', hinglish: 'Voice' }, path: '/voice-guide' },
          { Icon: Phone, label: { hindi: 'हेल्पलाइन', english: 'Helpline', hinglish: 'Helpline' }, path: '/helpline' },
        ].map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            aria-label={item.label[language as Language]}
            className={`bottom-nav-item ${item.path === '/home' ? 'bottom-nav-home' : ''}
                       ${item.path === '/voice-guide' ? 'nav-item-active' : 'nav-item-inactive'}`}
          >
            <span className="nav-icon"><item.Icon size={18} /></span>
            <span className="nav-label">{item.label[language as Language]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
