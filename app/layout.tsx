import "./globals.css";
import { ScrollToTop } from "./scroll-to-top";
import { LocaleProvider } from "./locale-provider";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className="min-h-screen bg-[#fbfaf7] text-neutral-900">
        <LocaleProvider>
          <ScrollToTop />
          <SiteHeader />

          <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
          <SiteFooter />
        </LocaleProvider>
      </body>
    </html>
  );
}
