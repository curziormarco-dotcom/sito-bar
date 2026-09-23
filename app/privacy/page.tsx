"use client";

import { DetailedCookiePreferences } from "../cookie-consent";
import { useLanguage } from "../locale-provider";
import privacy from "../../content/privacy.json";

export default function PrivacyPage() {
  const { lang } = useLanguage();
  const copy = privacy[lang];
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="rounded-[28px] border border-neutral-200 bg-white px-6 py-8 shadow-[0_14px_36px_rgba(17,17,17,0.05)] sm:px-10 sm:py-10">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-neutral-500">
          {copy.label}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          {copy.title}
        </h1>
        <p className="mt-4 text-sm text-neutral-500">
          {copy.updated}
        </p>
        <p className="mt-6 leading-7 text-neutral-700">
          {copy.intro}
        </p>

        <section id="preferenze" className="mt-8 scroll-mt-32 border-y border-neutral-200 py-6">
          <h2 className="text-xl font-semibold">{copy.preferences}</h2>
          <p className="mt-2 text-neutral-700">{copy.preferencesText}</p>
          <DetailedCookiePreferences />
        </section>
        <div className="mt-10 space-y-8">
          {copy.sections.map((section) => (
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
                {section.links.length > 0 && <ul className="space-y-2">{section.links.map(link => <li key={link.href}><a href={link.href} target="_blank" rel="noreferrer" className="underline underline-offset-4">{link.label}</a></li>)}</ul>}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
