const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

const webSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Portfolio Amine Abbes",
  url: siteUrl,
  description:
    "Développeur Full-Stack en alternance à l'ESPCI Paris. Portfolio, projets et contact.",
  inLanguage: "fr-FR",
  author: {
    "@type": "Person",
    name: "Amine Abbes",
    jobTitle: "Développeur Full-Stack",
    url: siteUrl,
  },
};

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Amine Abbes",
  jobTitle: "Développeur Full-Stack",
  url: siteUrl,
  description:
    "Développeur Full-Stack en alternance à l'ESPCI Paris. Applications web, React, Next.js, Node.js.",
  knowsAbout: [
    "React",
    "Next.js",
    "Node.js",
    "JavaScript",
    "TypeScript",
    "HTML",
    "CSS",
  ],
  worksFor: {
    "@type": "Organization",
    name: "ESPCI Paris",
  },
};

export function JsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webSite),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(person),
        }}
      />
    </>
  );
}
