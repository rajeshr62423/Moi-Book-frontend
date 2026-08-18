import { UnknownAction } from "@reduxjs/toolkit";

import {
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_FAILURE,
  AUTH_REGISTER_REQUEST,
  AUTH_REGISTER_SUCCESS,
  AUTH_REGISTER_FAILURE,
  AUTH_HYDRATE,
  AUTH_LOGOUT,
} from "./actionType";

import { AuthState } from "./type";
import { AuthAction } from "./action";

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  isReady: false,
  error: null,
};

const authReducer = (state: AuthState = initialState, action: UnknownAction): AuthState => {
  const typed = action as AuthAction;

  switch (typed.type) {
    case AUTH_LOGIN_REQUEST:
    case AUTH_REGISTER_REQUEST:
      return { ...state, loading: true, error: null };

    case AUTH_LOGIN_SUCCESS:
    case AUTH_REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        user: typed.payload.user,
        accessToken: typed.payload.accessToken,
        refreshToken: typed.payload.refreshToken,
      };

    case AUTH_LOGIN_FAILURE:
    case AUTH_REGISTER_FAILURE:
      return { ...state, loading: false, error: typed.payload };

    case AUTH_HYDRATE:
      return {
        ...state,
        isReady: true,
        user: typed.payload?.user ?? null,
        accessToken: typed.payload?.accessToken ?? null,
        refreshToken: typed.payload?.refreshToken ?? null,
      };

    case AUTH_LOGOUT:
      return { ...initialState, isReady: true };

    default:
      return state;
  }
};

export default authReducer;
