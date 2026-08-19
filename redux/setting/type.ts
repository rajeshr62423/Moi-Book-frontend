// Mirrors moi-app-backend's SettingsResponseDto.
export type DateFormatOption = "DD MMM YYYY" | "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD";
export type TimeFormatOption = "12h" | "24h";
export type CurrencyOption = "INR" | "USD" | "EUR" | "GBP";
export type LanguageOption = "en" | "ta";

export interface Settings {
  dateFormat: DateFormatOption;
  timeFormat: TimeFormatOption;
  currency: CurrencyOption;
  language: LanguageOption;
}

export interface UpdateSettingsRequest {
  dateFormat?: DateFormatOption;
  timeFormat?: TimeFormatOption;
  currency?: CurrencyOption;
  language?: LanguageOption;
}

export interface SettingState {
  settings: Settings | null;
  loading: boolean;
  loaded: boolean;
  error: string | null;
}
