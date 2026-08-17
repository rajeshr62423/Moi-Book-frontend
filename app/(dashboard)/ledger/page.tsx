"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { useI18n } from "@/lib/i18n";
import { useHideAppLoaderOnMount } from "@/lib/ui";
import { ledgerCategories, ledgerTransactions } from "@/lib/data";
import { ArrowRightIcon, CalendarClockIcon, CheckIcon, DocumentIcon, LedgerIcon } from "@/components/icons";

const TABS = ["tabOverview", "tabAllTransactions", "tabIncome", "tabExpenses", "tabReports"] as const;

const KPIS = [
  { icon: LedgerIcon, bg: "var(--amber-bg)", color: "var(--amber)", value: "₹8,50,000", labelKey: "totalBudget" as const },
  { icon: CheckIcon, bg: "var(--sage-bg)", color: "var(--sage)", value: "₹5,72,000", labelKey: "totalPaid" as const },
  { icon: CalendarClockIcon, bg: "var(--rose-bg)", color: "#C97A6A", value: "₹2,78,000", labelKey: "totalRemaining" as const },
  { icon: DocumentIcon, bg: "var(--amber-bg)", color: "var(--amber)", value: "24", labelKey: "paymentsLabel" as const },
];

export default function LedgerPage() {
  useHideAppLoaderOnMount();
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("tabOverview");

  return (
    <>
      <PageHeader title={t("ledgerPageTitle")} />

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
        <div className="two-col" style={{ padding: 22, marginBottom: 0 }}>
          <div>
            <h3 style={{ fontSize: 14.5, margin: "0 0 14px", color: "var(--brown)" }}>{t("budgetOverview")}</h3>
            <div className="donut-wrap" style={{ alignItems: "flex-start", flexDirection: "row", gap: 26, padding: 0 }}>
              <div className="donut" style={{ flexShrink: 0 }}>
                <div className="donut-pct">67%</div>
              </div>
              <div className="legend" style={{ justifyContent: "center" }}>
                <div className="legend-row">
                  <span>
                    <span className="dot" style={{ background: "var(--sage)" }} />
                    <span>{t("paidLegend")}</span>
                  </span>
                  <b>₹5,72,000 (67%)</b>
                </div>
                <div className="legend-row">
                  <span>
                    <span className="dot" style={{ background: "var(--rose)" }} />
                    <span>{t("remainingLegend")}</span>
                  </span>
                  <b>₹2,78,000 (33%)</b>
                </div>
                <div className="legend-row">
                  <span>
                    <span className="dot" style={{ background: "var(--champagne)" }} />
                    <span>{t("totalBudget")}</span>
                  </span>
                  <b>₹8,50,000</b>
                </div>
              </div>
            </div>
            <h3 style={{ fontSize: 14.5, margin: "26px 0 12px", color: "var(--brown)" }}>{t("categoryBreakdown")}</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 9, fontSize: 12, color: "var(--muted)" }}>
              {ledgerCategories.map((c) => (
                <div style={{ display: "flex", justifyContent: "space-between" }} key={c.labelKey}>
                  <span>{t(c.labelKey)}</span>
                  <b style={{ color: "var(--brown)" }}>{c.amount}</b>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: 14.5, margin: "0 0 6px", color: "var(--brown)" }}>{t("recentTransactions")}</h3>
            <div className="attn-list" style={{ padding: 0 }}>
              {ledgerTransactions.map((tx, i) => (
                <div className="attn-item" key={i}>
                  <div
                    className="attn-ico"
                    style={
                      tx.status === "paid"
                        ? { background: "var(--sage-bg)", color: "var(--sage)" }
                        : { background: "var(--rose-bg)", color: "#C97A6A" }
                    }
                  >
                    <LedgerIcon />
                  </div>
                  <div>
                    <b>{tx.title}</b>
                    <span>{tx.date}</span>
                  </div>
                  <span className={`badge ${tx.status}`} style={{ marginLeft: "auto" }}>
                    {tx.status === "paid" ? t("paidLegend") : t("pendingLabel")}
                  </span>
                </div>
              ))}
            </div>
            <span className="link-sm">
              <span>{t("viewAllTransactions")}</span> <ArrowRightIcon />
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
