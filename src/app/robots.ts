import { MetadataRoute } from "next";

const baseUrlRaw = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
const baseUrl =
  baseUrlRaw.startsWith("http://") || baseUrlRaw.startsWith("https://")
    ? baseUrlRaw
    : `https://${baseUrlRaw}`;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
