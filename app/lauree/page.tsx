"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage, type Language } from "../locale-provider";

const GRADUATION_IMAGES = [
  { src: "/images/laurea.jpeg", width: 1200, height: 900 },
  { src: "/images/laurea-2.jpg", width: 800, height: 700 },
  { src: "/images/laurea-3.jpg", width: 800, height: 700 },
];

const COPY: Record<
  Language,
  {
    title: string;
    subtitle: string;
    intro: string;
    detailsTitle: string;
    details: string[];
    foodTitle: string;
    foodIntro: string;
    foodCustomText: string;
    proposal9Title: string;
    proposal9Text: string;
    proposal9Caption: string;
    proposal12Title: string;
    proposal12Text: string;
    proposal12Caption: string;
    drinksTitle: string;
    drinksText: string;
    drinksItems: { name: string; price: string }[];
    drinksNote: string;
    ctaCall: string;
    ctaWhatsApp: string;
    galleryCta: string;
    imageAlt: string;
  }
> = {
  it: {
    title: "Lauree",
    subtitle: "Brindisi, rinfreschi e feste di laurea al Bar da Luciano.",
    intro:
      "Prepariamo tavoli, aperitivi, cicchetti e proposte dolci o salate per festeggiare dopo la proclamazione.",
    detailsTitle: "Organizziamo insieme",
    details: [
      "Rinfreschi su prenotazione",
      "Aperitivi e buffet dolce/salato",
      "Soluzioni per piccoli gruppi e feste con famiglia e amici",
    ],
    foodTitle: "Proposte cibo",
    foodIntro: "Due proposte pensate per adattarsi al tipo di festa e al numero di invitati.",
    foodCustomText:
      "Su richiesta è possibile concordare soluzioni alternative e personalizzate, in base alle esigenze della festa e alla disponibilità del momento. Oltre alle combinazioni indicate, il rinfresco può essere composto, ad esempio, da focacce, tramezzini, cicchetti, paninetti, pizzette sfoglia, polpette di carne o verdura e brioches salate.",
    proposal9Title: "Proposta da 9€ a persona",
    proposal9Text: "3 porzioni di tramezzino, mezza focaccia e 1 paninetto.",
    proposal9Caption: "Foto esempio della porzione a persona.",
    proposal12Title: "Proposta da 12€ a persona",
    proposal12Text:
      "3 porzioni di tramezzino, mezza focaccia, 1 paninetto e 1 cicchetto di carne o pesce.",
    proposal12Caption: "Foto esempio della porzione a persona.",
    drinksTitle: "Bevande",
    drinksText: "Proposte pensate per accompagnare il rinfresco e il brindisi.",
    drinksItems: [
      { name: "Caraffa Aperol 1,5L", price: "30€" },
      { name: "Caraffa Campari 1,5L", price: "35€" },
      { name: "Caraffa analcolica 1,5L", price: "25€" },
      { name: "Bottiglia di Prosecco", price: "22€" },
    ],
    drinksNote: "Le bevande sono accompagnate da patatine e arachidi.",
    ctaCall: "Chiama",
    ctaWhatsApp: "WhatsApp",
    galleryCta: "Vedi foto",
    imageAlt: "Festa di laurea al Bar da Luciano",
  },
  en: {
    title: "Graduations",
    subtitle: "Toasts, refreshments, and graduation parties at Bar da Luciano.",
    intro:
      "We prepare tables, aperitifs, cicchetti, and sweet or savory options to celebrate after graduation.",
    detailsTitle: "Plan it with us",
    details: [
      "Refreshments by reservation",
      "Aperitifs and sweet or savory buffet",
      "Options for small groups and celebrations with family and friends",
    ],
    foodTitle: "Food options",
    foodIntro: "Two proposals designed around the style of party and number of guests.",
    foodCustomText:
      "Alternative and personalized solutions can be arranged on request, according to the needs of the celebration and current availability. Beyond the options shown, refreshments can include, for example, focaccia, sandwiches, cicchetti, small rolls, puff pastry pizzette, meat or vegetable bites, and savory brioches.",
    proposal9Title: "9€ proposal per person",
    proposal9Text: "3 portions of sandwich, half a focaccia, and 1 small roll.",
    proposal9Caption: "Example photo of the individual portion.",
    proposal12Title: "12€ proposal per person",
    proposal12Text:
      "3 portions of sandwich, half a focaccia, 1 small roll, and 1 meat or fish cicchetto.",
    proposal12Caption: "Example photo of the individual portion.",
    drinksTitle: "Drinks",
    drinksText: "Options designed to accompany the refreshments and the toast.",
    drinksItems: [
      { name: "Aperol pitcher 1.5L", price: "30€" },
      { name: "Campari pitcher 1.5L", price: "35€" },
      { name: "Non-alcoholic pitcher 1.5L", price: "25€" },
      { name: "Bottle of Prosecco", price: "22€" },
    ],
    drinksNote: "Drinks are served with crisps and peanuts.",
    ctaCall: "Call",
    ctaWhatsApp: "WhatsApp",
    galleryCta: "View photos",
    imageAlt: "Graduation party at Bar da Luciano",
  },
  fr: {
    title: "Diplômes",
    subtitle: "Toasts, rafraîchissements et fêtes de diplôme au Bar da Luciano.",
    intro:
      "Nous préparons tables, apéritifs, cicchetti et propositions sucrées ou salées pour célébrer après la proclamation.",
    detailsTitle: "Organisons ensemble",
    details: [
      "Rafraîchissements sur réservation",
      "Apéritifs et buffet sucré ou salé",
      "Solutions pour petits groupes et fêtes avec famille et amis",
    ],
    foodTitle: "Propositions cuisine",
    foodIntro: "Deux formules pensées selon le type de fête et le nombre d'invités.",
    foodCustomText:
      "Sur demande, il est possible de convenir de solutions alternatives et personnalisées, selon les besoins de la fête et les disponibilités du moment. Au-delà des formules indiquées, le buffet peut être composé, par exemple, de focaccias, tramezzini, cicchetti, petits pains, pizzette feuilletées, boulettes de viande ou de légumes et brioches salées.",
    proposal9Title: "Proposition 9€ par personne",
    proposal9Text: "3 portions de tramezzino, une demi-focaccia et 1 petit pain.",
    proposal9Caption: "Photo d'exemple de la portion par personne.",
    proposal12Title: "Proposition 12€ par personne",
    proposal12Text:
      "3 portions de tramezzino, une demi-focaccia, 1 petit pain et 1 cicchetto de viande ou de poisson.",
    proposal12Caption: "Photo d'exemple de la portion par personne.",
    drinksTitle: "Boissons",
    drinksText: "Des propositions pensées pour accompagner le buffet et le toast.",
    drinksItems: [
      { name: "Carafe Aperol 1,5L", price: "30€" },
      { name: "Carafe Campari 1,5L", price: "35€" },
      { name: "Carafe sans alcool 1,5L", price: "25€" },
      { name: "Bouteille de Prosecco", price: "22€" },
    ],
    drinksNote: "Les boissons sont accompagnées de chips et de cacahuètes.",
    ctaCall: "Appeler",
    ctaWhatsApp: "WhatsApp",
    galleryCta: "Voir les photos",
    imageAlt: "Fête de diplôme au Bar da Luciano",
  },
  de: {
    title: "Abschlüsse",
    subtitle: "Anstoßen, Erfrischungen und Abschlussfeiern in der Bar da Luciano.",
    intro:
      "Wir bereiten Tische, Aperitifs, Cicchetti sowie süße oder herzhafte Angebote für die Feier nach der Verleihung vor.",
    detailsTitle: "Gemeinsam planen",
    details: [
      "Erfrischungen auf Reservierung",
      "Aperitifs und süßes oder herzhaftes Buffet",
      "Lösungen für kleine Gruppen und Feiern mit Familie und Freunden",
    ],
    foodTitle: "Speisenangebote",
    foodIntro: "Zwei Angebote, passend zur Art der Feier und zur Anzahl der Gäste.",
    foodCustomText:
      "Auf Anfrage können alternative und individuelle Lösungen vereinbart werden, je nach den Anforderungen der Feier und der aktuellen Verfügbarkeit. Neben den angegebenen Kombinationen kann das Buffet zum Beispiel Focaccia, Tramezzini, Cicchetti, kleine Brötchen, Blätterteig-Pizzette, Fleisch- oder Gemüsebällchen und herzhafte Brioches umfassen.",
    proposal9Title: "Angebot 9€ pro Person",
    proposal9Text: "3 Portionen Tramezzino, eine halbe Focaccia und 1 kleines Brotchen.",
    proposal9Caption: "Beispielfoto der Portion pro Person.",
    proposal12Title: "Angebot 12€ pro Person",
    proposal12Text:
      "3 Portionen Tramezzino, eine halbe Focaccia, 1 kleines Brotchen und 1 Cicchetto mit Fleisch oder Fisch.",
    proposal12Caption: "Beispielfoto der Portion pro Person.",
    drinksTitle: "Getränke",
    drinksText: "Auswahl passend zum Buffet und zum Anstoßen.",
    drinksItems: [
      { name: "Aperol-Karaffe 1,5L", price: "30€" },
      { name: "Campari-Karaffe 1,5L", price: "35€" },
      { name: "Alkoholfreie Karaffe 1,5L", price: "25€" },
      { name: "Flasche Prosecco", price: "22€" },
    ],
    drinksNote: "Die Getränke werden mit Chips und Erdnüssen serviert.",
    ctaCall: "Anrufen",
    ctaWhatsApp: "WhatsApp",
    galleryCta: "Fotos ansehen",
    imageAlt: "Abschlussfeier in der Bar da Luciano",
  },
  es: {
    title: "Graduaciones",
    subtitle: "Brindis, refrigerios y fiestas de graduación en Bar da Luciano.",
    intro:
      "Preparamos mesas, aperitivos, cicchetti y propuestas dulces o saladas para celebrar después de la proclamación.",
    detailsTitle: "Lo organizamos juntos",
    details: [
      "Refrigerios con reserva",
      "Aperitivos y buffet dulce o salado",
      "Opciones para grupos pequeños y fiestas con familia y amigos",
    ],
    foodTitle: "Propuestas de comida",
    foodIntro: "Dos propuestas pensadas según el tipo de fiesta y el número de invitados.",
    foodCustomText:
      "Bajo petición, es posible acordar soluciones alternativas y personalizadas, según las necesidades de la fiesta y la disponibilidad del momento. Además de las combinaciones indicadas, el refrigerio puede incluir, por ejemplo, focaccias, tramezzini, cicchetti, panecillos, pizzette de hojaldre, albóndigas de carne o verdura y brioches saladas.",
    proposal9Title: "Propuesta de 9€ por persona",
    proposal9Text: "3 porciones de tramezzino, media focaccia y 1 panecillo.",
    proposal9Caption: "Foto de ejemplo de la porción por persona.",
    proposal12Title: "Propuesta de 12€ por persona",
    proposal12Text:
      "3 porciones de tramezzino, media focaccia, 1 panecillo y 1 cicchetto de carne o pescado.",
    proposal12Caption: "Foto de ejemplo de la porción por persona.",
    drinksTitle: "Bebidas",
    drinksText: "Propuestas pensadas para acompañar el refrigerio y el brindis.",
    drinksItems: [
      { name: "Jarra Aperol 1,5L", price: "30€" },
      { name: "Jarra Campari 1,5L", price: "35€" },
      { name: "Jarra sin alcohol 1,5L", price: "25€" },
      { name: "Botella de Prosecco", price: "22€" },
    ],
    drinksNote: "Las bebidas se acompañan con patatas chips y cacahuetes.",
    ctaCall: "Llamar",
    ctaWhatsApp: "WhatsApp",
    galleryCta: "Ver fotos",
    imageAlt: "Fiesta de graduación en Bar da Luciano",
  },
};

export default function GraduationsPage() {
  const { lang } = useLanguage();
  const copy = COPY[lang];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveImageIndex((current) => (current + 1) % GRADUATION_IMAGES.length);
    }, 2500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="bg-[#fbfaf7] text-neutral-900">
      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-16">
        <div className="space-y-6">
          <div>
            <h1 className="flex items-center gap-3 text-4xl font-semibold tracking-tight font-serif sm:text-5xl">
              <span>{copy.title}</span>
              <span className="text-3xl leading-none sm:text-4xl" aria-hidden="true">
                🎓
              </span>
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-8 text-neutral-600">
              {copy.subtitle}
            </p>
          </div>

          <p className="max-w-2xl text-base leading-7 text-neutral-700">
            {copy.intro}
          </p>

          <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold font-serif">{copy.detailsTitle}</h2>
            <ul className="mt-4 space-y-3 text-neutral-700">
              {copy.details.map((detail) => (
                <li key={detail} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>

          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight font-serif">
                {copy.foodTitle}
              </h2>
              <p className="mt-2 text-neutral-600">{copy.foodIntro}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-amber-200 bg-[#fff8ea] p-5 shadow-sm">
                <Image
                  src="/images/proposta-laurea-9.png"
                  alt={copy.proposal9Title}
                  width={1448}
                  height={1086}
                  className="h-44 w-full rounded-md object-cover"
                />
                <p className="mt-2 mb-5 text-xs italic leading-5 text-neutral-600">
                  {copy.proposal9Caption}
                </p>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-xl font-semibold text-neutral-900">
                    {copy.proposal9Title}
                  </h3>
                  <span className="text-2xl font-semibold text-amber-800">9€</span>
                </div>
                <p className="mt-4 text-neutral-700">{copy.proposal9Text}</p>
              </div>

              <div className="rounded-lg border border-amber-200 bg-[#fff8ea] p-5 shadow-sm">
                <Image
                  src="/images/proposta-laurea-12.png"
                  alt={copy.proposal12Title}
                  width={1448}
                  height={1086}
                  className="h-44 w-full rounded-md object-cover"
                />
                <p className="mt-2 mb-5 text-xs italic leading-5 text-neutral-600">
                  {copy.proposal12Caption}
                </p>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-xl font-semibold text-neutral-900">
                    {copy.proposal12Title}
                  </h3>
                  <span className="text-2xl font-semibold text-amber-800">12€</span>
                </div>
                <p className="mt-4 text-neutral-700">{copy.proposal12Text}</p>
              </div>
            </div>

            <p className="rounded-lg border border-neutral-200 bg-white px-5 py-4 text-sm leading-6 text-neutral-700 shadow-sm">
              {copy.foodCustomText}
            </p>
          </section>

          <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight font-serif">
              {copy.drinksTitle}
            </h2>
            <p className="mt-3 text-neutral-700">{copy.drinksText}</p>
            <div className="mt-5 divide-y divide-neutral-200 border-y border-neutral-200">
              {copy.drinksItems.map((item) => (
                <div
                  key={item.name}
                  className="flex items-baseline justify-between gap-4 py-3"
                >
                  <span className="text-neutral-800">{item.name}</span>
                  <span className="font-semibold text-neutral-950">{item.price}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-6 text-neutral-600">
              {copy.drinksNote}
            </p>
          </section>

          <div className="flex flex-wrap gap-3">
            <a
              href="tel:+390499813795"
              className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700"
            >
              {copy.ctaCall}
            </a>
            <a
              href="https://wa.me/393498183485"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
            >
              {copy.ctaWhatsApp}
            </a>
            <Link
              href="/galleria"
              className="inline-flex items-center justify-center rounded-full border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-700 transition hover:text-neutral-950"
            >
              {copy.galleryCta}
            </Link>
          </div>
        </div>

        <div className="relative h-[28rem] overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm sm:h-[34rem] lg:h-[42rem]">
          {GRADUATION_IMAGES.map((image, index) => (
            <Image
              key={image.src}
              src={image.src}
              alt={copy.imageAlt}
              width={image.width}
              height={image.height}
              priority={index === 0}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                index === activeImageIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 bg-gradient-to-t from-black/35 to-transparent px-4 pb-4 pt-12">
            {GRADUATION_IMAGES.map((image, index) => (
              <span
                key={image.src}
                className={`h-2 w-2 rounded-full transition ${
                  index === activeImageIndex ? "bg-white" : "bg-white/45"
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
