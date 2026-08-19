import { AppDispatch } from "../store";

import {
  notificationFetchRequest,
  notificationFetchSuccess,
  notificationFetchFailure,
  notificationMarkReadSuccess,
  notificationMarkAllReadSuccess,
  notificationRemoveSuccess,
} from "./action";

import {
  listNotificationsApi,
  markNotificationReadApi,
  markAllNotificationsReadApi,
  deleteNotificationApi,
} from "@/services/notificationService";
import { extractApiErrorMessage } from "@/services/apiTypes";

export const fetchNotifications = () => async (dispatch: AppDispatch) => {
  dispatch(notificationFetchRequest());
  try {
    const data = await listNotificationsApi();
    dispatch(notificationFetchSuccess(data));
    return data;
  } catch (error) {
    const message = extractApiErrorMessage(error, "Couldn't load notifications");
    dispatch(notificationFetchFailure(message));
    throw new Error(message);
  }
};

export const markNotificationRead = (id: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await markNotificationReadApi(id);
    dispatch(notificationMarkReadSuccess(id));
    return response;
  } catch (error) {
    throw new Error(extractApiErrorMessage(error, "Couldn't mark notification as read"));
  }
};

export const markAllNotificationsRead = () => async (dispatch: AppDispatch) => {
  try {
    const response = await markAllNotificationsReadApi();
    dispatch(notificationMarkAllReadSuccess());
    return response;
  } catch (error) {
    throw new Error(extractApiErrorMessage(error, "Couldn't mark all notifications as read"));
  }
};

export const removeNotification = (id: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await deleteNotificationApi(id);
    dispatch(notificationRemoveSuccess(id));
    return response;
  } catch (error) {
    throw new Error(extractApiErrorMessage(error, "Couldn't delete notification"));
  }
};
