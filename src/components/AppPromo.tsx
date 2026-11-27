import { jaxfast } from "@/content/apps";
import { BrandLogo } from "./BrandLogo";
import { Icon } from "./Icon";

/**
 * The JaxFast app on Google Play: the badge, the app section after the
 * calculator, the card beside it on wide screens and the bar pinned to the
 * bottom of phones and tablets. Every link carries its `placement` so
 * installs can be traced back to the button (see `jaxfast.play`).
 */

/** The four-colour Google Play triangle. */
export function PlayLogo({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 26" className={`shrink-0 ${className}`} aria-hidden>
      <path fill="#00d7fe" d="M1 1.2c-.3.3-.5.9-.5 1.6v20.4c0 .7.2 1.3.5 1.6L12.4 13 1 1.2z" />
      <path fill="#ffce00" d="m16.2 16.8-3.8-3.8 3.8-3.8 4.6 2.6c1.3.7 1.3 1.9 0 2.6l-4.6 2.4z" />
      <path fill="#ff3a44" d="M16.2 16.8 12.4 13 1 24.8c.4.5 1.1.5 1.9.1l13.3-8.1z" />
      <path fill="#00f076" d="M16.2 9.2 2.9 1.1C2.1.7 1.4.7 1 1.2L12.4 13l3.8-3.8z" />
    </svg>
  );
}

/** The official-style "Get it on Google Play" badge for JaxFast. */
export function JaxFastBadge({ placement, className = "" }: { placement: string; className?: string }) {
  return (
    <a
      href={jaxfast.play(placement)}
      target="_blank"
      rel="noopener"
      aria-label={`Get ${jaxfast.name} on Google Play`}
      className={`inline-flex h-14 shrink-0 items-center gap-3 rounded-2xl border border-[#3c4043] bg-black px-4 text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98] ${className}`}
    >
      <PlayLogo />
      <span className="text-left leading-none">
        <span className="block text-[0.625rem] font-semibold tracking-wide uppercase">Get it on</span>
        <span className="mt-1 block text-xl font-bold tracking-tight">Google Play</span>
      </span>
    </a>
  );
}

/** The JaxFast app section shown straight after the calculator. */
export function AppEcosystem() {
  return (
    <section id="apps" aria-labelledby="apps-title" className="scroll-mt-24">
      <article className="card relative overflow-hidden p-5 sm:p-7">
        <div aria-hidden className="pointer-events-none absolute -top-24 -right-20 size-72 rounded-full bg-accent-2/15 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <BrandLogo size={64} className="size-16 rounded-2xl shadow-lg" />
          <div className="min-w-0">
            <h2 id="apps-title" className="text-lg font-extrabold">
              {jaxfast.title}
            </h2>
            <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-bold text-accent">
              <Icon name="check" className="size-3.5" />
              Available on Google Play
            </p>
          </div>
        </div>
        <p className="relative mt-5 text-2xl leading-tight font-extrabold tracking-tight sm:text-3xl">{jaxfast.headline}</p>
        <ul className="relative mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {jaxfast.pillars.map((p) => (
            <li key={p.title} className="flex gap-3 rounded-2xl bg-field p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                <Icon name={p.icon} className="size-5" />
              </span>
              <span className="min-w-0 text-sm leading-relaxed text-muted">
                <strong className="block text-[0.9375rem] text-text">{p.title}</strong>
                {p.text}
              </span>
            </li>
          ))}
        </ul>
        <div className="relative mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
          <JaxFastBadge placement="ecosystem" />
          <p className="text-sm font-semibold text-muted">For Android · No account · No ads · Works offline</p>
        </div>
      </article>
    </section>
  );
}

/** Wide screens: the app beside the calculator, so it's seen without scrolling. */
export function HeroAside() {
  return (
    <aside aria-label="JaxFast app" className="hidden lg:block">
      <div className="sticky top-28">
        <div className="card overflow-hidden p-5 text-center">
          <BrandLogo size={96} eager className="mx-auto size-24 rounded-3xl shadow-xl" />
          <p className="mt-4 text-lg font-extrabold">{jaxfast.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">Fasting plans with a live dial, recipes and meal plans, water and weight tracking and your Habit Garden, 100% offline.</p>
          <JaxFastBadge placement="hero" className="mt-4" />
        </div>
      </div>
    </aside>
  );
}

/** A short line and Google Play button under a calculator's results. */
export function ResultsCta({ text, placement }: { text: string; placement: string }) {
  return (
    <div className="mt-6 flex flex-col gap-3 rounded-3xl bg-accent-soft p-4 sm:flex-row sm:items-center sm:p-5">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <BrandLogo size={48} className="size-12 shrink-0 rounded-xl" />
        <p className="text-sm leading-relaxed font-semibold text-text/80">{text}</p>
      </div>
      <JaxFastBadge placement={placement} className="self-start sm:self-auto" />
    </div>
  );
}

/** Phones and tablets: JaxFast pinned to the bottom of the screen, like an app's install bar. */
export function StickyAppBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex h-[4.5rem] max-w-3xl items-center gap-3 px-4">
        <BrandLogo size={44} className="size-11 shrink-0 rounded-xl" />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate font-extrabold">{jaxfast.name}</p>
          <p className="truncate text-xs font-semibold text-muted">Offline fasting & meal plans</p>
        </div>
        <a
          href={jaxfast.play("sticky_bar")}
          target="_blank"
          rel="noopener"
          aria-label={`Get ${jaxfast.name} on Google Play`}
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-2xl bg-black px-3.5 text-sm font-bold whitespace-nowrap text-white"
        >
          <PlayLogo className="size-5" />
          Get it on Play
        </a>
      </div>
    </div>
  );
}
