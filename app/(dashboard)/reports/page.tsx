"use client";

import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import PageHeader from "@/components/PageHeader";
import Select from "@/components/ui/Select";
import { useI18n } from "@/lib/i18n";
import type { TranslationKey } from "@/lib/i18n";
import { useHideAppLoaderOnMount } from "@/lib/ui";
import { useSettings } from "@/lib/settings";
import { formatMoiDate } from "@/lib/moiFormat";
import { downloadBlob } from "@/lib/downloadFile";
import { fetchEvents } from "@/redux/event/thunk";
import { fetchReportRecords } from "@/redux/report/thunk";
import type { ReportType } from "@/redux/report/type";
import { exportReportExcelApi, exportReportPdfApi } from "@/services/reportService";
import { extractApiErrorMessage } from "@/services/apiTypes";
import type { AppDispatch, RootState } from "@/redux/store";
import { CalendarClockIcon, CheckIcon, EventsIcon, GuestsIcon, ReportIcon } from "@/components/icons";

const PER_PAGE = 20;
const REPORT_TYPES: ReportType[] = ["eventSummary", "guestReport", "attendanceReport", "eventActivity"];
const REPORT_TYPE_LABEL_KEYS: Record<ReportType, TranslationKey> = {
  eventSummary: "reportTypeEventSummary",
  guestReport: "reportTypeGuestReport",
  attendanceReport: "reportTypeAttendanceReport",
  eventActivity: "reportTypeEventActivity",
};

interface LocalFilters {
  dateFrom: string;
  dateTo: string;
  eventId: string;
  reportType: ReportType;
}

function toApiFilters(filters: LocalFilters, page: number) {
  return { ...filters, page, perPage: PER_PAGE };
}

export default function ReportsPage() {
  useHideAppLoaderOnMount();
  const { t } = useI18n();
  const { settings } = useSettings();
  const dispatch = useDispatch<AppDispatch>();
  const { items: events, loaded: eventsLoaded } = useSelector((state: RootState) => state.event);
  const { records, summary, meta, loading, loaded, error } = useSelector((state: RootState) => state.report);

  const [page, setPage] = useState(1);
  const [exportingExcel, setExportingExcel] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

  useEffect(() => {
    if (!eventsLoaded) dispatch(fetchEvents()).catch(() => {});
  }, [dispatch, eventsLoaded]);

  function runReport(values: LocalFilters, targetPage: number) {
    dispatch(fetchReportRecords(toApiFilters(values, targetPage))).catch((err) =>
      toast.error(extractApiErrorMessage(err, "Couldn't generate the report")),
    );
  }

  const formik = useFormik<LocalFilters>({
    initialValues: { dateFrom: "", dateTo: "", eventId: "all", reportType: "eventSummary" },
    validateOnChange: false,
    validateOnBlur: false,
    validate: (values) => {
      const errors: Partial<Record<keyof LocalFilters, boolean>> = {};
      if (!values.reportType) errors.reportType = true;
      if (values.dateFrom && values.dateTo && values.dateFrom > values.dateTo) {
        errors.dateFrom = true;
        errors.dateTo = true;
      }
      return errors;
    },
    onSubmit: (values) => {
      setPage(1);
      runReport(values, 1);
    },
  });
  const filters = formik.values;

  function goToPage(nextPage: number) {
    if (nextPage < 1) return;
    setPage(nextPage);
    runReport(filters, nextPage);
  }

  async function handleExportExcel() {
    if (exportingExcel) return;
    setExportingExcel(true);
    try {
      const { data, filename } = await exportReportExcelApi(toApiFilters(filters, page));
      downloadBlob(data, filename);
      toast.success(t("toastExportExcelSuccess"));
    } catch (err) {
      toast.error(extractApiErrorMessage(err, "Couldn't export the Excel report"));
    } finally {
      setExportingExcel(false);
    }
  }

  async function handleExportPdf() {
    if (exportingPdf) return;
    setExportingPdf(true);
    try {
      const { data, filename } = await exportReportPdfApi(toApiFilters(filters, page));
      downloadBlob(data, filename);
      toast.success(t("toastExportPdfSuccess"));
    } catch (err) {
      toast.error(extractApiErrorMessage(err, "Couldn't export the PDF report"));
    } finally {
      setExportingPdf(false);
    }
  }

  const eventOptions = [{ value: "all", label: t("allEvents") }, ...events.map((ev) => ({ value: ev.id, label: ev.name }))];
  const reportTypeOptions = REPORT_TYPES.map((rt) => ({ value: rt, label: t(REPORT_TYPE_LABEL_KEYS[rt]) }));

  const hasReport = loaded && !error && !loading && records.length > 0;
  const currentPage = meta?.current_page ?? page;

  const summaryTiles = summary
    ? [
        { label: t("statTotalEvents"), value: String(summary.totalEvents), Icon: ReportIcon },
        { label: t("totalGuests"), value: String(summary.totalGuests), Icon: GuestsIcon },
        { label: t("statConfirmedGuests"), value: String(summary.confirmedGuests), Icon: CheckIcon },
        { label: t("statPendingGuests"), value: String(summary.pendingGuests), Icon: CalendarClockIcon },
        { label: t("statAttendance"), value: `${summary.attendanceRate}%`, Icon: EventsIcon },
      ]
    : [];

  return (
    <>
      <PageHeader title={t("reportsPageTitle")} />

      <form className="glass" style={{ padding: 22, marginBottom: 22 }} onSubmit={formik.handleSubmit} noValidate>
        <h3 style={{ fontSize: 14.5, margin: "0 0 4px", color: "var(--brown)" }}>{t("filtersCardTitle")}</h3>
        <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "0 0 16px" }}>{t("reportsSubtitle")}</p>

        <div className="field-row">
          <div className={`field${formik.errors.dateFrom ? " has-error" : ""}`}>
            <label>{t("dateFromLabel")}</label>
            <input type="date" name="dateFrom" value={filters.dateFrom} onChange={formik.handleChange} />
          </div>
          <div className={`field${formik.errors.dateTo ? " has-error" : ""}`}>
            <label>{t("dateToLabel")}</label>
            <input type="date" name="dateTo" value={filters.dateTo} onChange={formik.handleChange} />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label>{t("eventField")}</label>
            <Select
              value={filters.eventId}
              onChange={(v) => formik.setFieldValue("eventId", v)}
              options={eventOptions}
              placeholder={t("allEvents")}
              aria-label={t("eventField")}
            />
          </div>
          <div className={`field${formik.errors.reportType ? " has-error" : ""}`}>
            <label>{t("reportTypeLabel")}</label>
            <Select
              value={filters.reportType}
              onChange={(v) => formik.setFieldValue("reportType", v as ReportType)}
              options={reportTypeOptions}
              required
              aria-label={t("reportTypeLabel")}
            />
          </div>
        </div>

        <button type="submit" className="btn" disabled={loading} style={{ marginTop: 20 }}>
          <ReportIcon /> <span>{loading ? "..." : t("generateReport")}</span>
        </button>
      </form>

      <div className="glass" style={{ marginBottom: 22 }}>
        {loading ? (
          <div className="template-empty">
            <ReportIcon />
            <p>…</p>
          </div>
        ) : error ? (
          <div className="template-empty">
            <ReportIcon />
            <h3>{t("reportsErrorHint")}</h3>
            <p>{error}</p>
            <button className="btn" onClick={() => runReport(filters, page)}>
              <span>{t("retry")}</span>
            </button>
          </div>
        ) : !loaded ? (
          <div className="template-empty">
            <ReportIcon />
            <h3>{t("reportsReadyTitle")}</h3>
            <p>{t("reportsPreGenerateHint")}</p>
          </div>
        ) : records.length === 0 ? (
          <div className="template-empty">
            <ReportIcon />
            <h3>{t("reportsEmptyTitle")}</h3>
            <p>{t("reportsEmptyHint")}</p>
          </div>
        ) : (
          <>
            <div className="kpi-strip" style={{ padding: 22, marginBottom: 0 }}>
              {summaryTiles.map((s) => (
                <div className="kpi-card glass" key={s.label}>
                  <div className="kpi-top">
                    <div className="stat-icon" style={{ background: "var(--amber-bg, var(--champagne))", color: "var(--amber, var(--gold))" }}>
                      <s.Icon />
                    </div>
                    <span className="kpi-tag">{s.label}</span>
                  </div>
                  <div className="kpi-value">{s.value}</div>
                </div>
              ))}
            </div>

            <table>
              <thead>
                <tr>
                  <th>{t("thEvent")}</th>
                  <th>{t("thDate")}</th>
                  <th>{t("thGuests")}</th>
                  <th>{t("thConfirmed")}</th>
                  <th>{t("thPending")}</th>
                  <th>{t("thNotAttending")}</th>
                  <th>{t("thAttendance")}</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={`${r.eventId}-${r.date}`}>
                    <td>{r.eventName}</td>
                    <td>{formatMoiDate(r.date, settings?.dateFormat)}</td>
                    <td>{r.guests}</td>
                    <td>{r.confirmed}</td>
                    <td>{r.pending}</td>
                    <td>{r.notAttending}</td>
                    <td>{r.attendanceRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pager">
              <span>
                {t("showing")} {records.length} {t("of")} {meta?.total_records ?? records.length} {t("reportsWord")}
              </span>
              <div className="nums">
                <span onClick={() => (meta ? meta.has_prev_page : page > 1) && goToPage(currentPage - 1)}>&lt;</span>
                <span className="active">{currentPage}</span>
                <span onClick={() => (meta ? meta.has_next_page : true) && goToPage(currentPage + 1)}>&gt;</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="glass" style={{ padding: 22 }}>
        <h3 style={{ fontSize: 14.5, margin: "0 0 14px", color: "var(--brown)" }}>{t("exportReportsTitle")}</h3>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn" disabled={!hasReport || exportingExcel} onClick={handleExportExcel}>
            <span>{exportingExcel ? "..." : t("exportExcel")}</span>
          </button>
          <button className="btn" disabled={!hasReport || exportingPdf} onClick={handleExportPdf}>
            <span>{exportingPdf ? "..." : t("exportPdf")}</span>
          </button>
        </div>
      </div>
    </>
  );
}
