// Mirrors moi-app-backend's DashboardSummaryDto.
export type ActivityIcon = "events" | "guests" | "vendors" | "moi" | "ledger";

export interface ActivityEntry {
  icon: ActivityIcon;
  text: string;
  time: string; // ISO
}

export interface LedgerSummary {
  totalBudget: number;
  totalPaid: number;
  totalPending: number;
  totalRemaining: number;
  paidPct: number;
}

export interface DashboardSummary {
  upcomingEventsCount: number;
  totalGuests: number;
  pendingRsvps: number;
  vendorsCount: number;
  unbookedVendorsCount: number;
  ledger: LedgerSummary;
  recentActivity: ActivityEntry[];
}

export interface DashboardState {
  summary: DashboardSummary | null;
  loading: boolean;
  loaded: boolean;
  error: string | null;
}
