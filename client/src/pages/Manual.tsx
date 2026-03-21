import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp, t, Language } from '../context/AppContext';
import {
  Scale,
  BookOpen,
  House,
  Mic,
  Phone,
  FolderKanban,
  Siren,
  LockOpen,
  FileText,
  Landmark,
  Brain,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
} from 'lucide-react';


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
    id: 'doc-fields', emoji: 'doc-fields', color: '#0EA5E9', bg: 'rgba(14,165,233,0.12)',
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
    id: 'arrest', emoji: 'arrest', color: '#DC2626', bg: 'rgba(248,113,113,0.12)',
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
    id: 'bail', emoji: 'bail', color: '#B8521E', bg: 'rgba(207,120,89,0.14)',
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
    id: 'fir', emoji: 'fir', color: '#1D4ED8', bg: 'rgba(96,165,250,0.12)',
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
    id: 'sections', emoji: 'sections', color: '#6D28D9', bg: 'rgba(167,139,250,0.12)',
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
    id: 'court', emoji: 'court', color: '#0F766E', bg: 'rgba(52,211,153,0.11)',
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
    id: 'release', emoji: 'release', color: '#15803D', bg: 'rgba(74,222,128,0.11)',
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
    id: 'mental', emoji: 'mental', color: '#7C3AED', bg: 'rgba(216,180,254,0.11)',
    title: { hindi: 'मानसिक स्वास्थ्य', english: 'Mental Health', hinglish: 'Mental Health' },
    cards: [
      {
        heading: { hindi: 'मदद के लिए संपर्क करें', english: 'Reach Out for Help', hinglish: 'Madad ke liye call karein' },
        items: [
          { hindi: 'iCall (TISS): 9152987821 — मुफ्त परामर्श, हिंदी में — सोम–शनि 8am–10pm।', english: 'iCall (TISS): 9152987821 — Free Hindi counselling — Mon–Sat 8am–10pm.', hinglish: 'iCall (TISS): 9152987821 — Free Hindi counselling.' },
          { hindi: 'Vandrevala Foundation: 1860-2662-345 — 24/7, मुफ्त।', english: 'Vandrevala Foundation: 1860-2662-345 — 24/7, Free.', hinglish: 'Vandrevala: 1860-2662-345 — 24/7, Free.' },
          { hindi: 'NIMHANS: 080-46110007 — राष्ट्रीय मानसिक स्वास्थ्य संस्थान।', english: 'NIMHANS: 080-46110007 — National Mental Health Institute.', hinglish: 'NIMHANS: 080-46110007.' },
        ],
        note: { hindi: 'खुद को नुकसान पहुंचाने के विचार आ रहे हैं? तुरंत iCall या Vandrevala को फोन करें।', english: 'Thoughts of harming yourself? Call iCall or Vandrevala IMMEDIATELY.', hinglish: 'Khud ko hurt karne ke thoughts? TURANT call karo iCall ya Vandrevala.' },
      },
    ],
  },
];

const NAV = [
  { Icon: Scale, path: '/chat',       label: { hindi: 'मदद',      english: 'Chat',     hinglish: 'Chat'     } },
  { Icon: BookOpen, path: '/manual',     label: { hindi: 'गाइड',     english: 'Guide',    hinglish: 'Guide'    } },
  { Icon: House, path: '/home',       label: { hindi: 'होम',      english: 'Home',     hinglish: 'Home'     } },
  { Icon: Mic, path: '/voice-guide',label: { hindi: 'वॉइस',     english: 'Voice',    hinglish: 'Voice'    } },
  { Icon: Phone, path: '/helpline',   label: { hindi: 'हेल्पलाइन', english: 'Helpline', hinglish: 'Helpline' } },
];

const DESKTOP_GRID =
  "min-h-0 lg:mx-auto lg:grid lg:w-full lg:max-w-[min(105rem,100%)] lg:grid-cols-[minmax(0,1fr)_minmax(19rem,26rem)] lg:gap-6 lg:px-12 lg:pb-8 2xl:max-w-[min(112rem,100%)] 2xl:px-14";

const ASIDE_CLASS =
  "sticky top-24 mt-4 hidden max-h-[min(720px,calc(100dvh-6rem))] min-h-0 w-full flex-col gap-4 self-start overflow-y-auto rounded-2xl border p-4 lg:mt-6 lg:flex";

export default function Manual() {
  const { language } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [selected, setSelected] = useState<Topic | null>(null);
  const [showAllTopics, setShowAllTopics] = useState(false);
  const [isLgUp, setIsLgUp] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => setIsLgUp(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const visibleTopics =
    showAllTopics || isLgUp ? TOPICS : TOPICS.slice(0, 6);

  const guideGridSteps = [
    t(language, {
      hindi: "नीचे से वह विषय चुनें जो आपकी ज़रूरत से मेल खाता हो।",
      english: "Choose the topic that matches what you need to understand.",
      hinglish: "Neeche se woh topic chuno jo aapki zarurat ho.",
    }),
    t(language, {
      hindi: "हर विषय में छोटे-छोटे पॉइंट — धीरे-धीरे पढ़ें।",
      english: "Each topic uses short points — read at your own pace.",
      hinglish: "Har topic mein chhote points — aaram se padho.",
    }),
    t(language, {
      hindi: "गहरा सवाल हो तो लीगल हेल्प चैट या हेल्पलाइन इस्तेमाल करें।",
      english: "For deeper questions, use Legal Help chat or the helpline page.",
      hinglish: "Gehra sawaal ho to Legal Help chat ya helpline use karo.",
    }),
  ];

  const guideDetailSteps = [
    t(language, {
      hindi: "नीचे दिए पॉइंट ध्यान से पढ़ें — ये सामान्य जानकारी है, वकील की जगह नहीं।",
      english: "Read the points below — this is general information, not legal advice.",
      hinglish: "Neeche points padho — yeh general info hai, vakeel ki jagah nahi.",
    }),
    t(language, {
      hindi: "दूसरा विषय देखने के लिए वापस जाएँ; बड़ी स्क्रीन पर दाएँ सूची से भी बदल सकते हैं।",
      english: "Go back to switch topics; on large screens you can also use the list on the right.",
      hinglish: "Topic badalne ke liye wapas jao; badi screen par right list bhi use kar sakte ho.",
    }),
    t(language, {
      hindi: "संदेह हो तो AI चैट में अपनी भाषा में पूछें।",
      english: "If unsure, ask in your own language in AI chat.",
      hinglish: "Confusion ho to AI chat mein apni bhasha mein pucho.",
    }),
  ];
  const topicIcon = (emoji: string) => {
    const map: Record<string, any> = {
      "doc-fields": FolderKanban,
      "arrest": Siren,
      "bail": LockOpen,
      "fir": FileText,
      "sections": Scale,
      "court": Landmark,
      "release": House,
      "mental": Brain,
    };
    return map[emoji] ?? BookOpen;
  };

  /* ── TOPIC GRID VIEW ── */
  if (!selected) {
    return (
      <div
        className="manual-page h-dvh min-h-0 overflow-y-auto lg:min-h-0 lg:flex-1"
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
              <ArrowLeft size={20} />
            </button>
            <div className="text-3xl" style={{ color: "#FAF7F4" }}>
              <BookOpen size={26} />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-white">
                {t(language, { hindi: "कानूनी गाइड", english: "Legal Guide", hinglish: "Legal Guide" })}
              </h1>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.58)" }}>
                {t(language, { hindi: "एक विषय चुनें", english: "Tap a topic to learn", hinglish: "Ek topic chunein" })}
              </p>
            </div>
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
                <div className="section-header-row">
                  <div>
                    <p className="mb-1 text-xs font-bold uppercase tracking-wide lg:text-sm" style={{ color: "var(--c-label)" }}>
                      {t(language, {
                        hindi: "सभी विषय",
                        english: "All topics",
                        hinglish: "Saare topics",
                      })}
                    </p>
                    <p className="section-helper lg:text-base">
                      {t(language, {
                        hindi: "कम शब्दों में सीखें। जरूरत हो तो और विषय खोलें।",
                        english: "Learn in simple points. Open more topics if needed.",
                        hinglish: "Simple points mein seekhein. Zarurat ho to aur topics kholen.",
                      })}
                    </p>
                  </div>
                  {TOPICS.length > 6 && !isLgUp && (
                    <button
                      type="button"
                      onClick={() => setShowAllTopics((v) => !v)}
                      className="see-more-btn inline-flex items-center gap-1"
                      aria-label={showAllTopics ? "Show less" : "More topics"}
                    >
                      {showAllTopics ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="content-shell space-y-4 py-4 pb-28 lg:!max-w-none lg:mx-0 lg:space-y-6 lg:px-0 lg:py-6 lg:pb-8">
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-5 xl:grid-cols-3">
                {visibleTopics.map((tp) => {
                  const Icon = topicIcon(tp.emoji);
                  return (
                    <button
                      key={tp.id}
                      type="button"
                      onClick={() => setSelected(tp)}
                      className="flex flex-col gap-3 rounded-2xl p-5 text-left transition-all active:scale-95 lg:p-6"
                      style={{
                        background: "var(--c-surface)",
                        border: `1px solid var(--c-border)`,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
                      }}
                    >
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl lg:h-14 lg:w-14"
                        style={{ background: tp.bg }}
                      >
                        <Icon className="h-[22px] w-[22px] lg:h-6 lg:w-6" strokeWidth={2} />
                      </div>
                      <div>
                        <div className="text-sm font-extrabold leading-tight lg:text-base" style={{ color: "var(--c-heading)" }}>
                          {tp.title[language as Language]}
                        </div>
                        <div className="mt-1 text-xs" style={{ color: "var(--c-label)" }}>
                          {tp.cards.reduce((n, c) => n + c.items.length, 0)}{" "}
                          {t(language, { hindi: "बातें", english: "points", hinglish: "points" })}
                        </div>
                      </div>
                    </button>
                  );
                })}
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
              hindi: "कदम और मदद",
              english: "Steps and help",
              hinglish: "Steps aur help",
            })}
          >
            <div>
              <p className="section-label">
                {t(language, { hindi: "आपके कदम", english: "Your steps", hinglish: "Aapke steps" })}
              </p>
              <ol className="mt-2 list-none space-y-2.5 p-0">
                {guideGridSteps.map((text, idx) => (
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
                {t(language, { hindi: "AI व कानूनी मदद", english: "AI & legal help", hinglish: "AI aur legal help" })}
              </p>
              <p className="mt-1 text-xs font-medium leading-relaxed lg:mt-2 lg:text-sm" style={{ color: "var(--c-primary)" }}>
                {t(language, {
                  hindi: "किसी भी विषय पर गहरा सवाल? लीगल हेल्प चैट खोलें।",
                  english: "Deeper questions on any topic? Open Legal Help chat.",
                  hinglish: "Gehra sawaal? Legal Help chat kholo.",
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
          {NAV.map((item) => (
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

  /* ── TOPIC DETAIL VIEW ── */
  const SelectedIcon = topicIcon(selected.emoji);
  const otherTopics = TOPICS.filter((tp) => tp.id !== selected.id);

  return (
    <div
      className="manual-page h-dvh min-h-0 overflow-y-auto lg:min-h-0 lg:flex-1"
      style={{ background: "var(--c-bg)" }}
    >
      <div className="theme-header px-4 pb-4 pt-10 lg:hidden">
        <div className="mb-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="text-2xl"
            style={{ color: "rgba(255,255,255,0.78)" }}
            aria-label={t(language, { hindi: "विषय सूची", english: "Back to topics", hinglish: "Topics wapas" })}
          >
            <ArrowLeft size={20} />
          </button>
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg"
            style={{ background: `${selected.color}22` }}
          >
            <SelectedIcon className="h-[18px] w-[18px]" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-extrabold leading-tight text-white">
              {selected.title[language as Language]}
            </h1>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.58)" }}>
              {t(language, { hindi: "वापस सभी विषयों पर", english: "Back to all topics", hinglish: "Saare topics par wapas" })}
            </p>
          </div>
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
          <div className="content-shell space-y-4 py-4 pb-28 lg:!max-w-none lg:mx-0 lg:space-y-6 lg:px-0 lg:py-6 lg:pb-8">
            {selected.cards.map((card, ci) => (
              <div key={ci}>
                <p
                  className="mb-3 px-1 text-xs font-extrabold uppercase tracking-widest lg:mb-4 lg:text-sm"
                  style={{ color: selected.color }}
                >
                  {card.heading[language as Language]}
                </p>

                <div className="space-y-2 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
                  {card.items.map((item, ii) => (
                    <div
                      key={ii}
                      className="flex gap-3 rounded-2xl border px-4 py-3 lg:px-5 lg:py-4"
                      style={{ background: "var(--c-surface)", borderColor: "var(--c-border)" }}
                    >
                      <span
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-extrabold lg:h-6 lg:w-6 lg:text-sm"
                        style={{ background: `${selected.color}18`, color: selected.color }}
                      >
                        {ii + 1}
                      </span>
                      <p className="flex-1 text-sm leading-relaxed lg:text-base" style={{ color: "var(--c-text)" }}>
                        {item[language as Language]}
                      </p>
                    </div>
                  ))}
                </div>

                {card.note && (
                  <div
                    className="mt-2 rounded-2xl px-4 py-3"
                    style={{ background: `${selected.color}10`, border: `1px solid ${selected.color}22` }}
                  >
                    <p className="text-sm font-semibold leading-relaxed" style={{ color: selected.color }}>
                      {card.note[language as Language]}
                    </p>
                  </div>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() => navigate("/chat")}
              className="flex w-full items-center gap-3 rounded-2xl p-4 transition-all active:scale-[0.98]"
              style={{ background: "var(--c-primary-l)", border: "1px solid rgba(207,120,89,0.25)" }}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl"
                style={{ background: "var(--c-primary)", color: "white" }}
              >
                <Scale size={18} />
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-sm font-extrabold" style={{ color: "var(--c-primary)" }}>
                  {t(language, {
                    hindi: "और सवाल हैं? AI से पूछें",
                    english: "More questions? Ask AI",
                    hinglish: "Aur sawaal? AI se puchein",
                  })}
                </p>
                <p className="mt-0.5 text-xs" style={{ color: "var(--c-muted)" }}>
                  {t(language, {
                    hindi: "अपनी स्थिति बताएं — तुरंत जवाब",
                    english: "Describe your case — instant answer",
                    hinglish: "Apni situation batao — turant jawab",
                  })}
                </p>
              </div>
              <span className="font-bold" style={{ color: "var(--c-primary)" }}>
                →
              </span>
            </button>
          </div>
        </div>

        <aside
          className={ASIDE_CLASS}
          style={{
            background: "var(--c-surface)",
            borderColor: "var(--c-border)",
          }}
          aria-label={t(language, {
            hindi: "अन्य विषय और मदद",
            english: "Other topics and help",
            hinglish: "Aur topics aur help",
          })}
        >
          <div className="border-b pb-4" style={{ borderColor: "var(--c-border)" }}>
            <p className="section-label mb-3">
              {t(language, { hindi: "अन्य विषय", english: "Other topics", hinglish: "Aur topics" })}
            </p>
            <div className="max-h-48 space-y-1.5 overflow-y-auto pr-0.5 lg:max-h-56">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="w-full rounded-lg border px-2.5 py-2 text-left text-xs font-bold lg:text-sm"
                style={{
                  background: "var(--c-surface-2)",
                  borderColor: "var(--c-border)",
                  color: "var(--c-primary)",
                }}
              >
                {t(language, { hindi: "← सभी विषय", english: "← All topics", hinglish: "← Saare topics" })}
              </button>
              {otherTopics.map((tp) => {
                const Icon = topicIcon(tp.emoji);
                return (
                  <button
                    key={tp.id}
                    type="button"
                    onClick={() => setSelected(tp)}
                    className="flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-xs font-semibold transition-colors lg:text-sm"
                    style={{
                      background: "var(--c-surface-2)",
                      borderColor: "var(--c-border)",
                      color: "var(--c-text)",
                    }}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 opacity-80" strokeWidth={2} />
                    <span className="min-w-0 leading-snug">{tp.title[language as Language]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="section-label">
              {t(language, { hindi: "आपके कदम", english: "Your steps", hinglish: "Aapke steps" })}
            </p>
            <ol className="mt-2 list-none space-y-2.5 p-0">
              {guideDetailSteps.map((text, idx) => (
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
              {t(language, { hindi: "इस विषय पर AI", english: "AI on this topic", hinglish: "Is topic par AI" })}
            </p>
            <p className="mt-1 text-xs font-medium leading-relaxed lg:mt-2 lg:text-sm" style={{ color: "var(--c-primary)" }}>
              {t(language, {
                hindi: `"${selected.title[language as Language]}" से जुड़ा सवाल पूछें।`,
                english: `Ask a question related to "${selected.title[language as Language]}".`,
                hinglish: `"${selected.title[language as Language]}" se related sawaal pucho.`,
              })}
            </p>
            <button
              type="button"
              onClick={() =>
                navigate("/chat", {
                  state: {
                    question: t(language, {
                      hindi: `${selected.title[language as Language]} — मुझे सरल भाषा में समझाएं।`,
                      english: `Explain ${selected.title[language as Language]} in simple language.`,
                      hinglish: `${selected.title[language as Language]} simple mein samjhao.`,
                    }),
                  },
                })
              }
              className="see-more-btn mt-3 inline-flex w-full items-center justify-center gap-2 lg:mt-4 lg:py-2.5 lg:text-sm"
            >
              <Scale size={16} className="lg:h-[1.125rem] lg:w-[1.125rem]" />
              {t(language, { hindi: "AI से पूछें", english: "Ask AI", hinglish: "AI se pucho" })}
            </button>
          </div>
        </aside>
      </div>

      <div className="bottom-nav">
        {NAV.map((item) => (
          <button
            key={item.path}
            type="button"
            onClick={() => {
              if (item.path === "/manual") setSelected(null);
              else navigate(item.path);
            }}
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
