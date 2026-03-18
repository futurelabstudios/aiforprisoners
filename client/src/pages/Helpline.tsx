import { useNavigate } from 'react-router-dom';
import { useApp, t } from '../context/AppContext';
import LangSwitcher from '../components/LangSwitcher';

interface HelplineItem {
  emoji: string;
  name: string;
  number: string;
  desc: { hindi: string; english: string; hinglish: string };
  timing?: string;
  stage: { hindi: string; english: string; hinglish: string };
  important?: boolean;
}

const helplines: HelplineItem[] = [
  {
    emoji: '🔑',
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
    emoji: '⚖️',
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
    emoji: '🚔',
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
    emoji: '🚑',
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
    emoji: '👩',
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
    emoji: '👶',
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
    emoji: '🧠',
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
    emoji: '💊',
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
    emoji: '🏥',
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
    emoji: '🏛️',
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
    emoji: '🆔',
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
    emoji: '💊',
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

export default function Helpline() {
  const { language } = useApp();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-dvh xl:h-full overflow-hidden" style={{ background: 'var(--c-bg)' }}>
      {/* Header */}
      <div className="theme-header px-4 pt-10 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/home')} className="w-8 h-8 rounded-full flex items-center justify-center text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all">←</button>
          <div className="text-2xl">📞</div>
          <div className="flex-1">
            <h1 className="font-extrabold text-base leading-tight">
              {t(language, { hindi: 'हेल्पलाइन नंबर', english: 'Helpline Numbers', hinglish: 'Helpline Numbers' })}
            </h1>
            <p className="text-white/50 text-xs">
              {t(language, { hindi: 'किसी को भी कॉल करें — सब मुफ्त', english: 'Call anyone — all free', hinglish: 'Kisi ko bhi call karein — sab free' })}
            </p>
          </div>
          <LangSwitcher dark />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto content-shell py-4 space-y-3 pb-24">
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

        <h2 className="font-bold text-base uppercase tracking-wide pt-1" style={{ color: 'var(--c-label)' }}>
          {t(language, { hindi: '⭐ सबसे ज़रूरी', english: '⭐ Most Important', hinglish: '⭐ Sabse Zaroori' })}
        </h2>

        {helplines.filter(h => h.important).map((h, i) => (
          <a
            key={i}
            href={`tel:${h.number.replace(/[-\s]/g, '')}`}
            className="helpline-card premium-card"
          >
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold mb-0.5" style={{ color: 'var(--c-label)' }}>
                {h.stage[language]}
              </div>
              <div className="font-bold text-base" style={{ color: 'var(--c-heading)' }}>{h.name}</div>
              <div className="font-extrabold text-xl" style={{ color: 'var(--c-primary)' }}>{h.number}</div>
              <div className="text-xs mt-0.5 leading-tight" style={{ color: 'var(--c-muted)' }}>{h.desc[language]}</div>
              {h.timing && (
                <div className="text-xs font-semibold mt-1" style={{ color: 'var(--c-success)' }}>⏰ {h.timing}</div>
              )}
            </div>
            <div className="text-2xl" style={{ color: 'var(--c-success)' }}>📞</div>
          </a>
        ))}

        <h2 className="font-bold text-base uppercase tracking-wide pt-2" style={{ color: 'var(--c-label)' }}>
          {t(language, { hindi: '📞 सभी नंबर', english: '📞 All Numbers', hinglish: '📞 Saare Numbers' })}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {helplines.filter(h => !h.important).map((h, i) => (
            <a
              key={i}
              href={`tel:${h.number.replace(/[-\s]/g, '')}`}
              className="helpline-card premium-card"
            >
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold mb-0.5" style={{ color: 'var(--c-label)' }}>
                  {h.stage[language]}
                </div>
                <div className="font-bold text-sm" style={{ color: 'var(--c-heading)' }}>{h.name}</div>
                <div className="font-extrabold text-lg" style={{ color: 'var(--c-text)' }}>{h.number}</div>
                <div className="text-xs leading-tight" style={{ color: 'var(--c-muted)' }}>{h.desc[language]}</div>
                {h.timing && (
                  <div className="text-xs font-medium mt-0.5" style={{ color: 'var(--c-success)' }}>⏰ {h.timing}</div>
                )}
              </div>
              <div className="text-base" style={{ color: 'var(--c-label)' }}>→</div>
            </a>
          ))}
        </div>

        {/* Save numbers prompt */}
        <div className="rounded-2xl p-4 mt-2" style={{ background: 'var(--c-warning-l)', border: '1px solid rgba(251,191,36,0.22)' }}>
          <p className="font-semibold text-sm text-center" style={{ color: '#FBBF24' }}>
            💾 {t(language, {
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
          { icon: '🏠', path: '/home', label: { hindi: 'होम', english: 'Home', hinglish: 'Home' } },
          { icon: '⚖️', path: '/chat', label: { hindi: 'मदद', english: 'Chat', hinglish: 'Chat' } },
          { icon: '📖', path: '/manual', label: { hindi: 'गाइड', english: 'Guide', hinglish: 'Guide' } },
          { icon: '🎙️', path: '/voice-guide', label: { hindi: 'वॉइस', english: 'Voice', hinglish: 'Voice' } },
          { icon: '📞', path: '/helpline', label: { hindi: 'हेल्पलाइन', english: 'Helpline', hinglish: 'Helpline' } },
        ].map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex-1 flex flex-col items-center py-3 gap-1 text-xs font-semibold
                       ${item.path === '/helpline' ? 'nav-item-active' : 'nav-item-inactive'}`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label[language]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
