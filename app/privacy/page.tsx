import type { ReactNode } from "react";
import { DetailedCookiePreferences } from "../cookie-consent";

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
      "Le pagine pubbliche non prevedono registrazione, account cliente, form di contatto o acquisti online. L’area di gestione è riservata al personale autorizzato.",
      "Quando l'utente contatta il locale telefonicamente o tramite servizi esterni, vengono trattati solo i dati necessari a rispondere alla richiesta, ad esempio nome, recapito e contenuto del messaggio.",
      "Durante la navigazione possono essere trattati dati tecnici necessari al funzionamento del sito, come indirizzo IP, dati del dispositivo, browser utilizzato e log tecnici generati dal servizio di hosting.",
      "Solo previo consenso, Vercel Web Analytics raccoglie dati sulle pagine visitate, data e ora della visita, provenienza del traffico, posizione geografica approssimativa, dispositivo, sistema operativo e browser. I report sono aggregati. Non inviamo eventi personalizzati e rimuoviamo parametri e frammenti dagli indirizzi delle pagine trasmessi; le pagine di amministrazione sono escluse.",
    ],
  },
  {
    title: "Finalità e base giuridica",
    body: [
      "I dati sono trattati per rispondere alle richieste dell'utente, fornire informazioni sul locale, gestire eventuali prenotazioni e garantire sicurezza e corretto funzionamento del sito.",
      "I dati possono inoltre essere trattati per produrre statistiche aggregate sull'utilizzo del sito e comprendere in forma anonima quante visite ricevono le pagine.",
      "Per le richieste dell’utente, la base giuridica è l’esecuzione di misure precontrattuali o contrattuali; per gli obblighi normativi è l’adempimento di obblighi di legge; per funzionamento e sicurezza è il legittimo interesse del titolare. L’attivazione delle statistiche e di Google Maps si basa invece sul consenso, facoltativo e revocabile in qualsiasi momento senza pregiudicare la liceità del trattamento precedente.",
    ],
  },
  {
    title: "Cookie e strumenti simili",
    body: [
      "Il sito non usa strumenti di profilazione pubblicitaria, Google Analytics o Meta Pixel.",
      "Possono essere usati cookie o strumenti tecnici necessari al funzionamento del sito e dell'hosting. Per questi strumenti non e richiesto il consenso preventivo.",
      "Il sito integra Vercel Web Analytics, fornito da Vercel Inc., per misurare visite e pagine visualizzate. Il servizio viene caricato solo dopo il consenso alle statistiche. Secondo Vercel, non usa cookie per identificare i visitatori e impiega un identificativo derivato dalla richiesta, senza tracciamento tra siti diversi; la sessione del visitatore viene eliminata dopo 24 ore. Questo termine non coincide con la conservazione dei report aggregati.",
      "Il banner presenta i pulsanti Rifiuta e Accetto, riferiti a statistiche e Google Maps. È possibile autorizzare separatamente le due finalità nella sezione Preferenze di questa pagina, raggiungibile dal link Privacy del banner. Le preferenze sono salvate sul dispositivo tramite localStorage con la chiave bar-da-luciano-cookie-consent-v2, fino alla modifica delle scelte o alla cancellazione dei dati del browser. I precedenti consensi alla sola mappa non attivano le statistiche.",
      "In assenza di consenso o in caso di rifiuto, i rispettivi servizi restano bloccati: le statistiche non vengono caricate e la mappa non viene incorporata. Il pulsante di attivazione presente sulla mappa autorizza soltanto Google Maps.",
      "L’utente può revocare il consenso e scegliere nuovamente in qualsiasi momento tramite il pulsante Preferenze cookie in fondo al sito. La revoca interrompe le nuove rilevazioni, senza eliminare automaticamente i report aggregati già prodotti.",
      <>
        Per maggiori informazioni su Vercel Web Analytics, l&apos;utente puo consultare la{" "}
        <a
          href="https://vercel.com/docs/analytics/privacy-policy"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4"
        >
          documentazione privacy di Vercel Analytics
        </a>{" "}
        e la{" "}
        <a
          href="https://vercel.com/legal/privacy-notice"
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4"
        >
          Privacy Policy di Vercel
        </a>
        .
      </>,
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
      "Il sito contiene link verso servizi esterni, come Google Maps, Google Recensioni e Instagram, e utilizza Vercel per hosting e statistiche.",
      "Quando l'utente apre questi link, lascia il sito e il trattamento dei dati avviene secondo le informative dei rispettivi fornitori.",
    ],
  },
  {
    title: "Conservazione",
    body: [
      "I dati raccolti tramite contatto diretto sono conservati per il tempo necessario a gestire la richiesta e, se necessario, per adempiere a obblighi di legge.",
      "I log tecnici del sito sono conservati dai fornitori tecnici secondo le rispettive policy e per il tempo necessario a sicurezza, diagnostica e funzionamento del servizio.",
      "I report statistici aggregati restano disponibili secondo i limiti di conservazione del piano Vercel attivo. I termini applicabili sono descritti nella documentazione del servizio collegata sopra.",
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
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="rounded-[28px] border border-neutral-200 bg-white px-6 py-8 shadow-[0_14px_36px_rgba(17,17,17,0.05)] sm:px-10 sm:py-10">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-neutral-500">
          Privacy
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Privacy e Cookie Policy
        </h1>
        <p className="mt-4 text-sm text-neutral-500">
          Ultimo aggiornamento: 20 settembre 2026
        </p>
        <p className="mt-6 leading-7 text-neutral-700">
          Questa informativa descrive in modo sintetico come vengono trattati i dati
          personali degli utenti che visitano il sito di Bar da Luciano di Curzio Davide.
        </p>

        <section id="preferenze" className="mt-8 scroll-mt-32 border-y border-neutral-200 py-6">
          <h2 className="text-xl font-semibold">Preferenze</h2>
          <p className="mt-2 text-neutral-700">Puoi autorizzare o disattivare ciascun servizio. Le scelte vengono salvate subito.</p>
          <DetailedCookiePreferences />
        </section>
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
