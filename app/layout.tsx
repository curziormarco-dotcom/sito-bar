import "./globals.css";
import { Lora, Source_Sans_3 } from "next/font/google";
import { SiteShell } from "./site-shell";

const bodyFont = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const headingFont = Lora({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-heading",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className={`${bodyFont.variable} ${headingFont.variable}`}>
      <body className={`${bodyFont.className} min-h-screen bg-[#fbfaf7] text-neutral-900`}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
