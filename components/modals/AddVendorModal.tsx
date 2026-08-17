"use client";

import { useState } from "react";
import ModalShell from "./ModalShell";
import Select from "@/components/ui/Select";
import { useModal, useToast } from "@/lib/ui";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import { EyeIcon, ImageIcon, LocationIcon, PhoneIcon, VendorsIcon } from "@/components/icons";

const EMPTY = { name: "", category: "catering", phone: "", location: "" };

const CATEGORY_LABEL_KEYS: Record<string, TranslationKey> = {
  catering: "catCatering",
  venue: "catVenueChip",
  photography: "catPhotography",
  decoration: "catDecoration",
  entertainment: "catEntertainment",
  transport: "catTransport",
  others: "catOthers",
};

const CATEGORY_OPTIONS = Object.keys(CATEGORY_LABEL_KEYS) as (keyof typeof CATEGORY_LABEL_KEYS)[];

export default function AddVendorModal() {
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
    showToast(t("toastVendorAdded"));
  }

  return (
    <ModalShell
      name="addVendor"
      title={t("addVendorModalTitle")}
      onSubmit={handleSubmit}
      footer={
        <>
          <button type="button" className="btn ghost" onClick={closeModal}>
            {t("cancel")}
          </button>
          <button type="submit" className="btn">
            {t("addVendor")}
          </button>
        </>
      }
    >
      <div className="modal-split">
        <div className="modal-form-col">
          <div className="form-section">
            <div className="form-section-head">
              <VendorsIcon />
              <span>{t("secVendorDetails")}</span>
            </div>
            <div className="field-row">
              <div className="field">
                <label>{t("vendorNameField")}</label>
                <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Business name" required />
              </div>
              <div className="field">
                <label>{t("categoryField")}</label>
                <Select
                  value={form.category}
                  onChange={(v) => set("category", v)}
                  options={CATEGORY_OPTIONS.map((key) => ({ value: key, label: t(CATEGORY_LABEL_KEYS[key]) }))}
                  aria-label={t("categoryField")}
                />
              </div>
            </div>
          </div>
          <div className="form-section">
            <div className="form-section-head">
              <PhoneIcon />
              <span>{t("secContactLocation")}</span>
            </div>
            <div className="field-row">
              <div className="field">
                <label>{t("phoneField")}</label>
                <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91" required />
              </div>
              <div className="field">
                <label>{t("locationField")}</label>
                <input value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="City" required />
              </div>
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
              <div className="lp-sub">{t(CATEGORY_LABEL_KEYS[form.category])}</div>
              <div className="lp-name">{form.name || "Vendor Name"}</div>
              <div style={{ marginTop: 10 }}>
                <div className="lp-row">
                  <PhoneIcon />
                  <span>{form.phone || "Phone number"}</span>
                </div>
                <div className="lp-row">
                  <LocationIcon />
                  <span>{form.location || "City"}</span>
                </div>
              </div>
              <div className="lp-foot">
                <span className="lp-badge">{t("statusShortlisted")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
