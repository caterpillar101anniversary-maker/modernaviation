import type { Metadata } from "next";
import { Archivo, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import { brand } from "@/config/brand";
import "./globals.css";

// Three faces, three roles — no fourth typeface, ever (design.md §4.1).
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"], // variable weight range (400–700) comes for free when axes is set
  variable: "--font-archivo",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-instrument",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${brand.name} — Private jet charter, quoted in twenty minutes`,
    template: `%s · ${brand.name}`,
  },
  description:
    "On-demand private jet charter across West Africa and long-haul. Tell us the trip, get a firm quote in twenty minutes, sign and fly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${instrumentSans.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
