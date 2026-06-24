import type { MetadataRoute } from "next";
import { SEO } from "@/features/landing/data/content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SEO.url}/sitemap.xml`,
  };
}
