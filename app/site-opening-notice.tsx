"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const OPENING_NOTICE_STORAGE_KEY = "bar-da-luciano-opening-notice-seen";

export function SiteOpeningNotice() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let shouldShow = false;
    try {
      if (!window.localStorage.getItem(OPENING_NOTICE_STORAGE_KEY)) {
        window.localStorage.setItem(OPENING_NOTICE_STORAGE_KEY, "true");
        shouldShow = true;
      }
    } catch {
      shouldShow = true;
    }

    if (!shouldShow) return;
    const timer = window.setTimeout(() => setIsOpen(true), 0);
    return () => window.clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 p-8 sm:p-12"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="relative w-full max-w-[720px]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Chiudi avviso"
          onClick={() => setIsOpen(false)}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-2xl leading-none text-neutral-900 shadow-md hover:bg-white"
        >
          ×
        </button>
        <Image
          src="/images/sabato-chiusura-16.png"
          alt="Avviso: il sabato chiudiamo alle ore 16:00 nei mesi di giugno, luglio e agosto"
          width={1254}
          height={1254}
          priority
          className="max-h-[calc(100vh-7rem)] w-full rounded-md object-contain shadow-2xl"
        />
      </div>
    </div>
  );
}
