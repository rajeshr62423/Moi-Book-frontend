import { AppDispatch } from "../store";

import {
  moiListRequest,
  moiListSuccess,
  moiListFailure,
  moiSaveRequest,
  moiSaveSuccess,
  moiSaveFailure,
  moiDeleteRequest,
  moiDeleteSuccess,
  moiDeleteFailure,
} from "./action";

import { listMoiApi, createMoiApi, updateMoiApi, deleteMoiApi } from "@/services/moiService";
import { extractApiErrorMessage } from "@/services/apiTypes";
import type { MoiInput } from "./type";

export const fetchMoi = () => async (dispatch: AppDispatch) => {
  dispatch(moiListRequest());
  try {
    const items = await listMoiApi();
    dispatch(moiListSuccess(items));
    return items;
  } catch (error) {
    const message = extractApiErrorMessage(error, "Couldn't load moi contributions");
    dispatch(moiListFailure(message));
    throw new Error(message);
  }
};

export const saveMoi = (payload: MoiInput, editingId?: string) => async (dispatch: AppDispatch) => {
  dispatch(moiSaveRequest());
  try {
    const response = editingId ? await updateMoiApi(editingId, payload) : await createMoiApi(payload);
    dispatch(moiSaveSuccess(response.data));
    return response;
  } catch (error) {
    const message = extractApiErrorMessage(error, "Couldn't save the moi contribution");
    dispatch(moiSaveFailure(message));
    throw new Error(message);
  }
};

export const removeMoi = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(moiDeleteRequest());
  try {
    const response = await deleteMoiApi(id);
    dispatch(moiDeleteSuccess(id));
    return response;
  } catch (error) {
    const message = extractApiErrorMessage(error, "Couldn't delete the moi contribution");
    dispatch(moiDeleteFailure(message));
    throw new Error(message);
  }
};
