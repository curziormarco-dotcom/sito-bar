"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLanguage, type Language } from "../locale-provider";
import { MENU } from "./menu-data";
import { inferAllergens, itemIsAllowedForSelectedAllergens, toggleAllergenFilter } from "./menu-logic";

const UI_COPY: Record<Language, Record<string, string>> = {
  it: {
    menu: "Menù",
    allergens: "Allergeni",
    allergenLegend: "Legenda allergeni",
    allergenHint: "Seleziona un allergene per nascondere i prodotti che lo contengono.",
    close: "Chiudi",
    comingSoon: "Disponibile presto.",
    fridayOnly: "Disponibile solo il venerdì.",
    thursdayFridayOnly: "Disponibile solo il giovedì e il venerdì.",
    until1830: "Disponibile fino alle 18:30.",
    filterOn: "Allergeni esclusi:",
    clearFilter: "Rimuovi filtro",
    resultsLabel: "risultati",
    noMatches: "Nessun prodotto disponibile con questi allergeni esclusi.",
    descriptionLabel: "Descrizione",
    glassLabel: "Calice",
    bottleLabel: "Bottiglia",
  },
  en: {
    menu: "Menu",
    allergens: "Allergens",
    allergenLegend: "Allergen legend",
    allergenHint: "Select an allergen to hide products that contain it.",
    close: "Close",
    comingSoon: "Coming soon.",
    fridayOnly: "Available only on Fridays.",
    thursdayFridayOnly: "Available only on Thursdays and Fridays.",
    until1830: "Available until 6:30 PM.",
    filterOn: "Excluded allergens:",
    clearFilter: "Clear filter",
    resultsLabel: "results",
    noMatches: "No products available with these allergens excluded.",
    descriptionLabel: "Description",
    glassLabel: "Glass",
    bottleLabel: "Bottle",
  },
  fr: {
    menu: "Menu",
    allergens: "Allergènes",
    allergenLegend: "Légende des allergènes",
    allergenHint: "Sélectionnez un allergène pour masquer les produits qui le contiennent.",
    close: "Fermer",
    comingSoon: "Bientôt disponible.",
    fridayOnly: "Disponible uniquement le vendredi.",
    thursdayFridayOnly: "Disponible uniquement le jeudi et le vendredi.",
    until1830: "Disponible jusqu’à 18h30.",
    filterOn: "Allergènes exclus :",
    clearFilter: "Retirer le filtre",
    resultsLabel: "résultats",
    noMatches: "Aucun produit disponible avec ces allergènes exclus.",
    descriptionLabel: "Description",
    glassLabel: "Verre",
    bottleLabel: "Bouteille",
  },
  de: {
    menu: "Menü",
    allergens: "Allergene",
    allergenLegend: "Allergen-Legende",
    allergenHint: "Wähle ein Allergen aus, um Produkte auszublenden, die es enthalten.",
    close: "Schließen",
    comingSoon: "Demnächst verfügbar.",
    fridayOnly: "Nur freitags verfügbar.",
    thursdayFridayOnly: "Nur donnerstags und freitags verfügbar.",
    until1830: "Verfügbar bis 18:30 Uhr.",
    filterOn: "Ausgeschlossene Allergene:",
    clearFilter: "Filter entfernen",
    resultsLabel: "Ergebnisse",
    noMatches: "Keine Produkte verfügbar, wenn diese Allergene ausgeschlossen werden.",
    descriptionLabel: "Beschreibung",
    glassLabel: "Glas",
    bottleLabel: "Flasche",
  },
  es: {
    menu: "Menú",
    allergens: "Alérgenos",
    allergenLegend: "Leyenda de alérgenos",
    allergenHint: "Selecciona un alérgeno para ocultar los productos que lo contienen.",
    close: "Cerrar",
    comingSoon: "Disponible pronto.",
    fridayOnly: "Disponible solo los viernes.",
    thursdayFridayOnly: "Disponible solo los jueves y viernes.",
    until1830: "Disponible hasta las 18:30.",
    filterOn: "Alérgenos excluidos:",
    clearFilter: "Quitar filtro",
    resultsLabel: "resultados",
    noMatches: "No hay productos disponibles con estos alérgenos excluidos.",
    descriptionLabel: "Descripción",
    glassLabel: "Copa",
    bottleLabel: "Botella",
  },
};

const CAPPUCCINO_FREDDO_NOTICE_STORAGE_KEY = "bar-da-luciano-cappuccino-freddo-notice-seen";

function formatCategoryTitle(title: string) {
  if (!title) return title;
  return title.charAt(0) + title.slice(1).toLocaleLowerCase();
}

function getRomeDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (type: "year" | "month" | "day") => Number(parts.find((part) => part.type === type)?.value);
  return { year: get("year"), month: get("month"), day: get("day") };
}

function getEasterSunday(year: number) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day));
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function isDuringCarnevale(date: Date) {
  const { year, month, day } = getRomeDateParts(date);
  const romeDate = new Date(Date.UTC(year, month - 1, day));
  const easterSunday = getEasterSunday(year);
  const ashWednesday = addDays(easterSunday, -46);
  const carnevaleStart = addDays(ashWednesday, -20);
  const carnevaleEnd = addDays(ashWednesday, -1);
  return romeDate >= carnevaleStart && romeDate <= carnevaleEnd;
}

function shouldHideMenuItem(itemName: string, isCarnevalePeriod: boolean) {
  if (!isCarnevalePeriod && itemName.toLocaleLowerCase().includes("frittella")) {
    return true;
  }
  return false;
}

type AllergenKey = keyof typeof ALLERGEN_LABELS;

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
  "arachidi",
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

const KNOWN_ALLERGENS = new Set<AllergenKey>(Object.keys(ALLERGEN_LABELS) as AllergenKey[]);

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
  const [showCicchettiPesceNotice, setShowCicchettiPesceNotice] = useState(false);
  const [showCappuccinoFreddoNotice, setShowCappuccinoFreddoNotice] = useState(false);
  const [openWineDescription, setOpenWineDescription] = useState<string | null>(null);
  const [allergenFilters, setAllergenFilters] = useState<AllergenKey[]>([]);
  const [allergenHint, setAllergenHint] = useState<AllergenKey | null>(null);
  const [allergenHintItem, setAllergenHintItem] = useState<string | null>(null);
  const allergenHintTimer = useRef<number | null>(null);
  const anchorRef = useRef<HTMLElement | null>(null);
  const anchorTopRef = useRef<number | null>(null);
  const pendingAnchorAdjust = useRef(false);
  const { lang } = useLanguage();
  const t = (key: string) => UI_COPY[lang][key] ?? key;
  const allergenFilterSet = useMemo(() => new Set(allergenFilters), [allergenFilters]);
  const hasActiveAllergenFilter = allergenFilters.length > 0;
  const isCarnevalePeriod = isDuringCarnevale(new Date());
  const menuWithAllergens = useMemo(
    () =>
      MENU.map((section) => ({
        ...section,
        items: section.items
          .filter((item) => !shouldHideMenuItem(item.name.it, isCarnevalePeriod))
          .map((item) => {
            const inferred = inferAllergens(section, item, {
              knownAllergens: KNOWN_ALLERGENS,
              sortOrder: ALLERGEN_SORT_ORDER,
            });
            return inferred ? { ...item, allergens: inferred as AllergenKey[] } : item;
          }),
      })),
    [isCarnevalePeriod]
  );
  const visibleResultCount = useMemo(
    () =>
      menuWithAllergens.reduce((acc, section) => {
        const sectionCount = hasActiveAllergenFilter
          ? section.items.filter((item) => itemIsAllowedForSelectedAllergens(item, allergenFilterSet)).length
          : section.items.length;
        return acc + sectionCount;
      }, 0),
    [allergenFilterSet, hasActiveAllergenFilter, menuWithAllergens]
  );
  const romeWeekday = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "Europe/Rome",
  }).format(new Date());
  const isFriday = romeWeekday === "Fri";
  const isThursdayOrFriday = romeWeekday === "Thu" || isFriday;
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

  useEffect(() => {
    let shouldShow = false;
    try {
      if (!window.localStorage.getItem(CAPPUCCINO_FREDDO_NOTICE_STORAGE_KEY)) {
        window.localStorage.setItem(CAPPUCCINO_FREDDO_NOTICE_STORAGE_KEY, "true");
        shouldShow = true;
      }
    } catch {
      shouldShow = true;
    }

    if (!shouldShow) return;
    const timer = window.setTimeout(() => setShowCappuccinoFreddoNotice(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

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
      if (hash === "cicchetti-pesce" && !isThursdayOrFriday) {
        setShowCicchettiPesceNotice(true);
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
  }, [isFriday, isThursdayOrFriday]);

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

      {showCappuccinoFreddoNotice && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-8 sm:p-12"
          onClick={() => setShowCappuccinoFreddoNotice(false)}
        >
          <div
            className="relative w-full max-w-[520px]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Chiudi avviso"
              onClick={() => setShowCappuccinoFreddoNotice(false)}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-2xl leading-none text-neutral-900 shadow-md hover:bg-white"
            >
              ×
            </button>
            <Image
              src="/images/cappuccino-freddo.jpg"
              alt="Prova il cappuccino freddo, perfetto per l'estate"
              width={1086}
              height={1448}
              priority
              className="max-h-[calc(100vh-7rem)] w-full rounded-md object-contain shadow-2xl"
            />
          </div>
        </div>
      )}

      {showLegend && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4"
          onPointerDown={(event) => {
            if (event.target !== event.currentTarget) return;
            event.preventDefault();
            event.stopPropagation();
            setShowLegend(false);
          }}
          onClick={(event) => {
            if (event.target !== event.currentTarget) return;
            event.preventDefault();
            event.stopPropagation();
          }}
        >
          <div
            className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl border border-neutral-100 bg-white p-6 text-neutral-900 shadow-xl"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
          >
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
              <p className="sm:col-span-2 lg:col-span-3 text-sm text-neutral-500">
                {t("allergenHint")}
              </p>
              {ALLERGEN_ORDER.map((key) => {
                const allergen = ALLERGEN_LABELS[key][lang];
                const styles = ALLERGEN_STYLES[key];
                const isSelected = allergenFilterSet.has(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setAllergenFilters((current) => toggleAllergenFilter(current, key));
                    }}
                    className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-left hover:bg-neutral-50 ${
                      isSelected ? "border-neutral-300 bg-neutral-50" : "border-neutral-100 bg-white"
                    }`}
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
      {showCicchettiPesceNotice && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
          onClick={() => setShowCicchettiPesceNotice(false)}
        >
          <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-5 text-neutral-900 shadow-xl">
            <h3 className="text-base font-semibold">Info</h3>
            <p className="mt-2 text-sm text-neutral-600">
              {t("thursdayFridayOnly")}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowCicchettiPesceNotice(false)}
                className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {hasActiveAllergenFilter && (
        <div className="flex flex-wrap items-center gap-3 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-600">
          <span className="font-semibold text-neutral-800">{t("filterOn")}</span>
          <span>{allergenFilters.map((key) => ALLERGEN_LABELS[key][lang]).join(", ")}</span>
          <span className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-700">
            {visibleResultCount} {t("resultsLabel")}
          </span>
          <button
            type="button"
            onClick={() => setAllergenFilters([])}
            className="ml-2 rounded-full border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
          >
            {t("clearFilter")}
          </button>
        </div>
      )}

      {menuWithAllergens.map((section) => {
        const isOpen = openSection === section.title.it;
        const isPesce = section.id === "pesce";
        const isCicchettiPesce = section.id === "cicchetti-pesce";
        const isCentrifughe = section.id === "centrifughe";
        const isWineSection =
          section.title.it === "Vini Bianchi" || section.title.it === "Vini Rossi";
        const isHiddenToday =
          (isPesce && !isFriday && !showPesceAlways) ||
          (isCentrifughe && isOutsideCentrifugheHours);
        const filteredItems = hasActiveAllergenFilter
          ? section.items.filter((item) => itemIsAllowedForSelectedAllergens(item, allergenFilterSet))
          : section.items;
        const displayItems = filteredItems;

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
                if (isCicchettiPesce && !isThursdayOrFriday && !isOpen) {
                  setShowCicchettiPesceNotice(true);
                }
                toggleSection(section.title.it, isOpen, event.currentTarget);
              }}
              onMouseDown={(event) => event.preventDefault()}
              className="group relative flex w-full items-center justify-between px-1 py-6 text-left hover:bg-neutral-50"
            >
              <span className="absolute left-0 top-0 h-full w-0.5 bg-transparent transition-colors group-hover:bg-neutral-300" />
              <h2 className="text-lg font-semibold tracking-tight font-serif">
                {formatCategoryTitle(section.title[lang])}
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
                    {hasActiveAllergenFilter ? t("noMatches") : t("comingSoon")}
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
