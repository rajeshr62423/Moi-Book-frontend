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
import { useSettings } from "@/lib/settings";
import { CURRENCY_SYMBOLS } from "@/lib/format";
import { saveEvent } from "@/redux/event/thunk";
import type { AppDispatch } from "@/redux/store";
import { extractApiErrorMessage } from "@/services/apiTypes";
import type { EventItem, EventType } from "@/redux/event/type";
import { EventsIcon, EyeIcon, ImageIcon, ListLinesIcon, LocationIcon, StarOutlineIcon } from "@/components/icons";

interface EventFormValues {
  name: string;
  type: EventType;
  date: string;
  time: string;
  guests: string;
  location: string;
  budget: string;
  description: string;
  thumbnail: string;
}

const EMPTY: EventFormValues = {
  name: "",
  type: "wedding",
  date: "",
  time: "",
  guests: "",
  location: "",
  budget: "",
  description: "",
  thumbnail: "",
};

export const TYPE_LABEL_KEYS: Record<EventType, TranslationKey> = {
  wedding: "optWedding",
  birthday: "optBirthday",
  anniversary: "optAnniversary",
  corporate: "optCorporate",
  family: "optFamily",
  other: "optOther",
};

const TYPE_OPTIONS = Object.keys(TYPE_LABEL_KEYS) as EventType[];

function formatDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function toFormValues(event: EventItem): EventFormValues {
  return {
    name: event.name,
    type: event.type,
    date: event.date,
    time: event.time,
    guests: String(event.guests),
    location: event.location,
    budget: event.budget != null ? String(event.budget) : "",
    description: event.description ?? "",
    thumbnail: event.thumbnail ?? "",
  };
}

export default function CreateEventModal() {
  const { t } = useI18n();
  const { settings } = useSettings();
  const dispatch = useDispatch<AppDispatch>();
  const { activeModal, modalPayload, closeModal } = useModal();
  const isOpen = activeModal === "createEvent";
  const editing = isOpen ? (modalPayload as EventItem | null) : null;
  const [thumbnailUploading, setThumbnailUploading] = useState(false);

  const formik = useFormik<EventFormValues>({
    enableReinitialize: true,
    initialValues: editing ? toFormValues(editing) : EMPTY,
    validateOnChange: false,
    validateOnBlur: false,
    validate: (values) => {
      const errors: Partial<Record<keyof EventFormValues, boolean>> = {};
      if (!values.name.trim()) errors.name = true;
      if (!values.date) errors.date = true;
      if (!values.time) errors.time = true;
      // Formik's handleChange parses type="number" inputs to an actual
      // number (empty field becomes ""), so guests isn't always a string.
      if (values.guests === "" || values.guests == null) errors.guests = true;
      if (!values.location.trim()) errors.location = true;
      return errors;
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const payload = {
        name: values.name,
        type: values.type,
        date: values.date,
        time: values.time,
        guests: Number(values.guests) || 0,
        location: values.location,
        budget: values.budget ? Number(values.budget.replace(/[^\d.]/g, "")) || undefined : undefined,
        description: values.description || undefined,
        // Sent as "" (not undefined) when cleared: undefined keys are
        // dropped from the JSON body, so an update would silently leave
        // the previous thumbnail in place instead of clearing it.
        thumbnail: values.thumbnail,
      };
      try {
        const response = await dispatch(saveEvent(payload, editing?.id));
        toast.success(response.message);
        resetForm();
        closeModal();
      } catch (err) {
        toast.error(extractApiErrorMessage(err, "Couldn't save the event"));
      } finally {
        setSubmitting(false);
      }
    },
  });

  let dateStr = formatDate(formik.values.date) || t("dateField") + "…";
  if (formik.values.time) dateStr += " · " + formik.values.time;

  return (
    <ModalShell
      name="createEvent"
      title={editing ? t("editEventModalTitle") : t("createEventModalTitle")}
      onSubmit={formik.handleSubmit}
      footer={
        <>
          <button type="button" className="btn ghost" onClick={closeModal}>
            {t("cancel")}
          </button>
          <button type="submit" className="btn" disabled={formik.isSubmitting || thumbnailUploading}>
            {formik.isSubmitting ? "..." : thumbnailUploading ? "Uploading…" : editing ? t("saveChanges") : t("createEvent")}
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
            <div className={`field${formik.errors.name ? " has-error" : ""}`}>
              <label>{t("eventNameField")}</label>
              <input
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                placeholder={t("eventNamePh")}
                required
              />
            </div>
            <div className="field">
              <label>{t("eventTypeField")}</label>
              <Select
                value={formik.values.type}
                onChange={(v) => formik.setFieldValue("type", v)}
                options={TYPE_OPTIONS.map((key) => ({ value: key, label: t(TYPE_LABEL_KEYS[key]) }))}
                aria-label={t("eventTypeField")}
              />
            </div>
            <ThumbnailInput
              value={formik.values.thumbnail}
              onChange={(url) => formik.setFieldValue("thumbnail", url)}
              onUploadingChange={setThumbnailUploading}
              label="Event Photo"
            />
          </div>
          <div className="form-section">
            <div className="form-section-head">
              <EventsIcon />
              <span>{t("secSchedule")}</span>
            </div>
            <div className="field-row">
              <div className={`field${formik.errors.date ? " has-error" : ""}`}>
                <label>{t("dateField")}</label>
                <input type="date" name="date" value={formik.values.date} onChange={formik.handleChange} required />
              </div>
              <div className={`field${formik.errors.time ? " has-error" : ""}`}>
                <label>{t("timeField")}</label>
                <input type="time" name="time" value={formik.values.time} onChange={formik.handleChange} required />
              </div>
            </div>
            <div className={`field${formik.errors.guests ? " has-error" : ""}`}>
              <label>{t("expectedGuests")}</label>
              <input
                type="number"
                min={0}
                name="guests"
                value={formik.values.guests}
                onChange={formik.handleChange}
                placeholder="e.g. 150"
                required
              />
            </div>
          </div>
          <div className="form-section">
            <div className="form-section-head">
              <LocationIcon />
              <span>{t("secVenueBudget")}</span>
            </div>
            <div className="field-row">
              <div className={`field${formik.errors.location ? " has-error" : ""}`}>
                <label>{t("locationField")}</label>
                <input
                  name="location"
                  value={formik.values.location}
                  onChange={formik.handleChange}
                  placeholder="City / Venue"
                  required
                />
              </div>
              <div className="field">
                <label>{t("budgetField")}</label>
                <input name="budget" value={formik.values.budget} onChange={formik.handleChange} placeholder={CURRENCY_SYMBOLS[settings?.currency ?? "INR"]} />
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
              <input
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                placeholder="Optional notes"
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
            <div className="lp-thumb" style={formik.values.thumbnail ? { padding: 0 } : undefined}>
              {formik.values.thumbnail ? (
                <img src={formik.values.thumbnail} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <ImageIcon />
              )}
            </div>
            <div className="lp-body">
              <div className="lp-name">{formik.values.name || "Your Event Name"}</div>
              <div className="lp-sub">{t(TYPE_LABEL_KEYS[formik.values.type])}</div>
              <div style={{ marginTop: 10 }}>
                <div className="lp-row">
                  <EventsIcon />
                  <span>{dateStr}</span>
                </div>
                <div className="lp-row">
                  <LocationIcon />
                  <span>{formik.values.location || "Location TBD"}</span>
                </div>
                <div className="lp-row">
                  <span>👥</span>
                  <b>{formik.values.guests || "0"}</b>&nbsp;Guests
                </div>
              </div>
              <div className="lp-foot">
                <span className="lp-badge">{t("statusPlanning")}</span>
                <span className="lp-amount">
                  {formik.values.budget
                    ? formik.values.budget.startsWith(CURRENCY_SYMBOLS[settings?.currency ?? "INR"])
                      ? formik.values.budget
                      : CURRENCY_SYMBOLS[settings?.currency ?? "INR"] + formik.values.budget
                    : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
