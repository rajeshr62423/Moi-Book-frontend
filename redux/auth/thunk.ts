import { AppDispatch } from "../store";

import {
  authLoginRequest,
  authLoginSuccess,
  authLoginFailure,
  authRegisterRequest,
  authRegisterSuccess,
  authRegisterFailure,
  authHydrate,
  authLogout,
  authUpdateProfileRequest,
  authUpdateProfileSuccess,
  authUpdateProfileFailure,
} from "./action";

import { loginApi, registerApi, logoutApi, updateProfileApi } from "@/services/authService";
import { extractApiErrorMessage } from "@/services/apiTypes";
import { getStoredSession, setStoredSession, clearStoredSession, updateStoredUser } from "@/lib/tokenStorage";
import type { LoginRequest, RegisterRequest, UpdateProfileRequest } from "./type";

export const login = (payload: LoginRequest) => async (dispatch: AppDispatch) => {
  dispatch(authLoginRequest());
  try {
    const response = await loginApi(payload);
    setStoredSession(response.data);
    dispatch(authLoginSuccess(response.data));
    return { ...response.data, message: response.message };
  } catch (error) {
    const message = extractApiErrorMessage(error, "Login failed");
    dispatch(authLoginFailure(message));
    throw new Error(message);
  }
};

export const register = (payload: RegisterRequest) => async (dispatch: AppDispatch) => {
  dispatch(authRegisterRequest());
  try {
    const response = await registerApi(payload);
    setStoredSession(response.data);
    dispatch(authRegisterSuccess(response.data));
    return { ...response.data, message: response.message };
  } catch (error) {
    const message = extractApiErrorMessage(error, "Registration failed");
    dispatch(authRegisterFailure(message));
    throw new Error(message);
  }
};

/** Reads whatever was persisted from a previous session — called once on app mount. */
export const hydrateAuth = () => (dispatch: AppDispatch) => {
  const session = getStoredSession();
  dispatch(authHydrate(session));
};

export const logout = () => async (dispatch: AppDispatch) => {
  // Best-effort, and must run before clearing storage — it needs the
  // still-present access token to authenticate the call. Session is cleared
  // locally regardless of whether this succeeds, so a network failure still
  // gets a client-side fallback message rather than no feedback at all.
  let message = "Logged out successfully";
  try {
    const response = await logoutApi();
    message = response.message;
  } catch {}
  clearStoredSession();
  dispatch(authLogout());
  return { message };
};

export const updateProfile = (payload: UpdateProfileRequest) => async (dispatch: AppDispatch) => {
  dispatch(authUpdateProfileRequest());
  try {
    const response = await updateProfileApi(payload);
    updateStoredUser(response.data);
    dispatch(authUpdateProfileSuccess(response.data));
    return response;
  } catch (error) {
    const message = extractApiErrorMessage(error, "Couldn't update your profile");
    dispatch(authUpdateProfileFailure(message));
    throw new Error(message);
  }
};

/**
 * Fired when services/api.ts's response interceptor gives up on refreshing
 * an expired session (e.g. refresh token itself expired/revoked). Storage is
 * already cleared by that point, so this just syncs Redux state to match —
 * no API call, unlike a user-initiated logout().
 */
export const sessionExpired = () => (dispatch: AppDispatch) => {
  dispatch(authLogout());
};
