import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, t } from '../context/AppContext';

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
    <div className="flex flex-col h-dvh" style={{ background: 'var(--c-header)' }}>

      {/* ── Header ── */}
      <div
        className="theme-header px-4 pt-10 pb-4 flex items-center gap-3"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <button
          onClick={() => navigate('/home')}
          className="text-xl p-1 -ml-1 text-white/70 hover:text-white transition-colors"
        >
          ←
        </button>
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: 'var(--c-primary)' }}
        >
          🎙️
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

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col items-center justify-between px-5 pb-8 pt-6 overflow-y-auto">

        {/* ── Orb + branding ── */}
        <div className="flex flex-col items-center text-center gap-4 mb-6">
          {/* Animated orb */}
          <div className="voice-ai-orb">
            🎙️
          </div>

          {/* Waveform decoration */}
          <div className="voice-wave mt-2">
            {[18, 28, 36, 24, 36, 28, 18].map((h, i) => (
              <div
                key={i}
                className="voice-bar"
                style={{ height: `${h}px`, animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>

          <div className="mt-2">
            <p className="text-white font-extrabold text-xl leading-tight">
              {t(language, {
                hindi: 'बोलिए, सुन रहा हूँ',
                english: 'Speak, I\'m listening',
                hinglish: 'Boliye, main sun raha hoon',
              })}
            </p>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {t(language, {
                hindi: 'अपना कानूनी सवाल बोलें — तुरंत जवाब मिलेगा',
                english: 'Ask your legal question — instant reply',
                hinglish: 'Apna legal sawaal bolein — turant jawab milega',
              })}
            </p>
          </div>

          {/* FutureLabs badge */}
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.60)',
            }}
          >
            ⚡ Powered by FutureLabs Voice AI
          </div>
        </div>

        {/* ── ElevenLabs ConvAI Widget ── */}
        <div className="w-full flex flex-col items-center gap-4">
          {ready ? (
            <div
              className="w-full rounded-3xl overflow-hidden flex items-center justify-center"
              style={{
                minHeight: '200px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.10)',
              }}
            >
              <elevenlabs-convai agent-id={AGENT_ID} />
            </div>
          ) : (
            <div
              className="w-full rounded-3xl flex flex-col items-center justify-center gap-3"
              style={{
                minHeight: '200px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.10)',
              }}
            >
              <div className="flex gap-2">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.40)' }}>
                Voice AI loading…
              </p>
            </div>
          )}

          {/* How to use */}
          <div
            className="w-full rounded-2xl p-4"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {t(language, { hindi: 'कैसे इस्तेमाल करें', english: 'How to use', hinglish: 'Kaise use karein' })}
            </p>
            <div className="space-y-2">
              {[
                {
                  step: '1',
                  hindi: 'ऊपर वॉइस बटन दबाएं',
                  english: 'Tap the voice button above',
                  hinglish: 'Upar voice button dabaein',
                },
                {
                  step: '2',
                  hindi: 'अपना कानूनी सवाल बोलें',
                  english: 'Speak your legal question',
                  hinglish: 'Apna legal sawaal bolein',
                },
                {
                  step: '3',
                  hindi: 'AI से आवाज़ में जवाब सुनें',
                  english: 'Hear the AI reply in voice',
                  hinglish: 'AI se awaaz mein jawab sunein',
                },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0"
                    style={{ background: 'var(--c-primary)', color: 'white' }}
                  >
                    {item.step}
                  </div>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.60)' }}>
                    {t(language, { hindi: item.hindi, english: item.english, hinglish: item.hinglish })}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Fallback: go to text chat */}
          <button
            onClick={() => navigate('/chat')}
            className="w-full py-3 rounded-2xl text-sm font-bold transition-all active:scale-95"
            style={{
              background: 'rgba(200,88,40,0.15)',
              color: '#FBBF8A',
              border: '1px solid rgba(200,88,40,0.25)',
            }}
          >
            {t(language, {
              hindi: 'या टाइप करके पूछें →',
              english: 'Or type your question →',
              hinglish: 'Ya type karke puchein →',
            })}
          </button>
        </div>
      </div>
    </div>
  );
}
