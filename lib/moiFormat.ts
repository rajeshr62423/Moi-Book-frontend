import type { MoiGiftCategory, MoiGiftUnit, MoiItem, MoiPaymentMethod } from "@/redux/moi/type";
import type { CurrencyOption, DateFormatOption } from "@/redux/setting/type";
import { formatDate, formatCurrency } from "@/lib/format";

export const PAYMENT_METHOD_LABELS: Record<MoiPaymentMethod, string> = {
  cash: "Cash",
  upi: "UPI",
  bank: "Bank Transfer",
  cheque: "Cheque",
  other: "Other",
};

export const GIFT_CATEGORY_LABELS: Record<MoiGiftCategory, string> = {
  clothes: "Clothes",
  gold: "Gold",
  silver: "Silver",
  jewellery: "Jewellery",
  household: "Household Items",
  electronics: "Electronics",
  vouchers: "Vouchers",
  giftcards: "Gift Cards",
  other: "Other",
};

export const GIFT_UNIT_LABELS: Record<MoiGiftUnit, string> = {
  pieces: "pieces",
  grams: "grams",
  items: "items",
  kg: "kg",
};

export function formatMoiDate(iso: string, dateFormat?: DateFormatOption) {
  return formatDate(iso, dateFormat);
}

export function initials(str: string) {
  const parts = str.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  return parts.map((w) => w[0]).join("").toUpperCase() || "?";
}

export { formatCurrency };

export function moiKindLabel(item: Pick<MoiItem, "type" | "method" | "giftCategory" | "giftName">) {
  if (item.type === "gift") {
    return item.giftName || (item.giftCategory ? GIFT_CATEGORY_LABELS[item.giftCategory] : "Gift");
  }
  return item.method ? PAYMENT_METHOD_LABELS[item.method] : "Cash";
}

export function moiAmountLabel(
  item: Pick<MoiItem, "type" | "amount" | "giftValue" | "quantity" | "unit">,
  currency?: CurrencyOption,
) {
  if (item.type === "money") {
    return formatCurrency(item.amount ?? 0, currency);
  }
  if (item.giftValue) return formatCurrency(item.giftValue, currency);
  if (item.quantity && item.unit) return `${item.quantity} ${GIFT_UNIT_LABELS[item.unit]}`;
  return "—";
}
