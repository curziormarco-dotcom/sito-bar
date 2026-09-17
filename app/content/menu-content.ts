import type { Language, MenuItem, MenuSection } from '../menu/menu-types';

const languages: Language[] = ['it', 'en', 'fr', 'de', 'es'];
function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Contenuto del menù non valido');
  return value as Record<string, unknown>;
}
function translated(value: unknown, required = false): Record<Language, string> | undefined {
  if (value == null) {
    if (required) throw new Error('Nome italiano mancante');
    return undefined;
  }
  const input = record(value);
  const italian = typeof input.it === 'string' ? input.it.trim() : '';
  if (!italian) {
    if (required) throw new Error('Nome italiano mancante');
    return undefined;
  }
  return Object.fromEntries(languages.map(lang => [lang, typeof input[lang] === 'string' && input[lang].trim() ? input[lang] : italian])) as Record<Language, string>;
}
function price(value: unknown): number | undefined {
  if (value == null) return undefined;
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) throw new Error('Prezzo non valido');
  return value;
}
function text(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined;
}
function list(value: unknown): string[] | undefined {
  if (value == null) return undefined;
  if (!Array.isArray(value) || !value.every(item => typeof item === 'string')) throw new Error('Elenco allergeni non valido');
  return value.length ? value : undefined;
}
function defined<T extends object>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined)) as T;
}
export function normalizeMenu(value: unknown): MenuSection[] {
  if (!Array.isArray(value)) throw new Error('Categorie non valide');
  return value.map(entry => {
    const section = record(entry);
    if (!Array.isArray(section.items)) throw new Error('Prodotti non validi');
    return defined({
      id: text(section.id),
      title: translated(section.title, true)!,
      introTitle: translated(section.introTitle),
      description: translated(section.description),
      items: section.items.map((entry): MenuItem => {
        const item = record(entry);
        return defined({
          name: translated(item.name, true)!,
          description: typeof item.description === 'string' ? text(item.description) : translated(item.description),
          price: price(item.price), priceNote: text(item.priceNote),
          glassPrice: price(item.glassPrice), bottlePrice: price(item.bottlePrice),
          tag: text(item.tag), allergens: list(item.allergens),
          allergenAdd: list(item.allergenAdd), allergenRemove: list(item.allergenRemove),
        });
      }),
    });
  });
}
