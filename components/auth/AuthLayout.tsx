"use client";

import { useTheme } from "@/lib/theme";
import { MoonIcon, SunIcon } from "@/components/icons";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { mode, setAppearance } = useTheme();
  const isDark = mode === "dark";

  return (
    <div className="auth-shell open">
      <button
        type="button"
        className="auth-theme-btn"
        aria-label="Toggle theme"
        onClick={() => setAppearance(isDark ? "light" : "dark")}
      >
        {isDark ? <MoonIcon /> : <SunIcon />}
      </button>
      <div className="auth-layout">
        <div className="auth-brand">
          <div className="auth-brand-logo">
            <svg viewBox="0 0 48 48" fill="none">
              <defs>
                <radialGradient id="authGlow" cx="50%" cy="35%" r="60%">
                  <stop offset="0%" stopColor="var(--primary-light,#F3D28C)" />
                  <stop offset="100%" stopColor="var(--primary,#C99132)" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="authBook" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="var(--primary-light,#E7BD68)" />
                  <stop offset="100%" stopColor="var(--primary,#C99132)" />
                </linearGradient>
              </defs>
              <circle cx="24" cy="18" r="20" fill="url(#authGlow)" />
              <path
                d="M24 15 C20 12 13 11 8 12.5 V32 C13 30.5 20 31.5 24 34 C28 31.5 35 30.5 40 32 V12.5 C35 11 28 12 24 15Z"
                fill="url(#authBook)"
                opacity="0.92"
              />
              <path d="M24 15 V34" stroke="#fff" strokeWidth="1" opacity="0.5" />
              <path d="M24 12 L25 8 L26 12" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity="0.85" />
            </svg>
            <span className="name">I Moi Book</span>
          </div>
          <h1>
            Every celebration,
            <br />
            beautifully kept.
          </h1>
          <p>
            Organize events, guests, gifts and memories in one peaceful place — warm, thoughtful, and made for the
            moments that matter.
          </p>
          <svg className="auth-brand-ornament" viewBox="0 0 180 10" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M0 5h70M110 5h70" />
            <circle cx="90" cy="5" r="3" />
            <path d="M84 5l3-3 3 3-3 3Z" />
          </svg>
        </div>
        <div className="auth-card-wrap">{children}</div>
      </div>
    </div>
  );
}

export function AuthCardLogo() {
  return (
    <div className="auth-card-logo auth-card-logo-mobile">
      <svg viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="18" r="20" fill="url(#authGlow)" />
        <path
          d="M24 15 C20 12 13 11 8 12.5 V32 C13 30.5 20 31.5 24 34 C28 31.5 35 30.5 40 32 V12.5 C35 11 28 12 24 15Z"
          fill="url(#authBook)"
          opacity="0.92"
        />
        <path d="M24 15 V34" stroke="#fff" strokeWidth="1" opacity="0.5" />
      </svg>
    </div>
  );
}
