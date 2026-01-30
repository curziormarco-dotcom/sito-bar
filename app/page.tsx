"use client";

import Link from "next/link";
import { useLanguage, type Language } from "./locale-provider";
import { useEffect, useState } from "react";

const HIGHLIGHTS = [
  {
    title: {
      it: "Orari",
      en: "Hours",
      fr: "Horaires",
      de: "Öffnungszeiten",
      es: "Horario",
    },
    text: {
      it: "Lun–Sab: 6:00–21:30",
      en: "Mon–Sat: 6:00–21:30",
      fr: "Lun–Sam: 6:00–21:30",
      de: "Mo–Sa: 6:00–21:30",
      es: "Lun–Sáb: 6:00–21:30",
    },
  },
  {
    title: {
      it: "Venerdì aperitivo di pesce",
      en: "Friday seafood aperitivo",
      fr: "Vendredi apéritif de poisson",
      de: "Freitag Fisch‑Aperitif",
      es: "Viernes aperitivo de pescado",
    },
    text: {
      it: "Aperitivo con pesce",
      en: "Seafood aperitivo",
      fr: "Apéritif aux fruits de mer",
      de: "Aperitif mit Fisch",
      es: "Aperitivo con pescado",
    },
  },
];

const FRIDAY_ROTATION: Record<Language, string[]> = {
  it: [
    "Scampi crudi",
    "Ostriche",
    "Cocktail di gamberetti",
    "Capasante gratinate",
    "Tartare di tonno",
    "Carpaccio di piovra",
  ],
  en: [
    "Raw scampi",
    "Oysters",
    "Shrimp cocktail",
    "Gratinated scallops",
    "Tuna tartare",
    "Octopus carpaccio",
  ],
  fr: [
    "Scampis crus",
    "Huîtres",
    "Cocktail de crevettes",
    "Coquilles Saint‑Jacques gratinées",
    "Tartare de thon",
    "Carpaccio de poulpe",
  ],
  de: [
    "Rohe Scampi",
    "Austern",
    "Garnelencocktail",
    "Überbackene Jakobsmuscheln",
    "Thunfischtatar",
    "Oktopus‑Carpaccio",
  ],
  es: [
    "Cigalas crudas",
    "Ostras",
    "Cóctel de gambas",
    "Vieiras gratinadas",
    "Tartar de atún",
    "Carpaccio de pulpo",
  ],
};

const SIGNATURES: {
  name: Record<Language, string>;
  desc: Record<Language, string>;
  price: number;
}[] = [];

const HOME_COPY: Record<Language, Record<string, string>> = {
  it: {
    heroKicker: "BAR DA LUCIANO",
    heroTitle: "Bar a conduzione familiare,\nda oltre 40 anni.",
    heroSubtitle: "Dal 1984.",
    ctaMenu: "Scopri il menù",
    ctaBook: "Prenota",
    whereTitle: "Dove siamo",
    whereCta: "Apri su Google Maps",
    signatureTitle: "Signature",
    signatureSubtitle: "Tre proposte iconiche per iniziare.",
    seeAll: "Vedi tutto →",
    bookTitle: "Prenota",
    bookSubtitle: "Scrivici su WhatsApp o chiamaci per prenotare tavoli, feste di laurea e rinfreschi.",
    call: "Chiama",
    drinkAlt: "Aperitivo",
    fridayOnlyAlert: "Disponibile solo il venerdì.",
  },
  en: {
    heroKicker: "BAR DA LUCIANO",
    heroTitle: "Family‑run bar,\nfor over 40 years.",
    heroSubtitle: "Since 1984.",
    ctaMenu: "View the menu",
    ctaBook: "Book",
    whereTitle: "Find us",
    whereCta: "Open in Google Maps",
    signatureTitle: "Signature",
    signatureSubtitle: "Three iconic picks to start with.",
    seeAll: "See all →",
    bookTitle: "Book",
    bookSubtitle: "Message us on WhatsApp or call to book tables, graduation parties, and refreshments.",
    call: "Call",
    drinkAlt: "Aperitif",
    fridayOnlyAlert: "Available only on Fridays.",
  },
  fr: {
    heroKicker: "BAR DA LUCIANO",
    heroTitle: "Bar familial,\ndepuis plus de 40 ans.",
    heroSubtitle: "Depuis 1984.",
    ctaMenu: "Voir le menu",
    ctaBook: "Réserver",
    whereTitle: "Nous trouver",
    whereCta: "Ouvrir sur Google Maps",
    signatureTitle: "Signature",
    signatureSubtitle: "Trois incontournables pour commencer.",
    seeAll: "Voir tout →",
    bookTitle: "Réserver",
    bookSubtitle: "Écris‑nous sur WhatsApp ou appelle‑nous pour réserver des tables, des fêtes de remise de diplôme et des rafraîchissements.",
    call: "Appeler",
    drinkAlt: "Apéritif",
    fridayOnlyAlert: "Disponible uniquement le vendredi.",
  },
  de: {
    heroKicker: "BAR DA LUCIANO",
    heroTitle: "Familiengeführte Bar,\nseit über 40 Jahren.",
    heroSubtitle: "Seit 1984.",
    ctaMenu: "Menü ansehen",
    ctaBook: "Reservieren",
    whereTitle: "Hier sind wir",
    whereCta: "In Google Maps öffnen",
    signatureTitle: "Signature",
    signatureSubtitle: "Drei ikonische Vorschläge zum Start.",
    seeAll: "Alle ansehen →",
    bookTitle: "Reservieren",
    bookSubtitle: "Schreib uns auf WhatsApp oder ruf an, um Tische, Abschlussfeiern und Erfrischungen zu reservieren.",
    call: "Anrufen",
    drinkAlt: "Aperitif",
    fridayOnlyAlert: "Nur freitags verfügbar.",
  },
  es: {
    heroKicker: "BAR DA LUCIANO",
    heroTitle: "Bar familiar,\ndesde hace más de 40 años.",
    heroSubtitle: "Desde 1984.",
    ctaMenu: "Ver el menú",
    ctaBook: "Reservar",
    whereTitle: "Dónde estamos",
    whereCta: "Abrir en Google Maps",
    signatureTitle: "Signature",
    signatureSubtitle: "Tres propuestas icónicas para empezar.",
    seeAll: "Ver todo →",
    bookTitle: "Reservar",
    bookSubtitle: "Escríbenos por WhatsApp o llámanos para reservar mesas, fiestas de graduación y refrigerios.",
    call: "Llamar",
    drinkAlt: "Aperitivo",
    fridayOnlyAlert: "Disponible solo los viernes.",
  },
};

function formatEUR(value: number) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export default function HomePage() {
  const { lang } = useLanguage();
  const t = (key: string) => HOME_COPY[lang][key] ?? key;
  const [fridayIndex, setFridayIndex] = useState(0);
  const fridayMessages = FRIDAY_ROTATION[lang];
  const [showFridayNotice, setShowFridayNotice] = useState(false);
  const isFriday = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "Europe/Rome",
  }).format(new Date()) === "Fri";

  useEffect(() => {
    setFridayIndex(0);
    const timer = setInterval(() => {
      setFridayIndex((prev) => (prev + 1) % fridayMessages.length);
    }, 1500);
    return () => clearInterval(timer);
  }, [fridayMessages.length]);

  return (
    <main className="bg-[#fbfaf7] text-neutral-900">
      {showFridayNotice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
          onClick={() => setShowFridayNotice(false)}
        >
          <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-5 text-neutral-900 shadow-xl">
            <h3 className="text-base font-semibold">Info</h3>
            <p className="mt-2 text-sm text-neutral-600">
              {t("fridayOnlyAlert")}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowFridayNotice(false)}
                className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="mx-auto max-w-6xl px-6 py-14 sm:py-20 space-y-12">
        {/* HERO */}
        <section
          className="relative overflow-hidden rounded-[28px] min-h-[420px]"
          style={{
            backgroundImage: "url('/images/hero.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* overlay */}
          <div className="absolute inset-0 bg-black/20" />

          <div className="relative p-10 sm:p-14 text-white">
            <p className="text-xs tracking-[0.28em] text-white/85">
              {t("heroKicker")}
            </p>

            <h1 className="mt-4 text-4xl sm:text-6xl font-semibold leading-tight tracking-tight">
              {t("heroTitle").split("\n").map((line, index) => (
                <span key={`${line}-${index}`}>
                  {line}
                  {index === 0 && <br />}
                </span>
              ))}
            </h1>

            <p className="mt-6 max-w-2xl text-white/85 sm:text-lg">
              {t("heroSubtitle")}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/menu"
                className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-100 transition"
              >
                {t("ctaMenu")}
              </Link>

              <a
                href="#prenota"
                className="rounded-full border border-white/70 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
              >
                {t("ctaBook")}
              </a>
            </div>
          </div>
        </section>

        {/* HIGHLIGHTS + MAPPA */}
        <section className="grid gap-4 md:grid-cols-4 items-stretch">
          {/* riga in alto: orari + venerdì */}
          <div className="md:col-span-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 h-fit">
              <h3 className="text-xs tracking-[0.28em] text-neutral-500">
                {HIGHLIGHTS[0].title[lang].toUpperCase()}
              </h3>
              <p className="mt-3 text-sm text-neutral-700">{HIGHLIGHTS[0].text[lang]}</p>
            </div>

            <Link
              href="/menu#pesce"
              className="rounded-2xl border border-neutral-200 bg-white p-6 h-fit transition hover:bg-neutral-50"
              onClick={(event) => {
                if (!isFriday) {
                  event.preventDefault();
                  setShowFridayNotice(true);
                }
              }}
            >
              <h3 className="text-xs tracking-[0.28em] text-neutral-500">
                {HIGHLIGHTS[1].title[lang].toUpperCase()}
              </h3>
              <p className="mt-3 text-sm text-neutral-700">
                {fridayMessages[fridayIndex]}
              </p>
            </Link>
          </div>

          {/* card mappa: occupa 2 colonne su desktop */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 md:col-span-2 h-[280px] flex flex-col">
            <h3 className="text-lg font-semibold">{t("whereTitle")}</h3>

            <p className="mt-1 text-sm text-neutral-600">
              Bar Da Luciano<br />
              Via Nazareth 20, Padova
            </p>

            <a
              href="https://www.google.com/maps?q=Via%20Esempio%2012%2C%20Milano"
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-sm font-semibold text-neutral-900 underline"
            >
              {t("whereCta")}
            </a>

            <div className="mt-4 flex-1 overflow-hidden rounded-xl border border-neutral-200">
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2801.46097070022!2d11.89233677655568!3d45.40004323771666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x477edafcc00abb53%3A0x837057fcf720ca6!2sBar%20Da%20Luciano!5e0!3m2!1sit!2sit!4v1769651829333!5m2!1sit!2sit"
    width="100%"
    height="100%"
    loading="lazy"
    referrerPolicy="no-referrer"
    className="block h-full w-full"
  />
</div>
          </div>

          {/* riga in basso: immagine e mappa affiancate */}
          <div className="relative md:col-span-2 h-[280px] overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <Link
                href="/menu#aperitivi-alcolici"
                className="inline-flex rounded-full border border-white/20 bg-white/5 px-6 py-2 text-sm font-semibold text-white shadow-sm backdrop-blur-sm hover:bg-white/15"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(135deg, rgba(255,255,255,0.08) 0, rgba(255,255,255,0.08) 6px, rgba(255,255,255,0.03) 6px, rgba(255,255,255,0.03) 12px)",
                }}
              >
                Cocktail
              </Link>
            </div>
            <Link href="/menu#aperitivi-alcolici" className="block h-full w-full">
              <img
                src="/images/negroni.jpg"
                alt={t("drinkAlt")}
                className="h-full w-full object-cover object-[85%_90%] sm:object-[80%_82%]"
              />
            </Link>
          </div>
        </section>

        {SIGNATURES.length > 0 && (
          <section className="rounded-[28px] border border-neutral-200 bg-white p-10 sm:p-12">
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight">
                  {t("signatureTitle")}
                </h2>
                <p className="mt-2 text-neutral-600">
                  {t("signatureSubtitle")}
                </p>
              </div>
              <Link
                href="/menu"
                className="hidden sm:inline-flex rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold hover:bg-neutral-50 transition"
              >
                {t("seeAll")}
              </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {SIGNATURES.map((item) => (
                <div
                  key={item.name.it}
                  className="rounded-2xl border border-neutral-200 bg-[#fbfaf7] p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{item.name[lang]}</h3>
                      <p className="mt-2 text-sm text-neutral-600">
                        {item.desc[lang]}
                      </p>
                    </div>
                    <div className="font-semibold">{formatEUR(item.price)}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 sm:hidden">
              <Link
                href="/menu"
                className="inline-flex rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold hover:bg-neutral-50 transition"
              >
                {t("seeAll")}
              </Link>
            </div>
          </section>
        )}

        {/* PRENOTA */}
        <section
          id="prenota"
          className="rounded-[28px] border border-neutral-200 bg-white p-10 sm:p-12"
        >
          <h2 className="text-3xl font-semibold tracking-tight">{t("bookTitle")}</h2>
          <p className="mt-2 text-neutral-600">
            {t("bookSubtitle")}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="tel:+390000000000"
              className="rounded-full bg-neutral-900 px-7 py-3 text-sm font-semibold text-white hover:bg-neutral-800 transition"
            >
              {t("call")}
            </a>
            <a
              href="https://wa.me/390000000000"
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-neutral-300 px-7 py-3 text-sm font-semibold hover:bg-neutral-50 transition"
            >
              WhatsApp
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
