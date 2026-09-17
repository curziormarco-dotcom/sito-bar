import type { Language } from '../menu/menu-types';
export const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;
type Day = { closed: boolean; opens: string; closes: string };
export type OpeningHours = Record<(typeof days)[number], Day>;
const labels: Record<Language, string[]> = {
  it: ['Lun.', 'Mar.', 'Mer.', 'Gio.', 'Ven.', 'Sab.', 'Dom.'],
  en: ['Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.', 'Sun.'],
  fr: ['Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.', 'Dim.'],
  de: ['Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.', 'So.'],
  es: ['Lun.', 'Mar.', 'Mié.', 'Jue.', 'Vie.', 'Sáb.', 'Dom.'],
};
const closed: Record<Language, string> = { it: 'chiuso', en: 'closed', fr: 'fermé', de: 'geschlossen', es: 'cerrado' };
export function formatOpeningHours(schedule: OpeningHours, lang: Language): string {
  const rows: string[] = [];
  for (let start = 0; start < days.length;) {
    const current = schedule[days[start]];
    let end = start;
    while (end + 1 < days.length) {
      const next = schedule[days[end + 1]];
      if (next.closed !== current.closed || (!current.closed && (next.opens !== current.opens || next.closes !== current.closes))) break;
      end++;
    }
    const dayLabel = labels[lang][start] + (end > start ? `–${labels[lang][end]}` : '');
    const hours = current.closed ? closed[lang] : `${current.opens.replace(/^0/, '')}–${current.closes.replace(/^0/, '')}`;
    rows.push(`${dayLabel} ${hours}`);
    start = end + 1;
  }
  return rows.join('\n');
}
