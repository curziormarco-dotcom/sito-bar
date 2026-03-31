"use client";

import Link from "next/link";
import Image from "next/image";
import { Cormorant_Garamond } from "next/font/google";
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
      it: "Lun–Sab: 6:00–21:30",
      en: "Mon–Sat: 6:00–21:30",
      fr: "Lun–Sam: 6:00–21:30",
      de: "Mo–Sa: 6:00–21:30",
      es: "Lun–Sáb: 6:00–21:30",
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
      it: "• colazioni • pranzi • aperitivi • feste di laurea • rinfreschi",
      en: "• breakfasts • lunches • aperitifs • graduation parties • refreshments",
      fr: "• petits‑déjeuners • déjeuners • apéritifs • fêtes de remise de diplôme • rafraîchissements",
      de: "• frühstück • mittagessen • aperitifs • abschlussfeiern • erfrischungen",
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
    heroSubtitle: "Ogni giorno, dal caffè all’aperitivo. Dal 1984.",
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
    leaveReviewTitle: "Lascia una recensione",
    leaveReviewSubtitle: "Racconta la tua esperienza su Google.",
    leaveReviewCta: "Apri recensioni",
  },
  en: {
    heroKicker: "BAR DA LUCIANO",
    heroTitle: "Family‑run bar,\nfor over 40 years.",
    heroSubtitle: "Every day, from morning coffee to aperitivo. Since 1984.",
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
    leaveReviewTitle: "Leave a review",
    leaveReviewSubtitle: "Share your experience on Google.",
    leaveReviewCta: "Open reviews",
  },
  fr: {
    heroKicker: "BAR DA LUCIANO",
    heroTitle: "Bar familial,\ndepuis plus de 40 ans.",
    heroSubtitle: "Chaque jour, du café du matin à l’apéritif. Depuis 1984.",
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
    leaveReviewTitle: "Laisser un avis",
    leaveReviewSubtitle: "Partage ton expérience sur Google.",
    leaveReviewCta: "Ouvrir les avis",
  },
  de: {
    heroKicker: "BAR DA LUCIANO",
    heroTitle: "Familiengeführte Bar,\nseit über 40 Jahren.",
    heroSubtitle: "Jeden Tag, vom Morgenkaffee bis zum Aperitif. Seit 1984.",
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
    leaveReviewTitle: "Bewertung hinterlassen",
    leaveReviewSubtitle: "Teile deine Erfahrung auf Google.",
    leaveReviewCta: "Bewertungen öffnen",
  },
  es: {
    heroKicker: "BAR DA LUCIANO",
    heroTitle: "Bar familiar,\ndesde hace más de 40 años.",
    heroSubtitle: "Cada día, del café de la mañana al aperitivo. Desde 1984.",
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
    leaveReviewTitle: "Deja una reseña",
    leaveReviewSubtitle: "Comparte tu experiencia en Google.",
    leaveReviewCta: "Abrir reseñas",
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
  const [heroProgress, setHeroProgress] = useState(0);
  const fridayMessages = FRIDAY_ROTATION[lang];

  useEffect(() => {
    const timer = setInterval(() => {
      setFridayIndex((prev) => (prev + 1) % fridayMessages.length);
    }, 1500);
    return () => clearInterval(timer);
  }, [fridayMessages.length]);

  useEffect(() => {
    const updateHeroProgress = () => {
      const viewportHeight = window.innerHeight || 1;
      const progress = Math.min(window.scrollY / (viewportHeight * 0.9), 1);
      setHeroProgress(progress);
    };

    updateHeroProgress();
    window.addEventListener("scroll", updateHeroProgress, { passive: true });
    window.addEventListener("resize", updateHeroProgress);

    return () => {
      window.removeEventListener("scroll", updateHeroProgress);
      window.removeEventListener("resize", updateHeroProgress);
    };
  }, []);

  const heroImageScale = 1.12 - heroProgress * 0.12;
  const heroImageOpacity = 1 - heroProgress * 0.28;
  const heroContentOpacity = 1 - heroProgress * 0.34;
  const heroContentTranslate = heroProgress * 36;

  return (
    <div className="bg-[#fbfaf7] text-neutral-900">
      <section className="relative left-1/2 right-1/2 -mx-[50vw] -mt-10 h-[165svh] w-screen bg-neutral-950">
        <div className="sticky top-[4.5rem] flex min-h-[calc(100svh-4.5rem)] items-end overflow-hidden sm:top-[5rem] sm:min-h-[calc(100svh-5rem)]">
          <Image
            src="/images/hero.jpg"
            alt=""
            fill
            priority
            className="object-cover object-center will-change-transform"
            sizes="100vw"
            style={{
              transform: `scale(${heroImageScale})`,
              opacity: heroImageOpacity,
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12)_0%,rgba(0,0,0,0.2)_34%,rgba(0,0,0,0.6)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,rgba(251,250,247,0)_0%,rgba(251,250,247,0.88)_100%)]" />

          <div
            className="relative z-10 mx-auto flex w-full max-w-6xl px-6 pb-14 will-change-transform sm:pb-20"
            style={{
              opacity: heroContentOpacity,
              transform: `translateY(${heroContentTranslate}px)`,
            }}
          >
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

              <div className="mt-8 flex flex-wrap items-center gap-3 pl-1 sm:mt-10">
                <Link
                  href="/menu"
                  className="inline-flex min-h-12 items-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-neutral-900 shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition hover:bg-neutral-100"
                >
                  {t("ctaMenu")}
                </Link>

                <a
                  href="#prenota"
                  className="inline-flex min-h-12 items-center rounded-full border border-white/22 bg-white/10 px-7 py-3 text-sm font-semibold text-white backdrop-blur-md transition hover:border-white/30 hover:bg-white/16"
                >
                  {t("ctaBook")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-[42svh] max-w-6xl rounded-t-[32px] bg-[#fbfaf7] px-6 pt-6 pb-14 shadow-[0_-24px_60px_rgba(17,17,17,0.08)] sm:-mt-[46svh] sm:pt-8 sm:pb-20">
        <section className="flex flex-col gap-6 md:grid md:grid-cols-4 md:items-stretch md:gap-6">
          {/* riga in alto: orari + info + venerdì */}
          <div className="md:col-span-4 grid gap-6 md:grid-cols-3">
            <div className="h-fit rounded-[24px] border border-neutral-200/80 bg-white/90 p-7 shadow-[0_10px_30px_rgba(17,17,17,0.04)] backdrop-blur">
              <h3 className="text-[0.7rem] font-medium tracking-[0.28em] text-neutral-500">
                {HIGHLIGHTS[0].title[lang].toUpperCase()}
              </h3>
              <p className="mt-4 text-[1.05rem] leading-7 text-neutral-800">
                {HIGHLIGHTS[0].text[lang]}
              </p>
            </div>

            <div className="h-fit rounded-[24px] border border-neutral-200/80 bg-white/90 p-7 shadow-[0_10px_30px_rgba(17,17,17,0.04)] backdrop-blur">
              <h3 className="text-[0.7rem] font-medium tracking-[0.28em] text-neutral-500">
                {HIGHLIGHTS[1].title[lang].toUpperCase()}
              </h3>
              <p className="mt-4 text-[1.05rem] leading-7 text-neutral-800">
                {HIGHLIGHTS[1].text[lang]}
              </p>
            </div>

            <Link
              href="/menu#pesce"
              className="h-fit rounded-[24px] border border-neutral-200/80 bg-white/90 p-7 shadow-[0_10px_30px_rgba(17,17,17,0.04)] transition hover:-translate-y-0.5 hover:bg-white"
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
          <div className="flex h-[320px] flex-col rounded-[28px] border border-neutral-200/80 bg-white p-7 shadow-[0_14px_36px_rgba(17,17,17,0.05)] md:col-span-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.7rem] font-medium tracking-[0.28em] text-neutral-500">
                  MAP
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight">{t("whereTitle")}</h3>
              </div>
              <a
                href="https://www.google.com/maps?q=Via%20Esempio%2012%2C%20Milano"
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50"
              >
                {t("whereCta")}
              </a>
            </div>

            <p className="mt-3 text-sm leading-6 text-neutral-600">
              Bar Da Luciano<br />
              Via Nazareth 20, Padova
            </p>

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
          <div className="relative h-[320px] overflow-hidden rounded-[28px] border border-neutral-200/70 bg-white shadow-[0_14px_36px_rgba(17,17,17,0.05)] md:col-span-2">
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <Link
                href="/menu#aperitivi-alcolici"
                className="inline-flex rounded-full border border-white/20 bg-white/10 px-6 py-2 text-sm font-semibold text-white shadow-sm backdrop-blur-sm transition hover:bg-white/18"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(135deg, rgba(255,255,255,0.08) 0, rgba(255,255,255,0.08) 6px, rgba(255,255,255,0.03) 6px, rgba(255,255,255,0.03) 12px)",
                }}
              >
                Cocktail
              </Link>
            </div>
            <div className="absolute inset-x-0 top-0 z-10 p-7">
              <p className="text-[0.7rem] font-medium tracking-[0.28em] text-white/70">
                SIGNATURE
              </p>
              <p className="mt-3 max-w-xs text-2xl font-semibold tracking-tight text-white">
                Aperitivi, cocktail e il momento migliore della giornata.
              </p>
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

        <section className="rounded-[28px] border border-neutral-200 bg-white px-6 py-8 sm:px-10 sm:py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
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
          className="mt-8 rounded-[28px] border border-neutral-200 bg-white px-6 py-8 sm:px-10 sm:py-10"
        >
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight">{t("bookTitle")}</h2>
            <p className="mt-3 text-neutral-600">
              {t("bookSubtitle")}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="tel:+390000000000"
              className="inline-flex rounded-full bg-neutral-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              {t("call")}
            </a>
            <a
              href="https://wa.me/390000000000"
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-full border border-neutral-300 px-7 py-3 text-sm font-semibold transition hover:bg-neutral-50"
            >
              WhatsApp
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
