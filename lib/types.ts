export type EventStatus = "confirmed" | "planning" | "savedate";

export interface EventItem {
  id: string;
  name: string;
  type: string;
  typeKey: string;
  date: string; // ISO yyyy-mm-dd
  time: string;
  weekday: string;
  location: string;
  venue: string;
  guests: number;
  status: EventStatus;
  image: string;
}

export type RsvpStatus = "attending" | "notattending" | "pending";
export type GuestGroup = "family" | "friends" | "colleagues" | "relatives";

export interface GuestItem {
  id: string; // slug, used in /guests/[id]
  name: string;
  relation: string;
  group: GuestGroup;
  phone: string;
  email: string;
  eventName: string;
  eventDate: string;
  status: RsvpStatus;
}

export interface GuestProfile {
  avatar: string;
  name: string;
  relation: string;
  relationDetail: string;
  attendance: RsvpStatus;
  phone: string;
  email: string;
  address: string;
  city: string;
  category: string;
  people: string;
  invite: string;
  notes: string;
  moiTotal: string;
  moiBreakdown: { icon: string; label: string; value: string }[];
  history: { icon: string; title: string; subtitle: string }[];
  events: { image: string; name: string; date: string; location: string; status: RsvpStatus }[];
}

export type VendorStatus = "confirmed" | "planning" | "savedate" | "pending";

export interface VendorItem {
  id: string;
  name: string;
  category: string;
  categoryKey: string;
  rating: number;
  reviews: number;
  phone: string;
  location: string;
  status: VendorStatus;
  statusLabelKey: string;
  image: string;
}

export type MoiType = "money" | "gift";
export type MoiMethod = "cash" | "upi" | "bank" | "gold" | "silver" | "voucher";

export interface MoiItem {
  id: string;
  guestName: string;
  eventName: string;
  type: MoiType;
  method: MoiMethod;
  kindLabel: string;
  amountLabel: string;
  amount: number;
  date: string;
}

export interface DashboardCelebration {
  id: string;
  name: string;
  typeKey: string;
  date: string;
  day: string;
  month: string;
  location: string;
  guests: number;
  status: EventStatus;
  image: string;
}
