import api from "./api";
import type { ApiResponse } from "./apiTypes";
import type { AuthResult, LoginRequest, RegisterRequest, UpdateProfileRequest, User } from "@/redux/auth/type";

// Returns the full envelope (not just `.data`) so callers can surface the
// backend's own success message (e.g. via react-toastify) instead of a
// hardcoded frontend string.
export const loginApi = async (payload: LoginRequest): Promise<ApiResponse<AuthResult>> => {
  const response = await api.post<ApiResponse<AuthResult>>("/auth/login", payload);
  return response.data;
};

export const registerApi = async (payload: RegisterRequest): Promise<ApiResponse<AuthResult>> => {
  const response = await api.post<ApiResponse<AuthResult>>("/auth/register", payload);
  return response.data;
};

export const logoutApi = async (): Promise<ApiResponse<null>> => {
  const response = await api.post<ApiResponse<null>>("/auth/logout");
  return response.data;
};

export const meApi = async (): Promise<User> => {
  const response = await api.get<ApiResponse<User>>("/users/me");
  return response.data.data;
};

export const updateProfileApi = async (payload: UpdateProfileRequest): Promise<ApiResponse<User>> => {
  const response = await api.patch<ApiResponse<User>>("/users/me", payload);
  return response.data;
};

export const forgotPasswordApi = async (email: string): Promise<ApiResponse<null>> => {
  const response = await api.post<ApiResponse<null>>("/auth/forgot-password", { email });
  return response.data;
};

export const resetPasswordApi = async (token: string, newPassword: string): Promise<ApiResponse<null>> => {
  const response = await api.post<ApiResponse<null>>("/auth/reset-password", { token, newPassword });
  return response.data;
};

export const changePasswordApi = async (currentPassword: string, newPassword: string): Promise<ApiResponse<null>> => {
  const response = await api.post<ApiResponse<null>>("/auth/change-password", { currentPassword, newPassword });
  return response.data;
};
