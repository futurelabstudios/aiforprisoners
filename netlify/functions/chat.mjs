import { GoogleGenAI } from "@google/genai";

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

FIR (PRATHAM SUCHNA REPORT / प्रथम सूचना रिपोर्त):
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

EVIDENCE WEAKNESSES (Challenge Points):
- Independent witness absent: If witnesses are only police or complainant's relatives → weaker case
- FSL report pending: Incomplete forensic evidence = incomplete case
- Delay in arrest: Long gap between crime and arrest → questions arise
- No direct evidence: Only circumstantial evidence → harder to prove
- Confession to police: Under Section 25 Evidence Act → NOT admissible

=== RESOURCES ===
PRIMARY HELPLINE:
- Kunji Helpline (Project Second Chance): 1800-313-4963 | Daily 8am-11pm | FREE | Run by TYCIA Foundation

LEGAL AID (FREE):
- National Legal Services Authority (NALSA): 1516 | 24/7 | FREE
- DLSA (District Legal Services Authority): Every district has one | Free lawyers for poor
- Human Rights Law Network (HRLN): 011-24374501

MENTAL HEALTH:
- iCall (TISS): 9152987821 | Hindi + English
- Vandrevala Foundation: 1860-2662-345 | 24/7
- NIMHANS Helpline: 080-46110007

EMERGENCY: Police: 100 | Ambulance: 108 | Women: 181 | Child: 1098

=== LANGUAGE RULES (STRICTLY FOLLOW) ===
- HINDI mode: Respond ONLY in Hindi. Use Devanagari script. Simple, everyday Hindi.
- ENGLISH mode: Respond ONLY in simple English. No legal jargon unless explained.
- HINGLISH mode: Mix Hindi words (Roman script) with English naturally.

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
- Recommend free legal aid (DLSA/NALSA) for those who cannot afford lawyers`;

export default async (req) => {
  // CORS headers for all responses
  const headers = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "X-Accel-Buffering": "no",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  let messages, language;
  try {
    ({ messages, language } = await req.json());
  } catch {
    return new Response("data: " + JSON.stringify({ text: "Invalid request" }) + "\n\ndata: [DONE]\n\n", { status: 400, headers });
  }

  if (!messages || !Array.isArray(messages)) {
    return new Response("data: " + JSON.stringify({ text: "Messages required" }) + "\n\ndata: [DONE]\n\n", { status: 400, headers });
  }

  const languageInstruction = {
    hindi: "LANGUAGE: Respond in simple Hindi (Devanagari script) only.",
    english: "LANGUAGE: Respond in simple English only.",
    hinglish: "LANGUAGE: Respond in Hinglish — mix Hindi (Roman script) and English naturally.",
  };

  const systemWithLang = SYSTEM_PROMPT + "\n\n" + (languageInstruction[language] || languageInstruction.hinglish);

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        const formattedMessages = messages
          .filter((m) => m && typeof m.content === "string" && m.content.trim())
          .map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
          }));

        while (formattedMessages.length && formattedMessages[0].role !== "user") {
          formattedMessages.shift();
        }

        if (!formattedMessages.length) {
          controller.enqueue(encoder.encode("data: " + JSON.stringify({ text: "Please ask a question." }) + "\n\n"));
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
          return;
        }

        const geminiStream = await client.models.generateContentStream({
          model: "gemini-2.0-flash",
          contents: formattedMessages,
          config: { systemInstruction: systemWithLang, maxOutputTokens: 2048, temperature: 0.7 },
        });

        for await (const chunk of geminiStream) {
          if (chunk.text) {
            controller.enqueue(encoder.encode("data: " + JSON.stringify({ text: chunk.text }) + "\n\n"));
          }
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch (err) {
        console.error("Gemini error:", err);
        const errText = language === "hindi"
          ? "माफ़ करें, कुछ गड़बड़ी हो गई। कृपया दोबारा कोशिश करें।"
          : language === "english"
          ? "Sorry, an error occurred. Please try again."
          : "Maafi chahte hain, kuch problem aa gayi. Please dobara try karein.";
        controller.enqueue(encoder.encode("data: " + JSON.stringify({ text: errText }) + "\n\n"));
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      }
      controller.close();
    },
  });

  return new Response(stream, { status: 200, headers });
};

export const config = { path: "/api/chat" };
