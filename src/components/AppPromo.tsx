"use client";

import { useState } from "react";
import { jaxfit } from "@/content/apps";
import { BrandLogo } from "./BrandLogo";
import { Icon } from "./Icon";

/**
 * The JaxFit app (coming soon on Google Play). While JAXFIT_PLAY_STORE_URL in content/apps.ts is null, JaxFit
 * shows a "Coming Soon" badge with a bookmark button; once it's set, every
 * badge becomes a live Google Play button.
 */

/** The four-colour Google Play triangle. */
function PlayLogo({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 26" className={`shrink-0 ${className}`} aria-hidden>
      <path fill="#00d7fe" d="M1 1.2c-.3.3-.5.9-.5 1.6v20.4c0 .7.2 1.3.5 1.6L12.4 13 1 1.2z" />
      <path fill="#ffce00" d="m16.2 16.8-3.8-3.8 3.8-3.8 4.6 2.6c1.3.7 1.3 1.9 0 2.6l-4.6 2.4z" />
      <path fill="#ff3a44" d="M16.2 16.8 12.4 13 1 24.8c.4.5 1.1.5 1.9.1l13.3-8.1z" />
      <path fill="#00f076" d="M16.2 9.2 2.9 1.1C2.1.7 1.4.7 1 1.2L12.4 13l3.8-3.8z" />
    </svg>
  );
}

/** The official-style "Get it on Google Play" badge. */
export function PlayBadge({ href, app, className = "" }: { href: string; app: string; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      aria-label={`Get ${app} on Google Play`}
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

/** JaxFit's Google Play badge while it isn't published: not a link, clearly marked "coming soon". */
function ComingSoonBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex h-14 shrink-0 items-center gap-3 rounded-2xl border border-dashed border-[#5f6368] bg-black/90 px-4 text-white ${className}`}>
      <PlayLogo className="size-7 opacity-80" />
      <span className="text-left leading-none">
        <span className="block text-[0.625rem] font-semibold tracking-wide text-[#fbbf24] uppercase">Coming soon on</span>
        <span className="mt-1 block text-xl font-bold tracking-tight">Google Play</span>
      </span>
    </span>
  );
}

/** JaxFit's badge: live once the Play Store link is set, "coming soon" until then. */
export function JaxFitBadge({ placement, className = "" }: { placement: string; className?: string }) {
  const href = jaxfit.play(placement);
  return href ? <PlayBadge href={href} app={jaxfit.name} className={className} /> : <ComingSoonBadge className={className} />;
}

/**
 * "Bookmark this page": phones open the share sheet (with Add to Home
 * screen / bookmark options); computers copy the link and show the
 * keyboard shortcut, since pages can't add bookmarks themselves.
 */
export function BookmarkButton({ className = "" }: { className?: string }) {
  const [done, setDone] = useState<string | null>(null);
  const bookmark = async () => {
    const url = location.href.split("#")[0];
    const touch = matchMedia("(pointer: coarse)").matches;
    if (touch && navigator.share) {
      try {
        await navigator.share({ title: document.title, url });
        return;
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setDone(`Link copied. Press ${/Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘" : "Ctrl"}+D to bookmark it.`);
    } catch {
      setDone(`Press ${/Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘" : "Ctrl"}+D to bookmark this page.`);
    }
  };
  return (
    <div className={className}>
      <button type="button" onClick={bookmark} className="btn-ghost inline-flex h-14 items-center gap-2 rounded-2xl px-5 font-bold">
        <Icon name="bookmark" className="size-5 text-amber-2" />
        Bookmark This Page
      </button>
      <p role="status" className="mt-2 min-h-5 text-xs font-semibold text-muted">
        {done}
      </p>
    </div>
  );
}

/** The JaxFit app section shown straight after the calculator. */
export function AppEcosystem() {
  return (
    <section id="apps" aria-labelledby="apps-title" className="scroll-mt-24">
      <h2 id="apps-title" className="sr-only">
        The JaxFit app
      </h2>
      <div>
        <article className="card relative overflow-hidden p-5 sm:p-7">
          <div aria-hidden className="pointer-events-none absolute -top-24 -right-20 size-72 rounded-full bg-accent-2/15 blur-3xl" />
          <div className="relative flex items-center gap-4">
            <BrandLogo size={64} className="size-16 rounded-2xl shadow-lg" />
            <div className="min-w-0">
              <p className="text-lg font-extrabold">{jaxfit.title}</p>
              <p className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-amber-soft px-2.5 py-1 text-xs font-bold text-amber">
                <Icon name="clock" className="size-3.5" />
                {jaxfit.play("card") ? "Available on Google Play" : "Coming Soon on Google Play"}
              </p>
            </div>
          </div>
          <h3 className="relative mt-5 text-2xl leading-tight font-extrabold tracking-tight sm:text-3xl">{jaxfit.headline}</h3>
          <ul className="relative mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {jaxfit.pillars.map((p) => (
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
          <div className="relative mt-6 flex flex-wrap items-start gap-3">
            <JaxFitBadge placement="ecosystem" />
            {!jaxfit.play("ecosystem") && <BookmarkButton />}
          </div>
        </article>

      </div>
    </section>
  );
}

/** Wide screens: the app beside the calculator, so it's seen without scrolling. */
export function HeroAside() {
  return (
    <aside aria-label="JaxFit app" className="hidden lg:block">
      <div className="sticky top-28">
        <div className="card overflow-hidden p-5 text-center">
          <BrandLogo size={96} eager className="mx-auto size-24 rounded-3xl shadow-xl" />
          <p className="mt-4 text-lg font-extrabold">{jaxfit.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">Fasting timer, halal meal plans, weight tracking and your Habit Garden, 100% offline.</p>
          <JaxFitBadge placement="hero" className="mt-4" />
        </div>
      </div>
    </aside>
  );
}
