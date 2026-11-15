import type { MetadataRoute } from "next";
import { abs } from "@/content/site";

// Built once at build time (required for the static export).
export const dynamic = "force-static";

/** /robots.txt: lets search engines crawl everything and points them to the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: abs("/sitemap.xml") };
}
