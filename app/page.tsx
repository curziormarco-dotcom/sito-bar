"use client";

import Link from "next/link";
import { useScrollReveal } from "./use-scroll-reveal";
import openingHours from "../content/hours.json";
import { formatOpeningHours } from "./content/opening-hours";
import Image from "next/image";
import { useCookieConsent } from "./cookie-consent";
import { useLanguage, type Language } from "./locale-provider";

const HIGHLIGHTS = [
  {
    title: {
      it: "Orari",
      en: "Hours",
      fr: "Horaires",
      de: "Öffnungszeiten",
      es: "Horario",
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
    lunchText: "Pausa pranzo a Padova con piatti di gastronomia, insalatone e proposte del giorno in vetrina.",
    aperitivoTitle: "Aperitivo",
    aperitivoText: "Cocktail, cicchetti e il piacere di stare insieme.",
    fridayTitle: "Il venerdì ha un altro sapore.",
    fridayText: "Scampi, ostriche, tartare, cicchetti di pesce e tanto altro: scopri le proposte per il tuo aperitivo del venerdì.",
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
    lunchText: "Lunch in Padua with deli dishes, generous salads and daily specials in our display counter.",
    aperitivoTitle: "Aperitivo",
    aperitivoText: "Cocktails, cicchetti and good company.",
    fridayTitle: "A different flavour on Fridays.",
    fridayText: "Scampi, oysters, tartare, seafood cicchetti and much more: discover our Friday aperitivo selection.",
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
    lunchText: "Pause déjeuner à Padoue avec plats du traiteur, grandes salades et propositions du jour en vitrine.",
    aperitivoTitle: "Apéritif",
    aperitivoText: "Cocktails, cicchetti et le plaisir de se retrouver.",
    fridayTitle: "Le vendredi a une autre saveur.",
    fridayText: "Langoustines, huîtres, tartares, cicchetti de poisson et bien plus encore : découvrez nos propositions pour l’apéritif du vendredi.",
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
    lunchText: "Mittagspause in Padua mit Feinkostgerichten, großen Salaten und Tagesangeboten in der Vitrine.",
    aperitivoTitle: "Aperitif",
    aperitivoText: "Cocktails, Cicchetti und gemeinsame Zeit.",
    fridayTitle: "Freitags schmeckt es anders.",
    fridayText: "Scampi, Austern, Tatar, Fisch-Cicchetti und vieles mehr: Entdecke unser Angebot zum Aperitif am Freitag.",
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
    lunchText: "Almuerzo en Padua con platos preparados, ensaladas completas y propuestas del día en la vitrina.",
    aperitivoTitle: "Aperitivo",
    aperitivoText: "Cócteles, cicchetti y el placer de estar juntos.",
    fridayTitle: "El viernes tiene otro sabor.",
    fridayText: "Cigalas, ostras, tartar, cicchetti de pescado y mucho más: descubre nuestras propuestas para el aperitivo del viernes.",
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

const DESIGN_COPY: Record<Language, { hero: string; heroEmphasis: string; since: string; intro: string; daily: string; friday: string; moments: string; scroll: string; gallery: string }> = {
  it: { hero: "Ci vediamo", heroEmphasis: "da Luciano.", since: "A Padova, dal 1984", intro: "Un bar di famiglia. Un punto d’incontro. Da oltre quarant’anni.", daily: "Il tuo momento, qui.", friday: "L’appuntamento del venerdì", moments: "Caffè · Pranzo · Aperitivo", scroll: "Scorri", gallery: "Il bar, da vicino" },
  en: { hero: "The good things,", heroEmphasis: "every day.", since: "In Padua, since 1984", intro: "A family bar. A meeting place. For over forty years.", daily: "Your moment, here.", friday: "Your Friday rendezvous", moments: "Coffee · Lunch · Aperitivo", scroll: "Scroll", gallery: "Step inside Luciano’s" },
  fr: { hero: "Les belles choses,", heroEmphasis: "chaque jour.", since: "À Padoue, depuis 1984", intro: "Un bar familial. Un lieu de rencontre. Depuis plus de quarante ans.", daily: "Votre moment, ici.", friday: "Le rendez-vous du vendredi", moments: "Café · Déjeuner · Apéritif", scroll: "Défiler", gallery: "Entrez chez Luciano" },
  de: { hero: "Die schönen Dinge,", heroEmphasis: "jeden Tag.", since: "In Padua, seit 1984", intro: "Eine Familienbar. Ein Treffpunkt. Seit über vierzig Jahren.", daily: "Dein Moment, hier.", friday: "Der Treffpunkt am Freitag", moments: "Kaffee · Mittagessen · Aperitif", scroll: "Scrollen", gallery: "Bei Luciano eintreten" },
  es: { hero: "Las cosas buenas,", heroEmphasis: "cada día.", since: "En Padua, desde 1984", intro: "Un bar familiar. Un lugar de encuentro. Desde hace más de cuarenta años.", daily: "Tu momento, aquí.", friday: "La cita de los viernes", moments: "Café · Almuerzo · Aperitivo", scroll: "Desliza", gallery: "Entra en Luciano" },
};

export default function HomePage() {
  const revealRoot = useScrollReveal();
  const { lang } = useLanguage();
  const { consent, accept } = useCookieConsent();
  const t = (key: string) => HOME_COPY[lang][key] ?? key;
  const copy = DESIGN_COPY[lang];
  const heading = "home-heading";
  const textLink = "home-text-link";
  const moments = [
    { title: "breakfastTitle", text: "breakfastText", src: "/images/brioche.jpg", href: "/menu#brioches-pasticceria" },
    { title: "lunchTitle", text: "lunchText", src: "/images/vetrina-pranzi-estate.jpg", href: "/menu#pranzi" },
    { title: "aperitivoTitle", text: "aperitivoText", src: "/images/negroni.jpg", href: "/menu#aperitivi-alcolici" },
  ];

  return (
    <div ref={revealRoot} className="home-page">
      <noscript><style>{`.home-page [data-reveal] { visibility: visible !important; opacity: 1 !important; }`}</style></noscript>
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-photo">
          <Image src="/images/negroni.jpg" alt="" fill priority sizes="(min-width: 900px) 65vw, 100vw" className="hero-background" />
        </div>
        <div className="home-hero-shade" />
        <div className="home-container home-hero-content">
          <p className="home-eyebrow hero-enter">{copy.since} <span aria-hidden="true">—</span> Bar da Luciano</p>
          <h1 id="home-title" className="hero-enter"><span>{copy.hero}</span><em>{copy.heroEmphasis}</em></h1>
          <div className="home-hero-bottom hero-enter">
            <div>
              <p>{t("heroSubtitle").split(". ")[0]}.{" "}<span className="home-since-date">{t("heroSubtitle").split(". ")[1]}</span></p>
              <p className="home-hero-address">Via Nazareth, 20 · Padova · Italia</p>
              <Link href="/menu" className="home-hero-menu-link">{t("ctaMenu")}</Link>
            </div>
            <p className="home-hero-note">Via Nazareth, 20<br />Padova, Italia</p>
          </div>
        </div>
        <p className="home-mobile-address">Via Nazareth, 20 · Padova · Italia</p>
        <a href="#scopri" className="hero-scroll" onClick={(event) => {
          const section = document.getElementById("scopri");
          if (!section) return;
          event.preventDefault();
          section.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
        }}><span>{copy.scroll}</span><span className="scroll-line" aria-hidden="true" /></a>
      </section>

      <section id="scopri" className="home-intro home-container" aria-labelledby="intro-heading">
        <div className="home-intro-since" aria-hidden="true"><span>EST.</span><span>1984</span></div>
        <div>
          <p className="home-eyebrow">Bar da Luciano · Padova</p>
          <h2 id="intro-heading" data-reveal="up">{copy.intro}</h2>
          <Link href="/galleria" className={textLink}>{copy.gallery} <LinkArrow /></Link>
        </div>
      </section>

      <section className="home-day home-container home-section" aria-labelledby="day-heading">
        <div className="home-section-top"><span className="home-eyebrow">{copy.moments}</span><span className="home-rule" /></div>
        <div className="home-section-heading">
          <h2 id="day-heading" className={heading} data-reveal="down">{copy.daily}</h2>
          <p>{t("dayTitle")}</p>
        </div>
        <div className="home-moments">
          {moments.map((moment, index) => (
            <article key={moment.title} className="home-moment">
              <Link href={moment.href} className="home-moment-photo" data-reveal={index === 1 ? "image" : index === 0 ? "left" : "right"} aria-label={t(moment.title)}>
                <Image src={moment.src} alt={t(moment.title)} fill sizes="(min-width: 768px) 32vw, 90vw" className={index === 2 ? "object-bottom" : "object-center"} />
                <span className="home-image-arrow" aria-hidden="true"><LinkArrow /></span>
              </Link>
              <div className="home-moment-copy" data-reveal="up">
                <div className="home-moment-title"><h3><Link href={moment.href}>{t(moment.title)}</Link></h3></div>
                <p>{t(moment.text)}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="home-day-cta"><Link href="/menu" className="home-button">{t("ctaMenu")} <LinkArrow /></Link></div>
      </section>

      <section className="home-friday" aria-labelledby="friday-heading">
        <div className="home-friday-photo" data-reveal="image">
          <Image src="/images/vetrina-pesce.jpg" alt={t("fishAlt")} fill sizes="100vw" className="object-cover" />
        </div>
        <div className="home-friday-shade" />
        <div className="home-container home-friday-content">
          <p className="home-eyebrow">{copy.friday}</p>
          <h2 id="friday-heading" data-reveal="up">{t("fridayTitle")}</h2>
          <div className="home-friday-details" data-reveal="up"><p>{t("fridayText")}</p><Link href="/menu#pesce" className="home-button home-button-light">{t("fridayCta")} <LinkArrow /></Link></div>
        </div>
      </section>

      <section className="home-celebration home-container home-section" aria-labelledby="graduation-heading">
        <div className="home-celebration-images">
          <div className="home-celebration-main" data-reveal="image"><Image src="/images/laurea.jpeg" alt={t("graduationAlt")} fill sizes="(min-width: 900px) 45vw, 85vw" className="object-cover" /></div>
          <div className="home-celebration-detail" data-reveal="up"><Image src="/images/laurea-2.jpg" alt="" fill sizes="(min-width: 900px) 22vw, 45vw" className="object-cover" /></div>
        </div>
        <div className="home-celebration-copy">
          <p className="home-eyebrow">{t("eventsLabel")}</p>
          <h2 id="graduation-heading" className={heading} data-reveal="right">{t("graduationTitle")}</h2>
          <p className="home-description" data-reveal="up">{t("graduationText")}</p>
          <Link href="/lauree" className={textLink}>{t("graduationCta").replace(" →", "")} <LinkArrow /></Link>
        </div>
      </section>
      <div className="home-container">
        <section aria-labelledby="visit-heading" className="home-visit home-section">
          <h2 data-reveal="up" id="visit-heading" className={heading}>{t("whereTitle")}</h2>
          <div className="home-visit-grid">
            <div data-reveal="up">
              <p className="text-lg font-semibold">Bar Da Luciano</p>
              <p className="mt-2 text-base leading-7 text-neutral-600">Via Nazareth 20, Padova</p>
              <a href="https://www.google.com/maps?q=via%20Nazareth%2020%2C%2035128%20Padova" target="_blank" rel="noreferrer" className={`${textLink} mt-3`}>{t("whereCta")} <LinkArrow /></a>
              <div className="mt-6 border-y border-neutral-200 py-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-600">{HIGHLIGHTS[0].title[lang]}</h3>
                <dl className="mt-4 space-y-3 text-base">
                  {splitLines(formatOpeningHours(openingHours, lang)).map((line) => {
                    const [day, ...hours] = line.split(" ");
                    return <div key={day} className="flex flex-wrap justify-between gap-x-6 gap-y-1"><dt>{day}</dt><dd className="font-medium tabular-nums">{hours.join(" ")}</dd></div>;
                  })}
                </dl>
              </div>
              <section id="prenota" aria-labelledby="contact-heading" className="mt-8 scroll-mt-24">
              <h3 id="contact-heading" className={`font-serif text-3xl font-normal`}>{t("bookTitle")}</h3>
              <p className="mt-3 text-base leading-7 text-neutral-600">{t("bookSubtitle")}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a href="tel:+390499813795" className="inline-flex min-h-12 items-center rounded-none bg-neutral-900 px-6 py-3 text-base font-semibold text-white transition hover:bg-neutral-700">{t("call")} · 049 981 3795</a>
                <a href="https://wa.me/393498183485" target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center rounded-none border border-neutral-300 bg-transparent px-6 py-3 text-base font-semibold text-neutral-900 transition hover:bg-neutral-100">WhatsApp · 349 818 3485</a>
              </div>
              </section>
            </div>
            <div data-reveal="image" className="min-h-[340px] overflow-hidden rounded-none border border-neutral-200 bg-neutral-100 lg:min-h-[480px]">
              {consent === "accepted" ? (
                <iframe title={t("mapConsentTitle")} src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2801.46097070022!2d11.89233677655568!3d45.40004323771666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x477edafcc00abb53%3A0x837057fcf720ca6!2sBar%20Da%20Luciano!5e0!3m2!1sit!2sit!4v1769651829333!5m2!1sit!2sit" width="100%" height="100%" loading="lazy" referrerPolicy="no-referrer" className="block h-full min-h-[340px] w-full lg:min-h-[480px]" />
              ) : (
                <div className="flex h-full min-h-[340px] flex-col items-center justify-center px-7 py-10 text-center">
                  <p className="text-lg font-semibold">{t("mapConsentTitle")}</p>
                  <p className="mt-3 max-w-sm text-base leading-7 text-neutral-600">{t("mapConsentText")}</p>
                  <button type="button" onClick={accept} className="mt-5 min-h-12 rounded-none bg-neutral-900 px-6 py-3 text-base font-semibold text-white transition hover:bg-neutral-700">{t("mapConsentCta")}</button>
                </div>
              )}
            </div>
          </div>
        </section>
        <section data-reveal="up" className="home-reviews">
          <div>
            <h2 className={`font-serif text-3xl font-normal`}>{t("leaveReviewTitle")}</h2>
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
