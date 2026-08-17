import { UnknownAction } from "@reduxjs/toolkit";

import {
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_FAILURE,
  AUTH_LOGIN_CLEAR,
} from "./actionType";

import { AuthState } from "./type";

const initialState: AuthState = {
  loading: false,
  data: null,
  error: null,
};

const authReducer = (
  state: AuthState = initialState,
  action: UnknownAction,
): AuthState => {
  switch (action.type) {
    case AUTH_LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case AUTH_LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload as AuthState["data"],
        error: null,
      };

    case AUTH_LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload as string,
      };

    case AUTH_LOGIN_CLEAR:
      return initialState;

    default:
      return state;
  }
};

export default authReducer;
