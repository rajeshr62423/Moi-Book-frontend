import { REPORT_LIST_REQUEST, REPORT_LIST_SUCCESS, REPORT_LIST_FAILURE } from "./actionType";

import type { ApiMeta } from "@/services/apiTypes";
import type { ReportRecord, ReportSummary } from "./type";

export const reportListRequest = () => ({
  type: REPORT_LIST_REQUEST as typeof REPORT_LIST_REQUEST,
});

export const reportListSuccess = (payload: { records: ReportRecord[]; summary: ReportSummary; meta: ApiMeta | null }) => ({
  type: REPORT_LIST_SUCCESS as typeof REPORT_LIST_SUCCESS,
  payload,
});

export const reportListFailure = (error: string) => ({
  type: REPORT_LIST_FAILURE as typeof REPORT_LIST_FAILURE,
  payload: error,
});

export type ReportAction = ReturnType<typeof reportListRequest> | ReturnType<typeof reportListSuccess> | ReturnType<typeof reportListFailure>;
