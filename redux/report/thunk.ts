import { AppDispatch } from "../store";

import { reportListRequest, reportListSuccess, reportListFailure } from "./action";

import { getReportRecordsApi } from "@/services/reportService";
import { extractApiErrorMessage } from "@/services/apiTypes";
import type { ReportFilters } from "./type";

export const fetchReportRecords = (filters: ReportFilters) => async (dispatch: AppDispatch) => {
  dispatch(reportListRequest());
  try {
    const response = await getReportRecordsApi(filters);
    dispatch(
      reportListSuccess({
        records: response.data.records,
        summary: response.data.summary,
        meta: response.meta ?? null,
      }),
    );
    return response;
  } catch (error) {
    const message = extractApiErrorMessage(error, "Couldn't generate the report");
    dispatch(reportListFailure(message));
    throw new Error(message);
  }
};
