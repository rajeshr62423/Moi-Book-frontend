import { UnknownAction } from "@reduxjs/toolkit";

import {
  SETTING_FETCH_REQUEST,
  SETTING_FETCH_SUCCESS,
  SETTING_FETCH_FAILURE,
  SETTING_UPDATE_REQUEST,
  SETTING_UPDATE_SUCCESS,
  SETTING_UPDATE_FAILURE,
} from "./actionType";

import { SettingState } from "./type";
import { SettingAction } from "./action";

const initialState: SettingState = {
  settings: null,
  loading: false,
  loaded: false,
  error: null,
};

const settingReducer = (state: SettingState = initialState, action: UnknownAction): SettingState => {
  const typed = action as SettingAction;

  switch (typed.type) {
    case SETTING_FETCH_REQUEST:
    case SETTING_UPDATE_REQUEST:
      return { ...state, loading: true, error: null };

    case SETTING_FETCH_SUCCESS:
      return { ...state, loading: false, loaded: true, settings: typed.payload };

    case SETTING_UPDATE_SUCCESS:
      return { ...state, loading: false, settings: typed.payload };

    case SETTING_FETCH_FAILURE:
    case SETTING_UPDATE_FAILURE:
      return { ...state, loading: false, error: typed.payload };

    default:
      return state;
  }
};

export default settingReducer;
