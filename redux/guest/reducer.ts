import { UnknownAction } from "@reduxjs/toolkit";

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

import { GuestState } from "./type";
import { GuestAction } from "./action";

const initialState: GuestState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
};

const guestReducer = (state: GuestState = initialState, action: UnknownAction): GuestState => {
  const typed = action as GuestAction;

  switch (typed.type) {
    case GUEST_LIST_REQUEST:
    case GUEST_SAVE_REQUEST:
    case GUEST_DELETE_REQUEST:
      return { ...state, loading: true, error: null };

    case GUEST_LIST_SUCCESS:
      return { ...state, loading: false, loaded: true, items: typed.payload };

    case GUEST_SAVE_SUCCESS: {
      const saved = typed.payload;
      const exists = state.items.some((g) => g.id === saved.id);
      return {
        ...state,
        loading: false,
        items: exists ? state.items.map((g) => (g.id === saved.id ? saved : g)) : [saved, ...state.items],
      };
    }

    case GUEST_DELETE_SUCCESS:
      return { ...state, loading: false, items: state.items.filter((g) => g.id !== typed.payload) };

    case GUEST_LIST_FAILURE:
    case GUEST_SAVE_FAILURE:
    case GUEST_DELETE_FAILURE:
      return { ...state, loading: false, error: typed.payload };

    default:
      return state;
  }
};

export default guestReducer;
