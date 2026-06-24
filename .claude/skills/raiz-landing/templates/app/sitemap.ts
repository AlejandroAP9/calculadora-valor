import type { MetadataRoute } from "next";
import { SEO } from "@/features/landing/data/content";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SEO.url, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
  ];
}
