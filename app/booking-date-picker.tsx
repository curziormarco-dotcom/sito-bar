"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Language } from "./menu/menu-types";

const COPY = {
  it: ["Seleziona la data", "Calendario", "Chiudi", "Mese precedente", "Mese successivo", "Domenica: chiuso"],
  en: ["Select a date", "Calendar", "Close", "Previous month", "Next month", "Sunday: closed"],
  fr: ["Choisissez la date", "Calendrier", "Fermer", "Mois précédent", "Mois suivant", "Dimanche : fermé"],
  de: ["Datum auswählen", "Kalender", "Schließen", "Vorheriger Monat", "Nächster Monat", "Sonntag: geschlossen"],
  es: ["Selecciona la fecha", "Calendario", "Cerrar", "Mes anterior", "Mes siguiente", "Domingo: cerrado"],
};

export default function BookingDatePicker({ value, onChange, min, lang, labelId }: {
  value: string; onChange: (value: string) => void; min: string; lang: Language; labelId: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => min.slice(0, 7));
  const calendarId = useId();
  const copy = COPY[lang];
  const [year, monthNumber] = month.split("-").map(Number);
  const firstDay = new Date(Date.UTC(year, monthNumber - 1, 1, 12));
  const offset = (firstDay.getUTCDay() + 6) % 7;
  const count = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  const dateLabel = new Intl.DateTimeFormat(lang, { dateStyle: "full", timeZone: "UTC" });

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent | FocusEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", outside);
    };
  }, [open]);

  function showCalendar() {
    if (!open) {
      const [day, selectedMonth, selectedYear] = value.split("/");
      const candidate = day && selectedMonth && selectedYear ? `${selectedYear}-${selectedMonth}` : min.slice(0, 7);
      setMonth(candidate >= min.slice(0, 7) ? candidate : min.slice(0, 7));
    }
    setOpen(true);
  }
  function closeCalendar() {
    setOpen(false);
    input.current?.focus();
  }
  function moveMonth(delta: number) {
    const next = new Date(Date.UTC(year, monthNumber - 1 + delta, 1, 12));
    setMonth(`${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}`);
  }

  return (
    <div ref={root} className="booking-date-picker" role="group" aria-labelledby={labelId}
      onKeyDown={(event) => {
        if (event.key === "Escape") { closeCalendar(); event.stopPropagation(); }
      }}>
      <div className="booking-date-entry booking-date-select" onClick={showCalendar}>
        <input ref={input} type="text" name="bookingDate" value={value} required inputMode="none" onChange={() => {}} onInvalid={showCalendar}
          role="combobox" aria-autocomplete="none" aria-haspopup="dialog"
          aria-labelledby={labelId} aria-expanded={open} aria-controls={calendarId}
          placeholder={copy[0]} className="booking-date-display"
          onClick={showCalendar}
          onBeforeInput={(event) => event.preventDefault()}
          onKeyDown={(event) => {
            if (["Enter", " ", "ArrowDown"].includes(event.key)) { event.preventDefault(); showCalendar(); }
          }} />
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4m10-4v4M3 11h18" /></svg>
      </div>
      {open && <div id={calendarId} className="booking-calendar-panel" role="dialog" aria-label={copy[1]}>
        <div className="booking-calendar-month-header">
          <button type="button" disabled={month <= min.slice(0, 7)} aria-label={copy[3]} onClick={() => moveMonth(-1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m15 6-6 6 6 6" /></svg>
          </button>
          <strong aria-live="polite">{new Intl.DateTimeFormat(lang, { month: "long", year: "numeric", timeZone: "UTC" }).format(firstDay)}</strong>
          <button type="button" aria-label={copy[4]} onClick={() => moveMonth(1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
          </button>
        </div>
        <div className="booking-calendar-grid">
          {Array.from({ length: 7 }, (_, index) => <span className="booking-calendar-weekday" key={`weekday-${index}`}>{new Intl.DateTimeFormat(lang, { weekday: "short", timeZone: "UTC" }).format(new Date(Date.UTC(2026, 0, 5 + index, 12)))}</span>)}
          {Array.from({ length: offset }, (_, index) => <span key={`blank-${index}`} />)}
          {Array.from({ length: count }, (_, index) => {
            const day = String(index + 1).padStart(2, "0");
            const iso = `${month}-${day}`;
            const date = new Date(`${iso}T12:00:00Z`);
            const isSunday = date.getUTCDay() === 0;
            const formatted = `${day}/${String(monthNumber).padStart(2, "0")}/${year}`;
            return <button type="button" key={day} disabled={iso < min || isSunday}
              className={isSunday ? "booking-calendar-sunday" : undefined}
              aria-label={`${dateLabel.format(date)}${isSunday ? ` — ${copy[5]}` : ""}`} aria-pressed={value === formatted}
              onClick={() => { input.current?.setCustomValidity(""); onChange(formatted); closeCalendar(); }}>{index + 1}</button>;
          })}
        </div>
        <div className="booking-calendar-footer"><button type="button" onClick={closeCalendar}>{copy[2]}</button></div>
      </div>}
    </div>
  );
}
