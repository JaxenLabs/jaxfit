import { PageLink as Link } from "@/components/PageLink";
import { jaxfast } from "@/content/apps";
import { PlayLogo } from "./AppPromo";
import { BrandLogo } from "./BrandLogo";
import { HeaderNav } from "./HeaderNav";
import { ThemeToggle } from "./ThemeToggle";

/**
 * Sticky top bar: the JaxFast logo, links to the calculators (wide screens),
 * the theme button and the button that opens JaxFast on Google Play.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 pt-[env(safe-area-inset-top)] lg:px-6 lg:pt-4">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 border-b border-border bg-bg/85 px-4 backdrop-blur-xl lg:rounded-2xl lg:border lg:bg-card/80 lg:pr-2.5 lg:shadow-[0_8px_40px_-20px_var(--shadow)]">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <BrandLogo size={40} eager className="size-10 shrink-0 rounded-xl" />
          <span className="text-xl leading-none font-extrabold tracking-tight">
            Jax<span className="text-accent">Fast</span>
          </span>
        </Link>
        <HeaderNav />
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <a
            href={jaxfast.play("header")}
            target="_blank"
            rel="noopener"
            aria-label={`Get ${jaxfast.name} on Google Play`}
            className="btn-primary inline-flex h-11 items-center gap-2 rounded-2xl px-4 text-sm font-bold whitespace-nowrap"
          >
            <PlayLogo className="size-4" />
            <span className="sm:hidden">Get app</span>
            <span className="hidden sm:inline">Get {jaxfast.name}</span>
          </a>
        </div>
      </div>
    </header>
  );
}
