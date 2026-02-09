"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLanguage, type Language } from "../locale-provider";

/* =======================
   TIPI
======================= */
type MenuItem = {
  name: Record<Language, string>;
  description?: string;
  price?: number;
  priceNote?: string;
  tag?: string;
  allergens?: AllergenKey[];
};

type MenuSection = {
  id?: string;
  title: Record<Language, string>;
  items: MenuItem[];
};

type AllergenKey =
  | "latte"
  | "uova"
  | "soia"
  | "pesce"
  | "crostacei"
  | "sedano"
  | "molluschi"
  | "solfiti"
  | "lupini"
  | "senape"
  | "sesamo"
  | "glutine"
  | "grano"
  | "orzo"
  | "avena"
  | "segale"
  | "farro"
  | "kamut"
  | "frutta_guscio"
  | "nocciole"
  | "noci"
  | "mandorle"
  | "pistacchi"
  | "arachidi"
  | "noci_brasiliane"
  | "anacardi"
  | "macadamia"
  | "noce_pecan"
  | "alcol"
  | "congelato"
  | "vegano"
  | "vegetariano"
  | "halal"
  | "kosher"
  | "bio"
  | "piccante"
  | "abbattuto";

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
  },
};

const ALLERGEN_ORDER: AllergenKey[] = [
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
];

const ALLERGEN_SORT_ORDER: Record<AllergenKey, number> = ALLERGEN_ORDER.reduce(
  (acc, key, index) => {
    acc[key] = index;
    return acc;
  },
  {} as Record<AllergenKey, number>
);

const ALLERGENS: Record<AllergenKey, Record<Language, string>> = {
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
};

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
        price: 2.3,
      },
      {
        name: {
          it: "Cappuccio soia",
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
          it: "The assortiti",
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
        description: "Riso, ricotta o ricotta e cioccolato",
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
        description: "Crema amarena o crema cioccolato",
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
        description: "Mais, cioccolato o caffè",
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
        description: "Marmellata",
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
        description: "Marmellata o cioccolato",
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
        description: "Crema o zabaione",
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
        description: "Crema, zabaione o vuota con uvetta e pinoli",
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
          it: "Succo pesca",
          en: "Peach juice",
          fr: "Jus de pêche",
          de: "Pfirsichsaft",
          es: "Zumo de melocotón",
        },
        price: 3.0,
      },
      {
        name: {
          it: "Succo ace",
          en: "ACE juice",
          fr: "Jus ACE",
          de: "ACE-Saft",
          es: "Zumo ACE",
        },
        price: 3.0,
      },
      {
        name: {
          it: "Succo pera",
          en: "Pear juice",
          fr: "Jus de poire",
          de: "Birnensaft",
          es: "Zumo de pera",
        },
        price: 3.0,
      },
      {
        name: {
          it: "Succo ananas",
          en: "Pineapple juice",
          fr: "Jus d'ananas",
          de: "Ananassaft",
          es: "Zumo de piña",
        },
        price: 3.0,
      },
      {
        name: {
          it: "Succo pompelmo",
          en: "Grapefruit juice",
          fr: "Jus de pamplemousse",
          de: "Grapefruitsaft",
          es: "Zumo de pomelo",
        },
        price: 3.0,
      },
      {
        name: {
          it: "Succo mirtillo",
          en: "Blueberry juice",
          fr: "Jus de myrtille",
          de: "Blaubeersaft",
          es: "Zumo de arándanos",
        },
        price: 3.5,
      },
      {
        name: {
          it: "Succo pomodoro",
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
        description: "Arancia, carota, limone",
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
        description: "Mela, arancia, carota, zenzero",
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
        description: "Sedano, mela, kiwi",
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
        description: "Pera, ananas, limone, cannella",
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
        description: "Mela, finocchio, ananas, carota",
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
          it: "Coca‑Cola bottiglia vetro",
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
          it: "Bottiglietta d'acqua naturale/gasata 0,5l",
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
    items: [],
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
        description: "Passion fruit, granatina, limone, ginger beer",
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
        description: "Succo di lime, zucchero, lemonsoda, menta",
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
        description: "Succo di ananas, limone, ginger beer",
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
        description: "Gin analcolico Tanqueray 0, acqua tonica",
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
          it: "Cordino",
          en: "Cordino",
          fr: "Cordino",
          de: "Cordino",
          es: "Cordino",
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
        description: "Vermut rosso, Campari, acqua gasata",
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
        description: "Vermut rosso, Campari, gin",
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
        description: "Vermut rosso, Campari, prosecco",
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
        description: "Greenall's London dry gin, acqua tonica",
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
        description: "Bombay sapphire dry gin, acqua tonica",
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
        description: "Tanqueray London dry gin, acqua tonica",
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
        description: "Malfi gin rosa al pompelmo, acqua tonica",
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
        description: "Gin mare mediterranean, acqua tonica",
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
        description: "Brockmans gin frutti di bosco, acqua tonica",
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
        description: "Vodka, lime, zucchero, menta o basilico",
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
        description: "Vodka, ginger beer, succo di lime",
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
        description: "Fernet branca, ginger beer, succo di lime",
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
        description: "Gin, succo di limone, zucchero, Trento DOC",
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
        description: "Succo di pompelmo, gin, Campari, seltz",
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
        description: "Succo di ananas, gin, limone, granatina",
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
    items: [],
  },
  {
    title: {
      it: "Vini Rossi",
      en: "Red Wines",
      fr: "Vins rouges",
      de: "Rotweine",
      es: "Vinos tintos",
    },
    items: [],
  },
  {
    title: {
      it: "Birre",
      en: "Beers",
      fr: "Bières",
      de: "Biere",
      es: "Cervezas",
    },
    items: [],
  },
  {
    title: {
      it: "Amari, Grappe, Whisky",
      en: "Amari, Grappa, Whisky",
      fr: "Amari, grappa, whisky",
      de: "Amari, Grappa, Whisky",
      es: "Amari, grappa, whisky",
    },
    items: [],
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

/* =======================
   PAGINA MENU
======================= */
export default function MenuPage() {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [showLegend, setShowLegend] = useState(false);
  const [showCentrifugheNotice, setShowCentrifugheNotice] = useState(false);
  const [showPesceNotice, setShowPesceNotice] = useState(false);
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
          window.scrollTo({ top: Math.max(0, top - 28), behavior: "smooth" });
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
                const allergen = ALLERGENS[key][lang];
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
          <span>{ALLERGENS[allergenFilter][lang]}</span>
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
        const isHiddenToday =
          (isPesce && !isFriday && !showPesceAlways) ||
          (isCentrifughe && isOutsideCentrifugheHours);
        const filteredItems = allergenFilter
          ? section.items.filter((item) => item.allergens?.includes(allergenFilter))
          : section.items;

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
                {isHiddenToday ? (
                  <p className="text-sm text-neutral-500">
                    {isPesce ? t("fridayOnly") : t("until1830")}
                  </p>
                ) : filteredItems.length === 0 ? (
                  <p className="text-sm text-neutral-500">
                    {allergenFilter ? t("noMatches") : t("comingSoon")}
                  </p>
                ) : (
                  filteredItems.map((item) => (
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
                              {[...item.allergens]
                                .sort(
                                  (a, b) =>
                                    (ALLERGEN_SORT_ORDER[a] ?? 999) -
                                    (ALLERGEN_SORT_ORDER[b] ?? 999)
                                )
                                .map((key) => {
                                const allergen = ALLERGENS[key][lang];
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
                            <p className="mt-1 text-sm text-neutral-500">
                              {item.description}
                            </p>
                          )}
                        </div>

                        <div className="font-semibold text-neutral-800">
                          {typeof item.price === "number" ? formatEUR(item.price) : null}
                          {item.priceNote && (
                            <span className={item.price ? "ml-2 text-xs font-normal text-neutral-500" : ""}>
                              {item.priceNote}
                            </span>
                          )}
                        </div>
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
