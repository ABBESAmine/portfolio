import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Syne } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ThemeProvider } from "@/components/ThemeProvider";
import { JsonLd } from "@/components/JsonLd";

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Portfolio | Amine Abbes — Développeur Full-Stack",
    template: "%s | Amine Abbes",
  },
  description:
    "Développeur Full-Stack en alternance à l'ESPCI Paris. Applications web (React, Next.js, Node.js), navigation multi-bâtiments, gestion de demandes et interfaces dynamiques. Portfolio et contact.",
  keywords: [
    "développeur full-stack",
    "développeur web",
    "React",
    "Next.js",
    "Node.js",
    "ESPCI",
    "alternance",
    "portfolio",
    "JavaScript",
    "TypeScript",
  ],
  authors: [{ name: "Amine Abbes", url: siteUrl }],
  creator: "Amine Abbes",
  publisher: "Amine Abbes",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "Portfolio Amine Abbes",
    title: "Portfolio | Amine Abbes — Développeur Full-Stack",
    description:
      "Développeur Full-Stack en alternance à l'ESPCI. Applications web, React, Next.js. Portfolio et projets.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Portfolio Amine Abbes — Développeur Full-Stack",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio | Amine Abbes — Développeur Full-Stack",
    description: "Développeur Full-Stack, React, Next.js. Portfolio et contact.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: { canonical: siteUrl },
  category: "technology",
  viewport: { width: "device-width", initialScale: 1 },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#E2DBCD" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1f1c" },
  ],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeScript = `
    (function() {
      try {
        var t = localStorage.getItem('theme');
        var d = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (t === 'dark' || (!t && d)) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
      } catch (e) {}
    })();
  `;

  return (
    <html
      lang="fr"
      className={`${inter.variable} ${jetbrainsMono.variable} ${syne.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <JsonLd />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <ThemeProvider>
          <ScrollProgress />
          <Nav />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
