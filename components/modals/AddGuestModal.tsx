"use client";

import { useEffect } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ModalShell from "./ModalShell";
import Select from "@/components/ui/Select";
import { useModal } from "@/lib/ui";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import { initials } from "@/lib/moiFormat";
import { saveGuest } from "@/redux/guest/thunk";
import { fetchEvents } from "@/redux/event/thunk";
import type { AppDispatch, RootState } from "@/redux/store";
import { extractApiErrorMessage } from "@/services/apiTypes";
import type { GuestGroup, GuestItem } from "@/redux/guest/type";
import { EventsIcon, EyeIcon, GuestsIcon, PhoneIcon } from "@/components/icons";

export const GROUP_LABEL_KEYS: Record<GuestGroup, TranslationKey> = {
  family: "grpFamily",
  friends: "grpFriends",
  colleagues: "grpColleagues",
  relatives: "grpRelatives",
};

const GROUP_OPTIONS = Object.keys(GROUP_LABEL_KEYS) as GuestGroup[];

interface GuestFormValues {
  name: string;
  group: GuestGroup;
  phone: string;
  email: string;
  eventId: string;
}

const EMPTY: Omit<GuestFormValues, "eventId"> = { name: "", group: "family", phone: "", email: "" };

function toFormValues(guest: GuestItem): GuestFormValues {
  return {
    name: guest.name,
    group: guest.group,
    phone: guest.phone,
    email: guest.email ?? "",
    eventId: guest.eventId,
  };
}

export default function AddGuestModal() {
  const { t } = useI18n();
  const dispatch = useDispatch<AppDispatch>();
  const { activeModal, modalPayload, closeModal } = useModal();
  const isOpen = activeModal === "addGuest";
  const editing = isOpen ? (modalPayload as GuestItem | null) : null;
  const { items: events, loaded: eventsLoaded } = useSelector((state: RootState) => state.event);

  useEffect(() => {
    if (!eventsLoaded) dispatch(fetchEvents()).catch(() => {});
  }, [dispatch, eventsLoaded]);

  const formik = useFormik<GuestFormValues>({
    enableReinitialize: true,
    initialValues: editing ? toFormValues(editing) : { ...EMPTY, eventId: events[0]?.id ?? "" },
    validateOnChange: false,
    validateOnBlur: false,
    validate: (values) => {
      const errors: Partial<Record<keyof GuestFormValues, boolean>> = {};
      if (!values.name.trim()) errors.name = true;
      if (!values.phone.trim()) errors.phone = true;
      if (!values.eventId) errors.eventId = true;
      return errors;
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const payload = {
        name: values.name,
        group: values.group,
        phone: values.phone,
        email: values.email || undefined,
        eventId: values.eventId,
      };
      try {
        const response = await dispatch(saveGuest(payload, editing?.id));
        toast.success(response.message);
        resetForm();
        closeModal();
      } catch (err) {
        toast.error(extractApiErrorMessage(err, "Couldn't save the guest"));
      } finally {
        setSubmitting(false);
      }
    },
  });

  const selectedEvent = events.find((ev) => ev.id === formik.values.eventId);

  return (
    <ModalShell
      name="addGuest"
      title={editing ? t("editGuestModalTitle") : t("addGuestModalTitle")}
      onSubmit={formik.handleSubmit}
      footer={
        <>
          <button type="button" className="btn ghost" onClick={closeModal}>
            {t("cancel")}
          </button>
          <button type="submit" className="btn" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? "..." : editing ? t("saveChanges") : t("addGuest")}
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
              <div className={`field${formik.errors.name ? " has-error" : ""}`}>
                <label>{t("guestNameField")}</label>
                <input name="name" value={formik.values.name} onChange={formik.handleChange} placeholder="Full name" required />
              </div>
              <div className="field">
                <label>{t("groupField")}</label>
                <Select
                  value={formik.values.group}
                  onChange={(v) => formik.setFieldValue("group", v)}
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
              <div className={`field${formik.errors.phone ? " has-error" : ""}`}>
                <label>{t("phoneField")}</label>
                <input name="phone" value={formik.values.phone} onChange={formik.handleChange} placeholder="+91" required />
              </div>
              <div className="field">
                <label>{t("emailField")}</label>
                <input
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  placeholder="name@email.com"
                />
              </div>
            </div>
          </div>
          <div className="form-section">
            <div className="form-section-head">
              <EventsIcon />
              <span>{t("secEventAssign")}</span>
            </div>
            <div className={`field${formik.errors.eventId ? " has-error" : ""}`}>
              <label>{t("eventField")}</label>
              <Select
                value={formik.values.eventId}
                onChange={(v) => formik.setFieldValue("eventId", v)}
                options={events.map((ev) => ({ value: ev.id, label: ev.name }))}
                placeholder="Select event"
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
                <div className="lp-avatar">{formik.values.name ? initials(formik.values.name).charAt(0) : "?"}</div>
                <div>
                  <div className="lp-name">{formik.values.name || "Guest Name"}</div>
                  <div className="lp-sub">{t(GROUP_LABEL_KEYS[formik.values.group])}</div>
                </div>
              </div>
              <div className="lp-row">
                <PhoneIcon />
                <span>{formik.values.phone || "Phone number"}</span>
              </div>
              <div className="lp-row">
                <span>✉️</span>
                <span>{formik.values.email || "—"}</span>
              </div>
              <div className="lp-row">
                <EventsIcon />
                <span>{selectedEvent?.name ?? "No event selected"}</span>
              </div>
              <div className="lp-foot">
                <span className="lp-badge">{t(editing ? statusLabelKey(editing.status) : "pendingLabel")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

function statusLabelKey(status: GuestItem["status"]): TranslationKey {
  if (status === "attending") return "attendingLabel";
  if (status === "notattending") return "notAttendingLabel";
  return "pendingLabel";
}
