"use client";

import { usePathname } from "next/navigation";
import { PageLink as Link } from "@/components/PageLink";
import { DEFAULT_TOOL, NAV_TOOLS, toolBySlug } from "@/content/tools";

/**
 * The calculator links in the header (wide screens). The page you are on is
 * highlighted like a selected tab. The main page (the fasting calculator,
 * which has no header link) highlights 16:8 Fasting Schedule, the link for
 * the same tab.
 */
export function HeaderNav() {
  // The path without the site's basePath, e.g. "/bmi-calculator/".
  const page = toolBySlug(usePathname().replaceAll("/", "")) ?? DEFAULT_TOOL;
  const highlighted = NAV_TOOLS.includes(page) ? page : NAV_TOOLS.find((t) => t.tab === page.tab);

  return (
    <nav aria-label="Calculators" className="hidden items-center gap-0.5 text-sm font-bold xl:flex">
      {NAV_TOOLS.map((t) => (
        <Link
          key={t.slug}
          href={`/${t.slug}/`}
          aria-current={t === highlighted ? "page" : undefined}
          className="rounded-xl px-2.5 py-2 whitespace-nowrap text-muted transition-colors hover:bg-accent-soft hover:text-accent aria-[current=page]:bg-accent-soft aria-[current=page]:text-accent aria-[current=page]:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--accent)_30%,transparent)]"
        >
          {t.nav.replace(" Calculator", "")}
        </Link>
      ))}
    </nav>
  );
}
