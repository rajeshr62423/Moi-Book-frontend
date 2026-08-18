import { AppDispatch } from "../store";

import {
  guestListRequest,
  guestListSuccess,
  guestListFailure,
  guestSaveRequest,
  guestSaveSuccess,
  guestSaveFailure,
  guestDeleteRequest,
  guestDeleteSuccess,
  guestDeleteFailure,
} from "./action";

import { listGuestsApi, createGuestApi, updateGuestApi, deleteGuestApi } from "@/services/guestService";
import { extractApiErrorMessage } from "@/services/apiTypes";
import type { GuestInput } from "./type";

export const fetchGuests = () => async (dispatch: AppDispatch) => {
  dispatch(guestListRequest());
  try {
    const items = await listGuestsApi();
    dispatch(guestListSuccess(items));
    return items;
  } catch (error) {
    const message = extractApiErrorMessage(error, "Couldn't load guests");
    dispatch(guestListFailure(message));
    throw new Error(message);
  }
};

export const saveGuest = (payload: GuestInput, editingId?: string) => async (dispatch: AppDispatch) => {
  dispatch(guestSaveRequest());
  try {
    const response = editingId ? await updateGuestApi(editingId, payload) : await createGuestApi(payload);
    dispatch(guestSaveSuccess(response.data));
    return response;
  } catch (error) {
    const message = extractApiErrorMessage(error, "Couldn't save the guest");
    dispatch(guestSaveFailure(message));
    throw new Error(message);
  }
};

export const removeGuest = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(guestDeleteRequest());
  try {
    const response = await deleteGuestApi(id);
    dispatch(guestDeleteSuccess(id));
    return response;
  } catch (error) {
    const message = extractApiErrorMessage(error, "Couldn't delete the guest");
    dispatch(guestDeleteFailure(message));
    throw new Error(message);
  }
};
