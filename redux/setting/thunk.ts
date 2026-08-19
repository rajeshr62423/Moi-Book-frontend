import { AppDispatch } from "../store";

import {
  settingFetchRequest,
  settingFetchSuccess,
  settingFetchFailure,
  settingUpdateRequest,
  settingUpdateSuccess,
  settingUpdateFailure,
} from "./action";

import { getSettingsApi, updateSettingsApi } from "@/services/settingService";
import { extractApiErrorMessage } from "@/services/apiTypes";
import type { UpdateSettingsRequest } from "./type";

export const fetchSettings = () => async (dispatch: AppDispatch) => {
  dispatch(settingFetchRequest());
  try {
    const settings = await getSettingsApi();
    dispatch(settingFetchSuccess(settings));
    return settings;
  } catch (error) {
    const message = extractApiErrorMessage(error, "Couldn't load your preferences");
    dispatch(settingFetchFailure(message));
    throw new Error(message);
  }
};

export const updateSettings = (payload: UpdateSettingsRequest) => async (dispatch: AppDispatch) => {
  dispatch(settingUpdateRequest());
  try {
    const response = await updateSettingsApi(payload);
    dispatch(settingUpdateSuccess(response.data));
    return response;
  } catch (error) {
    const message = extractApiErrorMessage(error, "Couldn't update your preferences");
    dispatch(settingUpdateFailure(message));
    throw new Error(message);
  }
};
