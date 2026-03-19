import { useState } from 'react';
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
  const visibleCategories = showAllCategories ? categories : categories.slice(0, 4);
  const visibleResources = showAllResources ? cat.resources : cat.resources.slice(0, 4);

  return (
    <div className="h-dvh overflow-y-auto" style={{ background: "var(--c-bg)" }}>
      {/* Header */}
      <div className="theme-header px-4 pt-10 pb-4">
        <div className="flex items-center gap-3 mb-2">
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
            <h1 className="font-extrabold text-lg text-white">
              {t(language, { hindi: 'जेल के बाद सहायता', english: 'After Release Support', hinglish: 'Jail Ke Baad Madad' })}
            </h1>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.58)" }}>
              {t(language, { hindi: 'मुफ्त संसाधन और सहायता', english: 'Free resources & support', hinglish: 'Free resources aur support' })}
            </p>
          </div>
        </div>
        <div className="ai-chip">🤖 AI-Powered Reintegration Hub</div>
      </div>

      {/* Emergency strip */}
      <a href="tel:18003134963" className="emergency-banner">
        <Phone size={14} className="inline mr-1" /> Kunji Helpline (Free): 1800-313-4963 | Daily 8am–11pm
      </a>

      <div className="content-shell pt-4">
        <div className="glass-panel p-3 section-block">
          <div className="section-header-row">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: "var(--c-label)" }}>
                {t(language, {
                  hindi: 'सभी विकल्प (आसान पहुंच)',
                  english: 'All Support Areas',
                  hinglish: 'Saare Support Areas',
                })}
              </p>
              <p className="section-helper">
                {t(language, {
                  hindi: 'पहले एक क्षेत्र चुनें, फिर नीचे संसाधन देखें',
                  english: 'Pick one area first, then view resources below.',
                  hinglish: 'Pehle ek area chunein, phir neeche resources dekhein.',
                })}
              </p>
            </div>
            {categories.length > 4 && (
              <button
                onClick={() => setShowAllCategories((v) => !v)}
                className="see-more-btn inline-flex items-center gap-1"
                aria-label={showAllCategories ? "Show less" : "See more"}
              >
                {showAllCategories ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {visibleCategories.map((c) => {
              const Icon = categoryIcon(c.icon);
              return (
              <button
                key={c.id}
                onClick={() => setActiveTab(categories.findIndex((x) => x.id === c.id))}
                className={`rounded-xl p-3 text-left border transition-all active:scale-95 ${c.id === cat.id ? 'text-white shadow-lg' : ''}`}
                style={
                  c.id === cat.id
                    ? { background: '#C85828', borderColor: 'transparent' }
                    : { background: 'var(--c-surface)', borderColor: 'var(--c-border)', color: 'var(--c-text)' }
                }
              >
                <div className="text-xl"><Icon size={18} /></div>
                <div className="font-bold text-xs mt-1">{c.label[language]}</div>
                <div className="text-[11px] mt-1" style={{ color: c.id === cat.id ? "rgba(255,255,255,0.78)" : "var(--c-muted)" }}>
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
      <div className="content-shell py-4 space-y-4 pb-28">
        <h2 className="font-bold text-xl flex items-center justify-between gap-2" style={{ color: "var(--c-heading)" }}>
          <span className="flex items-center gap-2">
            {(() => {
              const Icon = categoryIcon(cat.icon);
              return <Icon size={18} />;
            })()}
            <span>{cat.label[language]}</span>
          </span>
          <span className="text-xs font-bold px-2 py-1 rounded-full border" style={{ color: "var(--c-label)", background: "var(--c-surface-2)", borderColor: "var(--c-border)" }}>
            {cat.resources.length} {t(language, { hindi: 'सहायता', english: 'supports', hinglish: 'supports' })}
          </span>
        </h2>
        <p className="section-helper">
          {t(language, {
            hindi: 'पहले ऊपर दिए गए विकल्प चुनें, फिर नीचे से जरूरत के अनुसार कॉल करें।',
            english: 'Use these support options based on your current need.',
            hinglish: 'Apni zarurat ke hisaab se neeche wale options use karein.',
          })}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {visibleResources.map((res, i) => (
            <div
              key={i}
              className="premium-card border-l-4"
              style={{ borderLeftColor: categoryAccent(cat.icon) }}
            >
              <h3 className="font-bold text-base mb-1 leading-tight" style={{ color: "var(--c-heading)" }}>{res.name}</h3>
              <p className="text-sm leading-relaxed mb-2" style={{ color: "var(--c-text)" }}>{res.desc}</p>

              {res.note && (
                <p className="text-xs italic mb-2" style={{ color: "var(--c-muted)" }}>{res.note}</p>
              )}

              {res.phone && (
                <a
                  href={`tel:${res.phone.replace(/[-\s]/g, '')}`}
                  className="inline-flex items-center justify-center w-full md:w-auto gap-2
                             text-white rounded-xl px-4 py-2 text-sm font-bold
                             active:scale-95 transition-all shadow-sm"
                  style={{background:'#C85828'}}
                >
                  <Phone size={14} /> {t(language, { hindi: 'कॉल करें', english: 'Call Now', hinglish: 'Call Karo' })}: {res.phone}
                </a>
              )}
            </div>
          ))}
        </div>
        {cat.resources.length > 4 && (
          <button
            onClick={() => setShowAllResources((v) => !v)}
            className="see-more-btn inline-flex items-center gap-1"
            aria-label={showAllResources ? "Show less" : "See more options"}
          >
            {showAllResources ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        )}

        {/* Kunji Footer */}
        <div className="text-white rounded-2xl p-5 mt-4 shadow-xl" style={{background:'linear-gradient(135deg,#6B2010,#C85828)'}}>
          <div className="text-center">
            <div className="text-3xl mb-2 flex justify-center"><KeyRound size={26} /></div>
            <h3 className="font-bold text-lg mb-1">Kunji Helpline</h3>
            <p className="text-sm mb-3" style={{ color: "rgba(255,255,255,0.78)" }}>
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
              <Phone size={14} className="inline mr-1" />1800-313-4963
            </a>
            <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.58)" }}>
              Daily 8am–11pm • FREE • Project Second Chance
            </p>
          </div>
        </div>
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
