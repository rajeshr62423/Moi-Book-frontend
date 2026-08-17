"use client";

import { useState } from "react";
import ModalShell from "./ModalShell";
import Select from "@/components/ui/Select";
import { useModal, useToast } from "@/lib/ui";
import { useI18n } from "@/lib/i18n";
import { events, guests } from "@/lib/data";
import { EventsIcon, EyeIcon, GiftIcon, GuestsIcon, LedgerIcon } from "@/components/icons";

const EVENT_OPTIONS = events.map((ev) => ({ value: ev.name, label: ev.name }));
const GUEST_OPTIONS = guests.map((g) => ({ value: g.name, label: g.name }));
const PAYMENT_METHODS = ["Cash", "UPI", "Bank Transfer", "Cheque", "Other"].map((v) => ({ value: v, label: v }));
const GIFT_CATEGORIES = [
  "Clothes",
  "Gold",
  "Silver",
  "Jewellery",
  "Household Items",
  "Electronics",
  "Vouchers",
  "Gift Cards",
  "Other",
].map((v) => ({ value: v, label: v }));
const GIFT_UNITS = ["pieces", "grams", "items", "kg"].map((v) => ({ value: v, label: v }));

const EMPTY = {
  guest: "",
  event: events[0]?.name ?? "",
  kind: "money" as "money" | "gift",
  amount: "",
  method: "Cash",
  reference: "",
  giftCategory: "Clothes",
  giftName: "",
  quantity: "",
  unit: "pieces",
  giftValue: "",
  date: "",
  notes: "",
};

function initials(str: string) {
  const parts = str.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  return parts.map((w) => w[0]).join("").toUpperCase() || "?";
}

function formatDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function CreateMoiModal() {
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
    showToast(t("toastMoiSaved"));
  }

  const isGift = form.kind === "gift";
  const kindLabel = isGift ? form.giftName || form.giftCategory : form.method;
  const amountLabel = isGift
    ? form.giftValue
      ? (form.giftValue.startsWith("₹") ? form.giftValue : "₹" + form.giftValue)
      : "—"
    : form.amount
    ? form.amount.startsWith("₹")
      ? form.amount
      : "₹" + form.amount
    : "₹0";

  return (
    <ModalShell
      name="createMoi"
      title={t("createMoiModalTitle")}
      onSubmit={handleSubmit}
      footer={
        <>
          <button type="button" className="btn ghost" onClick={closeModal}>
            {t("cancel")}
          </button>
          <button type="submit" className="btn">
            {t("saveMoi")}
          </button>
        </>
      }
    >
      <div className="modal-split">
        <div className="modal-form-col">
          <div className="form-section">
            <div className="form-section-head">
              <GuestsIcon />
              <span>{t("secContributionFrom")}</span>
            </div>
            <div className="field">
              <label>{t("guestNameField")}</label>
              <Select
                value={form.guest}
                onChange={(v) => set("guest", v)}
                options={GUEST_OPTIONS}
                placeholder="Select guest"
                required
                name="guest"
                searchable
                searchPlaceholder="Search guests…"
                aria-label={t("guestNameField")}
              />
            </div>
            <div className="field">
              <label>{t("eventField")}</label>
              <Select
                value={form.event}
                onChange={(v) => set("event", v)}
                options={EVENT_OPTIONS}
                required
                name="moiEvent"
                searchable
                searchPlaceholder="Search events…"
                aria-label={t("eventField")}
              />
            </div>
          </div>
          <div className="form-section">
            <div className="form-section-head">
              <GiftIcon />
              <span>{t("moiContributionType")}</span>
            </div>
            <div className="field">
              <Select
                value={form.kind}
                onChange={(v) => set("kind", v)}
                options={[
                  { value: "money", label: t("moiTypeMoney") },
                  { value: "gift", label: t("moiTypeGift") },
                ]}
                required
                name="kind"
                aria-label={t("moiContributionType")}
              />
            </div>
          </div>
          {!isGift && (
            <div className="form-section">
              <div className="form-section-head">
                <LedgerIcon />
                <span>{t("secMoneyDetails")}</span>
              </div>
              <div className="field">
                <label>{t("moiAmount")}</label>
                <input value={form.amount} onChange={(e) => set("amount", e.target.value)} placeholder="₹ 10,000" required />
              </div>
              <div className="field">
                <label>{t("moiPaymentMethod")}</label>
                <Select value={form.method} onChange={(v) => set("method", v)} options={PAYMENT_METHODS} aria-label={t("moiPaymentMethod")} />
              </div>
              <div className="field">
                <label>{t("moiReference")}</label>
                <input value={form.reference} onChange={(e) => set("reference", e.target.value)} placeholder="Optional" />
              </div>
            </div>
          )}
          {isGift && (
            <div className="form-section">
              <div className="form-section-head">
                <GiftIcon />
                <span>{t("secGiftDetails")}</span>
              </div>
              <div className="field">
                <label>{t("moiGiftCategory")}</label>
                <Select
                  value={form.giftCategory}
                  onChange={(v) => set("giftCategory", v)}
                  options={GIFT_CATEGORIES}
                  aria-label={t("moiGiftCategory")}
                />
              </div>
              <div className="field">
                <label>{t("moiGiftName")}</label>
                <input value={form.giftName} onChange={(e) => set("giftName", e.target.value)} placeholder="e.g. Gold Chain" />
              </div>
              <div className="field-row">
                <div className="field">
                  <label>{t("moiQuantity")}</label>
                  <input type="number" min="0" step="any" value={form.quantity} onChange={(e) => set("quantity", e.target.value)} placeholder="1" />
                </div>
                <div className="field">
                  <label>{t("moiUnit")}</label>
                  <Select value={form.unit} onChange={(v) => set("unit", v)} options={GIFT_UNITS} aria-label={t("moiUnit")} />
                </div>
              </div>
              <div className="field">
                <label>{t("moiGiftValueField")}</label>
                <input value={form.giftValue} onChange={(e) => set("giftValue", e.target.value)} placeholder="₹" />
              </div>
            </div>
          )}
          <div className="form-section">
            <div className="form-section-head">
              <EventsIcon />
              <span>{t("secAdditionalInfo")}</span>
            </div>
            <div className="field">
              <label>{t("dateField")}</label>
              <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} required />
            </div>
            <div className="field">
              <label>{t("moiNotes")}</label>
              <input value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Optional notes" />
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
                <div className="lp-avatar">{form.guest ? initials(form.guest).charAt(0) : "?"}</div>
                <div>
                  <div className="lp-name">{form.guest || "Select guest"}</div>
                  <div className="lp-sub">{form.event}</div>
                </div>
              </div>
              <div className="lp-row">
                <LedgerIcon />
                <span>{kindLabel || (isGift ? "Gift" : "Cash")}</span>
              </div>
              <div className="lp-row">
                <EventsIcon />
                <span>{formatDate(form.date) || "Select a date"}</span>
              </div>
              <div className="lp-foot">
                <span className="lp-badge">{t("moiReceived")}</span>
                <span className="lp-amount">{amountLabel}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
