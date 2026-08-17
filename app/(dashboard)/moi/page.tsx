"use client";

import { useMemo } from "react";
import PageHeader from "@/components/PageHeader";
import SortFilterBar from "@/components/SortFilterBar";
import { useI18n } from "@/lib/i18n";
import { useHideAppLoaderOnMount, useModal } from "@/lib/ui";
import { useSortFilter } from "@/lib/useSortFilter";
import { moiContributions } from "@/lib/data";
import type { MoiItem } from "@/lib/types";
import { EditIcon, EyeIcon, LedgerIcon, MoiIcon, PlusIcon } from "@/components/icons";

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

const STATS = [
  { value: "₹2,45,000", labelKey: "moiTotalReceived" as const, bg: "var(--amber-bg)", color: "var(--amber)" },
  { value: "₹1,85,000", labelKey: "moiMoneyReceived" as const, bg: "var(--sage-bg)", color: "var(--sage)" },
  { value: "₹60,000", labelKey: "moiGiftValue" as const, bg: "var(--rose-bg)", color: "var(--rose)" },
  { value: "124", labelKey: "moiTotalContributions" as const, bg: "var(--amber-bg)", color: "var(--amber)" },
];

export default function MoiPage() {
  useHideAppLoaderOnMount();
  const { t } = useI18n();
  const { openModal } = useModal();

  const filterGroups = useMemo(
    () => [
      {
        key: "type",
        label: "Type",
        getValue: (m: MoiItem) => m.type,
        options: [
          { value: "money", label: "Money" },
          { value: "gift", label: "Gifts" },
        ],
      },
      {
        key: "method",
        label: "Method",
        getValue: (m: MoiItem) => m.method,
        options: [
          { value: "cash", label: "Cash" },
          { value: "upi", label: "UPI" },
          { value: "bank", label: "Bank Transfer" },
          { value: "gold", label: "Gold" },
          { value: "silver", label: "Silver" },
          { value: "voucher", label: "Voucher" },
        ],
      },
    ],
    []
  );
  const sortOptions = useMemo(
    () => [
      { value: "date-recent", label: "Newest", compare: (a: MoiItem, b: MoiItem) => b.date.localeCompare(a.date) },
      { value: "date-old", label: "Oldest", compare: (a: MoiItem, b: MoiItem) => a.date.localeCompare(b.date) },
      { value: "amount-hl", label: "Amount: High → Low", compare: (a: MoiItem, b: MoiItem) => b.amount - a.amount },
      { value: "amount-lh", label: "Amount: Low → High", compare: (a: MoiItem, b: MoiItem) => a.amount - b.amount },
      { value: "name-az", label: "Name A–Z", compare: (a: MoiItem, b: MoiItem) => a.guestName.localeCompare(b.guestName) },
      { value: "name-za", label: "Name Z–A", compare: (a: MoiItem, b: MoiItem) => b.guestName.localeCompare(a.guestName) },
    ],
    []
  );

  const sf = useSortFilter<MoiItem>(moiContributions, {
    searchFields: (m) => `${m.guestName} ${m.amountLabel} ${m.kindLabel}`,
    filterGroups,
    sortOptions,
  });

  return (
    <>
      <PageHeader
        title={t("moiTitle")}
        actions={
          <button className="btn" onClick={() => openModal("createMoi")}>
            <PlusIcon /> <span>{t("createMoi")}</span>
          </button>
        }
      />
      <SortFilterBar state={sf} filterGroups={filterGroups} sortOptions={sortOptions} searchPlaceholder={t("searchMoi")} />

      <div className="stat-row stat-row-4col">
        {STATS.map((s) => (
          <div className="stat-card glass" key={s.labelKey}>
            <div className="stat-top">
              <div className="stat-icon" style={{ background: s.bg, color: s.color }}>
                {s.labelKey === "moiTotalReceived" || s.labelKey === "moiMoneyReceived" ? <LedgerIcon /> : <MoiIcon />}
              </div>
            </div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{t(s.labelKey)}</div>
          </div>
        ))}
      </div>

      <div className="glass">
        <div className="moi-list">
          {sf.filtered.map((m) => (
            <div className="moi-card" key={m.id}>
              <div className="moi-card-top">
                <div className="moi-avatar">{m.guestName.charAt(0)}</div>
                <div className="moi-who">
                  <div className="moi-name">{m.guestName}</div>
                  <div className="moi-event">{m.eventName}</div>
                </div>
              </div>
              <div className="moi-detail">
                <span className="moi-kind">{m.kindLabel}</span>
                <span className="moi-amount">{m.amountLabel}</span>
              </div>
              <div className="moi-card-foot">
                <span className="moi-date">{formatDate(m.date)}</span>
                <span className="badge confirmed">{t("moiReceived")}</span>
                <div className="row-actions">
                  <button title="View">
                    <EyeIcon />
                  </button>
                  <button title="Edit">
                    <EditIcon />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="pager">
          <span>
            {t("showing")} {sf.filtered.length} {t("of")} 124 contributions
          </span>
          <div className="nums">
            <span>&lt;</span>
            <span className="active">1</span>
            <span>2</span>
            <span>3</span>
            <span>...</span>
            <span>21</span>
            <span>&gt;</span>
          </div>
        </div>
      </div>
    </>
  );
}
