import { GITHUB_URL, LINKEDIN_URL } from "@/lib/config";

const siteUrlRaw = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
const siteUrl =
  siteUrlRaw.startsWith("http://") || siteUrlRaw.startsWith("https://")
    ? siteUrlRaw
    : `https://${siteUrlRaw}`;

const sameAs = [GITHUB_URL, LINKEDIN_URL].filter(Boolean);

const profilePage = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${siteUrl}/#webpage`,
  url: siteUrl,
  name: "Portfolio — Amine Abbes",
  inLanguage: "fr-FR",
  mainEntity: { "@id": `${siteUrl}/#person` },
};

const webSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: "Portfolio Amine Abbes",
  url: siteUrl,
  description:
    "Développeur Full-Stack en alternance à l'ESPCI Paris. Portfolio, projets et contact.",
  inLanguage: "fr-FR",
  author: { "@id": `${siteUrl}/#person` },
};

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteUrl}/#person`,
  name: "Amine Abbes",
  jobTitle: "Développeur Full-Stack",
  url: siteUrl,
  description:
    "Développeur Full-Stack en alternance à l'ESPCI Paris. Applications web React, Next.js et Node.js.",
  image: {
    "@type": "ImageObject",
    url: `${siteUrl}/og-image.png`,
    width: 1200,
    height: 630,
  },
  ...(sameAs.length > 0 && { sameAs }),
  knowsAbout: [
    "React",
    "Next.js",
    "Node.js",
    "JavaScript",
    "TypeScript",
    "HTML",
    "CSS",
    "Three.js",
    "GSAP",
    "Supabase",
    "TailwindCSS",
  ],
  worksFor: {
    "@type": "Organization",
    name: "ESPCI Paris",
    url: "https://www.espci.psl.eu",
    sameAs: "https://www.wikidata.org/wiki/Q273626",
  },
};

export function JsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePage) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSite) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
      />
    </>
  );
}
