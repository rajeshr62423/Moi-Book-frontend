"use client";

import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { fetchSettings, updateSettings } from "@/redux/setting/thunk";
import type { UpdateSettingsRequest } from "@/redux/setting/type";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

/**
 * Fetches the signed-in user's persisted preferences once auth is ready and
 * a user is present, then bridges settings.language -> useI18n().setLang()
 * so a language chosen on another device applies here on login. Must be
 * mounted inside both AuthProvider and I18nProvider.
 */
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isReady } = useAuth();
  const { lang, setLang } = useI18n();
  const settings = useSelector((state: RootState) => state.setting.settings);
  const fetchedForUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!isReady || !user) return;
    if (fetchedForUserId.current === user.id) return;
    fetchedForUserId.current = user.id;
    dispatch(fetchSettings());
  }, [isReady, user, dispatch]);

  useEffect(() => {
    if (settings && settings.language !== lang) {
      setLang(settings.language);
    }
  }, [settings, lang, setLang]);

  return <>{children}</>;
}

export function useSettings() {
  const dispatch = useDispatch<AppDispatch>();
  const { settings, loading, loaded, error } = useSelector((state: RootState) => state.setting);

  const doUpdateSettings = useCallback(
    (payload: UpdateSettingsRequest) => dispatch(updateSettings(payload)),
    [dispatch],
  );

  return { settings, loading, loaded, error, updateSettings: doUpdateSettings };
}
