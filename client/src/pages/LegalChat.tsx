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
    label: { hindi: '🔒 ज़मानत', english: '🔒 Bail', hinglish: '🔒 Bail / Zamaanat' },
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
        'FIR में जो धाराएं हैं वो क्या हैं?', 'FIR को कैसे चुनौती दें?',
        'FIR दर्ज होने के बाद क्या होता है?',
      ],
      english: [
        'What is an FIR?', 'How can I get a copy of the FIR?',
        'What do the sections in FIR mean?', 'How to challenge a false FIR?',
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
        'मुफ्त वकील कैसे मिलेगा?', 'अभी केस किस स्टेज पर है?',
        'FSL रिपोर्ट का क्या असर है?',
      ],
      english: [
        'What will happen at next hearing?', 'When will the case end?',
        'How to get a free lawyer?', 'What stage is the case at now?',
        'What is the impact of FSL report?',
      ],
      hinglish: [
        'Next hearing mein kya hoga?', 'Case kab khatam hoga?',
        'Free vakeel kaise milega?', 'Case abhi kis stage par hai?',
        'FSL report ka kya role hai?',
      ],
    },
  },
  {
    id: 'family',
    label: { hindi: '👨‍👩‍👧 परिवार', english: '👨‍👩‍👧 Family', hinglish: '👨‍👩‍👧 Parivaar' },
    questions: {
      hindi: [
        'जेल में मुलाकात कैसे करें?', 'सरकारी वकील मिल सकता है?',
        'परिवार को कैसे मदद करें?', 'जेल में पैसे कैसे भेजें?',
        'अपने को मानसिक तनाव से कैसे बचाएं?',
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

interface SpeechRecognitionResult {
  readonly 0: { transcript: string };
}
interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
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

  // Auto-send question from Home page
  useEffect(() => {
    const question = location.state?.question;
    if (question) {
      sendMessage(question);
      window.history.replaceState({}, '');
    }
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

      if (!response.ok) throw new Error('Server error');

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
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
            } catch {}
          }
        }
      }
    } catch {
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
    if (!SpeechRec) {
      alert('Voice input requires Chrome browser / Chrome browser mein kaam karta hai');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const recognition = new SpeechRec();
    recognition.lang = language === 'english' ? 'en-IN' : 'hi-IN';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      let transcript = '';
      for (let i = 0; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }
      setInput(transcript);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const speakText = async (text: string) => {
    try {
      await speakWithElevenLabs(text);
    } catch {
      alert(t(language, {
        hindi: 'आवाज़ नहीं चल पाई, कृपया दोबारा कोशिश करें।',
        english: 'Could not play voice right now, please try again.',
        hinglish: 'Awaaz play nahi hui, please dobara try karein.',
      }));
    }
  };

  const formatMessage = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('• ') || line.startsWith('- ')) {
        return (
          <div key={i} className="flex gap-2 my-1">
            <span className="text-[#C85828] font-bold mt-0.5">•</span>
            <span>{line.slice(2)}</span>
          </div>
        );
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <div key={i} className="font-bold text-[#1C0A02] mt-2">{line.slice(2, -2)}</div>;
      }
      if (line === '') return <div key={i} className="h-2" />;
      return <div key={i}>{line}</div>;
    });
  };

  const currentCat = QUICK_CATEGORIES[activeCategory];

  return (
    <div className="flex flex-col h-dvh bg-[#F7F6F3]">
      {/* Header */}
      <div className="theme-header px-4 pt-10 pb-3 flex items-center gap-3">
        <button onClick={() => navigate('/home')} className="text-2xl p-1 -ml-1">←</button>
        <div className="text-3xl">⚖️</div>
        <div className="flex-1">
          <div className="font-extrabold text-base">न्याय सेतु — Legal AI</div>
          <div className="text-xs text-white/50">
            {t(language, { hindi: 'कानूनी सवालों के जवाब', english: 'Legal Q&A', hinglish: 'Legal sawaalon ke jawab' })}
          </div>
        </div>
        <button
          onClick={() => setShowQuickQ(v => !v)}
          className="bg-white/10 rounded-xl px-3 py-1.5 text-xs font-semibold"
        >
          {showQuickQ ? '▼' : '▲'} {t(language, { hindi: 'सवाल', english: 'Q', hinglish: 'Sawaal' })}
        </button>
        <button
          onClick={() => navigate('/voice-guide')}
          className="bg-[#C85828] rounded-xl px-3 py-1.5 text-xs font-bold"
        >
          🎙️
        </button>
      </div>

      {/* Emergency Banner */}
      <a href="tel:18003134963" className="emergency-banner text-sm">
        📞 Kunji Helpline (Free): 1800-313-4963 | National Legal Aid: 1516
      </a>

      <div className="content-shell pt-3">
        <div className="section-kicker">AI LEGAL ASSISTANT LIVE</div>
      </div>

      {/* Quick Questions Panel */}
      {showQuickQ && (
        <div className="border-b glass-panel mx-3 mt-2" style={{borderColor:'var(--c-border)'}}>
          {/* Category tabs */}
          <div className="flex gap-2 px-3 py-2 overflow-x-auto no-scrollbar">
            {QUICK_CATEGORIES.map((cat, i) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(i)}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold flex-shrink-0
                           transition-all ${i === activeCategory ? 'tab-active' : 'tab-inactive'}`}
              >
                {cat.label[language]}
              </button>
            ))}
          </div>

          {/* Questions grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 px-3 pb-3">
            {(currentCat.questions[language] as string[]).map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                className="quick-btn"
                disabled={isLoading}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-5xl mx-auto w-full">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} message-enter`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0 mr-2 mt-1" style={{background:'var(--c-primary)'}}>
                ⚖️
              </div>
            )}
            <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
              <div className={`text-base leading-relaxed ${msg.role === 'assistant' ? 'chat-prose' : ''}`}>
                {msg.role === 'assistant' ? formatMessage(msg.content) : msg.content}
                {msg.role === 'assistant' && isLoading && msg.content === '' && (
                  <div className="flex gap-1 py-1">
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                )}
              </div>
              {msg.role === 'assistant' && msg.content && (
                <button
                  onClick={() => speakText(msg.content)}
                  className="mt-2 text-xs font-medium" style={{color:'var(--c-muted)'}}
                >
                  🔊 {t(language, { hindi: 'सुनें', english: 'Listen', hinglish: 'Sunein' })}
                </button>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t px-3 py-3" style={{background:'var(--c-surface)',borderColor:'var(--c-border)'}}>
        <div className="max-w-5xl mx-auto w-full">
        <div className="flex items-end gap-2">
          <button
            onClick={startVoice}
            className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0
                       text-xl transition-all ${isRecording
                ? 'bg-red-500 text-white mic-recording'
                : 'text-[#6B7280]'}`}
            style={isRecording ? {} : {background:'var(--c-bg)'}}
          >
            🎙️
          </button>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={placeholders[language]}
            rows={1}
            className="flex-1 rounded-2xl px-4 py-3 text-base resize-none
                       border-none outline-none focus:ring-2 focus:ring-[#C85828]
                       max-h-24 leading-relaxed"
            style={{background:'var(--c-bg)',color:'var(--c-text)'}}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 rounded-full text-white flex items-center
                       justify-center text-xl flex-shrink-0 active:scale-90 transition-all
                       disabled:opacity-40 disabled:cursor-not-allowed"
            style={{background:'var(--c-primary)'}}
          >
            {isLoading ? '⏳' : '➤'}
          </button>
        </div>
        {isRecording && (
          <p className="text-center text-red-500 text-sm font-medium mt-1 animate-pulse">
            🔴 {t(language, { hindi: 'सुन रहे हैं...', english: 'Listening...', hinglish: 'Sun rahe hain...' })}
          </p>
        )}
        <button
          onClick={stopTTS}
          className="w-full mt-2 rounded-xl py-2 text-xs font-bold border"
            style={{borderColor:'var(--c-border)',color:'var(--c-muted)',background:'var(--c-bg)'}}
        >
          ⏹ {t(language, { hindi: 'आवाज़ बंद करें', english: 'Stop Voice', hinglish: 'Voice Band Karein' })}
        </button>
        </div>
      </div>
    </div>
  );
}
