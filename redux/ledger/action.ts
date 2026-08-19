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

import { LedgerItem } from "./type";

export const ledgerListRequest = () => ({
  type: LEDGER_LIST_REQUEST as typeof LEDGER_LIST_REQUEST,
});

export const ledgerListSuccess = (items: LedgerItem[]) => ({
  type: LEDGER_LIST_SUCCESS as typeof LEDGER_LIST_SUCCESS,
  payload: items,
});

export const ledgerListFailure = (error: string) => ({
  type: LEDGER_LIST_FAILURE as typeof LEDGER_LIST_FAILURE,
  payload: error,
});

/** Used for both create and update — the reducer upserts by id. */
export const ledgerSaveRequest = () => ({
  type: LEDGER_SAVE_REQUEST as typeof LEDGER_SAVE_REQUEST,
});

export const ledgerSaveSuccess = (item: LedgerItem) => ({
  type: LEDGER_SAVE_SUCCESS as typeof LEDGER_SAVE_SUCCESS,
  payload: item,
});

export const ledgerSaveFailure = (error: string) => ({
  type: LEDGER_SAVE_FAILURE as typeof LEDGER_SAVE_FAILURE,
  payload: error,
});

export const ledgerDeleteRequest = () => ({
  type: LEDGER_DELETE_REQUEST as typeof LEDGER_DELETE_REQUEST,
});

export const ledgerDeleteSuccess = (id: string) => ({
  type: LEDGER_DELETE_SUCCESS as typeof LEDGER_DELETE_SUCCESS,
  payload: id,
});

export const ledgerDeleteFailure = (error: string) => ({
  type: LEDGER_DELETE_FAILURE as typeof LEDGER_DELETE_FAILURE,
  payload: error,
});

export type LedgerAction =
  | ReturnType<typeof ledgerListRequest>
  | ReturnType<typeof ledgerListSuccess>
  | ReturnType<typeof ledgerListFailure>
  | ReturnType<typeof ledgerSaveRequest>
  | ReturnType<typeof ledgerSaveSuccess>
  | ReturnType<typeof ledgerSaveFailure>
  | ReturnType<typeof ledgerDeleteRequest>
  | ReturnType<typeof ledgerDeleteSuccess>
  | ReturnType<typeof ledgerDeleteFailure>;
