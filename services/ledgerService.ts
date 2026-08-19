import api from "./api";
import type { ApiResponse } from "./apiTypes";
import type { LedgerItem, LedgerInput } from "@/redux/ledger/type";

export const listLedgerApi = async (): Promise<LedgerItem[]> => {
  const response = await api.get<ApiResponse<LedgerItem[]>>("/ledger");
  return response.data.data;
};

export const createLedgerApi = async (payload: LedgerInput): Promise<ApiResponse<LedgerItem>> => {
  const response = await api.post<ApiResponse<LedgerItem>>("/ledger", payload);
  return response.data;
};

export const updateLedgerApi = async (id: string, payload: LedgerInput): Promise<ApiResponse<LedgerItem>> => {
  const response = await api.patch<ApiResponse<LedgerItem>>(`/ledger/${id}`, payload);
  return response.data;
};

export const deleteLedgerApi = async (id: string): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(`/ledger/${id}`);
  return response.data;
};
