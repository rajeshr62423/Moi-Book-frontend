import api from "./api";
import type { ApiResponse } from "./apiTypes";
import type { Template, TemplateInput } from "./templateTypes";

export const listTemplatesApi = async (): Promise<Template[]> => {
  const response = await api.get<ApiResponse<Template[]>>("/templates");
  return response.data.data;
};

export const createTemplateApi = async (payload: TemplateInput): Promise<ApiResponse<Template>> => {
  const response = await api.post<ApiResponse<Template>>("/templates", payload);
  return response.data;
};

export const updateTemplateApi = async (id: string, payload: TemplateInput): Promise<ApiResponse<Template>> => {
  const response = await api.patch<ApiResponse<Template>>(`/templates/${id}`, payload);
  return response.data;
};

export const deleteTemplateApi = async (id: string): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(`/templates/${id}`);
  return response.data;
};
