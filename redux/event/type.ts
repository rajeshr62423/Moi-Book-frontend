// Mirrors moi-app-backend's EventResponseDto / CreateEventDto.
export type EventType = "wedding" | "birthday" | "anniversary" | "corporate" | "family" | "other";
export type EventStatus = "planning" | "confirmed" | "savedate";

export interface EventItem {
  id: string;
  name: string;
  type: EventType;
  date: string; // ISO yyyy-mm-dd
  time: string; // HH:mm
  guests: number;
  location: string;
  budget?: number;
  description?: string;
  thumbnail?: string; // data URL
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EventInput {
  name: string;
  type: EventType;
  date: string;
  time: string;
  guests: number;
  location: string;
  budget?: number;
  description?: string;
  thumbnail?: string;
  status?: EventStatus;
}

export interface EventState {
  items: EventItem[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}
