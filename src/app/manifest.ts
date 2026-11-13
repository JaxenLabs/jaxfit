import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// Built once at build time (required for the static export).
export const dynamic = "force-static";

/** /manifest.webmanifest: name, colours and icon used when the page is added to a phone's home screen. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.brandName,
    short_name: site.name,
    description: site.tagline,
    start_url: `${site.basePath}/`,
    scope: `${site.basePath}/`,
    display: "standalone",
    background_color: "#faf8f5",
    theme_color: "#faf8f5",
    icons: [
      { src: `${site.basePath}${site.publisher.logoPath}`, sizes: "512x512", type: "image/png", purpose: "any" },
      { src: `${site.basePath}${site.publisher.logoPath}`, sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
