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
import { CATEGORY_LABEL_KEYS } from "./AddVendorModal";
import { formatMoiDate } from "@/lib/moiFormat";
import { saveLedgerEntry } from "@/redux/ledger/thunk";
import { fetchEvents } from "@/redux/event/thunk";
import { fetchVendors } from "@/redux/vendor/thunk";
import type { AppDispatch, RootState } from "@/redux/store";
import { extractApiErrorMessage } from "@/services/apiTypes";
import type { LedgerCategory, LedgerItem, LedgerStatus, LedgerType } from "@/redux/ledger/type";
import { EventsIcon, EyeIcon, LedgerIcon, VendorsIcon } from "@/components/icons";

const LEDGER_CATEGORY_VALUES = Object.keys(CATEGORY_LABEL_KEYS) as LedgerCategory[];

interface LedgerFormValues {
  eventId: string;
  vendorId: string;
  title: string;
  category: LedgerCategory;
  type: LedgerType;
  amount: string;
  status: LedgerStatus;
  date: string;
  notes: string;
}

const EMPTY: Omit<LedgerFormValues, "eventId"> = {
  vendorId: "",
  title: "",
  category: "catering",
  type: "expense",
  amount: "",
  status: "pending",
  date: "",
  notes: "",
};

function toFormValues(entry: LedgerItem): LedgerFormValues {
  return {
    eventId: entry.eventId,
    vendorId: entry.vendorId ?? "",
    title: entry.title,
    category: entry.category,
    type: entry.type,
    amount: String(entry.amount),
    status: entry.status,
    date: entry.date,
    notes: entry.notes ?? "",
  };
}

export default function LedgerFormModal() {
  const { t } = useI18n();
  const { settings } = useSettings();
  const dispatch = useDispatch<AppDispatch>();
  const { activeModal, modalPayload, closeModal } = useModal();
  const isOpen = activeModal === "addLedger";
  const editing = isOpen ? (modalPayload as LedgerItem | null) : null;
  const { items: events, loaded: eventsLoaded } = useSelector((state: RootState) => state.event);
  const { items: vendors, loaded: vendorsLoaded } = useSelector((state: RootState) => state.vendor);

  useEffect(() => {
    if (!eventsLoaded) dispatch(fetchEvents()).catch(() => {});
  }, [dispatch, eventsLoaded]);
  useEffect(() => {
    if (!vendorsLoaded) dispatch(fetchVendors()).catch(() => {});
  }, [dispatch, vendorsLoaded]);

  const formik = useFormik<LedgerFormValues>({
    enableReinitialize: true,
    initialValues: editing ? toFormValues(editing) : { ...EMPTY, eventId: events[0]?.id ?? "" },
    validateOnChange: false,
    validateOnBlur: false,
    validate: (values) => {
      const errors: Partial<Record<keyof LedgerFormValues, boolean>> = {};
      if (!values.eventId) errors.eventId = true;
      if (!values.title.trim()) errors.title = true;
      if (values.amount === "" || values.amount == null) errors.amount = true;
      if (!values.date) errors.date = true;
      return errors;
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const payload = {
        eventId: values.eventId,
        vendorId: values.vendorId || undefined,
        title: values.title,
        category: values.category,
        type: values.type,
        amount: Number(String(values.amount).replace(/[^\d.]/g, "")) || 0,
        status: values.status,
        date: values.date,
        notes: values.notes || undefined,
      };
      try {
        const response = await dispatch(saveLedgerEntry(payload, editing?.id));
        toast.success(response.message);
        resetForm();
        closeModal();
      } catch (err) {
        toast.error(extractApiErrorMessage(err, "Couldn't save the transaction"));
      } finally {
        setSubmitting(false);
      }
    },
  });

  const selectedEvent = events.find((ev) => ev.id === formik.values.eventId);
  const selectedVendor = vendors.find((v) => v.id === formik.values.vendorId);

  return (
    <ModalShell
      name="addLedger"
      title={editing ? t("editTransactionModalTitle") : t("addTransactionModalTitle")}
      onSubmit={formik.handleSubmit}
      footer={
        <>
          <button type="button" className="btn ghost" onClick={closeModal}>
            {t("cancel")}
          </button>
          <button type="submit" className="btn" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? "..." : editing ? t("saveChanges") : t("addTransaction")}
          </button>
        </>
      }
    >
      <div className="modal-split">
        <div className="modal-form-col">
          <div className="form-section">
            <div className="form-section-head">
              <LedgerIcon />
              <span>{t("transactionDetails")}</span>
            </div>
            <div className={`field${formik.errors.title ? " has-error" : ""}`}>
              <label>{t("titleField")}</label>
              <input name="title" value={formik.values.title} onChange={formik.handleChange} placeholder="e.g. Catering Advance" required />
            </div>
            <div className="field-row">
              <div className="field">
                <label>{t("categoryField")}</label>
                <Select
                  value={formik.values.category}
                  onChange={(v) => formik.setFieldValue("category", v)}
                  options={LEDGER_CATEGORY_VALUES.map((v) => ({ value: v, label: t(CATEGORY_LABEL_KEYS[v]) }))}
                  aria-label={t("categoryField")}
                />
              </div>
              <div className="field">
                <label>{t("typeField")}</label>
                <Select
                  value={formik.values.type}
                  onChange={(v) => formik.setFieldValue("type", v)}
                  options={[
                    { value: "expense", label: t("typeExpense") },
                    { value: "income", label: t("typeIncome") },
                  ]}
                  aria-label={t("typeField")}
                />
              </div>
            </div>
          </div>
          <div className="form-section">
            <div className="form-section-head">
              <EventsIcon />
              <span>{t("eventField")}</span>
            </div>
            <div className={`field${formik.errors.eventId ? " has-error" : ""}`}>
              <label>{t("eventField")}</label>
              <Select
                value={formik.values.eventId}
                onChange={(v) => formik.setFieldValue("eventId", v)}
                options={events.map((ev) => ({ value: ev.id, label: ev.name }))}
                placeholder="Select event"
                required
                searchable
                searchPlaceholder="Search events…"
                aria-label={t("eventField")}
              />
            </div>
          </div>
          <div className="form-section">
            <div className="form-section-head">
              <VendorsIcon />
              <span>{t("vendorField")}</span>
            </div>
            <div className="field">
              <label>{t("vendorField")}</label>
              <Select
                value={formik.values.vendorId}
                onChange={(v) => formik.setFieldValue("vendorId", v)}
                options={vendors.map((v) => ({ value: v.id, label: v.name }))}
                placeholder="Optional"
                searchable
                searchPlaceholder="Search vendors…"
                aria-label={t("vendorField")}
              />
            </div>
          </div>
          <div className="form-section">
            <div className="form-section-head">
              <LedgerIcon />
              <span>{t("secMoneyDetails")}</span>
            </div>
            <div className="field-row">
              <div className={`field${formik.errors.amount ? " has-error" : ""}`}>
                <label>{t("amountField")}</label>
                <input name="amount" value={formik.values.amount} onChange={formik.handleChange} placeholder={`${CURRENCY_SYMBOLS[settings?.currency ?? "INR"]} 10,000`} required />
              </div>
              <div className="field">
                <label>{t("statusField")}</label>
                <Select
                  value={formik.values.status}
                  onChange={(v) => formik.setFieldValue("status", v)}
                  options={[
                    { value: "pending", label: t("pendingLabel") },
                    { value: "paid", label: t("paidLegend") },
                  ]}
                  aria-label={t("statusField")}
                />
              </div>
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
              <div className="lp-name">{formik.values.title || "Transaction title"}</div>
              <div className="lp-sub">
                {t(CATEGORY_LABEL_KEYS[formik.values.category])} · {selectedVendor?.name ?? "—"}
              </div>
              <div style={{ marginTop: 10 }}>
                <div className="lp-row">
                  <EventsIcon />
                  <span>{selectedEvent?.name ?? "Select event"}</span>
                </div>
                <div className="lp-row">
                  <LedgerIcon />
                  <span>{formatMoiDate(formik.values.date, settings?.dateFormat) || "Select a date"}</span>
                </div>
              </div>
              <div className="lp-foot">
                <span className={`badge ${formik.values.status}`}>{formik.values.status === "paid" ? t("paidLegend") : t("pendingLabel")}</span>
                <span className="lp-amount">
                  {formik.values.amount
                    ? formik.values.amount.startsWith(CURRENCY_SYMBOLS[settings?.currency ?? "INR"])
                      ? formik.values.amount
                      : CURRENCY_SYMBOLS[settings?.currency ?? "INR"] + formik.values.amount
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
