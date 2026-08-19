import api from "./api";
import type { ApiResponse } from "./apiTypes";
import type { NotificationItem } from "@/redux/notification/type";

export const listNotificationsApi = async (): Promise<{ items: NotificationItem[]; unreadCount: number }> => {
  const response = await api.get<ApiResponse<{ items: NotificationItem[]; unreadCount: number }>>("/notifications");
  return response.data.data;
};

export const markNotificationReadApi = async (id: string): Promise<ApiResponse<NotificationItem>> => {
  const response = await api.patch<ApiResponse<NotificationItem>>(`/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsReadApi = async (): Promise<ApiResponse<null>> => {
  const response = await api.post<ApiResponse<null>>("/notifications/read-all");
  return response.data;
};

export const deleteNotificationApi = async (id: string): Promise<ApiResponse<null>> => {
  const response = await api.delete<ApiResponse<null>>(`/notifications/${id}`);
  return response.data;
};
