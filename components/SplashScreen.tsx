"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function SplashScreen() {
  const [hiding, setHiding] = useState(false);
  const [visible, setVisible] = useState(true);
  const router = useRouter();
  const { user, isReady } = useAuth();

  useEffect(() => {
    if (!isReady) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = reduced ? 400 : 2200;
    const t1 = setTimeout(() => {
      setHiding(true);
      const t2 = setTimeout(() => {
        setVisible(false);
        router.replace(user ? "/dashboard" : "/login");
      }, reduced ? 0 : 560);
      return () => clearTimeout(t2);
    }, delay);
    return () => clearTimeout(t1);
  }, [isReady, user, router]);

  if (!visible) return null;

  return (
    <div className={`splash-shell ready${hiding ? " hide" : ""}`} role="status" aria-label="I Moi Book is loading">
      <div className="splash-content">
        <div className="splash-sparkle" aria-hidden="true">
          ✦
        </div>
        <div className="splash-logo-wrap" aria-hidden="true">
          <div className="splash-logo-glow" />
          <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <circle className="logo-glow-circle" cx="24" cy="18" r="20" />
            <path
              className="logo-book"
              d="M24 15 C20 12 13 11 8 12.5 V32 C13 30.5 20 31.5 24 34 C28 31.5 35 30.5 40 32 V12.5 C35 11 28 12 24 15Z"
              opacity="0.95"
            />
            <path d="M24 15 V34" stroke="#fff" strokeWidth="1" opacity="0.5" />
            <path d="M24 12 L25 8 L26 12" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity="0.9" />
          </svg>
        </div>
        <h1 className="splash-brand">I Moi Book</h1>
        <p className="splash-tagline">
          Every Gift. Every Guest.
          <br />
          Every Memory.
        </p>
        <div className="splash-loader" aria-hidden="true">
          <span />
        </div>
        <p className="splash-secondary">
          Your celebration,
          <br />
          beautifully remembered.
        </p>
      </div>
    </div>
  );
}
