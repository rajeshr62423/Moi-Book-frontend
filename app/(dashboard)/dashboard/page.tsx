"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import { useAppLoader, useHideAppLoaderOnMount, useModal } from "@/lib/ui";
import MobileToggleButton from "@/components/MobileToggleButton";
import UserMenu from "@/components/UserMenu";
import { events, dashboardAttention, dashboardMoments } from "@/lib/data";
import {
  ArrowRightIcon,
  CelebrationIcon,
  ChecklistIcon,
  DocumentIcon,
  EventsIcon,
  FloralIcon,
  GuestsCheckIcon,
  GuestsIcon,
  LedgerIcon,
  LocationIcon,
  PlusIcon,
  SearchIcon,
  SeatingIcon,
  VendorsIcon,
  WalletIcon,
  BellIcon,
  CheckIcon,
} from "@/components/icons";

const ATTN_ICON = { guestsCheck: GuestsCheckIcon, ledger: LedgerIcon, document: DocumentIcon, seating: SeatingIcon } as const;
const MOMENT_ICON = { guests: GuestsIcon, bell: BellIcon, ledger: LedgerIcon, document: DocumentIcon, check: CheckIcon } as const;

const STAT_CARDS = [
  { icon: EventsIcon, bg: "var(--rose-bg)", color: "#C97A6A", value: "04", labelKey: "upcomingEvents" as const },
  { icon: GuestsIcon, bg: "var(--sage-bg)", color: "var(--sage)", value: "428", labelKey: "totalGuests" as const },
  { icon: WalletIcon, bg: "var(--amber-bg)", color: "var(--amber)", value: "₹1,24,500", labelKey: "pendingPayments" as const },
  { icon: VendorsIcon, bg: "var(--rose-bg)", color: "#C97A6A", value: "18", labelKey: "vendorsLabel" as const },
  { icon: ChecklistIcon, bg: "var(--sage-bg)", color: "var(--sage)", value: "07", labelKey: "tasksToday" as const },
];

const CELEBS = events.map((ev) => {
  const d = new Date(ev.date + "T00:00:00");
  return {
    ...ev,
    day: String(d.getDate()).padStart(2, "0"),
    month: d.toLocaleDateString("en-GB", { month: "short" }),
  };
});

export default function DashboardPage() {
  useHideAppLoaderOnMount();
  const { t } = useI18n();
  const { openModal } = useModal();
  const { show } = useAppLoader();
  const router = useRouter();

  function goToEvents() {
    show();
    router.push("/events");
  }

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && e.currentTarget.value.trim()) goToEvents();
  }

  return (
    <>
      <div className="topbar">
        <MobileToggleButton />
        <div className="greeting">
          <div className="eyebrow">{t("welcomeBack")}</div>
          <h1>{t("goodEvening")}</h1>
          <p>{t("mayEvery")}</p>
          <svg className="greeting-divider" viewBox="0 0 180 10" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M0 5h70M110 5h70" />
            <circle cx="90" cy="5" r="3" />
            <path d="M84 5l3-3 3 3-3 3Z" />
          </svg>
        </div>
        <div className="search-box glass">
          <SearchIcon />
          <input placeholder={t("searchDash")} onKeyDown={handleSearchKeyDown} />
        </div>
        <UserMenu />
      </div>

      <div className="dashboard-top">
        <div className="hero">
          <div className="hero-content">
            <div className="hero-eyebrow">✦ I Moi Book</div>
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
            {dashboardAttention.map((item, i) => {
              const Icon = ATTN_ICON[item.icon];
              return (
                <div className="attn-item" key={i}>
                  <div className="attn-ico">
                    <Icon />
                  </div>
                  <div>
                    <b>{t(item.titleKey)}</b>
                    <span>{t(item.subtitleKey)}</span>
                  </div>
                  <span className="attn-arrow">
                    <ArrowRightIcon />
                  </span>
                </div>
              );
            })}
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
        <div className="celeb-grid">
          {CELEBS.map((ev) => (
            <div className="celeb-card" key={ev.id}>
              <div className="celeb-img" style={{ backgroundImage: `url('${ev.image}')` }}>
                <div className="date-badge">
                  <div className="d">{ev.day}</div>
                  <div className="m">{ev.month}</div>
                </div>
              </div>
              <div className="celeb-body">
                <div className="celeb-name">{ev.name}</div>
                <div className="celeb-type">{t(ev.typeKey as TranslationKey)}</div>
                <div className="celeb-meta">
                  <LocationIcon />
                  {ev.location} · {ev.guests} Guests
                </div>
                <span className={`badge ${ev.status}`}>
                  <CheckIcon />
                  <span>{ev.status === "confirmed" ? t("statusConfirmed") : ev.status === "planning" ? t("statusPlanning") : t("statusSaveDate")}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="three-col">
        <div className="glass">
          <div className="section-head">
            <h3>
              Arjun &amp; Priya — <span>{t("journey")}</span>
            </h3>
            <span className="badge confirmed">
              <span>{t("pctReady")}</span>
            </span>
          </div>
          <div className="journey">
            <div className="journey-step">
              <div className="circ">
                <GuestsCheckIcon />
              </div>
              <span>{t("journeyGuests")}</span>
            </div>
            <div className="journey-step">
              <div className="circ">
                <VendorsIcon />
              </div>
              <span>{t("journeyVendors")}</span>
            </div>
            <div className="journey-step current">
              <div className="circ">
                <LedgerIcon />
              </div>
              <span>{t("journeyPayments")}</span>
            </div>
            <div className="journey-step pending">
              <div className="circ">
                <ChecklistIcon />
              </div>
              <span>{t("journeyTasks")}</span>
            </div>
            <div className="journey-step pending">
              <div className="circ">
                <CelebrationIcon />
              </div>
              <span>{t("journeyCelebration")}</span>
            </div>
          </div>
          <p className="journey-note">{t("journeyNote")}</p>
        </div>

        <div className="glass">
          <div className="section-head">
            <h3>{t("ledgerCardTitle")}</h3>
          </div>
          <div className="donut-wrap donut-wrap-stack">
            <div className="donut">
              <FloralIcon className="floral" />
            </div>
            <div className="ledger-figures">
              <div className="lf-row">
                <span>{t("budgetLegend")}</span>
                <b>₹8,50,000</b>
              </div>
              <div className="lf-row lf-paid">
                <span>{t("paidLegend")}</span>
                <b>₹5,72,000</b>
              </div>
              <div className="lf-row lf-remaining">
                <span>{t("remainingLegend")}</span>
                <b>₹2,78,000</b>
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
            {dashboardMoments.map((m, i) => {
              const Icon = MOMENT_ICON[m.icon];
              return (
                <div className="moment-row" key={i}>
                  <span className="tdot">
                    <Icon />
                  </span>
                  <div className="txt">
                    <span>{t(m.textKey)}</span>
                    <span className="time">{t(m.timeKey)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
