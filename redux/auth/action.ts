import {
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_FAILURE,
  AUTH_LOGIN_CLEAR,
} from "./actionType";

import { LoginResponse } from "./type";

export const authLoginRequest = () => ({
  type: AUTH_LOGIN_REQUEST as typeof AUTH_LOGIN_REQUEST,
});

export const authLoginSuccess = (data: LoginResponse) => ({
  type: AUTH_LOGIN_SUCCESS as typeof AUTH_LOGIN_SUCCESS,
  payload: data,
});

export const authLoginFailure = (error: string) => ({
  type: AUTH_LOGIN_FAILURE as typeof AUTH_LOGIN_FAILURE,
  payload: error,
});

export const authLoginClear = () => ({
  type: AUTH_LOGIN_CLEAR as typeof AUTH_LOGIN_CLEAR,
});

export type AuthAction =
  | ReturnType<typeof authLoginRequest>
  | ReturnType<typeof authLoginSuccess>
  | ReturnType<typeof authLoginFailure>
  | ReturnType<typeof authLoginClear>;
