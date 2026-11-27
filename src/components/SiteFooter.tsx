import { PageLink as Link } from "@/components/PageLink";
import { jaxfast } from "@/content/apps";
import { site } from "@/content/site";
import { NAV_TOOLS } from "@/content/tools";
import { JaxFastBadge } from "./AppPromo";
import { BrandLogo } from "./BrandLogo";

/** Bottom of the page: what JaxFast is, the calculators, the app, copyright. */
export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-card pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-6">
        <div>
          <p className="flex items-center gap-2.5 text-xl font-extrabold">
            <BrandLogo size={36} className="size-9 rounded-xl" />
            {site.name}
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">{site.tagline} No accounts, no tracking, no ads.</p>
        </div>
        <nav aria-labelledby="footer-tools">
          <p id="footer-tools" className="text-xs font-extrabold tracking-wide text-muted uppercase">
            Calculators
          </p>
          <ul className="mt-3 space-y-1">
            {NAV_TOOLS.map((t) => (
              <li key={t.slug}>
                <Link href={`/${t.slug}/`} className="inline-flex min-h-10 items-center text-sm font-semibold hover:text-accent">
                  {t.nav}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="text-xs font-extrabold tracking-wide text-muted uppercase">The App</p>
          <p className="mt-3 text-sm font-semibold">{jaxfast.title}</p>
          <p className="mt-1 max-w-xs text-sm leading-relaxed text-muted">Offline fasting, meal plans and your Habit Garden on Android.</p>
          <JaxFastBadge placement="footer" className="mt-4" />
        </div>
      </div>
      <p className="border-t border-border px-4 py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} {site.name}. General wellness information, not medical advice. Your data never leaves your device.
      </p>
    </footer>
  );
}
