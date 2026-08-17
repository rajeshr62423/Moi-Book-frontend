"use client";

import { useState } from "react";
import ModalShell from "./ModalShell";
import { useModal, useToast } from "@/lib/ui";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import { EventsIcon, EyeIcon, ImageIcon, ListLinesIcon, LocationIcon, StarOutlineIcon } from "@/components/icons";

const EMPTY = { name: "", type: "wedding", date: "", time: "", guests: "", location: "", budget: "", description: "" };

const TYPE_LABEL_KEYS: Record<string, TranslationKey> = {
  wedding: "optWedding",
  birthday: "optBirthday",
  anniversary: "optAnniversary",
  corporate: "optCorporate",
  family: "optFamily",
  other: "optOther",
};

function formatDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function CreateEventModal() {
  const { t } = useI18n();
  const { closeModal } = useModal();
  const { showToast } = useToast();
  const [form, setForm] = useState(EMPTY);

  function set<K extends keyof typeof EMPTY>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    closeModal();
    setForm(EMPTY);
    showToast(t("toastEventCreated"));
  }

  let dateStr = formatDate(form.date) || t("dateField") + "…";
  if (form.time) dateStr += " · " + form.time;

  return (
    <ModalShell
      name="createEvent"
      title={t("createEventModalTitle")}
      onSubmit={handleSubmit}
      footer={
        <>
          <button type="button" className="btn ghost" onClick={closeModal}>
            {t("cancel")}
          </button>
          <button type="submit" className="btn">
            {t("createEvent")}
          </button>
        </>
      }
    >
      <div className="modal-split">
        <div className="modal-form-col">
          <div className="form-section">
            <div className="form-section-head">
              <StarOutlineIcon />
              <span>{t("secBasicInfo")}</span>
            </div>
            <div className="field">
              <label>{t("eventNameField")}</label>
              <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder={t("eventNamePh")} required />
            </div>
            <div className="field">
              <label>{t("eventTypeField")}</label>
              <select value={form.type} onChange={(e) => set("type", e.target.value)}>
                <option value="wedding">{t("optWedding")}</option>
                <option value="birthday">{t("optBirthday")}</option>
                <option value="anniversary">{t("optAnniversary")}</option>
                <option value="corporate">{t("optCorporate")}</option>
                <option value="family">{t("optFamily")}</option>
                <option value="other">{t("optOther")}</option>
              </select>
            </div>
          </div>
          <div className="form-section">
            <div className="form-section-head">
              <EventsIcon />
              <span>{t("secSchedule")}</span>
            </div>
            <div className="field-row">
              <div className="field">
                <label>{t("dateField")}</label>
                <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} required />
              </div>
              <div className="field">
                <label>{t("timeField")}</label>
                <input type="time" value={form.time} onChange={(e) => set("time", e.target.value)} required />
              </div>
            </div>
            <div className="field">
              <label>{t("expectedGuests")}</label>
              <input type="number" value={form.guests} onChange={(e) => set("guests", e.target.value)} placeholder="e.g. 150" required />
            </div>
          </div>
          <div className="form-section">
            <div className="form-section-head">
              <LocationIcon />
              <span>{t("secVenueBudget")}</span>
            </div>
            <div className="field-row">
              <div className="field">
                <label>{t("locationField")}</label>
                <input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="City / Venue" required />
              </div>
              <div className="field">
                <label>{t("budgetField")}</label>
                <input value={form.budget} onChange={(e) => set("budget", e.target.value)} placeholder="₹" required />
              </div>
            </div>
          </div>
          <div className="form-section">
            <div className="form-section-head">
              <ListLinesIcon />
              <span>{t("secNotes")}</span>
            </div>
            <div className="field">
              <label>{t("descriptionField")}</label>
              <input value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Optional notes" />
            </div>
          </div>
        </div>
        <div className="modal-preview-col">
          <div className="live-preview-label">
            <EyeIcon />
            <span>{t("livePreview")}</span>
          </div>
          <div className="live-preview-card">
            <div className="lp-thumb">
              <ImageIcon />
            </div>
            <div className="lp-body">
              <div className="lp-name">{form.name || "Your Event Name"}</div>
              <div className="lp-sub">{t(TYPE_LABEL_KEYS[form.type])}</div>
              <div style={{ marginTop: 10 }}>
                <div className="lp-row">
                  <EventsIcon />
                  <span>{dateStr}</span>
                </div>
                <div className="lp-row">
                  <LocationIcon />
                  <span>{form.location || "Location TBD"}</span>
                </div>
                <div className="lp-row">
                  <span>👥</span>
                  <b>{form.guests || "0"}</b>&nbsp;Guests
                </div>
              </div>
              <div className="lp-foot">
                <span className="lp-badge">{t("statusPlanning")}</span>
                <span className="lp-amount">{form.budget ? (form.budget.startsWith("₹") ? form.budget : "₹" + form.budget) : "—"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
