import api from "./api";
import type { ApiResponse } from "./apiTypes";
import type { DashboardSummary } from "@/redux/dashboard/type";

export const getDashboardSummaryApi = async (): Promise<DashboardSummary> => {
  const response = await api.get<ApiResponse<DashboardSummary>>("/dashboard/summary");
  return response.data.data;
};
