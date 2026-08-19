import type { TranslationKey } from "@/lib/i18n";
import type { EventStatus } from "@/redux/event/type";
import type { DateFormatOption, TimeFormatOption } from "@/redux/setting/type";
import { formatDate, formatTime } from "@/lib/format";

export function statusLabel(status: EventStatus, t: (k: TranslationKey) => string) {
  if (status === "confirmed") return t("statusConfirmed");
  if (status === "planning") return t("statusPlanning");
  return t("statusSaveDate");
}

export function formatEventDate(iso: string, dateFormat?: DateFormatOption) {
  return formatDate(iso, dateFormat);
}

export function formatEventTime(hhmm: string, timeFormat?: TimeFormatOption) {
  return formatTime(hhmm, timeFormat);
}

export function formatWeekday(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short" });
}
