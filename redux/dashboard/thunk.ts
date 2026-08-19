import { AppDispatch } from "../store";

import {
  dashboardSummaryRequest,
  dashboardSummarySuccess,
  dashboardSummaryFailure,
} from "./action";

import { getDashboardSummaryApi } from "@/services/dashboardService";
import { extractApiErrorMessage } from "@/services/apiTypes";

export const fetchDashboardSummary = () => async (dispatch: AppDispatch) => {
  dispatch(dashboardSummaryRequest());
  try {
    const summary = await getDashboardSummaryApi();
    dispatch(dashboardSummarySuccess(summary));
    return summary;
  } catch (error) {
    const message = extractApiErrorMessage(error, "Couldn't load dashboard summary");
    dispatch(dashboardSummaryFailure(message));
    throw new Error(message);
  }
};
