"use client";

import { useEffect, useState } from "react";
import { days, type OpeningHours } from "./content/opening-hours";
import type { Language } from "./menu/menu-types";

const COPY = {
  it: { closed: "Chiuso" },
  en: { closed: "Closed" },
  fr: { closed: "Fermé" },
  de: { closed: "Geschlossen" },
  es: { closed: "Cerrado" },
};

export default function OpeningHoursList({ schedule, lang }: { schedule: OpeningHours; lang: Language }) {
  const [today, setToday] = useState("");
  useEffect(() => {
    const update = () => setToday(new Intl.DateTimeFormat("en-US", {
      weekday: "long", timeZone: "Europe/Rome",
    }).format(new Date()).toLowerCase());
    update();
    const timer = window.setInterval(update, 60_000);
    window.addEventListener("focus", update);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", update);
    };
  }, []);

  const dayFormatter = new Intl.DateTimeFormat(lang, { weekday: "long", timeZone: "Europe/Rome" });
  return (
    <dl className="opening-hours-list">
      {days.map((day, index) => {
        const hours = schedule[day];
        const isToday = day === today;
        // 5 January 2026 is a Monday; use fixed dates only for translated day names.
        const label = dayFormatter.format(new Date(Date.UTC(2026, 0, 5 + index, 12)));
        return (
          <div key={day} className={`opening-hours-row${isToday ? " is-today" : ""}`} aria-current={isToday ? "date" : undefined}>
            <dt className="opening-hours-day">
              <span className="capitalize">{label}</span>
            </dt>
            <dd>{hours.closed ? COPY[lang].closed : `${hours.opens}–${hours.closes}`}</dd>
          </div>
        );
      })}
    </dl>
  );
}
