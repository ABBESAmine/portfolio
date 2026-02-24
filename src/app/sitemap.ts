import { MetadataRoute } from "next";

const baseUrlRaw = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
const baseUrl =
  baseUrlRaw.startsWith("http://") || baseUrlRaw.startsWith("https://")
    ? baseUrlRaw
    : `https://${baseUrlRaw}`;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}#about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}#projects`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}#contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ];
}
