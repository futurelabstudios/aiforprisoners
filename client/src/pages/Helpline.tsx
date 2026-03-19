import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, t } from '../context/AppContext';
import {
  Scale,
  BookOpen,
  House,
  Mic,
  Phone,
  ArrowLeft,
  KeyRound,
  ShieldAlert,
  Ambulance,
  UserRound,
  Baby,
  Brain,
  Pill,
  HeartPulse,
  Landmark,
  IdCard,
  ArrowRight,
  Clock3,
  Save,
  ChevronDown,
  ChevronUp,
  Search,
  Sparkles,
  Info,
  AlertTriangle,
} from 'lucide-react';


interface HelplineItem {
  icon: string;
  name: string;
  number: string;
  desc: { hindi: string; english: string; hinglish: string };
  timing?: string;
  stage: { hindi: string; english: string; hinglish: string };
  category: { hindi: string; english: string; hinglish: string };
  purpose: { hindi: string; english: string; hinglish: string };
  bestTime: { hindi: string; english: string; hinglish: string };
  notFor: { hindi: string; english: string; hinglish: string };
  handles: string[];
  urgent?: boolean;
  important?: boolean;
}

const baseHelplines = [
  {
    icon: 'kunji',
    name: 'Kunji Helpline',
    number: '1800-313-4963',
    desc: {
      hindi: 'रिहा हुए बंदियों और परिवारों के लिए मुफ्त कानूनी मदद, TYCIA Foundation',
      english: 'Free legal help for released prisoners & families. Project Second Chance / TYCIA Foundation',
      hinglish: 'Released prisoners aur family ke liye free legal help. Project Second Chance.',
    },
    timing: 'Daily 8am–11pm | FREE',
    stage: { hindi: 'FIR, बेल, ट्रायल', english: 'FIR, bail, trial', hinglish: 'FIR, bail, trial' },
    important: true,
  },
  {
    icon: 'legal',
    name: 'NALSA Legal Aid',
    number: '1516',
    desc: {
      hindi: 'राष्ट्रीय विधिक सेवा प्राधिकरण — पूरी तरह मुफ्त वकील और अदालती सहायता',
      english: 'National Legal Services Authority — completely free lawyer and court representation',
      hinglish: 'Free vakeel aur court representation — bilkul muft, 24/7 available',
    },
    timing: '24/7 | FREE',
    stage: { hindi: 'मुफ्त वकील', english: 'Free legal aid', hinglish: 'Free legal aid' },
    important: true,
  },
  {
    icon: 'police',
    name: 'Police Emergency',
    number: '100',
    desc: {
      hindi: 'पुलिस आपातकाल — तुरंत मदद के लिए',
      english: 'Police emergency — for immediate help',
      hinglish: 'Police emergency — turant madad ke liye',
    },
    timing: '24/7',
    stage: { hindi: 'तुरंत खतरा', english: 'Immediate danger', hinglish: 'Immediate danger' },
  },
  {
    icon: 'ambulance',
    name: 'Ambulance',
    number: '108',
    desc: {
      hindi: 'मुफ्त एम्बुलेंस सेवा — चिकित्सा आपातकाल',
      english: 'Free ambulance — medical emergency',
      hinglish: 'Free ambulance — medical emergency ke liye',
    },
    timing: '24/7 | FREE',
    stage: { hindi: 'मेडिकल इमरजेंसी', english: 'Medical emergency', hinglish: 'Medical emergency' },
  },
  {
    icon: 'women',
    name: 'Women Helpline',
    number: '181',
    desc: {
      hindi: 'महिलाओं के लिए आपातकालीन सहायता और सुरक्षा',
      english: 'Emergency support and safety for women',
      hinglish: 'Women ke liye emergency support aur suraksha',
    },
    timing: '24/7 | FREE',
    stage: { hindi: 'महिला सुरक्षा', english: 'Women safety', hinglish: 'Women safety' },
  },
  {
    icon: 'child',
    name: 'Childline',
    number: '1098',
    desc: {
      hindi: 'बच्चों के लिए आपातकालीन सेवा — मदद और सुरक्षा',
      english: 'Emergency helpline for children — help and protection',
      hinglish: 'Bachon ke liye emergency helpline — help aur protection',
    },
    timing: '24/7 | FREE',
    stage: { hindi: 'बच्चों की सहायता', english: 'Child protection', hinglish: 'Child protection' },
  },
  {
    icon: 'mental',
    name: 'iCall — Mental Health',
    number: '9152987821',
    desc: {
      hindi: 'TISS द्वारा मुफ्त मनोवैज्ञानिक परामर्श, हिंदी और अंग्रेजी में',
      english: 'Free psychological counselling by TISS, in Hindi & English',
      hinglish: 'Free counselling by TISS — Hindi aur English mein, confidential',
    },
    timing: 'Mon–Sat 8am–10pm | FREE',
    stage: { hindi: 'मानसिक स्वास्थ्य', english: 'Mental health', hinglish: 'Mental health' },
  },
  {
    icon: 'support',
    name: 'Vandrevala Foundation',
    number: '1860-2662-345',
    desc: {
      hindi: '24/7 मानसिक स्वास्थ्य सहायता — कभी भी कॉल करें',
      english: '24/7 mental health support — call anytime',
      hinglish: '24/7 mental health support — kabhi bhi call karein',
    },
    timing: '24/7 | FREE',
    stage: { hindi: 'मेंटल हेल्प', english: 'Mental support', hinglish: 'Mental support' },
  },
  {
    icon: 'health',
    name: 'Health Helpline',
    number: '104',
    desc: {
      hindi: 'सरकारी स्वास्थ्य सहायता और अस्पताल जानकारी',
      english: 'Government health support and hospital information',
      hinglish: 'Government health support aur hospital information',
    },
    timing: '24/7 | FREE',
    stage: { hindi: 'स्वास्थ्य जानकारी', english: 'Health guidance', hinglish: 'Health guidance' },
  },
  {
    icon: 'rights',
    name: 'HRLN — Human Rights',
    number: '011-24374501',
    desc: {
      hindi: 'मानवाधिकार कानून नेटवर्क — कैदियों के अधिकारों के लिए मुफ्त सहायता',
      english: 'Human Rights Law Network — free support for prisoner rights',
      hinglish: 'Prisoner rights ke liye free legal support',
    },
    timing: 'Mon–Fri office hours',
    stage: { hindi: 'मानवाधिकार', english: 'Human rights', hinglish: 'Human rights' },
  },
  {
    icon: 'id',
    name: 'UIDAI — Aadhaar',
    number: '1947',
    desc: {
      hindi: 'आधार कार्ड बनवाना, अपडेट या समस्या के लिए',
      english: 'For Aadhaar card creation, update, or issues',
      hinglish: 'Aadhaar card banwana ya update ke liye',
    },
    timing: 'Mon–Sat 7am–11pm | FREE',
    stage: { hindi: 'दस्तावेज़', english: 'Identity docs', hinglish: 'Identity docs' },
  },
  {
    icon: 'deaddiction',
    name: 'De-addiction Helpline',
    number: '14446',
    desc: {
      hindi: 'नशे की समस्या से मुक्ति के लिए राष्ट्रीय हेल्पलाइन',
      english: 'National helpline for de-addiction support',
      hinglish: 'Nasha chhodne mein madad ke liye national helpline',
    },
    timing: '24/7 | FREE',
    stage: { hindi: 'नशामुक्ति', english: 'De-addiction', hinglish: 'De-addiction' },
  },
];

const metaByIcon: Record<string, Omit<HelplineItem, "icon" | "name" | "number" | "desc" | "timing" | "stage" | "important">> = {
  kunji: {
    category: { hindi: "कानूनी मदद", english: "Legal Help", hinglish: "Legal Help" },
    purpose: {
      hindi: "FIR, बेल, ट्रायल और जेल के बाद कानूनी मार्गदर्शन",
      english: "Guidance for FIR, bail, trial, and post-release legal support",
      hinglish: "FIR, bail, trial aur post-release legal guidance",
    },
    bestTime: { hindi: "सुबह 10 से दोपहर 1", english: "10 AM to 1 PM", hinglish: "10 AM to 1 PM" },
    notFor: { hindi: "तुरंत जानलेवा आपातकाल", english: "Immediate life-threatening emergency", hinglish: "Immediate jaanleva emergency" },
    handles: ["fir", "bail", "trial", "lawyer", "legal", "prison", "release"],
    urgent: false,
  },
  legal: {
    category: { hindi: "कानूनी सहायता", english: "Legal Aid", hinglish: "Legal Aid" },
    purpose: {
      hindi: "मुफ्त वकील और अदालत प्रतिनिधित्व",
      english: "Free lawyer and court representation",
      hinglish: "Free vakeel aur court representation",
    },
    bestTime: { hindi: "कभी भी (24/7)", english: "Anytime (24/7)", hinglish: "Kabhi bhi (24/7)" },
    notFor: { hindi: "मेडिकल इमरजेंसी", english: "Medical emergency", hinglish: "Medical emergency" },
    handles: ["free lawyer", "legal aid", "bail", "court", "case"],
    urgent: false,
  },
  police: {
    category: { hindi: "इमरजेंसी", english: "Emergency", hinglish: "Emergency" },
    purpose: { hindi: "तुरंत पुलिस सहायता", english: "Immediate police support", hinglish: "Turant police help" },
    bestTime: { hindi: "अभी", english: "Immediately", hinglish: "Abhi" },
    notFor: { hindi: "सामान्य कानूनी सलाह", english: "General legal advice", hinglish: "General legal advice" },
    handles: ["arrest", "danger", "violence", "threat", "police"],
    urgent: true,
  },
  ambulance: {
    category: { hindi: "इमरजेंसी", english: "Emergency", hinglish: "Emergency" },
    purpose: { hindi: "मेडिकल आपातकाल सहायता", english: "Medical emergency response", hinglish: "Medical emergency help" },
    bestTime: { hindi: "अभी", english: "Immediately", hinglish: "Abhi" },
    notFor: { hindi: "कानूनी सलाह", english: "Legal advice", hinglish: "Legal advice" },
    handles: ["ambulance", "injury", "medical", "hospital", "health emergency"],
    urgent: true,
  },
  women: {
    category: { hindi: "सुरक्षा", english: "Safety", hinglish: "Safety" },
    purpose: { hindi: "महिला सुरक्षा और सहायता", english: "Women safety and support", hinglish: "Women safety help" },
    bestTime: { hindi: "कभी भी", english: "Anytime", hinglish: "Kabhi bhi" },
    notFor: { hindi: "सामान्य दस्तावेज़ अपडेट", english: "General document updates", hinglish: "General document work" },
    handles: ["women", "harassment", "safety", "abuse"],
    urgent: true,
  },
  child: {
    category: { hindi: "सुरक्षा", english: "Safety", hinglish: "Safety" },
    purpose: { hindi: "बच्चों की सुरक्षा", english: "Child protection support", hinglish: "Child protection help" },
    bestTime: { hindi: "कभी भी", english: "Anytime", hinglish: "Kabhi bhi" },
    notFor: { hindi: "वयस्क कानूनी केस", english: "Adult legal case support", hinglish: "Adult legal case" },
    handles: ["child", "minor", "child abuse", "child protection"],
    urgent: true,
  },
  mental: {
    category: { hindi: "मानसिक स्वास्थ्य", english: "Mental Health", hinglish: "Mental Health" },
    purpose: { hindi: "भावनात्मक/मानसिक सलाह", english: "Mental and emotional counselling", hinglish: "Mental counselling" },
    bestTime: { hindi: "सुबह या शाम", english: "Morning or evening", hinglish: "Morning ya evening" },
    notFor: { hindi: "पुलिस FIR दर्ज करना", english: "Police FIR filing", hinglish: "Police FIR work" },
    handles: ["stress", "anxiety", "depression", "mental", "counselling"],
    urgent: false,
  },
  support: {
    category: { hindi: "मानसिक स्वास्थ्य", english: "Mental Health", hinglish: "Mental Health" },
    purpose: { hindi: "24/7 भावनात्मक सहायता", english: "24/7 emotional support", hinglish: "24/7 emotional support" },
    bestTime: { hindi: "कभी भी", english: "Anytime", hinglish: "Kabhi bhi" },
    notFor: { hindi: "कानूनी दस्तावेज़ सहायता", english: "Legal documentation support", hinglish: "Legal documentation" },
    handles: ["panic", "helpless", "suicidal", "mental support", "talk"],
    urgent: true,
  },
  health: {
    category: { hindi: "स्वास्थ्य", english: "Health", hinglish: "Health" },
    purpose: { hindi: "स्वास्थ्य जानकारी", english: "Health guidance and information", hinglish: "Health guidance" },
    bestTime: { hindi: "कभी भी", english: "Anytime", hinglish: "Kabhi bhi" },
    notFor: { hindi: "कोर्ट केस रणनीति", english: "Court strategy advice", hinglish: "Court strategy" },
    handles: ["health", "doctor", "hospital", "medicine"],
    urgent: false,
  },
  rights: {
    category: { hindi: "अधिकार", english: "Human Rights", hinglish: "Human Rights" },
    purpose: { hindi: "मानवाधिकार आधारित सहायता", english: "Rights-focused legal support", hinglish: "Rights-based legal support" },
    bestTime: { hindi: "वर्किंग घंटे", english: "Working hours", hinglish: "Working hours" },
    notFor: { hindi: "तुरंत खतरे की स्थिति", english: "Immediate physical danger", hinglish: "Immediate physical danger" },
    handles: ["human rights", "custodial", "rights violation", "abuse"],
    urgent: false,
  },
  id: {
    category: { hindi: "दस्तावेज़", english: "Documents", hinglish: "Documents" },
    purpose: { hindi: "आधार/ID अपडेट", english: "Aadhaar and ID support", hinglish: "Aadhaar/ID support" },
    bestTime: { hindi: "दिन में", english: "Daytime", hinglish: "Daytime" },
    notFor: { hindi: "आपातकाल", english: "Emergency situations", hinglish: "Emergency" },
    handles: ["aadhaar", "id", "document", "update"],
    urgent: false,
  },
  deaddiction: {
    category: { hindi: "स्वास्थ्य", english: "Health", hinglish: "Health" },
    purpose: { hindi: "नशामुक्ति सहायता", english: "De-addiction support", hinglish: "Nasha mukti support" },
    bestTime: { hindi: "कभी भी", english: "Anytime", hinglish: "Kabhi bhi" },
    notFor: { hindi: "कोर्ट सुनवाई जानकारी", english: "Court hearing updates", hinglish: "Court hearing updates" },
    handles: ["deaddiction", "substance", "addiction", "nasha"],
    urgent: false,
  },
};

const helplines: HelplineItem[] = baseHelplines.map((h) => ({
  ...h,
  ...metaByIcon[h.icon],
}));

const STAGE_GUIDE = [
  { key: "fir", label: { hindi: "FIR रजिस्ट्रेशन", english: "FIR Registration", hinglish: "FIR Registration" }, icons: ["legal", "kunji", "police"] },
  { key: "arrest", label: { hindi: "गिरफ्तारी चरण", english: "Arrest Stage", hinglish: "Arrest Stage" }, icons: ["police", "legal", "kunji"] },
  { key: "legal", label: { hindi: "कानूनी सहायता", english: "Legal Assistance", hinglish: "Legal Assistance" }, icons: ["legal", "kunji", "rights"] },
  { key: "court", label: { hindi: "कोर्ट प्रक्रिया", english: "Court Process", hinglish: "Court Process" }, icons: ["legal", "kunji"] },
  { key: "prison", label: { hindi: "प्रिजन क्वेरी", english: "Prison Queries", hinglish: "Prison Queries" }, icons: ["kunji", "rights", "health"] },
];

export default function Helpline() {
  const { language } = useApp();
  const navigate = useNavigate();
  const [showAllNumbers, setShowAllNumbers] = useState(false);
  const [needInput, setNeedInput] = useState("");
  const essentialHelplines = helplines.filter((h) => h.important);
  const otherHelplines = helplines.filter((h) => !h.important);
  const visibleOtherHelplines = showAllNumbers
    ? otherHelplines
    : otherHelplines.slice(0, 6);
  const getHelplineIcon = (icon: string) => {
    const map: Record<string, any> = {
      kunji: KeyRound,
      legal: Scale,
      police: ShieldAlert,
      ambulance: Ambulance,
      women: UserRound,
      child: Baby,
      mental: Brain,
      support: Pill,
      health: HeartPulse,
      rights: Landmark,
      id: IdCard,
      deaddiction: Pill,
    };
    return map[icon] ?? Phone;
  };

  const recommended = useMemo(() => {
    const q = needInput.trim().toLowerCase();
    if (!q) return [];
    const scored = helplines
      .map((h) => {
        let score = 0;
        if (h.name.toLowerCase().includes(q)) score += 4;
        if (h.category.english.toLowerCase().includes(q)) score += 2;
        for (const kw of h.handles) {
          if (q.includes(kw) || kw.includes(q)) score += 3;
        }
        if (h.stage.english.toLowerCase().includes(q)) score += 2;
        return { h, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((x) => x.h);
    return scored;
  }, [needInput]);

  return (
    <div className="h-dvh overflow-y-auto" style={{ background: 'var(--c-bg)' }}>
      {/* Header */}
      <div className="theme-header px-4 pt-10 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/home')}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm hover:bg-white/10 transition-all"
            style={{ color: "rgba(255,255,255,0.78)" }}
          >
            <ArrowLeft size={16} />
          </button>
          <div className="text-2xl" style={{ color: "#FAF7F4" }}>
            <Phone size={20} />
          </div>
          <div className="flex-1">
            <h1 className="font-extrabold text-base leading-tight text-white">
              {t(language, { hindi: 'हेल्पलाइन नंबर', english: 'Helpline Numbers', hinglish: 'Helpline Numbers' })}
            </h1>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.58)" }}>
              {t(language, { hindi: 'किसी को भी कॉल करें — सब मुफ्त', english: 'Call anyone — all free', hinglish: 'Kisi ko bhi call karein — sab free' })}
            </p>
          </div>
  
        </div>
      </div>

      <div className="content-shell py-4 space-y-4 pb-28">
        <div className="card-sm">
          <p className="section-label mb-2">
            {t(language, { hindi: 'पहले सही हेल्पलाइन चुनें', english: 'Choose the right helpline first', hinglish: 'Pehle sahi helpline choose karo' })}
          </p>
          <div className="space-y-1.5 text-xs" style={{ color: 'var(--c-muted)' }}>
            <p>• {t(language, { hindi: 'Emergency (अभी खतरा): 100 / 108 / 181 / 1098', english: 'Emergency (immediate risk): 100 / 108 / 181 / 1098', hinglish: 'Emergency: 100 / 108 / 181 / 1098' })}</p>
            <p>• {t(language, { hindi: 'FIR/बेल/ट्रायल: NALSA 1516, Kunji 1800-313-4963', english: 'FIR/Bail/Trial: NALSA 1516, Kunji 1800-313-4963', hinglish: 'FIR/Bail/Trial: NALSA 1516, Kunji 1800-313-4963' })}</p>
            <p>• {t(language, { hindi: 'मेंटल हेल्थ: iCall / Vandrevala', english: 'Mental health: iCall / Vandrevala', hinglish: 'Mental health: iCall / Vandrevala' })}</p>
          </div>
        </div>

        <div className="card-sm">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={15} style={{ color: "var(--c-primary)" }} />
            <p className="section-label">
              {t(language, { hindi: 'स्मार्ट सुझाव', english: 'Smart Recommendation', hinglish: 'Smart Suggestion' })}
            </p>
          </div>
          <p className="section-helper">
            {t(language, {
              hindi: "अपनी समस्या लिखें: जैसे 'FIR help' या 'arrest stage'",
              english: "Type your need: e.g. 'FIR help' or 'arrest stage'",
              hinglish: "Apni need likho: jaise 'FIR help' ya 'arrest stage'",
            })}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-9 h-9 rounded-xl border flex items-center justify-center" style={{ borderColor: "var(--c-border)", background: "var(--c-surface-2)", color: "var(--c-muted)" }}>
              <Search size={15} />
            </div>
            <input
              value={needInput}
              onChange={(e) => setNeedInput(e.target.value)}
              placeholder={t(language, {
                hindi: "उदाहरण: FIR, बेल, कोर्ट, जेल, मेडिकल",
                english: "Example: FIR, bail, court, prison, medical",
                hinglish: "Example: FIR, bail, court, prison, medical",
              })}
              className="flex-1 rounded-xl px-3 py-2 text-sm border outline-none"
              style={{ background: "var(--c-bg)", color: "var(--c-text)", borderColor: "var(--c-border)" }}
            />
          </div>

          {needInput.trim() && (
            <div className="mt-3 space-y-2">
              {(recommended.length ? recommended : essentialHelplines.slice(0, 2)).map((h) => {
                const Icon = getHelplineIcon(h.icon);
                return (
                  <a
                    key={`rec-${h.number}`}
                    href={`tel:${h.number.replace(/[-\s]/g, '')}`}
                    className="flex items-center gap-3 rounded-xl px-3 py-2 border"
                    style={{ background: "var(--c-surface)", borderColor: "var(--c-border)" }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--c-primary-l)", color: "var(--c-primary)" }}>
                      <Icon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold" style={{ color: "var(--c-heading)" }}>{h.name}</p>
                      <p className="text-[11px]" style={{ color: "var(--c-muted)" }}>{h.purpose[language]}</p>
                    </div>
                    <span className="text-xs font-bold" style={{ color: "var(--c-primary)" }}>{h.number}</span>
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <div className="card-sm">
          <div className="flex items-center gap-2 mb-2">
            <Info size={14} style={{ color: "var(--c-primary)" }} />
            <p className="section-label">
              {t(language, { hindi: 'स्टेज के अनुसार कौन सा नंबर', english: 'Stage-based Mapping', hinglish: 'Stage Mapping' })}
            </p>
          </div>
          <div className="space-y-2">
            {STAGE_GUIDE.map((row) => (
              <div key={row.key} className="rounded-xl px-3 py-2 border" style={{ borderColor: "var(--c-border)", background: "var(--c-surface)" }}>
                <p className="text-xs font-bold mb-1" style={{ color: "var(--c-heading)" }}>
                  {row.label[language]}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {row.icons.map((iconKey) => {
                    const h = helplines.find((x) => x.icon === iconKey);
                    if (!h) return null;
                    return (
                      <span
                        key={`${row.key}-${iconKey}`}
                        className="px-2 py-1 rounded-full text-[11px] font-semibold"
                        style={{ background: "var(--c-primary-l)", color: "var(--c-primary)" }}
                      >
                        {h.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <h2 className="font-bold text-base uppercase tracking-wide pt-1" style={{ color: 'var(--c-label)' }}>
          {t(language, { hindi: 'सबसे ज़रूरी', english: 'Most Important', hinglish: 'Sabse Zaroori' })}
        </h2>

        <p className="section-helper">
          {t(language, {
            hindi: 'ये नंबर सबसे पहले कॉल करने के लिए हैं।',
            english: 'These are the most important first-call numbers.',
            hinglish: 'Yeh sabse pehle call karne wale numbers hain.',
          })}
        </p>
        {essentialHelplines.map((h, i) => (
          (() => {
            const Icon = getHelplineIcon(h.icon);
            return (
          <a
            key={i}
            href={`tel:${h.number.replace(/[-\s]/g, '')}`}
            className="helpline-card premium-card"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--c-primary-l)", color: "var(--c-primary)" }}>
              <Icon size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold mb-0.5" style={{ color: 'var(--c-label)' }}>
                {h.stage[language]}
              </div>
              <div className="font-bold text-base" style={{ color: 'var(--c-heading)' }}>{h.name}</div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full mt-1" style={{ background: "var(--c-primary-l)", color: "var(--c-primary)" }}>
                {h.category[language]}
              </div>
              <div className="font-extrabold text-xl" style={{ color: 'var(--c-primary)' }}>{h.number}</div>
              <div className="text-xs mt-0.5 leading-tight" style={{ color: 'var(--c-muted)' }}>{h.desc[language]}</div>
              <div className="text-xs mt-1" style={{ color: "var(--c-text)" }}>
                <strong>{t(language, { hindi: "उद्देश्य:", english: "Purpose:", hinglish: "Purpose:" })}</strong> {h.purpose[language]}
              </div>
              {h.timing && (
                <div className="text-xs font-semibold mt-1 inline-flex items-center gap-1" style={{ color: 'var(--c-success)' }}><Clock3 size={12} /> {h.timing}</div>
              )}
              <div className="text-xs mt-1" style={{ color: "var(--c-muted)" }}>
                {t(language, { hindi: "Best time:", english: "Best time:", hinglish: "Best time:" })} {h.bestTime[language]}
              </div>
              <div className="text-xs mt-1 inline-flex items-center gap-1" style={{ color: "var(--c-warning)" }}>
                <AlertTriangle size={11} />
                {t(language, { hindi: "कब NOT use करें:", english: "When NOT to use:", hinglish: "When NOT to use:" })} {h.notFor[language]}
              </div>
            </div>
            <div className="text-2xl" style={{ color: 'var(--c-success)' }}><Phone size={18} /></div>
          </a>
            );
          })()
        ))}

        <h2 className="font-bold text-base uppercase tracking-wide pt-2" style={{ color: 'var(--c-label)' }}>
          {t(language, { hindi: 'सभी नंबर', english: 'All Numbers', hinglish: 'Saare Numbers' })}
        </h2>
        <p className="section-helper">
          {t(language, {
            hindi: 'अपनी स्थिति के अनुसार सही नंबर चुनें।',
            english: 'Choose a number based on your exact need.',
            hinglish: 'Apni zarurat ke hisaab se sahi number chunein.',
          })}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {visibleOtherHelplines.map((h, i) => (
            (() => {
              const Icon = getHelplineIcon(h.icon);
              return (
            <a
              key={i}
              href={`tel:${h.number.replace(/[-\s]/g, '')}`}
              className="helpline-card premium-card"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "var(--c-primary-l)", color: "var(--c-primary)" }}>
                <Icon size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold mb-0.5" style={{ color: 'var(--c-label)' }}>
                  {h.stage[language]}
                </div>
                <div className="font-bold text-sm" style={{ color: 'var(--c-heading)' }}>{h.name}</div>
                <div className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1" style={{ background: "var(--c-primary-l)", color: "var(--c-primary)" }}>
                  {h.category[language]}
                </div>
                <div className="font-extrabold text-lg" style={{ color: 'var(--c-text)' }}>{h.number}</div>
                <div className="text-xs leading-tight" style={{ color: 'var(--c-muted)' }}>{h.desc[language]}</div>
                {h.timing && (
                  <div className="text-xs font-medium mt-0.5 inline-flex items-center gap-1" style={{ color: 'var(--c-success)' }}><Clock3 size={11} /> {h.timing}</div>
                )}
                <div className="text-[11px] mt-1" style={{ color: "var(--c-text)" }}>
                  <strong>{t(language, { hindi: "Purpose:", english: "Purpose:", hinglish: "Purpose:" })}</strong> {h.purpose[language]}
                </div>
                <div className="text-[11px]" style={{ color: "var(--c-muted)" }}>
                  {t(language, { hindi: "Best time:", english: "Best time:", hinglish: "Best time:" })} {h.bestTime[language]}
                </div>
              </div>
              <div className="text-base" style={{ color: 'var(--c-label)' }}><ArrowRight size={14} /></div>
            </a>
              );
            })()
          ))}
        </div>
        {otherHelplines.length > 6 && (
          <div className="flex justify-center">
            <button
              onClick={() => setShowAllNumbers((v) => !v)}
              className="see-more-btn inline-flex items-center justify-center gap-1"
              aria-label={showAllNumbers ? "Show less" : "See more numbers"}
              style={{ minWidth: "190px", height: "38px", padding: "0 16px" }}
            >
              {showAllNumbers
                ? t(language, { hindi: 'कम दिखाएं', english: 'Show less', hinglish: 'Kam dikhao' })
                : t(language, { hindi: 'और नंबर देखें', english: 'See more numbers', hinglish: 'Aur numbers dekho' })}
              {showAllNumbers ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
          </div>
        )}

        {/* Save numbers prompt */}
        <div className="rounded-2xl p-4 mt-2" style={{ background: 'var(--c-warning-l)', border: '1px solid rgba(251,191,36,0.22)' }}>
          <p className="font-semibold text-sm text-center" style={{ color: '#FBBF24' }}>
            <Save size={14} className="inline mr-1" /> {t(language, {
              hindi: 'इन नंबरों को अपने फोन में सेव कर लें',
              english: 'Save these numbers in your phone',
              hinglish: 'Yeh numbers apne phone mein save kar lein',
            })}
          </p>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="bottom-nav">
        {[
          { Icon: Scale, path: '/chat', label: { hindi: 'मदद', english: 'Chat', hinglish: 'Chat' } },
          { Icon: BookOpen, path: '/manual', label: { hindi: 'गाइड', english: 'Guide', hinglish: 'Guide' } },
          { Icon: House, path: '/home', label: { hindi: 'होम', english: 'Home', hinglish: 'Home' } },
          { Icon: Mic, path: '/voice-guide', label: { hindi: 'वॉइस', english: 'Voice', hinglish: 'Voice' } },
          { Icon: Phone, path: '/helpline', label: { hindi: 'हेल्पलाइन', english: 'Helpline', hinglish: 'Helpline' } },
        ].map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            aria-label={item.label[language]}
            className={`bottom-nav-item ${item.path === '/home' ? 'bottom-nav-home' : ''}
                       ${item.path === '/helpline' ? 'nav-item-active' : 'nav-item-inactive'}`}
          >
            <span className="nav-icon"><item.Icon size={18} /></span>
            <span className="nav-label">{item.label[language]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
