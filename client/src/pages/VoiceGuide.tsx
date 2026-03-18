import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, t } from '../context/AppContext';
import { speakWithElevenLabs, stopTTS } from '../utils/tts';

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

export default function VoiceGuide() {
  const { language } = useApp();
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [heardText, setHeardText] = useState('');
  const [replyText, setReplyText] = useState('');
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const transcriptRef = useRef('');

  const askAI = async (spokenText: string) => {
    setIsLoading(true);
    setReplyText('');
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          messages: [{ role: 'user', content: spokenText }],
        }),
      });

      if (!response.ok) throw new Error('Chat request failed');

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') break;
          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              fullText += parsed.text;
              setReplyText(fullText);
            }
          } catch {
            // Ignore malformed chunks.
          }
        }
      }

      if (fullText.trim()) {
        await speakWithElevenLabs(fullText);
      }
    } catch {
      const fallback = t(language, {
        hindi: 'माफ़ करें, अभी आवाज़ में मदद उपलब्ध नहीं है। कृपया फिर कोशिश करें।',
        english: 'Sorry, voice guidance is not available right now. Please try again.',
        hinglish: 'Maaf kijiye, abhi voice guidance nahi chal pa rahi. Please dobara try karein.',
      });
      setReplyText(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRecording = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('Voice input works best in Chrome browser');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    stopTTS();
    setReplyText('');
    setHeardText('');
    transcriptRef.current = '';

    const recognition = new SpeechRec();
    recognition.lang = language === 'english' ? 'en-IN' : 'hi-IN';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      let transcript = '';
      for (let i = 0; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript;
      }
      const cleaned = transcript.trim();
      transcriptRef.current = cleaned;
      setHeardText(cleaned);
    };

    recognition.onend = () => {
      setIsRecording(false);
      if (transcriptRef.current) {
        askAI(transcriptRef.current);
      }
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  return (
    <div className="flex flex-col h-dvh bg-[#F0E8D5]">
      <div className="theme-header px-4 pt-10 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/home')} className="text-2xl text-white">←</button>
          <div className="text-3xl">🎙️</div>
          <div>
            <h1 className="font-extrabold text-white text-lg">
              {t(language, {
                hindi: 'लाइव वॉइस गाइड',
                english: 'Live Voice Guide',
                hinglish: 'Live Voice Guide',
              })}
            </h1>
            <p className="text-orange-100 text-xs">
              {t(language, {
                hindi: 'बोलें और तुरंत आवाज़ में जवाब पाएं',
                english: 'Speak and hear instant guidance',
                hinglish: 'Boliye aur turant awaaz mein jawab suniye',
              })}
            </p>
          </div>
        </div>
        <div className="ai-chip mt-2">🧠 Conversational AI Core</div>
      </div>

      <div className="px-4 py-4 space-y-4 overflow-y-auto pb-24 max-w-5xl mx-auto w-full">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full flex items-center justify-center shadow-2xl border border-white/30" style={{background:'linear-gradient(135deg,#6B2010,#C85828,#E07C35)'}}>
            <span className="text-3xl">🧠</span>
          </div>
        </div>
        <div className="card glass-panel">
          <p className="text-sm text-gray-700 font-semibold">
            {t(language, {
              hindi: '1) नीचे माइक दबाएँ, 2) अपना सवाल बोलें, 3) जवाब आवाज़ में सुनें',
              english: '1) Tap mic below, 2) Speak your question, 3) Hear voice reply',
              hinglish: '1) Neeche mic dabao, 2) Sawaal bolo, 3) Awaaz mein jawab suno',
            })}
          </p>
        </div>

        <button
          onClick={toggleRecording}
          disabled={isLoading}
          className={`w-full rounded-3xl py-8 text-white text-2xl font-extrabold shadow-xl active:scale-95 transition-all
                      ${isRecording ? 'bg-red-500 mic-recording' : 'bg-saffron-500'}
                      ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {isRecording ? '🔴 STOP' : '🎤 TALK NOW'}
        </button>

        {heardText && (
          <div className="card" style={{borderColor:'var(--brand-border)'}}>
            <div className="text-xs font-bold mb-1" style={{color:'var(--brand-muted)'}}>
              {t(language, { hindi: 'आपने कहा', english: 'You said', hinglish: 'Aapne kaha' })}
            </div>
            <div className="text-base">{heardText}</div>
          </div>
        )}

        {isLoading && (
          <div className="card">
            <div className="flex items-center gap-2">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
              <span className="text-sm" style={{color:'var(--brand-muted)'}}>
                {t(language, {
                  hindi: 'आवाज़ में जवाब तैयार हो रहा है...',
                  english: 'Preparing voice response...',
                  hinglish: 'Voice response taiyaar ho raha hai...',
                })}
              </span>
            </div>
          </div>
        )}

        {replyText && (
          <div className="card" style={{borderColor:'var(--brand-primary)'}}>
            <div className="text-xs font-bold mb-1" style={{color:'var(--brand-dark)'}}>
              {t(language, { hindi: 'गाइड जवाब', english: 'Guide Reply', hinglish: 'Guide ka jawab' })}
            </div>
            <div className="text-base leading-relaxed">{replyText}</div>
          </div>
        )}
      </div>
    </div>
  );
}
