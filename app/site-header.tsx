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
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex flex-col items-start text-neutral-900 transition hover:text-amber-600"
        >
          <span className="text-[1.85rem] italic tracking-tight [font-family:'Bickham_Script_Pro','Snell_Roundhand','Apple_Chancery','URW_Chancery_L',cursive]">
            Bar da Luciano
          </span>
          <span className="mt-1 flex w-full items-center gap-2 text-[0.58rem] font-medium uppercase tracking-[0.22em] text-neutral-500">
            <span className="h-px flex-1 bg-neutral-300" />
            <span>since 1984</span>
            <span className="h-px flex-1 bg-neutral-300" />
          </span>
        </Link>

        <nav className="flex items-center gap-3">
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
