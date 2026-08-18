import api from "./api";
import type { ApiResponse } from "./apiTypes";
import type { EventItem, EventInput } from "@/redux/event/type";

export const listEventsApi = async (): Promise<EventItem[]> => {
  const response = await api.get<ApiResponse<EventItem[]>>("/events");
  return response.data.data;
};

export const createEventApi = async (payload: EventInput): Promise<ApiResponse<EventItem>> => {
  const response = await api.post<ApiResponse<EventItem>>("/events", payload);
  return response.data;
};

export const updateEventApi = async (id: string, payload: EventInput): Promise<ApiResponse<EventItem>> => {
  const response = await api.patch<ApiResponse<EventItem>>(`/events/${id}`, payload);
  return response.data;
};

export const deleteEventApi = async (id: string): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(`/events/${id}`);
  return response.data;
};
