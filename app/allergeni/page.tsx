"use client";

import { useLanguage, type Language } from "../locale-provider";

const COPY: Record<
  Language,
  {
    title: string;
    subtitle: string;
    intro: string;
    note: string;
    sourceLabel: string;
    sourceText: string;
    items: { name: string; description: string }[];
  }
> = {
  it: {
    title: "Allergeni",
    subtitle: "Elenco delle sostanze o prodotti che possono provocare allergie o intolleranze.",
    intro:
      "Questa pagina riassume i 14 allergeni principali previsti dall'Allegato II del Regolamento (UE) n. 1169/2011. Nel menù del sito gli allergeni sono indicati per aiutare la consultazione, ma in caso di dubbi o esigenze specifiche è sempre consigliato chiedere conferma al personale.",
    note:
      "Le preparazioni avvengono in ambienti dove possono essere presenti più ingredienti. Per esigenze particolari, intolleranze o allergie gravi, contatta il personale prima del consumo.",
    sourceLabel: "Fonte ufficiale",
    sourceText: "Regolamento (UE) n. 1169/2011, Allegato II",
    items: [
      { name: "Cereali contenenti glutine", description: "Grano, segale, orzo, avena, farro, kamut o loro derivati." },
      { name: "Crostacei", description: "Crostacei e prodotti a base di crostacei." },
      { name: "Uova", description: "Uova e prodotti a base di uova." },
      { name: "Pesce", description: "Pesce e prodotti a base di pesce." },
      { name: "Arachidi", description: "Arachidi e prodotti a base di arachidi." },
      { name: "Soia", description: "Soia e prodotti a base di soia." },
      { name: "Latte", description: "Latte e prodotti a base di latte, incluso il lattosio." },
      { name: "Frutta a guscio", description: "Mandorle, nocciole, noci, anacardi, pecan, noci del Brasile, pistacchi, macadamia e derivati." },
      { name: "Sedano", description: "Sedano e prodotti a base di sedano." },
      { name: "Senape", description: "Senape e prodotti a base di senape." },
      { name: "Semi di sesamo", description: "Semi di sesamo e prodotti a base di sesamo." },
      { name: "Anidride solforosa e solfiti", description: "Se presenti oltre i limiti previsti dalla normativa." },
      { name: "Lupini", description: "Lupini e prodotti a base di lupini." },
      { name: "Molluschi", description: "Molluschi e prodotti a base di molluschi." },
    ],
  },
  en: {
    title: "Allergens",
    subtitle: "List of substances or products that may cause allergies or intolerances.",
    intro:
      "This page summarises the 14 main allergens listed in Annex II to Regulation (EU) No 1169/2011. Allergens are shown in the website menu to support consultation, but if you have specific needs it is always best to confirm with staff.",
    note:
      "Food is prepared in spaces where multiple ingredients may be present. For specific requirements, intolerances or severe allergies, please contact staff before consumption.",
    sourceLabel: "Official source",
    sourceText: "Regulation (EU) No 1169/2011, Annex II",
    items: [
      { name: "Cereals containing gluten", description: "Wheat, rye, barley, oats, spelt, kamut or related derivatives." },
      { name: "Crustaceans", description: "Crustaceans and crustacean-based products." },
      { name: "Eggs", description: "Eggs and egg-based products." },
      { name: "Fish", description: "Fish and fish-based products." },
      { name: "Peanuts", description: "Peanuts and peanut-based products." },
      { name: "Soybeans", description: "Soybeans and soybean-based products." },
      { name: "Milk", description: "Milk and milk-based products, including lactose." },
      { name: "Nuts", description: "Almonds, hazelnuts, walnuts, cashews, pecans, Brazil nuts, pistachios, macadamia nuts and derivatives." },
      { name: "Celery", description: "Celery and celery-based products." },
      { name: "Mustard", description: "Mustard and mustard-based products." },
      { name: "Sesame seeds", description: "Sesame seeds and sesame-based products." },
      { name: "Sulphur dioxide and sulphites", description: "When present above the limits set by the regulation." },
      { name: "Lupin", description: "Lupin and lupin-based products." },
      { name: "Molluscs", description: "Molluscs and mollusc-based products." },
    ],
  },
  fr: {
    title: "Allergènes",
    subtitle: "Liste des substances ou produits pouvant provoquer des allergies ou des intolérances.",
    intro:
      "Cette page résume les 14 allergènes principaux prévus par l'Annexe II du Règlement (UE) n° 1169/2011. Les allergènes sont indiqués dans le menu du site pour faciliter la consultation, mais en cas de besoin spécifique il est toujours préférable de demander confirmation au personnel.",
    note:
      "Les préparations sont réalisées dans des espaces où plusieurs ingrédients peuvent être présents. En cas de besoins particuliers, d'intolérances ou d'allergies sévères, contactez le personnel avant consommation.",
    sourceLabel: "Source officielle",
    sourceText: "Règlement (UE) n° 1169/2011, Annexe II",
    items: [
      { name: "Céréales contenant du gluten", description: "Blé, seigle, orge, avoine, épeautre, kamut ou dérivés." },
      { name: "Crustacés", description: "Crustacés et produits à base de crustacés." },
      { name: "Œufs", description: "Œufs et produits à base d'œufs." },
      { name: "Poisson", description: "Poisson et produits à base de poisson." },
      { name: "Arachides", description: "Arachides et produits à base d'arachides." },
      { name: "Soja", description: "Soja et produits à base de soja." },
      { name: "Lait", description: "Lait et produits à base de lait, y compris le lactose." },
      { name: "Fruits à coque", description: "Amandes, noisettes, noix, noix de cajou, noix de pécan, noix du Brésil, pistaches, macadamia et dérivés." },
      { name: "Céleri", description: "Céleri et produits à base de céleri." },
      { name: "Moutarde", description: "Moutarde et produits à base de moutarde." },
      { name: "Graines de sésame", description: "Graines de sésame et produits à base de sésame." },
      { name: "Anhydride sulfureux et sulfites", description: "Lorsqu'ils sont présents au-delà des limites prévues par la réglementation." },
      { name: "Lupin", description: "Lupin et produits à base de lupin." },
      { name: "Mollusques", description: "Mollusques et produits à base de mollusques." },
    ],
  },
  de: {
    title: "Allergene",
    subtitle: "Liste der Stoffe oder Produkte, die Allergien oder Unverträglichkeiten auslösen können.",
    intro:
      "Diese Seite fasst die 14 Hauptallergene aus Anhang II der Verordnung (EU) Nr. 1169/2011 zusammen. Die Allergene sind im Menü der Website angegeben, dennoch sollte bei besonderen Anforderungen immer eine Bestätigung durch das Personal eingeholt werden.",
    note:
      "Die Speisen werden in Bereichen zubereitet, in denen mehrere Zutaten vorhanden sein können. Bei besonderen Anforderungen, Unverträglichkeiten oder schweren Allergien wende dich bitte vor dem Verzehr an das Personal.",
    sourceLabel: "Offizielle Quelle",
    sourceText: "Verordnung (EU) Nr. 1169/2011, Anhang II",
    items: [
      { name: "Glutenhaltiges Getreide", description: "Weizen, Roggen, Gerste, Hafer, Dinkel, Kamut oder daraus hergestellte Produkte." },
      { name: "Krebstiere", description: "Krebstiere und daraus hergestellte Produkte." },
      { name: "Eier", description: "Eier und daraus hergestellte Produkte." },
      { name: "Fisch", description: "Fisch und daraus hergestellte Produkte." },
      { name: "Erdnüsse", description: "Erdnüsse und daraus hergestellte Produkte." },
      { name: "Soja", description: "Soja und daraus hergestellte Produkte." },
      { name: "Milch", description: "Milch und daraus hergestellte Produkte einschließlich Laktose." },
      { name: "Schalenfrüchte", description: "Mandeln, Haselnüsse, Walnüsse, Cashews, Pekannüsse, Paranüsse, Pistazien, Macadamianüsse und Derivate." },
      { name: "Sellerie", description: "Sellerie und daraus hergestellte Produkte." },
      { name: "Senf", description: "Senf und daraus hergestellte Produkte." },
      { name: "Sesamsamen", description: "Sesamsamen und daraus hergestellte Produkte." },
      { name: "Schwefeldioxid und Sulfite", description: "Wenn sie über den gesetzlich festgelegten Grenzwerten vorhanden sind." },
      { name: "Lupinen", description: "Lupinen und daraus hergestellte Produkte." },
      { name: "Weichtiere", description: "Weichtiere und daraus hergestellte Produkte." },
    ],
  },
  es: {
    title: "Alérgenos",
    subtitle: "Lista de sustancias o productos que pueden provocar alergias o intolerancias.",
    intro:
      "Esta página resume los 14 alérgenos principales previstos en el Anexo II del Reglamento (UE) n.º 1169/2011. Los alérgenos aparecen en el menú del sitio para facilitar la consulta, pero si tienes necesidades específicas siempre es mejor confirmarlo con el personal.",
    note:
      "Las preparaciones se realizan en espacios donde pueden estar presentes varios ingredientes. En caso de necesidades particulares, intolerancias o alergias graves, contacta con el personal antes del consumo.",
    sourceLabel: "Fuente oficial",
    sourceText: "Reglamento (UE) n.º 1169/2011, Anexo II",
    items: [
      { name: "Cereales con gluten", description: "Trigo, centeno, cebada, avena, espelta, kamut o derivados." },
      { name: "Crustáceos", description: "Crustáceos y productos a base de crustáceos." },
      { name: "Huevos", description: "Huevos y productos a base de huevo." },
      { name: "Pescado", description: "Pescado y productos a base de pescado." },
      { name: "Cacahuetes", description: "Cacahuetes y productos a base de cacahuete." },
      { name: "Soja", description: "Soja y productos a base de soja." },
      { name: "Leche", description: "Leche y productos a base de leche, incluida la lactosa." },
      { name: "Frutos de cáscara", description: "Almendras, avellanas, nueces, anacardos, nueces pacanas, nueces de Brasil, pistachos, macadamias y derivados." },
      { name: "Apio", description: "Apio y productos a base de apio." },
      { name: "Mostaza", description: "Mostaza y productos a base de mostaza." },
      { name: "Semillas de sésamo", description: "Semillas de sésamo y productos a base de sésamo." },
      { name: "Dióxido de azufre y sulfitos", description: "Cuando están presentes por encima de los límites previstos por la normativa." },
      { name: "Altramuces", description: "Altramuces y productos a base de altramuces." },
      { name: "Moluscos", description: "Moluscos y productos a base de moluscos." },
    ],
  },
};

export default function AllergeniPage() {
  const { lang } = useLanguage();
  const copy = COPY[lang];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="rounded-[28px] border border-neutral-200 bg-white px-6 py-8 shadow-[0_14px_36px_rgba(17,17,17,0.05)] sm:px-10 sm:py-10">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-neutral-500">
          {copy.title}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          {copy.title}
        </h1>
        <p className="mt-4 text-neutral-600">{copy.subtitle}</p>
        <p className="mt-6 leading-7 text-neutral-700">{copy.intro}</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {copy.items.map((item) => (
            <section
              key={item.name}
              className="rounded-2xl border border-neutral-200 bg-[#fbfaf7] p-5"
            >
              <h2 className="text-lg font-semibold tracking-tight">{item.name}</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-600">
                {item.description}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-10 space-y-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
          <p className="leading-7 text-neutral-700">{copy.note}</p>
          <p className="text-sm text-neutral-600">
            <span className="font-semibold text-neutral-800">{copy.sourceLabel}: </span>
            <a
              href="https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32011R1169"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              {copy.sourceText}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
