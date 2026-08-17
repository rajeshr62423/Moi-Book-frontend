"use client";

import { useState } from "react";
import ModalShell from "./ModalShell";
import { useModal, useToast } from "@/lib/ui";
import { useI18n } from "@/lib/i18n";
import { events, guests } from "@/lib/data";
import { EventsIcon, EyeIcon, GiftIcon, GuestsIcon, LedgerIcon } from "@/components/icons";

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
              <select value={form.guest} onChange={(e) => set("guest", e.target.value)} required>
                <option value="">Select guest</option>
                {guests.map((g) => (
                  <option key={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>{t("eventField")}</label>
              <select value={form.event} onChange={(e) => set("event", e.target.value)} required>
                {events.map((ev) => (
                  <option key={ev.id}>{ev.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-section">
            <div className="form-section-head">
              <GiftIcon />
              <span>{t("moiContributionType")}</span>
            </div>
            <div className="field">
              <select value={form.kind} onChange={(e) => set("kind", e.target.value)} required>
                <option value="money">{t("moiTypeMoney")}</option>
                <option value="gift">{t("moiTypeGift")}</option>
              </select>
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
                <select value={form.method} onChange={(e) => set("method", e.target.value)}>
                  <option>Cash</option>
                  <option>UPI</option>
                  <option>Bank Transfer</option>
                  <option>Cheque</option>
                  <option>Other</option>
                </select>
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
                <select value={form.giftCategory} onChange={(e) => set("giftCategory", e.target.value)}>
                  <option>Clothes</option>
                  <option>Gold</option>
                  <option>Silver</option>
                  <option>Jewellery</option>
                  <option>Household Items</option>
                  <option>Electronics</option>
                  <option>Vouchers</option>
                  <option>Gift Cards</option>
                  <option>Other</option>
                </select>
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
                  <select value={form.unit} onChange={(e) => set("unit", e.target.value)}>
                    <option>pieces</option>
                    <option>grams</option>
                    <option>items</option>
                    <option>kg</option>
                  </select>
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
