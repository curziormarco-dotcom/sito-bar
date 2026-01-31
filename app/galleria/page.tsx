"use client";

import { useLanguage, type Language } from "../locale-provider";

const COPY: Record<Language, { title: string; subtitle: string }> = {
  it: { title: "Galleria", subtitle: "Tutte le foto del bar." },
  en: { title: "Gallery", subtitle: "All photos of the bar." },
  fr: { title: "Galerie", subtitle: "Toutes les photos du bar." },
  de: { title: "Galerie", subtitle: "Alle Fotos der Bar." },
  es: { title: "Galería", subtitle: "Todas las fotos del bar." },
};

const IMAGES = [
  { src: "/images/hero.jpg", alt: "Bar Da Luciano" },
  { src: "/images/negroni.jpg", alt: "Cocktail" },
];

export default function GalleryPage() {
  const { lang } = useLanguage();
  const t = (key: keyof (typeof COPY)["it"]) => COPY[lang][key];

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 space-y-8">
      <header>
        <h1 className="text-4xl font-semibold tracking-tight font-serif">
          {t("title")}
        </h1>
        <p className="mt-2 text-neutral-600">{t("subtitle")}</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {IMAGES.map((image) => (
          <figure
            key={image.src}
            className="overflow-hidden rounded-2xl border border-neutral-200 bg-white"
          >
            <img
              src={image.src}
              alt={image.alt}
              className="h-64 w-full object-cover"
            />
          </figure>
        ))}
      </section>
    </main>
  );
}
