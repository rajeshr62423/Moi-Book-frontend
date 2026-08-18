import type { TranslationKey } from "@/lib/i18n";
import type { EventStatus } from "@/redux/event/type";

export function statusLabel(status: EventStatus, t: (k: TranslationKey) => string) {
  if (status === "confirmed") return t("statusConfirmed");
  if (status === "planning") return t("statusPlanning");
  return t("statusSaveDate");
}

export function formatEventDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatEventTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return hhmm;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export function formatWeekday(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short" });
}
