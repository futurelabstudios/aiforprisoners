import { useNavigate } from "react-router-dom";
import { useApp, Language } from "../context/AppContext";
import { Scale, MessageCircle, Languages, ArrowRight, Phone } from "lucide-react";

const languages = [
  {
    id: "hindi" as Language,
    label: "हिंदी",
    sub: "सिर्फ हिंदी में",
    Icon: Languages,
    desc: "Sirf Hindi",
  },
  {
    id: "hinglish" as Language,
    label: "Hinglish",
    sub: "Hindi + English mix",
    Icon: MessageCircle,
    desc: "Hindi aur English",
  },
  {
    id: "english" as Language,
    label: "English",
    sub: "Simple English only",
    Icon: Languages,
    desc: "Only English",
  },
];

export default function LanguageSelect() {
  const { setLanguage } = useApp();
  const navigate = useNavigate();

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    navigate("/home");
  };

  return (
    <div
      className="flex min-h-0 w-full min-w-0 max-w-[100vw] flex-1 flex-col overflow-x-hidden"
      style={{ background: "var(--c-bg)" }}
    >
      <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col lg:flex-row lg:items-stretch">
        {/* ── Hero ── */}
        <div
          className="flex w-full min-w-0 flex-col items-center justify-center px-3 pt-[max(3rem,env(safe-area-inset-top,0px))] pb-8 text-center sm:px-5 sm:pt-16 sm:pb-10 [@media(max-height:640px)]:py-6 [@media(max-height:640px)]:sm:py-8 lg:flex-1 lg:px-6 lg:py-8 xl:px-10 xl:py-12 [@media(max-height:700px)]:lg:py-6"
          style={{
            background:
              "linear-gradient(160deg, #0D0603 0%, #180A04 50%, #251006 100%)",
          }}
        >
          <div className="mb-4 w-full max-w-md sm:mb-6">
            <div
              className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-3xl text-4xl sm:mb-4 sm:h-24 sm:w-24 sm:text-5xl"
              style={{
                background: "linear-gradient(135deg, #B8521E, #D4753A)",
                boxShadow:
                  "0 8px 32px rgba(184,82,30,0.45), 0 0 0 1px rgba(255,255,255,0.07)",
              }}
            >
              <Scale
                className="h-9 w-9 text-white sm:h-[42px] sm:w-[42px]"
                strokeWidth={2}
              />
            </div>
            <h1 className="break-words px-1 text-[clamp(1.75rem,6vw,2.25rem)] font-extrabold leading-tight tracking-tight text-white">
              न्याय सेतु
            </h1>
            <p className="mt-1 text-sm font-semibold tracking-wide text-[#C85828] sm:text-base">
              Nyay Setu
            </p>
          </div>

          <h2 className="mb-2 max-w-[min(100%,20rem)] px-1 text-[clamp(1.125rem,4vw,1.875rem)] font-bold leading-snug text-white sm:max-w-xs lg:max-w-sm">
            Bridge to Justice
          </h2>
          <p className="mb-5 max-w-[min(100%,22rem)] px-1 text-sm leading-relaxed text-white/60 sm:max-w-xs sm:text-[0.9375rem] lg:mb-6 lg:max-w-sm lg:text-base">
            Free legal help for prisoners &amp; families across India
          </p>

          <div
            className="mx-auto inline-flex max-w-[min(100%,22rem)] flex-wrap items-center justify-center gap-2 rounded-full px-3 py-1.5 text-center text-[0.6875rem] font-semibold leading-tight sm:max-w-none sm:px-4 sm:text-xs"
            style={{
              background: "rgba(184,82,30,0.14)",
              color: "#F5B07A",
              border: "1px solid rgba(184,82,30,0.22)",
            }}
          >
            <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-green-400" />
            <span>Available 24×7 • Bilkul Free</span>
          </div>
        </div>

        {/* Wave (narrow screens only) */}
        <div
          className="min-w-0 lg:hidden"
          style={{
            background:
              "linear-gradient(160deg, #251006 0%, #180A04 100%)",
            lineHeight: 0,
          }}
        >
          <svg
            viewBox="0 0 390 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-auto w-full max-w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0 0 Q195 24 390 0 L390 24 L0 24 Z"
              fill="var(--c-bg)"
            />
          </svg>
        </div>

        {/* ── Languages ── */}
        <div
          className="flex w-full min-w-0 flex-1 flex-col justify-center px-3 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] pt-6 sm:px-5 sm:pt-8 lg:border-l lg:border-[var(--c-border)] lg:px-6 lg:py-8 xl:px-10 xl:py-10 [@media(max-height:640px)]:py-4 [@media(max-height:640px)]:sm:py-5 [@media(max-height:700px)]:lg:py-6"
          style={{ background: "var(--c-bg)" }}
        >
          <div className="mb-5 w-full text-center lg:mb-8 lg:text-left">
            <p
              className="mb-1 text-[0.65rem] font-extrabold uppercase tracking-widest sm:text-xs lg:text-sm"
              style={{ color: "var(--c-label)" }}
            >
              Step 1 of 1
            </p>
            <h3
              className="text-[clamp(1.0625rem,3.5vw,1.5rem)] font-extrabold leading-tight lg:text-2xl"
              style={{ color: "var(--c-heading)" }}
            >
              अपनी भाषा चुनें
            </h3>
            <p
              className="mt-1 text-sm lg:mt-1.5 lg:text-base"
              style={{ color: "var(--c-muted)" }}
            >
              Choose your language to continue
            </p>
          </div>

          {/* 1 col phone → 2 col tablet / lg split → 3 col wide desktop */}
          <div
            className="mx-auto grid w-full max-w-md grid-cols-1 gap-3 min-w-0 sm:max-w-xl sm:grid-cols-2 sm:gap-4 lg:mx-0 lg:max-w-none lg:grid-cols-2 xl:grid-cols-3 xl:gap-5"
          >
            {languages.map((lang) => (
              <button
                key={lang.id}
                type="button"
                onClick={() => handleSelect(lang.id)}
                className="lang-card group min-h-[4.5rem] min-w-0"
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-2xl transition-all sm:h-12 sm:w-12"
                  style={{
                    background: "var(--c-primary-l)",
                    boxShadow: "0 2px 8px rgba(200,88,40,0.12)",
                  }}
                >
                  <lang.Icon
                    className="h-5 w-5 sm:h-[22px] sm:w-[22px]"
                    style={{ color: "var(--c-primary)" }}
                    strokeWidth={2}
                  />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <div
                    className="text-lg font-extrabold leading-tight transition-colors group-hover:text-[#C85828] sm:text-xl"
                    style={{ color: "var(--c-heading)" }}
                  >
                    {lang.label}
                  </div>
                  <div
                    className="mt-0.5 line-clamp-2 text-xs leading-snug sm:text-sm"
                    style={{ color: "var(--c-muted)" }}
                  >
                    {lang.sub}
                  </div>
                </div>
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white transition-opacity lg:opacity-70 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100"
                  style={{ background: "var(--c-primary)" }}
                  aria-hidden
                >
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                </div>
              </button>
            ))}
          </div>

          <p
            className="mx-auto mt-6 max-w-xs px-1 text-center text-[0.6875rem] leading-relaxed sm:max-w-md sm:text-xs lg:mx-0 lg:max-w-lg lg:text-left lg:text-[0.8125rem]"
            style={{ color: "var(--c-label)" }}
          >
            यह जानकारी शैक्षिक उद्देश्य के लिए है।
            <br />
            For educational purposes. Always consult a lawyer.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div
        className="w-full shrink-0 px-3 py-4 pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] text-center sm:px-5 sm:py-5 lg:mx-auto lg:max-w-6xl lg:py-6"
        style={{
          background: "var(--c-surface)",
          borderTop: "1px solid var(--c-border)",
        }}
      >
        <p
          className="mb-1 text-[0.6875rem] font-semibold sm:text-xs"
          style={{ color: "var(--c-muted)" }}
        >
          <span className="inline-flex flex-wrap items-center justify-center gap-1">
            <Phone className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" strokeWidth={2} />
            <span className="max-w-[min(100%,24rem)] leading-snug">
              Kunji Helpline — Free — Daily 8am to 11pm
            </span>
          </span>
        </p>
        <a
          href="tel:18003134963"
          className="block text-[clamp(1.25rem,5vw,1.5rem)] font-extrabold tracking-tight sm:text-2xl"
          style={{ color: "var(--c-primary)" }}
        >
          1800-313-4963
        </a>
        <p className="mt-1 text-[0.65rem] sm:text-xs" style={{ color: "var(--c-label)" }}>
          Project Second Chance • TYCIA Foundation
        </p>
      </div>
    </div>
  );
}
