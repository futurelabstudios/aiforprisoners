import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type Language = "hindi" | "english" | "hinglish";
export type Theme = "light" | "dark";
export type UserRole = "official" | "judiciary" | "family" | "legalSupport";
type ThemePreference = "system" | "manual";

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  isMobileDevice: boolean;
  isSystemDarkMode: boolean;
}

const AppContext = createContext<AppContextType>({
  language: "hinglish",
  setLanguage: () => {},
  theme: "dark",
  setTheme: () => {},
  role: "official",
  setRole: () => {},
  isMobileDevice: false,
  isSystemDarkMode: false,
});

export const AppProvider = ({ children }: { children: ReactNode }) => {
  /**
   * Compact layout: viewport below 1024px only (matches Tailwind `lg` and bottom nav visibility).
   */
  const getIsMobileDevice = () => {
    if (typeof window === "undefined") return false;
    return !!window.matchMedia?.("(max-width: 1023px)").matches;
  };
  const getSystemDarkMode = () => {
    if (typeof window === "undefined") return false;
    return !!window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  };

  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem("nyay-setu-lang") as Language) || "hinglish";
  });
  const [themePreference, setThemePreference] = useState<ThemePreference>(() => {
    const stored = localStorage.getItem("nyay-setu-theme") as Theme | null;
    return stored === "light" || stored === "dark" ? "manual" : "system";
  });
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(getIsMobileDevice);
  const [isSystemDarkMode, setIsSystemDarkMode] = useState<boolean>(getSystemDarkMode);

  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem("nyay-setu-theme") as Theme | null;
    if (stored === "light" || stored === "dark") return stored;
    const prefersDark = getSystemDarkMode();
    return prefersDark ? "dark" : "light";
  });
  const [role, setRoleState] = useState<UserRole>(() => {
    const stored = localStorage.getItem("nyay-setu-role") as UserRole | null;
    return stored || "official";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem("nyay-setu-theme", theme);
  }, [theme]);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      setIsSystemDarkMode(event.matches);
      if (themePreference === "system") {
        setThemeState(event.matches ? "dark" : "light");
      }
    };
    const handleViewportChange = () => {
      setIsMobileDevice(getIsMobileDevice());
    };

    setIsMobileDevice(getIsMobileDevice());
    setIsSystemDarkMode(mql.matches);
    if (themePreference === "system") {
      setThemeState(mql.matches ? "dark" : "light");
    }

    mql.addEventListener("change", handleSystemThemeChange);
    window.addEventListener("resize", handleViewportChange);
    return () => {
      mql.removeEventListener("change", handleSystemThemeChange);
      window.removeEventListener("resize", handleViewportChange);
    };
  }, [themePreference]);

  const handleSetLanguage = (lang: Language) => {
    localStorage.setItem("nyay-setu-lang", lang);
    setLanguage(lang);
  };

  const handleSetTheme = (value: Theme) => {
    setThemePreference("manual");
    setThemeState(value);
  };
  const handleSetRole = (value: UserRole) => {
    localStorage.setItem("nyay-setu-role", value);
    setRoleState(value);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        theme,
        setTheme: handleSetTheme,
        role,
        setRole: handleSetRole,
        isMobileDevice,
        isSystemDarkMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

export const t = (
  language: Language,
  texts: { hindi: string; english: string; hinglish: string },
) => {
  return texts[language];
};
