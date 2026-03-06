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
      lastModified: "2026-03-06",
    },
  ];
}
