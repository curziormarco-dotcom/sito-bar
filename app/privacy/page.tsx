import type { ReactNode } from "react";

const SECTIONS: { title: string; body: ReactNode[] }[] = [
  {
    title: "Titolare del trattamento",
    body: [
      "Il titolare del trattamento e Bar da Luciano di Curzio Davide, con sede in via Nazareth 20, 35128 Padova.",
      "Per richieste relative alla privacy e possibile contattare il locale all'indirizzo email davide_patrizia@alice.it o al numero 049 981 3795.",
    ],
  },
  {
    title: "Dati trattati",
    body: [
      "Il sito non prevede registrazione, account utente, form di contatto o acquisti online.",
      "Quando l'utente contatta il locale telefonicamente o tramite servizi esterni, vengono trattati solo i dati necessari a rispondere alla richiesta, ad esempio nome, recapito e contenuto del messaggio.",
      "Durante la navigazione possono essere trattati dati tecnici necessari al funzionamento del sito, come indirizzo IP, dati del dispositivo, browser utilizzato e log tecnici generati dal servizio di hosting.",
    ],
  },
  {
    title: "Finalita e base giuridica",
    body: [
      "I dati sono trattati per rispondere alle richieste dell'utente, fornire informazioni sul locale, gestire eventuali prenotazioni e garantire sicurezza e corretto funzionamento del sito.",
      "La base giuridica e l'esecuzione di misure richieste dall'utente, l'adempimento di obblighi di legge e il legittimo interesse al funzionamento e alla sicurezza del sito.",
    ],
  },
  {
    title: "Cookie e strumenti simili",
    body: [
      "Il sito non usa al momento strumenti di profilazione pubblicitaria, Google Analytics o Meta Pixel.",
      "Possono essere usati cookie o strumenti tecnici necessari al funzionamento del sito e dell'hosting. Per questi strumenti non e richiesto il consenso preventivo.",
      "Il sito mostra un banner per la gestione delle preferenze relative a cookie e servizi di terze parti. La scelta dell'utente, accettazione o rifiuto, viene salvata nel browser tramite localStorage con la chiave bar-da-luciano-cookie-consent.",
      "La mappa Google incorporata viene caricata solo se l'utente accetta i cookie e i servizi Google Maps. In caso di rifiuto, la mappa resta bloccata e non viene caricato l'iframe Google Maps.",
      "L'utente puo modificare la scelta in qualsiasi momento usando il pulsante Cookie presente nel footer del sito.",
      <>
        Per maggiori informazioni sul trattamento dati da parte di Google, l’utente
        puo consultare la{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4"
        >
          Privacy Policy di Google
        </a>{" "}
        e i{" "}
        <a
          href="https://www.google.com/help/terms_maps/"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4"
        >
          Termini aggiuntivi di Google Maps
        </a>
        .
      </>,
    ],
  },
  {
    title: "Servizi esterni",
    body: [
      "Il sito contiene link verso servizi esterni, come Google Maps, Google Recensioni e Instagram.",
      "Quando l'utente apre questi link, lascia il sito e il trattamento dei dati avviene secondo le informative dei rispettivi fornitori.",
    ],
  },
  {
    title: "Conservazione",
    body: [
      "I dati raccolti tramite contatto diretto sono conservati per il tempo necessario a gestire la richiesta e, se necessario, per adempiere a obblighi di legge.",
      "I log tecnici del sito sono conservati dai fornitori tecnici secondo le rispettive policy e per il tempo necessario a sicurezza, diagnostica e funzionamento del servizio.",
    ],
  },
  {
    title: "Diritti dell'utente",
    body: [
      "L'utente puo chiedere accesso, rettifica, cancellazione, limitazione del trattamento, opposizione al trattamento e portabilita dei dati nei casi previsti dal Regolamento UE 2016/679.",
      "L'utente puo inoltre proporre reclamo al Garante per la protezione dei dati personali.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-[28px] border border-neutral-200 bg-white px-6 py-8 shadow-[0_14px_36px_rgba(17,17,17,0.05)] sm:px-10 sm:py-10">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-neutral-500">
          Privacy
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Privacy e Cookie Policy
        </h1>
        <p className="mt-4 text-sm text-neutral-500">
          Ultimo aggiornamento: 9 aprile 2026
        </p>
        <p className="mt-6 leading-7 text-neutral-700">
          Questa informativa descrive in modo sintetico come vengono trattati i dati
          personali degli utenti che visitano il sito di Bar da Luciano di Curzio Davide.
        </p>

        <div className="mt-10 space-y-8">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-semibold tracking-tight">
                {section.title}
              </h2>
              <div className="mt-3 space-y-3 text-neutral-700">
                {section.body.map((paragraph, index) => (
                  <p key={`${section.title}-${index}`} className="leading-7">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
