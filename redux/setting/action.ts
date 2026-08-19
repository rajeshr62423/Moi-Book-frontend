import {
  SETTING_FETCH_REQUEST,
  SETTING_FETCH_SUCCESS,
  SETTING_FETCH_FAILURE,
  SETTING_UPDATE_REQUEST,
  SETTING_UPDATE_SUCCESS,
  SETTING_UPDATE_FAILURE,
} from "./actionType";

import { Settings } from "./type";

export const settingFetchRequest = () => ({
  type: SETTING_FETCH_REQUEST as typeof SETTING_FETCH_REQUEST,
});

export const settingFetchSuccess = (data: Settings) => ({
  type: SETTING_FETCH_SUCCESS as typeof SETTING_FETCH_SUCCESS,
  payload: data,
});

export const settingFetchFailure = (error: string) => ({
  type: SETTING_FETCH_FAILURE as typeof SETTING_FETCH_FAILURE,
  payload: error,
});

export const settingUpdateRequest = () => ({
  type: SETTING_UPDATE_REQUEST as typeof SETTING_UPDATE_REQUEST,
});

export const settingUpdateSuccess = (data: Settings) => ({
  type: SETTING_UPDATE_SUCCESS as typeof SETTING_UPDATE_SUCCESS,
  payload: data,
});

export const settingUpdateFailure = (error: string) => ({
  type: SETTING_UPDATE_FAILURE as typeof SETTING_UPDATE_FAILURE,
  payload: error,
});

export type SettingAction =
  | ReturnType<typeof settingFetchRequest>
  | ReturnType<typeof settingFetchSuccess>
  | ReturnType<typeof settingFetchFailure>
  | ReturnType<typeof settingUpdateRequest>
  | ReturnType<typeof settingUpdateSuccess>
  | ReturnType<typeof settingUpdateFailure>;
