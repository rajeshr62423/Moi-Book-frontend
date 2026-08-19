import type { User } from "@/redux/auth/type";

// Plain localStorage access, not React state — services/api.ts's axios
// interceptors need to read/write the access token outside of any component
// tree, and lib/auth.tsx hydrates Redux from this on first mount.
const SESSION_KEY = "moibook-session";
const ACCESS_TOKEN_KEY = "moibook-access-token";
const REFRESH_TOKEN_KEY = "moibook-refresh-token";

interface StoredSession {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export function getAccessToken(): string | null {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getRefreshToken(): string | null {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getStoredSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as StoredSession) : null;
  } catch {
    return null;
  }
}

export function setStoredSession(session: StoredSession): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
  } catch {}
}

/** Updates just the tokens (post-refresh), keeping the cached user as-is. */
export function updateStoredTokens(accessToken: string, refreshToken: string): void {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    const existing = getStoredSession();
    if (existing) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ ...existing, accessToken, refreshToken }));
    }
  } catch {}
}

/** Updates just the cached user (post profile-edit), keeping tokens as-is. */
export function updateStoredUser(user: User): void {
  try {
    const existing = getStoredSession();
    if (existing) {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ ...existing, user }));
    }
  } catch {}
}

export function clearStoredSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch {}
}
