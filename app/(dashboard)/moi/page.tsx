"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ConfirmDialog from "@/components/ConfirmDialog";
import PageHeader from "@/components/PageHeader";
import SortFilterBar from "@/components/SortFilterBar";
import { useI18n } from "@/lib/i18n";
import { useHideAppLoaderOnMount, useModal } from "@/lib/ui";
import { useSettings } from "@/lib/settings";
import { useSortFilter } from "@/lib/useSortFilter";
import { formatCurrency, formatMoiDate, initials, moiAmountLabel, moiKindLabel } from "@/lib/moiFormat";
import { fetchMoi, removeMoi } from "@/redux/moi/thunk";
import { fetchEvents } from "@/redux/event/thunk";
import { fetchGuests } from "@/redux/guest/thunk";
import type { AppDispatch, RootState } from "@/redux/store";
import { extractApiErrorMessage } from "@/services/apiTypes";
import type { MoiItem } from "@/redux/moi/type";
import { EditIcon, LedgerIcon, MoiIcon, PlusIcon, TrashIcon } from "@/components/icons";

export default function MoiPage() {
  useHideAppLoaderOnMount();
  const { t } = useI18n();
  const { openModal } = useModal();
  const { settings } = useSettings();
  const dispatch = useDispatch<AppDispatch>();
  const { items: moiItems, loaded } = useSelector((state: RootState) => state.moi);
  const { items: events, loaded: eventsLoaded } = useSelector((state: RootState) => state.event);
  const { items: guests, loaded: guestsLoaded } = useSelector((state: RootState) => state.guest);
  const [deleting, setDeleting] = useState<MoiItem | null>(null);

  useEffect(() => {
    if (!loaded) dispatch(fetchMoi()).catch((err) => toast.error(extractApiErrorMessage(err, "Couldn't load moi contributions")));
  }, [dispatch, loaded]);

  useEffect(() => {
    if (!eventsLoaded) dispatch(fetchEvents()).catch(() => {});
  }, [dispatch, eventsLoaded]);

  useEffect(() => {
    if (!guestsLoaded) dispatch(fetchGuests()).catch(() => {});
  }, [dispatch, guestsLoaded]);

  async function confirmDelete() {
    if (!deleting) return;
    try {
      const response = await dispatch(removeMoi(deleting.id));
      toast.success(response.message);
    } catch (err) {
      toast.error(extractApiErrorMessage(err, "Couldn't delete the contribution"));
    } finally {
      setDeleting(null);
    }
  }

  function eventName(eventId: string) {
    return events.find((ev) => ev.id === eventId)?.name ?? "—";
  }

  function guestName(guestId: string) {
    return guests.find((g) => g.id === guestId)?.name ?? "Unknown guest";
  }

  const stats = useMemo(() => {
    let moneyReceived = 0;
    let giftValue = 0;
    for (const m of moiItems) {
      if (m.type === "money") moneyReceived += m.amount ?? 0;
      else if (m.giftValue) giftValue += m.giftValue;
    }
    return {
      totalReceived: moneyReceived + giftValue,
      moneyReceived,
      giftValue,
      totalContributions: moiItems.length,
    };
  }, [moiItems]);

  const STATS = [
    { value: formatCurrency(stats.totalReceived, settings?.currency), labelKey: "moiTotalReceived" as const, bg: "var(--amber-bg)", color: "var(--amber)", icon: LedgerIcon },
    { value: formatCurrency(stats.moneyReceived, settings?.currency), labelKey: "moiMoneyReceived" as const, bg: "var(--sage-bg)", color: "var(--sage)", icon: LedgerIcon },
    { value: formatCurrency(stats.giftValue, settings?.currency), labelKey: "moiGiftValue" as const, bg: "var(--rose-bg)", color: "var(--rose)", icon: MoiIcon },
    { value: String(stats.totalContributions), labelKey: "moiTotalContributions" as const, bg: "var(--amber-bg)", color: "var(--amber)", icon: MoiIcon },
  ];

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
    ],
    []
  );
  const sortOptions = useMemo(
    () => [
      { value: "date-recent", label: "Newest", compare: (a: MoiItem, b: MoiItem) => b.date.localeCompare(a.date) },
      { value: "date-old", label: "Oldest", compare: (a: MoiItem, b: MoiItem) => a.date.localeCompare(b.date) },
      { value: "amount-hl", label: "Amount: High → Low", compare: (a: MoiItem, b: MoiItem) => (b.amount ?? 0) - (a.amount ?? 0) },
      { value: "amount-lh", label: "Amount: Low → High", compare: (a: MoiItem, b: MoiItem) => (a.amount ?? 0) - (b.amount ?? 0) },
      { value: "name-az", label: "Name A–Z", compare: (a: MoiItem, b: MoiItem) => guestName(a.guestId).localeCompare(guestName(b.guestId)) },
      { value: "name-za", label: "Name Z–A", compare: (a: MoiItem, b: MoiItem) => guestName(b.guestId).localeCompare(guestName(a.guestId)) },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [guests]
  );

  const sf = useSortFilter<MoiItem>(moiItems, {
    searchFields: (m) => `${guestName(m.guestId)} ${moiKindLabel(m)}`,
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
                <s.icon />
              </div>
            </div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{t(s.labelKey)}</div>
          </div>
        ))}
      </div>

      <div className="glass">
        {loaded && moiItems.length === 0 ? (
          <div className="template-empty">
            <MoiIcon />
            <h3>{t("noMoiYet")}</h3>
            <p>{t("noMoiHint")}</p>
            <button className="btn" onClick={() => openModal("createMoi")}>
              <PlusIcon /> <span>{t("createMoi")}</span>
            </button>
          </div>
        ) : (
          <>
            <div className="moi-list">
              {sf.filtered.map((m) => (
                <div className="moi-card" key={m.id}>
                  <div className="moi-card-top">
                    <div className="moi-avatar">{initials(guestName(m.guestId)).charAt(0)}</div>
                    <div className="moi-who">
                      <div className="moi-name">{guestName(m.guestId)}</div>
                      <div className="moi-event">{eventName(m.eventId)}</div>
                    </div>
                  </div>
                  <div className="moi-detail">
                    <span className="moi-kind">{moiKindLabel(m)}</span>
                    <span className="moi-amount">{moiAmountLabel(m, settings?.currency)}</span>
                  </div>
                  <div className="moi-card-foot">
                    <span className="moi-date">{formatMoiDate(m.date, settings?.dateFormat)}</span>
                    <span className="badge confirmed">{t("moiReceived")}</span>
                    <div className="row-actions">
                      <button title={t("editMoi")} onClick={() => openModal("createMoi", m)}>
                        <EditIcon />
                      </button>
                      <button title={t("deleteMoi")} onClick={() => setDeleting(m)}>
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pager">
              <span>
                {t("showing")} {sf.filtered.length} {t("of")} {moiItems.length} contributions
              </span>
              <div className="nums">
                <span>&lt;</span>
                <span className="active">1</span>
                <span>&gt;</span>
              </div>
            </div>
          </>
        )}
      </div>

      <ConfirmDialog
        open={!!deleting}
        title={t("deleteMoiConfirmTitle")}
        body={t("deleteMoiConfirmBody")}
        cancelLabel={t("cancel")}
        confirmLabel={t("deleteMoi")}
        onCancel={() => setDeleting(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
