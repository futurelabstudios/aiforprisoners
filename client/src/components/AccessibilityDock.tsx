import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp, t } from '../context/AppContext';
import { speakWithElevenLabs, stopTTS } from '../utils/tts';

const pageNarration = {
  '/home': {
    hindi: 'यह होम स्क्रीन है। यहां कानूनी मदद, जेल के बाद सहायता, और हेल्पलाइन के विकल्प दिख रहे हैं। किसी भी कार्ड पर दबाकर आगे बढ़ें।',
    english: 'This is the home screen. You can open legal help, post release support, and helpline options. Tap any card to continue.',
    hinglish: 'Yeh home screen hai. Yahan legal help, post release support, aur helpline options dikh rahe hain. Kisi bhi card par tap karke aage badhein.',
  },
  '/chat': {
    hindi: 'यह वॉइस और चैट सहायता स्क्रीन है। नीचे माइक दबाकर बोलें, या सवाल लिखकर भेजें। ऊपर दिए त्वरित सवाल भी चुन सकते हैं।',
    english: 'This is the chat and voice support screen. Tap the microphone below to speak, or type and send your question. You can also use quick questions.',
    hinglish: 'Yeh chat aur voice support screen hai. Neeche mic dabakar bol sakte hain ya sawaal type karke bhej sakte hain. Quick questions bhi use kar sakte hain.',
  },
  '/helpline': {
    hindi: 'यह हेल्पलाइन स्क्रीन है। हर कार्ड पर फोन नंबर दिया है। किसी नंबर पर टैप करते ही कॉल लग जाएगी।',
    english: 'This is the helpline screen. Each card has a phone number. Tap a number to call directly.',
    hinglish: 'Yeh helpline screen hai. Har card par phone number diya hai. Number par tap karte hi seedha call lag jayega.',
  },
  '/post-release': {
    hindi: 'यह जेल के बाद सहायता स्क्रीन है। ऊपर टैब बदलकर आश्रय, नौकरी, दस्तावेज़ और स्वास्थ्य जैसी मदद देख सकते हैं।',
    english: 'This is the post release support screen. Use top tabs to view shelter, jobs, documents, and health support.',
    hinglish: 'Yeh jail ke baad support screen hai. Upar tabs badal kar shelter, jobs, documents aur health support dekh sakte hain.',
  },
  '/voice-guide': {
    hindi: 'यह लाइव वॉइस गाइड है। माइक दबाकर बोलें। आपका सवाल एआई को जाएगा और जवाब आवाज में सुनाया जाएगा।',
    english: 'This is live voice guide. Tap the mic and speak. Your question goes to AI and the reply is spoken aloud.',
    hinglish: 'Yeh live voice guide hai. Mic dabakar boliye. Aapka sawaal AI ko jayega aur jawab awaaz mein sunaya jayega.',
  },
};

export default function AccessibilityDock() {
  const { language } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (location.pathname === '/') return null;

  const readScreen = async () => {
    const text = pageNarration[location.pathname as keyof typeof pageNarration]?.[language]
      || pageNarration['/home'][language];

    try {
      setIsSpeaking(true);
      await speakWithElevenLabs(text);
    } catch {
      // Keep fallback minimal for low literacy users.
      window.alert(t(language, {
        hindi: 'आवाज़ चलाने में समस्या हुई। कृपया दोबारा कोशिश करें।',
        english: 'Could not play voice right now. Please try again.',
        hinglish: 'Awaaz play nahi ho paayi. Please dobara try karein.',
      }));
    } finally {
      setIsSpeaking(false);
    }
  };

  return (
    <div className="fixed right-3 bottom-20 z-40 flex flex-col gap-2 glass-panel p-2">
      <button
        onClick={readScreen}
        className={`a11y-fab ${isSpeaking ? 'bg-emerald-600' : 'bg-[#C85828]'}`}
      >
        {isSpeaking ? '🔊' : '🗣️'} {t(language, {
          hindi: 'स्क्रीन सुनें',
          english: 'Read Screen',
          hinglish: 'Screen Suno',
        })}
      </button>
      <button
        onClick={() => navigate('/voice-guide')}
        className="a11y-fab bg-[#C85828]"
      >
        🎙️ {t(language, {
          hindi: 'वॉइस गाइड',
          english: 'Voice Guide',
          hinglish: 'Voice Guide',
        })}
      </button>
      <button
        onClick={() => {
          stopTTS();
          window.location.href = 'tel:1516';
        }}
        className="a11y-fab bg-red-600"
      >
        📞 {t(language, {
          hindi: 'तुरंत मदद',
          english: 'Quick Help',
          hinglish: 'Turant Help',
        })}
      </button>
    </div>
  );
}
