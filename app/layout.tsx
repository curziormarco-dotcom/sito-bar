import "./globals.css";
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
      <body className="min-h-screen bg-neutral-950 text-white">
        <LocaleProvider>
          <SiteHeader />

          <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
          <SiteFooter />
        </LocaleProvider>
      </body>
    </html>
  );
}
