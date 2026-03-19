import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp, t, Language } from "../context/AppContext";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Scale,
  FileText,
  Search,
  Shield,
  Gavel,
  Landmark,
  Flag,
  Phone,
  Mic,
} from "lucide-react";

type StageId =
  | "fir"
  | "investigation"
  | "chargesheet"
  | "bail"
  | "trial"
  | "judgment";

type LocalText = Record<Language, string>;
type DocType = "fir" | "chargesheet" | "bail";

interface StageDef {
  id: StageId;
  Icon: React.ComponentType<{ size?: number }>;
  title: LocalText;
  meaning: LocalText;
  actions: LocalText[];
  documents: LocalText[];
  requiredFields: { key: string; label: LocalText; placeholder: LocalText }[];
  aiPrompt: LocalText;
  checkpoints: { id: string; label: LocalText }[];
}

interface DocField {
  key: string;
  label: LocalText;
  required: boolean;
  placeholder: LocalText;
  example: LocalText;
  instruction: LocalText;
  commonMistake: LocalText;
}

interface DocSchema {
  id: DocType;
  title: LocalText;
  whatIsIt: LocalText;
  whenUsed: LocalText;
  fields: DocField[];
  mockSample: { label: LocalText; value: LocalText }[];
}

const STAGES: StageDef[] = [
  {
    id: "fir",
    Icon: FileText,
    title: { hindi: "FIR रजिस्ट्रेशन", english: "FIR Registration", hinglish: "FIR Registration" },
    meaning: {
      hindi: "इस चरण में घटना की पहली पुलिस रिपोर्ट दर्ज होती है।",
      english: "This stage registers the first police report of the incident.",
      hinglish: "Is stage mein incident ki pehli police report register hoti hai.",
    },
    actions: [
      {
        hindi: "घटना की बुनियादी जानकारी तैयार करें।",
        english: "Prepare basic incident details.",
        hinglish: "Incident ki basic details ready rakho.",
      },
      {
        hindi: "पुलिस स्टेशन/पोर्टल पर FIR दर्ज करें।",
        english: "File FIR at station/portal.",
        hinglish: "Station/portal par FIR file karo.",
      },
      {
        hindi: "FIR की कॉपी लेकर सुरक्षित रखें।",
        english: "Collect and keep FIR copy safe.",
        hinglish: "FIR copy lekar safely rakho.",
      },
    ],
    documents: [
      { hindi: "ID प्रूफ", english: "ID proof", hinglish: "ID proof" },
      { hindi: "घटना विवरण", english: "Incident details", hinglish: "Incident details" },
      { hindi: "साक्ष्य (यदि हो)", english: "Evidence (if any)", hinglish: "Evidence (if any)" },
    ],
    requiredFields: [
      {
        key: "firNo",
        label: { hindi: "FIR नंबर", english: "FIR Number", hinglish: "FIR Number" },
        placeholder: { hindi: "उदाहरण: 123/2026", english: "Example: 123/2026", hinglish: "Example: 123/2026" },
      },
      {
        key: "policeStation",
        label: { hindi: "थाना", english: "Police Station", hinglish: "Police Station" },
        placeholder: { hindi: "सटीक थाना नाम", english: "Exact station name", hinglish: "Exact station name" },
      },
      {
        key: "district",
        label: { hindi: "जिला", english: "District", hinglish: "District" },
        placeholder: { hindi: "उदाहरण: South Delhi", english: "Example: South Delhi", hinglish: "Example: South Delhi" },
      },
      {
        key: "firDate",
        label: { hindi: "FIR तारीख", english: "FIR Date", hinglish: "FIR Date" },
        placeholder: { hindi: "DD/MM/YYYY", english: "DD/MM/YYYY", hinglish: "DD/MM/YYYY" },
      },
    ],
    aiPrompt: {
      hindi: "मुझे FIR रजिस्ट्रेशन स्टेज में क्या करना है, step-by-step बताएं।",
      english: "Guide me step-by-step for FIR registration stage.",
      hinglish: "FIR registration stage ke liye step-by-step guide do.",
    },
    checkpoints: [
      { id: "fir-filed", label: { hindi: "FIR दर्ज", english: "FIR filed", hinglish: "FIR filed" } },
      { id: "fir-copy", label: { hindi: "FIR कॉपी मिली", english: "FIR copy received", hinglish: "FIR copy received" } },
    ],
  },
  {
    id: "investigation",
    Icon: Search,
    title: { hindi: "पुलिस जांच", english: "Police Investigation", hinglish: "Police Investigation" },
    meaning: {
      hindi: "पुलिस साक्ष्य इकट्ठा करती है और बयान दर्ज करती है।",
      english: "Police collects evidence and records statements.",
      hinglish: "Police evidence collect karti hai aur statements leti hai.",
    },
    actions: [
      { hindi: "केस अपडेट नोट करें।", english: "Track case updates.", hinglish: "Case updates track karo." },
      { hindi: "जरूरत पर वकील से बात करें।", english: "Consult lawyer when needed.", hinglish: "Need par lawyer se baat karo." },
      { hindi: "दस्तावेज़ एक जगह रखें।", english: "Keep documents organized.", hinglish: "Documents organized rakho." },
    ],
    documents: [
      { hindi: "FIR कॉपी", english: "FIR copy", hinglish: "FIR copy" },
      { hindi: "समन/नोटिस", english: "Notices/Summons", hinglish: "Notices/Summons" },
    ],
    requiredFields: [
      {
        key: "arrestDate",
        label: { hindi: "गिरफ्तारी तारीख", english: "Date of Arrest", hinglish: "Date of Arrest" },
        placeholder: { hindi: "DD/MM/YYYY", english: "DD/MM/YYYY", hinglish: "DD/MM/YYYY" },
      },
      {
        key: "ioName",
        label: { hindi: "IO नाम", english: "Investigating Officer", hinglish: "Investigating Officer" },
        placeholder: { hindi: "अधिकारी का नाम", english: "Officer name", hinglish: "Officer name" },
      },
      {
        key: "statusNote",
        label: { hindi: "जांच स्थिति", english: "Investigation Status", hinglish: "Investigation Status" },
        placeholder: { hindi: "ताज़ा अपडेट लिखें", english: "Write latest update", hinglish: "Write latest update" },
      },
    ],
    aiPrompt: {
      hindi: "पुलिस जांच स्टेज में मुझे क्या सावधानियां रखनी चाहिए?",
      english: "What precautions should I take during police investigation?",
      hinglish: "Police investigation stage mein kya precautions rakhun?",
    },
    checkpoints: [
      { id: "statement-done", label: { hindi: "बयान प्रक्रिया पूरी", english: "Statement process done", hinglish: "Statement done" } },
    ],
  },
  {
    id: "chargesheet",
    Icon: Shield,
    title: { hindi: "चार्जशीट", english: "Charge Sheet", hinglish: "Charge Sheet" },
    meaning: {
      hindi: "पुलिस अदालत में आरोपों की रिपोर्ट जमा करती है।",
      english: "Police submits formal charges report to court.",
      hinglish: "Police court mein formal charges report file karti hai.",
    },
    actions: [
      { hindi: "चार्जशीट कॉपी की समीक्षा करें।", english: "Review chargesheet copy.", hinglish: "Chargesheet copy review karo." },
      { hindi: "धाराएं समझें।", english: "Understand sections applied.", hinglish: "Applied sections samjho." },
      { hindi: "अगली सुनवाई की तैयारी करें।", english: "Prepare for next hearing.", hinglish: "Next hearing prepare karo." },
    ],
    documents: [
      { hindi: "चार्जशीट कॉपी", english: "Chargesheet copy", hinglish: "Chargesheet copy" },
      { hindi: "केस नंबर", english: "Case number", hinglish: "Case number" },
    ],
    requiredFields: [
      {
        key: "chargesheetDate",
        label: { hindi: "चार्जशीट तारीख", english: "Chargesheet Date", hinglish: "Chargesheet Date" },
        placeholder: { hindi: "DD/MM/YYYY", english: "DD/MM/YYYY", hinglish: "DD/MM/YYYY" },
      },
      {
        key: "courtName",
        label: { hindi: "कोर्ट नाम", english: "Court Name", hinglish: "Court Name" },
        placeholder: { hindi: "MM / Sessions", english: "MM / Sessions", hinglish: "MM / Sessions" },
      },
      {
        key: "caseNo",
        label: { hindi: "केस नंबर", english: "Case Number", hinglish: "Case Number" },
        placeholder: { hindi: "यदि उपलब्ध हो", english: "If available", hinglish: "If available" },
      },
    ],
    aiPrompt: {
      hindi: "चार्जशीट मिलने के बाद next steps बताएं।",
      english: "Tell me the next steps after chargesheet filing.",
      hinglish: "Chargesheet ke baad next steps batao.",
    },
    checkpoints: [
      { id: "chargesheet-received", label: { hindi: "चार्जशीट कॉपी मिली", english: "Chargesheet received", hinglish: "Chargesheet received" } },
    ],
  },
  {
    id: "bail",
    Icon: Gavel,
    title: { hindi: "जमानत आवेदन", english: "Bail Application", hinglish: "Bail Application" },
    meaning: {
      hindi: "अदालत से रिहाई के लिए जमानत आवेदन किया जाता है।",
      english: "Bail application is filed in court for release.",
      hinglish: "Court mein release ke liye bail apply hoti hai.",
    },
    actions: [
      { hindi: "जमानत ग्राउंड्स तैयार करें।", english: "Prepare bail grounds.", hinglish: "Bail grounds prepare karo." },
      { hindi: "वकील/लीगल एड से आवेदन करें।", english: "File via lawyer/legal aid.", hinglish: "Lawyer/legal aid se file karo." },
      { hindi: "ऑर्डर कॉपी सुरक्षित रखें।", english: "Keep bail order copy safe.", hinglish: "Bail order copy safe rakho." },
    ],
    documents: [
      { hindi: "FIR/चार्जशीट", english: "FIR/Chargesheet", hinglish: "FIR/Chargesheet" },
      { hindi: "पहचान पत्र", english: "ID proof", hinglish: "ID proof" },
    ],
    requiredFields: [
      {
        key: "sections",
        label: { hindi: "धाराएं", english: "Sections", hinglish: "Sections" },
        placeholder: { hindi: "IPC/BNSS sections", english: "IPC/BNSS sections", hinglish: "IPC/BNSS sections" },
      },
      {
        key: "custodyDays",
        label: { hindi: "कस्टडी अवधि", english: "Custody Duration", hinglish: "Custody Duration" },
        placeholder: { hindi: "दिनों में", english: "In days", hinglish: "In days" },
      },
      {
        key: "bailGrounds",
        label: { hindi: "जमानत आधार", english: "Bail Grounds", hinglish: "Bail Grounds" },
        placeholder: { hindi: "स्वास्थ्य/परिवार/देरी", english: "Health/family/delay", hinglish: "Health/family/delay" },
      },
    ],
    aiPrompt: {
      hindi: "मेरे केस के लिए bail apply करने का सही तरीका बताएं।",
      english: "Guide me on applying bail correctly for my case.",
      hinglish: "Mere case mein bail apply ka sahi tareeka batao.",
    },
    checkpoints: [
      { id: "bail-filed", label: { hindi: "जमानत आवेदन दायर", english: "Bail filed", hinglish: "Bail filed" } },
      { id: "bail-order", label: { hindi: "जमानत आदेश मिला", english: "Bail order received", hinglish: "Bail order received" } },
    ],
  },
  {
    id: "trial",
    Icon: Landmark,
    title: { hindi: "कोर्ट ट्रायल", english: "Court Trial", hinglish: "Court Trial" },
    meaning: {
      hindi: "गवाह, साक्ष्य और बहस के आधार पर सुनवाई चलती है।",
      english: "Hearings proceed with witnesses, evidence, and arguments.",
      hinglish: "Witness, evidence aur arguments ke saath hearing chalti hai.",
    },
    actions: [
      { hindi: "हर तारीख नोट करें।", english: "Track every hearing date.", hinglish: "Har hearing date note karo." },
      { hindi: "वकील के साथ रणनीति तय करें।", english: "Plan strategy with lawyer.", hinglish: "Lawyer ke saath strategy banao." },
      { hindi: "दस्तावेज़ अपडेट रखें।", english: "Keep documents updated.", hinglish: "Documents updated rakho." },
    ],
    documents: [
      { hindi: "केस फाइल", english: "Case file", hinglish: "Case file" },
      { hindi: "सुनवाई आदेश", english: "Hearing orders", hinglish: "Hearing orders" },
    ],
    requiredFields: [
      {
        key: "nextDate",
        label: { hindi: "अगली तारीख", english: "Next Hearing Date", hinglish: "Next Hearing Date" },
        placeholder: { hindi: "DD/MM/YYYY", english: "DD/MM/YYYY", hinglish: "DD/MM/YYYY" },
      },
      {
        key: "witnessStage",
        label: { hindi: "गवाह चरण", english: "Witness Stage", hinglish: "Witness Stage" },
        placeholder: { hindi: "PW1/PW2 etc.", english: "PW1/PW2 etc.", hinglish: "PW1/PW2 etc." },
      },
      {
        key: "orderSummary",
        label: { hindi: "ऑर्डर सारांश", english: "Order Summary", hinglish: "Order Summary" },
        placeholder: { hindi: "पिछली सुनवाई का सार", english: "Last hearing summary", hinglish: "Last hearing summary" },
      },
    ],
    aiPrompt: {
      hindi: "कोर्ट ट्रायल स्टेज में best next actions बताएं।",
      english: "Suggest best next actions during court trial stage.",
      hinglish: "Court trial stage mein best next actions batao.",
    },
    checkpoints: [
      { id: "trial-started", label: { hindi: "ट्रायल शुरू", english: "Trial started", hinglish: "Trial started" } },
    ],
  },
  {
    id: "judgment",
    Icon: Flag,
    title: { hindi: "निर्णय / पोस्ट-ट्रायल", english: "Judgment / Post-Trial", hinglish: "Judgment / Post-Trial" },
    meaning: {
      hindi: "अदालत का निर्णय आता है, फिर आगे की कार्रवाई तय होती है।",
      english: "Court delivers judgment and next legal steps are decided.",
      hinglish: "Court judgment ke baad next legal steps decide hote hain.",
    },
    actions: [
      { hindi: "निर्णय कॉपी प्राप्त करें।", english: "Collect judgment copy.", hinglish: "Judgment copy lo." },
      { hindi: "अपील विकल्प समझें।", english: "Understand appeal options.", hinglish: "Appeal options samjho." },
      { hindi: "रिहाई/रीइंटीग्रेशन सहायता लें।", english: "Take post-trial/release support.", hinglish: "Post-trial/release support lo." },
    ],
    documents: [
      { hindi: "निर्णय कॉपी", english: "Judgment copy", hinglish: "Judgment copy" },
      { hindi: "रिहाई कागज़ात", english: "Release documents", hinglish: "Release documents" },
    ],
    requiredFields: [
      {
        key: "judgmentDate",
        label: { hindi: "निर्णय तारीख", english: "Judgment Date", hinglish: "Judgment Date" },
        placeholder: { hindi: "DD/MM/YYYY", english: "DD/MM/YYYY", hinglish: "DD/MM/YYYY" },
      },
      {
        key: "outcome",
        label: { hindi: "परिणाम", english: "Outcome", hinglish: "Outcome" },
        placeholder: { hindi: "Convicted/Acquitted etc.", english: "Convicted/Acquitted etc.", hinglish: "Convicted/Acquitted etc." },
      },
      {
        key: "appealPlan",
        label: { hindi: "अपील योजना", english: "Appeal Plan", hinglish: "Appeal Plan" },
        placeholder: { hindi: "अगला कदम लिखें", english: "Write next action", hinglish: "Write next action" },
      },
    ],
    aiPrompt: {
      hindi: "Judgment के बाद मेरे लिए practical next steps बताएं।",
      english: "Give practical next steps after judgment.",
      hinglish: "Judgment ke baad practical next steps batao.",
    },
    checkpoints: [
      { id: "judgment-copy", label: { hindi: "निर्णय कॉपी मिली", english: "Judgment copy received", hinglish: "Judgment copy received" } },
    ],
  },
];

const DOC_SCHEMAS: DocSchema[] = [
  {
    id: "fir",
    title: { hindi: "FIR (नमूना)", english: "FIR (Sample)", hinglish: "FIR (Sample)" },
    whatIsIt: {
      hindi: "यह घटना की पहली आधिकारिक पुलिस रिपोर्ट होती है।",
      english: "This is the first official police report of an incident.",
      hinglish: "Yeh incident ki pehli official police report hoti hai.",
    },
    whenUsed: {
      hindi: "घटना के तुरंत बाद शिकायत दर्ज कराने में।",
      english: "Used when filing a complaint right after an incident.",
      hinglish: "Incident ke baad complaint register karne mein use hoti hai.",
    },
    fields: [
      {
        key: "firNo",
        label: { hindi: "FIR नंबर", english: "FIR Number", hinglish: "FIR Number" },
        required: true,
        placeholder: { hindi: "उदाहरण: 123/2026", english: "Example: 123/2026", hinglish: "Example: 123/2026" },
        example: { hindi: "123/2026", english: "123/2026", hinglish: "123/2026" },
        instruction: {
          hindi: "FIR कॉपी पर जैसा नंबर है, वैसा ही लिखें।",
          english: "Enter the FIR number exactly as written on the FIR copy.",
          hinglish: "FIR copy par jo number hai, wahi exact daalo.",
        },
        commonMistake: {
          hindi: "साल या slash (/) छोड़ देना।",
          english: "Skipping year or slash (/).",
          hinglish: "Year ya slash (/) miss karna.",
        },
      },
      {
        key: "policeStation",
        label: { hindi: "थाना", english: "Police Station", hinglish: "Police Station" },
        required: true,
        placeholder: { hindi: "उदाहरण: Hauz Khas", english: "Example: Hauz Khas", hinglish: "Example: Hauz Khas" },
        example: { hindi: "Hauz Khas", english: "Hauz Khas", hinglish: "Hauz Khas" },
        instruction: {
          hindi: "थाना नाम सही spelling के साथ भरें।",
          english: "Enter station name with correct spelling.",
          hinglish: "Station name correct spelling ke saath bharo.",
        },
        commonMistake: {
          hindi: "शॉर्ट नाम या गलत district का थाना भरना।",
          english: "Using short names or wrong district station.",
          hinglish: "Short name ya galat district station daalna.",
        },
      },
      {
        key: "district",
        label: { hindi: "जिला", english: "District", hinglish: "District" },
        required: true,
        placeholder: { hindi: "उदाहरण: South Delhi", english: "Example: South Delhi", hinglish: "Example: South Delhi" },
        example: { hindi: "South Delhi", english: "South Delhi", hinglish: "South Delhi" },
        instruction: {
          hindi: "पुलिस रिकॉर्ड में उपयोग होने वाला जिला नाम लिखें।",
          english: "Use official district name used in police records.",
          hinglish: "Police records wala official district name likho.",
        },
        commonMistake: {
          hindi: "लोकल एरिया नाम को जिला समझकर भरना।",
          english: "Entering locality instead of district name.",
          hinglish: "Local area ko district ki jagah bhar dena.",
        },
      },
      {
        key: "firDate",
        label: { hindi: "FIR तारीख", english: "FIR Date", hinglish: "FIR Date" },
        required: true,
        placeholder: { hindi: "DD/MM/YYYY", english: "DD/MM/YYYY", hinglish: "DD/MM/YYYY" },
        example: { hindi: "14/03/2026", english: "14/03/2026", hinglish: "14/03/2026" },
        instruction: {
          hindi: "तारीख DD/MM/YYYY फॉर्मेट में लिखें।",
          english: "Use DD/MM/YYYY format.",
          hinglish: "Date DD/MM/YYYY format mein likho.",
        },
        commonMistake: {
          hindi: "MM/DD/YYYY format डालना।",
          english: "Entering MM/DD/YYYY format.",
          hinglish: "MM/DD/YYYY format daal dena.",
        },
      },
      {
        key: "complainantName",
        label: { hindi: "शिकायतकर्ता नाम", english: "Complainant Name", hinglish: "Complainant Name" },
        required: false,
        placeholder: { hindi: "पूरा नाम", english: "Full name", hinglish: "Full name" },
        example: { hindi: "Rakesh Kumar", english: "Rakesh Kumar", hinglish: "Rakesh Kumar" },
        instruction: {
          hindi: "पूरा नाम लिखें, initials से बचें।",
          english: "Write full name; avoid initials only.",
          hinglish: "Full name likho, sirf initials mat likho.",
        },
        commonMistake: {
          hindi: "नाम spelling FIR कॉपी से अलग होना।",
          english: "Name spelling not matching FIR copy.",
          hinglish: "Name spelling FIR copy se mismatch.",
        },
      },
    ],
    mockSample: [
      { label: { hindi: "FIR नं.", english: "FIR No.", hinglish: "FIR No." }, value: { hindi: "123/2026", english: "123/2026", hinglish: "123/2026" } },
      { label: { hindi: "थाना", english: "Police Station", hinglish: "Police Station" }, value: { hindi: "Hauz Khas", english: "Hauz Khas", hinglish: "Hauz Khas" } },
      { label: { hindi: "जिला", english: "District", hinglish: "District" }, value: { hindi: "South Delhi", english: "South Delhi", hinglish: "South Delhi" } },
      { label: { hindi: "तारीख", english: "Date", hinglish: "Date" }, value: { hindi: "14/03/2026", english: "14/03/2026", hinglish: "14/03/2026" } },
    ],
  },
  {
    id: "chargesheet",
    title: { hindi: "चार्जशीट (नमूना)", english: "Charge Sheet (Sample)", hinglish: "Charge Sheet (Sample)" },
    whatIsIt: {
      hindi: "यह पुलिस द्वारा अदालत में जमा आरोपों की विस्तृत रिपोर्ट होती है।",
      english: "Detailed police report submitted to court with charges.",
      hinglish: "Police ki detailed report hoti hai jo court mein file hoti hai.",
    },
    whenUsed: {
      hindi: "जांच पूरी होने के बाद अदालत प्रक्रिया शुरू करने में।",
      english: "Used after investigation to begin court proceedings.",
      hinglish: "Investigation ke baad court process start karne mein use hoti hai.",
    },
    fields: [
      {
        key: "chargesheetDate",
        label: { hindi: "फाइलिंग तारीख", english: "Filing Date", hinglish: "Filing Date" },
        required: true,
        placeholder: { hindi: "DD/MM/YYYY", english: "DD/MM/YYYY", hinglish: "DD/MM/YYYY" },
        example: { hindi: "28/04/2026", english: "28/04/2026", hinglish: "28/04/2026" },
        instruction: {
          hindi: "कोर्ट रिकॉर्ड की सही तारीख डालें।",
          english: "Use the exact filing date from court records.",
          hinglish: "Court records wali exact filing date daalo.",
        },
        commonMistake: {
          hindi: "गिरफ्तारी तारीख को फाइलिंग तारीख समझना।",
          english: "Confusing arrest date with filing date.",
          hinglish: "Arrest date ko filing date samajhna.",
        },
      },
      {
        key: "courtName",
        label: { hindi: "कोर्ट नाम", english: "Court Name", hinglish: "Court Name" },
        required: true,
        placeholder: { hindi: "MM / Sessions", english: "MM / Sessions", hinglish: "MM / Sessions" },
        example: { hindi: "Sessions Court, Saket", english: "Sessions Court, Saket", hinglish: "Sessions Court, Saket" },
        instruction: {
          hindi: "पूरा कोर्ट नाम लिखें।",
          english: "Enter full court name.",
          hinglish: "Court ka poora naam likho.",
        },
        commonMistake: {
          hindi: "सिर्फ court type लिखना (जैसे MM) और location छोड़ देना।",
          english: "Only writing type (MM) without location.",
          hinglish: "Sirf MM likhna aur location skip karna.",
        },
      },
      {
        key: "caseNo",
        label: { hindi: "केस नंबर", english: "Case Number", hinglish: "Case Number" },
        required: true,
        placeholder: { hindi: "यदि उपलब्ध हो", english: "If assigned", hinglish: "If assigned" },
        example: { hindi: "SC/441/2026", english: "SC/441/2026", hinglish: "SC/441/2026" },
        instruction: {
          hindi: "केस नंबर में prefixes/suffixes वैसे ही रखें।",
          english: "Keep prefixes/suffixes exactly as in court file.",
          hinglish: "Case number ke prefixes/suffixes same rakho.",
        },
        commonMistake: {
          hindi: "केवल numeric part लिखना।",
          english: "Entering only numeric part.",
          hinglish: "Sirf number part daalna.",
        },
      },
      {
        key: "chargesheetFiled",
        label: { hindi: "चार्जशीट फाइल हुई?", english: "Chargesheet Filed?", hinglish: "Chargesheet Filed?" },
        required: false,
        placeholder: { hindi: "Yes/No", english: "Yes/No", hinglish: "Yes/No" },
        example: { hindi: "Yes", english: "Yes", hinglish: "Yes" },
        instruction: {
          hindi: "यदि स्पष्ट नहीं है, order sheet से सत्यापित करें।",
          english: "If unsure, verify from order sheet.",
          hinglish: "Unsure ho to order sheet se verify karo.",
        },
        commonMistake: {
          hindi: "अनुमान से Yes/No चुनना।",
          english: "Selecting Yes/No based on guess.",
          hinglish: "Guess karke Yes/No select karna.",
        },
      },
    ],
    mockSample: [
      { label: { hindi: "फाइलिंग तारीख", english: "Filing Date", hinglish: "Filing Date" }, value: { hindi: "28/04/2026", english: "28/04/2026", hinglish: "28/04/2026" } },
      { label: { hindi: "कोर्ट", english: "Court", hinglish: "Court" }, value: { hindi: "Sessions Court, Saket", english: "Sessions Court, Saket", hinglish: "Sessions Court, Saket" } },
      { label: { hindi: "केस नं.", english: "Case No.", hinglish: "Case No." }, value: { hindi: "SC/441/2026", english: "SC/441/2026", hinglish: "SC/441/2026" } },
      { label: { hindi: "स्थिति", english: "Status", hinglish: "Status" }, value: { hindi: "Filed", english: "Filed", hinglish: "Filed" } },
    ],
  },
  {
    id: "bail",
    title: { hindi: "जमानत आवेदन (नमूना)", english: "Bail Application (Sample)", hinglish: "Bail Application (Sample)" },
    whatIsIt: {
      hindi: "अदालत से रिहाई के लिए दाखिल प्रार्थना-पत्र।",
      english: "A petition filed before court requesting release on bail.",
      hinglish: "Court mein release ke liye file ki gayi petition.",
    },
    whenUsed: {
      hindi: "गिरफ्तारी/कस्टडी के दौरान रिहाई का अनुरोध करते समय।",
      english: "Used during custody to request release.",
      hinglish: "Custody ke dauran release request ke time use hota hai.",
    },
    fields: [
      {
        key: "sections",
        label: { hindi: "धाराएं", english: "Sections", hinglish: "Sections" },
        required: true,
        placeholder: { hindi: "उदाहरण: 379 IPC, 34 IPC", english: "Example: 379 IPC, 34 IPC", hinglish: "Example: 379 IPC, 34 IPC" },
        example: { hindi: "379 IPC, 34 IPC", english: "379 IPC, 34 IPC", hinglish: "379 IPC, 34 IPC" },
        instruction: {
          hindi: "FIR/चार्जशीट में लिखी धाराएं ही भरें।",
          english: "Enter sections exactly as in FIR/chargesheet.",
          hinglish: "FIR/chargesheet mein jo sections hain wahi daalo.",
        },
        commonMistake: {
          hindi: "गलत धारा जोड़ देना।",
          english: "Adding incorrect section numbers.",
          hinglish: "Galat section number add karna.",
        },
      },
      {
        key: "custodyDays",
        label: { hindi: "कस्टडी अवधि", english: "Custody Duration (Days)", hinglish: "Custody Duration (Days)" },
        required: true,
        placeholder: { hindi: "उदाहरण: 23", english: "Example: 23", hinglish: "Example: 23" },
        example: { hindi: "23", english: "23", hinglish: "23" },
        instruction: {
          hindi: "कुल कस्टडी दिन संख्या लिखें।",
          english: "Enter total custody days as a number.",
          hinglish: "Total custody days number mein likho.",
        },
        commonMistake: {
          hindi: "दिनों की जगह तारीख लिख देना।",
          english: "Entering date instead of number of days.",
          hinglish: "Days ki jagah date likh dena.",
        },
      },
      {
        key: "bailGrounds",
        label: { hindi: "जमानत के आधार", english: "Grounds for Bail", hinglish: "Grounds for Bail" },
        required: true,
        placeholder: { hindi: "स्वास्थ्य/परिवार/स्थायी पता", english: "Health/family/permanent address", hinglish: "Health/family/permanent address" },
        example: { hindi: "स्थायी पता और परिवार की जिम्मेदारी", english: "Permanent address and family responsibility", hinglish: "Permanent address and family responsibility" },
        instruction: {
          hindi: "2-3 तथ्यात्मक grounds स्पष्ट लिखें।",
          english: "Write 2-3 factual grounds clearly.",
          hinglish: "2-3 factual grounds clearly likho.",
        },
        commonMistake: {
          hindi: "बहुत लंबा या भावनात्मक टेक्स्ट लिखना।",
          english: "Using very long or emotional text.",
          hinglish: "Bahut lamba ya emotional text likhna.",
        },
      },
      {
        key: "priorBailAttempt",
        label: { hindi: "पहले जमानत प्रयास", english: "Prior Bail Attempt", hinglish: "Prior Bail Attempt" },
        required: false,
        placeholder: { hindi: "Court + date + outcome", english: "Court + date + outcome", hinglish: "Court + date + outcome" },
        example: { hindi: "MM Court, 20/04/2026, Rejected", english: "MM Court, 20/04/2026, Rejected", hinglish: "MM Court, 20/04/2026, Rejected" },
        instruction: {
          hindi: "यदि लागू हो तभी भरें।",
          english: "Fill only if applicable.",
          hinglish: "Applicable ho tabhi bharo.",
        },
        commonMistake: {
          hindi: "ना होने पर भी dummy entry डालना।",
          english: "Adding dummy entry when none exists.",
          hinglish: "Na hone par bhi dummy entry daalna.",
        },
      },
    ],
    mockSample: [
      { label: { hindi: "धाराएं", english: "Sections", hinglish: "Sections" }, value: { hindi: "379 IPC, 34 IPC", english: "379 IPC, 34 IPC", hinglish: "379 IPC, 34 IPC" } },
      { label: { hindi: "कस्टडी दिन", english: "Custody Days", hinglish: "Custody Days" }, value: { hindi: "23", english: "23", hinglish: "23" } },
      { label: { hindi: "जमानत आधार", english: "Grounds", hinglish: "Grounds" }, value: { hindi: "Permanent address, family dependence", english: "Permanent address, family dependence", hinglish: "Permanent address, family dependence" } },
      { label: { hindi: "पूर्व प्रयास", english: "Prior Attempt", hinglish: "Prior Attempt" }, value: { hindi: "MM Court, Rejected", english: "MM Court, Rejected", hinglish: "MM Court, Rejected" } },
    ],
  },
];

const STORAGE_KEY = "nyay_setu_legal_journey_v1";

type JourneyState = {
  currentStageId: StageId;
  completed: string[];
  fieldValues: Record<string, string>;
};

const DEFAULT_STATE: JourneyState = {
  currentStageId: "fir",
  completed: [],
  fieldValues: {},
};

export default function LegalJourney() {
  const { language } = useApp();
  const navigate = useNavigate();
  const [journey, setJourney] = useState<JourneyState>(DEFAULT_STATE);
  const [situationInput, setSituationInput] = useState("");
  const [docType, setDocType] = useState<DocType>("fir");
  const [docStep, setDocStep] = useState(0);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as JourneyState;
      if (parsed?.currentStageId) setJourney(parsed);
    } catch {
      // ignore parse failures
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(journey));
  }, [journey]);

  const stageIndex = STAGES.findIndex((s) => s.id === journey.currentStageId);
  const currentStage = STAGES[stageIndex] ?? STAGES[0];
  const completedStageCount = STAGES.filter((_, idx) => idx < stageIndex).length;
  const currentStageDoneCount = currentStage.checkpoints.filter((c) =>
    journey.completed.includes(c.id),
  ).length;

  const setCurrentStage = (id: StageId) => {
    setJourney((prev) => ({ ...prev, currentStageId: id }));
  };

  const toggleCheckpoint = (id: string) => {
    setJourney((prev) => {
      const exists = prev.completed.includes(id);
      return {
        ...prev,
        completed: exists
          ? prev.completed.filter((x) => x !== id)
          : [...prev.completed, id],
      };
    });
  };

  const setFieldValue = (fieldKey: string, value: string) => {
    setJourney((prev) => ({
      ...prev,
      fieldValues: {
        ...prev.fieldValues,
        [fieldKey]: value,
      },
    }));
  };

  const autoPlaceStage = () => {
    const q = situationInput.trim().toLowerCase();
    if (!q) return;
    if (/(fir filed|fir done|fir registered|fir already)/i.test(q)) {
      setCurrentStage("investigation");
      return;
    }
    if (/(investigation|statement|police enquiry|जांच)/i.test(q)) {
      setCurrentStage("investigation");
      return;
    }
    if (/(chargesheet|charge sheet|चार्जशीट)/i.test(q)) {
      setCurrentStage("bail");
      return;
    }
    if (/(bail|जमानत)/i.test(q)) {
      setCurrentStage("bail");
      return;
    }
    if (/(trial|hearing|सुनवाई|court)/i.test(q)) {
      setCurrentStage("trial");
      return;
    }
    if (/(judgment|verdict|appeal|निर्णय)/i.test(q)) {
      setCurrentStage("judgment");
      return;
    }
    setCurrentStage("fir");
  };

  const nextStage = STAGES[stageIndex + 1];
  const activeDoc = DOC_SCHEMAS.find((d) => d.id === docType) ?? DOC_SCHEMAS[0];
  const activeDocField = activeDoc.fields[docStep] ?? activeDoc.fields[0];

  const validateField = (field: DocField, value: string) => {
    if (field.required && !value.trim()) {
      return t(language, {
        hindi: "यह फ़ील्ड आवश्यक है।",
        english: "This field is required.",
        hinglish: "Yeh field required hai.",
      });
    }
    if (!value.trim()) return "";
    if (field.key.toLowerCase().includes("date") && !/^\d{2}\/\d{2}\/\d{4}$/.test(value.trim())) {
      return t(language, {
        hindi: "तारीख DD/MM/YYYY फॉर्मेट में भरें।",
        english: "Use DD/MM/YYYY format.",
        hinglish: "Date DD/MM/YYYY format mein daalo.",
      });
    }
    if (field.key === "firNo" && !/^[A-Za-z0-9/-]+$/.test(value.trim())) {
      return t(language, {
        hindi: "FIR नंबर में केवल letters, numbers, / या - रखें।",
        english: "Use letters, numbers, / or - only.",
        hinglish: "Letters, numbers, / ya - hi use karo.",
      });
    }
    if (field.key === "custodyDays" && !/^\d+$/.test(value.trim())) {
      return t(language, {
        hindi: "कस्टडी अवधि केवल संख्या में भरें।",
        english: "Enter custody duration as a number.",
        hinglish: "Custody duration number mein bharo.",
      });
    }
    if (field.key === "chargesheetFiled" && !/^(yes|no)$/i.test(value.trim())) {
      return t(language, {
        hindi: "केवल Yes या No लिखें।",
        english: "Use only Yes or No.",
        hinglish: "Sirf Yes ya No likho.",
      });
    }
    return "";
  };

  const activeDocFieldScopedKey = `doc:${activeDoc.id}:${activeDocField.key}`;
  const activeDocFieldValue = journey.fieldValues[activeDocFieldScopedKey] ?? "";
  const activeDocFieldError = validateField(activeDocField, activeDocFieldValue);

  return (
    <div className="h-dvh overflow-y-auto" style={{ background: "var(--c-bg)" }}>
      <div className="theme-header px-4 pt-10 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/home")}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm hover:bg-white/10 transition-all"
            style={{ color: "rgba(255,255,255,0.78)" }}
          >
            <ArrowLeft size={16} />
          </button>
          <div className="text-2xl" style={{ color: "#FAF7F4" }}>
            <Scale size={20} />
          </div>
          <div className="flex-1">
            <h1 className="font-extrabold text-base leading-tight text-white">
              {t(language, {
                hindi: "कानूनी यात्रा",
                english: "Legal Journey",
                hinglish: "Legal Journey",
              })}
            </h1>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.58)" }}>
              {t(language, {
                hindi: "आप किस स्टेज पर हैं और आगे क्या करना है",
                english: "Know your current stage and next action",
                hinglish: "Current stage aur next action samjho",
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="content-shell py-4 space-y-4 pb-28">
        <div className="card-sm">
          <p className="section-label mb-2">
            {t(language, {
              hindi: "जर्नी प्रोग्रेस",
              english: "Journey Progress",
              hinglish: "Journey Progress",
            })}
          </p>
          <div className="flex items-center justify-between text-xs mb-2" style={{ color: "var(--c-muted)" }}>
            <span>
              {t(language, {
                hindi: `पूर्ण स्टेज: ${completedStageCount}/${STAGES.length}`,
                english: `Completed stages: ${completedStageCount}/${STAGES.length}`,
                hinglish: `Completed stages: ${completedStageCount}/${STAGES.length}`,
              })}
            </span>
            <span>
              {t(language, {
                hindi: `चेकपॉइंट: ${currentStageDoneCount}/${currentStage.checkpoints.length}`,
                english: `Checkpoints: ${currentStageDoneCount}/${currentStage.checkpoints.length}`,
                hinglish: `Checkpoints: ${currentStageDoneCount}/${currentStage.checkpoints.length}`,
              })}
            </span>
          </div>
          <div
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ background: "var(--c-surface-2)", border: "1px solid var(--c-border)" }}
          >
            <div
              className="h-full"
              style={{
                width: `${((completedStageCount + (currentStageDoneCount / Math.max(1, currentStage.checkpoints.length))) / STAGES.length) * 100}%`,
                background: "var(--c-primary)",
              }}
            />
          </div>
        </div>

        <div className="card-sm">
          <p className="section-label mb-2">
            {t(language, {
              hindi: "डॉक्यूमेंट गाइड (नमूना)",
              english: "Document Guide (Sample)",
              hinglish: "Document Guide (Sample)",
            })}
          </p>
          <div className="grid grid-cols-3 gap-1.5 mb-3">
            {DOC_SCHEMAS.map((doc) => (
              <button
                key={doc.id}
                onClick={() => {
                  setDocType(doc.id);
                  setDocStep(0);
                }}
                className="rounded-lg px-2 py-1.5 text-xs font-bold border"
                style={{
                  borderColor: docType === doc.id ? "rgba(207,120,89,0.35)" : "var(--c-border)",
                  background: docType === doc.id ? "var(--c-primary-l)" : "var(--c-surface)",
                  color: docType === doc.id ? "var(--c-primary)" : "var(--c-text)",
                }}
              >
                {doc.title[language]}
              </button>
            ))}
          </div>

          <div
            className="rounded-xl border p-3 mb-3"
            style={{ borderColor: "var(--c-border)", background: "var(--c-surface)" }}
          >
            <p className="text-xs font-extrabold mb-1" style={{ color: "var(--c-heading)" }}>
              {activeDoc.title[language]}
            </p>
            <p className="text-xs mb-1" style={{ color: "var(--c-text)" }}>
              {t(language, { hindi: "क्या है:", english: "What it is:", hinglish: "Kya hai:" })}{" "}
              {activeDoc.whatIsIt[language]}
            </p>
            <p className="text-xs mb-2" style={{ color: "var(--c-text)" }}>
              {t(language, { hindi: "कब उपयोग करें:", english: "When used:", hinglish: "Kab use hota hai:" })}{" "}
              {activeDoc.whenUsed[language]}
            </p>
            <div className="rounded-lg p-2.5" style={{ background: "var(--c-bg)", border: "1px dashed var(--c-border)" }}>
              {activeDoc.mockSample.map((row, i) => (
                <div key={i} className="flex items-start justify-between gap-3 py-1">
                  <span className="text-[11px] font-semibold" style={{ color: "var(--c-muted)" }}>
                    {row.label[language]}
                  </span>
                  <span className="text-[11px] text-right" style={{ color: "var(--c-heading)" }}>
                    {row.value[language]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs font-bold mb-1" style={{ color: "var(--c-label)" }}>
            {t(language, {
              hindi: "फील्ड गाइड (Required/Optional)",
              english: "Field Guide (Required/Optional)",
              hinglish: "Field Guide (Required/Optional)",
            })}
          </p>
          <div className="space-y-2 mb-3">
            {activeDoc.fields.map((f) => (
              <div
                key={f.key}
                className="rounded-lg border p-2"
                style={{ borderColor: "var(--c-border)", background: "var(--c-surface)" }}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-xs font-bold" style={{ color: "var(--c-heading)" }}>
                    {f.label[language]}
                  </p>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{
                      background: f.required ? "rgba(239,68,68,0.12)" : "rgba(59,130,246,0.12)",
                      color: f.required ? "var(--c-danger)" : "#2563EB",
                    }}
                  >
                    {f.required
                      ? t(language, { hindi: "Required", english: "Required", hinglish: "Required" })
                      : t(language, { hindi: "Optional", english: "Optional", hinglish: "Optional" })}
                  </span>
                </div>
                <p className="text-[11px]" style={{ color: "var(--c-text)" }}>
                  {f.instruction[language]}
                </p>
                <p className="text-[11px]" style={{ color: "var(--c-muted)" }}>
                  {t(language, { hindi: "उदाहरण:", english: "Example:", hinglish: "Example:" })} {f.example[language]}
                </p>
                <p className="text-[11px]" style={{ color: "var(--c-danger)" }}>
                  {t(language, { hindi: "गलती से बचें:", english: "Avoid mistake:", hinglish: "Galti avoid karo:" })} {f.commonMistake[language]}
                </p>
              </div>
            ))}
          </div>

          <p className="text-xs font-bold mb-1" style={{ color: "var(--c-label)" }}>
            {t(language, {
              hindi: "Guided Entry (Step-by-step)",
              english: "Guided Entry (Step-by-step)",
              hinglish: "Guided Entry (Step-by-step)",
            })}
          </p>
          <div
            className="rounded-xl border p-3"
            style={{ borderColor: "var(--c-border)", background: "var(--c-surface)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold" style={{ color: "var(--c-muted)" }}>
                {t(language, {
                  hindi: `स्टेप ${docStep + 1}/${activeDoc.fields.length}`,
                  english: `Step ${docStep + 1}/${activeDoc.fields.length}`,
                  hinglish: `Step ${docStep + 1}/${activeDoc.fields.length}`,
                })}
              </span>
              <button
                onClick={() => setFieldValue(activeDocFieldScopedKey, activeDocField.example[language])}
                className="text-[11px] font-bold"
                style={{ color: "var(--c-primary)" }}
              >
                {t(language, { hindi: "Auto-suggest", english: "Auto-suggest", hinglish: "Auto-suggest" })}
              </button>
            </div>

            <label className="text-xs font-bold mb-1 block" style={{ color: "var(--c-heading)" }}>
              {activeDocField.label[language]}
            </label>
            <input
              value={activeDocFieldValue}
              onChange={(e) => setFieldValue(activeDocFieldScopedKey, e.target.value)}
              placeholder={activeDocField.placeholder[language]}
              className="w-full rounded-xl px-3 py-2 text-sm border outline-none"
              style={{
                background: "var(--c-bg)",
                color: "var(--c-text)",
                borderColor: activeDocFieldError ? "var(--c-danger)" : "var(--c-border)",
              }}
            />
            <p className="text-[11px] mt-1" style={{ color: "var(--c-muted)" }}>
              {activeDocField.instruction[language]}
            </p>
            {!!activeDocFieldError && (
              <p className="text-[11px] font-semibold mt-1" style={{ color: "var(--c-danger)" }}>
                {activeDocFieldError}
              </p>
            )}

            <div className="mt-2 flex items-center justify-between gap-2">
              <button
                onClick={() =>
                  navigate("/chat", {
                    state: {
                      question: t(language, {
                        hindi: `${activeDoc.title[language]} में "${activeDocField.label[language]}" कैसे भरें? सरल उदाहरण दें।`,
                        english: `How to fill "${activeDocField.label[language]}" in ${activeDoc.title[language]}? Give simple example.`,
                        hinglish: `${activeDoc.title[language]} mein "${activeDocField.label[language]}" kaise bharen? Simple example do.`,
                      }),
                    },
                  })
                }
                className="rounded-lg px-2.5 py-1.5 text-[11px] font-bold border"
                style={{ borderColor: "var(--c-border)", color: "var(--c-text)", background: "var(--c-bg)" }}
              >
                {t(language, { hindi: "Voice/Text Help", english: "Voice/Text Help", hinglish: "Voice/Text Help" })}
              </button>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setDocStep((s) => Math.max(0, s - 1))}
                  className="rounded-lg px-2.5 py-1.5 text-[11px] font-bold border"
                  style={{ borderColor: "var(--c-border)", color: "var(--c-text)", background: "var(--c-bg)" }}
                >
                  {t(language, { hindi: "Back", english: "Back", hinglish: "Back" })}
                </button>
                <button
                  onClick={() => setDocStep((s) => Math.min(activeDoc.fields.length - 1, s + 1))}
                  disabled={!!activeDocFieldError}
                  className="rounded-lg px-2.5 py-1.5 text-[11px] font-bold"
                  style={{
                    background: "var(--c-primary-l)",
                    color: "var(--c-primary)",
                    border: "1px solid rgba(207,120,89,0.25)",
                    opacity: activeDocFieldError ? 0.5 : 1,
                  }}
                >
                  {t(language, { hindi: "Next", english: "Next", hinglish: "Next" })}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card-sm">
          <p className="section-label mb-2">
            {t(language, {
              hindi: "कैसे शुरू करें",
              english: "How to Start",
              hinglish: "Kaise Start Karein",
            })}
          </p>
          <p className="text-sm" style={{ color: "var(--c-text)" }}>
            {t(language, {
              hindi: "हर स्टेज में 3 चीज़ें करें: (1) अगले कदम पूरे करें (2) ज़रूरी फील्ड भरें (3) AI से targeted सवाल पूछें।",
              english: "For each stage do 3 things: (1) complete next actions (2) fill required fields (3) ask targeted questions to AI.",
              hinglish: "Har stage mein 3 kaam karo: (1) next actions complete karo (2) required fields bharo (3) AI se targeted sawaal pucho.",
            })}
          </p>
        </div>

        <div className="card-sm">
          <p className="section-label mb-2">
            {t(language, {
              hindi: "मेरी स्थिति",
              english: "My Current Situation",
              hinglish: "Meri Current Situation",
            })}
          </p>
          <div className="flex gap-2">
            <input
              value={situationInput}
              onChange={(e) => setSituationInput(e.target.value)}
              placeholder={t(language, {
                hindi: "उदाहरण: FIR filed, need bail",
                english: "Example: FIR filed, need bail",
                hinglish: "Example: FIR filed, need bail",
              })}
              className="flex-1 rounded-xl px-3 py-2 text-sm border outline-none"
              style={{
                background: "var(--c-bg)",
                color: "var(--c-text)",
                borderColor: "var(--c-border)",
              }}
            />
            <button onClick={autoPlaceStage} className="see-more-btn" aria-label="Auto place stage">
              <Search size={13} />
            </button>
          </div>
        </div>

        <div className="card-sm">
          <p className="section-label mb-3">
            {t(language, {
              hindi: "स्टेज प्रोग्रेस",
              english: "Stage Progress",
              hinglish: "Stage Progress",
            })}
          </p>
          <div className="space-y-2">
            {STAGES.map((s, idx) => {
              const isDone = idx < stageIndex;
              const isCurrent = s.id === journey.currentStageId;
              return (
                <button
                  key={s.id}
                  onClick={() => setCurrentStage(s.id)}
                  className="w-full rounded-xl px-3 py-2 border flex items-center gap-3 text-left"
                  style={{
                    background: isCurrent ? "var(--c-primary-l)" : "var(--c-surface)",
                    borderColor: isCurrent ? "rgba(207,120,89,0.35)" : "var(--c-border)",
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ color: isDone ? "var(--c-success)" : isCurrent ? "var(--c-primary)" : "var(--c-muted)" }}
                  >
                    {isDone ? <CheckCircle2 size={16} /> : <Circle size={14} />}
                  </div>
                  <s.Icon size={15} />
                  <div className="flex-1">
                    <span className="text-sm font-semibold" style={{ color: "var(--c-heading)" }}>
                      {s.title[language]}
                    </span>
                    <div className="text-[11px] mt-0.5" style={{ color: isDone ? "var(--c-success)" : isCurrent ? "var(--c-primary)" : "var(--c-muted)" }}>
                      {isDone
                        ? t(language, { hindi: "Completed", english: "Completed", hinglish: "Completed" })
                        : isCurrent
                          ? t(language, { hindi: "Current Stage", english: "Current Stage", hinglish: "Current Stage" })
                          : t(language, { hindi: "Upcoming", english: "Upcoming", hinglish: "Upcoming" })}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="card-sm">
          <p className="section-label mb-2">
            {t(language, {
              hindi: "वर्तमान स्टेज",
              english: "Current Stage",
              hinglish: "Current Stage",
            })}
          </p>
          <h2 className="font-extrabold text-base mb-1" style={{ color: "var(--c-heading)" }}>
            {currentStage.title[language]}
          </h2>
          <p className="text-xs font-semibold mb-2" style={{ color: "var(--c-primary)" }}>
            {t(language, {
              hindi: `Step ${stageIndex + 1} of ${STAGES.length}`,
              english: `Step ${stageIndex + 1} of ${STAGES.length}`,
              hinglish: `Step ${stageIndex + 1} of ${STAGES.length}`,
            })}
          </p>
          <p className="text-sm mb-3" style={{ color: "var(--c-text)" }}>
            {currentStage.meaning[language]}
          </p>

          <p className="text-xs font-bold mb-1" style={{ color: "var(--c-label)" }}>
            {t(language, { hindi: "अब क्या करें", english: "What to do next", hinglish: "Ab kya karein" })}
          </p>
          <div className="space-y-1.5 mb-3">
            {currentStage.actions.map((a, i) => (
              <div key={i} className="text-sm" style={{ color: "var(--c-text)" }}>
                • {a[language]}
              </div>
            ))}
          </div>

          <p className="text-xs font-bold mb-1" style={{ color: "var(--c-label)" }}>
            {t(language, { hindi: "ज़रूरी दस्तावेज़", english: "Required Documents", hinglish: "Required Documents" })}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {currentStage.documents.map((d, i) => (
              <span
                key={i}
                className="px-2 py-1 rounded-full text-[11px] font-semibold"
                style={{ background: "var(--c-surface-2)", color: "var(--c-muted)", border: "1px solid var(--c-border)" }}
              >
                {d[language]}
              </span>
            ))}
          </div>

          <p className="text-xs font-bold mb-1" style={{ color: "var(--c-label)" }}>
            {t(language, { hindi: "Required Fields", english: "Required Fields", hinglish: "Required Fields" })}
          </p>
          <div className="space-y-2 mb-3">
            {currentStage.requiredFields.map((f) => {
              const scopedKey = `${currentStage.id}:${f.key}`;
              return (
                <div key={scopedKey}>
                  <label className="text-[11px] font-semibold mb-1 block" style={{ color: "var(--c-muted)" }}>
                    {f.label[language]}
                  </label>
                  <input
                    value={journey.fieldValues[scopedKey] ?? ""}
                    onChange={(e) => setFieldValue(scopedKey, e.target.value)}
                    placeholder={f.placeholder[language]}
                    className="w-full rounded-xl px-3 py-2 text-sm border outline-none"
                    style={{
                      background: "var(--c-bg)",
                      color: "var(--c-text)",
                      borderColor: "var(--c-border)",
                    }}
                  />
                </div>
              );
            })}
          </div>

          <div className="space-y-2">
            {currentStage.checkpoints.map((c) => {
              const checked = journey.completed.includes(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => toggleCheckpoint(c.id)}
                  className="w-full rounded-xl px-3 py-2 border flex items-center gap-2 text-left"
                  style={{ background: "var(--c-surface)", borderColor: "var(--c-border)" }}
                >
                  {checked ? <CheckCircle2 size={15} style={{ color: "var(--c-success)" }} /> : <Circle size={14} style={{ color: "var(--c-muted)" }} />}
                  <span className="text-sm" style={{ color: "var(--c-text)" }}>
                    {c.label[language]}
                  </span>
                </button>
              );
            })}
          </div>
          {nextStage && (
            <div className="mt-3 flex justify-end gap-2">
              {stageIndex > 0 && (
                <button
                  onClick={() => setCurrentStage(STAGES[stageIndex - 1].id)}
                  className="rounded-xl px-3 py-2 text-xs font-bold border"
                  style={{ borderColor: "var(--c-border)", color: "var(--c-text)", background: "var(--c-surface)" }}
                >
                  {t(language, { hindi: "पिछला स्टेज", english: "Previous", hinglish: "Previous" })}
                </button>
              )}
              <button
                onClick={() => setCurrentStage(nextStage.id)}
                className="rounded-xl px-3 py-2 text-xs font-bold"
                style={{ background: "var(--c-primary-l)", color: "var(--c-primary)", border: "1px solid rgba(207,120,89,0.25)" }}
              >
                {t(language, { hindi: "अगला स्टेज", english: "Next Stage", hinglish: "Next Stage" })}
              </button>
            </div>
          )}
        </div>

        <div className="card-sm">
          <p className="section-label mb-2">
            {t(language, { hindi: "अगला कदम", english: "Next Step", hinglish: "Next Step" })}
          </p>
          <p className="text-sm mb-3" style={{ color: "var(--c-text)" }}>
            {nextStage
              ? t(language, {
                  hindi: `अगला स्टेज: ${nextStage.title[language]}`,
                  english: `Next stage: ${nextStage.title[language]}`,
                  hinglish: `Next stage: ${nextStage.title[language]}`,
                })
              : t(language, {
                  hindi: "आप अंतिम स्टेज पर हैं। पोस्ट-ट्रायल सहायता देखें।",
                  english: "You are at the final stage. Use post-trial support.",
                  hinglish: "Aap final stage par ho. Post-trial support dekho.",
                })}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() =>
                navigate("/chat", { state: { question: currentStage.aiPrompt[language] } })
              }
              className="btn-primary py-2.5 text-sm"
            >
              {t(language, { hindi: "AI से पूछें", english: "Ask AI", hinglish: "Ask AI" })}
            </button>
            <button
              onClick={() => navigate("/helpline")}
              className="rounded-xl py-2.5 text-sm font-bold border"
              style={{ borderColor: "var(--c-border)", color: "var(--c-text)", background: "var(--c-surface)" }}
            >
              <Phone size={14} className="inline mr-1" />
              {t(language, { hindi: "हेल्पलाइन", english: "Helplines", hinglish: "Helplines" })}
            </button>
            <button
              onClick={() =>
                navigate("/chat", {
                  state: {
                    question: t(language, {
                      hindi: "मुझे FIR retrieve करने में मदद करें।",
                      english: "Help me retrieve FIR details.",
                      hinglish: "Mujhe FIR retrieve karne mein help karo.",
                    }),
                  },
                })
              }
              className="rounded-xl py-2.5 text-sm font-bold border"
              style={{ borderColor: "var(--c-border)", color: "var(--c-text)", background: "var(--c-surface)" }}
            >
              <Mic size={14} className="inline mr-1" />
              FIR Assist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

