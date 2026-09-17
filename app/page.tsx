"use client";

import Link from "next/link";
import Image from "next/image";
import { Cormorant_Garamond } from "next/font/google";
import { useCookieConsent } from "./cookie-consent";
import { useLanguage, type Language } from "./locale-provider";

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
      it: "Lun.–Gio. 6:00–21:30\nVen. 6:00–22:00\nSab. 6:30–21:30\nDom. chiuso",
      en: "Mon.–Thu. 6:00–21:30\nFri. 6:00–22:00\nSat. 6:30–21:30\nSun. closed",
      fr: "Lun.–Jeu. 6:00–21:30\nVen. 6:00–22:00\nSam. 6:30–21:30\nDim. fermé",
      de: "Mo.–Do. 6:00–21:30\nFr. 6:00–22:00\nSa. 6:30–21:30\nSo. geschlossen",
      es: "Lun.–Jue. 6:00–21:30\nVie. 6:00–22:00\nSáb. 6:30–21:30\nDom. cerrado",
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

const HOME_COPY: Record<Language, Record<string, string>> = {
  it: {
    heroKicker: "BAR DA LUCIANO",
    heroTitle: "Bar a conduzione familiare,\nda oltre 40 anni a Padova.",
    heroSubtitle: "Ogni giorno, dal caffè all’aperitivo. Dal 1984.",
    ctaMenu: "Scopri il menù",
    ctaBook: "Prenota",
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
    graduationTitle: "Festeggia la tua laurea da Luciano",
    graduationText:
      "Organizziamo feste di laurea e rinfreschi personalizzati a Padova.\nScegli la formula più adatta alla tua festa, dal semplice aperitivo al rinfresco completo.",
    graduationCta: "Scopri le nostre proposte →",
    mapConsentTitle: "Mappa Google Maps",
    mapConsentText: "Per vedere la mappa accetta i cookie e i servizi Google Maps.",
    mapConsentCta: "Accetta e mostra mappa",
    dayTitle: "Dalla prima colazione all’ultimo brindisi.",
    breakfastTitle: "Colazione",
    breakfastText: "Caffè, cappuccino e qualcosa di dolce per cominciare la giornata.",
    lunchTitle: "Pranzo",
    lunchText: "Una pausa con le nostre proposte di gastronomia e le specialità in vetrina.",
    aperitivoTitle: "Aperitivo",
    aperitivoText: "Cocktail, cicchetti e il piacere di stare insieme.",
    fridayTitle: "Il venerdì ha un altro sapore.",
    fridayText: "Scampi, ostriche, tartare e cicchetti di pesce: scopri le proposte per il tuo aperitivo del venerdì.",
    fridayCta: "Scopri le proposte di pesce",
    graduationAlt: "La veranda preparata per una festa di laurea",
    fishAlt: "La nostra vetrina di pesce",
    eventsLabel: "Lauree e rinfreschi",
  },
  en: {
    heroKicker: "BAR DA LUCIANO",
    heroTitle: "Family‑run bar,\nfor over 40 years in Padua.",
    heroSubtitle: "Every day, from morning coffee to aperitivo. Since 1984.",
    ctaMenu: "View the menu",
    ctaBook: "Book a table",
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
    graduationTitle: "Celebrate your graduation at Luciano",
    graduationText:
      "We organize graduation parties and personalized refreshments in Padua.\nChoose the best option for your celebration, from a simple aperitivo to a full buffet.",
    graduationCta: "Discover our options →",
    mapConsentTitle: "Google Maps map",
    mapConsentText: "Accept cookies and Google Maps services to view the map.",
    mapConsentCta: "Accept and show map",
    dayTitle: "From morning coffee to the last toast.",
    breakfastTitle: "Breakfast",
    breakfastText: "Coffee, cappuccino and something sweet to start the day.",
    lunchTitle: "Lunch",
    lunchText: "Take a break with our deli dishes and the specials in our display counter.",
    aperitivoTitle: "Aperitivo",
    aperitivoText: "Cocktails, cicchetti and good company.",
    fridayTitle: "A different flavour on Fridays.",
    fridayText: "Scampi, oysters, tartare and seafood cicchetti: discover our Friday aperitivo selection.",
    fridayCta: "Explore the seafood menu",
    graduationAlt: "The veranda prepared for a graduation party",
    fishAlt: "Our seafood display",
    eventsLabel: "Graduations and celebrations",
  },
  fr: {
    heroKicker: "BAR DA LUCIANO",
    heroTitle: "Bar familial,\ndepuis plus de 40 ans à Padoue.",
    heroSubtitle: "Chaque jour, du café du matin à l’apéritif. Depuis 1984.",
    ctaMenu: "Voir le menu",
    ctaBook: "Réserver",
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
    graduationTitle: "Fêtez votre diplôme chez Luciano",
    graduationText:
      "Nous organisons des fêtes de diplôme et des rafraîchissements personnalisés à Padoue.\nChoisissez la formule la plus adaptée à votre fête, du simple apéritif au buffet complet.",
    graduationCta: "Découvrez nos propositions →",
    mapConsentTitle: "Carte Google Maps",
    mapConsentText: "Acceptez les cookies et les services Google Maps pour voir la carte.",
    mapConsentCta: "Accepter et afficher la carte",
    dayTitle: "Du premier café au dernier toast.",
    breakfastTitle: "Petit-déjeuner",
    breakfastText: "Café, cappuccino et une douceur pour commencer la journée.",
    lunchTitle: "Déjeuner",
    lunchText: "Une pause avec nos plats de traiteur et les spécialités en vitrine.",
    aperitivoTitle: "Apéritif",
    aperitivoText: "Cocktails, cicchetti et le plaisir de se retrouver.",
    fridayTitle: "Le vendredi a une autre saveur.",
    fridayText: "Langoustines, huîtres, tartares et cicchetti de poisson : découvrez nos propositions pour l’apéritif du vendredi.",
    fridayCta: "Découvrir les propositions de poisson",
    graduationAlt: "La véranda préparée pour une fête de diplôme",
    fishAlt: "Notre vitrine de poisson",
    eventsLabel: "Diplômes et réceptions",
  },
  de: {
    heroKicker: "BAR DA LUCIANO",
    heroTitle: "Familiengeführte Bar,\nseit über 40 Jahren in Padua.",
    heroSubtitle: "Jeden Tag, vom Morgenkaffee bis zum Aperitif. Seit 1984.",
    ctaMenu: "Menü ansehen",
    ctaBook: "Reservieren",
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
    graduationTitle: "Feiere deinen Abschluss bei Luciano",
    graduationText:
      "Wir organisieren Abschlussfeiern und individuelle Erfrischungen in Padua.\nWähle die passende Lösung für deine Feier, vom einfachen Aperitif bis zum kompletten Buffet.",
    graduationCta: "Unsere Vorschläge entdecken →",
    mapConsentTitle: "Google Maps Karte",
    mapConsentText: "Akzeptiere Cookies und Google Maps Dienste, um die Karte zu sehen.",
    mapConsentCta: "Akzeptieren und Karte anzeigen",
    dayTitle: "Vom ersten Kaffee bis zum letzten Anstoßen.",
    breakfastTitle: "Frühstück",
    breakfastText: "Kaffee, Cappuccino und etwas Süßes zum Start in den Tag.",
    lunchTitle: "Mittagessen",
    lunchText: "Eine Pause mit unseren Feinkostgerichten und Spezialitäten aus der Vitrine.",
    aperitivoTitle: "Aperitif",
    aperitivoText: "Cocktails, Cicchetti und gemeinsame Zeit.",
    fridayTitle: "Freitags schmeckt es anders.",
    fridayText: "Scampi, Austern, Tatar und Fisch-Cicchetti: Entdecke unser Angebot zum Aperitif am Freitag.",
    fridayCta: "Fischangebot entdecken",
    graduationAlt: "Die Veranda, vorbereitet für eine Abschlussfeier",
    fishAlt: "Unsere Fischvitrine",
    eventsLabel: "Abschlussfeiern und Buffets",
  },
  es: {
    heroKicker: "BAR DA LUCIANO",
    heroTitle: "Bar familiar,\ndesde hace más de 40 años en Padua.",
    heroSubtitle: "Cada día, del café de la mañana al aperitivo. Desde 1984.",
    ctaMenu: "Ver el menú",
    ctaBook: "Reservar",
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
    graduationTitle: "Celebra tu graduación en Luciano",
    graduationText:
      "Organizamos fiestas de graduación y refrigerios personalizados en Padua.\nElige la fórmula más adecuada para tu fiesta, desde un aperitivo sencillo hasta un buffet completo.",
    graduationCta: "Descubre nuestras propuestas →",
    mapConsentTitle: "Mapa de Google Maps",
    mapConsentText: "Acepta las cookies y los servicios de Google Maps para ver el mapa.",
    mapConsentCta: "Aceptar y mostrar mapa",
    dayTitle: "Del primer café al último brindis.",
    breakfastTitle: "Desayuno",
    breakfastText: "Café, capuchino y algo dulce para empezar el día.",
    lunchTitle: "Almuerzo",
    lunchText: "Una pausa con nuestros platos preparados y las especialidades de la vitrina.",
    aperitivoTitle: "Aperitivo",
    aperitivoText: "Cócteles, cicchetti y el placer de estar juntos.",
    fridayTitle: "El viernes tiene otro sabor.",
    fridayText: "Cigalas, ostras, tartar y cicchetti de pescado: descubre nuestras propuestas para el aperitivo del viernes.",
    fridayCta: "Descubre las propuestas de pescado",
    graduationAlt: "La terraza preparada para una fiesta de graduación",
    fishAlt: "Nuestra vitrina de pescado",
    eventsLabel: "Graduaciones y celebraciones",
  },
};

function LinkArrow({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-5 w-5 shrink-0 ${className}`}
    >
      <path d="M6 18 18 6M6 6h12v12" />
    </svg>
  );
}

export default function HomePage() {
  const { lang } = useLanguage();
  const { consent, accept } = useCookieConsent();
  const t = (key: string) => HOME_COPY[lang][key] ?? key;
  const heading = `${heroSerif.className} text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl`;
  const textLink = "inline-flex min-h-11 items-center gap-3 border-b border-amber-800/40 py-2 text-base font-semibold text-amber-900 transition hover:border-amber-900 focus-visible:outline-2 focus-visible:outline-offset-4";
  const moments = [
    { title: "breakfastTitle", text: "breakfastText", src: "/images/brioche.jpg", href: "/menu" },
    { title: "lunchTitle", text: "lunchText", src: "/images/vetrina-pranzi-estate.jpg", href: "/menu" },
    { title: "aperitivoTitle", text: "aperitivoText", src: "/images/negroni.jpg", href: "/menu#aperitivi-alcolici" },
  ];

  return (
    <div className="bg-background text-foreground">
      <section className="relative isolate flex min-h-[calc(88svh-4.5rem)] items-end bg-neutral-950 sm:min-h-[calc(92svh-5rem)]">
        <Image src="/images/hero.jpg" alt="" fill priority sizes="100vw" className="-z-20 object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/35 to-black/15" />
        <div className="mx-auto w-full max-w-6xl px-6 py-16 sm:py-20">
          <p className="text-sm font-medium tracking-[0.24em] text-white/85">{t("heroKicker")}</p>
          <h1 className={`${heroSerif.className} mt-6 max-w-[15ch] text-[clamp(2.75rem,6vw,5.5rem)] font-semibold leading-[0.98] tracking-tight text-white text-balance`}>
            {t("heroTitle").replace("\n", " ")}
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-white/90 sm:text-lg">{t("heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/menu" className="inline-flex min-h-12 items-center rounded-full bg-white px-6 py-3 text-base font-semibold text-neutral-900 transition hover:bg-amber-50">{t("ctaMenu")}</Link>
            <a href="#prenota" className="inline-flex min-h-12 items-center rounded-full border border-white/60 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/15">{t("ctaBook")}</a>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6">
        <section aria-labelledby="graduation-heading" className="grid items-center gap-8 py-16 md:grid-cols-2 md:gap-14 lg:py-24">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image src="/images/laurea.jpeg" alt={t("graduationAlt")} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
          <div>
            <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-amber-900">{t("eventsLabel")}</p>
            <h2 id="graduation-heading" className={heading}>{t("graduationTitle")}</h2>
            <p className="mt-6 whitespace-pre-line text-base leading-8 text-neutral-600">{t("graduationText")}</p>
            <Link href="/lauree" className={`${textLink} mt-6`}>{t("graduationCta")}</Link>
          </div>
        </section>

        <section aria-labelledby="day-heading" className="border-t border-neutral-200 py-16 lg:py-24">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 id="day-heading" className={`${heading} max-w-xl`}>{t("dayTitle")}</h2>
            <Link href="/menu" className={textLink}>{t("ctaMenu")} <LinkArrow /></Link>
          </div>
          <div className="mt-10 grid gap-10 md:grid-cols-3 md:gap-7">
            {moments.map((moment) => (
              <Link key={moment.title} href={moment.href} className="group block min-w-0 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-8">
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl md:aspect-[4/5]">
                  <Image src={moment.src} alt={t(moment.title)} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]" />
                </div>
                <div className="mt-5 flex items-center gap-2">
                  <h3 className={`${heroSerif.className} text-3xl font-semibold text-amber-900 underline decoration-1 underline-offset-4`}>{t(moment.title)}</h3>
                  <LinkArrow className="text-amber-900" />
                </div>
                <p className="mt-2 text-base leading-7 text-neutral-600">{t(moment.text)}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section aria-labelledby="friday-heading" className="bg-neutral-900 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-14 md:grid-cols-2 md:gap-16 md:py-20">
          <div>
            <p className="mb-5 text-sm font-medium uppercase tracking-[0.16em] text-amber-200">{HIGHLIGHTS[2].title[lang]}</p>
            <h2 id="friday-heading" className={heading}>{t("fridayTitle")}</h2>
            <p className="mt-6 text-base leading-8 text-neutral-300">{t("fridayText")}</p>
            <Link href="/menu#pesce" className="mt-7 inline-flex min-h-11 items-center gap-3 border-b border-amber-200/50 py-2 text-base font-semibold text-amber-100 transition hover:border-amber-100">{t("fridayCta")} <LinkArrow /></Link>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl md:aspect-square">
            <Image src="/images/vetrina-pesce.jpg" alt={t("fishAlt")} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover object-center" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6">
        <section id="prenota" aria-labelledby="visit-heading" className="scroll-mt-28 py-16 lg:py-24">
          <h2 id="visit-heading" className={heading}>{t("whereTitle")}</h2>
          <div className="mt-10 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <p className="text-lg font-semibold">Bar Da Luciano</p>
              <p className="mt-2 text-base leading-7 text-neutral-600">Via Nazareth 20, Padova</p>
              <a href="https://www.google.com/maps?q=via%20Nazareth%2020%2C%2035128%20Padova" target="_blank" rel="noreferrer" className={`${textLink} mt-3`}>{t("whereCta")} <LinkArrow /></a>
              <div className="mt-8 border-y border-neutral-200 py-6">
                <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-600">{HIGHLIGHTS[0].title[lang]}</h3>
                <dl className="mt-4 space-y-3 text-base">
                  {splitLines(HIGHLIGHTS[0].text[lang]).map((line) => {
                    const [day, ...hours] = line.split(" ");
                    return <div key={day} className="flex flex-wrap justify-between gap-x-6 gap-y-1"><dt>{day}</dt><dd className="font-medium tabular-nums">{hours.join(" ")}</dd></div>;
                  })}
                </dl>
              </div>
              <h3 className={`${heroSerif.className} mt-8 text-3xl font-semibold`}>{t("bookTitle")}</h3>
              <p className="mt-3 text-base leading-7 text-neutral-600">{t("bookSubtitle")}</p>
              <a href="tel:+390499813795" className="mt-5 inline-flex min-h-12 items-center rounded-full bg-neutral-900 px-6 py-3 text-base font-semibold text-white transition hover:bg-neutral-700">{t("call")} · 049 981 3795</a>
            </div>
            <div className="min-h-[340px] overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 lg:min-h-[480px]">
              {consent === "accepted" ? (
                <iframe title={t("mapConsentTitle")} src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2801.46097070022!2d11.89233677655568!3d45.40004323771666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x477edafcc00abb53%3A0x837057fcf720ca6!2sBar%20Da%20Luciano!5e0!3m2!1sit!2sit!4v1769651829333!5m2!1sit!2sit" width="100%" height="100%" loading="lazy" referrerPolicy="no-referrer" className="block h-full min-h-[340px] w-full lg:min-h-[480px]" />
              ) : (
                <div className="flex h-full min-h-[340px] flex-col items-center justify-center px-7 py-10 text-center">
                  <p className="text-lg font-semibold">{t("mapConsentTitle")}</p>
                  <p className="mt-3 max-w-sm text-base leading-7 text-neutral-600">{t("mapConsentText")}</p>
                  <button type="button" onClick={accept} className="mt-5 min-h-12 rounded-full bg-neutral-900 px-6 py-3 text-base font-semibold text-white transition hover:bg-neutral-700">{t("mapConsentCta")}</button>
                </div>
              )}
            </div>
          </div>
        </section>
        <section className="flex flex-col gap-6 border-t border-neutral-200 py-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className={`${heroSerif.className} text-3xl font-semibold`}>{t("leaveReviewTitle")}</h2>
            <p className="mt-2 text-base text-neutral-600">{t("leaveReviewSubtitle")}</p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <a href="https://www.google.com/search?client=safari&hs=FPz9&sca_esv=074920bdea4960d4&rls=en&si=AL3DRZHrmvnFAVQPOO2Bzhf8AX9KZZ6raUI_dT7DG_z0kV2_xztH0BMykLPYJ2yUKG24IswJDdqjMpbJsR6pZofdiNDCebTRuBkcKRCunEOQyf_gcLSItw9QjEmHthYUk5XMsr1zNmOf&q=Bar+Da+Luciano+Recensioni&sa=X&ved=2ahUKEwiAlZbHxM2SAxWXhP0HHUv-A6kQ0bkNegQIHxAH&biw=960&bih=933&dpr=1" target="_blank" rel="noreferrer" className={textLink}>{t("leaveReviewCta")} <LinkArrow /></a>
            <a href="https://www.instagram.com/bar_da_luciano/" target="_blank" rel="noreferrer" className={textLink}>Instagram <LinkArrow /></a>
          </div>
        </section>
      </div>
    </div>
  );
}
