// Mirrors moi-app-backend's ReportsController / ReportsService response shape.
import type { ApiMeta } from "@/services/apiTypes";

export type ReportType = "eventSummary" | "guestReport" | "attendanceReport" | "eventActivity";

export interface ReportFilters {
  dateFrom?: string; // ISO yyyy-mm-dd
  dateTo?: string; // ISO yyyy-mm-dd
  eventId?: string; // "all" or a specific EventItem id
  reportType: ReportType;
  page: number;
  perPage: number;
}

export interface ReportRecord {
  eventId: string;
  eventName: string;
  date: string; // ISO yyyy-mm-dd
  guests: number;
  confirmed: number;
  pending: number;
  notAttending: number;
  attendanceRate: number; // 0-100
}

export interface ReportSummary {
  totalEvents: number;
  totalGuests: number;
  confirmedGuests: number;
  pendingGuests: number;
  attendanceRate: number; // 0-100
}

export interface ReportState {
  records: ReportRecord[];
  summary: ReportSummary | null;
  meta: ApiMeta | null;
  loading: boolean;
  loaded: boolean;
  error: string | null;
}
