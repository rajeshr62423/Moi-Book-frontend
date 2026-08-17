"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const AUTH_KEY = "moibook-auth";

interface AuthUser {
  name: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isReady: boolean;
  login: (email: string) => void;
  register: (name: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const DEFAULT_USER: AuthUser = { name: "Arun Kumar", email: "arun.kumar@email.com" };

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Reading localStorage must happen post-mount (SSR has no storage); this
    // one-time sync from a browser API is the standard exception to the rule.
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setIsReady(true);
  }, []);

  const persist = useCallback((next: AuthUser | null) => {
    setUser(next);
    try {
      if (next) localStorage.setItem(AUTH_KEY, JSON.stringify(next));
      else localStorage.removeItem(AUTH_KEY);
    } catch {}
  }, []);

  const login = useCallback(
    (email: string) => persist({ ...DEFAULT_USER, email: email || DEFAULT_USER.email }),
    [persist]
  );
  const register = useCallback(
    (name: string, email: string) => persist({ name: name || DEFAULT_USER.name, email: email || DEFAULT_USER.email }),
    [persist]
  );
  const logout = useCallback(() => persist(null), [persist]);

  return (
    <AuthContext.Provider value={{ user, isReady, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
