"use client";

import { useState } from "react";
import { useLanguage, type Language } from "./locale-provider";

const LANGUAGES: { code: Language; label: string }[] = [
  { code: "it", label: "Italiano" },
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "es", label: "Español" },
];

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 12h18" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 3c3 3 3 15 0 18-3-3-3-15 0-18z" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <GlobeIcon />
        {lang.toUpperCase()}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-xl border border-neutral-200 bg-white p-2 shadow-xl">
          <ul role="listbox" className="space-y-1">
            {LANGUAGES.map((opt) => (
              <li key={opt.code}>
                <button
                  type="button"
                  onClick={() => {
                    setLang(opt.code);
                    setOpen(false);
                  }}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-neutral-100 ${
                    lang === opt.code ? "text-neutral-900" : "text-neutral-600"
                  }`}
                  role="option"
                  aria-selected={lang === opt.code}
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
