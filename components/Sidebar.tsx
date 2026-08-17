"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { useAppLoader, useSidebar } from "@/lib/ui";
import {
  DashboardIcon,
  DashboardIconFilled,
  EventsIcon,
  EventsIconFilled,
  GuestsIcon,
  GuestsIconFilled,
  LedgerIcon,
  LedgerIconFilled,
  MoiIcon,
  MoiIconFilled,
  MoonIcon,
  SettingsIcon,
  SettingsIconFilled,
  SunIcon,
  VendorsIcon,
  VendorsIconFilled,
} from "@/components/icons";

const NAV_ITEMS = [
  { href: "/dashboard", key: "navDashboard" as const, Icon: DashboardIcon, IconFilled: DashboardIconFilled },
  { href: "/events", key: "navEvents" as const, Icon: EventsIcon, IconFilled: EventsIconFilled },
  { href: "/moi", key: "navMoi" as const, Icon: MoiIcon, IconFilled: MoiIconFilled },
  { href: "/guests", key: "navGuests" as const, Icon: GuestsIcon, IconFilled: GuestsIconFilled },
  { href: "/ledger", key: "navLedger" as const, Icon: LedgerIcon, IconFilled: LedgerIconFilled },
  { href: "/vendors", key: "navVendors" as const, Icon: VendorsIcon, IconFilled: VendorsIconFilled },
  { href: "/settings", key: "navSettings" as const, Icon: SettingsIcon, IconFilled: SettingsIconFilled },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { t, lang, setLang } = useI18n();
  const { mode, setAppearance } = useTheme();
  const { isOpen, close } = useSidebar();
  const { show } = useAppLoader();

  const isDark = mode === "dark";

  return (
    <>
      <div className={`sidebar-scrim${isOpen ? " open" : ""}`} onClick={close} />
      <aside className={`sidebar${isOpen ? " open" : ""}`}>
        <div className="logo-row">
          <svg className="logo-mark" viewBox="0 0 48 48" fill="none">
            <defs>
              <radialGradient id="glow" cx="50%" cy="35%" r="60%">
                <stop offset="0%" stopColor="#F3D28C" />
                <stop offset="100%" stopColor="#C99132" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="bookGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#E7BD68" />
                <stop offset="100%" stopColor="#C99132" />
              </linearGradient>
            </defs>
            <circle cx="24" cy="18" r="20" fill="url(#glow)" />
            <path
              d="M24 15 C20 12 13 11 8 12.5 V32 C13 30.5 20 31.5 24 34 C28 31.5 35 30.5 40 32 V12.5 C35 11 28 12 24 15Z"
              fill="url(#bookGrad)"
              opacity="0.92"
            />
            <path d="M24 15 V34" stroke="#fff" strokeWidth="1" opacity="0.5" />
            <path d="M24 12 L25 8 L26 12" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" opacity="0.85" />
          </svg>
          <div className="logo-text">
            <span className="name">DigiMoiBook</span>
            <span className="tag">Celebrations</span>
          </div>
        </div>

        <nav className="nav-list">
          {NAV_ITEMS.map(({ href, key, Icon, IconFilled }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            const NavIcon = active ? IconFilled : Icon;
            return (
              <Link
                key={href}
                href={href}
                className={`nav-item${active ? " active" : ""}`}
                onClick={() => {
                  if (!active) show();
                  close();
                }}
              >
                <NavIcon />
                <span>{t(key)}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pref-row">
          <button
            className={`theme-switch${isDark ? " dark" : ""}`}
            role="switch"
            aria-checked={isDark}
            title="Toggle theme"
            onClick={() => setAppearance(isDark ? "light" : "dark")}
          >
            <span className="theme-switch-icon sun">
              <SunIcon />
            </span>
            <span className="theme-switch-icon moon">
              <MoonIcon />
            </span>
            <span className="theme-switch-thumb" />
          </button>
          <button
            className={`lang-switch${lang === "ta" ? " ta" : ""}`}
            role="switch"
            aria-checked={lang === "ta"}
            title="Toggle language"
            onClick={() => setLang(lang === "en" ? "ta" : "en")}
          >
            <span className="lang-switch-label en">EN</span>
            <span className="lang-switch-label ta">தமிழ்</span>
            <span className="lang-switch-thumb" />
          </button>
        </div>

        <div className="sidebar-footer-caption">
          <span>{t("beautifulMoments")}</span>
        </div>

        <div className="sidebar-deco">
          <svg viewBox="0 0 140 160" fill="none">
            <ellipse cx="70" cy="148" rx="26" ry="6" fill="#C99132" opacity="0.12" />
            <path d="M52 130 h36 l-5 22 h-26Z" fill="#E7BD68" opacity="0.85" />
            <path d="M52 130 h36 l-1.5 7h-33Z" fill="#C99132" opacity="0.9" />
            <path d="M70 130 C 66 100 40 92 34 66 C 60 74 72 96 70 130Z" fill="#829B78" opacity="0.55" />
            <path d="M70 130 C 74 96 100 84 108 60 C 84 70 70 96 70 130Z" fill="#829B78" opacity="0.4" />
            <path d="M70 130 C 68 92 70 60 58 34 C 82 48 76 92 70 130Z" fill="#829B78" opacity="0.3" />
            <g opacity="0.95">
              <circle cx="58" cy="40" r="9" fill="#F3E3C6" />
              <circle cx="58" cy="40" r="3.5" fill="#E7BD68" />
              <circle cx="42" cy="58" r="7.5" fill="#F6EAD3" />
              <circle cx="42" cy="58" r="3" fill="#D99A9A" />
              <circle cx="76" cy="54" r="8" fill="#F3E3C6" />
              <circle cx="76" cy="54" r="3.2" fill="#C99132" />
              <circle cx="90" cy="76" r="6.5" fill="#F6EAD3" />
              <circle cx="90" cy="76" r="2.6" fill="#D99A9A" />
              <circle cx="34" cy="80" r="6" fill="#F3E3C6" />
              <circle cx="34" cy="80" r="2.4" fill="#829B78" />
            </g>
            <circle cx="58" cy="40" r="16" fill="#E7BD68" opacity="0.12" />
          </svg>
        </div>
      </aside>
    </>
  );
}
