"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useScrollReveal } from "../use-scroll-reveal";
import { useLanguage, type Language } from "../locale-provider";

const COPY: Record<
  Language,
  { title: string; subtitle: string; openImage: string; close: string }
> = {
  it: {
    title: "Galleria",
    subtitle: "Il bar, da vicino. Dal primo caffè ai brindisi insieme.",
    openImage: "Apri immagine",
    close: "Chiudi",
  },
  en: {
    title: "Gallery",
    subtitle: "A closer look. From the first coffee to a toast together.",
    openImage: "Open image",
    close: "Close",
  },
  fr: {
    title: "Galerie",
    subtitle: "Le bar, de près. Du premier café aux verres partagés.",
    openImage: "Ouvrir l'image",
    close: "Fermer",
  },
  de: {
    title: "Galerie",
    subtitle: "Die Bar aus der Nähe. Vom ersten Kaffee bis zum gemeinsamen Anstoßen.",
    openImage: "Bild öffnen",
    close: "Schließen",
  },
  es: {
    title: "Galería",
    subtitle: "El bar, de cerca. Del primer café a los brindis juntos.",
    openImage: "Abrir imagen",
    close: "Cerrar",
  },
};

const IMAGES = [
  { src: "/images/negroni.jpg", alt: "Negroni" },
  { src: "/images/vetrina-pesce.jpg", alt: "Vetrina pesce" },
  { src: "/images/vetrina-pesce-aperitivo.png", alt: "Vetrina aperitivo di pesce" },
  { src: "/images/tartare-pesce.png", alt: "Tartare di pesce spada" },
  { src: "/images/vetrina-pranzi-estate.jpg", alt: "Pranzi estate" },
  { src: "/images/vetrina-pranzi-estate-n2.jpg", alt: "Pranzi estate" },
  { src: "/images/tartare.png", alt: "Tartare" },
  { src: "/images/insalatona.png", alt: "Insalatona" },
  { src: "/images/brioche.jpg", alt: "Brioches" },
  { src: "/images/italian-75.jpeg", alt: "Italian 75" },
  { src: "/images/laurea.jpeg", alt: "La veranda di Bar da Luciano" },
  { src: "/images/laurea-3.jpg", alt: "Feste di laurea" },
  { src: "/images/laurea-2.jpg", alt: "Il brindisi di laurea" },
];

export default function GalleryPage() {
  const { lang } = useLanguage();
  const t = (key: keyof (typeof COPY)["it"]) => COPY[lang][key];
  const root = useScrollReveal();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [openImageSrc, setOpenImageSrc] = useState<string | null>(null);
  const activeImage = IMAGES.find(image => image.src === openImageSrc) ?? null;

  useEffect(() => {
    if (!activeImage) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => { dialog.close(); document.body.style.overflow = previousOverflow; };
  }, [activeImage]);

  return (
    <div ref={root} className="editorial-page gallery-page">
      <noscript><style>{`.editorial-page [data-reveal] { opacity: 1 !important; }`}</style></noscript>
      <div className="home-container">
        <header className="editorial-opening gallery-opening"><div><p className="home-eyebrow">Bar da Luciano · Padova</p><h1 className="editorial-title">{t("title")}</h1></div><p className="editorial-lead">{t("subtitle")}</p></header>
        <div className="gallery-editorial-grid">
          {IMAGES.map((image, index) => <figure key={image.src} className="gallery-photo" data-reveal={index < 2 ? undefined : index % 3 === 0 ? "up" : "image"}>
            <button type="button" onClick={() => setOpenImageSrc(image.src)} aria-label={`${t("openImage")}: ${image.alt}`} className="gallery-image-button">
              <Image src={image.src} alt={image.alt} fill sizes="(min-width: 900px) 55vw, 100vw" priority={index === 0} className={image.src.includes("negroni") ? "object-bottom" : "object-center"} />
              <span className="gallery-expand" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M14 4h6v6M20 4l-7 7M10 20H4v-6M4 20l7-7" /></svg></span>
            </button>
            <figcaption>{image.alt}</figcaption>
          </figure>)}
        </div>
      </div>
      <dialog ref={dialogRef} className="gallery-lightbox" aria-label={activeImage?.alt ?? t("title")} onCancel={() => setOpenImageSrc(null)} onClose={() => setOpenImageSrc(null)} onClick={event => { if (event.target === event.currentTarget) setOpenImageSrc(null); }}>
        {activeImage && <div className="gallery-lightbox-content"><button type="button" className="gallery-lightbox-close" onClick={() => setOpenImageSrc(null)}>{t("close")} <span aria-hidden="true">×</span></button><Image src={activeImage.src} alt={activeImage.alt} width={1600} height={1200} sizes="95vw" className="gallery-full-image" /><p>{activeImage.alt}</p></div>}
      </dialog>
    </div>
  );
}
