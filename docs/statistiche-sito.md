# Statistiche del sito

1. In Vercel aprire Analytics, scegliere il progetto del sito e premere Enable.
2. Pubblicare questa versione tramite il normale flusso GitHub/Vercel.
3. Visitare il sito ufficiale e autorizzare Statistiche (Vercel) nel banner.
4. Controllare le prime visualizzazioni nel pannello Analytics di Vercel.

Le statistiche non sono retroattive. Contano soltanto chi autorizza la raccolta e può caricare lo script; non equivalgono al totale delle persone che visitano il sito. In sviluppo locale la raccolta è disattivata.

Il banner contiene soltanto Rifiuta e Accetto. Le preferenze separate per statistiche e Google Maps sono nella pagina Privacy, collegata dal banner. Il pulsante sulla mappa abilita soltanto Maps. I vecchi consensi alla mappa non autorizzano le nuove statistiche. Preferenze cookie nel footer revoca le scelte e riapre il banner; se lo script statistico era caricato, la pagina viene ricaricata per rimuoverlo. Ogni evento ricontrolla comunque il consenso salvato.

Gli indirizzi delle pagine vengono privati di query e frammenti; amministrazione e API sono escluse. Non sono configurati eventi personalizzati.

Prima della pubblicazione verificare nell’account Vercel il piano e i tempi effettivi di conservazione dei report, i termini del trattamento e le garanzie applicabili ai trasferimenti internazionali, completando l’informativa se necessario. L’aggiunta del consenso non sostituisce questi adempimenti.

Documentazione:
- https://vercel.com/docs/analytics/quickstart
- https://vercel.com/docs/analytics/privacy-policy
- https://www.garanteprivacy.it/faq/cookie

## Registrazione delle preferenze

Ogni nuova scelta salva maps, analytics, recordedAt (data ISO UTC) e policyVersion (2026-09-20.2) nel browser. I vecchi rifiuti sono rispettati senza inventare una data; un consenso positivo privo della versione corrente richiede una nuova scelta. Non esiste un registro server: questo intervento non certifica da solo la prova del consenso ai sensi del GDPR. Conservare la versione dell’informativa pubblicata insieme al codice.

## Dati operativi da confermare

La revisione dell’informativa include criteri di conservazione, destinatari, trasferimenti, WhatsApp e GitHub. Non sono stati verificati l’account Vercel, i contratti accettati, le impostazioni di conservazione o le effettive procedure del locale per chat e prenotazioni. Confermare questi elementi prima di dichiarare completata la verifica legale. Non confondere la finestra di consultazione dei report con la cancellazione da backup o altri sistemi del fornitore.
