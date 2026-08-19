import api from "./api";
import type { ApiResponse } from "./apiTypes";

export type SearchResultType = "event" | "guest" | "vendor" | "moi" | "ledger";

export interface SearchResultItem {
  type: SearchResultType;
  id: string;
  title: string;
  subtitle?: string;
  link: string;
}

export const searchApi = async (query: string): Promise<SearchResultItem[]> => {
  const response = await api.get<ApiResponse<{ items: SearchResultItem[] }>>("/search", {
    params: { q: query },
  });
  return response.data.data.items;
};
