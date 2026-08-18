import {
  GUEST_LIST_REQUEST,
  GUEST_LIST_SUCCESS,
  GUEST_LIST_FAILURE,
  GUEST_SAVE_REQUEST,
  GUEST_SAVE_SUCCESS,
  GUEST_SAVE_FAILURE,
  GUEST_DELETE_REQUEST,
  GUEST_DELETE_SUCCESS,
  GUEST_DELETE_FAILURE,
} from "./actionType";

import { GuestItem } from "./type";

export const guestListRequest = () => ({
  type: GUEST_LIST_REQUEST as typeof GUEST_LIST_REQUEST,
});

export const guestListSuccess = (items: GuestItem[]) => ({
  type: GUEST_LIST_SUCCESS as typeof GUEST_LIST_SUCCESS,
  payload: items,
});

export const guestListFailure = (error: string) => ({
  type: GUEST_LIST_FAILURE as typeof GUEST_LIST_FAILURE,
  payload: error,
});

/** Used for both create and update — the reducer upserts by id. */
export const guestSaveRequest = () => ({
  type: GUEST_SAVE_REQUEST as typeof GUEST_SAVE_REQUEST,
});

export const guestSaveSuccess = (guest: GuestItem) => ({
  type: GUEST_SAVE_SUCCESS as typeof GUEST_SAVE_SUCCESS,
  payload: guest,
});

export const guestSaveFailure = (error: string) => ({
  type: GUEST_SAVE_FAILURE as typeof GUEST_SAVE_FAILURE,
  payload: error,
});

export const guestDeleteRequest = () => ({
  type: GUEST_DELETE_REQUEST as typeof GUEST_DELETE_REQUEST,
});

export const guestDeleteSuccess = (id: string) => ({
  type: GUEST_DELETE_SUCCESS as typeof GUEST_DELETE_SUCCESS,
  payload: id,
});

export const guestDeleteFailure = (error: string) => ({
  type: GUEST_DELETE_FAILURE as typeof GUEST_DELETE_FAILURE,
  payload: error,
});

export type GuestAction =
  | ReturnType<typeof guestListRequest>
  | ReturnType<typeof guestListSuccess>
  | ReturnType<typeof guestListFailure>
  | ReturnType<typeof guestSaveRequest>
  | ReturnType<typeof guestSaveSuccess>
  | ReturnType<typeof guestSaveFailure>
  | ReturnType<typeof guestDeleteRequest>
  | ReturnType<typeof guestDeleteSuccess>
  | ReturnType<typeof guestDeleteFailure>;
