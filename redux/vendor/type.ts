// Mirrors moi-app-backend's VendorResponseDto / CreateVendorDto.
export type VendorCategory = "catering" | "venue" | "photography" | "decoration" | "entertainment" | "transport" | "others";
export type VendorStatus = "shortlisted" | "contacted" | "quotation" | "booked";

export interface VendorItem {
  id: string;
  name: string;
  category: VendorCategory;
  phone: string;
  location: string;
  thumbnail?: string; // uploaded image URL
  status: VendorStatus;
  createdAt: string;
  updatedAt: string;
}

export interface VendorInput {
  name: string;
  category: VendorCategory;
  phone: string;
  location: string;
  thumbnail?: string;
  status?: VendorStatus;
}

export interface VendorState {
  items: VendorItem[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
}
