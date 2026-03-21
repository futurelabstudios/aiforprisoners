import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useApp, t } from "../context/AppContext";
import { Language, UserRole } from "../context/AppContext";
import {
  Scale,
  House,
  Phone,
  Mic,
  HardHat,
  FileText,
  Siren,
  Lock,
  BookOpen,
  Search,
  FileBadge2,
  ChevronDown,
  ChevronUp,
  ListChecks,
} from "lucide-react";

/* ── Urgency quick-actions (on-the-spot crisis help) ── */
const SOS_ACTIONS = [
  {
    Icon: Siren,
    bg: "linear-gradient(145deg, #5C1208, #7D1F12)",
    shadow: "rgba(92,18,8,0.35)",
    path: "/chat",
    question: {
      hindi:
        "मुझे अभी गिरफ्तार किया जा रहा है। मुझे क्या करना चाहिए और मेरे क्या अधिकार हैं?",
      english:
        "I am being arrested right now. What are my rights and what should I do?",
      hinglish:
        "Mujhe abhi arrest kiya ja raha hai. Mujhe kya karna chahiye aur mere kya rights hain?",
    },
    titles: {
      hindi: "अभी गिरफ्तार हो रहा हूँ",
      english: "Being Arrested Now",
      hinglish: "Abhi Arrest Ho Raha Hoon",
    },
    subs: {
      hindi: "तुरंत अपने अधिकार जानें",
      english: "Know your rights instantly",
      hinglish: "Turant rights jaanein",
    },
  },
  {
    Icon: Lock,
    bg: "linear-gradient(145deg, #6B2A0A, #8C3C12)",
    shadow: "rgba(107,42,10,0.35)",
    path: "/chat",
    question: {
      hindi: "मुझे जमानत कैसे मिलेगी? अभी क्या करना होगा?",
      english: "How can I get bail? What needs to be done right now?",
      hinglish: "Mujhe bail kaise milegi? Abhi kya karna hoga?",
    },
    titles: {
      hindi: "जमानत चाहिए आज",
      english: "Need Bail Today",
      hinglish: "Bail Chahiye Aaj",
    },
    subs: {
      hindi: "जमानत की पूरी जानकारी",
      english: "Full bail guidance",
      hinglish: "Bail ki poori jaankari",
    },
  },
];

/* ── Core service tiles ── */
const SERVICES = [
  {
    Icon: Scale,
    iconBg: "var(--c-primary-l)",
    iconColor: "var(--c-primary)",
    path: "/chat",
    question: null,
    titles: {
      hindi: "कानूनी मदद",
      english: "Legal Help",
      hinglish: "Kanoon Ki Madad",
    },
    subs: {
      hindi: "FIR, जमानत, धारा, अदालत",
      english: "FIR, Bail, Sections, Court",
      hinglish: "FIR, Bail, Sections, Court",
    },
  },
  {
    Icon: House,
    iconBg: "#F0FDF4",
    iconColor: "#16A34A",
    path: "/post-release",
    question: null,
    titles: {
      hindi: "जेल के बाद",
      english: "After Release",
      hinglish: "Jail Ke Baad",
    },
    subs: {
      hindi: "नौकरी, आश्रय, दस्तावेज़",
      english: "Jobs, shelter, documents",
      hinglish: "Naukri, shelter, docs",
    },
  },
  {
    Icon: Phone,
    iconBg: "#FEF2F2",
    iconColor: "#DC2626",
    path: "/helpline",
    question: null,
    titles: { hindi: "हेल्पलाइन", english: "Helplines", hinglish: "Helpline" },
    subs: {
      hindi: "आपातकालीन नंबर",
      english: "Emergency numbers",
      hinglish: "Emergency numbers",
    },
  },
  {
    Icon: FileText,
    iconBg: "#EFF6FF",
    iconColor: "#2563EB",
    path: "/chat",
    question: {
      hindi: "FIR की कॉपी कैसे मिलेगी? FIR में जो धाराएं हैं वो क्या मतलब है?",
      english: "How to get a copy of FIR? What do the sections in FIR mean?",
      hinglish:
        "FIR ki copy kaise milegi? FIR mein jo sections hain unka kya matlab hai?",
    },
    titles: {
      hindi: "FIR समझें",
      english: "Understand FIR",
      hinglish: "FIR Samjho",
    },
    subs: {
      hindi: "कॉपी, धाराएं, चुनौती",
      english: "Copy, sections, challenge",
      hinglish: "Copy, sections, challenge",
    },
  },
];

/* ── Rights of the day tips ── */
const RIGHTS_TIPS = [
  {
    hindi: "FIR की एक प्रति पाना आपका अधिकार है — यह मुफ्त में मिलती है।",
    english:
      "You have the right to receive a copy of the FIR — it is free of cost.",
    hinglish: "FIR ki copy paana aapka haq hai — yeh bilkul free milti hai.",
  },
  {
    hindi:
      "यदि पुलिस ने 60 दिन में चार्जशीट नहीं दाखिल की, तो आप डिफ़ॉल्ट जमानत के हकदार हैं।",
    english:
      "If police don't file chargesheet within 60 days, you are entitled to Default Bail.",
    hinglish:
      "Agar police ne 60 din mein chargesheet file nahi ki, to aapko Default Bail milne ka haq hai.",
  },
  {
    hindi:
      "गरीबी के कारण आप मुफ्त सरकारी वकील पाने के हकदार हैं — NALSA: 1516",
    english:
      "You are entitled to a free government lawyer if you cannot afford one — NALSA: 1516",
    hinglish:
      "Agar aap vakeel afford nahi kar sakte to free sarkari vakeel milega — NALSA: 1516",
  },
  {
    hindi:
      "पुलिस को दिया गया कबूलनामा अदालत में मान्य नहीं होता (धारा 25 साक्ष्य अधिनियम)",
    english:
      "A confession to police is NOT admissible in court (Section 25 Evidence Act)",
    hinglish:
      "Police ko diya gaya confession court mein valid nahi hota (Section 25 Evidence Act)",
  },
];

const quickQs = [
  {
    hindi: "जमानत मिलेगी?",
    english: "Can I get bail?",
    hinglish: "Bail milegi kya?",
  },
  {
    hindi: "FIR में क्या है?",
    english: "What is in my FIR?",
    hinglish: "FIR mein kya hai?",
  },
  {
    hindi: "धाराएं कितनी गंभीर?",
    english: "How serious are sections?",
    hinglish: "Sections kitne serious?",
  },
];

const LEARN_PATHWAYS = [
  {
    Icon: BookOpen,
    color: "#7C3AED",
    bg: "#F5F3FF",
    q: {
      hindi: "भारत में जमानत के नियम क्या हैं? सरल भाषा में समझाएं।",
      english: "What are the bail rules in India? Explain in simple language.",
      hinglish: "India mein bail ke rules kya hain? Simple bhasha mein samjhaiye.",
    },
    label: {
      hindi: "जमानत के नियम",
      english: "Bail Rules Explained",
      hinglish: "Bail ke Rules",
    },
  },
  {
    Icon: Search,
    color: "#059669",
    bg: "#ECFDF5",
    q: {
      hindi: "एक कमजोर आपराधिक मामले के मुख्य संकेत क्या होते हैं?",
      english: "What are signs of a weak criminal case against someone?",
      hinglish: "Ek weak criminal case ke kya signs hote hain?",
    },
    label: {
      hindi: "कमजोर केस की पहचान",
      english: "Spot a Weak Case",
      hinglish: "Weak Case Ki Pehchaan",
    },
  },
  {
    Icon: FileBadge2,
    color: "#D97706",
    bg: "#FFFBEB",
    q: {
      hindi: "जेल से रिहाई के बाद Aadhaar, PAN, bank account कैसे बनाएं?",
      english:
        "After release from jail, how to get Aadhaar, PAN, and bank account?",
      hinglish: "Jail se release ke baad Aadhaar, PAN, bank account kaise banayein?",
    },
    label: {
      hindi: "रिहाई के बाद दस्तावेज़",
      english: "Documents After Release",
      hinglish: "Release ke Baad Documents",
    },
  },
];

const today = new Date();
const tipIndex = today.getDate() % RIGHTS_TIPS.length;

export default function Home() {
  const { language, role, setRole } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [showAllServices, setShowAllServices] = useState(false);
  const [showAllLearn, setShowAllLearn] = useState(false);

  const currentExperience = role === "family" ? "citizen" : "institutional";
  const effectiveRole: UserRole =
    currentExperience === "institutional" ? "official" : "family";

  const moduleAllowedByRole: Record<UserRole, string[]> = {
    official: ["legal-help", "helpline", "fir"],
    judiciary: ["legal-help", "fir"],
    family: ["legal-help", "helpline", "fir", "post-release"],
    legalSupport: ["legal-help", "helpline", "fir", "post-release"],
  };

  const servicesWithModule = SERVICES.map((svc) => ({
    ...svc,
    module:
      svc.path === "/post-release"
        ? "post-release"
        : svc.path === "/helpline"
          ? "helpline"
          : svc.titles.english === "Understand FIR"
            ? "fir"
            : "legal-help",
  }));

  const roleServices = servicesWithModule.filter((svc) =>
    moduleAllowedByRole[effectiveRole].includes(svc.module),
  );
  const visibleServices = showAllServices ? roleServices : roleServices.slice(0, 2);

  const visibleLearnPathways = showAllLearn
    ? LEARN_PATHWAYS
    : LEARN_PATHWAYS.slice(0, 2);

  const handleService = (
    path: string,
    question: Record<Language, string> | null,
  ) => {
    if (question) {
      navigate(path, { state: { question: question[language as Language] } });
    } else {
      navigate(path);
    }
  };

  return (
    <div
  
      style={{ background: "var(--c-bg)" }}
    >
      {/* ── Top Nav Bar ── */}
      <div className="theme-header px-4 py-3 [@media(max-height:800px)]:py-2 flex items-center justify-between lg:hidden">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #B8521E, #8C3C12)" }}
          >
            <Scale size={18} color="#fff" />
          </div>
          <div>
            <div className="text-white font-extrabold text-base leading-tight">
              न्याय सेतु
            </div>
            <div
              className="text-xs font-medium"
              style={{ color: "var(--c-primary)" }}
            >
              Nyay Setu
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all"
          style={{
            background: "rgba(255,255,255,0.10)",
            color: "rgba(255,255,255,0.85)",
          }}
        >
          🌐{" "}
          {language === "hindi"
            ? "हिंदी"
            : language === "english"
              ? "EN"
              : "HG"}
        </button>
      </div>

      {/* ── Hero greeting ── */}
      <div
        className="px-5 pt-5 pb-6 [@media(max-height:800px)]:pt-3 [@media(max-height:800px)]:pb-4 text-center lg:w-full lg:max-w-none lg:px-10 lg:pb-10 lg:pt-8 lg:text-left lg:rounded-none lg:border-b lg:border-white/10 xl:px-14 2xl:px-16"
        style={{ background: "var(--c-header)" }}
      >
        <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-1 [@media(max-height:800px)]:mb-0 lg:text-[0.7rem]">
          {t(language, {
            hindi: "आपका स्वागत है",
            english: "Welcome",
            hinglish: "Aapka Swagat Hai",
          })}
        </p>
        <h1 className="text-white text-2xl [@media(max-height:800px)]:text-xl font-extrabold leading-tight mb-1 lg:text-3xl lg:font-bold">
          {t(language, {
            hindi: "नमस्ते 🙏",
            english: "Hello! 🙏",
            hinglish: "Namaste 🙏",
          })}
        </h1>
        <p
          className="text-sm lg:text-base lg:max-w-xl"
          style={{ color: "rgba(255,255,255,0.50)" }}
        >
          {t(language, {
            hindi: "आज हम आपकी कैसे मदद करें?",
            english: "How can we help you today?",
            hinglish: "Aaj hum aapki kaise madad karein?",
          })}
        </p>
      </div>

      {/* Wave break — app-style divider; hidden on desktop where hero meets content flush */}
      <div className="lg:hidden" style={{ background: "var(--c-header)", lineHeight: 0 }}>
        <svg
          viewBox="0 0 390 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <path d="M0 0 Q195 18 390 0 L390 18 L0 18 Z" fill="var(--c-bg)" />
        </svg>
      </div>

      {/* ── Scrollable content: main + aside on xl+ (website layout) ── */}
      <div className="min-h-0 flex-1 overflow-y-auto content-shell pt-4 pb-28 lg:pb-12 [@media(max-height:800px)]:pt-3 [@media(max-height:800px)]:pb-24 xl:pt-10">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-start xl:gap-10 2xl:gap-12">
          <div className="min-w-0 flex-1 space-y-6 [@media(max-height:800px)]:space-y-4 lg:space-y-0 lg:web-content-stack">
        <section className="section-block">
          <div className="section-header-row lg:items-center">
            <div>
              <span className="section-label">
                {t(language, {
                  hindi: "अनुभव चुनें",
                  english: "Select Experience",
                  hinglish: "Experience Select Karo",
                })}
              </span>
              <p className="section-helper">
                {t(language, {
                  hindi: "यूज़र रोल के आधार पर मॉड्यूल दिखाए जाएंगे",
                  english: "Modules adapt based on selected user role",
                  hinglish: "Selected role ke hisaab se modules dikhenge",
                })}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 lg:inline-flex lg:max-w-md lg:grid-cols-none lg:gap-3">
            <button
              onClick={() => setRole("official")}
              className="rounded-xl px-3 py-2 text-xs font-bold border lg:flex-1 lg:rounded-lg lg:py-2.5 lg:text-sm"
              style={{
                borderColor:
                  currentExperience === "institutional"
                    ? "rgba(207,120,89,0.35)"
                    : "var(--c-border)",
                background:
                  currentExperience === "institutional"
                    ? "var(--c-primary-l)"
                    : "var(--c-surface)",
                color:
                  currentExperience === "institutional"
                    ? "var(--c-primary)"
                    : "var(--c-text)",
              }}
            >
              {t(language, {
                hindi: "Institutional",
                english: "Institutional",
                hinglish: "Institutional",
              })}
            </button>
            <button
              onClick={() => setRole("family")}
              className="rounded-xl px-3 py-2 text-xs font-bold border lg:flex-1 lg:rounded-lg lg:py-2.5 lg:text-sm"
              style={{
                borderColor:
                  currentExperience === "citizen"
                    ? "rgba(207,120,89,0.35)"
                    : "var(--c-border)",
                background:
                  currentExperience === "citizen"
                    ? "var(--c-primary-l)"
                    : "var(--c-surface)",
                color:
                  currentExperience === "citizen"
                    ? "var(--c-primary)"
                    : "var(--c-text)",
              }}
            >
              {t(language, {
                hindi: "Citizen",
                english: "Citizen",
                hinglish: "Citizen",
              })}
            </button>
          </div>
        </section>

        {/* ── SOS: Urgency section ── */}
        <section className="section-block">
          <div className="section-header-row lg:items-center">
            <div>
              <span className="section-label">Turant Madad</span>
              <p className="section-helper">
                {t(language, {
                  hindi: "अभी जरूरत हो तो पहले यह चुनें।",
                  english: "Need help now? Start here first.",
                  hinglish: "Abhi help chahiye? Yahin se shuru karein.",
                })}
              </p>
            </div>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full text-white lg:text-sm lg:px-3"
              style={{ background: "var(--c-danger)" }}
            >
              Urgent
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:gap-6 xl:gap-8">
            {SOS_ACTIONS.map((action, i) => (
              <button
                key={i}
                onClick={() =>
                  navigate(action.path, {
                    state: { question: action.question[language as Language] },
                  })
                }
                className="sos-tile flex-col items-center text-center sm:items-start sm:text-left"
                style={{
                  background: action.bg,
                  boxShadow: `0 6px 20px ${action.shadow}`,
                }}
              >
                <div className="mb-2">
                  <action.Icon size={26} color="#fff" />
                </div>
                <div className="font-extrabold text-sm leading-tight lg:text-base">
                  {action.titles[language as Language]}
                </div>
                <div className="text-white/70 text-xs mt-0.5 leading-tight lg:text-sm">
                  {action.subs[language as Language]}
                </div>
              </button>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2 xl:gap-5">
        {/* ── Helpline strip ── */}
        <a
          href="tel:18003134963"
          className="emergency-banner rounded-2xl xl:min-h-[4.5rem] xl:justify-between xl:text-left"
          style={{ borderRadius: "16px", border: "1px solid #FDE68A" }}
        >
          <Phone size={14} />
          <span className="font-extrabold xl:text-sm">Kunji: 1800-313-4963</span>
          <span className="xl:text-sm" style={{ color: "#92400E", fontWeight: 500 }}>
            Free • 8am–11pm
          </span>
          <span className="ml-auto text-amber-600 font-bold xl:text-sm">Call →</span>
        </a>

        {/* ── Legal Journey CTA ── */}
        <button
          onClick={() => navigate("/legal-journey")}
          className="w-full rounded-2xl p-4 text-left flex items-center gap-3 active:scale-[0.98] transition-all border xl:p-5"
          style={{
            background: "var(--c-surface)",
            borderColor: "var(--c-border)",
          }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 xl:h-14 xl:w-14"
            style={{ background: "var(--c-primary-l)", color: "var(--c-primary)" }}
          >
            <ListChecks size={19} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-extrabold text-sm xl:text-base" style={{ color: "var(--c-heading)" }}>
              {t(language, {
                hindi: "कानूनी यात्रा ट्रैक करें",
                english: "Track Legal Journey",
                hinglish: "Legal Journey Track Karo",
              })}
            </p>
            <p className="text-xs mt-0.5 xl:text-sm" style={{ color: "var(--c-muted)" }}>
              {t(language, {
                hindi: "FIR से Judgment तक step-by-step मार्गदर्शन",
                english: "Step-by-step guidance from FIR to Judgment",
                hinglish: "FIR se Judgment tak step-by-step guidance",
              })}
            </p>
          </div>
          <span className="shrink-0 xl:text-lg" style={{ color: "var(--c-primary)", fontWeight: 700 }}>→</span>
        </button>
        </div>

        {/* ── Services grid ── */}
        <section className="section-block">
          <div className="section-header-row lg:items-center">
            <div>
              <p className="section-label">
                {t(language, {
                  hindi: "कानूनी मदद",
                  english: "Legal Support",
                  hinglish: "Legal Support",
                })}
              </p>
              <p className="section-helper">
                {t(language, {
                  hindi: "FIR, जमानत और कोर्ट से जुड़ी मदद",
                  english: "Help with FIR, bail, and court process.",
                  hinglish: "FIR, bail aur court process ki madad.",
                })}
              </p>
            </div>
            {roleServices.length > 2 && (
              <button
                onClick={() => setShowAllServices((v) => !v)}
                className="see-more-btn inline-flex items-center gap-1"
                aria-label={showAllServices ? "Show less" : "See more"}
              >
                {showAllServices ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
            {visibleServices.map((svc, i) => (
              <button
                key={i}
                onClick={() => handleService(svc.path, svc.question)}
                className="feature-tile group"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 lg:h-14 lg:w-14 lg:rounded-[0.65rem]"
                  style={{ background: svc.iconBg, color: svc.iconColor }}
                >
                  <svc.Icon className="h-5 w-5 lg:h-6 lg:w-6" />
                </div>
                <div>
                  <div
                    className="font-extrabold text-sm leading-tight transition-colors group-hover:text-[#B8521E] lg:text-base"
                    style={{ color: "var(--c-heading)" }}
                  >
                    {svc.titles[language as Language]}
                  </div>
                  <div
                    className="text-xs mt-0.5 leading-tight lg:text-sm"
                    style={{ color: "var(--c-muted)" }}
                  >
                    {svc.subs[language as Language]}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ── Chat + Voice CTA ── */}
        <button
          onClick={() => navigate("/chat")}
          className="w-full rounded-2xl p-4 text-left flex items-center gap-4 active:scale-[0.98] transition-all xl:p-6 xl:gap-5"
          style={{
            background: "linear-gradient(145deg, #0D0603, #180A04)",
            boxShadow: "0 6px 28px rgba(13,6,3,0.28)",
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #B8521E, #D4703A)" }}
          >
            <Mic size={22} color="#fff" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-white font-extrabold text-base">
                {t(language, {
                  hindi: "चैट + आवाज़ एक साथ",
                  english: "Chat + Voice Together",
                  hinglish: "Chat + Voice Saath Mein",
                })}
              </span>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(184,82,30,0.22)", color: "#F0A878" }}
              >
                LIVE
              </span>
            </div>
            <div
              className="text-sm"
              style={{ color: "rgba(255,255,255,0.50)" }}
            >
              {t(language, {
                hindi: "एक ही स्क्रीन पर लिखकर या बोलकर पूछें",
                english: "Ask by typing or speaking in one screen",
                hinglish: "Ek hi screen par type ya voice se pucho",
              })}
            </div>
          </div>
          <div
            style={{
              color: "var(--c-primary)",
              fontSize: "1.25rem",
              fontWeight: 700,
            }}
          >
            →
          </div>
        </button>

          </div>

          <aside className="w-full min-w-0 shrink-0 space-y-6 xl:sticky xl:top-24 xl:w-80 xl:self-start xl:space-y-6 xl:border-l xl:border-[var(--c-border)] xl:pl-8 2xl:top-28 2xl:w-96 2xl:pl-10">
        {/* ── Aaj Ka Adhikar (Right of the Day) ── */}
        <div className="rights-tip xl:p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="chip">Aaj Ka Adhikar</span>
          </div>
          <p
            className="text-sm leading-relaxed font-medium"
            style={{ color: "var(--c-heading)" }}
          >
            {RIGHTS_TIPS[tipIndex][language as Language]}
          </p>
          <button
            onClick={() =>
              navigate("/chat", {
                state: {
                  question: RIGHTS_TIPS[tipIndex][language as Language],
                },
              })
            }
            className="mt-3 text-xs font-bold"
            style={{ color: "var(--c-primary)" }}
          >
            {t(language, {
              hindi: "और जानें →",
              english: "Learn more →",
              hinglish: "Aur jaanein →",
            })}
          </button>
        </div>

        {/* ── Quick questions ── */}
        <section className="card section-block">
          <div>
            <p className="section-label mb-1">
              {t(language, {
                hindi: "जल्दी सवाल",
                english: "Quick Questions",
                hinglish: "Quick Questions",
              })}
            </p>
            <p className="section-helper">
              {t(language, {
                hindi: "एक बटन दबाकर तुरंत जवाब पाएं",
                english: "Tap one question to get quick guidance.",
                hinglish: "Ek question tap karo aur turant jawab pao.",
              })}
            </p>
          </div>
          <div className="space-y-2">
            {quickQs.map((q, i) => (
              <button
                key={i}
                onClick={() =>
                  navigate("/chat", {
                    state: { question: q[language as Language] },
                  })
                }
                className="quick-btn w-full"
              >
                {q[language as Language]}
              </button>
            ))}
          </div>
          <button
            onClick={() => navigate("/chat")}
            className="btn-primary mt-3 w-full py-3 text-sm"
          >
            {t(language, {
              hindi: "AI से पूछें →",
              english: "Ask AI →",
              hinglish: "AI Se Puchein →",
            })}
          </button>
        </section>

        {/* ── Capability building: Learn section ── */}
        <section className="section-block">
          <div className="section-header-row xl:items-start">
            <div>
              <p className="section-label">
                {t(language, {
                  hindi: "रिहाई के बाद",
                  english: "After Release Help",
                  hinglish: "After Release Help",
                })}
              </p>
              <p className="section-helper">
                {t(language, {
                  hindi: "दस्तावेज़, नौकरी और आगे की तैयारी",
                  english: "Documents, jobs, and next-step support.",
                  hinglish: "Documents, job aur next-step support.",
                })}
              </p>
            </div>
            {LEARN_PATHWAYS.length > 2 && (
              <button
                onClick={() => setShowAllLearn((v) => !v)}
                className="see-more-btn inline-flex items-center gap-1"
                aria-label={showAllLearn ? "Show less" : "See more"}
              >
                {showAllLearn ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-2 xl:gap-3">
            {visibleLearnPathways.map((item, i) => (
              <button
                key={i}
                onClick={() =>
                  navigate("/chat", {
                    state: { question: item.q[language as Language] },
                  })
                }
                className="card-sm flex items-center gap-3 w-full text-left active:scale-[0.98] transition-all group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: item.bg, color: item.color }}
                >
                  <item.Icon size={18} />
                </div>
                <span
                  className="font-semibold text-sm flex-1 group-hover:text-[#B8521E] transition-colors"
                  style={{ color: "var(--c-heading)" }}
                >
                  {item.label[language as Language]}
                </span>
                <span className="text-sm" style={{ color: "var(--c-muted)" }}>
                  →
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Disclaimer ── */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: "var(--c-warning-l)",
            border: "1px solid #FDE68A",
          }}
        >
          <p className="text-xs leading-relaxed" style={{ color: "#92400E" }}>
            {t(language, {
              hindi:
                "यह सामान्य जानकारी है। अपने मामले के लिए कृपया वकील से सलाह लें।",
              english:
                "General information only. Please consult a lawyer for your specific case.",
              hinglish:
                "Yeh general jaankari hai. Apne case ke liye vakeel se zaroor milein.",
            })}
          </p>
        </div>
          </aside>
        </div>
      </div>

      {/* ── Bottom nav ── */}
      <div className="bottom-nav">
        {[
          {
            Icon: Scale,
            label: { hindi: "मदद", english: "Chat", hinglish: "Chat" },
            path: "/chat",
          },
          {
            Icon: HardHat,
            label: {
              hindi: "बाद में",
              english: "After",
              hinglish: "Baad Mein",
            },
            path: "/post-release",
          },
          {
            Icon: House,
            label: { hindi: "होम", english: "Home", hinglish: "Home" },
            path: "/home",
          },
          {
            Icon: Mic,
            label: { hindi: "वॉइस", english: "Voice", hinglish: "Voice" },
            path: "/voice-guide",
          },
          {
            Icon: Phone,
            label: {
              hindi: "हेल्पलाइन",
              english: "Helpline",
              hinglish: "Helpline",
            },
            path: "/helpline",
          },
        ].map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            aria-label={item.label[language as Language]}
            className={`bottom-nav-item ${item.path === "/home" ? "bottom-nav-home" : ""}
                       ${item.path === currentPath ? "nav-item-active" : "nav-item-inactive"}`}
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
