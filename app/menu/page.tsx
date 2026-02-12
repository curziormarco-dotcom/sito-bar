"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLanguage, type Language } from "../locale-provider";

/* =======================
   TIPI
======================= */
type MenuItem = {
  name: Record<Language, string>;
  description?: Record<Language, string> | string;
  price?: number;
  priceNote?: string;
  glassPrice?: number;
  bottlePrice?: number;
  tag?: string;
  allergens?: AllergenKey[];
};

type MenuSection = {
  id?: string;
  title: Record<Language, string>;
  items: MenuItem[];
};

type AllergenKey = keyof typeof ALLERGEN_LABELS;

const UI_COPY: Record<Language, Record<string, string>> = {
  it: {
    menu: "Menù",
    allergens: "Allergeni",
    allergenLegend: "Legenda allergeni",
    close: "Chiudi",
    comingSoon: "Disponibile presto.",
    fridayOnly: "Disponibile solo il venerdì.",
    until1830: "Disponibile fino alle 18:30.",
    filterOn: "Filtro attivo:",
    clearFilter: "Rimuovi filtro",
    noMatches: "Nessun prodotto con questo allergene.",
    descriptionLabel: "Descrizione",
    glassLabel: "Calice",
    bottleLabel: "Bottiglia",
  },
  en: {
    menu: "Menu",
    allergens: "Allergens",
    allergenLegend: "Allergen legend",
    close: "Close",
    comingSoon: "Coming soon.",
    fridayOnly: "Available only on Fridays.",
    until1830: "Available until 6:30 PM.",
    filterOn: "Filter active:",
    clearFilter: "Clear filter",
    noMatches: "No products with this allergen.",
    descriptionLabel: "Description",
    glassLabel: "Glass",
    bottleLabel: "Bottle",
  },
  fr: {
    menu: "Menu",
    allergens: "Allergènes",
    allergenLegend: "Légende des allergènes",
    close: "Fermer",
    comingSoon: "Bientôt disponible.",
    fridayOnly: "Disponible uniquement le vendredi.",
    until1830: "Disponible jusqu’à 18h30.",
    filterOn: "Filtre actif :",
    clearFilter: "Retirer le filtre",
    noMatches: "Aucun produit avec cet allergène.",
    descriptionLabel: "Description",
    glassLabel: "Verre",
    bottleLabel: "Bouteille",
  },
  de: {
    menu: "Menü",
    allergens: "Allergene",
    allergenLegend: "Allergen-Legende",
    close: "Schließen",
    comingSoon: "Demnächst verfügbar.",
    fridayOnly: "Nur freitags verfügbar.",
    until1830: "Verfügbar bis 18:30 Uhr.",
    filterOn: "Aktiver Filter:",
    clearFilter: "Filter entfernen",
    noMatches: "Keine Produkte mit diesem Allergen.",
    descriptionLabel: "Beschreibung",
    glassLabel: "Glas",
    bottleLabel: "Flasche",
  },
  es: {
    menu: "Menú",
    allergens: "Alérgenos",
    allergenLegend: "Leyenda de alérgenos",
    close: "Cerrar",
    comingSoon: "Disponible pronto.",
    fridayOnly: "Disponible solo los viernes.",
    until1830: "Disponible hasta las 18:30.",
    filterOn: "Filtro activo:",
    clearFilter: "Quitar filtro",
    noMatches: "No hay productos con este alérgeno.",
    descriptionLabel: "Descripción",
    glassLabel: "Copa",
    bottleLabel: "Botella",
  },
};

const ALLERGEN_ORDER = [
  "latte",
  "uova",
  "soia",
  "pesce",
  "crostacei",
  "sedano",
  "molluschi",
  "solfiti",
  "lupini",
  "senape",
  "sesamo",
  "glutine",
  "frutta_guscio",
  "alcol",
  "congelato",
  "vegano",
  "vegetariano",
  "halal",
  "kosher",
  "bio",
  "piccante",
  "abbattuto",
] as const satisfies ReadonlyArray<AllergenKey>;

const ALLERGEN_SORT_ORDER: Record<AllergenKey, number> = ALLERGEN_ORDER.reduce(
  (acc, key, index) => {
    acc[key] = index;
    return acc;
  },
  {} as Record<AllergenKey, number>
);

const ALLERGEN_LABELS = {
  latte: { it: "Latte", en: "Milk", fr: "Lait", de: "Milch", es: "Leche" },
  uova: { it: "Uova", en: "Eggs", fr: "Œufs", de: "Eier", es: "Huevos" },
  soia: { it: "Soia", en: "Soy", fr: "Soja", de: "Soja", es: "Soja" },
  pesce: { it: "Pesce", en: "Fish", fr: "Poisson", de: "Fisch", es: "Pescado" },
  crostacei: { it: "Crostacei", en: "Crustaceans", fr: "Crustacés", de: "Krustentiere", es: "Crustáceos" },
  sedano: { it: "Sedano", en: "Celery", fr: "Céleri", de: "Sellerie", es: "Apio" },
  molluschi: { it: "Molluschi", en: "Molluscs", fr: "Mollusques", de: "Weichtiere", es: "Moluscos" },
  solfiti: { it: "Solfiti", en: "Sulfites", fr: "Sulfites", de: "Sulfite", es: "Sulfitos" },
  lupini: { it: "Lupini", en: "Lupins", fr: "Lupin", de: "Lupinen", es: "Altramuces" },
  senape: { it: "Senape", en: "Mustard", fr: "Moutarde", de: "Senf", es: "Mostaza" },
  sesamo: { it: "Sesamo", en: "Sesame", fr: "Sésame", de: "Sesam", es: "Sésamo" },
  glutine: { it: "Glutine", en: "Gluten", fr: "Gluten", de: "Gluten", es: "Gluten" },
  grano: { it: "Grano", en: "Wheat", fr: "Blé", de: "Weizen", es: "Trigo" },
  orzo: { it: "Orzo", en: "Barley", fr: "Orge", de: "Gerste", es: "Cebada" },
  avena: { it: "Avena", en: "Oats", fr: "Avoine", de: "Hafer", es: "Avena" },
  segale: { it: "Segale", en: "Rye", fr: "Seigle", de: "Roggen", es: "Centeno" },
  farro: { it: "Farro", en: "Spelt", fr: "Épeautre", de: "Dinkel", es: "Espelta" },
  kamut: { it: "Kamut", en: "Kamut", fr: "Kamut", de: "Kamut", es: "Kamut" },
  frutta_guscio: { it: "Fr. guscio", en: "Tree nuts", fr: "Fruits à coque", de: "Schalenfrüchte", es: "Frutos secos" },
  nocciole: { it: "Nocciole", en: "Hazelnuts", fr: "Noisettes", de: "Haselnüsse", es: "Avellanas" },
  noci: { it: "Noci", en: "Walnuts", fr: "Noix", de: "Walnüsse", es: "Nueces" },
  mandorle: { it: "Mandorle", en: "Almonds", fr: "Amandes", de: "Mandeln", es: "Almendras" },
  pistacchi: { it: "Pistacchi", en: "Pistachios", fr: "Pistaches", de: "Pistazien", es: "Pistachos" },
  arachidi: { it: "Arachidi", en: "Peanuts", fr: "Arachides", de: "Erdnüsse", es: "Cacahuetes" },
  noci_brasiliane: { it: "Noci brasiliane", en: "Brazil nuts", fr: "Noix du Brésil", de: "Paranüsse", es: "Nueces de Brasil" },
  anacardi: { it: "Anacardi", en: "Cashews", fr: "Noix de cajou", de: "Cashews", es: "Anacardos" },
  macadamia: { it: "Macadamia", en: "Macadamia", fr: "Macadamia", de: "Macadamia", es: "Macadamia" },
  noce_pecan: { it: "Noce pecan", en: "Pecan", fr: "Noix de pécan", de: "Pekanuss", es: "Nuez pecana" },
  alcol: { it: "Alcol", en: "Alcohol", fr: "Alcool", de: "Alkohol", es: "Alcohol" },
  congelato: { it: "Congelato", en: "Frozen", fr: "Surgelé", de: "Tiefgekühlt", es: "Congelado" },
  vegano: { it: "Vegano", en: "Vegan", fr: "Vegan", de: "Vegan", es: "Vegano" },
  vegetariano: { it: "Vegetariano", en: "Vegetarian", fr: "Végétarien", de: "Vegetarisch", es: "Vegetariano" },
  halal: { it: "Halal", en: "Halal", fr: "Halal", de: "Halal", es: "Halal" },
  kosher: { it: "Kosher", en: "Kosher", fr: "Casher", de: "Koscher", es: "Kosher" },
  bio: { it: "Bio", en: "Organic", fr: "Bio", de: "Bio", es: "Bio" },
  piccante: { it: "Piccante", en: "Spicy", fr: "Épicé", de: "Scharf", es: "Picante" },
  abbattuto: { it: "Abbattuto", en: "Blast chilled", fr: "Abattu", de: "Schockgekühlt", es: "Ultracongelado" },
} as const;

const ALLERGEN_STYLES: Record<AllergenKey, { ring: string; text: string }> = {
  latte: { ring: "border-rose-200", text: "text-rose-300" },
  uova: { ring: "border-amber-200", text: "text-amber-300" },
  soia: { ring: "border-emerald-200", text: "text-emerald-300" },
  pesce: { ring: "border-teal-200", text: "text-teal-300" },
  crostacei: { ring: "border-sky-200", text: "text-sky-300" },
  sedano: { ring: "border-lime-200", text: "text-lime-300" },
  molluschi: { ring: "border-cyan-200", text: "text-cyan-300" },
  solfiti: { ring: "border-fuchsia-200", text: "text-fuchsia-300" },
  lupini: { ring: "border-yellow-200", text: "text-yellow-300" },
  senape: { ring: "border-yellow-300", text: "text-yellow-300" },
  sesamo: { ring: "border-stone-200", text: "text-stone-300" },
  glutine: { ring: "border-amber-300", text: "text-amber-300" },
  grano: { ring: "border-amber-300", text: "text-amber-300" },
  orzo: { ring: "border-orange-300", text: "text-orange-300" },
  avena: { ring: "border-amber-300", text: "text-amber-300" },
  segale: { ring: "border-amber-300", text: "text-amber-300" },
  farro: { ring: "border-amber-300", text: "text-amber-300" },
  kamut: { ring: "border-amber-300", text: "text-amber-300" },
  frutta_guscio: { ring: "border-orange-300", text: "text-orange-300" },
  nocciole: { ring: "border-orange-300", text: "text-orange-300" },
  noci: { ring: "border-orange-300", text: "text-orange-300" },
  mandorle: { ring: "border-orange-300", text: "text-orange-300" },
  pistacchi: { ring: "border-green-300", text: "text-green-300" },
  arachidi: { ring: "border-orange-300", text: "text-orange-300" },
  noci_brasiliane: { ring: "border-orange-300", text: "text-orange-300" },
  anacardi: { ring: "border-orange-300", text: "text-orange-300" },
  macadamia: { ring: "border-orange-300", text: "text-orange-300" },
  noce_pecan: { ring: "border-orange-300", text: "text-orange-300" },
  alcol: { ring: "border-red-300", text: "text-red-300" },
  congelato: { ring: "border-sky-300", text: "text-sky-300" },
  vegano: { ring: "border-emerald-300", text: "text-emerald-300" },
  vegetariano: { ring: "border-emerald-300", text: "text-emerald-300" },
  halal: { ring: "border-red-300", text: "text-red-300" },
  kosher: { ring: "border-neutral-300", text: "text-neutral-300" },
  bio: { ring: "border-green-300", text: "text-green-300" },
  piccante: { ring: "border-red-400", text: "text-red-400" },
  abbattuto: { ring: "border-sky-300", text: "text-sky-300" },
};

function AllergenIcon({ type }: { type: AllergenKey }) {
  const base = "h-4 w-4";
  switch (type) {
    case "latte":
      return (
        <svg viewBox="0 0 24 24" className={base} aria-hidden="true">
          <rect x="8" y="5" width="8" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <rect x="10" y="3" width="4" height="3" rx="1" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8 9h8" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "uova":
      return (
        <svg viewBox="0 0 24 24" className={base} aria-hidden="true">
          <ellipse cx="12" cy="13" rx="5.5" ry="7" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "vegano":
      return (
        <svg viewBox="0 0 24 24" className={base} aria-hidden="true">
          <path
            d="M12 3c4.6 3.2 7.5 6.7 7.5 9s-2.9 5.8-7.5 9c-4.6-3.2-7.5-6.7-7.5-9s2.9-5.8 7.5-9z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 6.5v10.2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      );
    case "vegetariano":
    case "bio":
      return (
        <svg viewBox="0 0 24 24" className={base} aria-hidden="true">
          <path d="M6 14c6-1 8-6 12-8 0 6-4 11-10 11-1 0-2 0-2-3z" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M9 12c2 2 4 3 6 4" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "soia":
      return (
        <svg viewBox="0 0 24 24" className={base} aria-hidden="true">
          <g fill="currentColor">
            <g transform="translate(12 8) rotate(20) translate(-12 -8)">
              <path d="M6.5 9.2c0-2.2 2.7-3.9 5.9-3.9 3.2 0 4.6 1.1 4.6 3 0 2-2.2 5.2-5.3 5.2-3 0-5.2-2.1-5.2-4.3z" />
              <circle cx="12.2" cy="9.1" r="1.4" fill="white" />
            </g>
            <g transform="translate(8.2 14.2) rotate(-35) translate(-8.2 -14.2)">
              <path d="M3.5 15.2c0-2.2 2.7-3.9 5.9-3.9 3.2 0 4.6 1.1 4.6 3 0 2-2.2 5.2-5.3 5.2-3 0-5.2-2.1-5.2-4.3z" />
              <circle cx="9.2" cy="15.1" r="1.4" fill="white" />
            </g>
            <g transform="translate(15.8 15.2) rotate(45) translate(-15.8 -15.2)">
              <path d="M11.1 16.2c0-2.2 2.7-3.9 5.9-3.9 3.2 0 4.6 1.1 4.6 3 0 2-2.2 5.2-5.3 5.2-3 0-5.2-2.1-5.2-4.3z" />
              <circle cx="16.9" cy="16.1" r="1.4" fill="white" />
            </g>
          </g>
        </svg>
      );
    case "pesce":
    case "molluschi":
    case "crostacei":
      return (
        <svg viewBox="0 0 24 24" className={base} aria-hidden="true">
          <path d="M4 12c3-3 7-5 11-5 3 0 5 2 5 5-2 3-6 5-9 5-3 0-5-2-7-5z" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="16.5" cy="11" r="1" fill="currentColor" />
        </svg>
      );
    case "glutine":
    case "grano":
    case "orzo":
    case "avena":
    case "segale":
    case "farro":
    case "kamut":
      return (
        <svg viewBox="0 0 24 24" className={base} aria-hidden="true">
          <path d="M12 4v16" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 6c-2 0-3 1-3 3 2 0 3-1 3-3z" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 10c-2 0-3 1-3 3 2 0 3-1 3-3z" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 14c-2 0-3 1-3 3 2 0 3-1 3-3z" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 6c2 0 3 1 3 3-2 0-3-1-3-3z" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 10c2 0 3 1 3 3-2 0-3-1-3-3z" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 14c2 0 3 1 3 3-2 0-3-1-3-3z" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "arachidi":
    case "frutta_guscio":
    case "nocciole":
    case "noci":
    case "mandorle":
    case "pistacchi":
    case "noci_brasiliane":
    case "anacardi":
    case "macadamia":
    case "noce_pecan":
      return (
        <svg viewBox="0 0 24 24" className={base} aria-hidden="true">
          <path d="M8 6c-2 2-2 5 0 7s2 5 4 5 4-3 4-5 2-5 0-7-2-3-4-3-2 1-4 3z" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 9c0 3-1 6-2 8" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
    case "alcol":
      return (
        <svg viewBox="0 0 24 24" className={base} aria-hidden="true">
          <path d="M7 4h10l-2 6v6a3 3 0 0 1-6 0v-6L7 4z" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M9 10h6" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "congelato":
    case "abbattuto":
      return (
        <svg viewBox="0 0 24 24" className={base} aria-hidden="true">
          <path d="M12 4v16M5 8l14 8M5 16l14-8" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    case "piccante":
      return (
        <svg viewBox="0 0 24 24" className={base} aria-hidden="true">
          <path d="M8 8c2-3 7-2 8 2 1 5-3 9-7 9-3 0-4-3-2-6 1-1 1-3 1-5z" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M14 6c0-2 2-2 3-1" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className={base} aria-hidden="true">
          <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 8v5" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="12" cy="17" r="1" fill="currentColor" />
        </svg>
      );
  }
}

/* =======================
   DATI MENU
======================= */
const MENU: MenuSection[] = [
  {
    title: {
      it: "Caffetteria",
      en: "Coffee drinks",
      fr: "Cafés",
      de: "Kaffeegetränke",
      es: "Cafés",
    },
    items: [
      {
        name: {
          it: "Caffè",
          en: "Coffee",
          fr: "Café",
          de: "Kaffee",
          es: "Café",
        },
        price: 1.4,
      },
      {
        name: {
          it: "Caffè decaffeinato",
          en: "Decaf coffee",
          fr: "Café décaféiné",
          de: "Entkoffeinierter Kaffee",
          es: "Café descafeinado",
        },
        price: 1.5,
      },
      {
        name: {
          it: "Caffè doppio",
          en: "Double coffee",
          fr: "Café double",
          de: "Doppelter Kaffee",
          es: "Café doble",
        },
        price: 2.8,
      },
      {
        name: {
          it: "Caffè ginseng",
          en: "Ginseng coffee",
          fr: "Café au ginseng",
          de: "Ginsengkaffee",
          es: "Café de ginseng",
        },
        allergens: ["latte"],
        price: 1.8,
      },
      {
        name: {
          it: "Caffè d'orzo",
          en: "Barley coffee",
          fr: "Café d'orge",
          de: "Gerstenkaffee",
          es: "Café de cebada",
        },
        allergens: ["orzo"],
        price: 1.8,
      },
      {
        name: {
          it: "Caffè corretto",
          en: "Coffee with liquor",
          fr: "Café correct",
          de: "Kaffee mit Likör",
          es: "Café con licor",
        },
        allergens: ["alcol"],
        price: 2.0,
      },
      {
        name: {
          it: "Caffè shakerato",
          en: "Shaken coffee",
          fr: "Café frappé",
          de: "Shakerato",
          es: "Café agitado",
        },
        price: 3.0,
      },
      {
        name: {
          it: "Caffè con panna",
          en: "Coffee with cream",
          fr: "Café avec crème",
          de: "Kaffee mit Sahne",
          es: "Café con nata",
        },
        allergens: ["latte"],
        price: 2.2,
      },
      {
        name: {
          it: "Marocchino",
          en: "Marocchino",
          fr: "Marocchino",
          de: "Marocchino",
          es: "Marocchino",
        },
        allergens: ["frutta_guscio", "latte"],
        price: 2.2,
      },
      {
        name: {
          it: "Macchiatone",
          en: "Large macchiato",
          fr: "Macchiato grand",
          de: "Großer Macchiato",
          es: "Macchiato grande",
        },
        price: 1.7,
        allergens: ["latte"],
      },
      {
        name: {
          it: "Macchiatone deca",
          en: "Large decaf macchiato",
          fr: "Macchiato grand décaféiné",
          de: "Großer entkoffeinierter Macchiato",
          es: "Macchiato grande descafeinado",
        },
        allergens: ["latte"],
        price: 1.8,
      },
      {
        name: {
          it: "Macchiatone soia",
          en: "Large soy macchiato",
          fr: "Macchiato grand au soja",
          de: "Großer Soja-Macchiato",
          es: "Macchiato grande de soja",
        },
        allergens: ["soia", "latte"],
        price: 2.0,
      },
      {
        name: {
          it: "Macchiatone orzo/ginseng",
          en: "Large barley/ginseng macchiato",
          fr: "Macchiato grand orge/ginseng",
          de: "Großer Gerste/Ginseng-Macchiato",
          es: "Macchiato grande cebada/ginseng",
        },
        allergens: ["latte", "orzo"],
        price: 2.0,
      },
      {
        name: {
          it: "Cappuccino",
          en: "Cappuccino",
          fr: "Cappuccino",
          de: "Cappuccino",
          es: "Capuchino",
        },
        allergens: ["latte"],
        price: 1.9,
      },
      {
        name: {
          it: "Cappuccino deca",
          en: "Decaf cappuccino",
          fr: "Cappuccino décaféiné",
          de: "Entkoffeinierter Cappuccino",
          es: "Capuchino descafeinado",
        },
        allergens: ["latte"],
        price: 2.0,
      },
      {
        name: {
          it: "Cappuccino con crema di latte freddo",
          en: "Cappuccino with cold milk cream",
          fr: "Cappuccino avec crème de lait froid",
          de: "Cappuccino mit kalter Milchcreme",
          es: "Capuchino con crema de leche fría",
        },
        allergens: ["latte"],
        price: 2.3,
      },
      {
        name: {
          it: "Cappuccino soia",
          en: "Soy cappuccino",
          fr: "Cappuccino au soja",
          de: "Soja-Cappuccino",
          es: "Capuchino de soja",
        },
        allergens: ["latte", "soia"],
        price: 2.2,
      },
      {
        name: {
          it: "Cappuccino orzo/ginseng",
          en: "Barley/ginseng cappuccino",
          fr: "Cappuccino orge/ginseng",
          de: "Gerste/Ginseng-Cappuccino",
          es: "Capuchino cebada/ginseng",
        },
        allergens: ["latte", "orzo"],
        price: 2.2,
      },
      {
        name: {
          it: "Latte bianco",
          en: "Steamed milk",
          fr: "Lait chaud",
          de: "Heiße Milch",
          es: "Leche caliente",
        },
        allergens: ["latte"],
        price: 1.5,
      },
      {
        name: {
          it: "Latte macchiato",
          en: "Latte macchiato",
          fr: "Latte macchiato",
          de: "Latte macchiato",
          es: "Latte macchiato",
        },
        allergens: ["latte"],
        price: 2.9,
      },
      {
        name: {
          it: "Latte macchiato deca",
          en: "Decaf latte macchiato",
          fr: "Latte macchiato décaféiné",
          de: "Entkoffeinierter Latte macchiato",
          es: "Latte macchiato descafeinado",
        },
        allergens: ["latte"],
        price: 3.0,
      },
      {
        name: {
          it: "Latte di soia",
          en: "Soy milk",
          fr: "Lait de soja",
          de: "Sojamilch",
          es: "Leche de soja",
        },
        allergens: ["soia"],
        price: 2.0,
      },
      {
        name: {
          it: "Latte macchiato soia",
          en: "Soy latte macchiato",
          fr: "Latte macchiato au soja",
          de: "Soja-Latte macchiato",
          es: "Latte macchiato de soja",
        },
        allergens: ["latte", "soia"],
        price: 3.2,
      },
      {
        name: {
          it: "Cioccolata calda",
          en: "Hot chocolate",
          fr: "Chocolat chaud",
          de: "Heiße Schokolade",
          es: "Chocolate caliente",
        },
        allergens: ["frutta_guscio", "latte"],
        price: 4.5,
      },
      {
        name: {
          it: "Cioccolata calda con panna",
          en: "Hot chocolate with cream",
          fr: "Chocolat chaud avec crème",
          de: "Heiße Schokolade mit Sahne",
          es: "Chocolate caliente con nata",
        },
        allergens: ["latte", "frutta_guscio"],
        price: 5.0,
      },
      {
        name: {
          it: "Tè assortiti",
          en: "Assorted teas",
          fr: "Thés assortis",
          de: "Gemischte Tees",
          es: "Tés variados",
        },
        price: 3.0,
      },
    ],
  },
  {
    title: {
      it: "Brioches e...",
      en: "Croissants & Pastries",
      fr: "Viennoiseries &...",
      de: "Croissants & Gebäck",
      es: "Bollería y...",
    },
    items: [
      {
        name: {
          it: "Brioches",
          en: "Croissants",
          fr: "Croissants",
          de: "Croissants",
          es: "Cruasanes",
        },
        allergens: ["latte", "glutine", "uova"],
        priceNote: "€1,80–€2,50",
      },
      {
        name: {
          it: "Brioches vegana",
          en: "Vegan croissant",
          fr: "Croissant végan",
          de: "Veganer Croissant",
          es: "Cruasán vegano",
        },
        allergens: ["vegano", "glutine", "soia"],
        price: 2.0,
      },
      {
        name: {
          it: "Brioches mignon",
          en: "Mini croissant",
          fr: "Mini‑croissant",
          de: "Mini‑Croissant",
          es: "Mini cruasán",
        },
        allergens: ["uova", "latte", "glutine"],
        price: 1.3,
      },
      {
        name: {
          it: "Pastine",
          en: "Mini pastries",
          fr: "Petites pâtisseries",
          de: "Mini‑Gebäck",
          es: "Pastelería pequeña",
        },
        allergens: ["glutine", "uova", "latte"],
        description: {
          it: "Riso, ricotta o ricotta e cioccolato",
          en: "Rice, ricotta or ricotta and chocolate",
          fr: "Riz, ricotta ou ricotta et chocolat",
          de: "Reis, Ricotta oder Ricotta und Schokolade",
          es: "Arroz, ricotta o ricotta y chocolate",
        },
        price: 2.2,
      },
      {
        name: {
          it: "Pasticciotto",
          en: "Pasticciotto",
          fr: "Pasticciotto",
          de: "Pasticciotto",
          es: "Pasticciotto",
        },
        allergens: ["glutine", "uova", "latte"],
        description: {
          it: "Crema amarena o crema cioccolato",
          en: "Sour cherry cream or chocolate cream",
          fr: "Crème à la griotte ou crème au chocolat",
          de: "Sauerkirschcreme oder Schokocreme",
          es: "Crema de guinda o crema de chocolate",
        },
        price: 2.8,
      },
      {
        name: {
          it: "Sfogliatella con ricotta",
          en: "Ricotta sfogliatella",
          fr: "Sfogliatella à la ricotta",
          de: "Ricotta‑Sfogliatella",
          es: "Sfogliatella de ricotta",
        },
        allergens: ["latte", "uova", "glutine"],
        price: 2.8,
      },
      {
        name: {
          it: "Biscotti da caffè",
          en: "Coffee biscuits",
          fr: "Biscuits pour le café",
          de: "Kaffeekekse",
          es: "Galletas para café",
        },
        allergens: ["latte", "uova", "glutine"],
        description: {
          it: "Mais, cioccolato o caffè",
          en: "Corn, chocolate or coffee",
          fr: "Maïs, chocolat ou café",
          de: "Mais, Schokolade oder Kaffee",
          es: "Maíz, chocolate o café",
        },
        price: 1.0,
      },
      {
        name: {
          it: "Muffin piccolo",
          en: "Small muffin",
          fr: "Petit muffin",
          de: "Kleiner Muffin",
          es: "Muffin pequeño",
        },
        allergens: ["congelato", "latte", "uova", "glutine"],
        description: {
          it: "Marmellata",
          en: "Jam",
          fr: "Confiture",
          de: "Marmelade",
          es: "Mermelada",
        },
        price: 1.5,
      },
      {
        name: {
          it: "Muffin grande",
          en: "Large muffin",
          fr: "Grand muffin",
          de: "Großer Muffin",
          es: "Muffin grande",
        },
        allergens: ["congelato", "latte", "uova", "glutine"],
        description: {
          it: "Marmellata o cioccolato",
          en: "Jam or chocolate",
          fr: "Confiture ou chocolat",
          de: "Marmelade oder Schokolade",
          es: "Mermelada o chocolate",
        },
        price: 2.8,
      },
      {
        name: {
          it: "Donuts",
          en: "Donuts",
          fr: "Donuts",
          de: "Donuts",
          es: "Donuts",
        },
        allergens: ["congelato", "latte", "uova", "glutine"],
        price: 2.5,
      },
      {
        name: {
          it: "Pasticceria mignon",
          en: "Mini pastries",
          fr: "Pâtisseries mignon",
          de: "Mignon‑Gebäck",
          es: "Pastelería mignon",
        },
        allergens: ["latte", "glutine", "uova"],
        price: 1.6,
      },
      {
        name: {
          it: "Frittella",
          en: "Fritter",
          fr: "Beignet",
          de: "Krapfen",
          es: "Buñuelo",
        },
        allergens: ["latte", "uova", "glutine"],
        description: {
          it: "Crema o zabaione",
          en: "Custard or zabaione",
          fr: "Crème pâtissière ou sabayon",
          de: "Vanillecreme oder Zabaione",
          es: "Crema pastelera o zabaione",
        },
        price: 2.6,
      },
      {
        name: {
          it: "Frittella mignon",
          en: "Mini fritter",
          fr: "Mini beignet",
          de: "Mini‑Krapfen",
          es: "Mini buñuelo",
        },
        allergens: ["latte", "uova", "glutine"],
        description: {
          it: "Crema, zabaione o vuota con uvetta e pinoli",
          en: "Custard, zabaione or plain with raisins and pine nuts",
          fr: "Crème, sabayon ou nature avec raisins secs et pignons",
          de: "Vanillecreme, Zabaione oder pur mit Rosinen und Pinienkernen",
          es: "Crema, zabaione o sola con pasas y piñones",
        },
        price: 1.3,
      },
    ],
  },
  {
    title: {
      it: "Succhi di Frutta",
      en: "Fruit Juices",
      fr: "Jus de fruits",
      de: "Fruchtsäfte",
      es: "Zumos de fruta",
    },
    items: [
      {
        name: {
          it: "Succo di pesca",
          en: "Peach juice",
          fr: "Jus de pêche",
          de: "Pfirsichsaft",
          es: "Zumo de melocotón",
        },
        price: 3.0,
      },
      {
        name: {
          it: "Succo ACE",
          en: "ACE juice",
          fr: "Jus ACE",
          de: "ACE-Saft",
          es: "Zumo ACE",
        },
        price: 3.0,
      },
      {
        name: {
          it: "Succo di pera",
          en: "Pear juice",
          fr: "Jus de poire",
          de: "Birnensaft",
          es: "Zumo de pera",
        },
        price: 3.0,
      },
      {
        name: {
          it: "Succo di ananas",
          en: "Pineapple juice",
          fr: "Jus d'ananas",
          de: "Ananassaft",
          es: "Zumo de piña",
        },
        price: 3.0,
      },
      {
        name: {
          it: "Succo di pompelmo",
          en: "Grapefruit juice",
          fr: "Jus de pamplemousse",
          de: "Grapefruitsaft",
          es: "Zumo de pomelo",
        },
        price: 3.0,
      },
      {
        name: {
          it: "Succo di mirtillo",
          en: "Blueberry juice",
          fr: "Jus de myrtille",
          de: "Blaubeersaft",
          es: "Zumo de arándanos",
        },
        price: 3.5,
      },
      {
        name: {
          it: "Succo di pomodoro",
          en: "Tomato juice",
          fr: "Jus de tomate",
          de: "Tomatensaft",
          es: "Zumo de tomate",
        },
        price: 4.0,
      },
    ],
  },
  {
    id: "centrifughe",
    title: {
      it: "Centrifughe",
      en: "Fresh Juices",
      fr: "Jus frais",
      de: "Frischsäfte",
      es: "Zumos naturales",
    },
    items: [
      {
        name: {
          it: "N°1",
          en: "No. 1",
          fr: "N°1",
          de: "Nr. 1",
          es: "N.º 1",
        },
        description: {
          it: "Arancia, carota, limone",
          en: "Orange, carrot, lemon",
          fr: "Orange, carotte, citron",
          de: "Orange, Karotte, Zitrone",
          es: "Naranja, zanahoria, limón",
        },
        price: 5.5,
      },
      {
        name: {
          it: "N°2",
          en: "No. 2",
          fr: "N°2",
          de: "Nr. 2",
          es: "N.º 2",
        },
        description: {
          it: "Mela, arancia, carota, zenzero",
          en: "Apple, orange, carrot, ginger",
          fr: "Pomme, orange, carotte, gingembre",
          de: "Apfel, Orange, Karotte, Ingwer",
          es: "Manzana, naranja, zanahoria, jengibre",
        },
        price: 5.5,
      },
      {
        name: {
          it: "N°3",
          en: "No. 3",
          fr: "N°3",
          de: "Nr. 3",
          es: "N.º 3",
        },
        description: {
          it: "Sedano, mela, kiwi",
          en: "Celery, apple, kiwi",
          fr: "Céleri, pomme, kiwi",
          de: "Sellerie, Apfel, Kiwi",
          es: "Apio, manzana, kiwi",
        },
        allergens: ["sedano"],
        price: 5.5,
      },
      {
        name: {
          it: "N°4",
          en: "No. 4",
          fr: "N°4",
          de: "Nr. 4",
          es: "N.º 4",
        },
        description: {
          it: "Pera, ananas, limone, cannella",
          en: "Pear, pineapple, lemon, cinnamon",
          fr: "Poire, ananas, citron, cannelle",
          de: "Birne, Ananas, Zitrone, Zimt",
          es: "Pera, piña, limón, canela",
        },
        price: 5.5,
      },
      {
        name: {
          it: "N°5",
          en: "No. 5",
          fr: "N°5",
          de: "Nr. 5",
          es: "N.º 5",
        },
        description: {
          it: "Mela, finocchio, ananas, carota",
          en: "Apple, fennel, pineapple, carrot",
          fr: "Pomme, fenouil, ananas, carotte",
          de: "Apfel, Fenchel, Ananas, Karotte",
          es: "Manzana, hinojo, piña, zanahoria",
        },
        price: 5.5,
      },
    ],
  },
  {
    title: {
      it: "Bibite",
      en: "Soft Drinks",
      fr: "Boissons",
      de: "Getränke",
      es: "Bebidas",
    },
    items: [
      {
        name: {
          it: "Spremuta d’arancio",
          en: "Fresh orange juice",
          fr: "Jus d’orange pressé",
          de: "Frisch gepresster Orangensaft",
          es: "Zumo de naranja natural",
        },
        price: 4.0,
      },
      {
        name: {
          it: "Spremuta di pompelmo",
          en: "Fresh grapefruit juice",
          fr: "Jus de pamplemousse pressé",
          de: "Frisch gepresster Grapefruitsaft",
          es: "Zumo de pomelo natural",
        },
        price: 4.5,
      },
      {
        name: {
          it: "Spremuta di melograno",
          en: "Fresh pomegranate juice",
          fr: "Jus de grenade pressé",
          de: "Frisch gepresster Granatapfelsaft",
          es: "Zumo de granada natural",
        },
        price: 5.0,
      },
      {
        name: {
          it: "Coca‑Cola asporto",
          en: "Coca‑Cola (to go)",
          fr: "Coca‑Cola à emporter",
          de: "Coca‑Cola (zum Mitnehmen)",
          es: "Coca‑Cola para llevar",
        },
        price: 3.5,
      },
      {
        name: {
          it: "Coca‑Cola bottiglia in vetro",
          en: "Coca‑Cola (glass bottle)",
          fr: "Coca‑Cola (bouteille en verre)",
          de: "Coca‑Cola (Glasflasche)",
          es: "Coca‑Cola (botella de vidrio)",
        },
        price: 3.5,
      },
      {
        name: {
          it: "Fanta",
          en: "Fanta",
          fr: "Fanta",
          de: "Fanta",
          es: "Fanta",
        },
        price: 3.5,
      },
      {
        name: {
          it: "Tè pesca/limone",
          en: "Iced tea peach/lemon",
          fr: "Thé glacé pêche/citron",
          de: "Eistee Pfirsich/Zitrone",
          es: "Té frío melocotón/limón",
        },
        price: 3.5,
      },
      {
        name: {
          it: "Acqua e menta/sambuco/lampone",
          en: "Water with mint/elderflower/raspberry",
          fr: "Eau à la menthe/sureau/framboise",
          de: "Wasser mit Minze/Holunder/Himbeere",
          es: "Agua con menta/sauco/frambuesa",
        },
        price: 2.5,
      },
      {
        name: {
          it: "Acqua tonica",
          en: "Tonic water",
          fr: "Eau tonique",
          de: "Tonic Water",
          es: "Agua tónica",
        },
        price: 4.0,
      },
      {
        name: {
          it: "Chinotto",
          en: "Chinotto",
          fr: "Chinotto",
          de: "Chinotto",
          es: "Chinotto",
        },
        price: 4.0,
      },
      {
        name: {
          it: "Limonata",
          en: "Lemonade",
          fr: "Limonade",
          de: "Limonade",
          es: "Limonada",
        },
        price: 4.0,
      },
      {
        name: {
          it: "Tassoni",
          en: "Tassoni",
          fr: "Tassoni",
          de: "Tassoni",
          es: "Tassoni",
        },
        price: 4.0,
      },
      {
        name: {
          it: "Bottiglietta d'acqua naturale/gasata 0,5 L",
          en: "Water bottle still/sparkling 0.5L",
          fr: "Bouteille d’eau plate/gazeuse 0,5 l",
          de: "Wasser still/sprudel 0,5 l",
          es: "Botella de agua natural/con gas 0,5 l",
        },
        price: 1.5,
      },
    ],
  },
  {
    title: {
      it: "Snack e Panini",
      en: "Snacks & Sandwiches",
      fr: "Snacks & Sandwichs",
      de: "Snacks & Sandwiches",
      es: "Snacks y bocadillos",
    },
    items: [
      {
        name: {
          it: "Tramezzini assortiti",
          en: "Assorted tramezzini",
          fr: "Tramezzini assortis",
          de: "Gemischte Tramezzini",
          es: "Tramezzini surtidos",
        },
        price: 2.2,
      },
      {
        name: {
          it: "Brioches salate",
          en: "Savory brioches",
          fr: "Brioches salées",
          de: "Herzhafte Brioches",
          es: "Brioches salados",
        },
        price: 3.0,
      },
      {
        name: {
          it: "Paninetti",
          en: "Small sandwiches",
          fr: "Petits sandwiches",
          de: "Kleine Sandwiches",
          es: "Bocadillos pequeños",
        },
        price: 2.5,
      },
      {
        name: {
          it: "Toast",
          en: "Toast",
          fr: "Toast",
          de: "Toast",
          es: "Tostada",
        },
        price: 4.0,
      },
      {
        name: {
          it: "Tostone verdure",
          en: "Veggie tostone",
          fr: "Tostone aux légumes",
          de: "Gemüse‑Tostone",
          es: "Tostone de verduras",
        },
        price: 6.5,
      },
      {
        name: {
          it: "Piadine",
          en: "Piadine",
          fr: "Piadine",
          de: "Piadine",
          es: "Piadine",
        },
        price: 5.0,
      },
      {
        name: {
          it: "Focacce",
          en: "Focaccia",
          fr: "Focaccia",
          de: "Focaccia",
          es: "Focaccia",
        },
        price: 6.0,
      },
      {
        name: {
          it: "Pizzetta",
          en: "Pizzetta",
          fr: "Pizzetta",
          de: "Pizzetta",
          es: "Pizzetta",
        },
        price: 3.0,
      },
      {
        name: {
          it: "Focacce alla curcuma",
          en: "Turmeric focaccia",
          fr: "Focaccia au curcuma",
          de: "Kurkuma‑Focaccia",
          es: "Focaccia de cúrcuma",
        },
        price: 6.0,
      },
      {
        name: {
          it: "Panzerotto",
          en: "Panzerotto",
          fr: "Panzerotto",
          de: "Panzerotto",
          es: "Panzerotto",
        },
        price: 4.5,
      },
      {
        name: {
          it: "Rustico leccese",
          en: "Rustico leccese",
          fr: "Rustico leccese",
          de: "Rustico leccese",
          es: "Rustico leccese",
        },
        price: 4.0,
      },
      {
        name: {
          it: "Polpette verdura o carne",
          en: "Vegetable or meat meatballs",
          fr: "Boulettes de légumes ou de viande",
          de: "Gemüse- oder Fleischbällchen",
          es: "Albóndigas de verdura o carne",
        },
        price: 2.5,
      },
    ],
  },
  {
    title: {
      it: "Pranzi",
      en: "Lunch",
      fr: "Déjeuner",
      de: "Mittagessen",
      es: "Almuerzos",
    },
    items: [
      {
        name: {
          it: "Insalatona",
          en: "Big salad",
          fr: "Grande salade",
          de: "Großer Salat",
          es: "Ensalada grande",
        },
        description: {
          it: "Base insalatona: insalata gentile, radicchio, rucola, carote, pomodorini, finocchio. Aggiunte: uovo €2,00, mozzarella €2,50, gamberetti €3,00, tonno €3,00, olive €1,50, prosciutto cotto €3,00, sfilacci €3,00, mais €1,50, capperi €1,50.",
          en: "Base salad: lettuce, radicchio, arugula, carrots, cherry tomatoes, fennel. Add‑ons: egg €2.00, mozzarella €2.50, shrimp €3.00, tuna €3.00, olives €1.50, cooked ham €3.00, shredded beef €3.00, corn €1.50, capers €1.50.",
          fr: "Base salade: laitue, radicchio, roquette, carottes, tomates cerises, fenouil. Suppléments : œuf 2,00 €, mozzarella 2,50 €, crevettes 3,00 €, thon 3,00 €, olives 1,50 €, jambon cuit 3,00 €, effiloché de bœuf 3,00 €, maïs 1,50 €, câpres 1,50 €.",
          de: "Salatbasis: Kopfsalat, Radicchio, Rucola, Karotten, Cherrytomaten, Fenchel. Extras: Ei 2,00 €, Mozzarella 2,50 €, Garnelen 3,00 €, Thunfisch 3,00 €, Oliven 1,50 €, Kochschinken 3,00 €, Rindfleischstreifen 3,00 €, Mais 1,50 €, Kapern 1,50 €.",
          es: "Base de ensalada: lechuga, radicchio, rúcula, zanahorias, tomates cherry, hinojo. Extras: huevo 2,00 €, mozzarella 2,50 €, gambas 3,00 €, atún 3,00 €, aceitunas 1,50 €, jamón cocido 3,00 €, carne deshilachada 3,00 €, maíz 1,50 €, alcaparras 1,50 €.",
        },
        price: 7.0,
      },
      {
        name: {
          it: "Primi piatti e secondi freschi di gastronomia",
          en: "Fresh pasta and main courses from the deli",
          fr: "Premiers plats et seconds frais de la gastronomie",
          de: "Frische erste und zweite Gänge aus der Feinkost",
          es: "Primeros y segundos frescos de gastronomía",
        },
        price: 0.0,
      },
    ],
  },
  {
    id: "cicchetti-pesce",
    title: {
      it: "Cicchetti di Pesce",
      en: "Seafood Cicchetti",
      fr: "Cicchetti de poisson",
      de: "Fisch-Cicchetti",
      es: "Cicchetti de pescado",
    },
    items: [
      {
        name: {
          it: "Salmone e Philadelphia",
          en: "Salmon & Philadelphia",
          fr: "Saumon & Philadelphia",
          de: "Lachs & Philadelphia",
          es: "Salmón y Philadelphia",
        },
        price: 3.0,
      },
      {
        name: {
          it: "Burrata e cantabrico",
          en: "Burrata & Cantabrian anchovies",
          fr: "Burrata & anchois cantabriques",
          de: "Burrata & Kantabrische Sardellen",
          es: "Burrata y anchoas cantábricas",
        },
        price: 3.0,
      },
      {
        name: {
          it: "Baccalà mantecato e porro",
          en: "Creamed cod & leek",
          fr: "Brandade de morue & poireau",
          de: "Stockfischcreme & Lauch",
          es: "Bacalao mantecado y puerro",
        },
        price: 3.0,
      },
      {
        name: {
          it: "Gambero in saor",
          en: "Sweet‑sour shrimp",
          fr: "Crevette en saor",
          de: "Garnele in saor",
          es: "Gamba en saor",
        },
        price: 3.0,
      },
    ],
  },
  {
    id: "pesce",
    title: {
      it: "Pesce",
      en: "Fish",
      fr: "Poisson",
      de: "Fisch",
      es: "Pescado",
    },
    items: [
      {
        name: {
          it: "Ostriche",
          en: "Oysters",
          fr: "Huîtres",
          de: "Austern",
          es: "Ostras",
        },
        allergens: ["molluschi"],
        price: 4.0,
      },
      {
        name: {
          it: "Scampi crudi",
          en: "Raw scampi",
          fr: "Scampis crus",
          de: "Rohe Scampi",
          es: "Cigalas crudas",
        },
        allergens: ["crostacei"],
        price: 3.0,
      },
      {
        name: {
          it: "Tartare tonno",
          en: "Tuna tartare",
          fr: "Tartare de thon",
          de: "Thunfischtatar",
          es: "Tartar de atún",
        },
        price: 8.0,
      },
      {
        name: {
          it: "Cocktail di gamberetti",
          en: "Shrimp cocktail",
          fr: "Cocktail de crevettes",
          de: "Garnelencocktail",
          es: "Cóctel de gambas",
        },
        allergens: ["crostacei"],
        price: 8.0,
      },
      {
        name: {
          it: "Carpaccio di piovra",
          en: "Octopus carpaccio",
          fr: "Carpaccio de poulpe",
          de: "Oktopus‑Carpaccio",
          es: "Carpaccio de pulpo",
        },
        price: 8.0,
      },
      {
        name: {
          it: "Capasanta gratinata",
          en: "Gratinated scallop",
          fr: "Coquille Saint‑Jacques gratinée",
          de: "Überbackene Jakobsmuschel",
          es: "Vieira gratinada",
        },
        allergens: ["molluschi"],
        price: 4.5,
      },
    ],
  },
  {
    title: {
      it: "Aperitivi Analcolici",
      en: "Non‑Alcoholic Aperitifs",
      fr: "Apéritifs sans alcool",
      de: "Alkoholfreie Aperitifs",
      es: "Aperitivos sin alcohol",
    },
    items: [
      {
        name: {
          it: "Ginger fruit",
          en: "Ginger fruit",
          fr: "Ginger fruit",
          de: "Ginger fruit",
          es: "Ginger fruit",
        },
        description: {
          it: "Passion fruit, granatina, limone, ginger beer",
          en: "Passion fruit, grenadine, lemon, ginger beer",
          fr: "Fruit de la passion, grenadine, citron, ginger beer",
          de: "Maracuja, Grenadine, Zitrone, Ginger Beer",
          es: "Maracuyá, granadina, limón, ginger beer",
        },
        price: 6.0,
      },
      {
        name: {
          it: "Mojito analcolico",
          en: "Virgin mojito",
          fr: "Mojito sans alcool",
          de: "Virgin Mojito",
          es: "Mojito sin alcohol",
        },
        description: {
          it: "Succo di lime, zucchero, lemonsoda, menta",
          en: "Lime juice, sugar, lemon soda, mint",
          fr: "Jus de citron vert, sucre, limonade, menthe",
          de: "Limettensaft, Zucker, Zitronenlimonade, Minze",
          es: "Zumo de lima, azúcar, limonada, menta",
        },
        price: 6.0,
      },
      {
        name: {
          it: "Yellow summer",
          en: "Yellow summer",
          fr: "Yellow summer",
          de: "Yellow summer",
          es: "Yellow summer",
        },
        description: {
          it: "Succo di ananas, limone, ginger beer",
          en: "Pineapple juice, lemon, ginger beer",
          fr: "Jus d'ananas, citron, ginger beer",
          de: "Ananassaft, Zitrone, Ginger Beer",
          es: "Zumo de piña, limón, ginger beer",
        },
        price: 6.0,
      },
      {
        name: {
          it: "Gin tonic analcolico",
          en: "Non‑alcoholic gin tonic",
          fr: "Gin tonic sans alcool",
          de: "Alkoholfreier Gin Tonic",
          es: "Gin tonic sin alcohol",
        },
        description: {
          it: "Gin analcolico Tanqueray 0, acqua tonica",
          en: "Tanqueray 0 non-alcoholic gin, tonic water",
          fr: "Gin sans alcool Tanqueray 0, eau tonique",
          de: "Alkoholfreier Gin Tanqueray 0, Tonic Water",
          es: "Ginebra sin alcohol Tanqueray 0, agua tónica",
        },
        price: 7.0,
      },
      {
        name: {
          it: "Sanbitter passion fruit",
          en: "Sanbitter passion fruit",
          fr: "Sanbitter passion fruit",
          de: "Sanbitter passion fruit",
          es: "Sanbitter passion fruit",
        },
        price: 4.5,
      },
      {
        name: {
          it: "Grapes al pompelmo",
          en: "Grapes grapefruit",
          fr: "Grapes pamplemousse",
          de: "Grapes Grapefruit",
          es: "Grapes pomelo",
        },
        price: 4.5,
      },
      {
        name: {
          it: "Ginger beer",
          en: "Ginger beer",
          fr: "Ginger beer",
          de: "Ginger beer",
          es: "Ginger beer",
        },
        price: 4.0,
      },
      {
        name: {
          it: "Gingerino",
          en: "Gingerino",
          fr: "Gingerino",
          de: "Gingerino",
          es: "Gingerino",
        },
        price: 4.0,
      },
      {
        name: {
          it: "Crodino",
          en: "Crodino",
          fr: "Crodino",
          de: "Crodino",
          es: "Crodino",
        },
        price: 4.0,
      },
      {
        name: {
          it: "Sanbitter",
          en: "Sanbitter",
          fr: "Sanbitter",
          de: "Sanbitter",
          es: "Sanbitter",
        },
        price: 4.0,
      },
    ],
  },
  {
    id: "aperitivi-alcolici",
    title: {
      it: "Aperitivi Alcolici",
      en: "Alcoholic Aperitifs",
      fr: "Apéritifs alcoolisés",
      de: "Alkoholische Aperitifs",
      es: "Aperitivos con alcohol",
    },
    items: [
      {
        name: {
          it: "Spritz Aperol",
          en: "Spritz Aperol",
          fr: "Spritz Aperol",
          de: "Spritz Aperol",
          es: "Spritz Aperol",
        },
        price: 4.0,
      },
      {
        name: {
          it: "Spritz Campari",
          en: "Spritz Campari",
          fr: "Spritz Campari",
          de: "Spritz Campari",
          es: "Spritz Campari",
        },
        price: 4.0,
      },
      {
        name: {
          it: "Spritz Cynar",
          en: "Spritz Cynar",
          fr: "Spritz Cynar",
          de: "Spritz Cynar",
          es: "Spritz Cynar",
        },
        price: 4.0,
      },
      {
        name: {
          it: "Spritz Select",
          en: "Spritz Select",
          fr: "Spritz Select",
          de: "Spritz Select",
          es: "Spritz Select",
        },
        price: 4.0,
      },
      {
        name: {
          it: "Spritz Luxardo",
          en: "Spritz Luxardo",
          fr: "Spritz Luxardo",
          de: "Spritz Luxardo",
          es: "Spritz Luxardo",
        },
        price: 4.0,
      },
      {
        name: {
          it: "Spritz bianco",
          en: "White spritz",
          fr: "Spritz blanc",
          de: "Weißer Spritz",
          es: "Spritz blanco",
        },
        price: 3.5,
      },
      {
        name: {
          it: "Hugo",
          en: "Hugo",
          fr: "Hugo",
          de: "Hugo",
          es: "Hugo",
        },
        price: 4.5,
      },
      {
        name: {
          it: "Campari soda",
          en: "Campari soda",
          fr: "Campari soda",
          de: "Campari soda",
          es: "Campari soda",
        },
        price: 4.0,
      },
      {
        name: {
          it: "Americano",
          en: "Americano",
          fr: "Americano",
          de: "Americano",
          es: "Americano",
        },
        description: {
          it: "Vermut rosso, Campari, acqua gasata",
          en: "Red vermouth, Campari, soda water",
          fr: "Vermouth rouge, Campari, eau gazeuse",
          de: "Roter Wermut, Campari, Sodawasser",
          es: "Vermut rojo, Campari, soda",
        },
        price: 6.0,
      },
      {
        name: {
          it: "Negroni",
          en: "Negroni",
          fr: "Negroni",
          de: "Negroni",
          es: "Negroni",
        },
        description: {
          it: "Vermut rosso, Campari, gin",
          en: "Red vermouth, Campari, gin",
          fr: "Vermouth rouge, Campari, gin",
          de: "Roter Wermut, Campari, Gin",
          es: "Vermut rojo, Campari, ginebra",
        },
        price: 7.0,
      },
      {
        name: {
          it: "Negroni sbagliato",
          en: "Negroni sbagliato",
          fr: "Negroni sbagliato",
          de: "Negroni sbagliato",
          es: "Negroni sbagliato",
        },
        description: {
          it: "Vermut rosso, Campari, prosecco",
          en: "Red vermouth, Campari, prosecco",
          fr: "Vermouth rouge, Campari, prosecco",
          de: "Roter Wermut, Campari, Prosecco",
          es: "Vermut rojo, Campari, prosecco",
        },
        price: 7.0,
      },
      {
        name: {
          it: "Martini bianco/rosso",
          en: "Martini white/red",
          fr: "Martini blanc/rouge",
          de: "Martini weiß/rot",
          es: "Martini blanco/rojo",
        },
        price: 4.0,
      },
      {
        name: {
          it: "Tassoni Aperol",
          en: "Tassoni Aperol",
          fr: "Tassoni Aperol",
          de: "Tassoni Aperol",
          es: "Tassoni Aperol",
        },
        price: 5.0,
      },
      {
        name: {
          it: "Gin tonic",
          en: "Gin & tonic",
          fr: "Gin tonic",
          de: "Gin Tonic",
          es: "Gin tonic",
        },
        description: {
          it: "Greenall's London dry gin, acqua tonica",
          en: "Greenall's London dry gin, tonic water",
          fr: "Gin Greenall's London dry, eau tonique",
          de: "Greenall's London Dry Gin, Tonic Water",
          es: "Ginebra Greenall's London dry, agua tónica",
        },
        price: 7.0,
      },
      {
        name: {
          it: "Bombay tonic",
          en: "Bombay tonic",
          fr: "Bombay tonic",
          de: "Bombay Tonic",
          es: "Bombay tonic",
        },
        description: {
          it: "Bombay sapphire dry gin, acqua tonica",
          en: "Bombay Sapphire dry gin, tonic water",
          fr: "Gin Bombay Sapphire dry, eau tonique",
          de: "Bombay Sapphire Dry Gin, Tonic Water",
          es: "Ginebra Bombay Sapphire dry, agua tónica",
        },
        price: 8.0,
      },
      {
        name: {
          it: "Tanqueray tonic",
          en: "Tanqueray tonic",
          fr: "Tanqueray tonic",
          de: "Tanqueray Tonic",
          es: "Tanqueray tonic",
        },
        description: {
          it: "Tanqueray London dry gin, acqua tonica",
          en: "Tanqueray London dry gin, tonic water",
          fr: "Gin Tanqueray London dry, eau tonique",
          de: "Tanqueray London Dry Gin, Tonic Water",
          es: "Ginebra Tanqueray London dry, agua tónica",
        },
        price: 8.0,
      },
      {
        name: {
          it: "Pompelmo tonic",
          en: "Grapefruit tonic",
          fr: "Tonic pamplemousse",
          de: "Grapefruit Tonic",
          es: "Tónico de pomelo",
        },
        description: {
          it: "Malfi gin rosa al pompelmo, acqua tonica",
          en: "Malfi pink grapefruit gin, tonic water",
          fr: "Gin Malfi rose au pamplemousse, eau tonique",
          de: "Malfi Pink Grapefruit Gin, Tonic Water",
          es: "Ginebra Malfi rosa al pomelo, agua tónica",
        },
        price: 9.0,
      },
      {
        name: {
          it: "Mare tonic",
          en: "Mare tonic",
          fr: "Mare tonic",
          de: "Mare Tonic",
          es: "Mare tonic",
        },
        description: {
          it: "Gin mare mediterranean, acqua tonica",
          en: "Gin Mare Mediterranean, tonic water",
          fr: "Gin Mare Mediterranean, eau tonique",
          de: "Gin Mare Mediterranean, Tonic Water",
          es: "Gin Mare Mediterranean, agua tónica",
        },
        price: 10.0,
      },
      {
        name: {
          it: "Brockmans tonic",
          en: "Brockmans tonic",
          fr: "Brockmans tonic",
          de: "Brockmans Tonic",
          es: "Brockmans tonic",
        },
        description: {
          it: "Brockmans gin frutti di bosco, acqua tonica",
          en: "Brockmans gin (berries), tonic water",
          fr: "Gin Brockmans aux fruits des bois, eau tonique",
          de: "Brockmans Gin (Waldbeeren), Tonic Water",
          es: "Ginebra Brockmans con frutos del bosque, agua tónica",
        },
        price: 10.0,
      },
      {
        name: {
          it: "Gin lemon",
          en: "Gin lemon",
          fr: "Gin lemon",
          de: "Gin lemon",
          es: "Gin lemon",
        },
        price: 7.0,
      },
      {
        name: {
          it: "Vodka redbull",
          en: "Vodka Red Bull",
          fr: "Vodka Red Bull",
          de: "Wodka Red Bull",
          es: "Vodka Red Bull",
        },
        price: 7.0,
      },
      {
        name: {
          it: "Mojito",
          en: "Mojito",
          fr: "Mojito",
          de: "Mojito",
          es: "Mojito",
        },
        price: 7.0,
      },
      {
        name: {
          it: "Mint/basil south side",
          en: "Mint/basil south side",
          fr: "Mint/basil south side",
          de: "Mint/basil south side",
          es: "Mint/basil south side",
        },
        description: {
          it: "Vodka, lime, zucchero, menta o basilico",
          en: "Vodka, lime, sugar, mint or basil",
          fr: "Vodka, citron vert, sucre, menthe ou basilic",
          de: "Wodka, Limette, Zucker, Minze oder Basilikum",
          es: "Vodka, lima, azúcar, menta o albahaca",
        },
        price: 8.0,
      },
      {
        name: {
          it: "Moscow mule",
          en: "Moscow mule",
          fr: "Moscow mule",
          de: "Moscow mule",
          es: "Moscow mule",
        },
        description: {
          it: "Vodka, ginger beer, succo di lime",
          en: "Vodka, ginger beer, lime juice",
          fr: "Vodka, ginger beer, jus de citron vert",
          de: "Wodka, Ginger Beer, Limettensaft",
          es: "Vodka, ginger beer, zumo de lima",
        },
        price: 8.0,
      },
      {
        name: {
          it: "Fernet mule",
          en: "Fernet mule",
          fr: "Fernet mule",
          de: "Fernet mule",
          es: "Fernet mule",
        },
        description: {
          it: "Fernet branca, ginger beer, succo di lime",
          en: "Fernet Branca, ginger beer, lime juice",
          fr: "Fernet Branca, ginger beer, jus de citron vert",
          de: "Fernet Branca, Ginger Beer, Limettensaft",
          es: "Fernet Branca, ginger beer, zumo de lima",
        },
        price: 7.0,
      },
      {
        name: {
          it: "Italian 75",
          en: "Italian 75",
          fr: "Italian 75",
          de: "Italian 75",
          es: "Italian 75",
        },
        description: {
          it: "Gin, succo di limone, zucchero, Trento DOC",
          en: "Gin, lemon juice, sugar, Trento DOC",
          fr: "Gin, jus de citron, sucre, Trento DOC",
          de: "Gin, Zitronensaft, Zucker, Trento DOC",
          es: "Ginebra, zumo de limón, azúcar, Trento DOC",
        },
        price: 9.0,
      },
      {
        name: {
          it: "Grapefruit fizz",
          en: "Grapefruit fizz",
          fr: "Grapefruit fizz",
          de: "Grapefruit fizz",
          es: "Grapefruit fizz",
        },
        description: {
          it: "Succo di pompelmo, gin, Campari, seltz",
          en: "Grapefruit juice, gin, Campari, seltz",
          fr: "Jus de pamplemousse, gin, Campari, seltz",
          de: "Grapefruitsaft, Gin, Campari, Selters",
          es: "Zumo de pomelo, ginebra, Campari, seltz",
        },
        price: 9.0,
      },
      {
        name: {
          it: "Tropic sunset",
          en: "Tropic sunset",
          fr: "Tropic sunset",
          de: "Tropic sunset",
          es: "Tropic sunset",
        },
        description: {
          it: "Succo di ananas, gin, limone, granatina",
          en: "Pineapple juice, gin, lemon, grenadine",
          fr: "Jus d'ananas, gin, citron, grenadine",
          de: "Ananassaft, Gin, Zitrone, Grenadine",
          es: "Zumo de piña, ginebra, limón, granadina",
        },
        price: 9.0,
      },
    ],
  },
  {
    title: {
      it: "Vini Bianchi",
      en: "White Wines",
      fr: "Vins blancs",
      de: "Weißweine",
      es: "Vinos blancos",
    },
    items: [
      {
        name: {
          it: "Trento DOC Masetto privè riserva millesima 2014 - Endrizzi [bottiglia con cofanetto in legno]",
          en: "Trento DOC Masetto privè Riserva 2014 - Endrizzi [bottle with wooden case]",
          fr: "Trento DOC Masetto privè réserve 2014 - Endrizzi [bouteille avec coffret en bois]",
          de: "Trento DOC Masetto privè Riserva 2014 - Endrizzi [Flasche mit Holzkassette]",
          es: "Trento DOC Masetto privè reserva 2014 - Endrizzi [botella con estuche de madera]",
        },
        description: {
          it: "Un Trentodoc che è stato a lungo custodito e riservato esclusivamente per la famiglia e che veniva sboccato à la volée. In occasione dei suoi 130 anni, Endrizzi vuole condividere questa cuvée particolare a dosaggio zero con chi saprà apprezzarne l'unicità. Dopo una lunga maturazione di almeno 84 mesi sui lieviti, mostra aromi eleganti e maturi di tabacco bianco, frutta candita e liquirizia, insieme a note speziate abbinate a una mineralità vivace.",
          en: "A Trentodoc long kept and reserved exclusively for the family, opened à la volée. For its 130th anniversary, Endrizzi shares this special zero‑dosage cuvée with those who can appreciate its uniqueness. After a long maturation of at least 84 months on the lees, it shows elegant, mature aromas of white tobacco, candied fruit and licorice, with spicy notes and a lively minerality.",
          fr: "Un Trentodoc longtemps conservé et réservé exclusivement à la famille, ouvert à la volée. Pour ses 130 ans, Endrizzi partage cette cuvée particulière sans dosage avec ceux qui sauront en apprécier l'unicité. Après un long vieillissement d'au moins 84 mois sur lies, il révèle des arômes élégants et mûrs de tabac blanc, de fruits confits et de réglisse, accompagnés de notes épicées et d'une minéralité vive.",
          de: "Ein Trentodoc, der lange gelagert und ausschließlich für die Familie reserviert wurde und à la volée geöffnet wurde. Zum 130‑jährigen Jubiläum teilt Endrizzi diese besondere Cuvée ohne Dosage mit allen, die ihre Einzigartigkeit schätzen. Nach einer langen Reifezeit von mindestens 84 Monaten auf der Hefe zeigt er elegante, reife Aromen von weißem Tabak, kandierten Früchten und Lakritz, begleitet von würzigen Noten und einer lebhaften Mineralität.",
          es: "Un Trentodoc conservado durante mucho tiempo y reservado exclusivamente para la familia, abierto à la volée. Con motivo de sus 130 años, Endrizzi comparte esta cuvée especial sin dosificación con quienes sepan apreciar su unicidad. Tras una larga crianza de al menos 84 meses sobre lías, muestra aromas elegantes y maduros de tabaco blanco, fruta confitada y regaliz, junto con notas especiadas y una mineralidad viva.",
        },
        bottlePrice: 100.0,
      },
      {
        name: {
          it: "Champagne \"Launois Lebrun\" Millesime by Blanc de Blancs Brut Grand' Cru 100% Chardonnay - Launois Lebrun",
          en: "Champagne \"Launois Lebrun\" Millesime by Blanc de Blancs Brut Grand' Cru 100% Chardonnay - Launois Lebrun",
          fr: "Champagne \"Launois Lebrun\" Millesime by Blanc de Blancs Brut Grand' Cru 100% Chardonnay - Launois Lebrun",
          de: "Champagne \"Launois Lebrun\" Millesime by Blanc de Blancs Brut Grand' Cru 100% Chardonnay - Launois Lebrun",
          es: "Champagne \"Launois Lebrun\" Millesime by Blanc de Blancs Brut Grand' Cru 100% Chardonnay - Launois Lebrun",
        },
        bottlePrice: 70.0,
      },
      {
        name: {
          it: "Champagne \"Launois Lebrun\" Tradition Brut 70% Chardonnay 30% Pinot Nero - Launois Lebrun",
          en: "Champagne \"Launois Lebrun\" Tradition Brut 70% Chardonnay 30% Pinot Nero - Launois Lebrun",
          fr: "Champagne \"Launois Lebrun\" Tradition Brut 70% Chardonnay 30% Pinot Nero - Launois Lebrun",
          de: "Champagne \"Launois Lebrun\" Tradition Brut 70% Chardonnay 30% Pinot Nero - Launois Lebrun",
          es: "Champagne \"Launois Lebrun\" Tradition Brut 70% Chardonnay 30% Pinot Nero - Launois Lebrun",
        },
        bottlePrice: 60.0,
      },
      {
        name: {
          it: "Trento DOC riserva Piancastello zero - Endrizzi",
          en: "Trento DOC Riserva Piancastello Zero - Endrizzi",
          fr: "Trento DOC Riserva Piancastello Zero - Endrizzi",
          de: "Trento DOC Riserva Piancastello Zero - Endrizzi",
          es: "Trento DOC Riserva Piancastello Zero - Endrizzi",
        },
        bottlePrice: 35.0,
      },
      {
        name: {
          it: "Chardonnay MASETTO D'ORÈ - Endrizzi",
          en: "Chardonnay MASETTO D'ORÈ - Endrizzi",
          fr: "Chardonnay MASETTO D'ORÈ - Endrizzi",
          de: "Chardonnay MASETTO D'ORÈ - Endrizzi",
          es: "Chardonnay MASETTO D'ORÈ - Endrizzi",
        },
        bottlePrice: 35.0,
      },
      {
        name: {
          it: "Crémant brut",
          en: "Crémant brut",
          fr: "Crémant brut",
          de: "Crémant brut",
          es: "Crémant brut",
        },
        description: {
          it: "Crémant è realizzato utilizzando il metodo tradizionale Champagne da un'annata. Le mele mature e gli aromi di agrumi profumano il naso. La bocca elegante e le bolle fini portano a un finale fresco.",
          en: "Crémant is made using the traditional Champagne method from a single vintage. Ripe apples and citrus aromas perfume the nose. The palate is elegant and the fine bubbles lead to a fresh finish.",
          fr: "Le Crémant est élaboré selon la méthode traditionnelle champenoise à partir d'un seul millésime. Des pommes mûres et des arômes d'agrumes parfument le nez. La bouche est élégante et les fines bulles mènent à une finale fraîche.",
          de: "Crémant wird nach der traditionellen Champagnermethode aus einem Jahrgang hergestellt. Reife Äpfel und Zitrusaromen prägen die Nase. Am Gaumen elegant, mit feiner Perlage und frischem Finale.",
          es: "El Crémant se elabora con el método tradicional champenoise a partir de una sola añada. Manzanas maduras y aromas cítricos perfuman la nariz. En boca es elegante y las burbujas finas llevan a un final fresco.",
        },
        glassPrice: 6.0,
        bottlePrice: 30.0,
      },
      {
        name: {
          it: "Trento DOC brut - Endrizzi",
          en: "Trento DOC brut - Endrizzi",
          fr: "Trento DOC brut - Endrizzi",
          de: "Trento DOC brut - Endrizzi",
          es: "Trento DOC brut - Endrizzi",
        },
        description: {
          it: "Chardonnay. Maturazione sui lieviti in bottiglia di oltre 24 mesi. Sapido al gusto, ma allo stesso tempo vivace e fresco.",
          en: "Chardonnay. Bottle ageing on the lees for over 24 months. Savory on the palate, yet lively and fresh.",
          fr: "Chardonnay. Élevage sur lies en bouteille pendant plus de 24 mois. Savoureux en bouche, tout en restant vif et frais.",
          de: "Chardonnay. Flaschengärung auf der Hefe über 24 Monate. Würzig am Gaumen, zugleich lebendig und frisch.",
          es: "Chardonnay. Crianza sobre lías en botella durante más de 24 meses. Sabroso en boca, pero a la vez vivo y fresco.",
        },
        glassPrice: 5.0,
        bottlePrice: 25.0,
      },
      {
        name: {
          it: "Lagrein rosè - Bortolotti",
          en: "Lagrein rosé - Bortolotti",
          fr: "Lagrein rosé - Bortolotti",
          de: "Lagrein rosé - Bortolotti",
          es: "Lagrein rosé - Bortolotti",
        },
        description: {
          it: "Offre profumo fruttato, ma con delicate inflessioni di viola. Fresco nel carattere, il sapore è delicatamente fruttato con carezzevoli note di ciliegia, fragola e frutti di bosco per prolungarsi con un finale leggermente ammandorlato.",
          en: "A fruity bouquet with delicate violet nuances. Fresh in character, the taste is gently fruity with caressing notes of cherry, strawberry and berries, finishing with a slightly almondy note.",
          fr: "Un bouquet fruité aux délicates nuances de violette. Frais de caractère, le goût est délicatement fruité avec des notes de cerise, fraise et fruits des bois, pour se prolonger sur une finale légèrement amandée.",
          de: "Fruchtiges Bouquet mit feinen Veilchennoten. Frisch im Charakter, zart fruchtig am Gaumen mit Noten von Kirsche, Erdbeere und Beeren, mit einem leicht mandeligen Finale.",
          es: "Bouquet frutal con delicadas notas de violeta. Fresco de carácter, el sabor es suavemente frutal con notas de cereza, fresa y frutos del bosque, con un final ligeramente almendrado.",
        },
        glassPrice: 5.0,
        bottlePrice: 25.0,
      },
      {
        name: {
          it: "Prosecco extra dry - Bortolotti",
          en: "Prosecco extra dry - Bortolotti",
          fr: "Prosecco extra dry - Bortolotti",
          de: "Prosecco extra dry - Bortolotti",
          es: "Prosecco extra dry - Bortolotti",
        },
        description: {
          it: "Offre profumo fragrante, di timbro floreale dal glicine all’acacia e continua nel gusto appena morbido, gaio, tipicamente fruttato con note di mela, pesca nettarina e pera Williams.",
          en: "It offers a fragrant aroma with floral tones from wisteria to acacia, and continues on the palate, softly smooth, cheerful and typically fruity with notes of apple, nectarine peach and Williams pear.",
          fr: "Arôme parfumé aux accents floraux de glycine et d'acacia, puis une bouche souple, joyeuse, typiquement fruitée avec des notes de pomme, pêche nectarine et poire Williams.",
          de: "Duftend mit floralen Noten von Glyzinie bis Akazie, am Gaumen weich, heiter und typisch fruchtig mit Noten von Apfel, Nektarine und Williamsbirne.",
          es: "Aroma fragante con tonos florales de glicina a acacia, y en boca es suavemente amable, alegre y típicamente frutal con notas de manzana, melocotón nectarina y pera Williams.",
        },
        glassPrice: 4.5,
        bottlePrice: 18.0,
      },
      {
        name: {
          it: "Lugana - Fattori",
          en: "Lugana - Fattori",
          fr: "Lugana - Fattori",
          de: "Lugana - Fattori",
          es: "Lugana - Fattori",
        },
        description: {
          it: "Colore giallo paglierino con riflessi verdognoli anticipa un bouquet aromatico intenso e complesso, con note di fiori bianchi, frutta esotica e agrumi. In bocca è fresco e equilibrato, con una piacevole acidità e una persistenza aromatica.",
          en: "Straw‑yellow color with greenish reflections precedes an intense and complex aromatic bouquet, with notes of white flowers, exotic fruit and citrus. On the palate it is fresh and balanced, with pleasant acidity and aromatic persistence.",
          fr: "La robe jaune paille aux reflets verdâtres précède un bouquet aromatique intense et complexe, avec des notes de fleurs blanches, de fruits exotiques et d'agrumes. En bouche, il est frais et équilibré, avec une agréable acidité et une persistance aromatique.",
          de: "Strohgelbe Farbe mit grünlichen Reflexen, dazu ein intensives und komplexes Bouquet mit Noten von weißen Blüten, exotischen Früchten und Zitrus. Am Gaumen frisch und ausgewogen, mit angenehmer Säure und aromatischer Persistenz.",
          es: "Color amarillo pajizo con reflejos verdosos que anticipa un bouquet aromático intenso y complejo, con notas de flores blancas, fruta exótica y cítricos. En boca es fresco y equilibrado, con una agradable acidez y persistencia aromática.",
        },
        glassPrice: 4.5,
        bottlePrice: 17.0,
      },
      {
        name: {
          it: "Chardonnay - Endrizzi",
          en: "Chardonnay - Endrizzi",
          fr: "Chardonnay - Endrizzi",
          de: "Chardonnay - Endrizzi",
          es: "Chardonnay - Endrizzi",
        },
        glassPrice: 4.5,
        bottlePrice: 20.0,
      },
      {
        name: {
          it: "Gewürztraminer - Meran",
          en: "Gewürztraminer - Meran",
          fr: "Gewürztraminer - Meran",
          de: "Gewürztraminer - Meran",
          es: "Gewürztraminer - Meran",
        },
        description: {
          it: "Il colore è un vivace giallo paglierino con riflessi muschiati. Il bouquet è fiorito con note di rose, menta e melissa. Il sapore è armoniosamente fresco, con morbidezza ed aroma ben equilibrato, retrogusto persistente.",
          en: "The color is a vivid straw yellow with musky reflections. The bouquet is floral with notes of rose, mint and lemon balm. The taste is harmoniously fresh, with softness and a well‑balanced aroma, and a persistent finish.",
          fr: "La couleur est un jaune paille vif aux reflets musqués. Le bouquet est floral avec des notes de rose, de menthe et de mélisse. La bouche est harmonieusement fraîche, avec de la rondeur et un arôme bien équilibré, finale persistante.",
          de: "Die Farbe ist ein leuchtendes Strohgelb mit moschusartigen Reflexen. Das Bouquet ist floral mit Noten von Rose, Minze und Zitronenmelisse. Der Geschmack ist harmonisch frisch, mit Weichheit und gut ausbalanciertem Aroma, nachhaltiger Abgang.",
          es: "El color es un amarillo pajizo vivo con reflejos almizclados. El bouquet es floral con notas de rosa, menta y melisa. El sabor es armoniosamente fresco, con suavidad y aroma bien equilibrado, con final persistente.",
        },
        glassPrice: 5.0,
        bottlePrice: 27.0,
      },
      {
        name: {
          it: "Dalis bianco - Endrizzi",
          en: "Dalis white - Endrizzi",
          fr: "Dalis blanc - Endrizzi",
          de: "Dalis weiß - Endrizzi",
          es: "Dalis blanco - Endrizzi",
        },
        description: {
          it: "Chardonnay, Sauvignon Blanc, Nosiola. Una cuvée da tre uve. Colore giallo paglierino scarico con riflessi verdolini. Profumo intenso floreale vegetale, con note di fiori di sambuco, ribes bianco, mela verde, buccia di cedro e miele. Al gusto fresco, immediato, pulito in ottima sintonia con quanto percepito al naso. Vino di buona struttura e con retrogusto piacevolmente lungo.",
          en: "Chardonnay, Sauvignon Blanc, Nosiola. A cuvée from three grapes. Pale straw‑yellow with greenish reflections. Intense floral and vegetal aromas, with notes of elderflower, white currant, green apple, citron peel and honey. Fresh, immediate and clean on the palate, in harmony with what is perceived on the nose. A well‑structured wine with a pleasantly long finish.",
          fr: "Chardonnay, Sauvignon Blanc, Nosiola. Une cuvée de trois cépages. Robe jaune paille pâle aux reflets verdâtres. Arômes intenses floraux et végétaux, avec des notes de fleurs de sureau, groseille blanche, pomme verte, zeste de cédrat et miel. En bouche, frais, immédiat et net, en parfaite harmonie avec le nez. Vin de bonne structure et à la finale agréablement longue.",
          de: "Chardonnay, Sauvignon Blanc, Nosiola. Eine Cuvée aus drei Rebsorten. Helles Strohgelb mit grünlichen Reflexen. Intensives, floral‑vegetales Bouquet mit Noten von Holunderblüten, weißer Johannisbeere, grünem Apfel, Zitronatzeste und Honig. Am Gaumen frisch, direkt und sauber, in schöner Übereinstimmung mit der Nase. Gut strukturiert mit angenehm langem Nachhall.",
          es: "Chardonnay, Sauvignon Blanc, Nosiola. Una cuvée de tres uvas. Color amarillo pajizo pálido con reflejos verdosos. Aroma intenso floral y vegetal, con notas de flor de saúco, grosella blanca, manzana verde, piel de cidra y miel. En boca es fresco, inmediato y limpio, en perfecta sintonía con lo percibido en nariz. Vino de buena estructura y con un final agradablemente largo.",
        },
        glassPrice: 4.5,
        bottlePrice: 22.0,
      },
      {
        name: {
          it: "Kerner - Meran",
          en: "Kerner - Meran",
          fr: "Kerner - Meran",
          de: "Kerner - Meran",
          es: "Kerner - Meran",
        },
        description: {
          it: "Incrocio di successo tra Schiava e Riesling. Colore giallo paglierino con riflessi verdi. Il bouquet è delicato con note di pesche e moscato. Al palato è ricco ed intenso, persistente.",
          en: "A successful cross between Schiava and Riesling. Straw‑yellow with green reflections. Delicate bouquet with notes of peach and muscat. On the palate it is rich and intense, with a persistent finish.",
          fr: "Croisement réussi entre Schiava et Riesling. Jaune paille aux reflets verts. Bouquet délicat avec des notes de pêche et de muscat. En bouche, riche et intense, finale persistante.",
          de: "Erfolgreiche Kreuzung aus Schiava und Riesling. Strohgelb mit grünen Reflexen. Zartes Bouquet mit Pfirsich‑ und Muskatnoten. Am Gaumen reich und intensiv, mit anhaltendem Nachhall.",
          es: "Cruce exitoso entre Schiava y Riesling. Amarillo pajizo con reflejos verdes. Bouquet delicado con notas de melocotón y moscatel. En boca es rico e intenso, con un final persistente.",
        },
        glassPrice: 4.5,
        bottlePrice: 25.0,
      },
      {
        name: {
          it: "Pinot grigio",
          en: "Pinot grigio",
          fr: "Pinot grigio",
          de: "Pinot grigio",
          es: "Pinot grigio",
        },
        description: {
          it: "Colore giallo paglierino solcato da riflessi ramati, piacevoli note di pera e pesca con richiami floreali.",
          en: "Straw‑yellow color streaked with coppery reflections, pleasant notes of pear and peach with floral hints.",
          fr: "Robe jaune paille aux reflets cuivrés, agréables notes de poire et de pêche avec des touches florales.",
          de: "Strohgelbe Farbe mit kupferfarbenen Reflexen, angenehme Noten von Birne und Pfirsich mit floralen Anklängen.",
          es: "Color amarillo pajizo con reflejos cobrizos, agradables notas de pera y melocotón con toques florales.",
        },
        glassPrice: 4.5,
        bottlePrice: 17.0,
      },
      {
        name: {
          it: "Ribolla gialla",
          en: "Ribolla gialla",
          fr: "Ribolla gialla",
          de: "Ribolla gialla",
          es: "Ribolla gialla",
        },
        description: {
          it: "Sentori di fiori di acacia e dal sapore secco, vellutato, ma allo stesso tempo acido e persistente.",
          en: "Notes of acacia flowers and a dry, velvety taste, yet at the same time acidic and persistent.",
          fr: "Notes de fleurs d’acacia et un goût sec, velouté, mais en même temps acide et persistant.",
          de: "Noten von Akazienblüten und ein trockener, samtiger Geschmack, zugleich aber säurebetont und anhaltend.",
          es: "Notas de flores de acacia y un sabor seco y aterciopelado, pero al mismo tiempo ácido y persistente.",
        },
        glassPrice: 4.5,
        bottlePrice: 17.0,
      },
      {
        name: {
          it: "Riesling - Endrizzi",
          en: "Riesling - Endrizzi",
          fr: "Riesling - Endrizzi",
          de: "Riesling - Endrizzi",
          es: "Riesling - Endrizzi",
        },
        description: {
          it: "Il suo colore è giallo paglierino con riflessi verdolini. Nel profumo si possono identificare note di pesca, pompelmo ed agrumi, unite a sentori floreali, speziati e minerali. Ha sapore fresco e deciso, piacevolmente acido, riporta fedelmente le caratteristiche degli ambienti nordici.",
          en: "Its color is straw yellow with greenish reflections. On the nose you can identify notes of peach, grapefruit and citrus, along with floral, spicy and mineral hints. Fresh and decisive on the palate, pleasantly acidic, it faithfully reflects the characteristics of northern climates.",
          fr: "Sa couleur est jaune paille aux reflets verdâtres. Au nez, on identifie des notes de pêche, de pamplemousse et d'agrumes, associées à des nuances florales, épicées et minérales. En bouche, il est frais et affirmé, agréablement acide, et reflète fidèlement les caractéristiques des climats nordiques.",
          de: "Die Farbe ist strohgelb mit grünlichen Reflexen. In der Nase lassen sich Noten von Pfirsich, Grapefruit und Zitrus erkennen, verbunden mit floralen, würzigen und mineralischen Anklängen. Am Gaumen frisch und prägnant, angenehm säurebetont, spiegelt er die Eigenschaften nördlicher Lagen wider.",
          es: "Su color es amarillo pajizo con reflejos verdosos. En nariz se identifican notas de melocotón, pomelo y cítricos, junto con matices florales, especiados y minerales. En boca es fresco y decidido, agradablemente ácido, y refleja fielmente las características de los climas del norte.",
        },
        glassPrice: 4.5,
        bottlePrice: 25.0,
      },
      {
        name: {
          it: "Soave - Fattori",
          en: "Soave - Fattori",
          fr: "Soave - Fattori",
          de: "Soave - Fattori",
          es: "Soave - Fattori",
        },
        glassPrice: 3.5,
        bottlePrice: 15.0,
      },
    ],
  },
  {
    title: {
      it: "Vini Rossi",
      en: "Red Wines",
      fr: "Vins rouges",
      de: "Rotweine",
      es: "Vinos tintos",
    },
    items: [
      {
        name: {
          it: "Cabernet franc - Salvan",
          en: "Cabernet franc - Salvan",
          fr: "Cabernet franc - Salvan",
          de: "Cabernet franc - Salvan",
          es: "Cabernet franc - Salvan",
        },
        description: {
          it: "Tipicamente erbaceo, con sentori di pepe e peperone verde.",
          en: "Typically herbaceous, with notes of pepper and green bell pepper.",
          fr: "Typiquement herbacé, avec des notes de poivre et de poivron vert.",
          de: "Typisch kräuterig, mit Noten von Pfeffer und grüner Paprika.",
          es: "Típicamente herbáceo, con notas de pimienta y pimiento verde.",
        },
        glassPrice: 4.5,
        bottlePrice: 18.0,
      },
      {
        name: {
          it: "Merlot-Lagrein - Meran",
          en: "Merlot-Lagrein - Meran",
          fr: "Merlot-Lagrein - Meran",
          de: "Merlot-Lagrein - Meran",
          es: "Merlot-Lagrein - Meran",
        },
        description: {
          it: "Colore rosso rubino scuro intenso, note tipiche di bacche, vaniglia e caffè, tannini vellutati, buona persistenza.",
          en: "Deep dark ruby color, typical notes of berries, vanilla and coffee, velvety tannins, good persistence.",
          fr: "Couleur rubis foncé intense, notes typiques de baies, vanille et café, tanins veloutés, belle persistance.",
          de: "Tief dunkelrubin, typische Noten von Beeren, Vanille und Kaffee, samtige Tannine, gute Persistenz.",
          es: "Color rubí oscuro intenso, notas típicas de frutos del bosque, vainilla y café, taninos aterciopelados, buena persistencia.",
        },
        glassPrice: 5.0,
        bottlePrice: 27.0,
      },
      {
        name: {
          it: "Pinot nero Riserva - Meran",
          en: "Pinot noir Riserva - Meran",
          fr: "Pinot noir Riserva - Meran",
          de: "Pinot noir Riserva - Meran",
          es: "Pinot noir Riserva - Meran",
        },
        description: {
          it: "Una parziale pigiatura dell'uva intera e la conservazione in botti di rovere dei piccoli grappoli d'uva fortemente selezionati danno il tocco finale ai re dei vini rossi. Un vino riserva con elevato potenziale d'invecchiamento, con un'acidità ben integrata e un finale persistente.",
          en: "A partial pressing of whole grapes and ageing in oak barrels of small, carefully selected clusters give the final touch to the king of red wines. A reserve wine with great aging potential, well‑integrated acidity and a persistent finish.",
          fr: "Un pressurage partiel de grappes entières et l'élevage en fûts de chêne de petites grappes soigneusement sélectionnées donnent la touche finale au roi des vins rouges. Un vin de réserve au grand potentiel de garde, avec une acidité bien intégrée et une finale persistante.",
          de: "Teilweise Pressung ganzer Trauben und die Reifung in Eichenfässern ausgewählter kleiner Trauben geben dem König der Rotweine den letzten Schliff. Ein Reservewein mit hohem Reifepotenzial, gut integrierter Säure und anhaltendem Finale.",
          es: "Un prensado parcial de uva entera y la crianza en barricas de roble de pequeños racimos cuidadosamente seleccionados dan el toque final al rey de los vinos tintos. Un vino reserva con gran potencial de envejecimiento, con una acidez bien integrada y un final persistente.",
        },
        glassPrice: 6.0,
        bottlePrice: 35.0,
      },
      {
        name: {
          it: "Lagrein - Meran",
          en: "Lagrein - Meran",
          fr: "Lagrein - Meran",
          de: "Lagrein - Meran",
          es: "Lagrein - Meran",
        },
        description: {
          it: "Il colore è rosso granato scuro. Nel naso ha profumi di viola, ciliegie e cioccolato amaro. Il sapore è armonico e delicato con tannini ben strutturati e un finale persistente.",
          en: "The color is deep garnet red. On the nose it has aromas of violet, cherries and bitter chocolate. The taste is harmonious and delicate with well‑structured tannins and a persistent finish.",
          fr: "La robe est rouge grenat foncé. Au nez, des arômes de violette, de cerise et de chocolat amer. La bouche est harmonieuse et délicate avec des tanins bien structurés et une finale persistante.",
          de: "Die Farbe ist tief granatrot. In der Nase Aromen von Veilchen, Kirschen und Bitterschokolade. Am Gaumen harmonisch und fein, mit gut strukturierten Tanninen und anhaltendem Finale.",
          es: "El color es rojo granate oscuro. En nariz presenta aromas de violeta, cereza y chocolate amargo. En boca es armonioso y delicado, con taninos bien estructurados y un final persistente.",
        },
        glassPrice: 5.0,
        bottlePrice: 27.0,
      },
      {
        name: {
          it: "Valpolicella ripasso - Bisano",
          en: "Valpolicella ripasso - Bisano",
          fr: "Valpolicella ripasso - Bisano",
          de: "Valpolicella ripasso - Bisano",
          es: "Valpolicella ripasso - Bisano",
        },
        description: {
          it: "Colore rosso rubino, forte bouquet di fiori con sentori di bacche selvatiche e marmellata; ricco e liscio al palato.",
          en: "Ruby red color, strong floral bouquet with hints of wild berries and jam; rich and smooth on the palate.",
          fr: "Robe rouge rubis, bouquet floral intense avec des notes de baies sauvages et de confiture ; riche et suave en bouche.",
          de: "Rubinrote Farbe, kräftiges Blumenbouquet mit Noten von Waldbeeren und Marmelade; reich und weich am Gaumen.",
          es: "Color rojo rubí, intenso bouquet floral con notas de frutos del bosque y mermelada; rico y suave en boca.",
        },
        glassPrice: 5.0,
        bottlePrice: 18.0,
      },
      {
        name: {
          it: "Masetto nero - Endrizzi",
          en: "Masetto nero - Endrizzi",
          fr: "Masetto nero - Endrizzi",
          de: "Masetto nero - Endrizzi",
          es: "Masetto nero - Endrizzi",
        },
        description: {
          it: "Una cuvée di tre vini rossi: Merlot, Cabernet Sauvignon e Teroldego. Un vino speziato e complesso dal sapore pieno e particolarmente armonico con sentori di mirtillo, lampone, cacao e vaniglia.",
          en: "A cuvée of three red wines: Merlot, Cabernet Sauvignon and Teroldego. A spicy, complex wine with a full and particularly harmonious taste, with notes of blueberry, raspberry, cocoa and vanilla.",
          fr: "Une cuvée de trois vins rouges : Merlot, Cabernet Sauvignon et Teroldego. Un vin épicé et complexe, au goût ample et particulièrement harmonieux, avec des notes de myrtille, framboise, cacao et vanille.",
          de: "Eine Cuvée aus drei Rotweinen: Merlot, Cabernet Sauvignon und Teroldego. Ein würziger, komplexer Wein mit vollem, besonders harmonischem Geschmack und Noten von Heidelbeere, Himbeere, Kakao und Vanille.",
          es: "Una cuvée de tres vinos tintos: Merlot, Cabernet Sauvignon y Teroldego. Un vino especiado y complejo, de sabor pleno y especialmente armonioso, con notas de arándano, frambuesa, cacao y vainilla.",
        },
        glassPrice: 5.0,
        bottlePrice: 25.0,
      },
    ],
  },
  {
    title: {
      it: "Birre",
      en: "Beers",
      fr: "Bières",
      de: "Biere",
      es: "Cervezas",
    },
    items: [
      {
        name: {
          it: "Stella Artois piccola (0,20 lt) — alla spina",
          en: "Stella Artois small (0.20 L) — draft",
          fr: "Stella Artois petite (0,20 L) — pression",
          de: "Stella Artois klein (0,20 L) — vom Fass",
          es: "Stella Artois pequeña (0,20 L) — de barril",
        },
        price: 4.0,
      },
      {
        name: {
          it: "Stella Artois media (0,40 lt) — alla spina",
          en: "Stella Artois medium (0.40 L) — draft",
          fr: "Stella Artois moyenne (0,40 L) — pression",
          de: "Stella Artois mittel (0,40 L) — vom Fass",
          es: "Stella Artois mediana (0,40 L) — de barril",
        },
        price: 5.5,
      },
      {
        name: {
          it: "Leffe rossa — 33 cl",
          en: "Leffe rouge — 33 cl",
          fr: "Leffe rouge — 33 cl",
          de: "Leffe Rot — 33 cl",
          es: "Leffe roja — 33 cl",
        },
        price: 4.0,
      },
      {
        name: {
          it: "Birra artigianale IPA - Ca'Barley — 33 cl",
          en: "Craft beer IPA - Ca'Barley — 33 cl",
          fr: "Bière artisanale IPA - Ca'Barley — 33 cl",
          de: "Craft-Bier IPA - Ca'Barley — 33 cl",
          es: "Cerveza artesanal IPA - Ca'Barley — 33 cl",
        },
        price: 6.0,
      },
      {
        name: {
          it: "Birra artigianale HELLES - Ca'Barley — 33 cl",
          en: "Craft beer HELLES - Ca'Barley — 33 cl",
          fr: "Bière artisanale HELLES - Ca'Barley — 33 cl",
          de: "Craft-Bier HELLES - Ca'Barley — 33 cl",
          es: "Cerveza artesanal HELLES - Ca'Barley — 33 cl",
        },
        price: 6.0,
      },
      {
        name: {
          it: "Birra artigianale BIANCA - Ca'Barley — 33 cl",
          en: "Craft beer WHITE - Ca'Barley — 33 cl",
          fr: "Bière artisanale BLANCHE - Ca'Barley — 33 cl",
          de: "Craft-Bier WEISS - Ca'Barley — 33 cl",
          es: "Cerveza artesanal BLANCA - Ca'Barley — 33 cl",
        },
        price: 6.0,
      },
      {
        name: {
          it: "Corona — 33 cl",
          en: "Corona — 33 cl",
          fr: "Corona — 33 cl",
          de: "Corona — 33 cl",
          es: "Corona — 33 cl",
        },
        price: 4.0,
      },
      {
        name: {
          it: "Messina — 33 cl",
          en: "Messina — 33 cl",
          fr: "Messina — 33 cl",
          de: "Messina — 33 cl",
          es: "Messina — 33 cl",
        },
        price: 4.0,
      },
      {
        name: {
          it: "Ichnusa — 33 cl",
          en: "Ichnusa — 33 cl",
          fr: "Ichnusa — 33 cl",
          de: "Ichnusa — 33 cl",
          es: "Ichnusa — 33 cl",
        },
        price: 4.0,
      },
      {
        name: {
          it: "Heineken — 33 cl",
          en: "Heineken — 33 cl",
          fr: "Heineken — 33 cl",
          de: "Heineken — 33 cl",
          es: "Heineken — 33 cl",
        },
        price: 4.0,
      },
    ],
  },
  {
    title: {
      it: "Amari, Grappe, Whisky",
      en: "Amari, Grappa, Whisky",
      fr: "Amari, grappa, whisky",
      de: "Amari, Grappa, Whisky",
      es: "Amari, grappa, whisky",
    },
    items: [
      {
        name: {
          it: "Amari",
          en: "Amari",
          fr: "Amari",
          de: "Amari",
          es: "Amari",
        },
        price: 4.0,
      },
      {
        name: {
          it: "Grappa barrique 903",
          en: "Grappa barrique 903",
          fr: "Grappa barrique 903",
          de: "Grappa barrique 903",
          es: "Grappa barrique 903",
        },
        price: 5.0,
      },
      {
        name: {
          it: "Jack Daniel’s",
          en: "Jack Daniel’s",
          fr: "Jack Daniel’s",
          de: "Jack Daniel’s",
          es: "Jack Daniel’s",
        },
        price: 6.0,
      },
      {
        name: {
          it: "Ballantine’s",
          en: "Ballantine’s",
          fr: "Ballantine’s",
          de: "Ballantine’s",
          es: "Ballantine’s",
        },
        price: 6.0,
      },
      {
        name: {
          it: "Punch al rum",
          en: "Rum punch",
          fr: "Punch au rhum",
          de: "Rum-Punsch",
          es: "Ponche al ron",
        },
        price: 4.0,
      },
      {
        name: {
          it: "Grappa prime uve",
          en: "Grappa prime uve",
          fr: "Grappa prime uve",
          de: "Grappa prime uve",
          es: "Grappa prime uve",
        },
        price: 4.5,
      },
    ],
  },
];

/* =======================
   FORMAT PREZZI
======================= */
function formatEUR(value: number) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatEURSuffix(value: number) {
  return `${value.toFixed(2).replace(".", ",")}€`;
}

/* =======================
   PAGINA MENU
======================= */
export default function MenuPage() {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [showLegend, setShowLegend] = useState(false);
  const [showCentrifugheNotice, setShowCentrifugheNotice] = useState(false);
  const [showPesceNotice, setShowPesceNotice] = useState(false);
  const [openWineDescription, setOpenWineDescription] = useState<string | null>(null);
  const [allergenFilter, setAllergenFilter] = useState<AllergenKey | null>(null);
  const [allergenHint, setAllergenHint] = useState<AllergenKey | null>(null);
  const [allergenHintItem, setAllergenHintItem] = useState<string | null>(null);
  const allergenHintTimer = useRef<number | null>(null);
  const anchorRef = useRef<HTMLElement | null>(null);
  const anchorTopRef = useRef<number | null>(null);
  const pendingAnchorAdjust = useRef(false);
  const { lang } = useLanguage();
  const t = (key: string) => UI_COPY[lang][key] ?? key;
  const isFriday = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "Europe/Rome",
  }).format(new Date()) === "Fri";
  const showPesceAlways = true;
  const romeTime = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Rome",
  }).format(new Date());
  const isAfter1830 = romeTime >= "18:30";
  const isBefore0600 = romeTime < "06:00";
  const isOutsideCentrifugheHours = isAfter1830 || isBefore0600;
  const hashScrollOffset = 70;

  const toggleSection = (sectionKey: string, isOpen: boolean, anchor?: HTMLElement) => {
    if (anchor) {
      anchorRef.current = anchor;
      anchorTopRef.current = anchor.getBoundingClientRect().top;
      pendingAnchorAdjust.current = true;
    }
    setOpenSection(isOpen ? null : sectionKey);
  };

  useLayoutEffect(() => {
    if (!pendingAnchorAdjust.current || !anchorRef.current || anchorTopRef.current === null) {
      return;
    }
    const newTop = anchorRef.current.getBoundingClientRect().top;
    const delta = newTop - anchorTopRef.current;
    if (delta !== 0) {
      window.scrollBy({ top: delta, left: 0, behavior: "auto" });
    }
    pendingAnchorAdjust.current = false;
  }, [openSection]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    }

    const openFromHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;
      const target = MENU.find((section) => section.id === hash);
      if (!target) return;
      setOpenSection(target.title.it);
      if (hash === "pesce" && !isFriday) {
        setShowPesceNotice(true);
      }
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: Math.max(0, top - hashScrollOffset), behavior: "smooth" });
          const button = el.querySelector("button");
          if (button) {
            (button as HTMLButtonElement).focus({ preventScroll: true });
          }
        }
      }, 0);
    };

    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  return (
    <main
      className="mx-auto max-w-5xl px-6 py-14 space-y-10 text-neutral-900 bg-[#fbfaf7]"
      style={{ overflowAnchor: "none" }}
    >
      <div className="flex flex-wrap items-center gap-4">
        <h1 className="text-4xl font-semibold tracking-tight font-serif">{t("menu")}</h1>
        <button
          type="button"
          onClick={() => setShowLegend(true)}
          className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 shadow-sm hover:bg-neutral-50"
        >
          {t("allergens")}
        </button>
      </div>

      {showLegend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4">
          <div className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl border border-neutral-100 bg-white p-6 text-neutral-900 shadow-xl">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">{t("allergenLegend")}</h2>
              <button
                type="button"
                onClick={() => setShowLegend(false)}
                className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
              >
                {t("close")}
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ALLERGEN_ORDER.map((key) => {
                const allergen = ALLERGEN_LABELS[key][lang];
                const styles = ALLERGEN_STYLES[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setAllergenFilter(key);
                      setShowLegend(false);
                    }}
                    className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-white px-3 py-2 text-left hover:bg-neutral-50"
                  >
                    <span
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-full border bg-white ${styles.ring} ${styles.text}`}
                      aria-hidden="true"
                    >
                      <AllergenIcon type={key} />
                    </span>
                    <span className="text-sm text-neutral-700">{allergen}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {showCentrifugheNotice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
          onClick={() => setShowCentrifugheNotice(false)}
        >
          <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-5 text-neutral-900 shadow-xl">
            <h3 className="text-base font-semibold">Info</h3>
            <p className="mt-2 text-sm text-neutral-600">
              {t("until1830")}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowCentrifugheNotice(false)}
                className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      {showPesceNotice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
          onClick={() => setShowPesceNotice(false)}
        >
          <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-5 text-neutral-900 shadow-xl">
            <h3 className="text-base font-semibold">Info</h3>
            <p className="mt-2 text-sm text-neutral-600">
              {t("fridayOnly")}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPesceNotice(false)}
                className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {allergenFilter && (
        <div className="flex flex-wrap items-center gap-3 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-600">
          <span className="font-semibold text-neutral-800">{t("filterOn")}</span>
          <span>{ALLERGEN_LABELS[allergenFilter][lang]}</span>
          <button
            type="button"
            onClick={() => setAllergenFilter(null)}
            className="ml-2 rounded-full border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            {t("clearFilter")}
          </button>
        </div>
      )}

      {MENU.map((section) => {
        const isOpen = openSection === section.title.it;
        const isPesce = section.id === "pesce";
        const isCentrifughe = section.id === "centrifughe";
        const isWineSection =
          section.title.it === "Vini Bianchi" || section.title.it === "Vini Rossi";
        const isBeerSection = section.title.it === "Birre";
        const isAmariSection = section.title.it === "Amari, Grappe, Whisky";
        const isHiddenToday =
          (isPesce && !isFriday && !showPesceAlways) ||
          (isCentrifughe && isOutsideCentrifugheHours);
        const filteredItems = allergenFilter
          ? section.items.filter((item) => item.allergens?.includes(allergenFilter))
          : section.items;
        const shouldAddAlcoholIcon =
          (isWineSection || isBeerSection || isAmariSection) && !allergenFilter;
        const displayItems = shouldAddAlcoholIcon
          ? filteredItems.map((item) => ({
              ...item,
              allergens: item.allergens
                ? Array.from(new Set([...item.allergens, "alcol"]))
                : ["alcol"],
            }))
          : filteredItems;

        return (
          <section
            key={section.title.it}
            id={section.id}
            className="border-b border-neutral-100 bg-white"
          >
            {/* HEADER */}
            <button
              onClick={(event) => {
                if (isCentrifughe && isOutsideCentrifugheHours) {
                  setShowCentrifugheNotice(true);
                  return;
                }
                if (isPesce && !isFriday && !isOpen) {
                  setShowPesceNotice(true);
                }
                toggleSection(section.title.it, isOpen, event.currentTarget);
              }}
              onMouseDown={(event) => event.preventDefault()}
              className="group relative flex w-full items-center justify-between px-1 py-6 text-left hover:bg-neutral-50"
            >
              <span className="absolute left-0 top-0 h-full w-0.5 bg-transparent transition-colors group-hover:bg-neutral-300" />
              <h2 className="text-lg font-semibold tracking-tight font-serif">
                {section.title[lang]}
              </h2>
              <span
                className={`text-base font-light text-neutral-400 transition-transform ${
                  isOpen ? "rotate-90" : "rotate-0"
                }`}
                aria-hidden="true"
              >
                ›
              </span>
            </button>

            {/* CONTENUTO */}
            {isOpen && (
              <div className="px-1 pb-6 space-y-4">
                {isWineSection && !isHiddenToday && filteredItems.length > 0 && (
                  <div className="flex justify-end text-[11px] uppercase tracking-[0.18em] text-neutral-400">
                    <div className="grid min-w-[86px] grid-cols-2 gap-1 sm:min-w-[100px] sm:gap-2">
                      <span className="text-left">{t("glassLabel")}</span>
                      <span className="text-right">{t("bottleLabel")}</span>
                    </div>
                  </div>
                )}
                {isHiddenToday ? (
                  <p className="text-sm text-neutral-500">
                    {isPesce ? t("fridayOnly") : t("until1830")}
                  </p>
                ) : displayItems.length === 0 ? (
                  <p className="text-sm text-neutral-500">
                    {allergenFilter ? t("noMatches") : t("comingSoon")}
                  </p>
                ) : (
                  displayItems.map((item) => (
                    <article
                      key={`${item.name.it}-${item.price}`}
                      className="border-t border-neutral-100 pt-4"
                    >
                      <div className="flex justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">
                            {item.name[lang]}
                          </h3>
                          {item.allergens && item.allergens.length > 0 && (
                            <div className="flex items-center gap-1">
                              {([...(item.allergens as AllergenKey[])] as AllergenKey[])
                                .sort(
                                  (a, b) =>
                                    (ALLERGEN_SORT_ORDER[a] ?? 999) -
                                    (ALLERGEN_SORT_ORDER[b] ?? 999)
                                )
                                .map((key) => {
                                const allergen = ALLERGEN_LABELS[key][lang];
                                const styles = ALLERGEN_STYLES[key];
                                return (
                                  <span key={key} className="relative inline-flex">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (allergenHintTimer.current) {
                                          window.clearTimeout(allergenHintTimer.current);
                                        }
                                        const next =
                                          allergenHint === key && allergenHintItem === item.name.it
                                            ? null
                                            : key;
                                        setAllergenHint(next);
                                        setAllergenHintItem(next ? item.name.it : null);
                                        if (next) {
                                          allergenHintTimer.current = window.setTimeout(() => {
                                            setAllergenHint(null);
                                            setAllergenHintItem(null);
                                          }, 2000);
                                        }
                                      }}
                                      aria-label={allergen}
                                      className={`inline-flex h-5 w-5 items-center justify-center rounded-full border bg-white ${styles.ring} ${styles.text}`}
                                    >
                                      <AllergenIcon type={key} />
                                    </button>
                                    {allergenHint === key &&
                                      allergenHintItem === item.name.it && (
                                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-neutral-200 bg-white px-2 py-1 text-[10px] text-neutral-700 shadow-sm">
                                          {allergen}
                                        </span>
                                      )}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>

                          {item.description && (
                            isWineSection ? (
                              <div className="mt-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setOpenWineDescription((current) =>
                                      current === item.name.it ? null : item.name.it
                                    )
                                  }
                                  className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400 hover:text-neutral-600"
                                >
                                  {t("descriptionLabel")}
                                </button>
                                {openWineDescription === item.name.it && (
                                  <p className="mt-2 text-sm text-neutral-500">
                                    {typeof item.description === "string"
                                      ? item.description
                                      : item.description[lang]}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <p className="mt-1 text-sm text-neutral-500">
                                {typeof item.description === "string"
                                  ? item.description
                                  : item.description[lang]}
                              </p>
                            )
                          )}
                        </div>

                        {isWineSection ? (
                          <div className="grid min-w-[86px] grid-cols-2 gap-1 text-sm font-semibold text-neutral-800 sm:min-w-[100px] sm:gap-2">
                            <span className="text-left">
                              {typeof item.glassPrice === "number"
                                ? formatEURSuffix(item.glassPrice)
                                : ""}
                            </span>
                            <span className="text-right">
                              {typeof item.bottlePrice === "number"
                                ? formatEURSuffix(item.bottlePrice)
                                : ""}
                            </span>
                          </div>
                        ) : (
                          <div className="font-semibold text-neutral-800">
                            {typeof item.price === "number" ? formatEUR(item.price) : null}
                            {item.priceNote && (
                              <span
                                className={
                                  item.price
                                    ? "ml-2 whitespace-nowrap text-xs font-normal text-neutral-500"
                                    : "whitespace-nowrap"
                                }
                              >
                                {item.priceNote}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </article>
                  ))
                )}
              </div>
            )}
          </section>
        );
      })}
    </main>
  );
}
