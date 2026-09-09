import "./globals.css";
import type { Metadata } from "next";
import { Fraunces, Karla } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz", "SOFT", "WONK"],
});

const karla = Karla({
  subsets: ["latin"],
  variable: "--font-ui",
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Soft Notebook Todo",
  description: "A soft, pastel notebook for your tasks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${karla.variable}`}>
      <body>{children}</body>
    </html>
  );
}
