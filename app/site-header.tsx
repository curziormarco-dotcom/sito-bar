"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { NavLink } from "./nav-link";
import { LanguageSwitcher } from "./language-switcher";
import { useLanguage, type Language } from "./locale-provider";

const NAV_COPY: Record<Language, { home: string; menu: string; graduations: string; gallery: string }> = {
  it: { home: "Home", menu: "Menù", graduations: "Lauree", gallery: "Galleria" },
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
  const headerRef = useRef<HTMLElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const header = headerRef.current;
    const spacer = spacerRef.current;
    if (!header || !spacer) return;
    const updateHeight = () => {
      spacer.style.height = `${header.getBoundingClientRect().height}px`;
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(header);
    return () => observer.disconnect();
  }, [pathname, lang]);

  return (
    <>
    <div ref={spacerRef} aria-hidden="true" className="h-16 sm:h-28" />
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50 w-full border-b border-neutral-200 bg-white/90 backdrop-blur transition-all duration-300">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-2 py-3 sm:gap-2 sm:px-6 sm:py-5">
        <div className="inline-flex min-w-0 shrink-0 flex-col items-center">
          <Link
            href="/"
            className="inline-flex min-w-0 flex-col items-center text-neutral-900 transition hover:text-amber-600"
          >
            <span className="whitespace-nowrap text-[1.08rem] italic leading-none tracking-tight min-[380px]:text-[1.28rem] sm:text-[1.85rem] [font-family:'Bickham_Script_Pro','Snell_Roundhand','Apple_Chancery','URW_Chancery_L',cursive]">
              Bar da Luciano
            </span>
            <span className="mt-0.5 inline-flex self-center items-center gap-1 text-[0.42rem] font-medium uppercase tracking-[0.11em] text-neutral-500 min-[380px]:text-[0.46rem] sm:mt-1 sm:gap-2 sm:text-[0.58rem] sm:tracking-[0.22em]">
              <span className="h-px w-4 bg-neutral-300 min-[380px]:w-5 sm:w-8" />
              <span className="whitespace-nowrap">since 1984</span>
              <span className="h-px w-4 bg-neutral-300 min-[380px]:w-5 sm:w-8" />
            </span>
          </Link>
          {!isHome && (
            <Link
              href="/"
              className="mt-0.5 text-[0.52rem] font-semibold uppercase leading-none tracking-[0.14em] text-amber-600 transition hover:text-amber-700 sm:mt-1 sm:text-xs sm:tracking-[0.18em]"
            >
              {labels.home}
            </Link>
          )}
        </div>

        <nav className="flex min-w-0 flex-1 flex-nowrap items-center justify-end gap-2 text-xs min-[380px]:text-[0.8125rem] sm:flex-none sm:gap-4 sm:text-[1.0625rem]">
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
    </>
  );
}
