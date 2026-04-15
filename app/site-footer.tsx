"use client";

import Link from "next/link";
import { CookieSettingsButton } from "./cookie-consent";
import { useLanguage, type Language } from "./locale-provider";

const FOOTER_COPY: Record<Language, string> = {
  it: "© {year} Bar Da Luciano - P.IVA 03476210285",
  en: "© {year} Bar Da Luciano - VAT 03476210285",
  fr: "© {year} Bar Da Luciano - TVA 03476210285",
  de: "© {year} Bar Da Luciano - USt-IdNr. 03476210285",
  es: "© {year} Bar Da Luciano - IVA 03476210285",
};

const FOOTER_LINKS: Record<Language, { privacy: string; allergens: string }> = {
  it: { privacy: "Privacy", allergens: "Allergeni" },
  en: { privacy: "Privacy", allergens: "Allergens" },
  fr: { privacy: "Confidentialité", allergens: "Allergènes" },
  de: { privacy: "Datenschutz", allergens: "Allergene" },
  es: { privacy: "Privacidad", allergens: "Alérgenos" },
};

export function SiteFooter() {
  const { lang } = useLanguage();
  const year = new Date().getFullYear();
  const text = FOOTER_COPY[lang].replace("{year}", String(year));
  const links = FOOTER_LINKS[lang];

  return (
    <footer className="border-t border-neutral-200">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-6 text-sm text-neutral-500">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="inline-flex flex-col items-center self-start">
            <p className="text-[2.1rem] italic tracking-tight text-neutral-800 [font-family:'Bickham_Script_Pro','Snell_Roundhand','Apple_Chancery','URW_Chancery_L',cursive]">
              Bar da Luciano
            </p>
            <span className="mt-1 inline-flex items-center gap-2 text-[0.58rem] font-medium uppercase tracking-[0.22em] text-neutral-500">
              <span className="h-px w-12 bg-neutral-300" />
              <span>since 1984</span>
              <span className="h-px w-12 bg-neutral-300" />
            </span>
          </div>

          <div className="flex flex-col items-start gap-4 lg:items-end">
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-3 lg:justify-end">
              <Link
                href="/allergeni"
                className="text-neutral-600 transition hover:text-neutral-900"
              >
                {links.allergens}
              </Link>
              <Link
                href="/privacy"
                className="text-neutral-600 transition hover:text-neutral-900"
              >
                {links.privacy}
              </Link>
              <CookieSettingsButton />
            </div>

            <div className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-3 lg:justify-end">
              <a
                href="mailto:davide_patrizia@alice.it"
                className="inline-flex items-center gap-2 text-neutral-600 transition hover:text-neutral-900"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <rect
                    x="3.5"
                    y="6"
                    width="17"
                    height="12"
                    rx="2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M4.5 7l7.5 6 7.5-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                davide_patrizia@alice.it
              </a>

              <a
                href="tel:+390499813795"
                className="inline-flex items-center gap-2 text-neutral-600 transition hover:text-neutral-900"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path
                    d="M7.2 4.5h3l1.2 3.6-1.8 1.8a14.3 14.3 0 0 0 4.5 4.5l1.8-1.8 3.6 1.2v3c0 .8-.7 1.5-1.5 1.5C10.7 19.3 4.7 13.3 4.7 6c0-.8.7-1.5 1.5-1.5z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                049 981 3795
              </a>

              <a
                href="https://www.google.com/maps?q=via%20Nazareth%2020%2C%2035128%20Padova"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-neutral-600 transition hover:text-neutral-900"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path
                    d="M12 20s6-5.7 6-10a6 6 0 1 0-12 0c0 4.3 6 10 6 10z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="10"
                    r="2.3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>
                via Nazareth 20, 35128 Padova
              </a>

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
          </div>
        </div>

        <span>{text}</span>
      </div>
    </footer>
  );
}
