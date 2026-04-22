"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useLanguage, type Language } from "../locale-provider";

const COPY: Record<
  Language,
  { title: string; subtitle: string; openImage: string; close: string }
> = {
  it: {
    title: "Galleria",
    subtitle: "Tutte le foto del bar.",
    openImage: "Apri immagine",
    close: "Chiudi",
  },
  en: {
    title: "Gallery",
    subtitle: "All photos of the bar.",
    openImage: "Open image",
    close: "Close",
  },
  fr: {
    title: "Galerie",
    subtitle: "Toutes les photos du bar.",
    openImage: "Ouvrir l'image",
    close: "Fermer",
  },
  de: {
    title: "Galerie",
    subtitle: "Alle Fotos der Bar.",
    openImage: "Bild öffnen",
    close: "Schließen",
  },
  es: {
    title: "Galería",
    subtitle: "Todas las fotos del bar.",
    openImage: "Abrir imagen",
    close: "Cerrar",
  },
};

const IMAGES = [
  { src: "/images/hero.jpg", alt: "Bar Da Luciano" },
  { src: "/images/vetrina-pesce.jpg", alt: "Vetrina pesce" },
  { src: "/images/vetrina-pranzi-estate.jpg", alt: "Vetrina pranzi estate" },
  { src: "/images/vetrina-pranzi-estate-n2.jpg", alt: "Vetrina pranzi estate n2" },
  { src: "/images/champagne-1.jpg", alt: "Champagne 1" },
  { src: "/images/champagne-2.jpg", alt: "Champagne 2" },
  { src: "/images/brioche.jpg", alt: "Brioche" },
  { src: "/images/negroni.jpg", alt: "Cocktail" },
  { src: "/images/italian-75.jpeg", alt: "Italian 75" },
  { src: "/images/laurea.jpeg", alt: "Laurea" },
  { src: "/images/laurea-3.jpg", alt: "Laurea 3" },
  { src: "/images/laurea-2.jpg", alt: "Laurea 2" },
];

export default function GalleryPage() {
  const { lang } = useLanguage();
  const t = (key: keyof (typeof COPY)["it"]) => COPY[lang][key];
  const [openImageSrc, setOpenImageSrc] = useState<string | null>(null);
  const activeImage = IMAGES.find((image) => image.src === openImageSrc) ?? null;

  useEffect(() => {
    if (!openImageSrc) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenImageSrc(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openImageSrc]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-12 space-y-8">
      <header>
        <h1 className="text-4xl font-semibold tracking-tight font-serif">
          {t("title")}
        </h1>
        <p className="mt-2 text-neutral-600">{t("subtitle")}</p>
      </header>

      <section className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
        {IMAGES.map((image) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setOpenImageSrc(image.src)}
            aria-label={`${t("openImage")}: ${image.alt}`}
            className="overflow-hidden rounded-2xl border border-neutral-200 bg-white text-left transition hover:opacity-95"
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={1200}
              height={800}
              className={
                image.src === "/images/negroni.jpg"
                  ? "h-64 w-full object-cover object-[85%_85%] sm:object-center"
                  : image.src === "/images/vetrina-pesce.jpg"
                    ? "h-64 w-full object-cover object-center"
                  : image.src === "/images/vetrina-pranzi-estate.jpg"
                    ? "h-64 w-full object-cover object-center"
                  : image.src === "/images/vetrina-pranzi-estate-n2.jpg"
                    ? "h-64 w-full object-cover object-center"
                  : image.src === "/images/champagne-1.jpg"
                    ? "h-56 w-full bg-neutral-100 object-contain sm:h-64 sm:object-cover sm:object-center"
                  : image.src === "/images/champagne-2.jpg"
                    ? "h-56 w-full bg-neutral-100 object-contain sm:h-64 sm:object-cover sm:object-center"
                  : image.src === "/images/brioche.jpg"
                    ? "h-64 w-full object-cover object-center"
                  : image.src === "/images/italian-75.jpeg"
                    ? "h-64 w-full object-cover object-[50%_78%] sm:object-center"
                  : image.src === "/images/laurea-2.jpg"
                    ? "h-64 w-full object-cover object-center"
                  : image.src === "/images/laurea-3.jpg"
                    ? "h-64 w-full object-cover object-center"
                  : "h-64 w-full object-cover"
              }
            />
          </button>
        ))}
      </section>

      {activeImage ? (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/88 p-4"
          onClick={() => setOpenImageSrc(null)}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpenImageSrc(null)}
              className="absolute right-2 top-2 z-10 rounded-lg bg-black/50 px-3 py-2 text-sm font-semibold text-white transition hover:bg-black/65"
            >
              {t("close")}
            </button>
            <Image
              src={activeImage.src}
              alt={activeImage.alt}
              width={1600}
              height={1200}
              className="max-h-[85vh] w-full rounded-xl object-contain"
            />
          </div>
        </div>
      ) : null}
    </main>
  );
}
