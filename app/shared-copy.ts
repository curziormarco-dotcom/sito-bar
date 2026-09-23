import type { Language } from './locale-provider';

export const SHARED_COPY: Record<Language, { since: string; city: string; country: string; openNavigation: string; closeNavigation: string; navigation: string; language: string; allergenBook: string; info: string; from: string }> = {
  it: { since: 'dal 1984', city: 'Padova', country: 'Italia', openNavigation: 'Apri navigazione', closeNavigation: 'Chiudi navigazione', navigation: 'Navigazione', language: 'Seleziona lingua', allergenBook: 'Libro allergeni (PDF in italiano)', info: 'Informazioni', from: 'a partire da' },
  en: { since: 'since 1984', city: 'Padua', country: 'Italy', openNavigation: 'Open navigation', closeNavigation: 'Close navigation', navigation: 'Navigation', language: 'Select language', allergenBook: 'Allergen guide (PDF in Italian)', info: 'Information', from: 'from' },
  fr: { since: 'depuis 1984', city: 'Padoue', country: 'Italie', openNavigation: 'Ouvrir la navigation', closeNavigation: 'Fermer la navigation', navigation: 'Navigation', language: 'Choisir la langue', allergenBook: 'Guide des allergènes (PDF en italien)', info: 'Informations', from: 'à partir de' },
  de: { since: 'seit 1984', city: 'Padua', country: 'Italien', openNavigation: 'Navigation öffnen', closeNavigation: 'Navigation schließen', navigation: 'Navigation', language: 'Sprache auswählen', allergenBook: 'Allergenverzeichnis (PDF auf Italienisch)', info: 'Informationen', from: 'ab' },
  es: { since: 'desde 1984', city: 'Padua', country: 'Italia', openNavigation: 'Abrir navegación', closeNavigation: 'Cerrar navegación', navigation: 'Navegación', language: 'Seleccionar idioma', allergenBook: 'Guía de alérgenos (PDF en italiano)', info: 'Información', from: 'a partir de' },
};
