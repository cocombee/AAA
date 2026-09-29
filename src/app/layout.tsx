import type { Metadata } from "next";
import "./globals.css";
import "@fontsource-variable/inter";

export const metadata: Metadata = { title: "Asri Ahmad Academy — Belajar dengan arah", description: "Kelas saham dan pelaburan bersama Asri Ahmad Academy." , robots: { index: false, follow: false } };
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html lang="ms" data-scroll-behavior="smooth"><body>{children}</body></html>;
}
