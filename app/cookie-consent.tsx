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
  isReady: boolean;
  accept: () => void;
  reject: () => void;
  reset: () => void;
};

const COOKIE_CONSENT_KEY = "bar-da-luciano-cookie-consent";

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
  }
> = {
  it: {
    title: "Preferenze cookie",
    body: "Usiamo solo strumenti tecnici e, se accetti, carichiamo Google Maps per mostrarti la mappa del locale.",
    accept: "Accetta",
    reject: "Rifiuta",
    settings: "Cookie",
    privacy: "Privacy",
  },
  en: {
    title: "Cookie preferences",
    body: "We use technical tools and, if you accept, load Google Maps to show the venue map.",
    accept: "Accept",
    reject: "Reject",
    settings: "Cookies",
    privacy: "Privacy",
  },
  fr: {
    title: "Preferences cookies",
    body: "Nous utilisons des outils techniques et, si vous acceptez, Google Maps pour afficher la carte du lieu.",
    accept: "Accepter",
    reject: "Refuser",
    settings: "Cookies",
    privacy: "Privacy",
  },
  de: {
    title: "Cookie-Einstellungen",
    body: "Wir nutzen technische Tools und laden Google Maps nur mit Zustimmung, um die Karte anzuzeigen.",
    accept: "Akzeptieren",
    reject: "Ablehnen",
    settings: "Cookies",
    privacy: "Privacy",
  },
  es: {
    title: "Preferencias de cookies",
    body: "Usamos herramientas tecnicas y, si aceptas, cargamos Google Maps para mostrar el mapa del local.",
    accept: "Aceptar",
    reject: "Rechazar",
    settings: "Cookies",
    privacy: "Privacy",
  },
};

function saveConsent(value: ConsentValue) {
  if (value) {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, value);
  } else {
    window.localStorage.removeItem(COOKIE_CONSENT_KEY);
  }
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentValue>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const saved = window.localStorage.getItem(COOKIE_CONSENT_KEY);
      if (saved === "accepted" || saved === "rejected") {
        setConsent(saved);
      }
      setIsReady(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      consent,
      isReady,
      accept: () => {
        setConsent("accepted");
        saveConsent("accepted");
      },
      reject: () => {
        setConsent("rejected");
        saveConsent("rejected");
      },
      reset: () => {
        setConsent(null);
        saveConsent(null);
      },
    }),
    [consent, isReady],
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
      <CookieBanner />
    </CookieConsentContext.Provider>
  );
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
  const { consent, isReady, accept, reject } = useCookieConsent();
  const { lang } = useLanguage();
  const copy = COOKIE_COPY[lang];

  if (!isReady || consent !== null) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[80] border-t border-neutral-200 bg-white shadow-[0_-16px_40px_rgba(17,17,17,0.12)]">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-base font-semibold text-neutral-900">
            {copy.title}
          </h2>
          <p className="mt-1 text-sm leading-6 text-neutral-600">
            {copy.body}{" "}
            <Link href="/privacy" className="font-semibold text-neutral-900 underline underline-offset-4">
              {copy.privacy}
            </Link>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={reject}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-50"
          >
            {copy.reject}
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            {copy.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
