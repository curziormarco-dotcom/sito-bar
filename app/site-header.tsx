"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavLink } from "./nav-link";
import { LanguageSwitcher } from "./language-switcher";
import { useLanguage, type Language } from "./locale-provider";
import { useEffect, useState } from "react";

const NAV_COPY: Record<Language, { home: string; menu: string; gallery: string }> = {
  it: { home: "Home", menu: "Menu", gallery: "Galleria" },
  en: { home: "Home", menu: "Menu", gallery: "Gallery" },
  fr: { home: "Accueil", menu: "Menu", gallery: "Galerie" },
  de: { home: "Start", menu: "Menü", gallery: "Galerie" },
  es: { home: "Inicio", menu: "Menú", gallery: "Galería" },
};

export function SiteHeader() {
  const { lang } = useLanguage();
  const pathname = usePathname();
  const labels = NAV_COPY[lang];
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => {
      setIsScrolled(window.scrollY > 24);
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrollState);
    };
  }, []);

  const isHomeHeroState = pathname === "/" && !isScrolled;

  return (
    <header
      className={
        isHomeHeroState
          ? "sticky top-0 z-50 border-b border-white/10 bg-neutral-950/18 backdrop-blur-md transition-all duration-300"
          : "sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur transition-all duration-300"
      }
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className={
            isHomeHeroState
              ? "text-lg font-bold tracking-tight text-white transition hover:text-white/80"
              : "text-lg font-bold tracking-tight text-neutral-900 transition hover:text-amber-600"
          }
        >
          BAR DA LUCIANO
        </Link>

        <nav className="flex items-center gap-3">
          <NavLink href="/" inverted={isHomeHeroState}>
            {labels.home}
          </NavLink>
          <NavLink href="/menu" inverted={isHomeHeroState}>
            {labels.menu}
          </NavLink>
          <NavLink href="/galleria" inverted={isHomeHeroState}>
            {labels.gallery}
          </NavLink>
          <LanguageSwitcher inverted={isHomeHeroState} />
        </nav>
      </div>
    </header>
  );
}
