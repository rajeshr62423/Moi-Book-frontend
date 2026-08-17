"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import SortFilterBar from "@/components/SortFilterBar";
import { useI18n, type TranslationKey } from "@/lib/i18n";
import { useHideAppLoaderOnMount, useModal } from "@/lib/ui";
import { useSortFilter } from "@/lib/useSortFilter";
import { events } from "@/lib/data";
import type { EventItem, EventStatus } from "@/lib/types";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EditIcon,
  EventsIcon,
  EyeIcon,
  PlusIcon,
} from "@/components/icons";

function statusLabel(status: EventStatus, t: (k: TranslationKey) => string) {
  if (status === "confirmed") return t("statusConfirmed");
  if (status === "planning") return t("statusPlanning");
  return t("statusSaveDate");
}

function formatEventDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export default function EventsPage() {
  useHideAppLoaderOnMount();
  const { t, months, weekdaysShort } = useI18n();
  const { openModal } = useModal();
  const [calendarView, setCalendarView] = useState(false);
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(7); // August 2026

  const filterGroups = useMemo(
    () => [
      {
        key: "status",
        label: "Status",
        getValue: (ev: EventItem) => ev.status,
        options: [
          { value: "confirmed", label: "Confirmed" },
          { value: "planning", label: "Planning" },
          { value: "savedate", label: "Save the Date" },
        ],
      },
    ],
    []
  );
  const sortOptions = useMemo(
    () => [
      { value: "date-upcoming", label: "Date: Upcoming", compare: (a: EventItem, b: EventItem) => a.date.localeCompare(b.date) },
      { value: "date-recent", label: "Date: Recent", compare: (a: EventItem, b: EventItem) => b.date.localeCompare(a.date) },
      { value: "name-az", label: "Name A–Z", compare: (a: EventItem, b: EventItem) => a.name.localeCompare(b.name) },
      { value: "name-za", label: "Name Z–A", compare: (a: EventItem, b: EventItem) => b.name.localeCompare(a.name) },
      { value: "guests-hl", label: "Guests: High → Low", compare: (a: EventItem, b: EventItem) => b.guests - a.guests },
      { value: "guests-lh", label: "Guests: Low → High", compare: (a: EventItem, b: EventItem) => a.guests - b.guests },
    ],
    []
  );

  const sf = useSortFilter<EventItem>(events, {
    searchFields: (ev) => `${ev.name} ${ev.location} ${ev.venue}`,
    filterGroups,
    sortOptions,
  });

  function goPrevMonth() {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else {
      setCalMonth((m) => m - 1);
    }
  }
  function goNextMonth() {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else {
      setCalMonth((m) => m + 1);
    }
  }

  const cells = useMemo(() => {
    const firstDay = new Date(calYear, calMonth, 1);
    const startOffset = firstDay.getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(calYear, calMonth, 0).getDate();
    const todayStr = new Date().toISOString().slice(0, 10);
    const list: { day: number; outside: boolean; dateStr: string; isToday: boolean }[] = [];
    for (let i = startOffset - 1; i >= 0; i--) {
      list.push({ day: daysInPrevMonth - i, outside: true, dateStr: "", isToday: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const mm = String(calMonth + 1).padStart(2, "0");
      const dd = String(d).padStart(2, "0");
      const dateStr = `${calYear}-${mm}-${dd}`;
      list.push({ day: d, outside: false, dateStr, isToday: dateStr === todayStr });
    }
    while (list.length % 7 !== 0) {
      list.push({ day: list.length - (startOffset + daysInMonth) + 1, outside: true, dateStr: "", isToday: false });
    }
    return list;
  }, [calYear, calMonth]);

  return (
    <>
      <PageHeader
        title={t("allEvents")}
        actions={
          <>
            <button className="btn outline small" onClick={() => setCalendarView((v) => !v)}>
              <EventsIcon />
              <span>{calendarView ? t("listView") : t("calendarView")}</span>
            </button>
            <button className="btn" onClick={() => openModal("createEvent")}>
              <PlusIcon /> <span>{t("createEvent")}</span>
            </button>
          </>
        }
      />

      {!calendarView && (
        <>
          <SortFilterBar state={sf} filterGroups={filterGroups} sortOptions={sortOptions} searchPlaceholder="Search events..." />
          <div className="glass" id="eventsListPanel">
            <table>
              <thead>
                <tr>
                  <th>{t("thEvent")}</th>
                  <th>{t("thDate")}</th>
                  <th>{t("thLocation")}</th>
                  <th>{t("thGuests")}</th>
                  <th>{t("thStatus")}</th>
                  <th>{t("thActions")}</th>
                </tr>
              </thead>
              <tbody>
                {sf.filtered.map((ev) => (
                  <tr key={ev.id}>
                    <td>
                      <span className="ev-thumb" style={{ backgroundImage: `url('${ev.image}')` }} />
                      <span className="ev-name">{ev.name}</span>
                      <div className="ev-sub">{ev.type}</div>
                    </td>
                    <td>
                      {formatEventDate(ev.date)}
                      <br />
                      <span className="ev-sub">
                        {ev.weekday}, {ev.time}
                      </span>
                    </td>
                    <td>
                      {ev.location}
                      <br />
                      <span className="ev-sub">{ev.venue}</span>
                    </td>
                    <td>{ev.guests}</td>
                    <td>
                      <span className={`badge ${ev.status}`}>{statusLabel(ev.status, t)}</span>
                    </td>
                    <td className="row-actions">
                      <button title="View">
                        <EyeIcon />
                      </button>
                      <button title="Edit">
                        <EditIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pager">
              <span>
                {t("showing")} {sf.filtered.length} {t("of")} {events.length} {t("eventsWord")}
              </span>
              <div className="nums">
                <span>&lt;</span>
                <span className="active">1</span>
                <span>&gt;</span>
              </div>
            </div>
          </div>
        </>
      )}

      {calendarView && (
        <div className="glass">
          <div className="cal-header">
            <button className="cal-nav" aria-label="Previous month" onClick={goPrevMonth}>
              <ChevronLeftIcon />
            </button>
            <h3 className="cal-month-label">
              {months[calMonth]} {calYear}
            </h3>
            <button className="cal-nav" aria-label="Next month" onClick={goNextMonth}>
              <ChevronRightIcon />
            </button>
          </div>
          <div className="cal-weekdays">
            {weekdaysShort.map((w) => (
              <div key={w}>{w}</div>
            ))}
          </div>
          <div className="cal-grid">
            {cells.map((cell, i) => (
              <div className={`cal-cell${cell.outside ? " outside" : ""}${cell.isToday ? " today" : ""}`} key={i}>
                <div className="cal-daynum">{cell.day}</div>
                {!cell.outside &&
                  events
                    .filter((ev) => ev.date === cell.dateStr)
                    .map((ev) => (
                      <div className={`cal-event ${ev.status}`} title={ev.name} key={ev.id}>
                        {ev.name}
                      </div>
                    ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
