"use client";

import { useLanguage, type Language } from "./locale-provider";

const FOOTER_COPY: Record<Language, string> = {
  it: "© {year} Bar Da Luciano",
  en: "© {year} Bar Da Luciano",
  fr: "© {year} Bar Da Luciano",
  de: "© {year} Bar Da Luciano",
  es: "© {year} Bar Da Luciano",
};

export function SiteFooter() {
  const { lang } = useLanguage();
  const year = new Date().getFullYear();
  const text = FOOTER_COPY[lang].replace("{year}", String(year));

  return (
    <footer className="border-t border-neutral-200">
      <div className="mx-auto max-w-5xl px-6 py-6 text-sm text-neutral-500 flex flex-wrap items-center justify-between gap-4">
        <span>{text}</span>
        <a
          href="https://www.instagram.com/bar_da_luciano/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="igGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#feda75" />
                <stop offset="25%" stopColor="#fa7e1e" />
                <stop offset="50%" stopColor="#d62976" />
                <stop offset="75%" stopColor="#962fbf" />
                <stop offset="100%" stopColor="#4f5bd5" />
              </linearGradient>
            </defs>
            <rect
              x="4"
              y="4"
              width="16"
              height="16"
              rx="4"
              fill="none"
              stroke="url(#igGrad)"
              strokeWidth="1.6"
            />
            <circle
              cx="12"
              cy="12"
              r="3.5"
              fill="none"
              stroke="url(#igGrad)"
              strokeWidth="1.6"
            />
            <circle cx="17" cy="7" r="1" fill="url(#igGrad)" />
          </svg>
          Instagram
        </a>
      </div>
    </footer>
  );
}
