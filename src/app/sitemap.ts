import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";
import { DEFAULT_TOOL, TOOLS } from "@/content/tools";

// Built once at build time (required for the static export).
export const dynamic = "force-static";

/** When the pages' content last changed (update it when you change the pages). */
const UPDATED = "2026-11-15";

/**
 * /sitemap.xml: every calculator page. The main page shows the fasting
 * calculator and points to it as its canonical, so that page is the top one
 * and the main page itself isn't listed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return TOOLS.map((t) => ({
    url: `${SITE_URL}${t.slug}/`,
    lastModified: new Date(UPDATED),
    changeFrequency: "monthly" as const,
    priority: t === DEFAULT_TOOL ? 1 : 0.8,
  }));
}
