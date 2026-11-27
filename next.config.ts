import type { NextConfig } from "next";
import { site } from "./src/content/site";

/**
 * The site is exported as plain files (`out/`) so Cloudflare Pages can host it
 * with no server. `basePath` comes from src/content/site.ts ("" while the
 * site is served from the root of jaxfast.pages.dev).
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: site.basePath,
  images: { unoptimized: true },
};

export default nextConfig;
