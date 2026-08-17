import api from "./api";
import { LoginRequest, LoginResponse } from "@/redux/auth/type";

export const loginApi = async (
  payload: LoginRequest,
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>("/auth/login", payload);

  return response.data;
};
