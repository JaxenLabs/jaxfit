import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { themeScript } from "@/components/ThemeToggle";
import { DEFAULT_TOOL } from "@/content/tools";
import { SITE_URL, site } from "@/content/site";
import "./globals.css";

// Downloaded at build time and served from this site (no request to Google from visitors).
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"], variable: "--font-manrope", display: "swap" });

/**
 * <head> tags shared by every page. Icons and the share image are found
 * automatically by Next.js from the files in this folder (icon1.png,
 * apple-icon.png, opengraph-image.png). Each page sets its own title,
 * description and canonical address (src/lib/seo.ts).
 */
export const metadata: Metadata = {
  // The domain only: Next.js adds the basePath to icon and share-image URLs itself.
  metadataBase: new URL(site.origin),
  title: DEFAULT_TOOL.title,
  description: DEFAULT_TOOL.description,
  applicationName: site.name,
  authors: [{ name: site.publisher.name, url: SITE_URL }],
  creator: site.publisher.name,
  publisher: site.publisher.name,
  category: "Health & Fitness",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  formatDetection: { email: false, telephone: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#faf8f5",
  colorScheme: "light dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // The theme script may set data-theme before React loads, hence suppressHydrationWarning.
    <html lang="en" className={manrope.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="relative flex min-h-dvh flex-col overflow-x-clip font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-xl focus:bg-accent focus:px-4 focus:py-2 focus:font-bold focus:text-on-accent"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
