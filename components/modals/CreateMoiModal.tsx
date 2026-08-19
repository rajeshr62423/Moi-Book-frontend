"use client";

import { useEffect } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ModalShell from "./ModalShell";
import Select from "@/components/ui/Select";
import { useModal } from "@/lib/ui";
import { useI18n } from "@/lib/i18n";
import { useSettings } from "@/lib/settings";
import { CURRENCY_SYMBOLS } from "@/lib/format";
import { formatMoiDate, initials, moiAmountLabel, moiKindLabel, PAYMENT_METHOD_LABELS, GIFT_CATEGORY_LABELS, GIFT_UNIT_LABELS } from "@/lib/moiFormat";
import { saveMoi } from "@/redux/moi/thunk";
import { fetchEvents } from "@/redux/event/thunk";
import { fetchGuests } from "@/redux/guest/thunk";
import type { AppDispatch, RootState } from "@/redux/store";
import { extractApiErrorMessage } from "@/services/apiTypes";
import type { MoiGiftCategory, MoiGiftUnit, MoiItem, MoiPaymentMethod, MoiType } from "@/redux/moi/type";
import { EventsIcon, EyeIcon, GiftIcon, GuestsIcon, LedgerIcon } from "@/components/icons";

const PAYMENT_METHOD_OPTIONS = (Object.keys(PAYMENT_METHOD_LABELS) as MoiPaymentMethod[]).map((v) => ({
  value: v,
  label: PAYMENT_METHOD_LABELS[v],
}));
const GIFT_CATEGORY_OPTIONS = (Object.keys(GIFT_CATEGORY_LABELS) as MoiGiftCategory[]).map((v) => ({
  value: v,
  label: GIFT_CATEGORY_LABELS[v],
}));
const GIFT_UNIT_OPTIONS = (Object.keys(GIFT_UNIT_LABELS) as MoiGiftUnit[]).map((v) => ({
  value: v,
  label: GIFT_UNIT_LABELS[v],
}));

interface MoiFormValues {
  guestId: string;
  eventId: string;
  type: MoiType;
  amount: string;
  method: MoiPaymentMethod;
  reference: string;
  giftCategory: MoiGiftCategory;
  giftName: string;
  quantity: string;
  unit: MoiGiftUnit;
  giftValue: string;
  date: string;
  notes: string;
}

const EMPTY: MoiFormValues = {
  guestId: "",
  eventId: "",
  type: "money",
  amount: "",
  method: "cash",
  reference: "",
  giftCategory: "clothes",
  giftName: "",
  quantity: "",
  unit: "pieces",
  giftValue: "",
  date: "",
  notes: "",
};

function toFormValues(moi: MoiItem): MoiFormValues {
  return {
    guestId: moi.guestId,
    eventId: moi.eventId,
    type: moi.type,
    amount: moi.amount != null ? String(moi.amount) : "",
    method: moi.method ?? "cash",
    reference: moi.reference ?? "",
    giftCategory: moi.giftCategory ?? "clothes",
    giftName: moi.giftName ?? "",
    quantity: moi.quantity != null ? String(moi.quantity) : "",
    unit: moi.unit ?? "pieces",
    giftValue: moi.giftValue != null ? String(moi.giftValue) : "",
    date: moi.date,
    notes: moi.notes ?? "",
  };
}

export default function CreateMoiModal() {
  const { t } = useI18n();
  const { settings } = useSettings();
  const dispatch = useDispatch<AppDispatch>();
  const { activeModal, modalPayload, closeModal } = useModal();
  const isOpen = activeModal === "createMoi";
  const editing = isOpen ? (modalPayload as MoiItem | null) : null;
  const { items: events, loaded: eventsLoaded } = useSelector((state: RootState) => state.event);
  const { items: guests, loaded: guestsLoaded } = useSelector((state: RootState) => state.guest);

  useEffect(() => {
    if (!eventsLoaded) dispatch(fetchEvents()).catch(() => {});
  }, [dispatch, eventsLoaded]);

  useEffect(() => {
    if (!guestsLoaded) dispatch(fetchGuests()).catch(() => {});
  }, [dispatch, guestsLoaded]);

  const formik = useFormik<MoiFormValues>({
    enableReinitialize: true,
    initialValues: editing ? toFormValues(editing) : { ...EMPTY, eventId: events[0]?.id ?? "" },
    validateOnChange: false,
    validateOnBlur: false,
    validate: (values) => {
      const errors: Partial<Record<keyof MoiFormValues, boolean>> = {};
      if (!values.guestId) errors.guestId = true;
      if (!values.eventId) errors.eventId = true;
      if (!values.date) errors.date = true;
      if (values.type === "money" && (values.amount === "" || values.amount == null)) errors.amount = true;
      return errors;
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const payload =
        values.type === "money"
          ? {
              guestId: values.guestId,
              eventId: values.eventId,
              type: values.type,
              date: values.date,
              notes: values.notes || undefined,
              amount: Number(String(values.amount).replace(/[^\d.]/g, "")) || 0,
              method: values.method,
              reference: values.reference || undefined,
            }
          : {
              guestId: values.guestId,
              eventId: values.eventId,
              type: values.type,
              date: values.date,
              notes: values.notes || undefined,
              giftCategory: values.giftCategory,
              giftName: values.giftName || undefined,
              quantity: values.quantity ? Number(values.quantity) : undefined,
              unit: values.unit,
              giftValue: values.giftValue ? Number(String(values.giftValue).replace(/[^\d.]/g, "")) || undefined : undefined,
            };
      try {
        const response = await dispatch(saveMoi(payload, editing?.id));
        toast.success(response.message);
        resetForm();
        closeModal();
      } catch (err) {
        toast.error(extractApiErrorMessage(err, "Couldn't save the moi contribution"));
      } finally {
        setSubmitting(false);
      }
    },
  });

  const isGift = formik.values.type === "gift";
  const selectedEvent = events.find((ev) => ev.id === formik.values.eventId);
  const selectedGuest = guests.find((g) => g.id === formik.values.guestId);
  const guestOptions = guests
    .filter((g) => !formik.values.eventId || g.eventId === formik.values.eventId)
    .map((g) => ({ value: g.id, label: g.name }));
  const kindLabel = moiKindLabel({
    type: formik.values.type,
    method: formik.values.method,
    giftCategory: formik.values.giftCategory,
    giftName: formik.values.giftName,
  });
  const amountLabel = moiAmountLabel(
    {
      type: formik.values.type,
      amount: Number(String(formik.values.amount).replace(/[^\d.]/g, "")) || 0,
      giftValue: Number(String(formik.values.giftValue).replace(/[^\d.]/g, "")) || 0,
      quantity: formik.values.quantity ? Number(formik.values.quantity) : undefined,
      unit: formik.values.unit,
    },
    settings?.currency,
  );

  return (
    <ModalShell
      name="createMoi"
      title={editing ? t("editMoiModalTitle") : t("createMoiModalTitle")}
      onSubmit={formik.handleSubmit}
      footer={
        <>
          <button type="button" className="btn ghost" onClick={closeModal}>
            {t("cancel")}
          </button>
          <button type="submit" className="btn" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? "..." : editing ? t("saveChanges") : t("saveMoi")}
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
            <div className={`field${formik.errors.guestId ? " has-error" : ""}`}>
              <label>{t("guestNameField")}</label>
              <Select
                value={formik.values.guestId}
                onChange={(v) => formik.setFieldValue("guestId", v)}
                options={guestOptions}
                placeholder="Select guest"
                required
                name="moiGuest"
                searchable
                searchPlaceholder="Search guests…"
                aria-label={t("guestNameField")}
              />
            </div>
            <div className={`field${formik.errors.eventId ? " has-error" : ""}`}>
              <label>{t("eventField")}</label>
              <Select
                value={formik.values.eventId}
                onChange={(v) => formik.setFieldValue("eventId", v)}
                options={events.map((ev) => ({ value: ev.id, label: ev.name }))}
                placeholder="Select event"
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
                value={formik.values.type}
                onChange={(v) => formik.setFieldValue("type", v)}
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
              <div className={`field${formik.errors.amount ? " has-error" : ""}`}>
                <label>{t("moiAmount")}</label>
                <input name="amount" value={formik.values.amount} onChange={formik.handleChange} placeholder={`${CURRENCY_SYMBOLS[settings?.currency ?? "INR"]} 10,000`} required />
              </div>
              <div className="field">
                <label>{t("moiPaymentMethod")}</label>
                <Select
                  value={formik.values.method}
                  onChange={(v) => formik.setFieldValue("method", v)}
                  options={PAYMENT_METHOD_OPTIONS}
                  aria-label={t("moiPaymentMethod")}
                />
              </div>
              <div className="field">
                <label>{t("moiReference")}</label>
                <input name="reference" value={formik.values.reference} onChange={formik.handleChange} placeholder="Optional" />
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
                  value={formik.values.giftCategory}
                  onChange={(v) => formik.setFieldValue("giftCategory", v)}
                  options={GIFT_CATEGORY_OPTIONS}
                  aria-label={t("moiGiftCategory")}
                />
              </div>
              <div className="field">
                <label>{t("moiGiftName")}</label>
                <input name="giftName" value={formik.values.giftName} onChange={formik.handleChange} placeholder="e.g. Gold Chain" />
              </div>
              <div className="field-row">
                <div className="field">
                  <label>{t("moiQuantity")}</label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    name="quantity"
                    value={formik.values.quantity}
                    onChange={formik.handleChange}
                    placeholder="1"
                  />
                </div>
                <div className="field">
                  <label>{t("moiUnit")}</label>
                  <Select
                    value={formik.values.unit}
                    onChange={(v) => formik.setFieldValue("unit", v)}
                    options={GIFT_UNIT_OPTIONS}
                    aria-label={t("moiUnit")}
                  />
                </div>
              </div>
              <div className="field">
                <label>{t("moiGiftValueField")}</label>
                <input name="giftValue" value={formik.values.giftValue} onChange={formik.handleChange} placeholder={CURRENCY_SYMBOLS[settings?.currency ?? "INR"]} />
              </div>
            </div>
          )}
          <div className="form-section">
            <div className="form-section-head">
              <EventsIcon />
              <span>{t("secAdditionalInfo")}</span>
            </div>
            <div className={`field${formik.errors.date ? " has-error" : ""}`}>
              <label>{t("dateField")}</label>
              <input type="date" name="date" value={formik.values.date} onChange={formik.handleChange} required />
            </div>
            <div className="field">
              <label>{t("moiNotes")}</label>
              <input name="notes" value={formik.values.notes} onChange={formik.handleChange} placeholder="Optional notes" />
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
                <div className="lp-avatar">{selectedGuest ? initials(selectedGuest.name).charAt(0) : "?"}</div>
                <div>
                  <div className="lp-name">{selectedGuest?.name ?? "Select guest"}</div>
                  <div className="lp-sub">{selectedEvent?.name ?? ""}</div>
                </div>
              </div>
              <div className="lp-row">
                <LedgerIcon />
                <span>{kindLabel}</span>
              </div>
              <div className="lp-row">
                <EventsIcon />
                <span>{formatMoiDate(formik.values.date, settings?.dateFormat) || "Select a date"}</span>
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
