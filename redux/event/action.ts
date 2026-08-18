import {
  EVENT_LIST_REQUEST,
  EVENT_LIST_SUCCESS,
  EVENT_LIST_FAILURE,
  EVENT_SAVE_REQUEST,
  EVENT_SAVE_SUCCESS,
  EVENT_SAVE_FAILURE,
  EVENT_DELETE_REQUEST,
  EVENT_DELETE_SUCCESS,
  EVENT_DELETE_FAILURE,
} from "./actionType";

import { EventItem } from "./type";

export const eventListRequest = () => ({
  type: EVENT_LIST_REQUEST as typeof EVENT_LIST_REQUEST,
});

export const eventListSuccess = (items: EventItem[]) => ({
  type: EVENT_LIST_SUCCESS as typeof EVENT_LIST_SUCCESS,
  payload: items,
});

export const eventListFailure = (error: string) => ({
  type: EVENT_LIST_FAILURE as typeof EVENT_LIST_FAILURE,
  payload: error,
});

/** Used for both create and update — the reducer upserts by id. */
export const eventSaveRequest = () => ({
  type: EVENT_SAVE_REQUEST as typeof EVENT_SAVE_REQUEST,
});

export const eventSaveSuccess = (event: EventItem) => ({
  type: EVENT_SAVE_SUCCESS as typeof EVENT_SAVE_SUCCESS,
  payload: event,
});

export const eventSaveFailure = (error: string) => ({
  type: EVENT_SAVE_FAILURE as typeof EVENT_SAVE_FAILURE,
  payload: error,
});

export const eventDeleteRequest = () => ({
  type: EVENT_DELETE_REQUEST as typeof EVENT_DELETE_REQUEST,
});

export const eventDeleteSuccess = (id: string) => ({
  type: EVENT_DELETE_SUCCESS as typeof EVENT_DELETE_SUCCESS,
  payload: id,
});

export const eventDeleteFailure = (error: string) => ({
  type: EVENT_DELETE_FAILURE as typeof EVENT_DELETE_FAILURE,
  payload: error,
});

export type EventAction =
  | ReturnType<typeof eventListRequest>
  | ReturnType<typeof eventListSuccess>
  | ReturnType<typeof eventListFailure>
  | ReturnType<typeof eventSaveRequest>
  | ReturnType<typeof eventSaveSuccess>
  | ReturnType<typeof eventSaveFailure>
  | ReturnType<typeof eventDeleteRequest>
  | ReturnType<typeof eventDeleteSuccess>
  | ReturnType<typeof eventDeleteFailure>;
