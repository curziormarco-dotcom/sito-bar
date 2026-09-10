"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavLink } from "./nav-link";
import { LanguageSwitcher } from "./language-switcher";
import { useLanguage, type Language } from "./locale-provider";

const NAV_COPY: Record<Language, { home: string; menu: string; graduations: string; gallery: string }> = {
  it: { home: "Home", menu: "Menu", graduations: "Lauree", gallery: "Galleria" },
  en: { home: "Home", menu: "Menu", graduations: "Graduations", gallery: "Gallery" },
  fr: { home: "Accueil", menu: "Menu", graduations: "Diplômes", gallery: "Galerie" },
  de: { home: "Start", menu: "Menü", graduations: "Abschlüsse", gallery: "Galerie" },
  es: { home: "Inicio", menu: "Menú", graduations: "Graduaciones", gallery: "Galería" },
};

export function SiteHeader() {
  const { lang } = useLanguage();
  const pathname = usePathname();
  const labels = NAV_COPY[lang];
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/90 backdrop-blur transition-all duration-300">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-3 py-3 sm:flex-row sm:gap-2 sm:px-6 sm:py-4">
        <div className="inline-flex min-w-0 shrink-0 flex-col items-center">
          <Link
            href="/"
            className="inline-flex min-w-0 flex-col items-center text-neutral-900 transition hover:text-amber-600"
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
          {!isHome && (
            <Link
              href="/"
              className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-600 transition hover:text-amber-700"
            >
              {labels.home}
            </Link>
          )}
        </div>

        <nav className="flex w-full min-w-0 flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm sm:w-auto sm:flex-none sm:justify-end sm:gap-3 sm:text-base">
          <NavLink href="/menu" inverted={false}>
            {labels.menu}
          </NavLink>
          <NavLink href="/lauree" inverted={false}>
            {labels.graduations}
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
