import {
  NOTIFICATION_FETCH_REQUEST,
  NOTIFICATION_FETCH_SUCCESS,
  NOTIFICATION_FETCH_FAILURE,
  NOTIFICATION_MARK_READ_SUCCESS,
  NOTIFICATION_MARK_ALL_READ_SUCCESS,
  NOTIFICATION_REMOVE_SUCCESS,
} from "./actionType";

import { NotificationItem } from "./type";

export const notificationFetchRequest = () => ({
  type: NOTIFICATION_FETCH_REQUEST as typeof NOTIFICATION_FETCH_REQUEST,
});

export const notificationFetchSuccess = (data: { items: NotificationItem[]; unreadCount: number }) => ({
  type: NOTIFICATION_FETCH_SUCCESS as typeof NOTIFICATION_FETCH_SUCCESS,
  payload: data,
});

export const notificationFetchFailure = (error: string) => ({
  type: NOTIFICATION_FETCH_FAILURE as typeof NOTIFICATION_FETCH_FAILURE,
  payload: error,
});

export const notificationMarkReadSuccess = (id: string) => ({
  type: NOTIFICATION_MARK_READ_SUCCESS as typeof NOTIFICATION_MARK_READ_SUCCESS,
  payload: id,
});

export const notificationMarkAllReadSuccess = () => ({
  type: NOTIFICATION_MARK_ALL_READ_SUCCESS as typeof NOTIFICATION_MARK_ALL_READ_SUCCESS,
});

export const notificationRemoveSuccess = (id: string) => ({
  type: NOTIFICATION_REMOVE_SUCCESS as typeof NOTIFICATION_REMOVE_SUCCESS,
  payload: id,
});

export type NotificationAction =
  | ReturnType<typeof notificationFetchRequest>
  | ReturnType<typeof notificationFetchSuccess>
  | ReturnType<typeof notificationFetchFailure>
  | ReturnType<typeof notificationMarkReadSuccess>
  | ReturnType<typeof notificationMarkAllReadSuccess>
  | ReturnType<typeof notificationRemoveSuccess>;
