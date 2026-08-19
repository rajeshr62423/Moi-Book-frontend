import { UnknownAction } from "@reduxjs/toolkit";

import {
  DASHBOARD_SUMMARY_REQUEST,
  DASHBOARD_SUMMARY_SUCCESS,
  DASHBOARD_SUMMARY_FAILURE,
} from "./actionType";

import { DashboardState } from "./type";
import { DashboardAction } from "./action";

const initialState: DashboardState = {
  summary: null,
  loading: false,
  loaded: false,
  error: null,
};

const dashboardReducer = (state: DashboardState = initialState, action: UnknownAction): DashboardState => {
  const typed = action as DashboardAction;

  switch (typed.type) {
    case DASHBOARD_SUMMARY_REQUEST:
      return { ...state, loading: true, error: null };

    case DASHBOARD_SUMMARY_SUCCESS:
      return { ...state, loading: false, loaded: true, summary: typed.payload };

    case DASHBOARD_SUMMARY_FAILURE:
      return { ...state, loading: false, error: typed.payload };

    default:
      return state;
  }
};

export default dashboardReducer;
