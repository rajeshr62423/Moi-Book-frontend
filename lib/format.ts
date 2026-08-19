import type { CurrencyOption, DateFormatOption, TimeFormatOption } from "@/redux/setting/type";

export const CURRENCY_SYMBOLS: Record<CurrencyOption, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

const CURRENCY_LOCALES: Record<CurrencyOption, string> = {
  INR: "en-IN",
  USD: "en-US",
  EUR: "de-DE",
  GBP: "en-GB",
};

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** iso: "YYYY-MM-DD" (date-only) or a full ISO datetime — both parse via the date-only "T00:00:00" pin used elsewhere in this codebase. */
export function formatDate(iso: string, dateFormat: DateFormatOption = "DD MMM YYYY"): string {
  if (!iso) return "";
  const d = new Date(iso.length <= 10 ? iso + "T00:00:00" : iso);
  if (isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  switch (dateFormat) {
    case "DD/MM/YYYY":
      return `${dd}/${mm}/${yyyy}`;
    case "MM/DD/YYYY":
      return `${mm}/${dd}/${yyyy}`;
    case "YYYY-MM-DD":
      return `${yyyy}-${mm}-${dd}`;
    case "DD MMM YYYY":
    default:
      return `${dd} ${MONTHS_SHORT[d.getMonth()]} ${yyyy}`;
  }
}

/** hhmm: "HH:mm" 24-hour input (matches <input type="time"> / backend storage format). */
export function formatTime(hhmm: string, timeFormat: TimeFormatOption = "12h"): string {
  const [h, m] = hhmm.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return hhmm;
  const mm = String(m).padStart(2, "0");
  if (timeFormat === "24h") return `${String(h).padStart(2, "0")}:${mm}`;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${mm} ${period}`;
}

export function formatCurrency(amount: number, currency: CurrencyOption = "INR"): string {
  return CURRENCY_SYMBOLS[currency] + amount.toLocaleString(CURRENCY_LOCALES[currency]);
}
