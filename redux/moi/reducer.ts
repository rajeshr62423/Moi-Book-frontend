import { UnknownAction } from "@reduxjs/toolkit";

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

import { MoiState } from "./type";
import { MoiAction } from "./action";

const initialState: MoiState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
};

const moiReducer = (state: MoiState = initialState, action: UnknownAction): MoiState => {
  const typed = action as MoiAction;

  switch (typed.type) {
    case MOI_LIST_REQUEST:
    case MOI_SAVE_REQUEST:
    case MOI_DELETE_REQUEST:
      return { ...state, loading: true, error: null };

    case MOI_LIST_SUCCESS:
      return { ...state, loading: false, loaded: true, items: typed.payload };

    case MOI_SAVE_SUCCESS: {
      const saved = typed.payload;
      const exists = state.items.some((m) => m.id === saved.id);
      return {
        ...state,
        loading: false,
        items: exists ? state.items.map((m) => (m.id === saved.id ? saved : m)) : [saved, ...state.items],
      };
    }

    case MOI_DELETE_SUCCESS:
      return { ...state, loading: false, items: state.items.filter((m) => m.id !== typed.payload) };

    case MOI_LIST_FAILURE:
    case MOI_SAVE_FAILURE:
    case MOI_DELETE_FAILURE:
      return { ...state, loading: false, error: typed.payload };

    default:
      return state;
  }
};

export default moiReducer;
