import "./globals.css";
import { Manrope } from "next/font/google";
import { SiteShell } from "./site-shell";

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
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
