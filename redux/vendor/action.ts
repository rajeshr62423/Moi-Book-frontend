import {
  VENDOR_LIST_REQUEST,
  VENDOR_LIST_SUCCESS,
  VENDOR_LIST_FAILURE,
  VENDOR_SAVE_REQUEST,
  VENDOR_SAVE_SUCCESS,
  VENDOR_SAVE_FAILURE,
  VENDOR_DELETE_REQUEST,
  VENDOR_DELETE_SUCCESS,
  VENDOR_DELETE_FAILURE,
} from "./actionType";

import { VendorItem } from "./type";

export const vendorListRequest = () => ({
  type: VENDOR_LIST_REQUEST as typeof VENDOR_LIST_REQUEST,
});

export const vendorListSuccess = (items: VendorItem[]) => ({
  type: VENDOR_LIST_SUCCESS as typeof VENDOR_LIST_SUCCESS,
  payload: items,
});

export const vendorListFailure = (error: string) => ({
  type: VENDOR_LIST_FAILURE as typeof VENDOR_LIST_FAILURE,
  payload: error,
});

/** Used for both create and update — the reducer upserts by id. */
export const vendorSaveRequest = () => ({
  type: VENDOR_SAVE_REQUEST as typeof VENDOR_SAVE_REQUEST,
});

export const vendorSaveSuccess = (vendor: VendorItem) => ({
  type: VENDOR_SAVE_SUCCESS as typeof VENDOR_SAVE_SUCCESS,
  payload: vendor,
});

export const vendorSaveFailure = (error: string) => ({
  type: VENDOR_SAVE_FAILURE as typeof VENDOR_SAVE_FAILURE,
  payload: error,
});

export const vendorDeleteRequest = () => ({
  type: VENDOR_DELETE_REQUEST as typeof VENDOR_DELETE_REQUEST,
});

export const vendorDeleteSuccess = (id: string) => ({
  type: VENDOR_DELETE_SUCCESS as typeof VENDOR_DELETE_SUCCESS,
  payload: id,
});

export const vendorDeleteFailure = (error: string) => ({
  type: VENDOR_DELETE_FAILURE as typeof VENDOR_DELETE_FAILURE,
  payload: error,
});

export type VendorAction =
  | ReturnType<typeof vendorListRequest>
  | ReturnType<typeof vendorListSuccess>
  | ReturnType<typeof vendorListFailure>
  | ReturnType<typeof vendorSaveRequest>
  | ReturnType<typeof vendorSaveSuccess>
  | ReturnType<typeof vendorSaveFailure>
  | ReturnType<typeof vendorDeleteRequest>
  | ReturnType<typeof vendorDeleteSuccess>
  | ReturnType<typeof vendorDeleteFailure>;
