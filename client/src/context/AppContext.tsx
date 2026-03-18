import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'hindi' | 'english' | 'hinglish';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const AppContext = createContext<AppContextType>({
  language: 'hinglish',
  setLanguage: () => {},
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('nyay-setu-lang') as Language) || 'hinglish';
  });

  const handleSetLanguage = (lang: Language) => {
    localStorage.setItem('nyay-setu-lang', lang);
    setLanguage(lang);
  };

  return (
    <AppContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

export const t = (language: Language, texts: { hindi: string; english: string; hinglish: string }) => {
  return texts[language];
};
