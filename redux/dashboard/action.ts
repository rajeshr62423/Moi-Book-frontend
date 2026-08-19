import {
  DASHBOARD_SUMMARY_REQUEST,
  DASHBOARD_SUMMARY_SUCCESS,
  DASHBOARD_SUMMARY_FAILURE,
} from "./actionType";

import { DashboardSummary } from "./type";

export const dashboardSummaryRequest = () => ({
  type: DASHBOARD_SUMMARY_REQUEST as typeof DASHBOARD_SUMMARY_REQUEST,
});

export const dashboardSummarySuccess = (summary: DashboardSummary) => ({
  type: DASHBOARD_SUMMARY_SUCCESS as typeof DASHBOARD_SUMMARY_SUCCESS,
  payload: summary,
});

export const dashboardSummaryFailure = (error: string) => ({
  type: DASHBOARD_SUMMARY_FAILURE as typeof DASHBOARD_SUMMARY_FAILURE,
  payload: error,
});

export type DashboardAction =
  | ReturnType<typeof dashboardSummaryRequest>
  | ReturnType<typeof dashboardSummarySuccess>
  | ReturnType<typeof dashboardSummaryFailure>;
