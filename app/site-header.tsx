"use client";

import { SHARED_COPY } from "./shared-copy";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { NavLink } from "./nav-link";
import { LanguageSwitcher } from "./language-switcher";
import { useLanguage, type Language } from "./locale-provider";

const NAV_COPY: Record<Language, { home: string; menu: string; graduations: string; gallery: string; contacts: string }> = {
  it: { home: "Home", menu: "Menù", graduations: "Lauree", gallery: "Galleria", contacts: "Contatti" },
  en: { home: "Home", menu: "Menu", graduations: "Graduations", gallery: "Gallery", contacts: "Contact" },
  fr: { home: "Accueil", menu: "Menu", graduations: "Fêtes de fin d’études", gallery: "Galerie", contacts: "Contact" },
  de: { home: "Start", menu: "Speisekarte", graduations: "Abschlüsse", gallery: "Galerie", contacts: "Kontakt" },
  es: { home: "Inicio", menu: "Menú", graduations: "Graduaciones", gallery: "Galería", contacts: "Contacto" },
};

function MenuArrow() {
  return <svg className="home-navigation-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 19 19 5M7 5h12v12" /></svg>;
}

export function SiteHeader() {
  const { lang } = useLanguage();
  const pathname = usePathname();
  const labels = NAV_COPY[lang];
  const isHome = pathname === "/";
  const usesEditorialHeader = ["/", "/menu", "/lauree", "/galleria"].includes(pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
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
    {usesEditorialHeader && <header className="home-header" onKeyDown={(event) => {
      if (event.key === "Escape") { setMenuOpen(false); menuButtonRef.current?.focus(); }
    }}>
      <div className="home-header-inner">
        <Link href="/" aria-label={`Bar da Luciano — ${labels.home}`} className="flex flex-col items-center gap-1">
          <span className="whitespace-nowrap text-[1.65rem] italic leading-none tracking-tight sm:text-[1.85rem] [font-family:'Bickham_Script_Pro','Snell_Roundhand','Apple_Chancery','URW_Chancery_L',cursive]">Bar da Luciano</span>
          <span className="mt-1 inline-flex items-center gap-2 text-[0.5rem] font-medium uppercase tracking-[0.22em] text-neutral-500 sm:text-[0.58rem]">
            <span className="h-px w-6 bg-neutral-300" />
            <span>{SHARED_COPY[lang].since}</span>
            <span className="h-px w-6 bg-neutral-300" />
          </span>
        </Link>
        <p className="home-header-location home-desktop-location"><span>Via Nazareth, 20</span><span>{SHARED_COPY[lang].city} · {SHARED_COPY[lang].country}</span></p>
        <div className="home-header-actions">
        <Link href="/menu" className="home-header-menu-link">{labels.menu}</Link>
        <button ref={menuButtonRef} type="button" aria-label={menuOpen ? SHARED_COPY[lang].closeNavigation : SHARED_COPY[lang].openNavigation} aria-expanded={menuOpen} aria-controls="home-navigation" onClick={() => setMenuOpen(!menuOpen)} className="flex h-12 w-12 flex-col items-end justify-center gap-[6px] p-2 text-neutral-900 focus-visible:outline-2 focus-visible:outline-neutral-900">
          <span className={`h-px w-7 bg-current transition-transform ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`h-px w-5 bg-current transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`h-px w-7 bg-current transition-transform ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
        </div>
      </div>
      <nav id="home-navigation" hidden={!menuOpen} aria-label={SHARED_COPY[lang].navigation} className="home-navigation">
        <div className="home-navigation-inner" onClick={(event) => { if ((event.target as HTMLElement).closest("a")) setMenuOpen(false); }}>
          {!isHome && <NavLink href="/" className="font-serif">{labels.home}<MenuArrow /></NavLink>}
          <NavLink href="/menu" className="font-serif text-2xl">{labels.menu}<MenuArrow /></NavLink>
          <NavLink href="/lauree" className="font-serif text-2xl">{labels.graduations}<MenuArrow /></NavLink>
          <NavLink href="/galleria" className="font-serif text-2xl">{labels.gallery}<MenuArrow /></NavLink>
          <NavLink href="/#prenota" className="font-serif">{labels.contacts}<MenuArrow /></NavLink>
          <LanguageSwitcher inline />
        </div>
      </nav>
    </header>}
    {!usesEditorialHeader && <>
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
              <span className="whitespace-nowrap">{SHARED_COPY[lang].since}</span>
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
    </>}
    </>
  );
}
