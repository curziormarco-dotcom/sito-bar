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
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/90 backdrop-blur transition-all duration-300">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="mr-3 inline-flex shrink-0 flex-col items-start text-neutral-900 transition hover:text-amber-600 sm:mr-0 sm:items-center"
        >
          <span className="whitespace-nowrap text-[1.65rem] italic leading-none tracking-tight sm:text-[1.85rem] [font-family:'Bickham_Script_Pro','Snell_Roundhand','Apple_Chancery','URW_Chancery_L',cursive]">
            Bar da Luciano
          </span>
          <span className="mt-1 inline-flex items-center gap-1.5 text-[0.52rem] font-medium uppercase tracking-[0.18em] text-neutral-500 sm:gap-2 sm:text-[0.58rem] sm:tracking-[0.22em]">
            <span className="h-px w-7 bg-neutral-300 sm:w-8" />
            <span className="whitespace-nowrap">since 1984</span>
            <span className="h-px w-7 bg-neutral-300 sm:w-8" />
          </span>
        </Link>

        <nav className="flex flex-1 items-center justify-end gap-2 sm:flex-none sm:gap-3">
          <NavLink href="/" inverted={false}>
            {labels.home}
          </NavLink>
          <NavLink href="/menu" inverted={false}>
            {labels.menu}
          </NavLink>
          <NavLink href="/galleria" inverted={false}>
            {labels.gallery}
          </NavLink>
          <LanguageSwitcher inverted={false} />
        </nav>
      </div>
    </header>
  );
}
