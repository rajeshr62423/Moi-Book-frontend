"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import MobileToggleButton from "@/components/MobileToggleButton";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import { useAppLoader, useHideAppLoaderOnMount, useModal } from "@/lib/ui";
import { guestProfiles } from "@/lib/data";
import type { RsvpStatus } from "@/lib/types";
import { ChevronLeftIcon, EditIcon, EventsIcon, PlusIcon } from "@/components/icons";

function statusLabel(status: RsvpStatus, t: (k: TranslationKey) => string) {
  if (status === "attending") return t("attendingLabel");
  if (status === "notattending") return t("notAttendingLabel");
  return t("pendingLabel");
}

export default function GuestProfilePage({ params }: PageProps<"/guests/[id]">) {
  useHideAppLoaderOnMount();
  const { id } = use(params);
  const profile = guestProfiles[id];
  const { t } = useI18n();
  const { openModal } = useModal();
  const { show } = useAppLoader();
  const router = useRouter();

  if (!profile) notFound();

  function goBack() {
    show();
    router.push("/guests");
  }

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
