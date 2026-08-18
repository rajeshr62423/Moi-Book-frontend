"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ConfirmDialog from "@/components/ConfirmDialog";
import PageHeader from "@/components/PageHeader";
import SortFilterBar from "@/components/SortFilterBar";
import { GROUP_LABEL_KEYS } from "@/components/modals/AddGuestModal";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import { useAppLoader, useHideAppLoaderOnMount, useModal } from "@/lib/ui";
import { useSortFilter } from "@/lib/useSortFilter";
import { formatEventDate } from "@/lib/eventFormat";
import { fetchGuests, removeGuest } from "@/redux/guest/thunk";
import { fetchEvents } from "@/redux/event/thunk";
import type { AppDispatch, RootState } from "@/redux/store";
import { extractApiErrorMessage } from "@/services/apiTypes";
import type { GuestItem, GuestStatus } from "@/redux/guest/type";
import {
  CalendarClockIcon,
  CloseIcon,
  EditIcon,
  GuestsCheckIcon,
  GuestsIcon,
  PhoneIcon,
  PlusIcon,
  TrashIcon,
  UploadIcon,
} from "@/components/icons";

function statusLabel(status: GuestStatus, t: (k: TranslationKey) => string) {
  if (status === "attending") return t("attendingLabel");
  if (status === "notattending") return t("notAttendingLabel");
  return t("pendingLabel");
}

export default function GuestsPage() {
  useHideAppLoaderOnMount();
  const { t } = useI18n();
  const { openModal } = useModal();
  const { show } = useAppLoader();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { items: guests, loaded } = useSelector((state: RootState) => state.guest);
  const { items: events, loaded: eventsLoaded } = useSelector((state: RootState) => state.event);
  const [deleting, setDeleting] = useState<GuestItem | null>(null);

  useEffect(() => {
    if (!loaded) dispatch(fetchGuests()).catch((err) => toast.error(extractApiErrorMessage(err, "Couldn't load guests")));
  }, [dispatch, loaded]);

  useEffect(() => {
    if (!eventsLoaded) dispatch(fetchEvents()).catch(() => {});
  }, [dispatch, eventsLoaded]);

  function eventFor(eventId: string) {
    return events.find((ev) => ev.id === eventId);
  }

  const stats = useMemo(() => {
    let attending = 0;
    let notAttending = 0;
    let pending = 0;
    for (const g of guests) {
      if (g.status === "attending") attending++;
      else if (g.status === "notattending") notAttending++;
      else pending++;
    }
    return { total: guests.length, attending, notAttending, pending };
  }, [guests]);

  const STATS = [
    { value: String(stats.total), labelKey: "totalGuests" as const, bg: "var(--amber-bg)", color: "var(--amber)", icon: GuestsIcon },
    { value: String(stats.attending), labelKey: "attendingLabel" as const, bg: "var(--sage-bg)", color: "var(--sage)", icon: GuestsCheckIcon },
    { value: String(stats.notAttending), labelKey: "notAttendingLabel" as const, bg: "var(--rose-bg)", color: "#C97A6A", icon: CloseIcon },
    { value: String(stats.pending), labelKey: "pendingLabel" as const, bg: "var(--amber-bg)", color: "var(--amber)", icon: CalendarClockIcon },
  ];

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
    searchFields: (g) => `${g.name} ${g.phone} ${g.email ?? ""}`,
    filterGroups,
    sortOptions,
  });

  function openProfile(id: string) {
    show();
    router.push(`/guests/${id}`);
  }

  async function confirmDelete() {
    if (!deleting) return;
    try {
      const response = await dispatch(removeGuest(deleting.id));
      toast.success(response.message);
    } catch (err) {
      toast.error(extractApiErrorMessage(err, "Couldn't delete the guest"));
    } finally {
      setDeleting(null);
    }
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
        {loaded && guests.length === 0 ? (
          <div className="template-empty">
            <GuestsIcon />
            <h3>{t("noGuestsYet")}</h3>
            <p>{t("noGuestsHint")}</p>
            <button className="btn" onClick={() => openModal("addGuest")}>
              <PlusIcon /> <span>{t("addGuest")}</span>
            </button>
          </div>
        ) : (
          <>
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
                {sf.filtered.map((g) => {
                  const event = eventFor(g.eventId);
                  return (
                    <tr key={g.id} onClick={() => openProfile(g.id)}>
                      <td>
                        <span className="ev-name">{g.name}</span>
                        <div className="ev-sub">{t(GROUP_LABEL_KEYS[g.group])}</div>
                      </td>
                      <td>
                        {g.phone}
                        <br />
                        <span className="ev-sub">{g.email || "—"}</span>
                      </td>
                      <td>
                        {event?.name ?? "—"}
                        <br />
                        <span className="ev-sub">{event ? formatEventDate(event.date) : ""}</span>
                      </td>
                      <td>
                        <span className={`badge ${g.status}`}>{statusLabel(g.status, t)}</span>
                      </td>
                      <td>{t(GROUP_LABEL_KEYS[g.group])}</td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="row-actions">
                          <button title="Call" onClick={() => (window.location.href = `tel:${g.phone}`)}>
                            <PhoneIcon />
                          </button>
                          <button title={t("editGuest")} onClick={() => openModal("addGuest", g)}>
                            <EditIcon />
                          </button>
                          <button title={t("deleteGuest")} onClick={() => setDeleting(g)}>
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="pager">
              <span>
                {t("showing")} {sf.filtered.length} {t("of")} {guests.length} {t("guestsWord")}
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
        title={t("deleteGuestConfirmTitle")}
        body={t("deleteGuestConfirmBody")}
        cancelLabel={t("cancel")}
        confirmLabel={t("deleteGuest")}
        onCancel={() => setDeleting(null)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
