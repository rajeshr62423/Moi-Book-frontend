import { AppDispatch } from "../store";

import {
  eventListRequest,
  eventListSuccess,
  eventListFailure,
  eventSaveRequest,
  eventSaveSuccess,
  eventSaveFailure,
  eventDeleteRequest,
  eventDeleteSuccess,
  eventDeleteFailure,
} from "./action";

import { listEventsApi, createEventApi, updateEventApi, deleteEventApi } from "@/services/eventService";
import { extractApiErrorMessage } from "@/services/apiTypes";
import type { EventInput } from "./type";

export const fetchEvents = () => async (dispatch: AppDispatch) => {
  dispatch(eventListRequest());
  try {
    const items = await listEventsApi();
    dispatch(eventListSuccess(items));
    return items;
  } catch (error) {
    const message = extractApiErrorMessage(error, "Couldn't load events");
    dispatch(eventListFailure(message));
    throw new Error(message);
  }
};

export const saveEvent = (payload: EventInput, editingId?: string) => async (dispatch: AppDispatch) => {
  dispatch(eventSaveRequest());
  try {
    const response = editingId ? await updateEventApi(editingId, payload) : await createEventApi(payload);
    dispatch(eventSaveSuccess(response.data));
    return response;
  } catch (error) {
    const message = extractApiErrorMessage(error, "Couldn't save the event");
    dispatch(eventSaveFailure(message));
    throw new Error(message);
  }
};

export const removeEvent = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(eventDeleteRequest());
  try {
    const response = await deleteEventApi(id);
    dispatch(eventDeleteSuccess(id));
    return response;
  } catch (error) {
    const message = extractApiErrorMessage(error, "Couldn't delete the event");
    dispatch(eventDeleteFailure(message));
    throw new Error(message);
  }
};
