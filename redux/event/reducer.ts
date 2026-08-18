import { UnknownAction } from "@reduxjs/toolkit";

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

import { EventState } from "./type";
import { EventAction } from "./action";

const initialState: EventState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
};

const eventReducer = (state: EventState = initialState, action: UnknownAction): EventState => {
  const typed = action as EventAction;

  switch (typed.type) {
    case EVENT_LIST_REQUEST:
    case EVENT_SAVE_REQUEST:
    case EVENT_DELETE_REQUEST:
      return { ...state, loading: true, error: null };

    case EVENT_LIST_SUCCESS:
      return { ...state, loading: false, loaded: true, items: typed.payload };

    case EVENT_SAVE_SUCCESS: {
      const saved = typed.payload;
      const exists = state.items.some((ev) => ev.id === saved.id);
      return {
        ...state,
        loading: false,
        items: exists ? state.items.map((ev) => (ev.id === saved.id ? saved : ev)) : [saved, ...state.items],
      };
    }

    case EVENT_DELETE_SUCCESS:
      return { ...state, loading: false, items: state.items.filter((ev) => ev.id !== typed.payload) };

    case EVENT_LIST_FAILURE:
    case EVENT_SAVE_FAILURE:
    case EVENT_DELETE_FAILURE:
      return { ...state, loading: false, error: typed.payload };

    default:
      return state;
  }
};

export default eventReducer;
