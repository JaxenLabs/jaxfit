import type { Metadata } from "next";
import { TOOLS, steps, type ToolPage } from "@/content/tools";
import { SITE_URL, abs, site } from "@/content/site";

/** The address of a calculator page, e.g. https://…/jaxfit/bmi-calculator/. */
export const toolUrl = (t: ToolPage) => `${SITE_URL}${t.slug}/`;

/**
 * <head> tags for a calculator page. The main page shows the intermittent
 * fasting calculator too, so it points search engines to that page as the
 * one official address (canonical) instead of competing with it.
 */
export function toolMetadata(t: ToolPage): Metadata {
  const url = toolUrl(t);
  return {
    title: { absolute: t.title },
    description: t.description,
    keywords: t.keywords,
    alternates: { canonical: url },
    openGraph: { type: "website", siteName: site.brandName, locale: "en_US", url, title: t.title, description: t.description },
    twitter: { card: "summary_large_image", title: t.title, description: t.description },
  };
}

/** schema.org data: the calculator (WebApplication), its FAQ, how-to steps and breadcrumbs. */
export function pageJsonLd(t: ToolPage) {
  const url = toolUrl(t);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${url}#app`,
        name: `${t.h1} ${t.highlight}`,
        alternateName: TOOLS.filter((x) => x !== t).map((x) => x.nav),
        url,
        description: t.description,
        applicationCategory: "HealthApplication",
        applicationSubCategory: "Health & Fitness Calculator",
        operatingSystem: "Any (runs in the web browser)",
        browserRequirements: "Requires JavaScript and a modern web browser",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        featureList: [
          "Intermittent fasting schedules: 14:10, 16:8, 18:6, 20:4, 24h and custom",
          "24-hour fasting and eating window clock",
          "Cellular renewal and body insights timeline",
          "Live fasting timer that keeps running when the tab is closed",
          "WHO BMI categories and healthy weight range",
          "Mifflin-St Jeor BMR and TDEE with a safe calorie target",
          "Goal date estimate with 7, 30 and 90-day weight trend",
          "Daily water intake in litres, millilitres and glasses",
          "Habit Garden that never dies",
          "100% client-side: nothing is uploaded",
        ],
        image: abs("/opengraph-image.png"),
        inLanguage: "en",
        publisher: { "@id": `${SITE_URL}#publisher` },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: t.faq.map((q) => ({ "@type": "Question", name: q.q, acceptedAnswer: { "@type": "Answer", text: q.a } })),
      },
      {
        "@type": "HowTo",
        "@id": `${url}#how-to`,
        name: "How to Use the JaxFit Calculator",
        step: steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.title, text: s.text, url: `${url}#how-to` })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: site.name, item: SITE_URL },
          { "@type": "ListItem", position: 2, name: t.nav, item: url },
        ],
      },
      { "@type": "WebSite", "@id": `${SITE_URL}#website`, name: site.brandName, url: SITE_URL, publisher: { "@id": `${SITE_URL}#publisher` } },
      { "@type": "Organization", "@id": `${SITE_URL}#publisher`, name: site.publisher.name, url: SITE_URL, logo: abs(site.publisher.logoPath) },
    ],
  };
}
