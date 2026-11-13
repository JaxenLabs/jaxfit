import type { MetadataRoute } from "next";
import { abs } from "@/content/site";

// Built once at build time (required for the static export).
export const dynamic = "force-static";

/**
 * /robots.txt. Search engines only read it at the root of a domain, so it
 * starts to count once the site moves to its own domain. Until
 * then, jaxenlabs.github.io/robots.txt lists this site's sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: abs("/sitemap.xml") };
}
