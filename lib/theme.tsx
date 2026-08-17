"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { setDocumentAttribute, setMetaThemeColor } from "@/lib/domAttrs";

export type Accent = "original" | "orange" | "brown" | "green" | "pink" | "cream" | "red" | "gold" | "blue";
export type Appearance = "light" | "dark" | "system";

export const ACCENTS: { value: Accent; color: string; label: string }[] = [
  { value: "original", color: "", label: "Default / I MOI Book" },
  { value: "orange", color: "#D99A18", label: "Orange" },
  { value: "brown", color: "#6B4632", label: "Brown" },
  { value: "green", color: "#6F9B72", label: "Green" },
  { value: "pink", color: "#D9878E", label: "Pink" },
  { value: "cream", color: "#D6A45A", label: "Cream" },
  { value: "red", color: "#C94B4B", label: "Red" },
  { value: "gold", color: "#C99520", label: "Gold" },
  { value: "blue", color: "#4F78B8", label: "Blue" },
];

const ACCENT_META_COLOR: Record<Accent, string> = {
  original: "#C99132", orange: "#D99A18", brown: "#6B4632", green: "#6F9B72",
  pink: "#D9878E", cream: "#D6A45A", red: "#C94B4B", gold: "#C99520", blue: "#4F78B8",
};

const ACCENT_KEY = "imoibook-color-theme";
const APPEARANCE_KEY = "imoibook-appearance";
const MODE_KEY = "moi-theme";

interface ThemeContextValue {
  accent: Accent;
  appearance: Appearance;
  mode: "light" | "dark";
  setAccent: (accent: Accent) => void;
  setAppearance: (appearance: Appearance) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [accent, setAccentState] = useState<Accent>("original");
  const [appearance, setAppearanceState] = useState<Appearance>("light");
  // Only meaningful when appearance === "system"; kept in sync with the OS
  // media query via the subscription effect below.
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);

  const mode: "light" | "dark" = appearance === "system" ? (systemPrefersDark ? "dark" : "light") : appearance;

  useEffect(() => {
    // Reading localStorage must happen post-mount (SSR has no storage); this
    // one-time sync from a browser API is the standard exception to the rule.
    try {
      const savedAccent = (localStorage.getItem(ACCENT_KEY) ||
        localStorage.getItem("imoibook-theme-color")) as Accent | null;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (savedAccent) setAccentState(savedAccent);
      const savedAppearance = (localStorage.getItem(APPEARANCE_KEY) ||
        localStorage.getItem(MODE_KEY)) as Appearance | null;
      if (savedAppearance) setAppearanceState(savedAppearance);
    } catch {}
  }, []);

  useEffect(() => {
    setDocumentAttribute("data-theme", mode);
    setDocumentAttribute("data-appearance", appearance);
  }, [mode, appearance]);

  useEffect(() => {
    setDocumentAttribute("data-accent", accent);
    setMetaThemeColor(ACCENT_META_COLOR[accent] || ACCENT_META_COLOR.gold);
  }, [accent]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSystemPrefersDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  const setAccent = useCallback((next: Accent) => {
    setAccentState(next);
    try {
      localStorage.setItem(ACCENT_KEY, next);
    } catch {}
  }, []);

  const setAppearance = useCallback(
    (next: Appearance) => {
      setAppearanceState(next);
      try {
        localStorage.setItem(APPEARANCE_KEY, next);
        localStorage.setItem(MODE_KEY, next === "system" ? (systemPrefersDark ? "dark" : "light") : next);
      } catch {}
    },
    [systemPrefersDark]
  );

  const value = useMemo(
    () => ({ accent, appearance, mode, setAccent, setAppearance }),
    [accent, appearance, mode, setAccent, setAppearance]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
