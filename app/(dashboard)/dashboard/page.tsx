"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { useAppLoader, useHideAppLoaderOnMount, useModal } from "@/lib/ui";
import { useAuth } from "@/lib/auth";
import { useSettings } from "@/lib/settings";
import MobileToggleButton from "@/components/MobileToggleButton";
import UserMenu from "@/components/UserMenu";
import GlobalSearch from "@/components/GlobalSearch";
import { TYPE_LABEL_KEYS } from "@/components/modals/CreateEventModal";
import { statusLabel as eventStatusLabel } from "@/lib/eventFormat";
import { formatCurrency } from "@/lib/moiFormat";
import { formatRelativeTime } from "@/lib/dashboardFormat";
import { fetchEvents } from "@/redux/event/thunk";
import { fetchDashboardSummary } from "@/redux/dashboard/thunk";
import type { ActivityIcon } from "@/redux/dashboard/type";
import type { AppDispatch, RootState } from "@/redux/store";
import { extractApiErrorMessage } from "@/services/apiTypes";
import {
  ArrowRightIcon,
  CelebrationIcon,
  CheckIcon,
  DocumentIcon,
  EventsIcon,
  GuestsCheckIcon,
  GuestsIcon,
  LedgerIcon,
  LocationIcon,
  MoiIcon,
  PlusIcon,
  VendorsIcon,
  WalletIcon,
} from "@/components/icons";

const ACTIVITY_ICON: Record<ActivityIcon, typeof EventsIcon> = {
  events: EventsIcon,
  guests: GuestsIcon,
  vendors: VendorsIcon,
  moi: MoiIcon,
  ledger: LedgerIcon,
};

const EMPTY_LEDGER = { totalBudget: 0, totalPaid: 0, totalPending: 0, totalRemaining: 0, paidPct: 0 };

function stepClass(state: "done" | "current" | "pending") {
  return state === "current" ? " current" : state === "pending" ? " pending" : "";
}

export default function DashboardPage() {
  useHideAppLoaderOnMount();
  const { t } = useI18n();
  const { openModal } = useModal();
  const { show } = useAppLoader();
  const router = useRouter();
  const { user } = useAuth();
  const { settings } = useSettings();
  const dispatch = useDispatch<AppDispatch>();

  const { items: events, loaded: eventsLoaded } = useSelector((state: RootState) => state.event);
  const { summary, loaded: summaryLoaded } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    if (!eventsLoaded) dispatch(fetchEvents()).catch((err) => toast.error(extractApiErrorMessage(err, "Couldn't load events")));
  }, [dispatch, eventsLoaded]);
  useEffect(() => {
    if (!summaryLoaded) dispatch(fetchDashboardSummary()).catch((err) => toast.error(extractApiErrorMessage(err, "Couldn't load dashboard summary")));
  }, [dispatch, summaryLoaded]);

  function goToEvents() {
    show();
    router.push("/events");
  }

  const today = new Date().toISOString().slice(0, 10);

  const upcomingCelebs = useMemo(() => {
    return events
      .filter((ev) => ev.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 4)
      .map((ev) => {
        const d = new Date(ev.date + "T00:00:00");
        return { ...ev, day: String(d.getDate()).padStart(2, "0"), month: d.toLocaleDateString("en-GB", { month: "short" }) };
      });
  }, [events, today]);

  const ledger = summary?.ledger ?? EMPTY_LEDGER;

  const STAT_CARDS = [
    { icon: EventsIcon, bg: "var(--rose-bg)", color: "#C97A6A", value: String(summary?.upcomingEventsCount ?? 0).padStart(2, "0"), labelKey: "upcomingEvents" as const },
    { icon: GuestsIcon, bg: "var(--sage-bg)", color: "var(--sage)", value: String(summary?.totalGuests ?? 0), labelKey: "totalGuests" as const },
    { icon: WalletIcon, bg: "var(--amber-bg)", color: "var(--amber)", value: formatCurrency(ledger.totalPending, settings?.currency), labelKey: "pendingPayments" as const },
    { icon: VendorsIcon, bg: "var(--rose-bg)", color: "#C97A6A", value: String(summary?.vendorsCount ?? 0), labelKey: "vendorsLabel" as const },
    { icon: GuestsCheckIcon, bg: "var(--sage-bg)", color: "var(--sage)", value: String(summary?.pendingRsvps ?? 0).padStart(2, "0"), labelKey: "pendingRsvps" as const },
  ];

  const attentionItems = useMemo(() => {
    if (!summary) return [];
    const items: { Icon: typeof GuestsCheckIcon; title: string; subtitleKey: "followUp" | "reviewLedger" | "contactVendor"; href: string }[] = [];

    if (summary.pendingRsvps > 0) {
      items.push({ Icon: GuestsCheckIcon, title: `${summary.pendingRsvps} ${t("guestRsvpsPendingAttn")}`, subtitleKey: "followUp", href: "/guests" });
    }
    if (summary.ledger.totalPending > 0) {
      items.push({ Icon: LedgerIcon, title: `${formatCurrency(summary.ledger.totalPending, settings?.currency)} ${t("paymentPendingAttn")}`, subtitleKey: "reviewLedger", href: "/ledger" });
    }
    if (summary.unbookedVendorsCount > 0) {
      items.push({ Icon: DocumentIcon, title: `${summary.unbookedVendorsCount} ${t("vendorsAwaitingAttn")}`, subtitleKey: "contactVendor", href: "/vendors" });
    }
    return items.slice(0, 4);
  }, [summary, t, settings?.currency]);

  const nearestEvent = upcomingCelebs[0] ?? events[0];

  const journey = useMemo(() => {
    const step = (pct: number): "done" | "current" | "pending" => (pct >= 1 ? "done" : pct > 0 ? "current" : "pending");

    const guestsPct = summary && summary.totalGuests > 0 ? (summary.totalGuests - summary.pendingRsvps) / summary.totalGuests : 0;
    const vendorsPct = summary && summary.vendorsCount > 0 ? (summary.vendorsCount - summary.unbookedVendorsCount) / summary.vendorsCount : 0;
    const paymentsPct = ledger.paidPct / 100;
    const celebrationState = nearestEvent && nearestEvent.date < today ? "done" : "pending";
    const overallPct = Math.round(((guestsPct + vendorsPct + paymentsPct) / 3) * 100);

    return {
      guestsState: step(guestsPct),
      vendorsState: step(vendorsPct),
      paymentsState: step(paymentsPct),
      celebrationState: celebrationState as "done" | "pending",
      overallPct,
    };
  }, [summary, ledger.paidPct, nearestEvent, today]);

  const firstName = user?.name?.split(" ")[0];

  return (
    <>
      <div className="topbar">
        <MobileToggleButton />
        <div className="greeting">
          <div className="eyebrow">{t("welcomeBack")}</div>
          <h1>
            {t("goodEveningLabel")}
            {firstName ? `, ${firstName}` : ""}
          </h1>
          <p>{t("mayEvery")}</p>
          <svg className="greeting-divider" viewBox="0 0 180 10" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M0 5h70M110 5h70" />
            <circle cx="90" cy="5" r="3" />
            <path d="M84 5l3-3 3 3-3 3Z" />
          </svg>
        </div>
        <GlobalSearch />
        <UserMenu />
      </div>

      <div className="dashboard-top">
        <div className="hero">
          <div className="hero-content">
            <div className="hero-eyebrow">✦ DigiMoiBook</div>
            <h1>{t("heroTitle")}</h1>
            <p>{t("heroSubtitle")}</p>
            <div className="hero-actions">
              <button className="btn" onClick={() => openModal("createEvent")}>
                <PlusIcon /> <span>{t("createEvent")}</span>
              </button>
              <button className="btn outline" onClick={goToEvents}>
                <span>{t("viewEvents")}</span> <ArrowRightIcon />
              </button>
            </div>
          </div>
        </div>
        <div className="glass">
          <div className="section-head">
            <h3>{t("needsAttention")}</h3>
          </div>
          <div className="attn-list">
            {attentionItems.length === 0 ? (
              <div className="attn-item">
                <div className="attn-ico" style={{ background: "var(--sage-bg)", color: "var(--sage)" }}>
                  <CheckIcon />
                </div>
                <div>
                  <b>{t("allCaughtUp")}</b>
                  <span>{t("noAttentionItems")}</span>
                </div>
              </div>
            ) : (
              attentionItems.map((item, i) => (
                <Link href={item.href} className="attn-item" key={i}>
                  <div className="attn-ico">
                    <item.Icon />
                  </div>
                  <div>
                    <b>{item.title}</b>
                    <span>{t(item.subtitleKey)}</span>
                  </div>
                  <span className="attn-arrow">
                    <ArrowRightIcon />
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="stat-row">
        {STAT_CARDS.map(({ icon: Icon, bg, color, value, labelKey }) => (
          <div className="stat-card glass" key={labelKey}>
            <div className="stat-top">
              <div className="stat-icon" style={{ background: bg, color }}>
                <Icon />
              </div>
              <svg className="spark" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5Z" />
              </svg>
            </div>
            <div className="stat-value">{value}</div>
            <div className="stat-label">{t(labelKey)}</div>
          </div>
        ))}
      </div>

      <div className="glass" style={{ marginBottom: 18 }}>
        <div className="section-head">
          <h3>{t("upcomingCelebrations")}</h3>
          <Link href="/events" className="link-sm">
            <span>{t("viewAll")}</span> <ArrowRightIcon />
          </Link>
        </div>
        {upcomingCelebs.length === 0 ? (
          <div className="template-empty">
            <EventsIcon />
            <p>{t("noUpcomingEvents")}</p>
          </div>
        ) : (
          <div className="celeb-grid">
            {upcomingCelebs.map((ev) => (
              <div className="celeb-card" key={ev.id} onClick={() => openModal("viewEvent", ev)} style={{ cursor: "pointer" }}>
                {ev.thumbnail ? (
                  <div className="celeb-img" style={{ backgroundImage: `url('${ev.thumbnail}')` }}>
                    <div className="date-badge">
                      <div className="d">{ev.day}</div>
                      <div className="m">{ev.month}</div>
                    </div>
                  </div>
                ) : (
                  <div className="celeb-img img-fallback">
                    <EventsIcon className="img-fallback-icon" />
                    <div className="date-badge">
                      <div className="d">{ev.day}</div>
                      <div className="m">{ev.month}</div>
                    </div>
                  </div>
                )}
                <div className="celeb-body">
                  <div className="celeb-name">{ev.name}</div>
                  <div className="celeb-type">{t(TYPE_LABEL_KEYS[ev.type])}</div>
                  <div className="celeb-meta">
                    <LocationIcon />
                    {ev.location} · {ev.guests} Guests
                  </div>
                  <span className={`badge ${ev.status}`}>
                    <CheckIcon />
                    <span>{eventStatusLabel(ev.status, t)}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="three-col">
        <div className="glass">
          <div className="section-head">
            <h3>
              {nearestEvent ? `${nearestEvent.name} — ` : ""}
              <span>{t("journey")}</span>
            </h3>
            <span className="badge confirmed">
              <span>
                {journey.overallPct}% {t("readyLabel")}
              </span>
            </span>
          </div>
          <div className="journey">
            <div className={`journey-step${stepClass(journey.guestsState)}`}>
              <div className="circ">
                <GuestsCheckIcon />
              </div>
              <span>{t("journeyGuests")}</span>
            </div>
            <div className={`journey-step${stepClass(journey.vendorsState)}`}>
              <div className="circ">
                <VendorsIcon />
              </div>
              <span>{t("journeyVendors")}</span>
            </div>
            <div className={`journey-step${stepClass(journey.paymentsState)}`}>
              <div className="circ">
                <LedgerIcon />
              </div>
              <span>{t("journeyPayments")}</span>
            </div>
            <div className={`journey-step${stepClass(journey.celebrationState)}`}>
              <div className="circ">
                <CelebrationIcon />
              </div>
              <span>{t("journeyCelebration")}</span>
            </div>
          </div>
          <p className="journey-note">{t("journeyNote")}</p>
        </div>

        <div className="glass ledger-summary-card">
          <div className="section-head">
            <h3>{t("ledgerCardTitle")}</h3>
          </div>
          <div className="donut-wrap donut-wrap-stack">
            <div className="donut" style={{ background: `conic-gradient(var(--sage) 0 ${ledger.paidPct}%, var(--rose) ${ledger.paidPct}% 100%)` }}>
              <div className="donut-pct">{ledger.paidPct}%</div>
            </div>
            <div className="ledger-figures">
              <div className="lf-row">
                <span>{t("budgetLegend")}</span>
                <b>{formatCurrency(ledger.totalBudget, settings?.currency)}</b>
              </div>
              <div className="lf-row lf-paid">
                <span>{t("paidLegend")}</span>
                <b>{formatCurrency(ledger.totalPaid, settings?.currency)}</b>
              </div>
              <div className="lf-row lf-remaining">
                <span>{t("remainingLegend")}</span>
                <b>{formatCurrency(ledger.totalRemaining, settings?.currency)}</b>
              </div>
            </div>
          </div>
          <div className="section-head" style={{ paddingTop: 0, borderTop: "1px solid var(--champagne)" }}>
            <Link href="/ledger" className="link-sm" style={{ margin: "0 auto" }}>
              <span>{t("viewLedger")}</span> <ArrowRightIcon />
            </Link>
          </div>
        </div>

        <div className="glass">
          <div className="section-head">
            <h3>{t("recentMoments")}</h3>
          </div>
          <div className="moments">
            {!summary?.recentActivity.length ? (
              <div style={{ color: "var(--muted)", fontSize: 12.5, padding: "0 22px 18px" }}>{t("noRecentActivity")}</div>
            ) : (
              summary.recentActivity.map((m, i) => {
                const Icon = ACTIVITY_ICON[m.icon];
                return (
                  <div className="moment-row" key={i}>
                    <span className="tdot">
                      <Icon />
                    </span>
                    <div className="txt">
                      <span>{m.text}</span>
                      <span className="time">{formatRelativeTime(m.time, settings?.dateFormat)}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}
