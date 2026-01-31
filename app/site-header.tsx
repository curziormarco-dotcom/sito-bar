"use client";

import Link from "next/link";
import { NavLink } from "./nav-link";
import { LanguageSwitcher } from "./language-switcher";
import { useLanguage, type Language } from "./locale-provider";

const NAV_COPY: Record<Language, { home: string; menu: string; gallery: string }> = {
  it: { home: "Home", menu: "Menu", gallery: "Galleria" },
  en: { home: "Home", menu: "Menu", gallery: "Gallery" },
  fr: { home: "Accueil", menu: "Menu", gallery: "Galerie" },
  de: { home: "Start", menu: "Menü", gallery: "Galerie" },
  es: { home: "Inicio", menu: "Menú", gallery: "Galería" },
};

export function SiteHeader() {
  const { lang } = useLanguage();
  const labels = NAV_COPY[lang];

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="font-bold text-lg tracking-tight text-neutral-900 hover:text-amber-600 transition"
        >
          BAR DA LUCIANO
        </Link>

        <nav className="flex items-center gap-3">
          <NavLink href="/">{labels.home}</NavLink>
          <NavLink href="/menu">{labels.menu}</NavLink>
          <NavLink href="/galleria">{labels.gallery}</NavLink>
          <LanguageSwitcher />
        </nav>
      </div>
    </header>
  );
}
