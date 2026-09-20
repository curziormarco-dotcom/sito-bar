"use client";

import Link from "next/link";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useLanguage, type Language } from "./locale-provider";

type ConsentValue = "accepted" | "rejected" | null;

type CookieConsentContextValue = {
  consent: ConsentValue;
  analytics: boolean;
  save: (maps: boolean, analytics: boolean) => void;
  isReady: boolean;
  accept: () => void;
  reject: () => void;
  reset: () => void;
};

export const COOKIE_CONSENT_KEY = "bar-da-luciano-cookie-consent-v2";

export function readPreferences(): { maps: boolean; analytics: boolean } | null {
  try {
    const saved = JSON.parse(window.localStorage.getItem(COOKIE_CONSENT_KEY) || "null");
    return saved && typeof saved.maps === "boolean" && typeof saved.analytics === "boolean"
      ? saved : null;
  } catch { return null; }
}

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

const COOKIE_COPY: Record<
  Language,
  {
    title: string;
    body: string;
    accept: string;
    reject: string;
    settings: string;
    privacy: string;
    analytics: string;
    maps: string;
    save: string;
  }
> = {
  it: {
    title: "Preferenze cookie",
    body: "Usiamo strumenti tecnici necessari. Con il tuo consenso attiviamo Vercel Web Analytics per contare le visite e Google Maps per mostrare la mappa. Puoi rifiutare oppure accettare entrambi. Le preferenze dettagliate sono nella pagina Privacy.",
    accept: "Accetto",
    reject: "Rifiuta",
    settings: "Preferenze cookie",
    privacy: "Privacy",
    analytics: "Statistiche (Vercel)",
    maps: "Mappa (Google Maps)",
    save: "Salva scelte",
  },
  en: {
    title: "Cookie preferences",
    body: "We use necessary technical tools. With your consent, we enable Vercel Web Analytics to measure visits and Google Maps to show the map. You can reject or accept both. Detailed preferences are on the Privacy page.",
    accept: "Accept",
    reject: "Reject",
    settings: "Cookies",
    privacy: "Privacy",
    analytics: "Statistics (Vercel)",
    maps: "Map (Google Maps)",
    save: "Save choices",
  },
  fr: {
    title: "Préférences de cookies",
    body: "Nous utilisons des outils techniques nécessaires. Avec votre accord, Vercel Web Analytics mesure les visites et Google Maps affiche la carte. Vous pouvez accepter ou refuser les deux. Les préférences détaillées sont sur la page Confidentialité.",
    accept: "Accepter",
    reject: "Refuser",
    settings: "Cookies",
    privacy: "Confidentialité",
    analytics: "Statistiques (Vercel)",
    maps: "Carte (Google Maps)",
    save: "Enregistrer",
  },
  de: {
    title: "Cookie-Einstellungen",
    body: "Wir verwenden notwendige technische Dienste. Mit Ihrer Zustimmung misst Vercel Web Analytics Besuche und Google Maps zeigt die Karte. Sie können beide akzeptieren oder ablehnen. Detaillierte Einstellungen finden Sie unter Datenschutz.",
    accept: "Akzeptieren",
    reject: "Ablehnen",
    settings: "Cookie-Einstellungen",
    privacy: "Datenschutz",
    analytics: "Statistik (Vercel)",
    maps: "Karte (Google Maps)",
    save: "Auswahl speichern",
  },
  es: {
    title: "Preferencias de cookies",
    body: "Usamos herramientas técnicas necesarias. Con tu consentimiento, Vercel Web Analytics mide las visitas y Google Maps muestra el mapa. Puedes aceptar o rechazar ambos. Las preferencias detalladas están en Privacidad.",
    accept: "Aceptar",
    reject: "Rechazar",
    settings: "Cookies",
    privacy: "Privacidad",
    analytics: "Estadísticas (Vercel)",
    maps: "Mapa (Google Maps)",
    save: "Guardar selección",
  },
};

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<{ maps: boolean; analytics: boolean } | null>(null);
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => {
      setPreferences(readPreferences());
      setIsReady(true);
    }, 0);
    const sync = () => setPreferences(readPreferences());
    window.addEventListener("storage", sync);
    return () => { window.clearTimeout(id); window.removeEventListener("storage", sync); };
  }, []);
  const value = useMemo<CookieConsentContextValue>(() => {
    const save = (maps: boolean, analytics: boolean) => {
      const next = { maps, analytics };
      try { window.localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(next)); } catch { /* Storage may be blocked. */ }
      setPreferences(next);
    };
    return {
      consent: preferences === null ? null : preferences.maps ? "accepted" : "rejected",
      analytics: preferences?.analytics === true,
      isReady,
      save,
      // The button on the map authorizes only Google Maps.
      accept: () => save(true, preferences?.analytics === true),
      reject: () => save(false, false),
      reset: () => {
        try { window.localStorage.removeItem(COOKIE_CONSENT_KEY); } catch { /* No persisted consent. */ }
        setPreferences(null);
        // Remove an already loaded analytics script and its listeners.
        if (preferences?.analytics) window.location.reload();
      },
    };
  }, [preferences, isReady]);
  return <CookieConsentContext.Provider value={value}>{children}<CookieBanner key={preferences === null ? "pending" : "saved"} /></CookieConsentContext.Provider>;
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error("useCookieConsent must be used within CookieConsentProvider");
  }
  return ctx;
}

export function CookieSettingsButton() {
  const { reset } = useCookieConsent();
  const { lang } = useLanguage();
  const copy = COOKIE_COPY[lang];

  return (
    <button
      type="button"
      onClick={reset}
      className="text-neutral-600 transition hover:text-neutral-900"
    >
      {copy.settings}
    </button>
  );
}

function CookieBanner() {
  const { consent, isReady, save, reject } = useCookieConsent();
  const { lang } = useLanguage();
  const copy = COOKIE_COPY[lang];

  if (!isReady || consent !== null) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[80] max-h-[85svh] overflow-y-auto border-t border-neutral-200 bg-white shadow-[0_-16px_40px_rgba(17,17,17,0.12)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-base font-semibold text-neutral-900">
            {copy.title}
          </h2>
          <p className="mt-1 text-sm leading-6 text-neutral-600">
            {copy.body}{" "}
            <Link href="/privacy#preferenze" className="font-semibold text-neutral-900 underline underline-offset-4">
              {copy.privacy}
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={reject}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-50"
          >
            {copy.reject}
          </button>
          <button
            type="button"
            onClick={() => save(true, true)}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-50"
          >
            {copy.accept}
          </button>
        </div>
      </div>
    </div>
  );
}

export function DetailedCookiePreferences() {
  const { consent, analytics, isReady, save } = useCookieConsent();
  const { lang } = useLanguage();
  const copy = COOKIE_COPY[lang];
  if (!isReady) return null;
  return (
    <div className="mt-4 flex flex-col gap-4">
      <label className="flex items-center gap-3">
        <input type="checkbox" checked={analytics} onChange={event => {
          save(consent === "accepted", event.target.checked);
          if (!event.target.checked) window.location.reload();
        }} />
        {copy.analytics}
      </label>
      <label className="flex items-center gap-3">
        <input type="checkbox" checked={consent === "accepted"} onChange={event => save(event.target.checked, analytics)} />
        {copy.maps}
      </label>
    </div>
  );
}
