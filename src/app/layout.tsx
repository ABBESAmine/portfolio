import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Syne } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { ScrollProgress } from "@/components/ScrollProgress";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio | Développeur Full-Stack",
  description: "Portfolio présentant mes compétences, expériences et projets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${jetbrainsMono.variable} ${syne.variable}`}>
      <body className="min-h-screen font-sans antialiased">
        <ScrollProgress />
        <Nav />
        {children}
      </body>
    </html>
  );
}
