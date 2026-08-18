import {
  MOI_LIST_REQUEST,
  MOI_LIST_SUCCESS,
  MOI_LIST_FAILURE,
  MOI_SAVE_REQUEST,
  MOI_SAVE_SUCCESS,
  MOI_SAVE_FAILURE,
  MOI_DELETE_REQUEST,
  MOI_DELETE_SUCCESS,
  MOI_DELETE_FAILURE,
} from "./actionType";

import { MoiItem } from "./type";

export const moiListRequest = () => ({
  type: MOI_LIST_REQUEST as typeof MOI_LIST_REQUEST,
});

export const moiListSuccess = (items: MoiItem[]) => ({
  type: MOI_LIST_SUCCESS as typeof MOI_LIST_SUCCESS,
  payload: items,
});

export const moiListFailure = (error: string) => ({
  type: MOI_LIST_FAILURE as typeof MOI_LIST_FAILURE,
  payload: error,
});

/** Used for both create and update — the reducer upserts by id. */
export const moiSaveRequest = () => ({
  type: MOI_SAVE_REQUEST as typeof MOI_SAVE_REQUEST,
});

export const moiSaveSuccess = (item: MoiItem) => ({
  type: MOI_SAVE_SUCCESS as typeof MOI_SAVE_SUCCESS,
  payload: item,
});

export const moiSaveFailure = (error: string) => ({
  type: MOI_SAVE_FAILURE as typeof MOI_SAVE_FAILURE,
  payload: error,
});

export const moiDeleteRequest = () => ({
  type: MOI_DELETE_REQUEST as typeof MOI_DELETE_REQUEST,
});

export const moiDeleteSuccess = (id: string) => ({
  type: MOI_DELETE_SUCCESS as typeof MOI_DELETE_SUCCESS,
  payload: id,
});

export const moiDeleteFailure = (error: string) => ({
  type: MOI_DELETE_FAILURE as typeof MOI_DELETE_FAILURE,
  payload: error,
});

export type MoiAction =
  | ReturnType<typeof moiListRequest>
  | ReturnType<typeof moiListSuccess>
  | ReturnType<typeof moiListFailure>
  | ReturnType<typeof moiSaveRequest>
  | ReturnType<typeof moiSaveSuccess>
  | ReturnType<typeof moiSaveFailure>
  | ReturnType<typeof moiDeleteRequest>
  | ReturnType<typeof moiDeleteSuccess>
  | ReturnType<typeof moiDeleteFailure>;
