import type { EventItem } from "@/redux/event/type";
import type { LedgerItem } from "@/redux/ledger/type";

export interface LedgerTotals {
  totalBudget: number;
  totalPaid: number;
  totalPending: number;
  totalRemaining: number;
  paidPct: number;
}

/** Shared by the Ledger page and the Dashboard's ledger summary card so the two never drift apart. */
export function computeLedgerTotals(events: EventItem[], ledgerItems: LedgerItem[]): LedgerTotals {
  const totalBudget = events.reduce((sum, ev) => sum + (ev.budget ?? 0), 0);
  const totalPaid = ledgerItems.filter((e) => e.status === "paid").reduce((sum, e) => sum + e.amount, 0);
  const totalPending = ledgerItems.filter((e) => e.status === "pending").reduce((sum, e) => sum + e.amount, 0);
  const totalRemaining = Math.max(0, totalBudget - totalPaid);
  const paidPct = totalBudget > 0 ? Math.min(100, Math.round((totalPaid / totalBudget) * 100)) : 0;
  return { totalBudget, totalPaid, totalPending, totalRemaining, paidPct };
}
