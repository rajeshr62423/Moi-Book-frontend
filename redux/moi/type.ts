// Mirrors moi-app-backend's MoiResponseDto / CreateMoiDto.
export type MoiType = "money" | "gift";
export type MoiPaymentMethod = "cash" | "upi" | "bank" | "cheque" | "other";
export type MoiGiftCategory =
  | "clothes"
  | "gold"
  | "silver"
  | "jewellery"
  | "household"
  | "electronics"
  | "vouchers"
  | "giftcards"
  | "other";
export type MoiGiftUnit = "pieces" | "grams" | "items" | "kg";

export interface MoiItem {
  id: string;
  guestId: string;
  eventId: string;
  type: MoiType;
  date: string; // ISO yyyy-mm-dd
  notes?: string;
  amount?: number;
  method?: MoiPaymentMethod;
  reference?: string;
  giftCategory?: MoiGiftCategory;
  giftName?: string;
  quantity?: number;
  unit?: MoiGiftUnit;
  giftValue?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MoiInput {
  guestId: string;
  eventId: string;
  type: MoiType;
  date: string;
  notes?: string;
  amount?: number;
  method?: MoiPaymentMethod;
  reference?: string;
  giftCategory?: MoiGiftCategory;
  giftName?: string;
  quantity?: number;
  unit?: MoiGiftUnit;
  giftValue?: number;
}

export interface MoiState {
  items: MoiItem[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}
