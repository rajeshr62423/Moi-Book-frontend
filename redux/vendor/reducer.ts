import { UnknownAction } from "@reduxjs/toolkit";

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

import { VendorState } from "./type";
import { VendorAction } from "./action";

const initialState: VendorState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
};

const vendorReducer = (state: VendorState = initialState, action: UnknownAction): VendorState => {
  const typed = action as VendorAction;

  switch (typed.type) {
    case VENDOR_LIST_REQUEST:
    case VENDOR_SAVE_REQUEST:
    case VENDOR_DELETE_REQUEST:
      return { ...state, loading: true, error: null };

    case VENDOR_LIST_SUCCESS:
      return { ...state, loading: false, loaded: true, items: typed.payload };

    case VENDOR_SAVE_SUCCESS: {
      const saved = typed.payload;
      const exists = state.items.some((v) => v.id === saved.id);
      return {
        ...state,
        loading: false,
        items: exists ? state.items.map((v) => (v.id === saved.id ? saved : v)) : [saved, ...state.items],
      };
    }

    case VENDOR_DELETE_SUCCESS:
      return { ...state, loading: false, items: state.items.filter((v) => v.id !== typed.payload) };

    case VENDOR_LIST_FAILURE:
    case VENDOR_SAVE_FAILURE:
    case VENDOR_DELETE_FAILURE:
      return { ...state, loading: false, error: typed.payload };

    default:
      return state;
  }
};

export default vendorReducer;
