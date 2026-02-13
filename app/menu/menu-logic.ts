import type { MenuItem, MenuSection } from "./menu-types";

export function getItalianDescription(item: MenuItem): string {
  if (!item.description) return "";
  return typeof item.description === "string" ? item.description : item.description.it;
}

export function inferAllergens(
  section: MenuSection,
  item: MenuItem,
  options: {
    knownAllergens: Set<string>;
    sortOrder: Record<string, number>;
  }
): string[] | undefined {
  const allergens = new Set<string>((item.allergens ?? []).filter((key) => options.knownAllergens.has(key)));
  const text = `${item.name.it} ${getItalianDescription(item)}`.toLowerCase();
  const isWineSection = section.title.it === "Vini Bianchi" || section.title.it === "Vini Rossi";
  const isBeerSection = section.title.it === "Birre";
  const isAmariSection = section.title.it === "Amari, Grappe, Whisky";
  const isSnackSection = section.title.it === "Snack e Panini";

  if (section.id === "aperitivi-alcolici" || isWineSection || isBeerSection || isAmariSection) {
    allergens.add("alcol");
  }

  if (
    isBeerSection ||
    isSnackSection ||
    /\b(tramezzin|panin|toast|tostone|piadin|focacc|pizzett|panzerott|rustico)\w*/.test(text)
  ) {
    allergens.add("glutine");
  }

  if (/\bsoia\b/.test(text)) allergens.add("soia");
  if (/\borzo\b/.test(text)) allergens.add("orzo");
  if (/\b(uovo|uova)\b/.test(text)) allergens.add("uova");
  if (/\b(latte|mozzarella|burrata|philadelphia|panna|cappuccino|macchiato|cioccolata)\w*/.test(text)) {
    allergens.add("latte");
  }

  if (/\b(gamber|scamp|mazzancoll)\w*/.test(text)) allergens.add("crostacei");
  if (/\b(ostrich|capasant|cozz|vongol|piovra|polpo|seppia|calamar|totano)\w*/.test(text)) {
    allergens.add("molluschi");
  }
  if (/\b(tonno|salmone|baccal|merluzzo|acciugh|alice|sgombro|branzino|orata|trota|pesce)\w*/.test(text)) {
    allergens.add("pesce");
  }

  for (const key of item.allergenRemove ?? []) {
    if (options.knownAllergens.has(key)) allergens.delete(key);
  }
  for (const key of item.allergenAdd ?? []) {
    if (options.knownAllergens.has(key)) allergens.add(key);
  }

  if (allergens.size === 0) return undefined;
  return [...allergens].sort(
    (a, b) => (options.sortOrder[a] ?? 999) - (options.sortOrder[b] ?? 999)
  );
}

export function itemMatchesAnyAllergen(item: MenuItem, selected: Set<string>): boolean {
  if (selected.size === 0) return true;
  return item.allergens?.some((key) => selected.has(key)) ?? false;
}

export function toggleAllergenFilter<T extends string>(current: T[], key: T): T[] {
  return current.includes(key)
    ? current.filter((value) => value !== key)
    : [...current, key];
}
