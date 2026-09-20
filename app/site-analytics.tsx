"use client";

import { Analytics } from "@vercel/analytics/react";
import { readPreferences, useCookieConsent } from "./cookie-consent";

export function SiteAnalytics() {
  const { analytics, isReady } = useCookieConsent();
  if (!isReady || !analytics || process.env.NODE_ENV !== "production") return null;
  return <Analytics beforeSend={(event) => {
    // Check persisted consent for every event, including after revocation in another tab.
    if (!readPreferences()?.analytics) return null;
    const url = new URL(event.url);
    if (url.pathname === "/admin" || url.pathname.startsWith("/keystatic") || url.pathname.startsWith("/api/")) return null;
    url.search = "";
    url.hash = "";
    return { ...event, url: url.toString() };
  }} />;
}
