"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Language } from "./menu/menu-types";

const COPY = {
  it: ["Giorno", "Mese", "Anno", "Calendario", "Chiudi", "Mese precedente", "Mese successivo"],
  en: ["Day", "Month", "Year", "Calendar", "Close", "Previous month", "Next month"],
  fr: ["Jour", "Mois", "Année", "Calendrier", "Fermer", "Mois précédent", "Mois suivant"],
  de: ["Tag", "Monat", "Jahr", "Kalender", "Schließen", "Vorheriger Monat", "Nächster Monat"],
  es: ["Día", "Mes", "Año", "Calendario", "Cerrar", "Mes anterior", "Mes siguiente"],
};

export default function BookingDatePicker({ value, onChange, min, lang, labelId }: {
  value: string; onChange: (value: string) => void; min: string; lang: Language; labelId: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => min.slice(0, 7));
  const calendarId = useId();
  const parts = value.split("/");
  const copy = COPY[lang];
  const [year, monthNumber] = month.split("-").map(Number);
  const firstDay = new Date(Date.UTC(year, monthNumber - 1, 1, 12));
  const offset = (firstDay.getUTCDay() + 6) % 7;
  const count = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  const dateLabel = new Intl.DateTimeFormat(lang, { dateStyle: "full", timeZone: "UTC" });

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const focusOutside = (event: FocusEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", focusOutside);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", focusOutside);
    };
  }, [open]);

  function showCalendar() {
    const candidate = `${parts[2]}-${parts[1]?.padStart(2, "0")}`;
    if (/^\d{4}-(0[1-9]|1[0-2])$/.test(candidate) && candidate >= min.slice(0, 7)) setMonth(candidate);
    setOpen(true);
  }


  return (
    <div ref={root} className="booking-date-picker" role="group" aria-labelledby={labelId}
      onKeyDown={(event) => { if (event.key === "Escape") { setOpen(false); event.stopPropagation(); } }}>
      <div className="booking-date-entry">
        {[2, 2, 4].map((length, index) => (
          <span className="booking-date-part" key={index}>
            {index > 0 && <span className="booking-date-slash" aria-hidden="true">/</span>}
            <input
              ref={(node) => { inputs.current[index] = node; }}
              required type="text" inputMode="numeric" autoComplete="off"
              name={index === 0 ? "bookingDate" : undefined}
              aria-label={copy[index]} placeholder={index === 2 ? "aaaa" : index === 0 ? "gg" : "mm"}
              maxLength={length} pattern={`[0-9]{${index === 2 ? 4 : "1,2"}}`}
              value={parts[index] ?? ""}
              onFocus={showCalendar}
              onChange={(event) => {
                const raw = event.target.value;
                if (!/^\d*$/.test(raw) || raw.length > length) return;
                const next = [parts[0] ?? "", parts[1] ?? "", parts[2] ?? ""];
                next[index] = raw;
                inputs.current[0]?.setCustomValidity("");
                onChange(next.join("/"));
                if (raw.length === length && index < 2) { inputs.current[index + 1]?.focus(); inputs.current[index + 1]?.select(); }
              }}
              onKeyDown={(event) => {
                if ((event.key === "/" || event.key === "ArrowRight") && index < 2) { event.preventDefault(); inputs.current[index + 1]?.focus(); }
                if (event.key === "Backspace" && !parts[index] && index > 0) inputs.current[index - 1]?.focus();
              }}
            />
          </span>
        ))}
        <button ref={trigger} type="button" className="booking-calendar-toggle" aria-label={copy[3]} aria-expanded={open} aria-controls={calendarId}
          onClick={() => { if (open) setOpen(false); else showCalendar(); }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4m10-4v4M3 11h18" /></svg>
        </button>
      </div>
      {open && <div id={calendarId} className="booking-calendar-panel" role="region" aria-label={copy[3]}>
        <div className="booking-calendar-header">
          <strong aria-live="polite">{new Intl.DateTimeFormat(lang, { month: "long", year: "numeric", timeZone: "UTC" }).format(firstDay)}</strong>
          <button type="button" onClick={() => { setOpen(false); trigger.current?.focus(); }}>{copy[4]}</button>
        </div>
        <div className="booking-calendar-months">
          <select aria-label={copy[1]} value={monthNumber} onChange={(event) => setMonth(`${year}-${event.target.value.padStart(2, "0")}`)}>
            {Array.from({ length: 12 }, (_, index) => <option key={index} value={index + 1} disabled={`${year}-${String(index + 1).padStart(2, "0")}` < min.slice(0, 7)}>{new Intl.DateTimeFormat(lang, { month: "long", timeZone: "UTC" }).format(new Date(Date.UTC(year, index, 1, 12)))}</option>)}
          </select>
          <select aria-label={copy[2]} value={year} onChange={(event) => {
            const candidate = `${event.target.value}-${String(monthNumber).padStart(2, "0")}`;
            setMonth(candidate < min.slice(0, 7) ? min.slice(0, 7) : candidate);
          }}>
            {Array.from({ length: Math.max(6, year - Number(min.slice(0, 4)) + 1) }, (_, index) => Number(min.slice(0, 4)) + index).map(option => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
        <div className="booking-calendar-grid">
          {Array.from({ length: 7 }, (_, index) => <span className="booking-calendar-weekday" key={`weekday-${index}`}>{new Intl.DateTimeFormat(lang, { weekday: "short", timeZone: "UTC" }).format(new Date(Date.UTC(2026, 0, 5 + index, 12)))}</span>)}
          {Array.from({ length: offset }, (_, index) => <span key={`blank-${index}`} />)}
          {Array.from({ length: count }, (_, index) => {
            const day = String(index + 1).padStart(2, "0");
            const iso = `${month}-${day}`;
            const selected = parts[0]?.padStart(2, "0") === day && parts[1]?.padStart(2, "0") === String(monthNumber).padStart(2, "0") && parts[2] === String(year);
            return <button type="button" key={day} disabled={iso < min} aria-label={dateLabel.format(new Date(`${iso}T12:00:00Z`))} aria-pressed={selected}
              onClick={() => { inputs.current[0]?.setCustomValidity(""); onChange(`${day}/${String(monthNumber).padStart(2, "0")}/${year}`); setOpen(false); trigger.current?.focus(); }}>{index + 1}</button>;
          })}
        </div>
      </div>}
    </div>
  );
}
