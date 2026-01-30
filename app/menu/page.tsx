"use client";

import { useEffect, useState } from "react";
import { useLanguage, type Language } from "../locale-provider";

/* =======================
   TIPI
======================= */
type MenuItem = {
  name: Record<Language, string>;
  description?: string;
  price: number;
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
  },
  en: {
    menu: "Menu",
    allergens: "Allergens",
    allergenLegend: "Allergen legend",
    close: "Close",
    comingSoon: "Coming soon.",
    fridayOnly: "Available only on Fridays.",
    until1830: "Available until 6:30 PM.",
  },
  fr: {
    menu: "Menu",
    allergens: "Allergènes",
    allergenLegend: "Légende des allergènes",
    close: "Fermer",
    comingSoon: "Bientôt disponible.",
    fridayOnly: "Disponible uniquement le vendredi.",
    until1830: "Disponible jusqu’à 18h30.",
  },
  de: {
    menu: "Menü",
    allergens: "Allergene",
    allergenLegend: "Allergen-Legende",
    close: "Schließen",
    comingSoon: "Demnächst verfügbar.",
    fridayOnly: "Nur freitags verfügbar.",
    until1830: "Verfügbar bis 18:30 Uhr.",
  },
  es: {
    menu: "Menú",
    allergens: "Alérgenos",
    allergenLegend: "Leyenda de alérgenos",
    close: "Cerrar",
    comingSoon: "Disponible pronto.",
    fridayOnly: "Disponible solo los viernes.",
    until1830: "Disponible hasta las 18:30.",
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
  "grano",
  "orzo",
  "avena",
  "segale",
  "farro",
  "kamut",
  "frutta_guscio",
  "nocciole",
  "noci",
  "mandorle",
  "pistacchi",
  "arachidi",
  "noci_brasiliane",
  "anacardi",
  "macadamia",
  "noce_pecan",
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
    case "soia":
    case "vegano":
    case "vegetariano":
    case "bio":
      return (
        <svg viewBox="0 0 24 24" className={base} aria-hidden="true">
          <path d="M6 14c6-1 8-6 12-8 0 6-4 11-10 11-1 0-2 0-2-3z" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M9 12c2 2 4 3 6 4" stroke="currentColor" strokeWidth="1.6" />
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
        price: 2.0,
      },
      {
        name: {
          it: "Cioccolata calda",
          en: "Hot chocolate",
          fr: "Chocolat chaud",
          de: "Heiße Schokolade",
          es: "Chocolate caliente",
        },
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
      {
        name: {
          it: "Latte macchiato soia",
          en: "Soy latte macchiato",
          fr: "Latte macchiato au soja",
          de: "Soja-Latte macchiato",
          es: "Latte macchiato de soja",
        },
        price: 3.2,
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
    items: [],
  },
  {
    title: {
      it: "Succhi di Frutta",
      en: "Fruit Juices",
      fr: "Jus de fruits",
      de: "Fruchtsäfte",
      es: "Zumos de fruta",
    },
    items: [],
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
    items: [],
  },
  {
    title: {
      it: "Bibite",
      en: "Soft Drinks",
      fr: "Boissons",
      de: "Getränke",
      es: "Bebidas",
    },
    items: [],
  },
  {
    title: {
      it: "Snack e Panini",
      en: "Snacks & Sandwiches",
      fr: "Snacks & Sandwichs",
      de: "Snacks & Sandwiches",
      es: "Snacks y bocadillos",
    },
    items: [],
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
    items: [],
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
    items: [],
  },
  {
    title: {
      it: "Aperitivi Analcolici",
      en: "Non‑Alcoholic Aperitifs",
      fr: "Apéritifs sans alcool",
      de: "Alkoholfreie Aperitifs",
      es: "Aperitivos sin alcohol",
    },
    items: [],
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
    items: [],
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
  const { lang } = useLanguage();
  const t = (key: string) => UI_COPY[lang][key] ?? key;
  const isFriday = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "Europe/Rome",
  }).format(new Date()) === "Fri";
  const romeTime = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Rome",
  }).format(new Date());
  const isBefore1830 = romeTime <= "18:30";

  useEffect(() => {
    const openFromHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;
      const target = MENU.find((section) => section.id === hash);
      if (target) {
        setOpenSection(target.title.it);
      }
    };

    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-14 space-y-10 text-neutral-900 bg-[#fbfaf7]">
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
                  <div
                    key={key}
                    className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-white px-3 py-2"
                  >
                    <span
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-full border bg-white ${styles.ring} ${styles.text}`}
                      aria-hidden="true"
                    >
                      <AllergenIcon type={key} />
                    </span>
                    <span className="text-sm text-neutral-700">{allergen}</span>
                  </div>
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

      {MENU.map((section) => {
        const isOpen = openSection === section.title.it;
        const isPesce = section.id === "pesce";
        const isCentrifughe = section.id === "centrifughe";
        const isHiddenToday = (isPesce && !isFriday) || (isCentrifughe && !isBefore1830);

        return (
          <section
            key={section.title.it}
            id={section.id}
            className="border-b border-neutral-100 bg-white"
          >
            {/* HEADER */}
            <button
              onClick={() => {
                if (isCentrifughe && !isBefore1830) {
                  setShowCentrifugheNotice(true);
                  return;
                }
                setOpenSection(isOpen ? null : section.title.it);
              }}
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
                ) : section.items.length === 0 ? (
                  <p className="text-sm text-neutral-500">
                    {t("comingSoon")}
                  </p>
                ) : (
                  section.items.map((item) => (
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
                              {item.allergens.map((key) => {
                                const allergen = ALLERGENS[key][lang];
                                const styles = ALLERGEN_STYLES[key];
                                return (
                                  <span
                                    key={key}
                                    title={allergen}
                                    aria-label={allergen}
                                    className={`inline-flex h-5 w-5 items-center justify-center rounded-full border bg-white ${styles.ring} ${styles.text}`}
                                  >
                                    <AllergenIcon type={key} />
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
                          {formatEUR(item.price)}
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
