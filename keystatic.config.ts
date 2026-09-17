import { config, fields, singleton } from '@keystatic/core';
import allergenOptions from './content/allergen-options.json';

// Never allow filesystem editing on a deployed server.
const github = process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_CMS_GITHUB === '1';
const translated = (label: string, required = false, multiline = false) => fields.object({
  it: fields.text({ label: 'Italiano', multiline, validation: { isRequired: required } }),
  en: fields.text({ label: 'English', multiline }),
  fr: fields.text({ label: 'Français', multiline }),
  de: fields.text({ label: 'Deutsch', multiline }),
  es: fields.text({ label: 'Español', multiline }),
}, { label, description: 'Le traduzioni vuote usano il testo italiano. Le traduzioni esistenti vanno aggiornate quando cambi il testo.' });
const price = (label: string) => fields.number({ label, step: 0.01, validation: { min: 0 }, description: 'Importo in euro. Lascia vuoto se non previsto.' });
const allergens = (label: string) => fields.multiselect({ label, options: allergenOptions });
const day = (label: string) => fields.object({
  closed: fields.checkbox({ label: 'Chiuso', defaultValue: false }),
  opens: fields.text({ label: 'Apertura', defaultValue: '06:00', validation: { isRequired: true, pattern: { regex: /^([01]\d|2[0-3]):[0-5]\d$/, message: 'Usa HH:MM, per esempio 06:30.' } } }),
  closes: fields.text({ label: 'Chiusura', defaultValue: '21:30', validation: { isRequired: true, pattern: { regex: /^([01]\d|2[0-3]):[0-5]\d$/, message: 'Usa HH:MM, per esempio 21:30.' } } }),
}, { label });

export default config({
  locale: 'it-IT',
  storage: github ? { kind: 'github', repo: 'curziormarco-dotcom/sito-bar' } : { kind: 'local' },
  ui: { brand: { name: 'Bar da Luciano' } },
  singletons: {
    menu: singleton({
      label: 'Menù e prezzi',
      path: 'content/menu',
      format: { data: 'json' },
      schema: {
        sections: fields.array(fields.object({
          // Category names and IDs also drive the availability rules in the menu.
          title: fields.ignored(),
          id: fields.ignored(),
          introTitle: translated('Titolo introduttivo'),
          description: translated('Presentazione della categoria', false, true),
          items: fields.array(fields.object({
            name: translated('Nome del prodotto', true),
            description: translated('Descrizione', false, true),
            price: price('Prezzo'),
            priceNote: fields.text({ label: 'Prezzo variabile / nota', description: 'Per esempio €1,00–€1,20. Per un intervallo lascia vuoto il prezzo fisso.' }),
            glassPrice: price('Prezzo al calice (vini)'),
            bottlePrice: price('Prezzo bottiglia (vini)'),
            allergens: allergens('Allergeni e indicazioni del prodotto'),
            allergenAdd: allergens('Indicazioni da aggiungere a quelle automatiche'),
            allergenRemove: allergens('Indicazioni automatiche da escludere'),
            tag: fields.select({ label: 'Gruppo vini bianchi', options: [{ label: 'Non applicabile', value: '' }, { label: 'Bollicine', value: 'bollicine' }, { label: 'Fermi', value: 'fermi' }], defaultValue: '' }),
          }), { label: 'Prodotti', itemLabel: (props) => props.fields.name.fields.it.value || 'Nuovo prodotto' }),
        }), {
          label: 'Categorie',
          itemLabel: (props) => {
            const title = props.fields.title.value.value as { it?: string } | undefined;
            return title?.it ?? 'Categoria';
          },
          // Categories stay fixed so day/time availability rules remain intact.
          validation: { length: { min: 15, max: 15 } },
        }),
      },
    }),
    hours: singleton({
      label: 'Orari di apertura',
      path: 'content/hours',
      format: { data: 'json' },
      schema: {
        monday: day('Lunedì'), tuesday: day('Martedì'), wednesday: day('Mercoledì'),
        thursday: day('Giovedì'), friday: day('Venerdì'), saturday: day('Sabato'), sunday: day('Domenica'),
      },
    }),
  },
});
