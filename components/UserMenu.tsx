"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useOutsideClose } from "@/lib/useOutsideClose";
import { dashboardNotifications } from "@/lib/data";
import {
  BellIcon,
  CloseIcon,
  DocumentIcon,
  GuestsIcon,
  LedgerIcon,
  SettingsIcon,
  SignOutIcon,
  ArrowRightIcon,
} from "@/components/icons";
import Link from "next/link";

const NOTIF_ICON = { guests: GuestsIcon, ledger: LedgerIcon, vendorConfirmed: DocumentIcon } as const;

export default function UserMenu() {
  const { t } = useI18n();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState<"bell" | "avatar" | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useOutsideClose([rootRef], () => setOpen(null));

  const initial = (user?.name || "A").charAt(0).toUpperCase();

  return (
    <div className="top-actions" ref={rootRef}>
      <div className={`dropdown-scrim${open ? " open" : ""}`} onClick={() => setOpen(null)} />
      <div className="icon-btn" onClick={(e) => { e.stopPropagation(); setOpen((v) => (v === "bell" ? null : "bell")); }}>
        <BellIcon />
        <span className="dot">3</span>
        <div className={`dropdown${open === "bell" ? " open" : ""}`}>
          <div className="dropdown-handle" />
          <div className="dropdown-head">
            <BellIcon />
            <span>{t("notifications")}</span>
            <button type="button" className="dropdown-close" onClick={() => setOpen(null)}>
              <CloseIcon />
            </button>
          </div>
          <div className="dropdown-body">
            {dashboardNotifications.map((n, i) => {
              const Icon = NOTIF_ICON[n.icon];
              return (
                <div className="dropdown-item" key={i}>
                  <div className={`dropdown-item-icon${n.icon === "vendorConfirmed" ? " sage" : n.icon === "ledger" ? " rose" : ""}`}>
                    <Icon />
                  </div>
                  <div className="dropdown-item-text">
                    <b>{t(n.titleKey)}</b>
                    <span>{t(n.subtitleKey)}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="dropdown-foot">
            <Link href="/events" onClick={() => setOpen(null)}>
              {t("viewAllNotifications")} <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </div>

      <div className="avatar-btn" onClick={(e) => { e.stopPropagation(); setOpen((v) => (v === "avatar" ? null : "avatar")); }}>
        {initial}
        <div className={`dropdown${open === "avatar" ? " open" : ""}`} style={{ right: 0 }} role="menu" aria-label="Account menu">
          <div className="dropdown-handle" />
          <div className="dropdown-profile">
            <div className="dropdown-profile-avatar">{initial}</div>
            <div className="dropdown-profile-text">
              <b>{user?.name}</b>
              <span>{t("eventManager")}</span>
            </div>
            <button type="button" className="dropdown-close" style={{ marginLeft: "auto" }} onClick={() => setOpen(null)}>
              <CloseIcon />
            </button>
          </div>
          <div className="dropdown-body">
            <Link href="/settings" className="dropdown-item" role="menuitem" onClick={() => setOpen(null)}>
              <div className="dropdown-item-icon sage">
                <SettingsIcon />
              </div>
              <div className="dropdown-item-text">
                <b>{t("accountSettings")}</b>
                <span>Profile, preferences &amp; more</span>
              </div>
            </Link>
            <div
              className="dropdown-item danger"
              role="menuitem"
              onClick={() => {
                setOpen(null);
                logout();
                router.replace("/login");
              }}
            >
              <div className="dropdown-item-icon rose">
                <SignOutIcon />
              </div>
              <div className="dropdown-item-text">
                <b>{t("signOut")}</b>
                <span>End your session</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
