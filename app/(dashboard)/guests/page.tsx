"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import SortFilterBar from "@/components/SortFilterBar";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import { useAppLoader, useHideAppLoaderOnMount, useModal } from "@/lib/ui";
import { useSortFilter } from "@/lib/useSortFilter";
import { guests } from "@/lib/data";
import type { GuestItem, RsvpStatus } from "@/lib/types";
import { CalendarClockIcon, CloseIcon, GuestsCheckIcon, GuestsIcon, PhoneIcon, PlusIcon, UploadIcon } from "@/components/icons";

function statusLabel(status: RsvpStatus, t: (k: TranslationKey) => string) {
  if (status === "attending") return t("attendingLabel");
  if (status === "notattending") return t("notAttendingLabel");
  return t("pendingLabel");
}

const STATS = [
  { value: "428", labelKey: "totalGuests" as const, bg: "var(--amber-bg)", color: "var(--amber)", icon: GuestsIcon },
  { value: "312", labelKey: "attendingLabel" as const, bg: "var(--sage-bg)", color: "var(--sage)", icon: GuestsCheckIcon },
  { value: "62", labelKey: "notAttendingLabel" as const, bg: "var(--rose-bg)", color: "#C97A6A", icon: CloseIcon },
  { value: "54", labelKey: "pendingLabel" as const, bg: "var(--amber-bg)", color: "var(--amber)", icon: CalendarClockIcon },
];

export default function GuestsPage() {
  useHideAppLoaderOnMount();
  const { t } = useI18n();
  const { openModal } = useModal();
  const { show } = useAppLoader();
  const router = useRouter();

  const filterGroups = useMemo(
    () => [
      {
        key: "status",
        label: "RSVP Status",
        getValue: (g: GuestItem) => g.status,
        options: [
          { value: "attending", label: "Attending" },
          { value: "notattending", label: "Not Attending" },
          { value: "pending", label: "Pending" },
        ],
      },
      {
        key: "group",
        label: "Group",
        getValue: (g: GuestItem) => g.group,
        options: [
          { value: "family", label: "Family" },
          { value: "friends", label: "Friends" },
          { value: "colleagues", label: "Colleagues" },
          { value: "relatives", label: "Relatives" },
        ],
      },
    ],
    []
  );
  const sortOptions = useMemo(
    () => [
      { value: "name-az", label: "Name A–Z", compare: (a: GuestItem, b: GuestItem) => a.name.localeCompare(b.name) },
      { value: "name-za", label: "Name Z–A", compare: (a: GuestItem, b: GuestItem) => b.name.localeCompare(a.name) },
      { value: "group-az", label: "Group A–Z", compare: (a: GuestItem, b: GuestItem) => a.group.localeCompare(b.group) },
    ],
    []
  );

  const sf = useSortFilter<GuestItem>(guests, {
    searchFields: (g) => `${g.name} ${g.phone} ${g.email}`,
    filterGroups,
    sortOptions,
  });

  function openProfile(id: string) {
    show();
    router.push(`/guests/${id}`);
  }

  return (
    <>
      <PageHeader
        title={t("guestsTitle")}
        actions={
          <>
            <button className="btn outline small">
              <UploadIcon />
              <span>{t("importGuests")}</span>
            </button>
            <button className="btn" onClick={() => openModal("addGuest")}>
              <PlusIcon /> <span>{t("addGuest")}</span>
            </button>
          </>
        }
      />
      <SortFilterBar state={sf} filterGroups={filterGroups} sortOptions={sortOptions} searchPlaceholder="Search guests..." />
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
      <div className="glass" id="view-guests">
        <table>
          <thead>
            <tr>
              <th>{t("thGuest")}</th>
              <th>{t("thContact")}</th>
              <th>{t("thEvent")}</th>
              <th>{t("thRsvp")}</th>
              <th>{t("thGroup")}</th>
              <th>{t("thActions")}</th>
            </tr>
          </thead>
          <tbody>
            {sf.filtered.map((g) => (
              <tr key={g.id} onClick={() => openProfile(g.id)}>
                <td>
                  <span className="ev-name">{g.name}</span>
                  <div className="ev-sub">{g.relation}</div>
                </td>
                <td>
                  {g.phone}
                  <br />
                  <span className="ev-sub">{g.email}</span>
                </td>
                <td>
                  {g.eventName}
                  <br />
                  <span className="ev-sub">{g.eventDate}</span>
                </td>
                <td>
                  <span className={`badge ${g.status}`}>{statusLabel(g.status, t)}</span>
                </td>
                <td>{g.relation}</td>
                <td className="row-actions" onClick={(e) => e.stopPropagation()}>
                  <button title="Call">
                    <PhoneIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pager">
          <span>
            {t("showing")} {sf.filtered.length} {t("of")} 428 {t("guestsWord")}
          </span>
          <div className="nums">
            <span>&lt;</span>
            <span className="active">1</span>
            <span>&gt;</span>
          </div>
        </div>
      </div>
    </>
  );
}
