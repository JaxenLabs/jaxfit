import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";
import { TOOLS } from "@/content/tools";

// Built once at build time (required for the static export).
export const dynamic = "force-static";

/** /sitemap.xml: the five calculator pages (the main page points to the fasting calculator as its canonical). */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return TOOLS.map((t, i) => ({ url: `${SITE_URL}${t.slug}/`, lastModified: now, changeFrequency: "monthly" as const, priority: i === 0 ? 1 : 0.9 }));
}
