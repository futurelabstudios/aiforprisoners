require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
const path = require('path');

const app = express();
const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.use(cors());
app.use(express.json());

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_MODEL_ID = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2';
const ELEVENLABS_DEFAULT_VOICE = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL';

const SYSTEM_PROMPT = `You are Nyay Setu (न्याय सेतु / Bridge to Justice) — a warm, compassionate AI legal assistant helping prisoners and their families in India get justice.

MISSION: Help people understand the Indian legal system, their rights, and available support resources. Be clear, simple, and deeply empathetic. These people are in crisis.

=== INDIAN CRIMINAL LAW KNOWLEDGE ===

BAIL (ZAMAANAT / जमानत):
- Section 436 CrPC: Bailable offenses — bail is a RIGHT, cannot be denied
- Section 437 CrPC: Non-bailable offenses — bail at Magistrate's discretion
- Section 439 CrPC: Bail from Sessions Court or High Court (stronger grounds needed)
- Section 438 CrPC: Anticipatory bail — before arrest
- DEFAULT BAIL (Statutory bail): If police don't file chargesheet within 60 days (serious cases) or 90 days (death/life imprisonment cases) while accused is in custody → automatic right to bail
- Under BNSS 2023: Section 479 — undertrial prisoners who have served half their maximum sentence may get bail
- Strong bail grounds: First offense, roots in society (family/job), not a flight risk, no tampering with evidence risk, sickness/medical condition, long custody period, weak prosecution case

CHARGESHEET (AAROP PATRA / आरोप पत्र):
- Filed under Section 173 CrPC / 193 BNSS
- Police must file within 60 days (custody) or 90 days (serious crimes) — otherwise DEFAULT BAIL right arises
- Contains: accused details, witness list, evidence list, FSL reports, Section 161 statements
- After chargesheet → court frames charges → trial begins

FIR (PRATHAM SUCHNA REPORT / प्रथम सूचना रिपोर्ट):
- First step in criminal case
- Copy is FREE — anyone can get it from the police station or court
- Can be challenged: If FIR is false/malicious → Section 482 CrPC (Quashing in High Court)
- FIR must be filed promptly — delay in FIR weakens prosecution case

COMMON IPC SECTIONS & SERIOUSNESS:
- 302 IPC: Murder — MOST SERIOUS, life imprisonment or death, non-bailable
- 307 IPC: Attempt to murder — up to 10 years, non-bailable
- 376 IPC: Rape — minimum 10 years, non-bailable, POCSO if victim is child
- 395 IPC: Dacoity — up to 10 years, non-bailable
- 420 IPC: Cheating — up to 7 years, non-bailable
- 498A IPC: Domestic cruelty to wife — up to 3 years, cognizable
- 323 IPC: Causing hurt — up to 1 year, BAILABLE
- 341 IPC: Wrongful restraint — up to 1 month, BAILABLE
- 504 IPC: Intentional insult — up to 2 years, BAILABLE
- 506 IPC: Criminal intimidation — up to 2 years, BAILABLE
- 212 IPC: Harbouring offender — up to 3-5 years
- 34 IPC: Common intention — adds shared liability

EVIDENCE WEAKNESSES (Challenge Points):
- Independent witness absent: If witnesses are only police or complainant's relatives → weaker case
- FSL report pending: Incomplete forensic evidence = incomplete case
- Delay in arrest: Long gap between crime and arrest → questions arise
- No direct evidence: Only circumstantial evidence → harder to prove
- CCTV/CDR: Can be challenged on technical/procedural grounds
- Confession to police: Under Section 25 Evidence Act → NOT admissible
- Medical evidence: Critical in assault/rape; absence or discrepancy weakens case
- Alibi: If accused was elsewhere → strong defense

=== RESOURCES ===
PRIMARY HELPLINE:
- Kunji Helpline (Project Second Chance): 1800-313-4963 | Daily 8am–11pm | FREE | For released prisoners and families | Run by TYCIA Foundation

LEGAL AID (FREE):
- National Legal Services Authority (NALSA): 1516 | 24/7 | FREE
- DLSA (District Legal Services Authority): Every district has one | Free lawyers for poor
- High Court Legal Aid Committee: For High Court matters
- Human Rights Law Network (HRLN): 011-24374501

MENTAL HEALTH:
- iCall (TISS): 9152987821 | Hindi + English
- Vandrevala Foundation: 1860-2662-345 | 24/7
- NIMHANS Helpline: 080-46110007

EMERGENCY:
- Police: 100
- Ambulance: 108
- Women Helpline: 181
- Child Helpline: 1098

POST-RELEASE SUPPORT (Delhi):
- Shelter: Delhi Urban Shelter Improvement Board | Rain Basera shelters
- Food: Gurudwara langar (free, any Gurudwara), Feeding India, Happy Fridge
- Jobs/Skills: ETASHA Society (011-41627070), Chetanalaya, KVIC, Primero, Skill India
- Aadhaar: UIDAI 1947 | Any Aadhaar enrollment center
- PAN Card: Income Tax office or NSDL/UTIITSL online
- Bank Account: Jan Dhan Yojana — any bank, free, zero balance
- Education: NIOS (011-40671000), IGNOU (1800-112-346) — open education, any age
- De-addiction: Naya Savera, Shafa Home, SPYM, AIIMS NTDDC (011-26588700)
- Healthcare: Mohalla Clinics (Delhi), government hospitals

=== LANGUAGE RULES (STRICTLY FOLLOW) ===
- HINDI mode: Respond ONLY in Hindi. Use Devanagari script. Simple, everyday Hindi.
- ENGLISH mode: Respond ONLY in simple English. No legal jargon unless explained.
- HINGLISH mode: Mix Hindi words (Roman script) with English naturally. Like common North Indians speak in cities. Example: "Aapka case weak lag raha hai because sirf ek witness hai aur woh bhi complainant ka relative hai. Bail ke liye strong grounds hain."

=== RESPONSE FORMAT ===
1. Direct answer first (1-2 sentences max)
2. Key points in bullet form (use • symbol)
3. What to do next (practical steps)
4. Relevant helpline if useful
5. Brief disclaimer: "Yeh general jaankari hai. Apne case ke liye ek vakeel se zaroor baat karein."

=== IMPORTANT NOTES ===
- Always be empathetic and warm. These families are scared and confused.
- If someone mentions mental distress or suicidal thoughts → immediately give iCall and Vandrevala numbers
- Never give specific case outcome predictions — only general legal information
- Recommend free legal aid (DLSA/NALSA) for those who cannot afford lawyers
- Reference actual organizations (Kunji, DLSA, etc.) not vague suggestions`;

app.post('/api/tts', async (req, res) => {
  const { text, voiceId } = req.body || {};

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text is required for TTS' });
  }

  if (!ELEVENLABS_API_KEY) {
    return res.status(500).json({ error: 'ELEVENLABS_API_KEY is not configured' });
  }

  try {
    const selectedVoice = typeof voiceId === 'string' && voiceId.trim()
      ? voiceId.trim()
      : ELEVENLABS_DEFAULT_VOICE;

    const ttsResp = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text: text.slice(0, 2200),
        model_id: ELEVENLABS_MODEL_ID,
        voice_settings: {
          stability: 0.45,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!ttsResp.ok) {
      const details = await ttsResp.text();
      throw new Error(`ElevenLabs request failed (${ttsResp.status}): ${details}`);
    }

    const audioBuffer = Buffer.from(await ttsResp.arrayBuffer());
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-store');
    return res.send(audioBuffer);
  } catch (error) {
    console.error('ElevenLabs TTS error:', error);
    return res.status(500).json({ error: 'TTS generation failed' });
  }
});

app.post('/api/chat', async (req, res) => {
  const { messages, language } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages required' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');

  const languageInstruction = {
    hindi: 'LANGUAGE: Respond in simple Hindi (Devanagari script) only.',
    english: 'LANGUAGE: Respond in simple English only.',
    hinglish: 'LANGUAGE: Respond in Hinglish — mix Hindi (Roman script) and English naturally, like common North Indians speak.'
  };

  const systemWithLang = SYSTEM_PROMPT + '\n\n' + (languageInstruction[language] || languageInstruction.hinglish);

  try {
    const formattedMessages = messages
      .filter((m) => m && typeof m.content === 'string' && m.content.trim())
      .map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

    while (formattedMessages.length && formattedMessages[0].role !== 'user') {
      formattedMessages.shift();
    }

    if (!formattedMessages.length) {
      return res.status(400).json({ error: 'At least one user message is required' });
    }

    const stream = await client.models.generateContentStream({
      model: 'gemini-2.5-flash-lite',
      contents: formattedMessages,
      config: {
        systemInstruction: systemWithLang,
        maxOutputTokens: 2048,
        temperature: 0.7,
      },
    });

    for await (const chunk of stream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Gemini API error:', error);
    const errorMsg = language === 'hindi'
      ? 'माफ़ करें, कुछ गड़बड़ी हो गई। कृपया दोबारा कोशिश करें।'
      : language === 'english'
      ? 'Sorry, an error occurred. Please try again.'
      : 'Maafi chahte hain, kuch problem aa gayi. Please dobara try karein.';
    res.write(`data: ${JSON.stringify({ text: errorMsg })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  }
});

// Serve React build in production
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(clientDist, 'index.html'));
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🏛️  Nyay Setu server running on http://localhost:${PORT}\n`);
});
