"use client";

import { useAppLoader } from "@/lib/ui";

export default function AppLoaderOverlay() {
  const { isLoading } = useAppLoader();
  return (
    <div className={`app-loader${isLoading ? " show" : ""}`} role="status" aria-label="Loading" aria-hidden={!isLoading}>
      <div className="app-loader-inner">
        <div className="app-loader-ring" />
        <div className="app-loader-logo-wrap">
          <div className="app-loader-glow" />
          <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <circle className="al-glow-circle" cx="24" cy="18" r="20" />
            <path
              className="al-book"
              d="M24 15 C20 12 13 11 8 12.5 V32 C13 30.5 20 31.5 24 34 C28 31.5 35 30.5 40 32 V12.5 C35 11 28 12 24 15Z"
              opacity="0.95"
            />
            <path d="M24 15 V34" stroke="#fff" strokeWidth="1" opacity="0.5" />
            <path d="M24 12 L25 8 L26 12" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity="0.9" />
          </svg>
        </div>
      </div>
    </div>
  );
}
