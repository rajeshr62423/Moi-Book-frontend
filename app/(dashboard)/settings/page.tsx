"use client";

import { useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { useI18n } from "@/lib/i18n";
import { useHideAppLoaderOnMount, useToast } from "@/lib/ui";
import { ACCENTS, useTheme, type Appearance } from "@/lib/theme";
import { useAuth } from "@/lib/auth";
import {
  BackupIcon,
  DocumentIcon,
  MoonIcon,
  PrivacyIcon,
  SunIcon,
  SystemIcon,
  TeamIcon,
} from "@/components/icons";

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
  const { t } = useI18n();
  const { showToast } = useToast();
  const { user } = useAuth();
  const { accent, appearance, setAccent, setAppearance } = useTheme();
  const [tab, setTab] = useState<TabKey>("profile");
  const [pendingAccent, setPendingAccent] = useState(accent);
  const [pendingAppearance, setPendingAppearance] = useState<Appearance>(appearance);

  function savePreferences() {
    setAccent(pendingAccent);
    setAppearance(pendingAppearance);
    showToast(t("toastPrefsSaved"));
  }

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
            <div className="form-body">
              <div className="profile-photo-row" style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <div className="avatar-lg">{(user?.name || "A").charAt(0)}</div>
                <div>
                  <button className="btn outline small">{t("changePhoto")}</button>
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>{t("fullName")}</label>
                  <input defaultValue={user?.name ?? "Arun Kumar"} />
                </div>
                <div className="field">
                  <label>{t("emailField")}</label>
                  <input defaultValue={user?.email ?? "arun.kumar@email.com"} />
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>{t("phoneField")}</label>
                  <input defaultValue="+91 98765 43210" />
                </div>
                <div className="field">
                  <label>{t("roleField")}</label>
                  <input defaultValue="Event Manager" />
                </div>
              </div>
              <button className="btn" style={{ marginTop: 22 }} onClick={() => showToast(t("toastProfileSaved"))}>
                {t("saveChanges")}
              </button>
            </div>
          )}

          {tab === "preferences" && (
            <div className="form-body">
              <div className="field">
                <label>{t("dateFormat")}</label>
                <input defaultValue="DD MMM YYYY" />
              </div>
              <div className="field-row">
                <div className="field">
                  <label>{t("timeFormat")}</label>
                  <input defaultValue="12 Hour (AM/PM)" />
                </div>
                <div className="field">
                  <label>{t("currencyField")}</label>
                  <input defaultValue="INR (₹)" />
                </div>
              </div>
              <div className="field">
                <label>{t("languageField")}</label>
                <input defaultValue="English" />
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

              <button className="btn" style={{ marginTop: 22 }} onClick={savePreferences}>
                {t("savePreferences")}
              </button>
            </div>
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
            <div className="form-body">
              <div className="field">
                <label>{t("passwordField")}</label>
                <input type="password" defaultValue="••••••••••" />
              </div>
              <div className="field" style={{ marginTop: 14 }}>
                <label>{t("twoFactor")}</label>
                <input defaultValue="Off" />
              </div>
            </div>
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
