import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp, t } from '../context/AppContext';
import { Language } from '../context/AppContext';
import { speakWithElevenLabs, stopTTS } from '../utils/tts';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  id: string;
  attachmentName?: string;
  attachmentThumb?: string; // data-url for images
}

interface Attachment {
  data: string;       // base64 (no data-url prefix)
  mimeType: string;
  name: string;
  thumb?: string;     // data-url for image preview
  isImage: boolean;
}

const QUICK_CATEGORIES = [
  {
    id: 'bail',
    label: { hindi: '🔒 ज़मानत', english: '🔒 Bail', hinglish: '🔒 Bail' },
    questions: {
      hindi: ['जमानत मिलेगी क्या?','जमानत के लिए क्या आधार चाहिए?','जमानत अस्वीकार हो गई, अब क्या?','पूर्व ज़मानत क्या होती है?','डिफ़ॉल्ट जमानत कब मिलती है?'],
      english: ['Can I get bail?','What are the grounds for bail?','Bail was rejected, what now?','What is anticipatory bail?','When can I get default bail?'],
      hinglish: ['Bail milegi kya?','Bail ke liye kya grounds chahiye?','Bail reject ho gayi, ab kya karein?','Anticipatory bail kya hoti hai?','Default bail kab milti hai?'],
    },
  },
  {
    id: 'fir',
    label: { hindi: '📋 FIR', english: '📋 FIR', hinglish: '📋 FIR' },
    questions: {
      hindi: ['FIR क्या होती है?','FIR की copy कैसे मिलेगी?','FIR में धाराएं क्या हैं?','FIR को कैसे चुनौती दें?','FIR के बाद क्या होता है?'],
      english: ['What is an FIR?','How to get a copy of FIR?','What do sections in FIR mean?','How to challenge a false FIR?','What happens after FIR is filed?'],
      hinglish: ['FIR kya hoti hai?','FIR ki copy kaise milegi?','FIR mein jo sections hain woh kya hain?','FIR ko kaise challenge karein?','FIR ke baad kya hoga?'],
    },
  },
  {
    id: 'case',
    label: { hindi: '⚖️ केस', english: '⚖️ Case', hinglish: '⚖️ Case' },
    questions: {
      hindi: ['केस मजबूत है या कमजोर?','गवाह का क्या असर होगा?','सबूत को कैसे चुनौती दें?','चार्जशीट क्या होती है?','अधिकतम सज़ा क्या हो सकती है?'],
      english: ['Is the case strong or weak?','How important are witnesses?','How to challenge evidence?','What is a chargesheet?','What is the maximum punishment?'],
      hinglish: ['Case strong hai ya weak?','Witness ka kya impact hai?','Evidence ko kaise challenge karein?','Chargesheet kya hoti hai?','Maximum punishment kya ho sakti hai?'],
    },
  },
  {
    id: 'court',
    label: { hindi: '🏛️ अदालत', english: '🏛️ Court', hinglish: '🏛️ Court' },
    questions: {
      hindi: ['अगली तारीख पर क्या होगा?','केस कब खत्म होगा?','मुफ्त वकील कैसे मिलेगा?','FSL रिपोर्ट का क्या असर है?','High Court में जाना होगा?'],
      english: ['What will happen at next hearing?','When will the case end?','How to get a free lawyer?','What is the impact of FSL report?','Do I need to go to High Court?'],
      hinglish: ['Next hearing mein kya hoga?','Case kab khatam hoga?','Free vakeel kaise milega?','FSL report ka kya role hai?','High Court mein jaana padega?'],
    },
  },
  {
    id: 'family',
    label: { hindi: '👨‍👩‍👧 परिवार', english: '👨‍👩‍👧 Family', hinglish: '👨‍👩‍👧 Family' },
    questions: {
      hindi: ['जेल में मुलाकात कैसे करें?','सरकारी वकील मिल सकता है?','परिवार की मदद कैसे करें?','जेल में पैसे कैसे भेजें?','मानसिक तनाव से कैसे बचें?'],
      english: ['How to visit someone in jail?','Can I get a government lawyer?','How to support the family?','How to send money to jail?','How to cope with mental stress?'],
      hinglish: ['Jail mein mulakat kaise karein?','Sarkari vakeel mil sakta hai?','Parivaar ki madad kaise karein?','Jail mein paise kaise bhejein?','Mental stress se kaise deal karein?'],
    },
  },
];

const placeholders = {
  hindi: 'सवाल लिखें या दस्तावेज़ अपलोड करें...',
  english: 'Type your question or upload a document...',
  hinglish: 'Sawaal likhein ya document upload karein...',
};

const welcomeMessages = {
  hindi: `नमस्ते! मैं न्याय सेतु हूँ — आपकी कानूनी मदद के लिए।\n\nमैं इन विषयों में मदद कर सकता हूँ:\n• FIR और धाराओं की जानकारी\n• जमानत के विकल्प\n• चार्जशीट और सबूत\n• अदालती प्रक्रिया\n• जेल के बाद की मदद\n\n📎 आप कोई भी कानूनी दस्तावेज़ (FIR, जमानत पत्र, चार्जशीट) की फोटो या PDF भी भेज सकते हैं — मैं उसे समझाऊंगा।`,
  english: `Hello! I'm Nyay Setu — your legal aid assistant.\n\nI can help with:\n• Understanding FIR and sections\n• Bail options and procedure\n• Chargesheet and evidence\n• Court process and timeline\n• Post-release support\n\n📎 You can also upload or photograph any legal document (FIR, bail order, chargesheet) and I will explain it to you in simple language.`,
  hinglish: `Namaste! Main Nyay Setu hoon — aapki kanoon mein madad ke liye.\n\nMain in chizon mein help kar sakta hoon:\n• FIR aur sections ki jaankari\n• Bail ke options aur process\n• Chargesheet aur evidence\n• Court ka process\n• Jail ke baad ki madad\n\n📎 Aap koi bhi legal document (FIR, bail order, chargesheet) ki photo ya PDF bhi bhej sakte hain — main samjhaunga.`,
};

interface SpeechRecognitionResult { readonly 0: { transcript: string }; }
interface SpeechRecognitionResultList { [index: number]: SpeechRecognitionResult; length: number; }
interface SpeechRecognitionEvent extends Event { results: SpeechRecognitionResultList; }
interface SpeechRecognitionInstance extends EventTarget {
  lang: string; continuous: boolean; interimResults: boolean;
  start(): void; stop(): void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

const MAX_FILE_MB = 4;

export default function LegalChat() {
  const { language } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: welcomeMessages[language], id: 'welcome' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [showQuickQ, setShowQuickQ] = useState(true);
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [attachError, setAttachError] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const question = location.state?.question;
    if (question) { sendMessage(question); window.history.replaceState({}, ''); }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* ── File handling ── */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setAttachError('');

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_FILE_MB) {
      setAttachError(t(language, {
        hindi: `फ़ाइल ${MAX_FILE_MB}MB से बड़ी है। छोटी फ़ाइल चुनें।`,
        english: `File exceeds ${MAX_FILE_MB}MB. Please choose a smaller file.`,
        hinglish: `File ${MAX_FILE_MB}MB se badi hai. Chhoti file chunein.`,
      }));
      return;
    }

    const allowed = ['image/jpeg','image/png','image/webp','image/gif','application/pdf'];
    if (!allowed.includes(file.type)) {
      setAttachError(t(language, {
        hindi: 'केवल JPG, PNG, WebP या PDF फ़ाइलें स्वीकृत हैं।',
        english: 'Only JPG, PNG, WebP, or PDF files are accepted.',
        hinglish: 'Sirf JPG, PNG, WebP ya PDF files accept hoti hain.',
      }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1];
      const isImage = file.type.startsWith('image/');
      setAttachment({
        data: base64,
        mimeType: file.type,
        name: file.name,
        thumb: isImage ? dataUrl : undefined,
        isImage,
      });
    };
    reader.readAsDataURL(file);
  };

  const clearAttachment = () => {
    setAttachment(null);
    setAttachError('');
  };

  /* ── Send message ── */
  const sendMessage = useCallback(async (text: string) => {
    const hasContent = text.trim() || attachment;
    if (!hasContent || isLoading) return;

    const userMsg: Message = {
      role: 'user',
      content: text.trim() || t(language, {
        hindi: '(दस्तावेज़ भेजा गया)',
        english: '(document sent)',
        hinglish: '(document bheja)',
      }),
      id: Date.now().toString(),
      attachmentName: attachment?.name,
      attachmentThumb: attachment?.thumb,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    const currentAttachment = attachment;
    setAttachment(null);
    setIsLoading(true);
    setShowQuickQ(false);

    const aiMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { role: 'assistant', content: '', id: aiMsgId }]);

    try {
      const history = [...messages, userMsg]
        .filter(m => m.content)
        .map(m => ({ role: m.role, content: m.content }));

      const body: Record<string, unknown> = { messages: history, language };
      if (currentAttachment) {
        body.attachment = { data: currentAttachment.data, mimeType: currentAttachment.mimeType };
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') break;
          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              fullText += parsed.text;
              setMessages(prev =>
                prev.map(m => m.id === aiMsgId ? { ...m, content: fullText } : m)
              );
            }
          } catch { /* ignore */ }
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev =>
        prev.map(m => m.id === aiMsgId ? {
          ...m,
          content: t(language, {
            hindi: '❌ माफ़ करें, कुछ गड़बड़ी हुई। कृपया दोबारा कोशिश करें।',
            english: '❌ Sorry, an error occurred. Please try again.',
            hinglish: '❌ Kuch problem aa gayi. Please dobara try karein.',
          })
        } : m)
      );
    } finally {
      setIsLoading(false);
    }
  }, [messages, language, isLoading, attachment]);

  /* ── Voice input ── */
  const startVoice = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) { alert('Voice input requires Chrome browser'); return; }
    if (isRecording) { recognitionRef.current?.stop(); setIsRecording(false); return; }

    const recognition = new SpeechRec();
    recognition.lang = language === 'english' ? 'en-IN' : 'hi-IN';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onresult = (e: SpeechRecognitionEvent) => {
      let t = '';
      for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
      setInput(t);
    };
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => setIsRecording(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  /* ── Message formatter ── */
  const formatMessage = (text: string) =>
    text.split('\n').map((line, i) => {
      if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* '))
        return (
          <div key={i} className="flex gap-2 my-1.5">
            <span className="flex-shrink-0 font-bold mt-0.5" style={{ color: 'var(--c-primary)' }}>•</span>
            <span>{line.slice(2)}</span>
          </div>
        );
      if (/^\*\*(.+)\*\*$/.test(line))
        return <div key={i} className="font-extrabold mt-3 mb-1" style={{ color: 'var(--c-heading)' }}>{line.replace(/\*\*/g, '')}</div>;
      if (/^#+\s/.test(line))
        return <div key={i} className="font-extrabold text-base mt-3 mb-1" style={{ color: 'var(--c-heading)' }}>{line.replace(/^#+\s/, '')}</div>;
      if (line === '') return <div key={i} className="h-1.5" />;
      return <div key={i}>{line}</div>;
    });

  const currentCat = QUICK_CATEGORIES[activeCategory];

  return (
    <div className="flex flex-col h-dvh" style={{ background: 'var(--c-bg)' }}>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
        className="hidden"
        onChange={handleFileSelect}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* ── Header ── */}
      <div className="theme-header px-4 pt-10 pb-3 flex items-center gap-3">
        <button onClick={() => navigate('/home')} className="text-xl p-1 -ml-1 text-white/70 hover:text-white transition-colors">←</button>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: 'var(--c-primary)' }}>
          ⚖️
        </div>
        <div className="flex-1">
          <div className="font-extrabold text-base text-white leading-tight">Legal AI Assistant</div>
          <div className="text-xs flex items-center gap-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
            <span className="dot-live" />
            {t(language, { hindi: 'जवाब दे रहा है', english: 'Ready to help', hinglish: 'Jawab dene ke liye tayaar' })}
          </div>
        </div>
        <button
          onClick={() => setShowQuickQ(v => !v)}
          className="rounded-xl px-3 py-1.5 text-xs font-bold transition-all"
          style={{ background: 'rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.80)' }}
        >
          {showQuickQ ? '▲ Hide' : '▼ Show'}
        </button>
      </div>

      {/* ── Emergency banner ── */}
      <a href="tel:18003134963" className="emergency-banner text-xs">
        📞 Kunji: <strong>1800-313-4963</strong> | NALSA: <strong>1516</strong>
      </a>

      {/* ── Quick Questions Panel ── */}
      {showQuickQ && (
        <div className="border-b" style={{ background: 'var(--c-surface)', borderColor: 'var(--c-border)' }}>
          <div className="flex gap-1.5 px-3 pt-3 pb-2 overflow-x-auto no-scrollbar">
            {QUICK_CATEGORIES.map((cat, i) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(i)}
                className={`whitespace-nowrap px-3 py-1.5 text-xs font-bold flex-shrink-0 transition-all
                            ${i === activeCategory ? 'tab-active' : 'tab-inactive'}`}
              >
                {cat.label[language as Language]}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 px-3 pb-3">
            {(currentCat.questions[language as Language] as string[]).map((q, i) => (
              <button key={i} onClick={() => sendMessage(q)} className="quick-btn" disabled={isLoading}>
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Document upload hint banner (shown once) ── */}
      {messages.length === 1 && (
        <div
          className="mx-3 mt-2 rounded-2xl px-4 py-3 flex items-center gap-3"
          style={{ background: 'var(--c-primary-l)', border: '1px solid rgba(184,82,30,0.18)' }}
        >
          <span className="text-2xl flex-shrink-0">📄</span>
          <p className="text-xs leading-relaxed font-medium" style={{ color: 'var(--c-primary-d)' }}>
            {t(language, {
              hindi: 'FIR, जमानत पत्र, या चार्जशीट की फोटो / PDF अपलोड करें — AI समझाएगा।',
              english: 'Upload or photograph your FIR, bail order, or chargesheet — AI will explain it.',
              hinglish: 'Apni FIR, bail order ya chargesheet ki photo / PDF upload karein — AI samjhayega.',
            })}
          </p>
        </div>
      )}

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4 max-w-5xl mx-auto w-full">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} message-enter`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 mr-2 mt-1"
                style={{ background: 'var(--c-primary)', color: 'white' }}>
                ⚖️
              </div>
            )}
            <div className={`${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'} max-w-[80%]`}>
              {/* Attachment preview in message */}
              {msg.attachmentThumb && (
                <img
                  src={msg.attachmentThumb}
                  alt="document"
                  className="rounded-xl mb-2 w-full max-h-40 object-cover"
                />
              )}
              {msg.attachmentName && !msg.attachmentThumb && (
                <div
                  className="flex items-center gap-2 rounded-xl px-3 py-2 mb-2"
                  style={{
                    background: msg.role === 'user' ? 'rgba(255,255,255,0.15)' : 'var(--c-primary-l)',
                  }}
                >
                  <span className="text-lg">📄</span>
                  <span className="text-xs font-semibold truncate">{msg.attachmentName}</span>
                </div>
              )}
              <div className={`text-sm leading-relaxed ${msg.role === 'assistant' ? 'chat-prose' : ''}`}>
                {msg.role === 'assistant' ? formatMessage(msg.content) : msg.content}
                {msg.role === 'assistant' && isLoading && msg.content === '' && (
                  <div className="flex gap-1.5 py-2">
                    <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
                  </div>
                )}
              </div>
              {msg.role === 'assistant' && msg.content && (
                <button
                  onClick={() => speakWithElevenLabs(msg.content)}
                  className="mt-2 text-xs font-semibold flex items-center gap-1 hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--c-muted)' }}
                >
                  🔊 {t(language, { hindi: 'सुनें', english: 'Listen', hinglish: 'Sunein' })}
                </button>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input area ── */}
      <div className="px-3 pt-2 pb-3 border-t" style={{ background: 'var(--c-surface)', borderColor: 'var(--c-border)' }}>
        <div className="max-w-5xl mx-auto w-full space-y-2">

          {/* Attachment preview strip */}
          {attachment && (
            <div
              className="flex items-center gap-2 rounded-2xl px-3 py-2"
              style={{ background: 'var(--c-primary-l)', border: '1px solid rgba(184,82,30,0.20)' }}
            >
              {attachment.isImage ? (
                <img src={attachment.thumb} alt="preview" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: 'var(--c-primary)', color: 'white' }}>
                  📄
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate" style={{ color: 'var(--c-primary-d)' }}>{attachment.name}</p>
                <p className="text-xs" style={{ color: 'var(--c-primary)' }}>
                  {t(language, { hindi: 'तैयार — सवाल लिखें या सीधे भेजें', english: 'Ready — type a question or send now', hinglish: 'Tayaar — sawaal likhein ya seedha bhejein' })}
                </p>
              </div>
              <button onClick={clearAttachment} className="text-lg p-1 flex-shrink-0" style={{ color: 'var(--c-primary)' }}>
                ✕
              </button>
            </div>
          )}

          {/* Error message */}
          {attachError && (
            <p className="text-xs font-semibold px-1" style={{ color: 'var(--c-danger)' }}>⚠️ {attachError}</p>
          )}

          {/* Main input row */}
          <div className="flex items-end gap-2">
            {/* Mic */}
            <button
              onClick={startVoice}
              title="Voice input"
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-base transition-all
                         ${isRecording ? 'bg-red-500 text-white mic-recording' : ''}`}
              style={isRecording ? {} : { background: 'var(--c-bg)', color: 'var(--c-muted)', border: '1px solid var(--c-border)' }}
            >
              🎙️
            </button>

            {/* Text input */}
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={placeholders[language]}
              rows={1}
              className="flex-1 rounded-2xl px-4 py-2.5 text-sm resize-none border outline-none
                         focus:ring-2 max-h-24 leading-relaxed"
              style={{
                background: 'var(--c-bg)',
                color: 'var(--c-text)',
                borderColor: 'var(--c-border)',
                ['--tw-ring-color' as string]: 'var(--c-primary)',
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
              }}
            />

            {/* Attach from gallery / files */}
            <button
              onClick={() => fileInputRef.current?.click()}
              title={t(language, { hindi: 'दस्तावेज़ अपलोड', english: 'Upload document', hinglish: 'Document upload' })}
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-base transition-all active:scale-90"
              style={{ background: 'var(--c-bg)', color: 'var(--c-muted)', border: '1px solid var(--c-border)' }}
            >
              📎
            </button>

            {/* Camera (mobile) */}
            <button
              onClick={() => cameraInputRef.current?.click()}
              title={t(language, { hindi: 'फोटो खींचें', english: 'Take photo', hinglish: 'Photo lo' })}
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-base transition-all active:scale-90"
              style={{ background: 'var(--c-bg)', color: 'var(--c-muted)', border: '1px solid var(--c-border)' }}
            >
              📸
            </button>

            {/* Send */}
            <button
              onClick={() => sendMessage(input)}
              disabled={(!input.trim() && !attachment) || isLoading}
              className="w-10 h-10 rounded-full text-white flex items-center justify-center text-base
                         flex-shrink-0 active:scale-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'var(--c-primary)' }}
            >
              {isLoading ? '⏳' : '➤'}
            </button>
          </div>

          {isRecording && (
            <p className="text-center text-xs font-semibold animate-pulse" style={{ color: 'var(--c-danger)' }}>
              🔴 {t(language, { hindi: 'सुन रहे हैं...', english: 'Listening...', hinglish: 'Sun rahe hain...' })}
            </p>
          )}

          {/* Stop TTS */}
          <button
            onClick={stopTTS}
            className="w-full rounded-xl py-2 text-xs font-semibold border transition-colors"
            style={{ borderColor: 'var(--c-border)', color: 'var(--c-label)', background: 'transparent' }}
          >
            ⏹ {t(language, { hindi: 'आवाज़ बंद करें', english: 'Stop Voice', hinglish: 'Voice Band Karein' })}
          </button>
        </div>
      </div>
    </div>
  );
}
