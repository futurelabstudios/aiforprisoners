/**
 * Nyay Setu — /api/chat  (Netlify Functions v2, ESM)
 *
 * Uses the Gemini REST API directly (no SDK dependency → nothing to bundle).
 * Streams Server-Sent Events back to the client.
 */

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
- 34 IPC: Common intention — adds shared liability
- 212 IPC: Harbouring offender — up to 3-5 years

EVIDENCE WEAKNESSES (Challenge Points):
- Independent witness absent: If witnesses are only police or complainant's relatives → weaker case
- FSL report pending: Incomplete forensic evidence = incomplete case
- Delay in arrest: Long gap between crime and arrest → questions arise
- No direct evidence: Only circumstantial evidence → harder to prove
- Confession to police: Under Section 25 Evidence Act → NOT admissible
- Medical evidence: Critical in assault/rape; absence or discrepancy weakens case
- Alibi: If accused was elsewhere → strong defense

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

POST-RELEASE SUPPORT (Delhi & national):
- Shelter: Delhi Urban Shelter Improvement Board | Rain Basera shelters
- Food: Gurudwara langar (free), Feeding India, Happy Fridge
- Jobs/Skills: ETASHA Society (011-41627070), Chetanalaya, KVIC, Skill India
- Aadhaar: UIDAI 1947 | Any Aadhaar enrollment center
- PAN Card: Income Tax office or NSDL/UTIITSL online
- Bank Account: Jan Dhan Yojana — any bank, free, zero balance
- Education: NIOS (011-40671000), IGNOU (1800-112-346) — open education, any age
- De-addiction: Naya Savera, Shafa Home, SPYM, AIIMS NTDDC (011-26588700)

=== LANGUAGE RULES (STRICTLY FOLLOW) ===
- HINDI mode: Respond ONLY in Hindi. Use Devanagari script. Simple, everyday Hindi.
- ENGLISH mode: Respond ONLY in simple English. No legal jargon unless explained.
- HINGLISH mode: Mix Hindi words (Roman script) with English naturally. Like common North Indians speak.

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

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  const SSE_HEADERS = {
    ...CORS_HEADERS,
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "X-Accel-Buffering": "no",
  };

  // Parse body
  let messages, language;
  try {
    ({ messages, language } = await req.json());
  } catch {
    return new Response(
      `data: ${JSON.stringify({ text: "Invalid request body" })}\n\ndata: [DONE]\n\n`,
      { status: 400, headers: SSE_HEADERS }
    );
  }

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return new Response(
      `data: ${JSON.stringify({ text: "Messages array is required" })}\n\ndata: [DONE]\n\n`,
      { status: 400, headers: SSE_HEADERS }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(
      `data: ${JSON.stringify({ text: "API key not configured" })}\n\ndata: [DONE]\n\n`,
      { status: 500, headers: SSE_HEADERS }
    );
  }

  // Build language instruction
  const langInstructions = {
    hindi: "IMPORTANT: Respond ONLY in simple Hindi using Devanagari script.",
    english: "IMPORTANT: Respond ONLY in simple, clear English.",
    hinglish: "IMPORTANT: Respond in Hinglish — natural mix of Hindi (Roman script) and English.",
  };
  const systemText = SYSTEM_PROMPT + "\n\n" + (langInstructions[language] || langInstructions.hinglish);

  // Format messages for Gemini REST API
  const formattedContents = messages
    .filter((m) => m && typeof m.content === "string" && m.content.trim())
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content.trim() }],
    }));

  // Ensure first message is from user
  while (formattedContents.length && formattedContents[0].role !== "user") {
    formattedContents.shift();
  }

  if (!formattedContents.length) {
    return new Response(
      `data: ${JSON.stringify({ text: "Please ask a question." })}\n\ndata: [DONE]\n\n`,
      { status: 200, headers: SSE_HEADERS }
    );
  }

  // Call Gemini REST API with streaming (SSE)
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${apiKey}`;

  const geminiBody = {
    system_instruction: { parts: [{ text: systemText }] },
    contents: formattedContents,
    generationConfig: {
      maxOutputTokens: 2048,
      temperature: 0.7,
    },
  };

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const enq = (text) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));

      try {
        const geminiResp = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(geminiBody),
        });

        if (!geminiResp.ok) {
          const errText = await geminiResp.text();
          console.error("Gemini API error:", geminiResp.status, errText);
          const userErr =
            language === "hindi"
              ? "माफ़ करें, AI अभी उपलब्ध नहीं है। कृपया दोबारा कोशिश करें।"
              : language === "english"
              ? "Sorry, AI is temporarily unavailable. Please try again."
              : "Maafi chahte hain, AI abhi available nahi hai. Dobara try karein.";
          enq(userErr);
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
          return;
        }

        // Parse the SSE stream from Gemini
        const reader = geminiResp.body.getReader();
        const dec = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += dec.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? ""; // keep incomplete line in buffer

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const raw = line.slice(6).trim();
            if (!raw || raw === "[DONE]") continue;

            try {
              const parsed = JSON.parse(raw);
              const text =
                parsed?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
              if (text) enq(text);
            } catch {
              // Ignore malformed chunks
            }
          }
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } catch (err) {
        console.error("Streaming error:", err);
        const fallback =
          language === "hindi"
            ? "माफ़ करें, कुछ गड़बड़ी हो गई। कृपया दोबारा कोशिश करें।"
            : language === "english"
            ? "Sorry, an error occurred. Please try again."
            : "Kuch gadbad ho gayi. Please dobara try karein.";
        enq(fallback);
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { status: 200, headers: SSE_HEADERS });
};

export const config = { path: "/api/chat" };
