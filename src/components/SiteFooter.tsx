import { PageLink as Link } from "@/components/PageLink";
import { jaxfit } from "@/content/apps";
import { site } from "@/content/site";
import { TOOLS } from "@/content/tools";
import { BrandLogo } from "./BrandLogo";

/** Bottom of the page: what JaxFit is, the calculators, the app, copyright. */
export function SiteFooter() {
  const play = jaxfit.play("footer");
  return (
    <footer className="mt-20 border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-6">
        <div>
          <p className="flex items-center gap-2.5 text-xl font-extrabold">
            <BrandLogo size={36} className="size-9 rounded-xl" />
            JaxFit
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">{site.tagline} No accounts, no tracking, no ads.</p>
        </div>
        <nav aria-labelledby="footer-tools">
          <p id="footer-tools" className="text-xs font-extrabold tracking-wide text-muted uppercase">
            Calculators
          </p>
          <ul className="mt-3 space-y-1">
            {TOOLS.map((t) => (
              <li key={t.slug}>
                <Link href={`/${t.slug}/`} className="inline-flex min-h-10 items-center text-sm font-semibold hover:text-accent">
                  {t.nav}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="text-xs font-extrabold tracking-wide text-muted uppercase">App</p>
          <ul className="mt-3 space-y-1 text-sm font-semibold">
            <li>
              <a href={play ?? "#apps"} {...(play && { target: "_blank", rel: "noopener" })} className="inline-flex min-h-10 items-center hover:text-accent">
                {play ? `${jaxfit.title} on Google Play` : `${jaxfit.title} (coming soon)`}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <p className="border-t border-border px-4 py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} JaxFit. General wellness information, not medical advice. Your data never leaves your device.
      </p>
    </footer>
  );
}
