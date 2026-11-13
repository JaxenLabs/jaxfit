import type { NextConfig } from "next";
import { site } from "./src/content/site";

/**
 * The site is exported as plain files (`out/`) so GitHub Pages can host it
 * with no server. `basePath` comes from src/content/site.ts: "/jaxfit" while
 * the site lives at jaxenlabs.github.io/jaxfit/, "" once it has its own domain.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: site.basePath,
  images: { unoptimized: true },
};

export default nextConfig;
