import { useNavigate } from 'react-router-dom';
import { useApp, t } from '../context/AppContext';

interface HelplineItem {
  emoji: string;
  name: string;
  nameHindi: string;
  number: string;
  desc: { hindi: string; english: string; hinglish: string };
  timing?: string;
  color: string;
  borderColor: string;
  important?: boolean;
}

const helplines: HelplineItem[] = [
  {
    emoji: '🔑',
    name: 'Kunji Helpline',
    nameHindi: 'कुंजी हेल्पलाइन',
    number: '1800-313-4963',
    desc: {
      hindi: 'रिहा हुए बंदियों और परिवारों के लिए मुफ्त कानूनी मदद, TYCIA Foundation',
      english: 'Free legal help for released prisoners & families. Project Second Chance / TYCIA Foundation',
      hinglish: 'Released prisoners aur family ke liye free legal help. Project Second Chance.',
    },
    timing: 'Daily 8am–11pm | FREE',
    color: 'bg-saffron-500',
    borderColor: 'border-orange-400',
    important: true,
  },
  {
    emoji: '⚖️',
    name: 'NALSA Legal Aid',
    nameHindi: 'NALSA मुफ्त कानूनी सहायता',
    number: '1516',
    desc: {
      hindi: 'राष्ट्रीय विधिक सेवा प्राधिकरण — पूरी तरह मुफ्त वकील और अदालती सहायता',
      english: 'National Legal Services Authority — completely free lawyer and court representation',
      hinglish: 'Free vakeel aur court representation — bilkul muft, 24/7 available',
    },
    timing: '24/7 | FREE',
    color: 'bg-navy-800',
    borderColor: 'border-blue-400',
    important: true,
  },
  {
    emoji: '🚔',
    name: 'Police Emergency',
    nameHindi: 'पुलिस',
    number: '100',
    desc: {
      hindi: 'पुलिस आपातकाल — तुरंत मदद के लिए',
      english: 'Police emergency — for immediate help',
      hinglish: 'Police emergency — turant madad ke liye',
    },
    timing: '24/7',
    color: 'bg-blue-700',
    borderColor: 'border-blue-300',
  },
  {
    emoji: '🚑',
    name: 'Ambulance',
    nameHindi: 'एम्बुलेंस',
    number: '108',
    desc: {
      hindi: 'मुफ्त एम्बुलेंस सेवा — चिकित्सा आपातकाल',
      english: 'Free ambulance — medical emergency',
      hinglish: 'Free ambulance — medical emergency ke liye',
    },
    timing: '24/7 | FREE',
    color: 'bg-red-600',
    borderColor: 'border-red-300',
  },
  {
    emoji: '👩',
    name: 'Women Helpline',
    nameHindi: 'महिला हेल्पलाइन',
    number: '181',
    desc: {
      hindi: 'महिलाओं के लिए आपातकालीन सहायता और सुरक्षा',
      english: 'Emergency support and safety for women',
      hinglish: 'Women ke liye emergency support aur suraksha',
    },
    timing: '24/7 | FREE',
    color: 'bg-pink-600',
    borderColor: 'border-pink-300',
  },
  {
    emoji: '👶',
    name: 'Childline',
    nameHindi: 'चाइल्डलाइन',
    number: '1098',
    desc: {
      hindi: 'बच्चों के लिए आपातकालीन सेवा — मदद और सुरक्षा',
      english: 'Emergency helpline for children — help and protection',
      hinglish: 'Bachon ke liye emergency helpline — help aur protection',
    },
    timing: '24/7 | FREE',
    color: 'bg-yellow-500',
    borderColor: 'border-yellow-300',
  },
  {
    emoji: '🧠',
    name: 'iCall — Mental Health',
    nameHindi: 'मानसिक स्वास्थ्य — iCall',
    number: '9152987821',
    desc: {
      hindi: 'TISS द्वारा मुफ्त मनोवैज्ञानिक परामर्श, हिंदी और अंग्रेजी में',
      english: 'Free psychological counselling by TISS, in Hindi & English',
      hinglish: 'Free counselling by TISS — Hindi aur English mein, confidential',
    },
    timing: 'Mon–Sat 8am–10pm | FREE',
    color: 'bg-purple-600',
    borderColor: 'border-purple-300',
  },
  {
    emoji: '💊',
    name: 'Vandrevala Foundation',
    nameHindi: 'मानसिक सहायता',
    number: '1860-2662-345',
    desc: {
      hindi: '24/7 मानसिक स्वास्थ्य सहायता — कभी भी कॉल करें',
      english: '24/7 mental health support — call anytime',
      hinglish: '24/7 mental health support — kabhi bhi call karein',
    },
    timing: '24/7 | FREE',
    color: 'bg-indigo-600',
    borderColor: 'border-indigo-300',
  },
  {
    emoji: '🏥',
    name: 'Health Helpline',
    nameHindi: 'स्वास्थ्य हेल्पलाइन',
    number: '104',
    desc: {
      hindi: 'सरकारी स्वास्थ्य सहायता और अस्पताल जानकारी',
      english: 'Government health support and hospital information',
      hinglish: 'Government health support aur hospital information',
    },
    timing: '24/7 | FREE',
    color: 'bg-teal-600',
    borderColor: 'border-teal-300',
  },
  {
    emoji: '🏛️',
    name: 'HRLN — Human Rights',
    nameHindi: 'मानवाधिकार कानून नेटवर्क',
    number: '011-24374501',
    desc: {
      hindi: 'मानवाधिकार कानून नेटवर्क — कैदियों के अधिकारों के लिए मुफ्त सहायता',
      english: 'Human Rights Law Network — free support for prisoner rights',
      hinglish: 'Prisoner rights ke liye free legal support',
    },
    timing: 'Mon–Fri office hours',
    color: 'bg-gray-700',
    borderColor: 'border-gray-400',
  },
  {
    emoji: '🆔',
    name: 'UIDAI — Aadhaar',
    nameHindi: 'आधार हेल्पलाइन',
    number: '1947',
    desc: {
      hindi: 'आधार कार्ड बनवाना, अपडेट या समस्या के लिए',
      english: 'For Aadhaar card creation, update, or issues',
      hinglish: 'Aadhaar card banwana ya update ke liye',
    },
    timing: 'Mon–Sat 7am–11pm | FREE',
    color: 'bg-orange-700',
    borderColor: 'border-orange-300',
  },
  {
    emoji: '💊',
    name: 'De-addiction Helpline',
    nameHindi: 'नशामुक्ति हेल्पलाइन',
    number: '14446',
    desc: {
      hindi: 'नशे की समस्या से मुक्ति के लिए राष्ट्रीय हेल्पलाइन',
      english: 'National helpline for de-addiction support',
      hinglish: 'Nasha chhodne mein madad ke liye national helpline',
    },
    timing: '24/7 | FREE',
    color: 'bg-lime-700',
    borderColor: 'border-lime-300',
  },
];

export default function Helpline() {
  const { language } = useApp();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-dvh bg-[#F0E8D5]">
      {/* Header */}
      <div className="theme-header px-4 pt-10 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/home')} className="text-2xl">←</button>
          <div className="text-3xl">📞</div>
          <div>
            <h1 className="font-extrabold text-xl">
              {t(language, {
                hindi: 'हेल्पलाइन नंबर',
                english: 'Helpline Numbers',
                hinglish: 'Helpline Numbers',
              })}
            </h1>
            <p className="text-orange-100 text-xs">
              {t(language, {
                hindi: 'किसी को भी कॉल करें — सब मुफ्त',
                english: 'Call anyone — all free',
                hinglish: 'Kisi ko bhi call karein — sab free',
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto content-shell py-4 space-y-3 pb-24">
        {/* Most important at top */}
        <h2 className="font-bold text-base text-gray-500 uppercase tracking-wide">
          {t(language, { hindi: '⭐ सबसे ज़रूरी', english: '⭐ Most Important', hinglish: '⭐ Sabse Zaroori' })}
        </h2>

        {helplines.filter(h => h.important).map((h, i) => (
          <a
            key={i}
            href={`tel:${h.number.replace(/[-\s]/g, '')}`}
            className={`helpline-card border-l-4 ${h.borderColor} premium-card`}
          >
            <div className={`${h.color} text-white w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0`}>
              {h.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-base text-gray-900">{h.name}</div>
              <div className="text-saffron-600 font-extrabold text-xl">{h.number}</div>
              <div className="text-gray-500 text-xs mt-0.5 leading-tight">{h.desc[language]}</div>
              {h.timing && (
                <div className="text-xs text-jade-600 font-semibold mt-1">⏰ {h.timing}</div>
              )}
            </div>
            <div className="text-green-500 text-2xl">📲</div>
          </a>
        ))}

        <h2 className="font-bold text-base text-gray-500 uppercase tracking-wide pt-2">
          {t(language, { hindi: '📞 सभी नंबर', english: '📞 All Numbers', hinglish: '📞 Saare Numbers' })}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {helplines.filter(h => !h.important).map((h, i) => (
            <a
              key={i}
              href={`tel:${h.number.replace(/[-\s]/g, '')}`}
              className={`helpline-card border-l-4 ${h.borderColor} premium-card`}
            >
              <div className={`${h.color} text-white w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0`}>
                {h.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-gray-900">{h.name}</div>
                <div className="text-gray-700 font-extrabold text-lg">{h.number}</div>
                <div className="text-gray-500 text-xs leading-tight">{h.desc[language]}</div>
                {h.timing && (
                  <div className="text-xs text-jade-600 font-medium mt-0.5">⏰ {h.timing}</div>
                )}
              </div>
              <div className="text-gray-300 text-lg">›</div>
            </a>
          ))}
        </div>

        {/* Save numbers prompt */}
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 mt-2">
          <p className="text-amber-800 font-semibold text-sm text-center">
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
          { icon: '🏗️', path: '/post-release', label: { hindi: 'बाद में', english: 'After', hinglish: 'Baad Mein' } },
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
