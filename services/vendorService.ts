import api from "./api";
import type { ApiResponse } from "./apiTypes";
import type { VendorItem, VendorInput } from "@/redux/vendor/type";

export const listVendorsApi = async (): Promise<VendorItem[]> => {
  const response = await api.get<ApiResponse<VendorItem[]>>("/vendors");
  return response.data.data;
};

export const createVendorApi = async (payload: VendorInput): Promise<ApiResponse<VendorItem>> => {
  const response = await api.post<ApiResponse<VendorItem>>("/vendors", payload);
  return response.data;
};

export const updateVendorApi = async (id: string, payload: VendorInput): Promise<ApiResponse<VendorItem>> => {
  const response = await api.patch<ApiResponse<VendorItem>>(`/vendors/${id}`, payload);
  return response.data;
};

export const deleteVendorApi = async (id: string): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(`/vendors/${id}`);
  return response.data;
};
