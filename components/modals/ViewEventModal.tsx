"use client";

import { useModal } from "@/lib/ui";
import { useI18n } from "@/lib/i18n";
import { useSettings } from "@/lib/settings";
import { statusLabel, formatEventDate, formatEventTime } from "@/lib/eventFormat";
import { CURRENCY_SYMBOLS } from "@/lib/format";
import { TYPE_LABEL_KEYS } from "./CreateEventModal";
import type { EventItem } from "@/redux/event/type";
import { CloseIcon, EditIcon, EventsIcon, ImageIcon, LocationIcon } from "@/components/icons";

export default function ViewEventModal() {
  const { t } = useI18n();
  const { settings } = useSettings();
  const { activeModal, modalPayload, closeModal, openModal } = useModal();
  const isOpen = activeModal === "viewEvent";
  const event = isOpen ? (modalPayload as EventItem | null) : null;

  return (
    <div
      className={`modal-overlay${isOpen ? " open" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      {event && (
        <div className="modal" style={{ maxWidth: 420 }}>
          <div className="modal-head">
            <h3>{t("viewEventModalTitle")}</h3>
            <button type="button" className="modal-close" onClick={closeModal}>
              <CloseIcon />
            </button>
          </div>
          <div className="modal-body" style={{ padding: 0 }}>
            <div className="lp-thumb" style={{ height: 190, borderRadius: 0, ...(event.thumbnail ? { padding: 0 } : {}) }}>
              {event.thumbnail ? (
                <img src={event.thumbnail} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <ImageIcon />
              )}
            </div>
            <div className="lp-body" style={{ padding: "18px 24px 22px" }}>
              <div className="lp-name" style={{ fontSize: 19 }}>
                {event.name}
              </div>
              <div className="lp-sub">{t(TYPE_LABEL_KEYS[event.type])}</div>
              <div style={{ marginTop: 14 }}>
                <div className="lp-row">
                  <EventsIcon />
                  <span>
                    {formatEventDate(event.date, settings?.dateFormat)} · {formatEventTime(event.time, settings?.timeFormat)}
                  </span>
                </div>
                <div className="lp-row">
                  <LocationIcon />
                  <span>{event.location}</span>
                </div>
                <div className="lp-row">
                  <span>👥</span>
                  <b>{event.guests}</b>&nbsp;Guests
                </div>
              </div>
              {event.description && (
                <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "12px 0 0", lineHeight: 1.5 }}>
                  {event.description}
                </p>
              )}
              <div className="lp-foot">
                <span className={`badge ${event.status}`}>{statusLabel(event.status, t)}</span>
                <span className="lp-amount">{event.budget ? `${CURRENCY_SYMBOLS[settings?.currency ?? "INR"]}${event.budget}` : "—"}</span>
              </div>
            </div>
          </div>
          <div className="modal-foot">
            <button type="button" className="btn ghost" onClick={closeModal}>
              {t("cancel")}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                closeModal();
                openModal("createEvent", event);
              }}
            >
              <EditIcon /> <span>{t("editEvent")}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
