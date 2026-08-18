"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import MobileToggleButton from "@/components/MobileToggleButton";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import { useAppLoader, useHideAppLoaderOnMount, useModal } from "@/lib/ui";
import { guestProfiles } from "@/lib/data";
import type { RsvpStatus } from "@/lib/types";
import { GROUP_LABEL_KEYS } from "@/components/modals/AddGuestModal";
import { formatCurrency, formatMoiDate, initials, moiAmountLabel, moiKindLabel } from "@/lib/moiFormat";
import { fetchGuests } from "@/redux/guest/thunk";
import { fetchEvents } from "@/redux/event/thunk";
import { fetchMoi } from "@/redux/moi/thunk";
import type { AppDispatch, RootState } from "@/redux/store";
import { ChevronLeftIcon, EditIcon, EventsIcon, PlusIcon } from "@/components/icons";

function statusLabel(status: RsvpStatus, t: (k: TranslationKey) => string) {
  if (status === "attending") return t("attendingLabel");
  if (status === "notattending") return t("notAttendingLabel");
  return t("pendingLabel");
}

export default function GuestProfilePage({ params }: PageProps<"/guests/[id]">) {
  useHideAppLoaderOnMount();
  const { id } = use(params);
  const profileMock = guestProfiles[id];
  const { t } = useI18n();
  const { openModal } = useModal();
  const { show } = useAppLoader();
  const router = useRouter();

  // Real (Redux-backed) guests aren't in the mock guestProfiles lookup —
  // fall back to a lighter real-data view instead of a hard 404 for them.
  const dispatch = useDispatch<AppDispatch>();
  const { items: guestItems, loaded: guestsLoaded } = useSelector((state: RootState) => state.guest);
  const { items: events, loaded: eventsLoaded } = useSelector((state: RootState) => state.event);
  const { items: moiAll, loaded: moiLoaded } = useSelector((state: RootState) => state.moi);
  const realGuest = guestItems.find((g) => g.id === id);
  const moiItems = moiAll.filter((m) => m.guestId === id);

  // Landing directly on this URL (bookmark, refresh) means none of these
  // may have been fetched yet by their own list pages — fetch here too.
  useEffect(() => {
    if (!guestsLoaded) dispatch(fetchGuests()).catch(() => {});
  }, [dispatch, guestsLoaded]);
  useEffect(() => {
    if (!eventsLoaded) dispatch(fetchEvents()).catch(() => {});
  }, [dispatch, eventsLoaded]);
  useEffect(() => {
    if (!moiLoaded) dispatch(fetchMoi()).catch(() => {});
  }, [dispatch, moiLoaded]);

  function goBack() {
    show();
    router.push("/guests");
  }

  if (!profileMock) {
    if (!guestsLoaded) return null;
    if (!realGuest) notFound();
    const event = events.find((ev) => ev.id === realGuest.eventId);
    const moiTotal = moiItems.reduce((sum, m) => sum + (m.type === "money" ? m.amount ?? 0 : m.giftValue ?? 0), 0);
    const moneyTotal = moiItems.filter((m) => m.type === "money").reduce((sum, m) => sum + (m.amount ?? 0), 0);
    const giftCount = moiItems.filter((m) => m.type === "gift").length;
    return (
      <>
        <div className="topbar">
          <MobileToggleButton />
          <button className="btn outline small" style={{ gap: 6 }} onClick={goBack}>
            <ChevronLeftIcon width={14} height={14} />
            <span>{t("backToGuests")}</span>
          </button>
          <div className="page-title" style={{ flex: 1 }}>
            {t("guestProfileTitle")}
          </div>
          <div className="top-actions">
            <button className="btn outline small" onClick={() => openModal("addGuest", realGuest)}>
              <EditIcon /> <span>{t("editGuest")}</span>
            </button>
            <button className="btn small" onClick={() => openModal("createMoi")}>
              <PlusIcon /> <span>{t("createMoi")}</span>
            </button>
          </div>
        </div>

        <div className="glass gp-header">
          <div className="gp-header-main">
            <div className="gp-avatar">{initials(realGuest.name).charAt(0)}</div>
            <div className="gp-header-info">
              <h2 className="gp-name">{realGuest.name}</h2>
              <div className="gp-meta">
                <span className="gp-relation">{t(GROUP_LABEL_KEYS[realGuest.group])}</span>
                <span className="gp-dot">·</span>
                <span className={`badge ${realGuest.status}`}>{statusLabel(realGuest.status, t)}</span>
              </div>
              <div className="gp-contact">
                {realGuest.phone}
                {realGuest.email ? ` · ${realGuest.email}` : ""}
              </div>
            </div>
          </div>
        </div>

        <div className="gp-grid">
          <div className="glass">
            <div className="section-head">
              <h3>{t("gpDetails")}</h3>
            </div>
            <div className="gp-details">
              <div className="gp-row">
                <span>{t("phoneField")}</span>
                <b>{realGuest.phone}</b>
              </div>
              <div className="gp-row">
                <span>{t("emailField")}</span>
                <b>{realGuest.email || "—"}</b>
              </div>
              <div className="gp-row">
                <span>{t("groupField")}</span>
                <b>{t(GROUP_LABEL_KEYS[realGuest.group])}</b>
              </div>
              <div className="gp-row">
                <span>{t("eventField")}</span>
                <b>{event?.name ?? "—"}</b>
              </div>
            </div>
          </div>

          <div className="glass">
            <div className="section-head">
              <h3>{t("gpMoiGifts")}</h3>
            </div>
            <div className="gp-moi-summary">
              <div className="gp-moi-total">
                <span>{t("moiTotalReceived")}</span>
                <b>{formatCurrency(moiTotal)}</b>
              </div>
              <div className="gp-moi-grid">
                <div className="gp-moi-chip">
                  <span>💰 {t("moiTypeMoney")}</span>
                  <b>{formatCurrency(moneyTotal)}</b>
                </div>
                <div className="gp-moi-chip">
                  <span>🎁 {t("moiTypeGift")}</span>
                  <b>{giftCount}</b>
                </div>
              </div>
            </div>
            <div className="gp-history">
              {moiItems.map((m) => (
                <div className="gp-hist-item" key={m.id}>
                  <div className="gp-hist-ico">{m.type === "gift" ? "🎁" : "💰"}</div>
                  <div className="gp-hist-txt">
                    <b>
                      {moiKindLabel(m)} · {moiAmountLabel(m)}
                    </b>
                    <span>
                      {event?.name ?? "—"} · {formatMoiDate(m.date)}
                    </span>
                  </div>
                </div>
              ))}
              {moiItems.length === 0 && (
                <div style={{ color: "var(--muted)", fontSize: 12.5, display: "flex", alignItems: "center", gap: 6 }}>
                  <EventsIcon width={14} height={14} /> No moi contributions yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  const profile = profileMock;

  return (
    <>
      <div className="topbar">
        <MobileToggleButton />
        <button className="btn outline small" style={{ gap: 6 }} onClick={goBack}>
          <ChevronLeftIcon width={14} height={14} />
          <span>{t("backToGuests")}</span>
        </button>
        <div className="page-title" style={{ flex: 1 }}>
          {t("guestProfileTitle")}
        </div>
        <div className="top-actions">
          <button className="btn outline small">
            <EditIcon /> <span>{t("editGuest")}</span>
          </button>
          <button className="btn small" onClick={() => openModal("createMoi")}>
            <PlusIcon /> <span>{t("createMoi")}</span>
          </button>
        </div>
      </div>

      <div className="glass gp-header">
        <div className="gp-header-main">
          <div className="gp-avatar">{profile.avatar}</div>
          <div className="gp-header-info">
            <h2 className="gp-name">{profile.name}</h2>
            <div className="gp-meta">
              <span className="gp-relation">{profile.relation}</span>
              <span className="gp-dot">·</span>
              <span className={`badge ${profile.attendance}`}>{statusLabel(profile.attendance, t)}</span>
            </div>
            <div className="gp-contact">
              {profile.phone} · {profile.email}
            </div>
          </div>
        </div>
      </div>

      <div className="gp-grid">
        <div className="glass">
          <div className="section-head">
            <h3>{t("gpDetails")}</h3>
          </div>
          <div className="gp-details">
            <div className="gp-row">
              <span>{t("phoneField")}</span>
              <b>{profile.phone}</b>
            </div>
            <div className="gp-row">
              <span>{t("emailField")}</span>
              <b>{profile.email}</b>
            </div>
            <div className="gp-row">
              <span>{t("gpAddress")}</span>
              <b>{profile.address}</b>
            </div>
            <div className="gp-row">
              <span>{t("gpCity")}</span>
              <b>{profile.city}</b>
            </div>
            <div className="gp-row">
              <span>{t("gpRelationLabel")}</span>
              <b>{profile.relationDetail}</b>
            </div>
            <div className="gp-row">
              <span>{t("gpCategory")}</span>
              <b>{profile.category}</b>
            </div>
            <div className="gp-row">
              <span>{t("gpPeopleCount")}</span>
              <b>{profile.people}</b>
            </div>
            <div className="gp-row">
              <span>{t("gpInviteStatus")}</span>
              <b>{profile.invite}</b>
            </div>
            <div className="gp-row">
              <span>{t("gpNotes")}</span>
              <b>{profile.notes || "—"}</b>
            </div>
          </div>
        </div>

        <div className="glass">
          <div className="section-head">
            <h3>{t("gpMoiGifts")}</h3>
          </div>
          <div className="gp-moi-summary">
            <div className="gp-moi-total">
              <span>{t("moiTotalReceived")}</span>
              <b>{profile.moiTotal}</b>
            </div>
            <div className="gp-moi-grid">
              {profile.moiBreakdown.map((chip) => (
                <div className="gp-moi-chip" key={chip.label}>
                  <span>
                    {chip.icon} {chip.label}
                  </span>
                  <b>{chip.value}</b>
                </div>
              ))}
            </div>
          </div>
          <div className="section-head" style={{ paddingTop: 8 }}>
            <h3 style={{ fontSize: 14 }}>{t("gpContributionHistory")}</h3>
          </div>
          <div className="gp-history">
            {profile.history.map((h, i) => (
              <div className="gp-hist-item" key={i}>
                <div className="gp-hist-ico">{h.icon}</div>
                <div className="gp-hist-txt">
                  <b>{h.title}</b>
                  <span>{h.subtitle}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass gp-events-card">
          <div className="section-head">
            <h3>{t("gpEvents")}</h3>
          </div>
          <div className="gp-events">
            {profile.events.map((ev, i) => (
              <div className="gp-event-item" key={i}>
                <div className="gp-event-thumb" style={{ backgroundImage: `url('${ev.image}')` }} />
                <div className="gp-event-info">
                  <b>{ev.name}</b>
                  <span>
                    {ev.date} · {ev.location}
                  </span>
                </div>
                <span className={`badge ${ev.status}`}>{statusLabel(ev.status, t)}</span>
              </div>
            ))}
            {profile.events.length === 0 && (
              <div style={{ color: "var(--muted)", fontSize: 12.5, display: "flex", alignItems: "center", gap: 6 }}>
                <EventsIcon width={14} height={14} /> No events yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
