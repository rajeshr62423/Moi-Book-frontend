"use client";

import { useState } from "react";
import { useFormik } from "formik";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import ModalShell from "./ModalShell";
import Select from "@/components/ui/Select";
import ThumbnailInput from "@/components/ui/ThumbnailInput";
import { useModal } from "@/lib/ui";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import { saveVendor } from "@/redux/vendor/thunk";
import type { AppDispatch } from "@/redux/store";
import { extractApiErrorMessage } from "@/services/apiTypes";
import type { VendorCategory, VendorItem } from "@/redux/vendor/type";
import { EyeIcon, ImageIcon, LocationIcon, PhoneIcon, VendorsIcon } from "@/components/icons";

interface VendorFormValues {
  name: string;
  category: VendorCategory;
  phone: string;
  location: string;
  thumbnail: string;
}

const EMPTY: VendorFormValues = { name: "", category: "catering", phone: "", location: "", thumbnail: "" };

export const CATEGORY_LABEL_KEYS: Record<VendorCategory, TranslationKey> = {
  catering: "catCatering",
  venue: "catVenueChip",
  photography: "catPhotography",
  decoration: "catDecoration",
  entertainment: "catEntertainment",
  transport: "catTransport",
  others: "catOthers",
};

const CATEGORY_OPTIONS = Object.keys(CATEGORY_LABEL_KEYS) as VendorCategory[];

export const VENDOR_STATUS_LABEL_KEYS: Record<VendorItem["status"], TranslationKey> = {
  shortlisted: "statusShortlisted",
  contacted: "statusContacted",
  quotation: "statusQuotation",
  booked: "statusBooked",
};

function toFormValues(vendor: VendorItem): VendorFormValues {
  return {
    name: vendor.name,
    category: vendor.category,
    phone: vendor.phone,
    location: vendor.location,
    thumbnail: vendor.thumbnail ?? "",
  };
}

export default function AddVendorModal() {
  const { t } = useI18n();
  const dispatch = useDispatch<AppDispatch>();
  const { activeModal, modalPayload, closeModal } = useModal();
  const isOpen = activeModal === "addVendor";
  const editing = isOpen ? (modalPayload as VendorItem | null) : null;
  const [thumbnailUploading, setThumbnailUploading] = useState(false);

  const formik = useFormik<VendorFormValues>({
    enableReinitialize: true,
    initialValues: editing ? toFormValues(editing) : EMPTY,
    validateOnChange: false,
    validateOnBlur: false,
    validate: (values) => {
      const errors: Partial<Record<keyof VendorFormValues, boolean>> = {};
      if (!values.name.trim()) errors.name = true;
      if (!values.phone.trim()) errors.phone = true;
      if (!values.location.trim()) errors.location = true;
      return errors;
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const payload = {
        name: values.name,
        category: values.category,
        phone: values.phone,
        location: values.location,
        thumbnail: values.thumbnail,
      };
      try {
        const response = await dispatch(saveVendor(payload, editing?.id));
        toast.success(response.message);
        resetForm();
        closeModal();
      } catch (err) {
        toast.error(extractApiErrorMessage(err, "Couldn't save the vendor"));
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <ModalShell
      name="addVendor"
      title={editing ? t("editVendorModalTitle") : t("addVendorModalTitle")}
      onSubmit={formik.handleSubmit}
      footer={
        <>
          <button type="button" className="btn ghost" onClick={closeModal}>
            {t("cancel")}
          </button>
          <button type="submit" className="btn" disabled={formik.isSubmitting || thumbnailUploading}>
            {formik.isSubmitting ? "..." : thumbnailUploading ? "Uploading…" : editing ? t("saveChanges") : t("addVendor")}
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
              <div className={`field${formik.errors.name ? " has-error" : ""}`}>
                <label>{t("vendorNameField")}</label>
                <input
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  placeholder="Business name"
                  required
                />
              </div>
              <div className="field">
                <label>{t("categoryField")}</label>
                <Select
                  value={formik.values.category}
                  onChange={(v) => formik.setFieldValue("category", v)}
                  options={CATEGORY_OPTIONS.map((key) => ({ value: key, label: t(CATEGORY_LABEL_KEYS[key]) }))}
                  aria-label={t("categoryField")}
                />
              </div>
            </div>
            <ThumbnailInput
              value={formik.values.thumbnail}
              onChange={(url) => formik.setFieldValue("thumbnail", url)}
              onUploadingChange={setThumbnailUploading}
              label="Vendor Photo"
            />
          </div>
          <div className="form-section">
            <div className="form-section-head">
              <PhoneIcon />
              <span>{t("secContactLocation")}</span>
            </div>
            <div className="field-row">
              <div className={`field${formik.errors.phone ? " has-error" : ""}`}>
                <label>{t("phoneField")}</label>
                <input name="phone" value={formik.values.phone} onChange={formik.handleChange} placeholder="+91" required />
              </div>
              <div className={`field${formik.errors.location ? " has-error" : ""}`}>
                <label>{t("locationField")}</label>
                <input
                  name="location"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  placeholder="City"
                  required
                />
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
            <div className="lp-thumb" style={formik.values.thumbnail ? { padding: 0 } : undefined}>
              {formik.values.thumbnail ? (
                <img src={formik.values.thumbnail} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <ImageIcon />
              )}
            </div>
            <div className="lp-body">
              <div className="lp-sub">{t(CATEGORY_LABEL_KEYS[formik.values.category])}</div>
              <div className="lp-name">{formik.values.name || "Vendor Name"}</div>
              <div style={{ marginTop: 10 }}>
                <div className="lp-row">
                  <PhoneIcon />
                  <span>{formik.values.phone || "Phone number"}</span>
                </div>
                <div className="lp-row">
                  <LocationIcon />
                  <span>{formik.values.location || "City"}</span>
                </div>
              </div>
              <div className="lp-foot">
                <span className="lp-badge">{t(VENDOR_STATUS_LABEL_KEYS[editing?.status ?? "shortlisted"])}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
