import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, t, Language } from '../context/AppContext';
import LangSwitcher from '../components/LangSwitcher';

interface CardContent {
  heading: { hindi: string; english: string; hinglish: string };
  items:   { hindi: string; english: string; hinglish: string }[];
  note?:   { hindi: string; english: string; hinglish: string };
}

interface Topic {
  id: string; emoji: string; color: string; bg: string;
  title: { hindi: string; english: string; hinglish: string };
  cards: CardContent[];
}

const TOPICS: Topic[] = [
  {
    id: 'doc-fields', emoji: '🗂️', color: '#0EA5E9', bg: 'rgba(14,165,233,0.12)',
    title: { hindi: 'डॉक्यूमेंट फील्ड गाइड', english: 'Document Field Guide', hinglish: 'Document Field Guide' },
    cards: [
      {
        heading: { hindi: 'FIR कॉपी में जरूरी फील्ड', english: 'Important FIR Fields', hinglish: 'FIR mein important fields' },
        items: [
          { hindi: 'FIR नंबर (उदाहरण: 123/2026)', english: 'FIR number (example: 123/2026)', hinglish: 'FIR number (example: 123/2026)' },
          { hindi: 'थाना/पुलिस स्टेशन का नाम', english: 'Police station name', hinglish: 'Police station ka naam' },
          { hindi: 'जिला और राज्य', english: 'District and state', hinglish: 'District aur state' },
          { hindi: 'तारीख और समय (घटना/रिपोर्ट)', english: 'Date and time (incident/report)', hinglish: 'Date/time (incident/report)' },
          { hindi: 'लागू धाराएं (IPC/BNSS)', english: 'Applied sections (IPC/BNSS)', hinglish: 'Applied sections (IPC/BNSS)' },
        ],
        note: { hindi: '💡 FIR की कॉपी हमेशा स्पष्ट फोटो/पीडीएफ में सेव रखें।', english: '💡 Keep a clear photo/PDF of FIR copy saved.', hinglish: '💡 FIR copy ka clear photo/PDF save rakho.' },
      },
      {
        heading: { hindi: 'चार्जशीट/कोर्ट पेपर में क्या भरें', english: 'What to Track in Chargesheet/Court Papers', hinglish: 'Chargesheet/Court papers mein kya track karein' },
        items: [
          { hindi: 'केस नंबर और कोर्ट का नाम', english: 'Case number and court name', hinglish: 'Case number aur court name' },
          { hindi: 'गिरफ्तारी तारीख और कस्टडी अवधि', english: 'Arrest date and custody duration', hinglish: 'Arrest date aur custody duration' },
          { hindi: 'अगली सुनवाई की तारीख', english: 'Next hearing date', hinglish: 'Next hearing date' },
          { hindi: 'वकील का नाम और संपर्क', english: 'Lawyer name and contact', hinglish: 'Lawyer name aur contact' },
        ],
      },
    ],
  },
  {
    id: 'arrest', emoji: '🚨', color: '#DC2626', bg: 'rgba(248,113,113,0.12)',
    title: { hindi: 'गिरफ्तारी के अधिकार', english: 'Rights When Arrested', hinglish: 'Arrest Hone Par Haq' },
    cards: [
      {
        heading: { hindi: 'गिरफ्तारी के समय आपके अधिकार', english: 'Your Rights at Arrest', hinglish: 'Arrest ke waqt aapke rights' },
        items: [
          { hindi: 'गिरफ्तारी का कारण बताया जाना ज़रूरी है।', english: 'Police must tell you why you are being arrested.', hinglish: 'Arrest ka karan batana zaroori hai.' },
          { hindi: 'किसी रिश्तेदार या दोस्त को सूचित करने का अधिकार।', english: 'Right to inform a relative or friend.', hinglish: 'Family ya dost ko inform karne ka haq.' },
          { hindi: 'वकील से मिलने का अधिकार (अनुच्छेद 22, संविधान)।', english: 'Right to consult a lawyer (Article 22, Constitution).', hinglish: 'Vakeel se milne ka haq — Article 22.' },
          { hindi: '24 घंटे के अंदर Magistrate के सामने पेश होना ज़रूरी।', english: 'Must be produced before a Magistrate within 24 hours.', hinglish: '24 ghante ke andar Magistrate ke saamne.' },
          { hindi: 'जमानती मामले में पुलिस बिना वारंट तलाशी नहीं ले सकती।', english: 'Police cannot search without warrant in bailable offences.', hinglish: 'Bailable case mein bina warrant search nahi.' },
        ],
      },
      {
        heading: { hindi: 'पुलिस हिरासत में क्या न करें', english: 'What NOT to Do in Custody', hinglish: 'Custody Mein Kya Mat Karein' },
        items: [
          { hindi: 'पुलिस को कोई बयान मत दें — अदालत में मान्य नहीं होता।', english: 'Do NOT confess to police — it is NOT valid in court.', hinglish: 'Police ko confession mat do — court mein valid nahi.' },
          { hindi: 'बिना पढ़े किसी दस्तावेज पर हस्ताक्षर मत करें।', english: 'Do NOT sign documents without reading them.', hinglish: 'Bina padhe koi document sign mat karo.' },
          { hindi: 'शांत रहें — गुस्से में स्थिति बिगड़ सकती है।', english: 'Stay calm — anger can make things worse.', hinglish: 'Shant raho — gussa situation bigaad sakta hai.' },
        ],
        note: { hindi: '💡 पुलिस को दिया कबूलनामा अदालत में साक्ष्य नहीं माना जाता (Section 25 Evidence Act)।', english: '💡 Police confession is NOT evidence in court (Section 25 Evidence Act).', hinglish: '💡 Police confession = court mein evidence nahi (Section 25 Evidence Act).' },
      },
    ],
  },
  {
    id: 'bail', emoji: '🔓', color: '#B8521E', bg: 'rgba(207,120,89,0.14)',
    title: { hindi: 'जमानत (Bail)', english: 'Bail', hinglish: 'Bail / Zamaanat' },
    cards: [
      {
        heading: { hindi: 'जमानत के प्रकार', english: 'Types of Bail', hinglish: 'Bail ke Prakar' },
        items: [
          { hindi: 'धारा 436 — जमानती अपराध: जमानत आपका अधिकार है, मना नहीं हो सकती।', english: 'Section 436 — Bailable: Bail is your RIGHT, cannot be denied.', hinglish: 'Section 436 — Bailable: Bail aapka haq, mana nahi ho sakta.' },
          { hindi: 'धारा 437 — गैर-जमानती: Magistrate के विवेक पर।', english: 'Section 437 — Non-bailable: At Magistrate\'s discretion.', hinglish: 'Section 437 — Non-bailable: Magistrate ki marzi.' },
          { hindi: 'धारा 438 — अग्रिम जमानत: गिरफ्तारी से पहले।', english: 'Section 438 — Anticipatory bail: Before arrest.', hinglish: 'Section 438 — Anticipatory bail: Arrest se pehle.' },
          { hindi: 'धारा 439 — High Court/Sessions Court से जमानत।', english: 'Section 439 — Bail from Sessions/High Court.', hinglish: 'Section 439 — Sessions/High Court se bail.' },
        ],
      },
      {
        heading: { hindi: 'डिफ़ॉल्ट जमानत — ज़रूर जानें', english: 'Default Bail — Very Important', hinglish: 'Default Bail — Bahut Zaroori' },
        items: [
          { hindi: '60 दिन में चार्जशीट नहीं आई? जमानत का हक मिलता है।', english: 'No chargesheet in 60 days? You are entitled to bail.', hinglish: '60 din mein chargesheet nahi? Bail ka haq milta hai.' },
          { hindi: 'गंभीर मामलों में 90 दिन।', english: '90 days for serious cases.', hinglish: 'Serious case mein 90 din.' },
          { hindi: 'यह जमानत खुद नहीं मिलती — अदालत में आवेदन करना होगा।', english: 'This bail doesn\'t come automatically — you must apply in court.', hinglish: 'Khud se nahi milti — court mein apply karna padega.' },
        ],
        note: { hindi: '💡 NALSA को कॉल करें: 1516 — मुफ्त वकील देंगे।', english: '💡 Call NALSA: 1516 — Free lawyer for default bail.', hinglish: '💡 NALSA call karo: 1516 — Free vakeel milega.' },
      },
      {
        heading: { hindi: 'जमानत मिलने के मज़बूत आधार', english: 'Strong Grounds for Bail', hinglish: 'Bail ke Strong Grounds' },
        items: [
          { hindi: 'पहला अपराध — कोई आपराधिक रिकॉर्ड नहीं।', english: 'First offence — no criminal record.', hinglish: 'Pehla offense — criminal record nahi.' },
          { hindi: 'परिवार, नौकरी, घर — भागने का कोई कारण नहीं।', english: 'Family, job, home — no reason to flee.', hinglish: 'Family, naukri, ghar — bhaagne ka koi reason nahi.' },
          { hindi: 'लंबे समय से जेल में (बिना ट्रायल)।', english: 'Long custody without trial.', hinglish: 'Kaafi time se jail mein, trial shuru nahi.' },
          { hindi: 'बीमारी या चिकित्सा स्थिति।', english: 'Medical condition or serious illness.', hinglish: 'Bimari ya medical condition.' },
        ],
      },
    ],
  },
  {
    id: 'fir', emoji: '📋', color: '#1D4ED8', bg: 'rgba(96,165,250,0.12)',
    title: { hindi: 'FIR — प्रथम सूचना रिपोर्ट', english: 'FIR — First Information Report', hinglish: 'FIR kya hoti hai' },
    cards: [
      {
        heading: { hindi: 'FIR क्या है?', english: 'What is an FIR?', hinglish: 'FIR kya hoti hai?' },
        items: [
          { hindi: 'FIR किसी संज्ञेय अपराध की पुलिस को दी गई पहली सूचना है।', english: 'FIR is the first report of a cognizable offence given to police.', hinglish: 'FIR cognizable offense ki police ko di gayi pehli information hai.' },
          { hindi: 'FIR की एक प्रति पाना आपका अधिकार है — मुफ्त।', english: 'Getting a copy of FIR is your RIGHT — completely free.', hinglish: 'FIR ki copy aapka haq hai — bilkul free.' },
          { hindi: 'FIR पुलिस स्टेशन या अदालत से मिल सकती है।', english: 'FIR can be obtained from police station or court.', hinglish: 'FIR police station ya court se milti hai.' },
        ],
      },
      {
        heading: { hindi: 'FIR में क्या देखें?', english: 'What to Check in FIR?', hinglish: 'FIR mein kya check karein?' },
        items: [
          { hindi: 'धाराएं (Sections): IPC/BNSS की कौन सी धाराएं लगाई गई हैं।', english: 'Sections: Which IPC/BNSS sections are mentioned.', hinglish: 'Sections: Kaun si IPC/BNSS sections layi gayi hain.' },
          { hindi: 'अपराध की तारीख और समय।', english: 'Date and time of alleged offence.', hinglish: 'Offense ki date aur time.' },
          { hindi: 'FIR दर्ज करने में देरी — आरोपी के पक्ष में जा सकती है।', english: 'Delay in FIR filing weakens the prosecution case.', hinglish: 'FIR file karne mein der — accused ke favor mein hoti hai.' },
        ],
      },
      {
        heading: { hindi: 'झूठी FIR को कैसे चुनौती दें', english: 'How to Challenge a False FIR', hinglish: 'Jhoothi FIR challenge karna' },
        items: [
          { hindi: 'High Court में धारा 482 CrPC के तहत FIR रद्द कराई जा सकती है।', english: 'FIR can be quashed in High Court under Section 482 CrPC.', hinglish: 'High Court mein Section 482 ke under FIR quash ho sakti hai.' },
          { hindi: 'SP/SSP को शिकायत करें।', english: 'File a complaint with SP/SSP.', hinglish: 'SP ya SSP ko complaint do.' },
        ],
        note: { hindi: '💡 NALSA (1516) से मुफ्त वकील माँगें।', english: '💡 Ask for a free lawyer from NALSA (1516).', hinglish: '💡 NALSA (1516) se free vakeel maango.' },
      },
    ],
  },
  {
    id: 'sections', emoji: '⚖️', color: '#6D28D9', bg: 'rgba(167,139,250,0.12)',
    title: { hindi: 'आम धाराएं (IPC)', english: 'Common IPC Sections', hinglish: 'Common IPC Sections' },
    cards: [
      {
        heading: { hindi: 'जमानती अपराध (Bailable)', english: 'Bailable — Bail is a Right', hinglish: 'Bailable — Bail aapka haq' },
        items: [
          { hindi: 'धारा 323 — मारपीट: 1 साल, जमानती।', english: 'Section 323 — Simple hurt: 1 year, BAILABLE.', hinglish: 'Section 323 — Marpeet: 1 saal, BAILABLE.' },
          { hindi: 'धारा 341 — गलत तरीके से रोकना: 1 महीना, जमानती।', english: 'Section 341 — Wrongful restraint: 1 month, BAILABLE.', hinglish: 'Section 341 — Rokna: 1 mahina, BAILABLE.' },
          { hindi: 'धारा 504 — जान-बूझकर अपमान: 2 साल, जमानती।', english: 'Section 504 — Intentional insult: 2 years, BAILABLE.', hinglish: 'Section 504 — Insult: 2 saal, BAILABLE.' },
          { hindi: 'धारा 506 — धमकी देना: 2 साल, जमानती।', english: 'Section 506 — Criminal intimidation: 2 years, BAILABLE.', hinglish: 'Section 506 — Dhamki: 2 saal, BAILABLE.' },
        ],
      },
      {
        heading: { hindi: 'गैर-जमानती अपराध (Non-Bailable)', english: 'Non-Bailable — Serious Charges', hinglish: 'Non-Bailable — Serious hain' },
        items: [
          { hindi: 'धारा 302 — हत्या: आजीवन/मृत्युदंड, गैर-जमानती।', english: 'Section 302 — Murder: Life/death, NON-BAILABLE.', hinglish: 'Section 302 — Hatyaa: Umar qaid ya maut, NON-BAILABLE.' },
          { hindi: 'धारा 307 — हत्या का प्रयास: 10 साल, गैर-जमानती।', english: 'Section 307 — Attempt to murder: 10 years, NON-BAILABLE.', hinglish: 'Section 307 — Murder ki koshish: 10 saal, NON-BAILABLE.' },
          { hindi: 'धारा 420 — धोखाधड़ी: 7 साल, गैर-जमानती।', english: 'Section 420 — Cheating/fraud: 7 years, NON-BAILABLE.', hinglish: 'Section 420 — Fraud: 7 saal, NON-BAILABLE.' },
          { hindi: 'धारा 498A — पत्नी के साथ क्रूरता: 3 साल, संज्ञेय।', english: 'Section 498A — Cruelty to wife: 3 years, cognizable.', hinglish: 'Section 498A — Biwi se zulm: 3 saal, cognizable.' },
        ],
      },
    ],
  },
  {
    id: 'court', emoji: '🏛️', color: '#0F766E', bg: 'rgba(52,211,153,0.11)',
    title: { hindi: 'अदालती प्रक्रिया', english: 'Court Process', hinglish: 'Court ka Process' },
    cards: [
      {
        heading: { hindi: 'केस का क्रम', english: 'Flow of a Criminal Case', hinglish: 'Case ka Step-by-Step' },
        items: [
          { hindi: '1. FIR दर्ज होती है।', english: '1. FIR is filed.', hinglish: '1. FIR file hoti hai.' },
          { hindi: '2. पुलिस जाँच करती है।', english: '2. Police investigates.', hinglish: '2. Police investigation karti hai.' },
          { hindi: '3. चार्जशीट (60-90 दिन में) दाखिल होती है।', english: '3. Chargesheet filed (within 60-90 days).', hinglish: '3. Chargesheet file hoti hai (60-90 din mein).' },
          { hindi: '4. अदालत में आरोप तय होते हैं।', english: '4. Charges are framed in court.', hinglish: '4. Court mein charges frame hote hain.' },
          { hindi: '5. सुनवाई (Trial) होती है, फिर फ़ैसला।', english: '5. Trial happens, then judgment.', hinglish: '5. Trial hota hai, phir judgment.' },
        ],
      },
      {
        heading: { hindi: 'मुफ्त कानूनी सहायता', english: 'Free Legal Aid', hinglish: 'Free Legal Help' },
        items: [
          { hindi: 'NALSA (1516): 24/7, बिल्कुल मुफ्त।', english: 'NALSA (1516): 24/7, completely free.', hinglish: 'NALSA (1516): 24/7, free.' },
          { hindi: 'DLSA: हर जिले में मुफ्त वकील।', english: 'DLSA: Free lawyers in every district.', hinglish: 'DLSA: Har district mein free vakeel.' },
          { hindi: 'कुंजी हेल्पलाइन: 1800-313-4963 — रोज 8am–11pm।', english: 'Kunji Helpline: 1800-313-4963 — Daily 8am–11pm.', hinglish: 'Kunji: 1800-313-4963 — Daily 8am–11pm.' },
        ],
      },
    ],
  },
  {
    id: 'release', emoji: '🏠', color: '#15803D', bg: 'rgba(74,222,128,0.11)',
    title: { hindi: 'रिहाई के बाद', english: 'After Release', hinglish: 'Jail se Baad' },
    cards: [
      {
        heading: { hindi: 'ज़रूरी दस्तावेज़', english: 'Essential Documents', hinglish: 'Zaroori Documents' },
        items: [
          { hindi: 'आधार कार्ड: UIDAI (1947) — नज़दीकी enrollment center।', english: 'Aadhaar Card: UIDAI (1947) — nearest enrollment center.', hinglish: 'Aadhaar: UIDAI (1947) — nearest center.' },
          { hindi: 'PAN Card: NSDL online या Income Tax office।', english: 'PAN Card: NSDL online or Income Tax office.', hinglish: 'PAN Card: NSDL online ya IT office.' },
          { hindi: 'Jan Dhan Bank Account: किसी भी बैंक में — zero balance।', english: 'Jan Dhan Bank Account: Any bank — zero balance required.', hinglish: 'Jan Dhan Account: Kisi bhi bank — zero balance.' },
        ],
        note: { hindi: '💡 कुंजी हेल्पलाइन 1800-313-4963 इन सब में मदद करेगा।', english: '💡 Kunji Helpline 1800-313-4963 can help with all of these.', hinglish: '💡 Kunji 1800-313-4963 in sab mein guide karega.' },
      },
      {
        heading: { hindi: 'नौकरी और कौशल', english: 'Jobs & Skills', hinglish: 'Naukri aur Skills' },
        items: [
          { hindi: 'ETASHA Society (011-41627070): मुफ्त training और placement।', english: 'ETASHA Society (011-41627070): Free training & placement.', hinglish: 'ETASHA (011-41627070): Free training aur placement.' },
          { hindi: 'Skill India / PMKVY: सरकारी मुफ्त certificate — 1800-123-9626।', english: 'Skill India / PMKVY: Free certificate — 1800-123-9626.', hinglish: 'Skill India/PMKVY: Free certificate — 1800-123-9626.' },
          { hindi: 'India Vision Foundation (0120-2774600): पूर्व कैदियों के लिए।', english: 'India Vision Foundation (0120-2774600): Specifically for ex-prisoners.', hinglish: 'India Vision Foundation (0120-2774600): Ex-prisoners ke liye.' },
        ],
      },
    ],
  },
  {
    id: 'mental', emoji: '🧠', color: '#7C3AED', bg: 'rgba(216,180,254,0.11)',
    title: { hindi: 'मानसिक स्वास्थ्य', english: 'Mental Health', hinglish: 'Mental Health' },
    cards: [
      {
        heading: { hindi: 'मदद के लिए संपर्क करें', english: 'Reach Out for Help', hinglish: 'Madad ke liye call karein' },
        items: [
          { hindi: 'iCall (TISS): 9152987821 — मुफ्त परामर्श, हिंदी में — सोम–शनि 8am–10pm।', english: 'iCall (TISS): 9152987821 — Free Hindi counselling — Mon–Sat 8am–10pm.', hinglish: 'iCall (TISS): 9152987821 — Free Hindi counselling.' },
          { hindi: 'Vandrevala Foundation: 1860-2662-345 — 24/7, मुफ्त।', english: 'Vandrevala Foundation: 1860-2662-345 — 24/7, Free.', hinglish: 'Vandrevala: 1860-2662-345 — 24/7, Free.' },
          { hindi: 'NIMHANS: 080-46110007 — राष्ट्रीय मानसिक स्वास्थ्य संस्थान।', english: 'NIMHANS: 080-46110007 — National Mental Health Institute.', hinglish: 'NIMHANS: 080-46110007.' },
        ],
        note: { hindi: '🚨 खुद को नुकसान पहुंचाने के विचार आ रहे हैं? तुरंत iCall या Vandrevala को फोन करें।', english: '🚨 Thoughts of harming yourself? Call iCall or Vandrevala IMMEDIATELY.', hinglish: '🚨 Khud ko hurt karne ke thoughts? TURANT call karo iCall ya Vandrevala.' },
      },
    ],
  },
];

const NAV = [
  { icon: '🏠', path: '/home',       label: { hindi: 'होम',      english: 'Home',     hinglish: 'Home'     } },
  { icon: '⚖️', path: '/chat',       label: { hindi: 'मदद',      english: 'Chat',     hinglish: 'Chat'     } },
  { icon: '📖', path: '/manual',     label: { hindi: 'गाइड',     english: 'Guide',    hinglish: 'Guide'    } },
  { icon: '🎙️', path: '/voice-guide',label: { hindi: 'वॉइस',     english: 'Voice',    hinglish: 'Voice'    } },
  { icon: '📞', path: '/helpline',   label: { hindi: 'हेल्पलाइन', english: 'Helpline', hinglish: 'Helpline' } },
];

export default function Manual() {
  const { language } = useApp();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Topic | null>(null);

  /* ── TOPIC GRID VIEW ── */
  if (!selected) {
    return (
      <div className="flex flex-col h-dvh xl:h-full overflow-hidden" style={{ background: 'var(--c-bg)' }}>
        {/* Header */}
        <div className="theme-header px-4 pt-10 pb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/home')}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm">←</button>
            <div className="flex-1">
              <h1 className="font-extrabold text-base text-white leading-tight">
                {t(language, { hindi: '📖 कानूनी गाइड', english: '📖 Legal Guide', hinglish: '📖 Legal Guide' })}
              </h1>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {t(language, { hindi: 'एक विषय चुनें', english: 'Tap a topic to learn', hinglish: 'Ek topic chunein' })}
              </p>
            </div>
            <LangSwitcher dark />
          </div>
        </div>

        {/* Topic grid */}
        <div className="flex-1 overflow-y-auto px-4 py-5 pb-24">
          <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
            {TOPICS.map((tp) => (
              <button
                key={tp.id}
                onClick={() => setSelected(tp)}
                className="rounded-2xl p-5 text-left flex flex-col gap-3 active:scale-95 transition-all"
                style={{
                  background: 'var(--c-surface)',
                  border: `1px solid var(--c-border)`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                }}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ background: tp.bg }}>
                  {tp.emoji}
                </div>
                <div>
                  <div className="font-extrabold text-sm leading-tight" style={{ color: 'var(--c-heading)' }}>
                    {tp.title[language as Language]}
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'var(--c-label)' }}>
                    {tp.cards.reduce((n, c) => n + c.items.length, 0)} {t(language, { hindi: 'बातें', english: 'points', hinglish: 'points' })}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom nav */}
        <div className="bottom-nav">
          {NAV.map((item) => (
            <button key={item.path} onClick={() => navigate(item.path)}
              className={`flex-1 flex flex-col items-center py-3 gap-0.5 text-xs font-semibold transition-colors
                         ${item.path === '/manual' ? 'nav-item-active' : 'nav-item-inactive'}`}>
              <span className="text-xl">{item.icon}</span>
              <span>{item.label[language as Language]}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ── TOPIC DETAIL VIEW ── */
  return (
    <div className="flex flex-col h-dvh xl:h-full overflow-hidden" style={{ background: 'var(--c-bg)' }}>
      {/* Header */}
      <div className="theme-header px-4 pt-10 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelected(null)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm">←</button>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: `${selected.color}22` }}>
            {selected.emoji}
          </div>
          <div className="flex-1">
            <h1 className="font-extrabold text-sm text-white leading-tight">
              {selected.title[language as Language]}
            </h1>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.40)' }}>
              {t(language, { hindi: 'वापस जाएं ←', english: '← Back to topics', hinglish: '← Wapas jaao' })}
            </p>
          </div>
          <LangSwitcher dark />
        </div>
      </div>

      {/* Content — all cards as a simple flat list, no accordion */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-24 max-w-lg mx-auto w-full">
        {selected.cards.map((card, ci) => (
          <div key={ci}>
            {/* Section heading */}
            <p className="text-xs font-extrabold uppercase tracking-widest mb-3 px-1"
              style={{ color: selected.color }}>
              {card.heading[language as Language]}
            </p>

            {/* Items */}
            <div className="space-y-2">
              {card.items.map((item, ii) => (
                <div key={ii} className="flex gap-3 rounded-2xl px-4 py-3"
                  style={{ background: 'var(--c-surface)', border: '1px solid var(--c-border)' }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0 mt-0.5"
                    style={{ background: `${selected.color}18`, color: selected.color }}>
                    {ii + 1}
                  </span>
                  <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--c-text)' }}>
                    {item[language as Language]}
                  </p>
                </div>
              ))}
            </div>

            {/* Note box */}
            {card.note && (
              <div className="rounded-2xl px-4 py-3 mt-2"
                style={{ background: `${selected.color}10`, border: `1px solid ${selected.color}22` }}>
                <p className="text-sm font-semibold leading-relaxed" style={{ color: selected.color }}>
                  {card.note[language as Language]}
                </p>
              </div>
            )}
          </div>
        ))}

        {/* Ask AI CTA */}
        <button onClick={() => navigate('/chat')}
          className="w-full rounded-2xl p-4 flex items-center gap-3 active:scale-[0.98] transition-all"
          style={{ background: 'var(--c-primary-l)', border: '1px solid rgba(207,120,89,0.25)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: 'var(--c-primary)', color: 'white' }}>⚖️</div>
          <div className="flex-1 text-left">
            <p className="font-extrabold text-sm" style={{ color: 'var(--c-primary)' }}>
              {t(language, { hindi: 'और सवाल हैं? AI से पूछें', english: 'More questions? Ask AI', hinglish: 'Aur sawaal? AI se puchein' })}
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--c-muted)' }}>
              {t(language, { hindi: 'अपनी स्थिति बताएं — तुरंत जवाब', english: 'Describe your case — instant answer', hinglish: 'Apni situation batao — turant jawab' })}
            </p>
          </div>
          <span style={{ color: 'var(--c-primary)', fontWeight: 700 }}>→</span>
        </button>
      </div>

      {/* Bottom nav */}
      <div className="bottom-nav">
        {NAV.map((item) => (
          <button key={item.path} onClick={() => { if (item.path === '/manual') setSelected(null); else navigate(item.path); }}
            className={`flex-1 flex flex-col items-center py-3 gap-0.5 text-xs font-semibold transition-colors
                       ${item.path === '/manual' ? 'nav-item-active' : 'nav-item-inactive'}`}>
            <span className="text-xl">{item.icon}</span>
            <span>{item.label[language as Language]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
