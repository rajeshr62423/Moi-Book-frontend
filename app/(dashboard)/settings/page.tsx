"use client";

import { useState } from "react";
import Link from "next/link";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import PageHeader from "@/components/PageHeader";
import AvatarUpload from "@/components/ui/AvatarUpload";
import Select from "@/components/ui/Select";
import PasswordField from "@/components/auth/PasswordField";
import { useI18n } from "@/lib/i18n";
import { useHideAppLoaderOnMount } from "@/lib/ui";
import { ACCENTS, useTheme, type Appearance } from "@/lib/theme";
import { useAuth } from "@/lib/auth";
import { useSettings } from "@/lib/settings";
import { passwordRules, passwordRulesPass, passwordStrength } from "@/lib/authValidation";
import { changePasswordApi } from "@/services/authService";
import { extractApiErrorMessage } from "@/services/apiTypes";
import type { CurrencyOption, DateFormatOption, LanguageOption, TimeFormatOption } from "@/redux/setting/type";
import {
  BackupIcon,
  DocumentIcon,
  MoonIcon,
  PrivacyIcon,
  SunIcon,
  SystemIcon,
  TeamIcon,
} from "@/components/icons";

interface ProfileFormValues {
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

interface PreferencesFormValues {
  dateFormat: DateFormatOption;
  timeFormat: TimeFormatOption;
  currency: CurrencyOption;
  language: LanguageOption;
}

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const EMPTY_PASSWORD_FORM: PasswordFormValues = { currentPassword: "", newPassword: "", confirmPassword: "" };

const DATE_FORMAT_OPTIONS = [
  { value: "DD MMM YYYY", label: "DD MMM YYYY" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
];

const TIME_FORMAT_OPTIONS = [
  { value: "12h", label: "12 Hour (AM/PM)" },
  { value: "24h", label: "24 Hour" },
];

const CURRENCY_OPTIONS = [
  { value: "INR", label: "INR (₹)" },
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
];

const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "ta", label: "தமிழ்" },
];

const TABS = ["profile", "preferences", "notifications", "security", "event", "payment"] as const;
type TabKey = (typeof TABS)[number];
const TAB_LABEL_KEYS: Record<TabKey, "tabProfile" | "tabPreferences" | "tabNotifications" | "tabSecurity" | "tabEventPrefs" | "tabPaymentSettings"> = {
  profile: "tabProfile",
  preferences: "tabPreferences",
  notifications: "tabNotifications",
  security: "tabSecurity",
  event: "tabEventPrefs",
  payment: "tabPaymentSettings",
};

const QUICK_CARDS = [
  { Icon: BackupIcon, titleKey: "backupExport" as const, subKey: "exportYourData" as const },
  { Icon: DocumentIcon, titleKey: "templates" as const, subKey: "manageTemplates" as const, href: "/settings/templates" },
  { Icon: TeamIcon, titleKey: "inviteTeam" as const, subKey: "addTeamMembers" as const },
  { Icon: PrivacyIcon, titleKey: "privacy" as const, subKey: "managePrivacy" as const },
];

export default function SettingsPage() {
  useHideAppLoaderOnMount();
  const { t, setLang } = useI18n();
  const { user, updateProfile } = useAuth();
  const { settings, updateSettings } = useSettings();
  const { accent, appearance, setAccent, setAppearance } = useTheme();
  const [tab, setTab] = useState<TabKey>("profile");
  const [pendingAccent, setPendingAccent] = useState(accent);
  const [pendingAppearance, setPendingAppearance] = useState<Appearance>(appearance);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const profileForm = useFormik<ProfileFormValues>({
    enableReinitialize: true,
    initialValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      avatar: user?.avatar ?? "",
    },
    validateOnChange: false,
    validateOnBlur: false,
    validate: (values) => {
      const errors: Partial<Record<keyof ProfileFormValues, boolean>> = {};
      if (!values.name.trim()) errors.name = true;
      if (!values.email.trim()) errors.email = true;
      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await updateProfile({
          name: values.name,
          email: values.email,
          phone: values.phone || undefined,
          avatar: values.avatar || undefined,
        });
        toast.success(response.message);
      } catch (err) {
        toast.error(extractApiErrorMessage(err, "Couldn't update your profile"));
      } finally {
        setSubmitting(false);
      }
    },
  });

  const preferencesForm = useFormik<PreferencesFormValues>({
    enableReinitialize: true,
    initialValues: {
      dateFormat: settings?.dateFormat ?? "DD MMM YYYY",
      timeFormat: settings?.timeFormat ?? "12h",
      currency: settings?.currency ?? "INR",
      language: settings?.language ?? "en",
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await updateSettings(values);
        setLang(values.language);
        setAccent(pendingAccent);
        setAppearance(pendingAppearance);
        toast.success(response.message);
      } catch (err) {
        toast.error(extractApiErrorMessage(err, "Couldn't update your preferences"));
      } finally {
        setSubmitting(false);
      }
    },
  });

  const passwordForm = useFormik<PasswordFormValues>({
    initialValues: EMPTY_PASSWORD_FORM,
    validateOnChange: false,
    validateOnBlur: false,
    validate: (values) => {
      const errors: Partial<Record<keyof PasswordFormValues, boolean>> = {};
      if (!values.currentPassword) errors.currentPassword = true;
      if (!passwordRulesPass(passwordRules(values.newPassword))) errors.newPassword = true;
      if (values.confirmPassword !== values.newPassword) errors.confirmPassword = true;
      return errors;
    },
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await changePasswordApi(values.currentPassword, values.newPassword);
        toast.success(response.message);
        resetForm();
      } catch (err) {
        toast.error(extractApiErrorMessage(err, "Couldn't change your password"));
      } finally {
        setSubmitting(false);
      }
    },
  });

  const newPasswordRules = passwordRules(passwordForm.values.newPassword);
  const newPasswordStrength = passwordStrength(newPasswordRules);
  const newPasswordStrengthLabel = newPasswordStrength === "weak" ? "Weak" : newPasswordStrength === "fair" ? "Fair" : "Strong";

  return (
    <>
      <PageHeader title={t("settingsPageTitle")} />
      <div className="settings-grid">
        <div className="glass">
          <div className="settings-tabs">
            {TABS.map((key) => (
              <span key={key} className={tab === key ? "active" : ""} onClick={() => setTab(key)}>
                {t(TAB_LABEL_KEYS[key])}
              </span>
            ))}
          </div>

          {tab === "profile" && (
            <form className="form-body" onSubmit={profileForm.handleSubmit}>
              <AvatarUpload
                value={profileForm.values.avatar}
                onChange={(url) => profileForm.setFieldValue("avatar", url)}
                fallback={(user?.name || "A").charAt(0)}
                label={t("changePhoto")}
                onUploadingChange={setAvatarUploading}
              />
              <div className="field-row">
                <div className={`field${profileForm.errors.name ? " has-error" : ""}`}>
                  <label>{t("fullName")}</label>
                  <input name="name" value={profileForm.values.name} onChange={profileForm.handleChange} />
                </div>
                <div className={`field${profileForm.errors.email ? " has-error" : ""}`}>
                  <label>{t("emailField")}</label>
                  <input name="email" value={profileForm.values.email} onChange={profileForm.handleChange} />
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>{t("phoneField")}</label>
                  <input name="phone" value={profileForm.values.phone} onChange={profileForm.handleChange} />
                </div>
              </div>
              <button
                type="submit"
                className="btn"
                style={{ marginTop: 22 }}
                disabled={profileForm.isSubmitting || avatarUploading}
              >
                {t("saveChanges")}
              </button>
            </form>
          )}

          {tab === "preferences" && (
            <form className="form-body" onSubmit={preferencesForm.handleSubmit}>
              <div className="field">
                <label>{t("dateFormat")}</label>
                <Select
                  value={preferencesForm.values.dateFormat}
                  onChange={(v) => preferencesForm.setFieldValue("dateFormat", v)}
                  options={DATE_FORMAT_OPTIONS}
                  aria-label={t("dateFormat")}
                />
              </div>
              <div className="field-row">
                <div className="field">
                  <label>{t("timeFormat")}</label>
                  <Select
                    value={preferencesForm.values.timeFormat}
                    onChange={(v) => preferencesForm.setFieldValue("timeFormat", v)}
                    options={TIME_FORMAT_OPTIONS}
                    aria-label={t("timeFormat")}
                  />
                </div>
                <div className="field">
                  <label>{t("currencyField")}</label>
                  <Select
                    value={preferencesForm.values.currency}
                    onChange={(v) => preferencesForm.setFieldValue("currency", v)}
                    options={CURRENCY_OPTIONS}
                    aria-label={t("currencyField")}
                  />
                </div>
              </div>
              <div className="field">
                <label>{t("languageField")}</label>
                <Select
                  value={preferencesForm.values.language}
                  onChange={(v) => preferencesForm.setFieldValue("language", v)}
                  options={LANGUAGE_OPTIONS}
                  aria-label={t("languageField")}
                />
              </div>

              <label className="theme-section-label">{t("appearanceField")}</label>
              <div className="appearance-row" role="radiogroup" aria-label="Appearance mode">
                {(
                  [
                    { value: "light" as const, Icon: SunIcon, labelKey: "appearanceLight" as const },
                    { value: "dark" as const, Icon: MoonIcon, labelKey: "appearanceDark" as const },
                    { value: "system" as const, Icon: SystemIcon, labelKey: "appearanceSystem" as const },
                  ]
                ).map(({ value, Icon, labelKey }) => (
                  <button
                    type="button"
                    key={value}
                    className={`appearance-chip${pendingAppearance === value ? " active" : ""}`}
                    aria-pressed={pendingAppearance === value}
                    onClick={() => setPendingAppearance(value)}
                  >
                    <Icon />
                    <span>{t(labelKey)}</span>
                  </button>
                ))}
              </div>

              <label className="theme-section-label">{t("themeField")}</label>
              <div className="theme-row" role="radiogroup" aria-label="Accent theme">
                {ACCENTS.map((a) => (
                  <button
                    type="button"
                    key={a.value}
                    className={`theme-dot${a.value === "original" ? " theme-dot-original" : ""}${pendingAccent === a.value ? " active" : ""}`}
                    style={a.color ? { background: a.color } : undefined}
                    title={a.label}
                    aria-label={`${a.label} theme`}
                    aria-pressed={pendingAccent === a.value}
                    onClick={() => setPendingAccent(a.value)}
                  />
                ))}
              </div>

              <button type="submit" className="btn" style={{ marginTop: 22 }} disabled={preferencesForm.isSubmitting}>
                {t("savePreferences")}
              </button>
            </form>
          )}

          {tab === "notifications" && (
            <div className="form-body">
              <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "0 0 14px" }}>{t("notifIntro")}</p>
              <div className="field">
                <label>{t("emailNotif")}</label>
                <input defaultValue="Enabled" />
              </div>
              <div className="field" style={{ marginTop: 14 }}>
                <label>{t("smsReminders")}</label>
                <input defaultValue="Enabled" />
              </div>
            </div>
          )}

          {tab === "security" && (
            <form className="form-body" onSubmit={passwordForm.handleSubmit}>
              <PasswordField
                label="Current Password"
                value={passwordForm.values.currentPassword}
                onChange={(v) => passwordForm.setFieldValue("currentPassword", v)}
                placeholder="Enter current password"
                autoComplete="current-password"
                hasError={!!passwordForm.errors.currentPassword}
                error="Current password is required."
              />
              <PasswordField
                label="New Password"
                value={passwordForm.values.newPassword}
                onChange={(v) => passwordForm.setFieldValue("newPassword", v)}
                placeholder="Enter new password"
                autoComplete="new-password"
                hasError={!!passwordForm.errors.newPassword}
              />
              {passwordForm.values.newPassword && (
                <>
                  <div className={`auth-strength ${newPasswordStrength}`}>
                    <span />
                  </div>
                  <div className="auth-strength-label">Password strength: {newPasswordStrengthLabel}</div>
                </>
              )}
              <ul className="auth-hints">
                <li className={newPasswordRules.len ? "ok" : ""}>At least 8 characters</li>
                <li className={newPasswordRules.upper ? "ok" : ""}>One uppercase letter</li>
                <li className={newPasswordRules.num ? "ok" : ""}>One number</li>
              </ul>
              <PasswordField
                label="Confirm New Password"
                value={passwordForm.values.confirmPassword}
                onChange={(v) => passwordForm.setFieldValue("confirmPassword", v)}
                placeholder="Confirm new password"
                autoComplete="new-password"
                hasError={!!passwordForm.errors.confirmPassword}
                error="Passwords must match."
              />
              <button type="submit" className="btn" style={{ marginTop: 22 }} disabled={passwordForm.isSubmitting}>
                {passwordForm.isSubmitting ? "Updating…" : "Change Password"}
              </button>

              <div className="field" style={{ marginTop: 26 }}>
                <label>{t("twoFactor")}</label>
                <input defaultValue="Off" disabled />
                <span className="field-hint">Coming soon</span>
              </div>
            </form>
          )}

          {tab === "event" && (
            <div className="form-body">
              <div className="field">
                <label>{t("defaultRsvp")}</label>
                <input defaultValue="14 days" />
              </div>
              <div className="field" style={{ marginTop: 14 }}>
                <label>{t("defaultGroup")}</label>
                <input defaultValue="Family" />
              </div>
            </div>
          )}

          {tab === "payment" && (
            <div className="form-body">
              <div className="field">
                <label>{t("preferredPayment")}</label>
                <input defaultValue="UPI" />
              </div>
              <div className="field" style={{ marginTop: 14 }}>
                <label>{t("billingEmail")}</label>
                <input defaultValue={user?.email ?? "arun.kumar@email.com"} />
              </div>
            </div>
          )}
        </div>

        <div className="glass">
          <div className="section-head">
            <h3>{t("quickSettings")}</h3>
          </div>
          <div className="quick-grid">
            {QUICK_CARDS.map(({ Icon, titleKey, subKey, href }) => {
              const content = (
                <>
                  <Icon />
                  <div className="t">{t(titleKey)}</div>
                  <div className="s">{t(subKey)}</div>
                </>
              );
              return href ? (
                <Link className="quick-card" href={href} key={titleKey}>
                  {content}
                </Link>
              ) : (
                <div className="quick-card" key={titleKey}>
                  {content}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
