import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import LanguageSelect from './pages/LanguageSelect';
import Home from './pages/Home';
import LegalChat from './pages/LegalChat';
import PostRelease from './pages/PostRelease';
import Helpline from './pages/Helpline';
import VoiceGuide from './pages/VoiceGuide';
import AccessibilityDock from './components/AccessibilityDock';

export default function App() {
  const [mobileView, setMobileView] = useState(false);

  return (
    <AppProvider>
      <BrowserRouter>
        {/* View toggle pill - only on md+ screens */}
        <div
          className="hidden md:flex fixed top-3 right-3 z-[9999] items-center gap-1 rounded-full px-1 py-1 shadow-lg border"
          style={{ background: '#FFFFFF', borderColor: '#E5E7EB' }}
        >
          <button
            onClick={() => setMobileView(false)}
            title="Laptop view"
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${!mobileView ? 'text-white' : 'text-[#6B7280] hover:bg-[#F7F6F3]'}`}
            style={!mobileView ? { background: '#C85828' } : {}}
          >
            💻 <span className="hidden lg:inline">Laptop</span>
          </button>
          <button
            onClick={() => setMobileView(true)}
            title="Mobile view"
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all flex items-center gap-1.5 ${mobileView ? 'text-white' : 'text-[#6B7280] hover:bg-[#F7F6F3]'}`}
            style={mobileView ? { background: '#C85828' } : {}}
          >
            📱 <span className="hidden lg:inline">Mobile</span>
          </button>
        </div>

        <div className={mobileView ? 'view-mobile-shell' : 'view-full-shell'}>
          <div className={`app-container${mobileView ? ' app-mobile-frame' : ''}`}>
            <Routes>
              <Route path="/"             element={<LanguageSelect />} />
              <Route path="/home"         element={<Home />} />
              <Route path="/chat"         element={<LegalChat />} />
              <Route path="/post-release" element={<PostRelease />} />
              <Route path="/helpline"     element={<Helpline />} />
              <Route path="/voice-guide"  element={<VoiceGuide />} />
              <Route path="*"             element={<Navigate to="/" replace />} />
            </Routes>
            <AccessibilityDock />
          </div>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
