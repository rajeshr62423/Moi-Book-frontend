import { AppDispatch } from "../store";

import { authLoginRequest, authLoginSuccess, authLoginFailure } from "./action";

import { loginApi } from "@/services/authService";

export const login =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    dispatch(authLoginRequest());

    try {
      const response = await loginApi({
        email,
        password,
      });

      dispatch(authLoginSuccess(response));

      return response;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Login failed";

      dispatch(authLoginFailure(message));

      throw error;
    }
  };
