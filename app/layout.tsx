import "./globals.css";
import "./editorial.css";
import localFont from "next/font/local";
import { SiteShell } from "./site-shell";

const bodyFont = localFont({
  src: "./fonts/source-sans-3.ttf",
  weight: "200 900",
  variable: "--font-body",
  display: "swap",
});

const headingFont = localFont({
  src: [
    { path: "./fonts/lora-normal.ttf", weight: "400 700", style: "normal" },
    { path: "./fonts/lora-italic.ttf", weight: "400 700", style: "italic" },
  ],
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
