"use client";

import Image from "next/image";
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
  { src: "/images/italian-75.jpeg", alt: "Italian 75" },
  { src: "/images/laurea.jpeg", alt: "Laurea" },
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

      <section className="grid gap-4 sm:grid-cols-2">
        {IMAGES.map((image) => (
          <figure
            key={image.src}
            className="overflow-hidden rounded-2xl border border-neutral-200 bg-white"
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={1200}
              height={800}
              className={
                image.src === "/images/negroni.jpg"
                  ? "h-64 w-full object-cover object-[85%_85%] sm:object-center"
                  : "h-64 w-full object-cover"
              }
            />
          </figure>
        ))}
      </section>
    </main>
  );
}
