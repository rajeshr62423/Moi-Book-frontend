"use client";

import { useState } from "react";
import ModalShell from "./ModalShell";
import Select from "@/components/ui/Select";
import { useModal, useToast } from "@/lib/ui";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import { events } from "@/lib/data";
import { EventsIcon, EyeIcon, GuestsIcon, PhoneIcon } from "@/components/icons";

const EMPTY = { name: "", group: "family", phone: "", email: "", event: events[0]?.name ?? "" };

const GROUP_LABEL_KEYS: Record<string, TranslationKey> = {
  family: "grpFamily",
  friends: "grpFriends",
  colleagues: "grpColleagues",
  relatives: "grpRelatives",
};

const GROUP_OPTIONS = Object.keys(GROUP_LABEL_KEYS) as (keyof typeof GROUP_LABEL_KEYS)[];
const EVENT_OPTIONS = events.map((ev) => ({ value: ev.name, label: ev.name }));

function initials(str: string) {
  const parts = str.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  return parts.map((w) => w[0]).join("").toUpperCase() || "?";
}

export default function AddGuestModal() {
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
    showToast(t("toastGuestAdded"));
  }

  return (
    <ModalShell
      name="addGuest"
      title={t("addGuestModalTitle")}
      onSubmit={handleSubmit}
      footer={
        <>
          <button type="button" className="btn ghost" onClick={closeModal}>
            {t("cancel")}
          </button>
          <button type="submit" className="btn">
            {t("addGuest")}
          </button>
        </>
      }
    >
      <div className="modal-split">
        <div className="modal-form-col">
          <div className="form-section">
            <div className="form-section-head">
              <GuestsIcon />
              <span>{t("secGuestDetails")}</span>
            </div>
            <div className="field-row">
              <div className="field">
                <label>{t("guestNameField")}</label>
                <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Full name" required />
              </div>
              <div className="field">
                <label>{t("groupField")}</label>
                <Select
                  value={form.group}
                  onChange={(v) => set("group", v)}
                  options={GROUP_OPTIONS.map((key) => ({ value: key, label: t(GROUP_LABEL_KEYS[key]) }))}
                  aria-label={t("groupField")}
                />
              </div>
            </div>
          </div>
          <div className="form-section">
            <div className="form-section-head">
              <PhoneIcon />
              <span>{t("secContactInfo")}</span>
            </div>
            <div className="field-row">
              <div className="field">
                <label>{t("phoneField")}</label>
                <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91" required />
              </div>
              <div className="field">
                <label>{t("emailField")}</label>
                <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="name@email.com" />
              </div>
            </div>
          </div>
          <div className="form-section">
            <div className="form-section-head">
              <EventsIcon />
              <span>{t("secEventAssign")}</span>
            </div>
            <div className="field">
              <label>{t("eventField")}</label>
              <Select
                value={form.event}
                onChange={(v) => set("event", v)}
                options={EVENT_OPTIONS}
                searchable
                searchPlaceholder="Search events…"
                aria-label={t("eventField")}
              />
            </div>
          </div>
        </div>
        <div className="modal-preview-col">
          <div className="live-preview-label">
            <EyeIcon />
            <span>{t("livePreview")}</span>
          </div>
          <div className="live-preview-card">
            <div className="lp-body">
              <div className="lp-top">
                <div className="lp-avatar">{form.name ? initials(form.name).charAt(0) : "?"}</div>
                <div>
                  <div className="lp-name">{form.name || "Guest Name"}</div>
                  <div className="lp-sub">{t(GROUP_LABEL_KEYS[form.group])}</div>
                </div>
              </div>
              <div className="lp-row">
                <PhoneIcon />
                <span>{form.phone || "Phone number"}</span>
              </div>
              <div className="lp-row">
                <span>✉️</span>
                <span>{form.email || "—"}</span>
              </div>
              <div className="lp-row">
                <EventsIcon />
                <span>{form.event || "No event selected"}</span>
              </div>
              <div className="lp-foot">
                <span className="lp-badge">{t("pendingLabel")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
