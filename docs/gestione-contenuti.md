# Gestione dal telefono: menù e orari

Il pannello è disponibile su `/admin` (rimanda a `/keystatic`).

## Cosa è pronto

- **Menù e prezzi**: apri la categoria, poi il prodotto. Puoi modificare nome, descrizione, prezzi fissi o intervalli, prezzi al calice e alla bottiglia, allergeni e traduzioni; puoi aggiungere, rimuovere e riordinare i prodotti.
- **Orari di apertura**: modifica i sette giorni. I giorni consecutivi con lo stesso orario vengono raggruppati automaticamente, in tutte le lingue.
- Gli altri contenuti (lauree, foto e testi della home) restano nel codice per ora.
- In sviluppo locale, Save scrive nei file `content/menu.json` e `content/hours.json`. Non pubblica nulla.
- In produzione, Keystatic usa esclusivamente GitHub: l'accesso è legato ai permessi di scrittura sul repository `curziormarco-dotcom/sito-bar`.
- Se mancano le credenziali, il pannello mostra una pagina di attivazione e tutte le sue API rispondono 503.

## Attivazione una tantum prima dell'uso da telefono

1. Pubblica tu le modifiche al repository ufficiale quando pronto. Non usare l'anteprima Sites.
2. Per configurare l'accesso, sul computer crea `.env.local` e imposta `NEXT_PUBLIC_CMS_GITHUB=1`, quindi riavvia `npm run dev`.
3. Apri `http://localhost:3000/keystatic`. Segui il percorso **Sign in with GitHub / Create GitHub App**, indicando il dominio ufficiale su Vercel. Installa la GitHub App solo sul repository del sito.
4. Keystatic genera `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET` e `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`. Trasferiscili dalle variabili locali alle **Environment Variables** del progetto Vercel, senza inviarli in chat o inserirli in Git. Assicurati che non rimangano variabili vuote con gli stessi nomi in `.env.local` a sovrascrivere quelle generate.
5. Nelle impostazioni della GitHub App verifica la callback per il dominio ufficiale: `https://DOMINIO-UFFICIALE/api/keystatic/github/oauth/callback`. Il dominio deve coincidere con quello che userai dal telefono.
6. Esegui un nuovo deploy su Vercel. Vercel deve restare collegato al repository ufficiale, con `main` come production branch e comando di build `npm run build`. Non impostare `SITES_STATIC_EXPORT`.
7. Dal telefono apri `https://DOMINIO-UFFICIALE/admin`, accedi con GitHub e seleziona il ramo `main`. Salva una piccola modifica, attendi che il deploy Vercel termini e verifica il risultato sul sito.
8. Per tornare a modificare solo in locale sul computer, riporta `NEXT_PUBLIC_CMS_GITHUB=0` e riavvia il server. Prima di modificare file locali dopo aver lavorato dal telefono, recupera le modifiche da GitHub (`git pull` a lavoro locale salvato).

**Importante:** in modalità GitHub il salvataggio crea un commit. Su `main` avvia la pubblicazione solo se l'integrazione GitHub–Vercel è attiva. Non è un aggiornamento istantaneo: serve il tempo del deploy. Se la build fallisce, Vercel mantiene la precedente versione; controlla il deploy prima di considerare il prezzo aggiornato.

## Inserimento dei contenuti

- I prezzi sono condivisi tra tutte le lingue. Scrivi solo il numero nel campo prezzo. Per un intervallo, svuota il prezzo fisso e usa la nota (es. `€1,00–€1,20`).
- Le traduzioni esistenti sono conservate e non si aggiornano automaticamente. Quelle vuote usano l'italiano.
- Gli allergeni vanno verificati sulla scheda del prodotto. Il sito conserva le sue regole automatiche preesistenti; usa le esclusioni solo quando confermate dalla scheda.
- I nomi e gli identificatori delle categorie restano protetti perché governano anche disponibilità del pesce, vini e centrifughe.
- Il campo Chiuso prevale sulle ore inserite. Una sola fascia di apertura per giorno è supportata in questa prima versione.

## Verifiche da fare all'attivazione

- Accesso autorizzato da telefono, modifica, salvataggio su GitHub e deploy Vercel riuscito.
- Un account senza accesso in scrittura al repository non deve poter modificare i contenuti.
- Prezzi aggiornati anche cambiando lingua; orari aggiornati nella home.

Riferimenti: [installazione Next.js](https://keystatic.com/docs/installation-next-js), [accesso GitHub](https://keystatic.com/docs/github-mode).
