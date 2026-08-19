import { UnknownAction } from "@reduxjs/toolkit";

import {
  NOTIFICATION_FETCH_REQUEST,
  NOTIFICATION_FETCH_SUCCESS,
  NOTIFICATION_FETCH_FAILURE,
  NOTIFICATION_MARK_READ_SUCCESS,
  NOTIFICATION_MARK_ALL_READ_SUCCESS,
  NOTIFICATION_REMOVE_SUCCESS,
} from "./actionType";

import { NotificationState } from "./type";
import { NotificationAction } from "./action";

const initialState: NotificationState = {
  items: [],
  unreadCount: 0,
  loading: false,
  loaded: false,
  error: null,
};

const notificationReducer = (state: NotificationState = initialState, action: UnknownAction): NotificationState => {
  const typed = action as NotificationAction;

  switch (typed.type) {
    case NOTIFICATION_FETCH_REQUEST:
      return { ...state, loading: true, error: null };

    case NOTIFICATION_FETCH_SUCCESS:
      return { ...state, loading: false, loaded: true, items: typed.payload.items, unreadCount: typed.payload.unreadCount };

    case NOTIFICATION_FETCH_FAILURE:
      return { ...state, loading: false, error: typed.payload };

    case NOTIFICATION_MARK_READ_SUCCESS: {
      const wasUnread = state.items.find((n) => n.id === typed.payload)?.read === false;
      return {
        ...state,
        items: state.items.map((n) => (n.id === typed.payload ? { ...n, read: true } : n)),
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      };
    }

    case NOTIFICATION_MARK_ALL_READ_SUCCESS:
      return { ...state, items: state.items.map((n) => ({ ...n, read: true })), unreadCount: 0 };

    case NOTIFICATION_REMOVE_SUCCESS: {
      const wasUnread = state.items.find((n) => n.id === typed.payload)?.read === false;
      return {
        ...state,
        items: state.items.filter((n) => n.id !== typed.payload),
        unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
      };
    }

    default:
      return state;
  }
};

export default notificationReducer;
