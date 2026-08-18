// Mirrors moi-app-backend's src/common/interfaces/api-response.interface.ts —
// every backend response (success or error) is wrapped in this envelope.
export interface ApiMeta {
  total_records: number;
  total_pages: number;
  current_page: number;
  per_page: number;
  count: number;
  has_next_page: boolean;
  has_prev_page: boolean;
}

export interface ApiResponse<T> {
  type: "success" | "error";
  status: number;
  message: string;
  data: T;
  meta?: ApiMeta;
  timestamp: string;
}

export interface ApiErrorData {
  errors?: string[];
}

/** Pulls the human-readable message out of an axios error hitting the backend's envelope. */
export function extractApiErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  const err = error as { response?: { data?: ApiResponse<ApiErrorData> } } | undefined;
  const body = err?.response?.data;
  if (!body) return fallback;
  return body.data?.errors?.[0] ?? body.message ?? fallback;
}
