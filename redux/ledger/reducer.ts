import { UnknownAction } from "@reduxjs/toolkit";

import {
  LEDGER_LIST_REQUEST,
  LEDGER_LIST_SUCCESS,
  LEDGER_LIST_FAILURE,
  LEDGER_SAVE_REQUEST,
  LEDGER_SAVE_SUCCESS,
  LEDGER_SAVE_FAILURE,
  LEDGER_DELETE_REQUEST,
  LEDGER_DELETE_SUCCESS,
  LEDGER_DELETE_FAILURE,
} from "./actionType";

import { LedgerState } from "./type";
import { LedgerAction } from "./action";

const initialState: LedgerState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
};

const ledgerReducer = (state: LedgerState = initialState, action: UnknownAction): LedgerState => {
  const typed = action as LedgerAction;

  switch (typed.type) {
    case LEDGER_LIST_REQUEST:
    case LEDGER_SAVE_REQUEST:
    case LEDGER_DELETE_REQUEST:
      return { ...state, loading: true, error: null };

    case LEDGER_LIST_SUCCESS:
      return { ...state, loading: false, loaded: true, items: typed.payload };

    case LEDGER_SAVE_SUCCESS: {
      const saved = typed.payload;
      const exists = state.items.some((e) => e.id === saved.id);
      return {
        ...state,
        loading: false,
        items: exists ? state.items.map((e) => (e.id === saved.id ? saved : e)) : [saved, ...state.items],
      };
    }

    case LEDGER_DELETE_SUCCESS:
      return { ...state, loading: false, items: state.items.filter((e) => e.id !== typed.payload) };

    case LEDGER_LIST_FAILURE:
    case LEDGER_SAVE_FAILURE:
    case LEDGER_DELETE_FAILURE:
      return { ...state, loading: false, error: typed.payload };

    default:
      return state;
  }
};

export default ledgerReducer;
