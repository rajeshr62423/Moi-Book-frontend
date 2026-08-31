import api from "./api";
import type { ApiResponse } from "./apiTypes";
import type { ReportFilters, ReportRecord, ReportSummary } from "@/redux/report/type";

function toQueryParams(filters: ReportFilters) {
  return {
    date_from: filters.dateFrom || undefined,
    date_to: filters.dateTo || undefined,
    event_id: filters.eventId && filters.eventId !== "all" ? filters.eventId : undefined,
    report_type: filters.reportType,
  };
}

interface ReportRecordsData {
  records: ReportRecord[];
  summary: ReportSummary;
}

export const getReportRecordsApi = async (filters: ReportFilters): Promise<ApiResponse<ReportRecordsData>> => {
  const response = await api.get<ApiResponse<ReportRecordsData>>("/reports", {
    params: { ...toQueryParams(filters), page: filters.page, per_page: filters.perPage },
  });
  return response.data;
};

export interface ReportFileResult {
  data: Blob;
  filename: string;
}

function filenameFromContentDisposition(disposition: unknown, fallback: string): string {
  if (typeof disposition !== "string") return fallback;
  const match = disposition.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
  return match?.[1] ? decodeURIComponent(match[1]) : fallback;
}

async function exportReportFile(path: string, filters: ReportFilters, extension: string): Promise<ReportFileResult> {
  const response = await api.get<Blob>(path, {
    params: toQueryParams(filters),
    responseType: "blob",
  });
  const fallbackName = `report-${filters.reportType}-${Date.now()}.${extension}`;
  return {
    data: response.data,
    filename: filenameFromContentDisposition(response.headers["content-disposition"], fallbackName),
  };
}

export const exportReportExcelApi = (filters: ReportFilters): Promise<ReportFileResult> =>
  exportReportFile("/reports/export/excel", filters, "xlsx");

export const exportReportPdfApi = (filters: ReportFilters): Promise<ReportFileResult> =>
  exportReportFile("/reports/export/pdf", filters, "pdf");
