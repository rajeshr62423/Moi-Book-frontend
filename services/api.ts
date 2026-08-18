import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getAccessToken, getRefreshToken, updateStoredTokens, clearStoredSession } from "@/lib/tokenStorage";
import type { ApiResponse } from "./apiTypes";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// /auth/refresh carries the refresh token as its Bearer token, set
// explicitly by refreshApi — attaching the access token here would be wrong.
const SKIP_AUTH_HEADER = ["/auth/refresh"];

api.interceptors.request.use((config) => {
  if (!SKIP_AUTH_HEADER.some((path) => config.url?.includes(path))) {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");

  const response = await axios.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
    `${baseURL}/auth/refresh`,
    {},
    { headers: { Authorization: `Bearer ${refreshToken}` } },
  );
  const tokens = response.data.data;
  updateStoredTokens(tokens.accessToken, tokens.refreshToken);
  return tokens.accessToken;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;
    const isAuthRoute = original?.url && SKIP_AUTH_HEADER.some((p) => original.url!.includes(p));

    if (error.response?.status === 401 && original && !original._retried && !isAuthRoute) {
      original._retried = true;
      try {
        // Multiple requests can 401 at once; share one in-flight refresh call.
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
        const newAccessToken = await refreshPromise;
        original.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(original);
      } catch {
        clearStoredSession();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("moibook:session-expired"));
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
