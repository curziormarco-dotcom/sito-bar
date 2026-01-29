"use client";

import Link from "next/link";
import { NavLink } from "./nav-link";
import { LanguageSwitcher } from "./language-switcher";
import { useLanguage, type Language } from "./locale-provider";

const NAV_COPY: Record<Language, { home: string; menu: string }> = {
  it: { home: "Home", menu: "Menu" },
  en: { home: "Home", menu: "Menu" },
  fr: { home: "Accueil", menu: "Menu" },
  de: { home: "Start", menu: "Menü" },
  es: { home: "Inicio", menu: "Menú" },
};

export function SiteHeader() {
  const { lang } = useLanguage();
  const labels = NAV_COPY[lang];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/70 backdrop-blur">
      <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-bold text-lg tracking-tight hover:text-amber-400 transition"
        >
          BAR DA LUCIANO
        </Link>

        <nav className="flex items-center gap-3">
          <NavLink href="/">{labels.home}</NavLink>
          <NavLink href="/menu">{labels.menu}</NavLink>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
