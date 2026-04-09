import "./globals.css";
import { Manrope } from "next/font/google";
import { ScrollToTop } from "./scroll-to-top";
import { LocaleProvider } from "./locale-provider";
import { CookieConsentProvider } from "./cookie-consent";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className={`${bodyFont.className} min-h-screen bg-[#fbfaf7] text-neutral-900`}>
        <LocaleProvider>
          <CookieConsentProvider>
            <ScrollToTop />
            <SiteHeader />

            <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
            <SiteFooter />
          </CookieConsentProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
