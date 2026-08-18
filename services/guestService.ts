import api from "./api";
import type { ApiResponse } from "./apiTypes";
import type { GuestItem, GuestInput } from "@/redux/guest/type";

export const listGuestsApi = async (): Promise<GuestItem[]> => {
  const response = await api.get<ApiResponse<GuestItem[]>>("/guests");
  return response.data.data;
};

export const createGuestApi = async (payload: GuestInput): Promise<ApiResponse<GuestItem>> => {
  const response = await api.post<ApiResponse<GuestItem>>("/guests", payload);
  return response.data;
};

export const updateGuestApi = async (id: string, payload: GuestInput): Promise<ApiResponse<GuestItem>> => {
  const response = await api.patch<ApiResponse<GuestItem>>(`/guests/${id}`, payload);
  return response.data;
};

export const deleteGuestApi = async (id: string): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(`/guests/${id}`);
  return response.data;
};
