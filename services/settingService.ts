import api from "./api";
import type { ApiResponse } from "./apiTypes";
import type { Settings, UpdateSettingsRequest } from "@/redux/setting/type";

export const getSettingsApi = async (): Promise<Settings> => {
  const response = await api.get<ApiResponse<Settings>>("/settings/me");
  return response.data.data;
};

export const updateSettingsApi = async (payload: UpdateSettingsRequest): Promise<ApiResponse<Settings>> => {
  const response = await api.patch<ApiResponse<Settings>>("/settings/me", payload);
  return response.data;
};
