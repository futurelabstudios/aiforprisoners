import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, t } from '../context/AppContext';
import {
  Scale,
  HardHat,
  House,
  Mic,
  BookOpen,
  Phone,
  ArrowLeft,
  UtensilsCrossed,
  Briefcase,
  FileText,
  HeartPulse,
  Brain,
  GraduationCap,
  Landmark,
  KeyRound,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Resource {
  name: string;
  desc: string;
  phone?: string;
  note?: string;
}

interface Category {
  id: string;
  icon: string;
  label: { hindi: string; english: string; hinglish: string };
  resources: Resource[];
}

const categories: Category[] = [
  {
    id: 'shelter',
    icon: 'shelter',
    label: { hindi: 'आश्रय', english: 'Shelter', hinglish: 'Shelter / Ghar' },
    resources: [
      {
        name: 'Delhi Shelter Board (Rain Basera)',
        desc: 'Free night shelter for homeless. Open 24/7 across all Delhi districts.',
        phone: '011-23386700',
        note: 'North, South, East, West, Central Delhi — all areas have shelters',
      },
      {
        name: 'Salvation Army',
        desc: 'Free temporary shelter and rehabilitation support',
        phone: '011-23363837',
      },
      {
        name: 'YUVA (Youth for Unity and Voluntary Action)',
        desc: 'Transitional housing support for released prisoners',
        phone: '022-24130376',
      },
    ],
  },
  {
    id: 'food',
    icon: 'food',
    label: { hindi: 'खाना', english: 'Food', hinglish: 'Khana / Food' },
    resources: [
      {
        name: 'Gurudwara Langar',
        desc: 'Free meals 24/7 at any Gurudwara. No registration needed. Just come.',
        note: 'Gurudwara Bangla Sahib, Sis Ganj, Rakab Ganj — all serve free food',
      },
      {
        name: 'Feeding India / Zomato',
        desc: 'Free meal distribution at multiple locations in Delhi NCR',
        phone: '1800-103-1010',
      },
      {
        name: 'Happy Fridge (Community Fridge)',
        desc: 'Community refrigerators with free food available in multiple Delhi areas',
        note: 'Search "Happy Fridge near me" on Google Maps',
      },
      {
        name: 'Government Ration (PDS)',
        desc: 'Get Ration Card for subsidized food grains',
        phone: '1967',
        note: 'Apply at district Food & Supply office with Aadhaar',
      },
    ],
  },
  {
    id: 'jobs',
    icon: 'jobs',
    label: { hindi: 'नौकरी', english: 'Jobs / Skills', hinglish: 'Naukri / Job' },
    resources: [
      {
        name: 'ETASHA Society',
        desc: 'Free skill training and job placement for marginalized youth. Placement support included.',
        phone: '011-41627070',
        note: 'Courses: Hospitality, Retail, BPO, Security. Certificate provided.',
      },
      {
        name: 'Chetanalaya',
        desc: 'Vocational training and livelihood support in Delhi',
        phone: '011-27650960',
      },
      {
        name: 'Skill India (PMKVY)',
        desc: 'Government skill training program — free certificates recognized nationally',
        phone: '1800-123-9626',
        note: 'Visit nearest Skill Development Center',
      },
      {
        name: 'KVIC (Khadi & Village Industries)',
        desc: 'Free training for self-employment and small business setup',
        phone: '1800-3000-5555',
      },
      {
        name: 'Primero Foundation',
        desc: 'Livelihood programs for ex-offenders, includes job referrals',
      },
      {
        name: 'India Vision Foundation',
        desc: 'Specifically supports released prisoners with skill building and employment',
        phone: '0120-2774600',
      },
    ],
  },
  {
    id: 'documents',
    icon: 'documents',
    label: { hindi: 'दस्तावेज़', english: 'Documents', hinglish: 'Documents / Kaagzaat' },
    resources: [
      {
        name: 'Aadhaar Card — UIDAI',
        desc: 'Get or update Aadhaar card. Required for most services. Free.',
        phone: '1947',
        note: 'Visit nearest Aadhaar enrollment center. Bring any 1 ID proof.',
      },
      {
        name: 'PAN Card',
        desc: 'Apply online at NSDL or UTIITSL. Required for banking and income tax.',
        phone: '020-27218080',
        note: 'Online apply at onlineservices.nsdl.com | Cost: ₹107',
      },
      {
        name: 'Jan Dhan Bank Account',
        desc: 'Zero balance bank account for all Indians. Access at any nationalized bank or post office.',
        phone: '1800-11-0001',
        note: 'Bring Aadhaar card. No minimum balance required.',
      },
      {
        name: 'Voter ID Card',
        desc: 'Apply at local BLO (Booth Level Officer) office or online at voters.eci.gov.in',
        phone: '1950',
      },
      {
        name: 'Driving Licence',
        desc: 'Apply at nearest RTO office. Learner licence test required first.',
        note: 'Bring Aadhaar, address proof, age proof',
      },
    ],
  },
  {
    id: 'health',
    icon: 'health',
    label: { hindi: 'स्वास्थ्य', english: 'Health', hinglish: 'Sehat / Health' },
    resources: [
      {
        name: 'Mohalla Clinic (Delhi)',
        desc: 'Free doctor consultation, medicines, tests. Government-run in every neighborhood.',
        phone: '011-23386000',
        note: 'Available across all Delhi areas. No appointment needed.',
      },
      {
        name: 'Government Hospitals — Free OPD',
        desc: 'AIIMS, Safdarjung, Ram Manohar Lohia, GTB, DDU — all have free OPD',
        phone: '104',
        note: 'Bring Aadhaar card for registration',
      },
      {
        name: 'PM Ayushman Bharat',
        desc: 'Free hospital treatment up to ₹5 lakh per year for eligible families',
        phone: '14555',
        note: 'Check eligibility at pmjay.gov.in',
      },
      {
        name: 'ESI Hospital',
        desc: 'Free health coverage for organized sector workers and their families',
        phone: '1800-11-2526',
      },
    ],
  },
  {
    id: 'mental',
    icon: 'mental',
    label: { hindi: 'मन की मदद', english: 'Mental Health', hinglish: 'Mental Health' },
    resources: [
      {
        name: 'iCall (TISS) — Free Counselling',
        desc: 'Free psychological counselling in Hindi and English by trained counsellors.',
        phone: '9152987821',
        note: 'Mon-Sat 8am–10pm. Free. Confidential.',
      },
      {
        name: 'Vandrevala Foundation',
        desc: 'Free 24/7 mental health helpline. Call anytime.',
        phone: '1860-2662-345',
      },
      {
        name: 'Sanjeevani Society',
        desc: 'Mental health counselling and therapy in Delhi. Sliding scale fees.',
        phone: '011-24311918',
      },
      {
        name: 'NIMHANS (Bengaluru)',
        desc: 'National Institute of Mental Health — consultation and support',
        phone: '080-46110007',
      },
      {
        name: 'Nasha Mukti (De-Addiction)',
        desc: 'Naya Savera, Shafa Home, SPYM — free or low-cost de-addiction programs',
        phone: '14446',
        note: 'National De-addiction Helpline: 14446 (free)',
      },
    ],
  },
  {
    id: 'legal',
    icon: 'legal',
    label: { hindi: 'कानूनी सहायता', english: 'Legal Aid', hinglish: 'Legal Aid / Madad' },
    resources: [
      {
        name: 'NALSA — Free Legal Aid',
        desc: 'National Legal Services Authority — completely free legal aid for poor and marginalized',
        phone: '1516',
        note: 'Available 24/7. Free lawyer, free court representation.',
      },
      {
        name: 'DLSA (District Legal Services Authority)',
        desc: 'Each district has a DLSA office — free lawyers for those who cannot afford',
        note: 'Visit your district court complex to find DLSA office',
      },
      {
        name: 'Human Rights Law Network',
        desc: 'Free legal support for prisoners and marginalized communities',
        phone: '011-24374501',
      },
      {
        name: 'International Bridges to Justice (IBJ)',
        desc: 'Support for undertrial prisoners, legal rights awareness',
        phone: '011-47081333',
      },
      {
        name: 'Kunji Helpline',
        desc: 'Legal counselling and case guidance for prisoners and families. FREE.',
        phone: '1800-313-4963',
        note: 'Daily 8am–11pm. Project Second Chance / TYCIA Foundation.',
      },
    ],
  },
  {
    id: 'education',
    icon: 'education',
    label: { hindi: 'शिक्षा', english: 'Education', hinglish: 'Padhai / Education' },
    resources: [
      {
        name: 'NIOS (National Institute of Open Schooling)',
        desc: 'Complete Class 10 or 12 at any age. No age limit. Recognized board.',
        phone: '011-40671000',
        note: 'Exams twice a year. Fees very low. Hindi medium available.',
      },
      {
        name: 'IGNOU (Indira Gandhi Open University)',
        desc: 'Degree programs at any age, from home. Very affordable.',
        phone: '1800-112-346',
        note: 'BA, BCA, BBA and many diplomas available in Hindi',
      },
      {
        name: 'Pratham Foundation',
        desc: 'Basic literacy and numeracy training for adults',
        phone: '022-24236900',
      },
    ],
  },
];

export default function PostRelease() {
  const { language } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllResources, setShowAllResources] = useState(false);
  const [isLgUp, setIsLgUp] = useState(
    typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => setIsLgUp(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const cat = categories[activeTab];
  const categoryIcon = (key: string) => {
    const map: Record<string, any> = {
      shelter: House,
      food: UtensilsCrossed,
      jobs: Briefcase,
      documents: FileText,
      health: HeartPulse,
      mental: Brain,
      legal: Scale,
      education: GraduationCap,
    };
    return map[key] ?? Landmark;
  };
  const categoryAccent = (key: string) => {
    const map: Record<string, string> = {
      shelter: "#60A5FA",
      food: "#F59E0B",
      jobs: "#34D399",
      documents: "#FBBF24",
      health: "#F87171",
      mental: "#A78BFA",
      legal: "#818CF8",
      education: "#2DD4BF",
    };
    return map[key] ?? "var(--c-primary)";
  };
  const categoriesExpanded = showAllCategories || isLgUp;
  const resourcesExpanded = showAllResources || isLgUp;
  const visibleCategories = categoriesExpanded ? categories : categories.slice(0, 4);
  const visibleResources = resourcesExpanded ? cat.resources : cat.resources.slice(0, 4);

  const stepItems = [
    t(language, {
      hindi: 'ऊपर से वह क्षेत्र चुनें जो आपकी ज़रूरत से मेल खाता हो (आश्रय, खाना, नौकरी, आदि)।',
      english: 'Choose the area that fits your need — shelter, food, jobs, documents, and more.',
      hinglish: 'Upar se woh area chuno jo aapki zarurat ho — shelter, food, job, documents, wagairah.',
    }),
    t(language, {
      hindi: 'सूची से संगठन को कॉल करें या मिलें — ये मदद के लिए हैं।',
      english: 'Call or visit the organizations listed — they exist to support you.',
      hinglish: 'Neeche diye orgs ko call karo ya jao — woh madad ke liye hain.',
    }),
    t(language, {
      hindi: 'कानूनी सवाल या कागज़ों की समझ के लिए नीचे कुंजी / लीगल हेल्प उपयोग करें।',
      english: 'For legal questions or help understanding papers, use Kunji or Legal Help (chat).',
      hinglish: 'Legal sawaal ya papers samajhne ke liye Kunji ya Legal Help chat use karo.',
    }),
  ];

  return (
    <div
      className="post-release-page h-dvh min-h-0 overflow-y-auto lg:min-h-0"
      style={{ background: "var(--c-bg)" }}
    >
      {/* Header — mobile / tablet only (desktop: site header) */}
      <div className="theme-header px-4 pb-4 pt-10 lg:hidden">
        <div className="mb-2 flex items-center gap-3">
          <button
            onClick={() => navigate('/home')}
            className="text-2xl"
            style={{ color: "rgba(255,255,255,0.78)" }}
          >
            <ArrowLeft size={20} />
          </button>
          <div className="text-3xl" style={{ color: "#FAF7F4" }}>
            <House size={26} />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-white">
              {t(language, { hindi: 'जेल के बाद सहायता', english: 'After Release Support', hinglish: 'Jail Ke Baad Madad' })}
            </h1>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.58)" }}>
              {t(language, { hindi: 'मुफ्त संसाधन और सहायता', english: 'Free resources & support', hinglish: 'Free resources aur support' })}
            </p>
          </div>
        </div>
        <div className="ai-chip">🤖 AI-Powered Reintegration Hub</div>
      </div>

      {/* Emergency strip — mobile / tablet; desktop: sidebar */}
      <a href="tel:18003134963" className="emergency-banner lg:hidden">
        <Phone size={14} className="mr-1 inline" /> Kunji Helpline (Free): 1800-313-4963 | Daily 8am–11pm
      </a>

      <div className="min-h-0 lg:mx-auto lg:grid lg:w-full lg:max-w-[min(105rem,100%)] lg:grid-cols-[minmax(0,1fr)_minmax(19rem,26rem)] lg:gap-6 lg:px-12 lg:pb-8 2xl:max-w-[min(112rem,100%)] 2xl:px-14">
        <div className="min-w-0">
          <div className="content-shell pt-4 lg:!max-w-none lg:mx-0 lg:px-0 lg:pt-6">
            <div className="glass-panel section-block p-3 lg:p-5">
              <div className="section-header-row">
                <div>
                  <p className="mb-1 text-xs font-bold uppercase tracking-wide lg:text-sm" style={{ color: "var(--c-label)" }}>
                    {t(language, {
                      hindi: 'सभी विकल्प (आसान पहुंच)',
                      english: 'All Support Areas',
                      hinglish: 'Saare Support Areas',
                    })}
                  </p>
                  <p className="section-helper lg:text-base">
                    {t(language, {
                      hindi: 'पहले एक क्षेत्र चुनें, फिर नीचे संसाधन देखें',
                      english: 'Pick one area first, then view resources below.',
                      hinglish: 'Pehle ek area chunein, phir neeche resources dekhein.',
                    })}
                  </p>
                </div>
                {categories.length > 4 && !isLgUp && (
                  <button
                    onClick={() => setShowAllCategories((v) => !v)}
                    className="see-more-btn inline-flex items-center gap-1"
                    aria-label={showAllCategories ? "Show less" : "See more"}
                  >
                    {showAllCategories ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-4">
                {visibleCategories.map((c) => {
                  const Icon = categoryIcon(c.icon);
                  return (
                  <button
                    key={c.id}
                    onClick={() => setActiveTab(categories.findIndex((x) => x.id === c.id))}
                    className={`rounded-xl border p-3 text-left transition-all active:scale-95 lg:p-4 ${c.id === cat.id ? 'text-white shadow-lg' : ''}`}
                    style={
                      c.id === cat.id
                        ? { background: '#C85828', borderColor: 'transparent' }
                        : { background: 'var(--c-surface)', borderColor: 'var(--c-border)', color: 'var(--c-text)' }
                    }
                  >
                    <div className="text-xl lg:text-2xl"><Icon size={18} className="lg:h-5 lg:w-5" /></div>
                    <div className="mt-1 text-xs font-bold lg:mt-1.5 lg:text-sm">{c.label[language]}</div>
                    <div className="mt-1 text-[11px] lg:text-xs" style={{ color: c.id === cat.id ? "rgba(255,255,255,0.78)" : "var(--c-muted)" }}>
                      {c.resources.length} {t(language, {
                        hindi: 'विकल्प',
                        english: 'options',
                        hinglish: 'options',
                      })}
                    </div>
                  </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Resources */}
          <div className="content-shell space-y-4 py-4 pb-28 lg:!max-w-none lg:mx-0 lg:space-y-6 lg:px-0 lg:py-6 lg:pb-8">
            <h2 className="flex items-center justify-between gap-2 text-xl font-bold lg:text-2xl" style={{ color: "var(--c-heading)" }}>
              <span className="flex items-center gap-2 lg:gap-3">
                {(() => {
                  const Icon = categoryIcon(cat.icon);
                  return <Icon size={18} className="lg:h-6 lg:w-6" />;
                })()}
                <span>{cat.label[language]}</span>
              </span>
              <span className="rounded-full border px-2 py-1 text-xs font-bold lg:px-3 lg:py-1.5 lg:text-sm" style={{ color: "var(--c-label)", background: "var(--c-surface-2)", borderColor: "var(--c-border)" }}>
                {cat.resources.length} {t(language, { hindi: 'सहायता', english: 'supports', hinglish: 'supports' })}
              </span>
            </h2>
            <p className="section-helper lg:text-base">
              {t(language, {
                hindi: 'पहले ऊपर दिए गए विकल्प चुनें, फिर नीचे से जरूरत के अनुसार कॉल करें।',
                english: 'Use these support options based on your current need.',
                hinglish: 'Apni zarurat ke hisaab se neeche wale options use karein.',
              })}
            </p>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-6">
              {visibleResources.map((res, i) => (
                <div
                  key={i}
                  className="premium-card border-l-4 lg:p-5"
                  style={{ borderLeftColor: categoryAccent(cat.icon) }}
                >
                  <h3 className="mb-1 text-base font-bold leading-tight lg:mb-2 lg:text-lg" style={{ color: "var(--c-heading)" }}>{res.name}</h3>
                  <p className="mb-2 text-sm leading-relaxed lg:mb-3 lg:text-base" style={{ color: "var(--c-text)" }}>{res.desc}</p>

                  {res.note && (
                    <p className="mb-2 text-xs italic lg:mb-3 lg:text-sm" style={{ color: "var(--c-muted)" }}>{res.note}</p>
                  )}

                  {res.phone && (
                    <a
                      href={`tel:${res.phone.replace(/[-\s]/g, '')}`}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-white shadow-sm transition-all
                                 active:scale-95 lg:w-auto lg:px-5 lg:py-3 lg:text-base"
                      style={{background:'#C85828'}}
                    >
                      <Phone size={14} className="lg:h-[1.125rem] lg:w-[1.125rem]" /> {t(language, { hindi: 'कॉल करें', english: 'Call Now', hinglish: 'Call Karo' })}: {res.phone}
                    </a>
                  )}
                </div>
              ))}
            </div>
            {cat.resources.length > 4 && !isLgUp && (
              <button
                onClick={() => setShowAllResources((v) => !v)}
                className="see-more-btn inline-flex items-center gap-1 lg:text-sm"
                aria-label={showAllResources ? "Show less" : "See more options"}
              >
                {showAllResources ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            )}

            {/* Kunji Footer — mobile / tablet; desktop: sidebar */}
            <div className="mt-4 rounded-2xl p-5 text-white shadow-xl lg:hidden" style={{background:'linear-gradient(135deg,#6B2010,#C85828)'}}>
              <div className="text-center">
                <div className="mb-2 flex justify-center text-3xl"><KeyRound size={26} /></div>
                <h3 className="mb-1 text-lg font-bold">Kunji Helpline</h3>
                <p className="mb-3 text-sm" style={{ color: "rgba(255,255,255,0.78)" }}>
                  {t(language, {
                    hindi: 'किसी भी मदद के लिए कुंजी से बात करें',
                    english: 'Talk to Kunji for any help',
                    hinglish: 'Kisi bhi madad ke liye Kunji se baat karein',
                  })}
                </p>
                <a
                  href="tel:18003134963"
                  className="btn-primary inline-block w-auto px-8 text-center"
                >
                  <Phone size={14} className="mr-1 inline" />1800-313-4963
                </a>
                <p className="mt-2 text-xs" style={{ color: "rgba(255,255,255,0.58)" }}>
                  Daily 8am–11pm • FREE • Project Second Chance
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop sidebar: steps, helpline, legal / AI help */}
        <aside
          className="sticky top-24 mt-4 hidden max-h-[min(720px,calc(100dvh-6rem))] min-h-0 w-full flex-col gap-4 self-start overflow-y-auto rounded-2xl border p-4 lg:mt-6 lg:flex"
          style={{
            background: "var(--c-surface)",
            borderColor: "var(--c-border)",
          }}
          aria-label={t(language, {
            hindi: 'कदम, हेल्पलाइन और लीगल मदद',
            english: 'Steps, helpline, and legal help',
            hinglish: 'Steps, helpline aur legal help',
          })}
        >
          <div>
            <p className="section-label">
              {t(language, {
                hindi: 'आपके कदम',
                english: 'Your steps',
                hinglish: 'Aapke steps',
              })}
            </p>
            <ol className="mt-2 list-none space-y-2.5 p-0">
              {stepItems.map((text, idx) => (
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
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-xs font-extrabold lg:h-8 lg:w-8 lg:text-sm"
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
                hindi: 'कुंजी: रोज 8am–11pm • मुफ्त',
                english: 'Kunji: Daily 8am–11pm • Free',
                hinglish: 'Kunji: Daily 8am–11pm • Free',
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
              {t(language, {
                hindi: 'AI व कानूनी मदद',
                english: 'AI & legal help',
                hinglish: 'AI aur legal help',
              })}
            </p>
            <p className="mt-1 text-xs font-medium leading-relaxed lg:mt-2 lg:text-sm" style={{ color: "var(--c-primary)" }}>
              {t(language, {
                hindi:
                  'FIR, जमानत या कागज़ों पर सवाल? लीगल हेल्प चैट सरल भाषा में समझाएगा।',
                english:
                  'Questions about rights, bail, or documents? Legal Help explains in simple language.',
                hinglish:
                  'Rights, bail ya papers par sawaal? Legal Help chat simple language mein samjhayega.',
              })}
            </p>
            <button
              type="button"
              onClick={() => navigate('/chat')}
              className="see-more-btn mt-3 inline-flex w-full items-center justify-center gap-2 lg:mt-4 lg:py-2.5 lg:text-sm"
            >
              <Scale size={16} className="lg:h-[1.125rem] lg:w-[1.125rem]" />
              {t(language, {
                hindi: 'लीगल हेल्प खोलें',
                english: 'Open Legal Help',
                hinglish: 'Legal Help kholo',
              })}
            </button>
          </div>
        </aside>
      </div>

      {/* Bottom Nav */}
      <div className="bottom-nav">
        {[
          { Icon: Scale, path: '/chat', label: { hindi: 'मदद', english: 'Chat', hinglish: 'Chat' } },
          { Icon: HardHat, path: '/post-release', label: { hindi: 'बाद में', english: 'After', hinglish: 'Baad Mein' } },
          { Icon: House, path: '/home', label: { hindi: 'होम', english: 'Home', hinglish: 'Home' } },
          { Icon: Mic, path: '/voice-guide', label: { hindi: 'वॉइस', english: 'Voice', hinglish: 'Voice' } },
          { Icon: Phone, path: '/helpline', label: { hindi: 'हेल्पलाइन', english: 'Helpline', hinglish: 'Helpline' } },
        ].map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            aria-label={item.label[language]}
            className={`bottom-nav-item ${item.path === '/home' ? 'bottom-nav-home' : ''}
                       ${item.path === '/post-release' ? 'nav-item-active' : 'nav-item-inactive'}`}
          >
            <span className="nav-icon"><item.Icon size={18} /></span>
            <span className="nav-label">{item.label[language]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
