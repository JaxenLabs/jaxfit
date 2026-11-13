/**
 * SITE DETAILS: name, address and defaults used in the <head>, the share
 * card, the sitemap and the structured data. Each calculator page has its
 * own title and description in tools.ts.
 *
 * MOVING TO A CUSTOM DOMAIN: set `origin` to the domain, set `basePath` to
 * "", and add a `public/CNAME` file containing the domain. Nothing else needs
 * to change.
 */
export const site = {
  name: "JaxFit",
  brandName: "JaxFit — Intermittent Fasting, Weight Loss & Healthy BMI Blueprint",
  /** Where the site is served from (no trailing slash). */
  origin: "https://jaxenlabs.github.io",
  /** The folder the site lives in on that origin: the repo name on GitHub Pages. */
  basePath: "/jaxfit",
  /** Shown as author and publisher; `logoPath` is inside this site. */
  publisher: { name: "JaxFit", logoPath: "/images/jaxfit-logo.png" },
  /** Short line for the share card, app manifest and footer. */
  tagline: "Free intermittent fasting, BMI, calorie deficit and water intake calculators that run privately in your browser.",
} as const;

/** Full address of the site's home page, with trailing slash. */
export const SITE_URL = `${site.origin}${site.basePath}/`;

/** Turns a path inside this site ("/og.png") into a full URL. */
export const abs = (path: string) => `${site.origin}${site.basePath}${path}`;
