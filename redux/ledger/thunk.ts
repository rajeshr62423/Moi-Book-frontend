import { AppDispatch } from "../store";

import {
  ledgerListRequest,
  ledgerListSuccess,
  ledgerListFailure,
  ledgerSaveRequest,
  ledgerSaveSuccess,
  ledgerSaveFailure,
  ledgerDeleteRequest,
  ledgerDeleteSuccess,
  ledgerDeleteFailure,
} from "./action";

import { listLedgerApi, createLedgerApi, updateLedgerApi, deleteLedgerApi } from "@/services/ledgerService";
import { extractApiErrorMessage } from "@/services/apiTypes";
import type { LedgerInput } from "./type";

export const fetchLedger = () => async (dispatch: AppDispatch) => {
  dispatch(ledgerListRequest());
  try {
    const items = await listLedgerApi();
    dispatch(ledgerListSuccess(items));
    return items;
  } catch (error) {
    const message = extractApiErrorMessage(error, "Couldn't load ledger entries");
    dispatch(ledgerListFailure(message));
    throw new Error(message);
  }
};

export const saveLedgerEntry = (payload: LedgerInput, editingId?: string) => async (dispatch: AppDispatch) => {
  dispatch(ledgerSaveRequest());
  try {
    const response = editingId ? await updateLedgerApi(editingId, payload) : await createLedgerApi(payload);
    dispatch(ledgerSaveSuccess(response.data));
    return response;
  } catch (error) {
    const message = extractApiErrorMessage(error, "Couldn't save the transaction");
    dispatch(ledgerSaveFailure(message));
    throw new Error(message);
  }
};

export const removeLedgerEntry = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(ledgerDeleteRequest());
  try {
    const response = await deleteLedgerApi(id);
    dispatch(ledgerDeleteSuccess(id));
    return response;
  } catch (error) {
    const message = extractApiErrorMessage(error, "Couldn't delete the transaction");
    dispatch(ledgerDeleteFailure(message));
    throw new Error(message);
  }
};
