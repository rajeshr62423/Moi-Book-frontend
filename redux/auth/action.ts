import {
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_FAILURE,
  AUTH_REGISTER_REQUEST,
  AUTH_REGISTER_SUCCESS,
  AUTH_REGISTER_FAILURE,
  AUTH_HYDRATE,
  AUTH_LOGOUT,
  AUTH_UPDATE_PROFILE_REQUEST,
  AUTH_UPDATE_PROFILE_SUCCESS,
  AUTH_UPDATE_PROFILE_FAILURE,
} from "./actionType";

import { AuthResult, User } from "./type";

export const authLoginRequest = () => ({
  type: AUTH_LOGIN_REQUEST as typeof AUTH_LOGIN_REQUEST,
});

export const authLoginSuccess = (data: AuthResult) => ({
  type: AUTH_LOGIN_SUCCESS as typeof AUTH_LOGIN_SUCCESS,
  payload: data,
});

export const authLoginFailure = (error: string) => ({
  type: AUTH_LOGIN_FAILURE as typeof AUTH_LOGIN_FAILURE,
  payload: error,
});

export const authRegisterRequest = () => ({
  type: AUTH_REGISTER_REQUEST as typeof AUTH_REGISTER_REQUEST,
});

export const authRegisterSuccess = (data: AuthResult) => ({
  type: AUTH_REGISTER_SUCCESS as typeof AUTH_REGISTER_SUCCESS,
  payload: data,
});

export const authRegisterFailure = (error: string) => ({
  type: AUTH_REGISTER_FAILURE as typeof AUTH_REGISTER_FAILURE,
  payload: error,
});

/** Restores session from localStorage on app load (see lib/auth.tsx). `null` user means nothing was stored. */
export const authHydrate = (data: { user: User; accessToken: string; refreshToken: string } | null) => ({
  type: AUTH_HYDRATE as typeof AUTH_HYDRATE,
  payload: data,
});

export const authLogout = () => ({
  type: AUTH_LOGOUT as typeof AUTH_LOGOUT,
});

export const authUpdateProfileRequest = () => ({
  type: AUTH_UPDATE_PROFILE_REQUEST as typeof AUTH_UPDATE_PROFILE_REQUEST,
});

export const authUpdateProfileSuccess = (user: User) => ({
  type: AUTH_UPDATE_PROFILE_SUCCESS as typeof AUTH_UPDATE_PROFILE_SUCCESS,
  payload: user,
});

export const authUpdateProfileFailure = (error: string) => ({
  type: AUTH_UPDATE_PROFILE_FAILURE as typeof AUTH_UPDATE_PROFILE_FAILURE,
  payload: error,
});

export type AuthAction =
  | ReturnType<typeof authLoginRequest>
  | ReturnType<typeof authLoginSuccess>
  | ReturnType<typeof authLoginFailure>
  | ReturnType<typeof authRegisterRequest>
  | ReturnType<typeof authRegisterSuccess>
  | ReturnType<typeof authRegisterFailure>
  | ReturnType<typeof authHydrate>
  | ReturnType<typeof authLogout>
  | ReturnType<typeof authUpdateProfileRequest>
  | ReturnType<typeof authUpdateProfileSuccess>
  | ReturnType<typeof authUpdateProfileFailure>;
