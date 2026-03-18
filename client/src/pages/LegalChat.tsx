import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp, t } from '../context/AppContext';
import { Language } from '../context/AppContext';
import { speakWithElevenLabs, stopTTS } from '../utils/tts';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  id: string;
}

const QUICK_CATEGORIES = [
  {
    id: 'bail',
    label: { hindi: '🔒 ज़मानत', english: '🔒 Bail', hinglish: '🔒 Bail' },
    questions: {
      hindi: [
        'जमानत मिलेगी क्या?', 'जमानत के लिए क्या आधार चाहिए?',
        'जमानत अस्वीकार हो गई, अब क्या?', 'पूर्व ज़मानत क्या होती है?',
        'डिफ़ॉल्ट जमानत कब मिलती है?',
      ],
      english: [
        'Can I get bail?', 'What are the grounds for bail?',
        'Bail was rejected, what now?', 'What is anticipatory bail?',
        'When can I get default bail?',
      ],
      hinglish: [
        'Bail milegi kya?', 'Bail ke liye kya grounds chahiye?',
        'Bail reject ho gayi, ab kya karein?', 'Anticipatory bail kya hoti hai?',
        'Default bail kab milti hai?',
      ],
    },
  },
  {
    id: 'fir',
    label: { hindi: '📋 FIR', english: '📋 FIR', hinglish: '📋 FIR' },
    questions: {
      hindi: [
        'FIR क्या होती है?', 'FIR की copy कैसे मिलेगी?',
        'FIR में धाराएं क्या हैं?', 'FIR को कैसे चुनौती दें?',
        'FIR के बाद क्या होता है?',
      ],
      english: [
        'What is an FIR?', 'How to get a copy of FIR?',
        'What do sections in FIR mean?', 'How to challenge a false FIR?',
        'What happens after FIR is filed?',
      ],
      hinglish: [
        'FIR kya hoti hai?', 'FIR ki copy kaise milegi?',
        'FIR mein jo sections hain woh kya hain?', 'FIR ko kaise challenge karein?',
        'FIR ke baad kya hoga?',
      ],
    },
  },
  {
    id: 'case',
    label: { hindi: '⚖️ केस', english: '⚖️ Case', hinglish: '⚖️ Case' },
    questions: {
      hindi: [
        'केस मजबूत है या कमजोर?', 'गवाह का क्या असर होगा?',
        'सबूत को कैसे चुनौती दें?', 'चार्जशीट क्या होती है?',
        'अधिकतम सज़ा क्या हो सकती है?',
      ],
      english: [
        'Is the case strong or weak?', 'How important are witnesses?',
        'How to challenge the evidence?', 'What is a chargesheet?',
        'What is the maximum punishment?',
      ],
      hinglish: [
        'Case strong hai ya weak?', 'Witness ka kya impact hai?',
        'Evidence ko kaise challenge karein?', 'Chargesheet kya hoti hai?',
        'Maximum punishment kya ho sakti hai?',
      ],
    },
  },
  {
    id: 'court',
    label: { hindi: '🏛️ अदालत', english: '🏛️ Court', hinglish: '🏛️ Court' },
    questions: {
      hindi: [
        'अगली तारीख पर क्या होगा?', 'केस कब खत्म होगा?',
        'मुफ्त वकील कैसे मिलेगा?', 'FSL रिपोर्ट का क्या असर है?',
        'High Court में जाना होगा?',
      ],
      english: [
        'What will happen at next hearing?', 'When will the case end?',
        'How to get a free lawyer?', 'What is the impact of FSL report?',
        'Do I need to go to High Court?',
      ],
      hinglish: [
        'Next hearing mein kya hoga?', 'Case kab khatam hoga?',
        'Free vakeel kaise milega?', 'FSL report ka kya role hai?',
        'High Court mein jaana padega?',
      ],
    },
  },
  {
    id: 'family',
    label: { hindi: '👨‍👩‍👧 परिवार', english: '👨‍👩‍👧 Family', hinglish: '👨‍👩‍👧 Family' },
    questions: {
      hindi: [
        'जेल में मुलाकात कैसे करें?', 'सरकारी वकील मिल सकता है?',
        'परिवार की मदद कैसे करें?', 'जेल में पैसे कैसे भेजें?',
        'मानसिक तनाव से कैसे बचें?',
      ],
      english: [
        'How to visit someone in jail?', 'Can I get a government lawyer?',
        'How to support the family?', 'How to send money to jail?',
        'How to cope with mental stress?',
      ],
      hinglish: [
        'Jail mein mulakat kaise karein?', 'Sarkari vakeel mil sakta hai?',
        'Parivaar ki madad kaise karein?', 'Jail mein paise kaise bhejein?',
        'Mental stress se kaise deal karein?',
      ],
    },
  },
];

const placeholders = {
  hindi: 'अपना सवाल यहाँ लिखें...',
  english: 'Type your question here...',
  hinglish: 'Apna sawaal yahan likhein...',
};

const welcomeMessages = {
  hindi: `नमस्ते! मैं न्याय सेतु हूँ — आपकी कानूनी मदद के लिए।\n\nमैं इन विषयों में मदद कर सकता हूँ:\n• FIR और धाराओं की जानकारी\n• जमानत के विकल्प\n• चार्जशीट और सबूत\n• अदालती प्रक्रिया\n• जेल के बाद की मदद\n\nनीचे से कोई सवाल चुनें या खुद टाइप करें।`,
  english: `Hello! I'm Nyay Setu — your legal aid assistant.\n\nI can help with:\n• Understanding FIR and sections\n• Bail options and procedure\n• Chargesheet and evidence\n• Court process and timeline\n• Post-release support\n\nTap a quick question below or type your own.`,
  hinglish: `Namaste! Main Nyay Setu hoon — aapki kanoon mein madad ke liye.\n\nMain in chizon mein help kar sakta hoon:\n• FIR aur sections ki jaankari\n• Bail ke options aur process\n• Chargesheet aur evidence\n• Court ka process\n• Jail ke baad ki madad\n\nNeeche se sawaal chunein ya khud likhein.`,
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  useEffect(() => {
    const question = location.state?.question;
    if (question) { sendMessage(question); window.history.replaceState({}, ''); }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: text.trim(), id: Date.now().toString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setShowQuickQ(false);

    const aiMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { role: 'assistant', content: '', id: aiMsgId }]);

    try {
      const history = [...messages, userMsg]
        .filter(m => m.content)
        .map(m => ({ role: m.role, content: m.content }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, language }),
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
  }, [messages, language, isLoading]);

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

  const formatMessage = (text: string) =>
    text.split('\n').map((line, i) => {
      if (line.startsWith('• ') || line.startsWith('- '))
        return (
          <div key={i} className="flex gap-2 my-1.5">
            <span className="flex-shrink-0 font-bold mt-0.5" style={{ color: 'var(--c-primary)' }}>•</span>
            <span>{line.slice(2)}</span>
          </div>
        );
      if (line.startsWith('**') && line.endsWith('**'))
        return <div key={i} className="font-extrabold mt-3 mb-1" style={{ color: 'var(--c-heading)' }}>{line.slice(2, -2)}</div>;
      if (line === '') return <div key={i} className="h-1.5" />;
      return <div key={i}>{line}</div>;
    });

  const currentCat = QUICK_CATEGORIES[activeCategory];

  return (
    <div className="flex flex-col h-dvh" style={{ background: 'var(--c-bg)' }}>

      {/* ── Header ── */}
      <div className="theme-header px-4 pt-10 pb-3 flex items-center gap-3">
        <button onClick={() => navigate('/home')} className="text-xl p-1 -ml-1 text-white/70 hover:text-white transition-colors">←</button>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: 'var(--c-primary)' }}
        >
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
        📞 Kunji Helpline: <strong>1800-313-4963</strong> | NALSA: <strong>1516</strong>
      </a>

      {/* ── Quick Questions Panel ── */}
      {showQuickQ && (
        <div
          className="border-b"
          style={{ background: 'var(--c-surface)', borderColor: 'var(--c-border)' }}
        >
          {/* Category tabs */}
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
          {/* Questions */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 px-3 pb-3">
            {(currentCat.questions[language as Language] as string[]).map((q, i) => (
              <button key={i} onClick={() => sendMessage(q)} className="quick-btn" disabled={isLoading}>
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-5xl mx-auto w-full">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} message-enter`}>
            {msg.role === 'assistant' && (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 mr-2 mt-1"
                style={{ background: 'var(--c-primary)', color: 'white' }}
              >
                ⚖️
              </div>
            )}
            <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
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
                  className="mt-2 text-xs font-semibold flex items-center gap-1 transition-colors hover:text-[#C85828]"
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
      <div
        className="px-3 pt-2 pb-3 border-t"
        style={{ background: 'var(--c-surface)', borderColor: 'var(--c-border)' }}
      >
        <div className="max-w-5xl mx-auto w-full">
          <div className="flex items-end gap-2">
            {/* Mic button */}
            <button
              onClick={startVoice}
              title="Voice input"
              className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 text-lg transition-all
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
                         focus:ring-2 focus:ring-[#C85828] focus:border-transparent max-h-24 leading-relaxed"
              style={{
                background: 'var(--c-bg)',
                color: 'var(--c-text)',
                borderColor: 'var(--c-border)',
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
              }}
            />

            {/* Send button */}
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              className="w-11 h-11 rounded-full text-white flex items-center justify-center text-base
                         flex-shrink-0 active:scale-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'var(--c-primary)' }}
            >
              {isLoading ? '⏳' : '➤'}
            </button>
          </div>

          {isRecording && (
            <p className="text-center text-xs font-semibold mt-1.5 animate-pulse" style={{ color: 'var(--c-danger)' }}>
              🔴 {t(language, { hindi: 'सुन रहे हैं...', english: 'Listening...', hinglish: 'Sun rahe hain...' })}
            </p>
          )}

          {/* Stop voice button */}
          <button
            onClick={stopTTS}
            className="w-full mt-2 rounded-xl py-2 text-xs font-semibold border transition-colors"
            style={{ borderColor: 'var(--c-border)', color: 'var(--c-muted)', background: 'transparent' }}
          >
            ⏹ {t(language, { hindi: 'आवाज़ बंद करें', english: 'Stop Voice', hinglish: 'Voice Band Karein' })}
          </button>
        </div>
      </div>
    </div>
  );
}
