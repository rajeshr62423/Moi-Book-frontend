"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ConfirmDialog from "@/components/ConfirmDialog";
import PageHeader from "@/components/PageHeader";
import { CATEGORY_LABEL_KEYS } from "@/components/modals/AddVendorModal";
import { useI18n } from "@/lib/i18n";
import { useHideAppLoaderOnMount, useModal } from "@/lib/ui";
import { useSettings } from "@/lib/settings";
import { formatMoiDate, formatCurrency } from "@/lib/moiFormat";
import { computeLedgerTotals } from "@/lib/ledgerTotals";
import { fetchLedger, removeLedgerEntry } from "@/redux/ledger/thunk";
import { fetchEvents } from "@/redux/event/thunk";
import type { AppDispatch, RootState } from "@/redux/store";
import { extractApiErrorMessage } from "@/services/apiTypes";
import type { LedgerItem } from "@/redux/ledger/type";
import {
  CalendarClockIcon,
  CheckIcon,
  DocumentIcon,
  EditIcon,
  LedgerIcon,
  PlusIcon,
  TrashIcon,
} from "@/components/icons";

const TABS = ["tabOverview", "tabAllTransactions", "tabIncome", "tabExpenses", "tabReports"] as const;
type Tab = (typeof TABS)[number];

export default function LedgerPage() {
  useHideAppLoaderOnMount();
  const { t } = useI18n();
  const { openModal } = useModal();
  const { settings } = useSettings();
  const dispatch = useDispatch<AppDispatch>();
  const { items: ledgerItems, loaded } = useSelector((state: RootState) => state.ledger);
  const { items: events, loaded: eventsLoaded } = useSelector((state: RootState) => state.event);
  const [activeTab, setActiveTab] = useState<Tab>("tabOverview");
  const [deleting, setDeleting] = useState<LedgerItem | null>(null);

  useEffect(() => {
    if (!loaded) dispatch(fetchLedger()).catch((err) => toast.error(extractApiErrorMessage(err, "Couldn't load ledger entries")));
  }, [dispatch, loaded]);

  useEffect(() => {
    if (!eventsLoaded) dispatch(fetchEvents()).catch(() => {});
  }, [dispatch, eventsLoaded]);

  function eventName(eventId: string) {
    return events.find((ev) => ev.id === eventId)?.name ?? "—";
  }

  async function confirmDelete() {
    if (!deleting) return;
    try {
      const response = await dispatch(removeLedgerEntry(deleting.id));
      toast.success(response.message);
    } catch (err) {
      toast.error(extractApiErrorMessage(err, "Couldn't delete the transaction"));
    } finally {
      setDeleting(null);
    }
  }

  const totals = useMemo(() => computeLedgerTotals(events, ledgerItems), [events, ledgerItems]);

  const categoryBreakdown = useMemo(() => {
    const totalsByCategory = new Map<string, number>();
    for (const e of ledgerItems) {
      totalsByCategory.set(e.category, (totalsByCategory.get(e.category) ?? 0) + e.amount);
    }
    const grandTotal = ledgerItems.reduce((sum, e) => sum + e.amount, 0);
    return Array.from(totalsByCategory.entries())
      .map(([category, amount]) => ({
        category: category as LedgerItem["category"],
        amount,
        pct: grandTotal > 0 ? Math.round((amount / grandTotal) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [ledgerItems]);

  const recentTransactions = useMemo(() => ledgerItems.slice(0, 5), [ledgerItems]);

  const KPIS = [
    { icon: LedgerIcon, bg: "var(--amber-bg)", color: "var(--amber)", value: formatCurrency(totals.totalBudget, settings?.currency), labelKey: "totalBudget" as const },
    { icon: CheckIcon, bg: "var(--sage-bg)", color: "var(--sage)", value: formatCurrency(totals.totalPaid, settings?.currency), labelKey: "totalPaid" as const },
    { icon: CalendarClockIcon, bg: "var(--rose-bg)", color: "#C97A6A", value: formatCurrency(totals.totalRemaining, settings?.currency), labelKey: "totalRemaining" as const },
    { icon: DocumentIcon, bg: "var(--amber-bg)", color: "var(--amber)", value: String(ledgerItems.length), labelKey: "paymentsLabel" as const },
  ];

  function renderTransactionList(items: LedgerItem[], withActions: boolean) {
    if (loaded && items.length === 0) {
      return (
        <div className="template-empty">
          <LedgerIcon />
          <h3>{t("noTransactionsYet")}</h3>
          <p>{t("noTransactionsHint")}</p>
          <button className="btn" onClick={() => openModal("addLedger")}>
            <PlusIcon /> <span>{t("addTransaction")}</span>
          </button>
        </div>
      );
    }
    return (
      <div className="attn-list">
        {items.map((tx) => (
          <div className="attn-item" key={tx.id}>
            <div
              className="attn-ico"
              style={tx.status === "paid" ? { background: "var(--sage-bg)", color: "var(--sage)" } : { background: "var(--rose-bg)", color: "#C97A6A" }}
            >
              <LedgerIcon />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <b>{tx.title}</b>
              <span>
                {eventName(tx.eventId)} · {formatMoiDate(tx.date, settings?.dateFormat)}
              </span>
            </div>
            <span className={`badge ${tx.status}`} style={{ marginLeft: "auto" }}>
              {tx.status === "paid" ? t("paidLegend") : t("pendingLabel")}
            </span>
            {withActions && (
              <div className="row-actions">
                <button title={t("editTransaction")} onClick={() => openModal("addLedger", tx)}>
                  <EditIcon />
                </button>
                <button title={t("deleteTransaction")} onClick={() => setDeleting(tx)}>
                  <TrashIcon />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={t("ledgerPageTitle")}
        actions={
          <button className="btn" onClick={() => openModal("addLedger")}>
            <PlusIcon /> <span>{t("addTransaction")}</span>
          </button>
        }
      />

      <div className="kpi-strip">
        {KPIS.map(({ icon: Icon, bg, color, value, labelKey }) => (
          <div className="kpi-card glass" key={labelKey}>
            <div className="kpi-top">
              <div className="stat-icon" style={{ background: bg, color }}>
                <Icon />
              </div>
              <span className="kpi-tag">{t(labelKey)}</span>
            </div>
            <div className="kpi-value">{value}</div>
          </div>
        ))}
      </div>

      <div className="glass">
        <div className="tabs-row">
          {TABS.map((key) => (
            <div key={key} className={`tab-item${activeTab === key ? " active" : ""}`} onClick={() => setActiveTab(key)}>
              {t(key)}
            </div>
          ))}
        </div>

        {activeTab === "tabOverview" && (
          <div className="two-col" style={{ padding: 22, marginBottom: 0 }}>
            <div>
              <h3 style={{ fontSize: 14.5, margin: "0 0 14px", color: "var(--brown)" }}>{t("budgetOverview")}</h3>
              <div className="donut-wrap" style={{ alignItems: "flex-start", flexDirection: "row", gap: 26, padding: 0 }}>
                <div
                  className="donut"
                  style={{ flexShrink: 0, background: `conic-gradient(var(--sage) 0 ${totals.paidPct}%, var(--rose) ${totals.paidPct}% 100%)` }}
                >
                  <div className="donut-pct">{totals.paidPct}%</div>
                </div>
                <div className="legend" style={{ justifyContent: "center" }}>
                  <div className="legend-row">
                    <span>
                      <span className="dot" style={{ background: "var(--sage)" }} />
                      <span>{t("paidLegend")}</span>
                    </span>
                    <b>
                      {formatCurrency(totals.totalPaid, settings?.currency)} ({totals.paidPct}%)
                    </b>
                  </div>
                  <div className="legend-row">
                    <span>
                      <span className="dot" style={{ background: "var(--rose)" }} />
                      <span>{t("remainingLegend")}</span>
                    </span>
                    <b>
                      {formatCurrency(totals.totalRemaining, settings?.currency)} ({100 - totals.paidPct}%)
                    </b>
                  </div>
                  <div className="legend-row">
                    <span>
                      <span className="dot" style={{ background: "var(--champagne)" }} />
                      <span>{t("totalBudget")}</span>
                    </span>
                    <b>{formatCurrency(totals.totalBudget, settings?.currency)}</b>
                  </div>
                </div>
              </div>
              <h3 style={{ fontSize: 14.5, margin: "26px 0 12px", color: "var(--brown)" }}>{t("categoryBreakdown")}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 9, fontSize: 12, color: "var(--muted)" }}>
                {categoryBreakdown.length === 0 && <span>—</span>}
                {categoryBreakdown.map((c) => (
                  <div style={{ display: "flex", justifyContent: "space-between" }} key={c.category}>
                    <span>{t(CATEGORY_LABEL_KEYS[c.category])}</span>
                    <b style={{ color: "var(--brown)" }}>
                      {formatCurrency(c.amount, settings?.currency)} ({c.pct}%)
                    </b>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: 14.5, margin: "0 0 6px", color: "var(--brown)" }}>{t("recentTransactions")}</h3>
              {renderTransactionList(recentTransactions, false)}
              {ledgerItems.length > 5 && (
                <span className="link-sm" onClick={() => setActiveTab("tabAllTransactions")} style={{ cursor: "pointer" }}>
                  <span>{t("viewAllTransactions")}</span>
                </span>
              )}
            </div>
          </div>
        )}

        {activeTab === "tabAllTransactions" && renderTransactionList(ledgerItems, true)}
        {activeTab === "tabIncome" && renderTransactionList(ledgerItems.filter((e) => e.type === "income"), true)}
        {activeTab === "tabExpenses" && renderTransactionList(ledgerItems.filter((e) => e.type === "expense"), true)}
        {activeTab === "tabReports" && (
          <div className="template-empty">
            <DocumentIcon />
            <p>{t("reportsComingSoon")}</p>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleting}
        title={t("deleteTransactionConfirmTitle")}
        body={t("deleteTransactionConfirmBody")}
        cancelLabel={t("cancel")}
        confirmLabel={t("deleteTransaction")}
        onCancel={() => setDeleting(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
