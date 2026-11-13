import { PageLink as Link } from "@/components/PageLink";
import { jaxfit } from "@/content/apps";
import { TOOLS } from "@/content/tools";
import { BrandLogo } from "./BrandLogo";
import { Icon } from "./Icon";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Sticky top bar: the JaxFit logo, links to the calculators (wide screens),
 * the theme button and the JaxFit app button. While JaxFit is coming soon
 * the button jumps to the app cards; once it is live it opens Google Play.
 */
export function SiteHeader() {
  const play = jaxfit.play("header");
  return (
    <header className="sticky top-0 z-30 pt-[env(safe-area-inset-top)] lg:px-6 lg:pt-4">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 border-b border-border bg-bg/85 px-4 backdrop-blur-xl lg:rounded-2xl lg:border lg:bg-card/80 lg:pr-2.5 lg:shadow-[0_8px_40px_-20px_var(--shadow)]">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <BrandLogo size={40} eager className="size-10 shrink-0 rounded-xl" />
          <span className="text-xl leading-none font-extrabold tracking-tight">
            Jax<span className="text-accent">Fit</span>
          </span>
        </Link>
        <nav aria-label="Calculators" className="hidden items-center gap-0.5 text-sm font-bold xl:flex">
          {TOOLS.map((t) => (
            <Link key={t.slug} href={`/${t.slug}/`} className="rounded-xl px-2.5 py-2 whitespace-nowrap text-muted transition-colors hover:bg-accent-soft hover:text-accent">
              {t.nav.replace(" Calculator", "")}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <a
            href={play ?? "#apps"}
            {...(play && { target: "_blank", rel: "noopener" })}
            className="btn-primary inline-flex h-11 items-center gap-2 rounded-2xl px-4 text-sm font-bold"
          >
            <Icon name="play" className="size-4" />
            <span className="sm:hidden">{play ? "Get app" : "App"}</span>
            <span className="hidden sm:inline">{play ? "Get JaxFit" : "JaxFit App"}</span>
            {!play && <span className="rounded-full bg-on-accent/15 px-1.5 py-0.5 text-[0.625rem] font-extrabold uppercase">Soon</span>}
          </a>
        </div>
      </div>
    </header>
  );
}
