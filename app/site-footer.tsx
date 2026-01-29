"use client";

import { useLanguage, type Language } from "./locale-provider";

const FOOTER_COPY: Record<Language, string> = {
  it: "© {year} Sito Bar",
  en: "© {year} Bar website",
  fr: "© {year} Site du bar",
  de: "© {year} Bar-Website",
  es: "© {year} Sitio del bar",
};

export function SiteFooter() {
  const { lang } = useLanguage();
  const year = new Date().getFullYear();
  const text = FOOTER_COPY[lang].replace("{year}", String(year));

  return (
    <footer className="border-t border-neutral-200">
      <div className="mx-auto max-w-5xl px-6 py-6 text-sm text-neutral-500">
        {text}
      </div>
    </footer>
  );
}
