// Mirrors moi-app-backend's LedgerResponseDto / CreateLedgerDto.
export type LedgerCategory = "catering" | "venue" | "photography" | "decoration" | "entertainment" | "transport" | "others";
export type LedgerType = "income" | "expense";
export type LedgerStatus = "paid" | "pending";

export interface LedgerItem {
  id: string;
  eventId: string;
  vendorId?: string;
  title: string;
  category: LedgerCategory;
  type: LedgerType;
  amount: number;
  status: LedgerStatus;
  date: string; // ISO yyyy-mm-dd
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LedgerInput {
  eventId: string;
  vendorId?: string;
  title: string;
  category: LedgerCategory;
  type?: LedgerType;
  amount: number;
  status?: LedgerStatus;
  date: string;
  notes?: string;
}

export interface LedgerState {
  items: LedgerItem[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}
