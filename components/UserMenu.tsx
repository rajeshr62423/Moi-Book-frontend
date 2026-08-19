"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useNotifications } from "@/lib/notifications";
import { useOutsideClose } from "@/lib/useOutsideClose";
import { formatRelativeTime } from "@/lib/dashboardFormat";
import {
  BellIcon,
  CloseIcon,
  EventsIcon,
  GuestsIcon,
  VendorsIcon,
  MoiIcon,
  LedgerIcon,
  SettingsIcon,
  SignOutIcon,
} from "@/components/icons";
import Link from "next/link";

const NOTIF_ICON = {
  events: EventsIcon,
  guests: GuestsIcon,
  vendors: VendorsIcon,
  moi: MoiIcon,
  ledger: LedgerIcon,
} as const;

export default function UserMenu() {
  const { t } = useI18n();
  const { user, logout } = useAuth();
  const { items: notifications, unreadCount, refetch, markRead, markAllRead } = useNotifications();
  const router = useRouter();
  const [open, setOpen] = useState<"bell" | "avatar" | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useOutsideClose([rootRef], () => setOpen(null));

  const initial = (user?.name || "A").charAt(0).toUpperCase();

  function toggleBell() {
    const next = open === "bell" ? null : "bell";
    setOpen(next);
    if (next === "bell") refetch();
  }

  function handleNotificationClick(id: string, link?: string) {
    markRead(id);
    setOpen(null);
    if (link) router.push(link);
  }

  return (
    <div className="top-actions" ref={rootRef}>
      <div className={`dropdown-scrim${open ? " open" : ""}`} onClick={() => setOpen(null)} />
      <div className="icon-btn" onClick={(e) => { e.stopPropagation(); toggleBell(); }}>
        <BellIcon />
        {unreadCount > 0 && <span className="dot">{unreadCount > 9 ? "9+" : unreadCount}</span>}
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
            {notifications.length === 0 ? (
              <div className="dropdown-item">
                <div className="dropdown-item-text">
                  <span>{t("noNotifications")}</span>
                </div>
              </div>
            ) : (
              notifications.map((n) => {
                const Icon = NOTIF_ICON[n.type];
                return (
                  <div
                    className={`dropdown-item${n.read ? "" : " unread"}`}
                    key={n.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleNotificationClick(n.id, n.link)}
                  >
                    <div className={`dropdown-item-icon${n.type === "vendors" ? " sage" : n.type === "ledger" ? " rose" : ""}`}>
                      <Icon />
                    </div>
                    <div className="dropdown-item-text">
                      <b>{n.message}</b>
                      <span>{formatRelativeTime(n.createdAt)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          {unreadCount > 0 && (
            <div className="dropdown-foot">
              <button
                type="button"
                className="link-sm"
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => markAllRead()}
              >
                {t("markAllAsRead")}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="avatar-btn" onClick={(e) => { e.stopPropagation(); setOpen((v) => (v === "avatar" ? null : "avatar")); }}>
        {user?.avatar ? (
          <span style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden" }}>
            <img src={user.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </span>
        ) : (
          initial
        )}
        <div className={`dropdown${open === "avatar" ? " open" : ""}`} style={{ right: 0 }} role="menu" aria-label="Account menu">
          <div className="dropdown-handle" />
          <div className="dropdown-profile">
            <div className="dropdown-profile-avatar" style={user?.avatar ? { overflow: "hidden" } : undefined}>
              {user?.avatar ? (
                <img src={user.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }} />
              ) : (
                initial
              )}
            </div>
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
              onClick={async () => {
                setOpen(null);
                const result = await logout();
                toast.success(result.message);
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
