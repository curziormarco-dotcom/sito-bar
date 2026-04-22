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
    <header className="sticky top-0 z-50 w-full overflow-x-clip border-b border-neutral-200 bg-white/90 backdrop-blur transition-all duration-300">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-3 py-4 sm:px-6">
        <Link
          href="/"
          className="inline-flex min-w-0 shrink-0 flex-col items-start text-neutral-900 transition hover:text-amber-600 sm:items-center"
        >
          <span className="whitespace-nowrap text-[1.45rem] italic leading-none tracking-tight min-[380px]:text-[1.65rem] sm:text-[1.85rem] [font-family:'Bickham_Script_Pro','Snell_Roundhand','Apple_Chancery','URW_Chancery_L',cursive]">
            Bar da Luciano
          </span>
          <span className="mt-1 inline-flex self-center items-center gap-1 text-[0.48rem] font-medium uppercase tracking-[0.14em] text-neutral-500 min-[380px]:text-[0.52rem] sm:gap-2 sm:text-[0.58rem] sm:tracking-[0.22em]">
            <span className="h-px w-5 bg-neutral-300 min-[380px]:w-7 sm:w-8" />
            <span className="whitespace-nowrap">since 1984</span>
            <span className="h-px w-5 bg-neutral-300 min-[380px]:w-7 sm:w-8" />
          </span>
        </Link>

        <nav className="flex min-w-0 flex-1 items-center justify-end gap-2 text-sm sm:flex-none sm:gap-3 sm:text-base">
          <NavLink href="/" inverted={false} className="hidden min-[390px]:inline">
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
