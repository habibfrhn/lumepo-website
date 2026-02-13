import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", "/privacy", "/terms", "/contact"];

  return routes.map((route) => ({
    url: new URL(route, siteUrl).toString(),
  }));
}
