"use client";

import Link from "next/link";
import Image from "next/image";
import { Cormorant_Garamond } from "next/font/google";
import { useCookieConsent } from "./cookie-consent";
import { useLanguage, type Language } from "./locale-provider";
import { useEffect, useState } from "react";

const heroSerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
});

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
      it: "Lun. 6:00–21:30\nMar. 6:00–21:30\nMer. 6:00–21:30\nGio. 6:00–21:30\nVen. 6:00–22:00\nSab. 6:30–21:30\nDom. chiuso",
      en: "Mon. 6:00–21:30\nTue. 6:00–21:30\nWed. 6:00–21:30\nThu. 6:00–21:30\nFri. 6:00–22:00\nSat. 6:30–21:30\nSun. closed",
      fr: "Lun. 6:00–21:30\nMar. 6:00–21:30\nMer. 6:00–21:30\nJeu. 6:00–21:30\nVen. 6:00–22:00\nSam. 6:30–21:30\nDim. fermé",
      de: "Mo. 6:00–21:30\nDi. 6:00–21:30\nMi. 6:00–21:30\nDo. 6:00–21:30\nFr. 6:00–22:00\nSa. 6:30–21:30\nSo. geschlossen",
      es: "Lun. 6:00–21:30\nMar. 6:00–21:30\nMié. 6:00–21:30\nJue. 6:00–21:30\nVie. 6:00–22:00\nSáb. 6:30–21:30\nDom. cerrado",
    },
  },
  {
    title: {
      it: "Le nostre proposte",
      en: "Our offerings",
      fr: "Nos propositions",
      de: "Unsere Angebote",
      es: "Nuestras propuestas",
    },
    text: {
      it: "• colazioni • pranzi • aperitivi\n• feste di laurea • rinfreschi",
      en: "• breakfasts • lunches • aperitifs • graduation parties • refreshments",
      fr: "• petits‑déjeuners • déjeuners • apéritifs • fêtes de remise de diplôme • rafraîchissements",
      de: "• Frühstück • Mittagessen • Aperitifs • Abschlussfeiern • Erfrischungen",
      es: "• desayunos • almuerzos • aperitivos • fiestas de graduación • refrigerios",
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

function splitLines(text: string) {
  return text.split("\n").filter(Boolean);
}

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
    heroTitle: "Bar a conduzione familiare,\nda oltre 40 anni a Padova.",
    heroSubtitle: "Ogni giorno, dal caffè all’aperitivo. Dal 1984.",
    ctaMenu: "Scopri il menù",
    ctaBook: "Contattaci",
    whereTitle: "Dove siamo",
    whereCta: "Apri su Google Maps",
    signatureTitle: "Signature",
    signatureSubtitle: "Tre proposte iconiche per iniziare.",
    seeAll: "Vedi tutto →",
    bookTitle: "Contattaci",
    bookSubtitle: "Chiamaci per prenotare tavoli, feste di laurea e rinfreschi.",
    call: "Chiama",
    drinkAlt: "Aperitivo",
    cocktailCta: "Cocktail",
    cocktailTitle: "I nostri cocktail e aperitivi",
    fridayOnlyAlert: "Disponibile solo il venerdì.",
    leaveReviewTitle: "Lascia una recensione",
    leaveReviewSubtitle: "Racconta la tua esperienza su Google.",
    leaveReviewCta: "Apri recensioni",
    mapConsentTitle: "Mappa Google Maps",
    mapConsentText: "Per vedere la mappa accetta i cookie e i servizi Google Maps.",
    mapConsentCta: "Accetta e mostra mappa",
  },
  en: {
    heroKicker: "BAR DA LUCIANO",
    heroTitle: "Family‑run bar,\nfor over 40 years in Padua.",
    heroSubtitle: "Every day, from morning coffee to aperitivo. Since 1984.",
    ctaMenu: "View the menu",
    ctaBook: "Contact us",
    whereTitle: "Find us",
    whereCta: "Open in Google Maps",
    signatureTitle: "Signature",
    signatureSubtitle: "Three iconic picks to start with.",
    seeAll: "See all →",
    bookTitle: "Contact us",
    bookSubtitle: "Call us to book tables, graduation parties, and refreshments.",
    call: "Call",
    drinkAlt: "Aperitif",
    cocktailCta: "Cocktails",
    cocktailTitle: "Our cocktails and aperitifs",
    fridayOnlyAlert: "Available only on Fridays.",
    leaveReviewTitle: "Leave a review",
    leaveReviewSubtitle: "Share your experience on Google.",
    leaveReviewCta: "Open reviews",
    mapConsentTitle: "Google Maps map",
    mapConsentText: "Accept cookies and Google Maps services to view the map.",
    mapConsentCta: "Accept and show map",
  },
  fr: {
    heroKicker: "BAR DA LUCIANO",
    heroTitle: "Bar familial,\ndepuis plus de 40 ans à Padoue.",
    heroSubtitle: "Chaque jour, du café du matin à l’apéritif. Depuis 1984.",
    ctaMenu: "Voir le menu",
    ctaBook: "Contactez-nous",
    whereTitle: "Nous trouver",
    whereCta: "Ouvrir sur Google Maps",
    signatureTitle: "Signature",
    signatureSubtitle: "Trois incontournables pour commencer.",
    seeAll: "Voir tout →",
    bookTitle: "Contactez-nous",
    bookSubtitle: "Appelez‑nous pour réserver des tables, des fêtes de remise de diplôme et des rafraîchissements.",
    call: "Appeler",
    drinkAlt: "Apéritif",
    cocktailCta: "Cocktails",
    cocktailTitle: "Nos cocktails et apéritifs",
    fridayOnlyAlert: "Disponible uniquement le vendredi.",
    leaveReviewTitle: "Laisser un avis",
    leaveReviewSubtitle: "Partage ton expérience sur Google.",
    leaveReviewCta: "Ouvrir les avis",
    mapConsentTitle: "Carte Google Maps",
    mapConsentText: "Acceptez les cookies et les services Google Maps pour voir la carte.",
    mapConsentCta: "Accepter et afficher la carte",
  },
  de: {
    heroKicker: "BAR DA LUCIANO",
    heroTitle: "Familiengeführte Bar,\nseit über 40 Jahren in Padua.",
    heroSubtitle: "Jeden Tag, vom Morgenkaffee bis zum Aperitif. Seit 1984.",
    ctaMenu: "Menü ansehen",
    ctaBook: "Kontaktiere uns",
    whereTitle: "Hier sind wir",
    whereCta: "In Google Maps öffnen",
    signatureTitle: "Signature",
    signatureSubtitle: "Drei ikonische Vorschläge zum Start.",
    seeAll: "Alle ansehen →",
    bookTitle: "Kontaktiere uns",
    bookSubtitle: "Ruf uns an, um Tische, Abschlussfeiern und Erfrischungen zu reservieren.",
    call: "Anrufen",
    drinkAlt: "Aperitif",
    cocktailCta: "Cocktails",
    cocktailTitle: "Unsere Cocktails und Aperitifs",
    fridayOnlyAlert: "Nur freitags verfügbar.",
    leaveReviewTitle: "Bewertung hinterlassen",
    leaveReviewSubtitle: "Teile deine Erfahrung auf Google.",
    leaveReviewCta: "Bewertungen öffnen",
    mapConsentTitle: "Google Maps Karte",
    mapConsentText: "Akzeptiere Cookies und Google Maps Dienste, um die Karte zu sehen.",
    mapConsentCta: "Akzeptieren und Karte anzeigen",
  },
  es: {
    heroKicker: "BAR DA LUCIANO",
    heroTitle: "Bar familiar,\ndesde hace más de 40 años en Padua.",
    heroSubtitle: "Cada día, del café de la mañana al aperitivo. Desde 1984.",
    ctaMenu: "Ver el menú",
    ctaBook: "Contáctanos",
    whereTitle: "Dónde estamos",
    whereCta: "Abrir en Google Maps",
    signatureTitle: "Signature",
    signatureSubtitle: "Tres propuestas icónicas para empezar.",
    seeAll: "Ver todo →",
    bookTitle: "Contáctanos",
    bookSubtitle: "Llámanos para reservar mesas, fiestas de graduación y refrigerios.",
    call: "Llamar",
    drinkAlt: "Aperitivo",
    cocktailCta: "Cocteles",
    cocktailTitle: "Nuestros cocteles y aperitivos",
    fridayOnlyAlert: "Disponible solo los viernes.",
    leaveReviewTitle: "Deja una reseña",
    leaveReviewSubtitle: "Comparte tu experiencia en Google.",
    leaveReviewCta: "Abrir reseñas",
    mapConsentTitle: "Mapa de Google Maps",
    mapConsentText: "Acepta las cookies y los servicios de Google Maps para ver el mapa.",
    mapConsentCta: "Aceptar y mostrar mapa",
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
  const { consent, accept } = useCookieConsent();
  const t = (key: string) => HOME_COPY[lang][key] ?? key;
  const [fridayIndex, setFridayIndex] = useState(0);
  const fridayMessages = FRIDAY_ROTATION[lang];

  useEffect(() => {
    const timer = setInterval(() => {
      setFridayIndex((prev) => (prev + 1) % fridayMessages.length);
    }, 1500);
    return () => clearInterval(timer);
  }, [fridayMessages.length]);

  return (
    <div className="bg-[#fbfaf7] text-neutral-900">
      <section className="relative flex min-h-[calc(92svh-4.5rem)] w-full items-end overflow-hidden bg-neutral-950 sm:min-h-[calc(94svh-5rem)]">
        <div className="absolute inset-0">
          <Image
            src="/images/hero.jpg"
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12)_0%,rgba(0,0,0,0.2)_34%,rgba(0,0,0,0.6)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,rgba(251,250,247,0)_0%,rgba(251,250,247,0.88)_100%)]" />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl px-4 pb-14 sm:px-6 sm:pb-20">
          <div className="max-w-[40rem] text-white sm:max-w-[44rem]">
            <div className="flex items-center gap-3 pl-1">
              <span className="h-px w-10 bg-white/35" />
              <p className="text-[0.68rem] font-medium tracking-[0.36em] text-white/68 sm:text-xs">
                {t("heroKicker")}
              </p>
            </div>

            <h1
              className={`${heroSerif.className} mt-5 max-w-[11ch] text-[3.6rem] font-semibold leading-[0.88] tracking-[-0.04em] text-white [text-shadow:0_10px_28px_rgba(0,0,0,0.24)] text-balance sm:mt-6 sm:text-[5rem] md:text-[5.95rem]`}
            >
              {t("heroTitle").split("\n").map((line, index) => (
                <span
                  key={`${line}-${index}`}
                  className={index === 1 ? "inline-block pl-[0.02em] text-white/96" : "inline-block"}
                >
                  {line}
                  {index === 0 && <br />}
                </span>
              ))}
            </h1>

            <p className="mt-5 max-w-md pl-1 text-sm leading-6 text-white/76 sm:mt-6 sm:text-lg sm:leading-7">
              {t("heroSubtitle")}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-2 pl-1 sm:mt-10 sm:gap-3">
              <Link
                href="/menu"
                className="inline-flex min-h-10 items-center whitespace-nowrap rounded-full bg-white px-4 py-2 text-xs font-semibold text-neutral-900 shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition hover:bg-neutral-100 sm:min-h-12 sm:px-7 sm:py-3 sm:text-sm"
              >
                {t("ctaMenu")}
              </Link>

              <a
                href="#prenota"
                className="inline-flex min-h-10 items-center whitespace-nowrap rounded-full border border-white/22 bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md transition hover:border-white/30 hover:bg-white/16 sm:min-h-11 sm:px-6 sm:text-sm"
              >
                {t("ctaBook")}
              </a>

              <a
                href="https://www.instagram.com/bar_da_luciano/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-10 items-center whitespace-nowrap rounded-full border border-white/22 bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur-md transition hover:border-white/30 hover:bg-white/16 sm:min-h-11 sm:px-6 sm:text-sm"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
        <section className="flex flex-col gap-6 md:grid md:grid-cols-4 md:items-stretch md:gap-6">
          {/* riga in alto: orari + info + venerdì */}
          <div className="md:col-span-4 grid gap-6 md:grid-cols-3">
            <div className="h-fit rounded-[24px] border border-neutral-200/80 bg-white/90 p-7 text-center shadow-[0_10px_30px_rgba(17,17,17,0.04)] backdrop-blur md:text-left">
              <h3 className="text-[0.7rem] font-medium tracking-[0.28em] text-neutral-500">
                {HIGHLIGHTS[0].title[lang].toUpperCase()}
              </h3>
              <div className="mx-auto mt-4 grid max-w-[18rem] grid-cols-2 gap-x-5 gap-y-1.5 text-center text-[0.9rem] leading-6 text-neutral-800 sm:text-[0.98rem] sm:leading-7 md:mx-0 md:text-left">
                {splitLines(HIGHLIGHTS[0].text[lang]).map((line) => (
                  <p key={line} className="whitespace-nowrap">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            <div className="h-fit rounded-[24px] border border-neutral-200/80 bg-white/90 p-7 text-center shadow-[0_10px_30px_rgba(17,17,17,0.04)] backdrop-blur md:text-left">
              <h3 className="text-[0.7rem] font-medium tracking-[0.28em] text-neutral-500">
                {HIGHLIGHTS[1].title[lang].toUpperCase()}
              </h3>
              <p className="mt-4 whitespace-pre-line text-[1.05rem] leading-7 text-neutral-800">
                {HIGHLIGHTS[1].text[lang]}
              </p>
            </div>

            <Link
              href="/menu#pesce"
              className="h-fit rounded-[24px] border border-neutral-200/80 bg-white/90 p-7 text-center shadow-[0_10px_30px_rgba(17,17,17,0.04)] transition hover:-translate-y-0.5 hover:bg-white md:text-left"
            >
              <h3 className="text-[0.7rem] font-medium tracking-[0.28em] text-neutral-500">
                {HIGHLIGHTS[2].title[lang].toUpperCase()}
              </h3>
              <p className="mt-4 text-[1.05rem] leading-7 text-neutral-800">
                {fridayMessages[fridayIndex]}
              </p>
            </Link>
          </div>

          {/* card mappa: occupa 2 colonne su desktop */}
          <div className="flex h-[320px] flex-col rounded-[28px] border border-neutral-200/80 bg-white p-7 text-center shadow-[0_14px_36px_rgba(17,17,17,0.05)] md:col-span-2 md:text-left">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <p className="text-[0.7rem] font-medium tracking-[0.28em] text-neutral-500">
                  MAP
                </p>
                <h3 className="mt-3 whitespace-nowrap text-2xl font-semibold tracking-tight">
                  {t("whereTitle")}
                </h3>
              </div>
              <a
                href="https://www.google.com/maps?q=via%20Nazareth%2020%2C%2035128%20Padova"
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50"
              >
                {t("whereCta")}
              </a>
            </div>

            <p className="mt-3 text-sm leading-6 text-neutral-600">
              Bar Da Luciano<br />
              via Nazareth 20, 35128 Padova
            </p>

            <div className="mt-4 flex-1 overflow-hidden rounded-xl border border-neutral-200">
              {consent === "accepted" ? (
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2801.46097070022!2d11.89233677655568!3d45.40004323771666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x477edafcc00abb53%3A0x837057fcf720ca6!2sBar%20Da%20Luciano!5e0!3m2!1sit!2sit!4v1769651829333!5m2!1sit!2sit"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="block h-full w-full"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center bg-neutral-100 px-5 text-center">
                  <p className="text-sm font-semibold text-neutral-900">
                    {t("mapConsentTitle")}
                  </p>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-600">
                    {t("mapConsentText")}
                  </p>
                  <button
                    type="button"
                    onClick={accept}
                    className="mt-4 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
                  >
                    {t("mapConsentCta")}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* riga in basso: immagine e mappa affiancate */}
          <div className="relative h-[320px] overflow-hidden rounded-[28px] border border-neutral-200/70 bg-white shadow-[0_14px_36px_rgba(17,17,17,0.05)] md:col-span-2">
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col items-center gap-4 px-6 pt-5 text-center sm:gap-5 sm:px-8 sm:pt-7">
              <p className="max-w-sm text-center text-[1.7rem] font-semibold tracking-tight text-white sm:text-3xl">
                {t("cocktailTitle")}
              </p>
              <Link
                href="/menu#aperitivi-alcolici"
                aria-label={t("cocktailTitle")}
                className="pointer-events-auto inline-flex rounded-full border border-white/12 bg-white/5 px-6 py-2 text-sm font-semibold text-white shadow-sm backdrop-blur-sm transition hover:border-white/18 hover:bg-white/10"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 6px, rgba(255,255,255,0.015) 6px, rgba(255,255,255,0.015) 12px)",
                }}
              >
                {t("cocktailCta")}
              </Link>
            </div>
            <Link href="/menu#aperitivi-alcolici" className="block h-full w-full">
              <Image
                src="/images/negroni.jpg"
                alt={t("drinkAlt")}
                width={1200}
                height={800}
                className="h-full w-full object-cover object-[85%_90%] sm:object-[80%_82%]"
              />
            </Link>
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.38)_0%,rgba(0,0,0,0.14)_40%,rgba(0,0,0,0.48)_100%)]" />
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

        <section className="mt-8 rounded-[28px] border border-neutral-200 bg-white px-6 py-8 text-center sm:px-10 sm:py-10 sm:text-left">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-semibold tracking-tight">
                {t("leaveReviewTitle")}
              </h2>
              <p className="mt-3 text-neutral-600">
                {t("leaveReviewSubtitle")}
              </p>
            </div>
            <a
              href="https://www.google.com/search?client=safari&hs=FPz9&sca_esv=074920bdea4960d4&rls=en&si=AL3DRZHrmvnFAVQPOO2Bzhf8AX9KZZ6raUI_dT7DG_z0kV2_xztH0BMykLPYJ2yUKG24IswJDdqjMpbJsR6pZofdiNDCebTRuBkcKRCunEOQyf_gcLSItw9QjEmHthYUk5XMsr1zNmOf&q=Bar+Da+Luciano+Recensioni&sa=X&ved=2ahUKEwiAlZbHxM2SAxWXhP0HHUv-A6kQ0bkNegQIHxAH&biw=960&bih=933&dpr=1"
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-fit shrink-0 rounded-full border border-neutral-300 px-6 py-3 text-sm font-semibold transition hover:bg-neutral-50"
            >
              {t("leaveReviewCta")}
            </a>
          </div>
        </section>

        {/* PRENOTA */}
        <section
          id="prenota"
          className="mt-8 rounded-[28px] border border-neutral-200 bg-white px-6 py-8 text-center sm:px-10 sm:py-10 sm:text-left"
        >
          <div className="mx-auto max-w-2xl sm:mx-0">
            <h2 className="text-3xl font-semibold tracking-tight">{t("bookTitle")}</h2>
            <p className="mt-3 text-neutral-600">
              {t("bookSubtitle")}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3 sm:justify-start">
            <a
              href="tel:+390499813795"
              className="inline-flex rounded-full bg-neutral-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              {t("call")}
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
