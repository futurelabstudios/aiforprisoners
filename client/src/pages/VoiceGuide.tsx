import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

const DESKTOP_GRID =
  "min-h-0 lg:mx-auto lg:grid lg:w-full lg:max-w-[min(105rem,100%)] lg:grid-cols-[minmax(0,1fr)_minmax(19rem,26rem)] lg:gap-6 lg:px-12 lg:pb-8 2xl:max-w-[min(112rem,100%)] 2xl:px-14";

const ASIDE_CLASS =
  "sticky top-24 mt-4 hidden max-h-[min(720px,calc(100dvh-6rem))] min-h-0 w-full flex-col gap-4 self-start overflow-y-auto rounded-2xl border p-4 lg:mt-6 lg:flex";

export default function VoiceGuide() {
  const { language } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
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

  const voiceSidebarSteps = [
    t(language, {
      hindi: "माइक की अनुमति दें और शांत जगह पर बोलें।",
      english: "Allow the microphone and use a quiet place when you speak.",
      hinglish: "Mic allow karo aur shant jagah par bolo.",
    }),
    t(language, {
      hindi: "एक साफ़ सवाल पूछें — FIR, बेल, या अपनी स्थिति।",
      english: "Ask one clear question — FIR, bail, or your situation.",
      hinglish: "Ek clear sawaal pucho — FIR, bail ya apni situation.",
    }),
    t(language, {
      hindi: "वॉइस काम न करे तो टाइप चैट या हेल्पलाइन इस्तेमाल करें।",
      english: "If voice fails, use text chat or the helpline numbers.",
      hinglish: "Voice fail ho to text chat ya helpline use karo.",
    }),
  ];

  const livePill = (
    <div
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold"
      style={{
        background: "rgba(22,163,74,0.15)",
        color: "#4ADE80",
        border: "1px solid rgba(22,163,74,0.25)",
      }}
    >
      <span className="dot-live" />
      LIVE
    </div>
  );

  const widgetBlock = (
    <>
      {ready ? (
        <div
          className="flex w-full items-center justify-center overflow-hidden rounded-3xl p-3 lg:min-h-[400px] lg:rounded-[1.25rem] lg:p-6"
          style={{
            minHeight: "340px",
            background: "var(--c-surface)",
            border: "1px solid var(--c-border)",
          }}
        >
          <elevenlabs-convai agent-id={AGENT_ID} />
        </div>
      ) : (
        <div
          className="flex w-full flex-col items-center justify-center gap-3 rounded-3xl lg:min-h-[400px] lg:rounded-[1.25rem] lg:p-6"
          style={{
            minHeight: "340px",
            background: "var(--c-surface)",
            border: "1px solid var(--c-border)",
          }}
        >
          <div className="flex gap-2">
            <div className="typing-dot" />
            <div className="typing-dot" />
            <div className="typing-dot" />
          </div>
          <p className="text-sm" style={{ color: "var(--c-muted)" }}>
            Voice AI loading...
          </p>
        </div>
      )}
      <button
        type="button"
        onClick={() => navigate("/chat")}
        className="mt-4 w-full rounded-2xl py-3 text-sm font-bold transition-all active:scale-95 lg:mt-6 lg:max-w-md lg:py-3.5 lg:text-base"
        style={{
          background: "var(--c-primary-l)",
          color: "var(--c-primary)",
          border: "1px solid rgba(200,88,40,0.25)",
        }}
      >
        {t(language, {
          hindi: "टाइप करके पूछें",
          english: "Switch to Text Chat",
          hinglish: "Text chat pe jao",
        })}
      </button>
    </>
  );

  return (
    <div
      className="voice-guide-page h-dvh min-h-0 overflow-y-auto lg:min-h-0 lg:flex-1"
      style={{ background: "var(--c-bg)" }}
    >
      <div className="theme-header px-4 pb-4 pt-10 lg:hidden">
        <div className="mb-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="text-2xl"
            style={{ color: "rgba(255,255,255,0.78)" }}
            aria-label={t(language, { hindi: "वापस", english: "Back", hinglish: "Back" })}
          >
            <ArrowLeft size={20} strokeWidth={2} />
          </button>
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
            style={{ background: "var(--c-primary)" }}
          >
            <Mic className="h-6 w-6 text-white" strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-extrabold text-white leading-tight">
              {t(language, {
                hindi: "आवाज़ में बात करें",
                english: "Talk to AI Voice",
                hinglish: "Awaaz Mein Baat Karein",
              })}
            </h1>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.58)" }}>
              {t(language, {
                hindi: "FutureLabs रियल-टाइम Voice AI",
                english: "FutureLabs Real-Time Voice AI",
                hinglish: "FutureLabs Real-Time Voice AI",
              })}
            </p>
          </div>
          {livePill}
        </div>
      </div>

      <a href="tel:18003134963" className="emergency-banner lg:hidden">
        <Phone size={14} className="mr-1 inline" />{" "}
        {t(language, {
          hindi: "कुंजी (मुफ्त): 1800-313-4963 | NALSA 1516",
          english: "Kunji (free): 1800-313-4963 | NALSA 1516",
          hinglish: "Kunji: 1800-313-4963 | NALSA 1516",
        })}
      </a>

      <div className={DESKTOP_GRID}>
        <div className="min-w-0">
          <div className="content-shell pt-4 lg:!max-w-none lg:mx-0 lg:px-0 lg:pt-6">
            <div className="glass-panel section-block p-3 lg:p-5">
              <div className="section-header-row items-start">
                <div className="min-w-0">
                  <p className="mb-1 text-xs font-bold uppercase tracking-wide lg:text-sm" style={{ color: "var(--c-label)" }}>
                    {t(language, { hindi: "वॉइस असिस्टेंट", english: "Voice Assistant", hinglish: "Voice Assistant" })}
                  </p>
                  <p className="section-helper lg:text-base">
                    {t(language, {
                      hindi: "सीधे बोलें, तुरंत जवाब पाएं। माइक की अनुमति ज़रूरी है।",
                      english: "Speak directly for instant answers. Microphone access is required.",
                      hinglish: "Seedha bolo, turant jawab. Mic permission zaroori hai.",
                    })}
                  </p>
                </div>
                <div className="hidden lg:block">{livePill}</div>
              </div>
            </div>
          </div>

          <div className="content-shell flex min-h-0 flex-col items-stretch pb-28 pt-4 lg:!max-w-none lg:mx-0 lg:items-center lg:px-0 lg:pb-8 lg:pt-6">
            <div className="w-full max-w-xl lg:max-w-3xl">
              <div className="mb-4 text-center lg:mb-6 lg:hidden">
                <h2 className="text-xl font-extrabold" style={{ color: "var(--c-heading)" }}>
                  {t(language, {
                    hindi: "सीधे बोलें, तुरंत जवाब पाएं",
                    english: "Speak directly, get instant answers",
                    hinglish: "Seedha bolo, turant jawab pao",
                  })}
                </h2>
              </div>
              {widgetBlock}
            </div>
          </div>
        </div>

        <aside
          className={ASIDE_CLASS}
          style={{
            background: "var(--c-surface)",
            borderColor: "var(--c-border)",
          }}
          aria-label={t(language, {
            hindi: "वॉइस टिप्स और मदद",
            english: "Voice tips and help",
            hinglish: "Voice tips aur help",
          })}
        >
          <div>
            <p className="section-label">
              {t(language, { hindi: "आपके कदम", english: "Your steps", hinglish: "Aapke steps" })}
            </p>
            <ol className="mt-2 list-none space-y-2.5 p-0">
              {voiceSidebarSteps.map((text, idx) => (
                <li
                  key={idx}
                  className="flex gap-3 rounded-xl border px-3 py-2.5 text-sm leading-snug lg:text-base lg:leading-relaxed"
                  style={{
                    background: "var(--c-surface-2)",
                    borderColor: "var(--c-border)",
                    color: "var(--c-text)",
                  }}
                >
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold lg:h-8 lg:w-8 lg:text-sm"
                    style={{
                      background: "var(--c-primary-l)",
                      color: "var(--c-primary)",
                    }}
                  >
                    {idx + 1}
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ol>
          </div>

          <a
            href="tel:18003134963"
            className="flex shrink-0 flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-center text-xs font-semibold leading-snug lg:gap-2 lg:px-4 lg:py-3.5 lg:text-sm"
            style={{
              background: "rgba(251,191,36,0.08)",
              color: "#FBBF24",
              borderColor: "rgba(251,191,36,0.22)",
            }}
          >
            <span className="inline-flex items-center justify-center gap-1.5">
              <Phone size={14} className="shrink-0 lg:h-4 lg:w-4" />
              <span>
                Kunji <strong>1800-313-4963</strong>
                <span className="mx-1 opacity-60">|</span>
                NALSA <strong>1516</strong>
              </span>
            </span>
            <span className="text-[0.65rem] font-semibold opacity-90 lg:text-xs">
              {t(language, {
                hindi: "कुंजी: रोज 8am–11pm • मुफ्त",
                english: "Kunji: Daily 8am–11pm • Free",
                hinglish: "Kunji: Daily 8am–11pm • Free",
              })}
            </span>
          </a>

          <div
            className="rounded-2xl border px-3 py-3 lg:px-4 lg:py-4"
            style={{
              background: "var(--c-primary-l)",
              borderColor: "rgba(184,82,30,0.18)",
            }}
          >
            <p className="section-label" style={{ color: "var(--c-primary)" }}>
              {t(language, { hindi: "टाइप चैट", english: "Text chat", hinglish: "Text chat" })}
            </p>
            <p className="mt-1 text-xs font-medium leading-relaxed lg:mt-2 lg:text-sm" style={{ color: "var(--c-primary)" }}>
              {t(language, {
                hindi: "लंबा सवाल या दस्तावेज़ टाइप करके भेजना आसान हो तो चैट खोलें।",
                english: "For longer questions or typed documents, open Legal Help chat.",
                hinglish: "Lamba sawaal ya typing aasan ho to chat kholo.",
              })}
            </p>
            <button
              type="button"
              onClick={() => navigate("/chat")}
              className="see-more-btn mt-3 inline-flex w-full items-center justify-center gap-2 lg:mt-4 lg:py-2.5 lg:text-sm"
            >
              <Scale size={16} className="lg:h-[1.125rem] lg:w-[1.125rem]" />
              {t(language, { hindi: "लीगल हेल्प खोलें", english: "Open Legal Help", hinglish: "Legal Help kholo" })}
            </button>
          </div>
        </aside>
      </div>

      <div className="bottom-nav">
        {[
          { Icon: Scale, label: { hindi: "मदद", english: "Chat", hinglish: "Chat" }, path: "/chat" },
          { Icon: BookOpen, label: { hindi: "गाइड", english: "Guide", hinglish: "Guide" }, path: "/manual" },
          { Icon: House, label: { hindi: "होम", english: "Home", hinglish: "Home" }, path: "/home" },
          { Icon: Mic, label: { hindi: "वॉइस", english: "Voice", hinglish: "Voice" }, path: "/voice-guide" },
          { Icon: Phone, label: { hindi: "हेल्पलाइन", english: "Helpline", hinglish: "Helpline" }, path: "/helpline" },
        ].map((item) => (
          <button
            key={item.path}
            type="button"
            onClick={() => navigate(item.path)}
            aria-label={item.label[language as Language]}
            className={`bottom-nav-item ${item.path === "/home" ? "bottom-nav-home" : ""} ${
              location.pathname === item.path ? "nav-item-active" : "nav-item-inactive"
            }`}
          >
            <span className="nav-icon">
              <item.Icon size={18} />
            </span>
            <span className="nav-label">{item.label[language as Language]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
