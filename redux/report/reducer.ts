import { UnknownAction } from "@reduxjs/toolkit";

import { REPORT_LIST_REQUEST, REPORT_LIST_SUCCESS, REPORT_LIST_FAILURE } from "./actionType";

import { ReportState } from "./type";
import { ReportAction } from "./action";

const initialState: ReportState = {
  records: [],
  summary: null,
  meta: null,
  loading: false,
  loaded: false,
  error: null,
};

const reportReducer = (state: ReportState = initialState, action: UnknownAction): ReportState => {
  const typed = action as ReportAction;

  switch (typed.type) {
    case REPORT_LIST_REQUEST:
      return { ...state, loading: true, error: null };

    case REPORT_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        records: typed.payload.records,
        summary: typed.payload.summary,
        meta: typed.payload.meta,
      };

    case REPORT_LIST_FAILURE:
      return { ...state, loading: false, error: typed.payload };

    default:
      return state;
  }
};

export default reportReducer;
