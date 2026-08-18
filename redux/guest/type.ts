// Mirrors moi-app-backend's GuestResponseDto / CreateGuestDto.
export type GuestGroup = "family" | "friends" | "colleagues" | "relatives";
export type GuestStatus = "attending" | "notattending" | "pending";

export interface GuestItem {
  id: string;
  name: string;
  group: GuestGroup;
  phone: string;
  email?: string;
  eventId: string;
  status: GuestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GuestInput {
  name: string;
  group: GuestGroup;
  phone: string;
  email?: string;
  eventId: string;
  status?: GuestStatus;
}

export interface GuestState {
  items: GuestItem[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}
