import { NavLink, useNavigate } from "react-router-dom";
import {
  Scale,
  House,
  Mic,
  Phone,
  HardHat,
  BookOpen,
  ListChecks,
  Moon,
  Sun,
} from "lucide-react";
import { useApp, t, Theme } from "../context/AppContext";
import type { LucideIcon } from "lucide-react";

const NAV: {
  to: string;
  Icon: LucideIcon;
  label: { hindi: string; english: string; hinglish: string };
}[] = [
  {
    to: "/home",
    Icon: House,
    label: { hindi: "होम", english: "Home", hinglish: "Home" },
  },
  {
    to: "/chat",
    Icon: Scale,
    label: { hindi: "मदद", english: "Legal Help", hinglish: "Chat" },
  },
  {
    to: "/post-release",
    Icon: HardHat,
    label: { hindi: "रिहाई", english: "After Release", hinglish: "Baad Mein" },
  },
  {
    to: "/voice-guide",
    Icon: Mic,
    label: { hindi: "वॉइस", english: "Voice", hinglish: "Voice" },
  },
  {
    to: "/helpline",
    Icon: Phone,
    label: { hindi: "हेल्पलाइन", english: "Helpline", hinglish: "Helpline" },
  },
  {
    to: "/legal-journey",
    Icon: ListChecks,
    label: {
      hindi: "यात्रा",
      english: "Legal Journey",
      hinglish: "Legal Journey",
    },
  },
  {
    to: "/manual",
    Icon: BookOpen,
    label: { hindi: "गाइड", english: "Guide", hinglish: "Manual" },
  },
];

/**
 * Laptop / desktop top bar: horizontal nav + language + theme.
 * Hidden below Tailwind `lg` (1024px); mobile keeps bottom nav + compact header.
 */
export default function DesktopSiteHeader() {
  const { language, theme, setTheme } = useApp();
  const navigate = useNavigate();

  return (
    <header
      className="hidden lg:flex lg:flex-col sticky top-0 z-[200] flex-shrink-0 theme-header border-b backdrop-blur-md supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--c-header)_93%,transparent)]"
      style={{ borderColor: "var(--c-header-s)" }}
    >
      <div className="mx-auto flex w-full max-w-[min(112rem,calc(100%-2rem))] items-center justify-between gap-4 px-5 py-3.5 lg:px-10">
        <NavLink
          to="/home"
          className="flex min-w-0 items-center gap-3 rounded-lg py-1 pr-2 transition-opacity hover:opacity-90"
        >
          <div
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-lg"
            style={{
              background: "linear-gradient(135deg, #B8521E, #8C3C12)",
            }}
          >
            <Scale className="h-5 w-5 text-white" strokeWidth={2} />
          </div>
          <div className="min-w-0 text-left">
            <div className="truncate font-extrabold leading-tight text-white">
              न्याय सेतु
            </div>
            <div
              className="truncate text-xs font-medium lg:text-sm"
              style={{ color: "var(--c-primary)" }}
            >
              Nyay Setu
            </div>
          </div>
        </NavLink>

        <nav
          className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-x-1 gap-y-1 overflow-x-auto px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          aria-label="Main"
        >
          {NAV.map(({ to, Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/home"}
              className={({ isActive }) =>
                [
                  "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-white/12 text-white"
                    : "text-white/65 hover:bg-white/[0.08] hover:text-white",
                ].join(" ")
              }
            >
              <Icon
                className="h-[1.125rem] w-[1.125rem] flex-shrink-0 opacity-90"
                strokeWidth={2}
              />
              <span>{label[language]}</span>
            </NavLink>
          ))}
        </nav>

        <div className="flex flex-shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="rounded-md px-3 py-2 text-sm font-semibold transition-colors"
            style={{
              background: "rgba(255,255,255,0.10)",
              color: "rgba(255,255,255,0.88)",
            }}
          >
            🌐{" "}
            {language === "hindi"
              ? "हिंदी"
              : language === "english"
                ? "EN"
                : "HG"}
          </button>
          <div
            className="flex items-center gap-0.5 rounded-full p-0.5"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            {(
              [
                ["dark", Moon],
                ["light", Sun],
              ] as [Theme, LucideIcon][]
            ).map(([value, IconCmp]) => (
              <button
                key={value}
                type="button"
                onClick={() => setTheme(value)}
                title={
                  value === "dark"
                    ? t(language, {
                        hindi: "डार्क",
                        english: "Dark",
                        hinglish: "Dark",
                      })
                    : t(language, {
                        hindi: "लाइट",
                        english: "Light",
                        hinglish: "Light",
                      })
                }
                className="rounded-full p-2 transition-all"
                style={
                  theme === value
                    ? {
                        background: "rgba(255,255,255,0.15)",
                        color: "#FAF7F4",
                      }
                    : { color: "rgba(255,255,255,0.4)" }
                }
              >
                <IconCmp className="h-4 w-4" strokeWidth={2} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
