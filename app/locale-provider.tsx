"use client";

import { createContext, useContext, useMemo, useState } from "react";

export type Language = "it" | "en" | "fr" | "de" | "es";

type LanguageContextValue = {
  lang: Language;
  setLang: (lang: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>("it");
  const value = useMemo(() => ({ lang, setLang }), [lang]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LocaleProvider");
  }
  return ctx;
}
