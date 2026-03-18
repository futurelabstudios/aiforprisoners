import { useNavigate } from 'react-router-dom';
import { useApp, t } from '../context/AppContext';
import { Language } from '../context/AppContext';

/* ── Urgency quick-actions (on-the-spot crisis help) ── */
const SOS_ACTIONS = [
  {
    icon: '🚨',
    bg: 'linear-gradient(135deg, #7F1D1D, #991B1B)',
    shadow: 'rgba(127,29,29,0.45)',
    path: '/chat',
    question: {
      hindi: 'मुझे अभी गिरफ्तार किया जा रहा है। मुझे क्या करना चाहिए और मेरे क्या अधिकार हैं?',
      english: 'I am being arrested right now. What are my rights and what should I do?',
      hinglish: 'Mujhe abhi arrest kiya ja raha hai. Mujhe kya karna chahiye aur mere kya rights hain?',
    },
    titles: { hindi: 'अभी गिरफ्तार हो रहा हूँ', english: 'Being Arrested Now', hinglish: 'Abhi Arrest Ho Raha Hoon' },
    subs: { hindi: 'तुरंत अपने अधिकार जानें', english: 'Know your rights instantly', hinglish: 'Turant rights jaanein' },
  },
  {
    icon: '🔒',
    bg: 'linear-gradient(135deg, #9C4020, #C85828)',
    shadow: 'rgba(156,64,32,0.45)',
    path: '/chat',
    question: {
      hindi: 'मुझे जमानत कैसे मिलेगी? अभी क्या करना होगा?',
      english: 'How can I get bail? What needs to be done right now?',
      hinglish: 'Mujhe bail kaise milegi? Abhi kya karna hoga?',
    },
    titles: { hindi: 'जमानत चाहिए आज', english: 'Need Bail Today', hinglish: 'Bail Chahiye Aaj' },
    subs: { hindi: 'जमानत की पूरी जानकारी', english: 'Full bail guidance', hinglish: 'Bail ki poori jaankari' },
  },
];

/* ── Core service tiles ── */
const SERVICES = [
  {
    icon: '⚖️',
    iconBg: 'var(--c-primary-l)',
    iconColor: 'var(--c-primary)',
    path: '/chat',
    question: null,
    titles: { hindi: 'कानूनी मदद', english: 'Legal Help', hinglish: 'Kanoon Ki Madad' },
    subs: { hindi: 'FIR, जमानत, धारा, अदालत', english: 'FIR, Bail, Sections, Court', hinglish: 'FIR, Bail, Sections, Court' },
  },
  {
    icon: '🏠',
    iconBg: '#F0FDF4',
    iconColor: '#16A34A',
    path: '/post-release',
    question: null,
    titles: { hindi: 'जेल के बाद', english: 'After Release', hinglish: 'Jail Ke Baad' },
    subs: { hindi: 'नौकरी, आश्रय, दस्तावेज़', english: 'Jobs, shelter, documents', hinglish: 'Naukri, shelter, docs' },
  },
  {
    icon: '📞',
    iconBg: '#FEF2F2',
    iconColor: '#DC2626',
    path: '/helpline',
    question: null,
    titles: { hindi: 'हेल्पलाइन', english: 'Helplines', hinglish: 'Helpline' },
    subs: { hindi: 'आपातकालीन नंबर', english: 'Emergency numbers', hinglish: 'Emergency numbers' },
  },
  {
    icon: '📋',
    iconBg: '#EFF6FF',
    iconColor: '#2563EB',
    path: '/chat',
    question: {
      hindi: 'FIR की कॉपी कैसे मिलेगी? FIR में जो धाराएं हैं वो क्या मतलब है?',
      english: 'How to get a copy of FIR? What do the sections in FIR mean?',
      hinglish: 'FIR ki copy kaise milegi? FIR mein jo sections hain unka kya matlab hai?',
    },
    titles: { hindi: 'FIR समझें', english: 'Understand FIR', hinglish: 'FIR Samjho' },
    subs: { hindi: 'कॉपी, धाराएं, चुनौती', english: 'Copy, sections, challenge', hinglish: 'Copy, sections, challenge' },
  },
];

/* ── Rights of the day tips ── */
const RIGHTS_TIPS = [
  {
    hindi: '📋 FIR की एक प्रति पाना आपका अधिकार है — यह मुफ्त में मिलती है।',
    english: '📋 You have the right to receive a copy of the FIR — it is free of cost.',
    hinglish: '📋 FIR ki copy paana aapka haq hai — yeh bilkul free milti hai.',
  },
  {
    hindi: '⚖️ यदि पुलिस ने 60 दिन में चार्जशीट नहीं दाखिल की, तो आप डिफ़ॉल्ट जमानत के हकदार हैं।',
    english: '⚖️ If police don\'t file chargesheet within 60 days, you are entitled to Default Bail.',
    hinglish: '⚖️ Agar police ne 60 din mein chargesheet file nahi ki, to aapko Default Bail milne ka haq hai.',
  },
  {
    hindi: '🆓 गरीबी के कारण आप मुफ्त सरकारी वकील पाने के हकदार हैं — NALSA: 1516',
    english: '🆓 You are entitled to a free government lawyer if you cannot afford one — NALSA: 1516',
    hinglish: '🆓 Agar aap vakeel afford nahi kar sakte to free sarkari vakeel milega — NALSA: 1516',
  },
  {
    hindi: '🚫 पुलिस को दिया गया कबूलनामा अदालत में मान्य नहीं होता (धारा 25 साक्ष्य अधिनियम)',
    english: '🚫 A confession to police is NOT admissible in court (Section 25 Evidence Act)',
    hinglish: '🚫 Police ko diya gaya confession court mein valid nahi hota (Section 25 Evidence Act)',
  },
];

const quickQs = [
  { hindi: '🔒 जमानत मिलेगी?', english: '🔒 Can I get bail?', hinglish: '🔒 Bail milegi kya?' },
  { hindi: '📋 FIR में क्या है?', english: '📋 What is in my FIR?', hinglish: '📋 FIR mein kya hai?' },
  { hindi: '⚠️ धाराएं कितनी गंभीर?', english: '⚠️ How serious are sections?', hinglish: '⚠️ Sections kitne serious?' },
];

const today = new Date();
const tipIndex = today.getDate() % RIGHTS_TIPS.length;

export default function Home() {
  const { language } = useApp();
  const navigate = useNavigate();

  const handleService = (path: string, question: Record<Language, string> | null) => {
    if (question) {
      navigate(path, { state: { question: question[language as Language] } });
    } else {
      navigate(path);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: 'var(--c-bg)' }}>

      {/* ── Top Nav Bar ── */}
      <div className="theme-header px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: 'var(--c-primary)' }}
          >
            ⚖️
          </div>
          <div>
            <div className="text-white font-extrabold text-base leading-tight">न्याय सेतु</div>
            <div className="text-xs font-medium" style={{ color: 'var(--c-primary)' }}>Nyay Setu</div>
          </div>
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all"
          style={{ background: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.85)' }}
        >
          🌐 {language === 'hindi' ? 'हिंदी' : language === 'english' ? 'EN' : 'HG'}
        </button>
      </div>

      {/* ── Hero greeting ── */}
      <div
        className="px-5 pt-5 pb-6 text-center"
        style={{ background: 'var(--c-header)' }}
      >
        <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-1">
          {t(language, { hindi: 'आपका स्वागत है', english: 'Welcome', hinglish: 'Aapka Swagat Hai' })}
        </p>
        <h1 className="text-white text-2xl font-extrabold leading-tight mb-1">
          {t(language, { hindi: 'नमस्ते 🙏', english: 'Hello! 🙏', hinglish: 'Namaste 🙏' })}
        </h1>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.50)' }}>
          {t(language, {
            hindi: 'आज हम आपकी कैसे मदद करें?',
            english: 'How can we help you today?',
            hinglish: 'Aaj hum aapki kaise madad karein?',
          })}
        </p>
      </div>

      {/* Wave break */}
      <div style={{ background: 'var(--c-header)', lineHeight: 0 }}>
        <svg viewBox="0 0 390 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 0 Q195 18 390 0 L390 18 L0 18 Z" fill="var(--c-bg)" />
        </svg>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 content-shell pt-4 pb-28 space-y-5">

        {/* ── SOS: Urgency section ── */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="section-label">⚡ Turant Madad</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: 'var(--c-danger)' }}>
              Urgent
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {SOS_ACTIONS.map((action, i) => (
              <button
                key={i}
                onClick={() => navigate(action.path, { state: { question: action.question[language as Language] } })}
                className="sos-tile flex-col items-start"
                style={{ background: action.bg, boxShadow: `0 6px 20px ${action.shadow}` }}
              >
                <div className="text-3xl mb-2">{action.icon}</div>
                <div className="font-extrabold text-sm leading-tight">
                  {action.titles[language as Language]}
                </div>
                <div className="text-white/70 text-xs mt-0.5 leading-tight">
                  {action.subs[language as Language]}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Helpline strip ── */}
        <a
          href="tel:18003134963"
          className="emergency-banner rounded-2xl"
          style={{ borderRadius: '16px', border: '1px solid #FDE68A' }}
        >
          <span>📞</span>
          <span className="font-extrabold">Kunji: 1800-313-4963</span>
          <span style={{ color: '#92400E', fontWeight: 500 }}>Free • 8am–11pm</span>
          <span className="ml-auto text-amber-600 font-bold">Call →</span>
        </a>

        {/* ── Services grid ── */}
        <div>
          <p className="section-label mb-3">
            {t(language, { hindi: '🧭 सेवाएं', english: '🧭 Services', hinglish: '🧭 Services' })}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {SERVICES.map((svc, i) => (
              <button
                key={i}
                onClick={() => handleService(svc.path, svc.question)}
                className="feature-tile group"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: svc.iconBg, color: svc.iconColor }}
                >
                  {svc.icon}
                </div>
                <div>
                  <div
                    className="font-extrabold text-sm leading-tight transition-colors group-hover:text-[#C85828]"
                    style={{ color: 'var(--c-heading)' }}
                  >
                    {svc.titles[language as Language]}
                  </div>
                  <div className="text-xs mt-0.5 leading-tight" style={{ color: 'var(--c-muted)' }}>
                    {svc.subs[language as Language]}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── FutureLabs Voice AI CTA ── */}
        <button
          onClick={() => navigate('/voice-guide')}
          className="w-full rounded-2xl p-4 text-left flex items-center gap-4 active:scale-[0.98] transition-all"
          style={{
            background: 'linear-gradient(135deg, #100600, #1C0A02)',
            boxShadow: '0 6px 24px rgba(16,6,0,0.30)',
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #C85828, #E07C35)' }}
          >
            <span className="text-2xl">🎙️</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-white font-extrabold text-base">
                {t(language, { hindi: 'आवाज़ में बात करें', english: 'Talk to AI', hinglish: 'Awaaz Mein Baat Karein' })}
              </span>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(200,88,40,0.25)', color: '#FBBF8A' }}
              >
                LIVE
              </span>
            </div>
            <div className="text-sm" style={{ color: 'rgba(255,255,255,0.50)' }}>
              {t(language, {
                hindi: 'FutureLabs Voice AI से बात करें',
                english: 'Real-time voice by FutureLabs',
                hinglish: 'FutureLabs Voice AI se baat karein',
              })}
            </div>
          </div>
          <div style={{ color: 'var(--c-primary)', fontSize: '1.25rem', fontWeight: 700 }}>→</div>
        </button>

        {/* ── Aaj Ka Adhikar (Right of the Day) ── */}
        <div className="rights-tip">
          <div className="flex items-center gap-2 mb-2">
            <span className="chip">📖 Aaj Ka Adhikar</span>
          </div>
          <p className="text-sm leading-relaxed font-medium" style={{ color: 'var(--c-heading)' }}>
            {RIGHTS_TIPS[tipIndex][language as Language]}
          </p>
          <button
            onClick={() => navigate('/chat', { state: { question: RIGHTS_TIPS[tipIndex][language as Language] } })}
            className="mt-3 text-xs font-bold"
            style={{ color: 'var(--c-primary)' }}
          >
            {t(language, { hindi: 'और जानें →', english: 'Learn more →', hinglish: 'Aur jaanein →' })}
          </button>
        </div>

        {/* ── Quick questions ── */}
        <div className="card">
          <p className="section-label mb-3">
            {t(language, { hindi: '⚡ जल्दी पूछें', english: '⚡ Quick Questions', hinglish: '⚡ Jaldi Puchein' })}
          </p>
          <div className="space-y-2">
            {quickQs.map((q, i) => (
              <button
                key={i}
                onClick={() => navigate('/chat', { state: { question: q[language as Language] } })}
                className="quick-btn w-full"
              >
                {q[language as Language]}
              </button>
            ))}
          </div>
          <button
            onClick={() => navigate('/chat')}
            className="btn-primary mt-3 w-full py-3 text-sm"
          >
            {t(language, { hindi: 'AI से पूछें →', english: 'Ask AI →', hinglish: 'AI Se Puchein →' })}
          </button>
        </div>

        {/* ── Capability building: Learn section ── */}
        <div>
          <p className="section-label mb-3">
            {t(language, { hindi: '🎓 अपने अधिकार जानें', english: '🎓 Build Your Knowledge', hinglish: '🎓 Apne Adhikar Jaanein' })}
          </p>
          <div className="grid grid-cols-1 gap-2">
            {[
              {
                icon: '📚', color: '#7C3AED', bg: '#F5F3FF',
                q: {
                  hindi: 'भारत में जमानत के नियम क्या हैं? सरल भाषा में समझाएं।',
                  english: 'What are the bail rules in India? Explain in simple language.',
                  hinglish: 'India mein bail ke rules kya hain? Simple bhasha mein samjhaiye.',
                },
                label: { hindi: 'जमानत के नियम', english: 'Bail Rules Explained', hinglish: 'Bail ke Rules' },
              },
              {
                icon: '🔍', color: '#059669', bg: '#ECFDF5',
                q: {
                  hindi: 'एक कमजोर आपराधिक मामले के मुख्य संकेत क्या होते हैं?',
                  english: 'What are signs of a weak criminal case against someone?',
                  hinglish: 'Ek weak criminal case ke kya signs hote hain?',
                },
                label: { hindi: 'कमजोर केस की पहचान', english: 'Spot a Weak Case', hinglish: 'Weak Case Ki Pehchaan' },
              },
              {
                icon: '🧾', color: '#D97706', bg: '#FFFBEB',
                q: {
                  hindi: 'जेल से रिहाई के बाद Aadhaar, PAN, bank account कैसे बनाएं?',
                  english: 'After release from jail, how to get Aadhaar, PAN, and bank account?',
                  hinglish: 'Jail se release ke baad Aadhaar, PAN, bank account kaise banayein?',
                },
                label: { hindi: 'रिहाई के बाद दस्तावेज़', english: 'Documents After Release', hinglish: 'Release ke Baad Documents' },
              },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => navigate('/chat', { state: { question: item.q[language as Language] } })}
                className="card-sm flex items-center gap-3 w-full text-left active:scale-[0.98] transition-all group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: item.bg, color: item.color }}
                >
                  {item.icon}
                </div>
                <span className="font-semibold text-sm flex-1 group-hover:text-[#C85828] transition-colors"
                  style={{ color: 'var(--c-heading)' }}>
                  {item.label[language as Language]}
                </span>
                <span className="text-sm" style={{ color: 'var(--c-muted)' }}>→</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Disclaimer ── */}
        <div
          className="rounded-2xl p-4"
          style={{ background: 'var(--c-warning-l)', border: '1px solid #FDE68A' }}
        >
          <p className="text-xs leading-relaxed" style={{ color: '#92400E' }}>
            {t(language, {
              hindi: '⚠️ यह सामान्य जानकारी है। अपने मामले के लिए कृपया वकील से सलाह लें।',
              english: '⚠️ General information only. Please consult a lawyer for your specific case.',
              hinglish: '⚠️ Yeh general jaankari hai. Apne case ke liye vakeel se zaroor milein.',
            })}
          </p>
        </div>

      </div>

      {/* ── Bottom nav ── */}
      <div className="bottom-nav">
        {[
          { icon: '🏠', label: { hindi: 'होम', english: 'Home', hinglish: 'Home' }, path: '/home' },
          { icon: '⚖️', label: { hindi: 'मदद', english: 'Chat', hinglish: 'Chat' }, path: '/chat' },
          { icon: '🏗️', label: { hindi: 'बाद में', english: 'After', hinglish: 'Baad Mein' }, path: '/post-release' },
          { icon: '🎙️', label: { hindi: 'वॉइस', english: 'Voice', hinglish: 'Voice' }, path: '/voice-guide' },
          { icon: '📞', label: { hindi: 'हेल्पलाइन', english: 'Helpline', hinglish: 'Helpline' }, path: '/helpline' },
        ].map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex-1 flex flex-col items-center py-3 gap-0.5 text-xs font-semibold transition-colors
                       ${item.path === '/home' ? 'nav-item-active' : 'nav-item-inactive'}`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label[language as Language]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
