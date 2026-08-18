import api from "./api";
import type { ApiResponse } from "./apiTypes";
import type { MoiItem, MoiInput } from "@/redux/moi/type";

export const listMoiApi = async (): Promise<MoiItem[]> => {
  const response = await api.get<ApiResponse<MoiItem[]>>("/moi");
  return response.data.data;
};

export const createMoiApi = async (payload: MoiInput): Promise<ApiResponse<MoiItem>> => {
  const response = await api.post<ApiResponse<MoiItem>>("/moi", payload);
  return response.data;
};

export const updateMoiApi = async (id: string, payload: MoiInput): Promise<ApiResponse<MoiItem>> => {
  const response = await api.patch<ApiResponse<MoiItem>>(`/moi/${id}`, payload);
  return response.data;
};

export const deleteMoiApi = async (id: string): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(`/moi/${id}`);
  return response.data;
};
