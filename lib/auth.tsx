"use client";

import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { hydrateAuth, login, logout, register, sessionExpired, updateProfile } from "@/redux/auth/thunk";
import type { LoginRequest, RegisterRequest, UpdateProfileRequest } from "@/redux/auth/type";

/**
 * Auth state lives in the Redux store (redux/auth) — this just runs the
 * one-time session hydration on mount and exposes it as a small hook with a
 * stable, ergonomic shape so components don't need to know about Redux.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  useEffect(() => {
    function handleSessionExpired() {
      dispatch(sessionExpired());
    }
    window.addEventListener("moibook:session-expired", handleSessionExpired);
    return () => window.removeEventListener("moibook:session-expired", handleSessionExpired);
  }, [dispatch]);

  return <>{children}</>;
}

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isReady, loading, error } = useSelector((state: RootState) => state.auth);

  const doLogin = useCallback((payload: LoginRequest) => dispatch(login(payload)), [dispatch]);
  const doRegister = useCallback((payload: RegisterRequest) => dispatch(register(payload)), [dispatch]);
  const doLogout = useCallback(() => dispatch(logout()), [dispatch]);
  const doUpdateProfile = useCallback((payload: UpdateProfileRequest) => dispatch(updateProfile(payload)), [dispatch]);

  return { user, isReady, loading, error, login: doLogin, register: doRegister, logout: doLogout, updateProfile: doUpdateProfile };
}
