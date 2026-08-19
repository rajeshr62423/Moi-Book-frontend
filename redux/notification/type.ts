// Mirrors moi-app-backend's NotificationResponseDto.
export type NotificationType = "events" | "guests" | "vendors" | "moi" | "ledger";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationState {
  items: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  loaded: boolean;
  error: string | null;
}
