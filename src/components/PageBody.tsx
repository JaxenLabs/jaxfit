import { AppEcosystem, HeroAside } from "@/components/AppPromo";
import { Faq } from "@/components/Faq";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";
import { PageLink as Link } from "@/components/PageLink";
import { JaxFitHub } from "@/components/hub/JaxFitHub";
import { NAV_TOOLS, disclaimer, privacyPoints, steps, type ToolPage } from "@/content/tools";
import { pageJsonLd } from "@/lib/seo";

/**
 * The whole page, shared by every calculator page. The calculator comes
 * first (with the JaxFit app beside it on wide screens), then the two app
 * cards, then the guide, how-to, privacy, FAQ and links to the other calculators.
 */
export function PageBody({ tool }: { tool: ToolPage }) {
  return (
    <>
      <JsonLd data={pageJsonLd(tool)} />

      <section id="top" className="mx-auto grid max-w-6xl gap-10 px-4 pt-6 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-10 lg:px-6 lg:pt-12">
        <div className="min-w-0">
          <h1 className="text-[1.9rem] leading-[1.1] font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            {tool.h1} <span className="text-accent">{tool.highlight}</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">{tool.intro}</p>
          <p className="mt-4 inline-flex max-w-full items-center gap-2 rounded-2xl bg-accent-soft px-4 py-2.5 text-xs font-bold text-accent sm:text-sm">
            <Icon name="shield" className="size-4 shrink-0" />
            100% private: runs in your browser, nothing is uploaded
          </p>
          <div className="mt-6">
            <JaxFitHub key={tool.slug} defaultTab={tool.tab} defaultProtocol={tool.protocol} />
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted">{disclaimer}</p>
        </div>
        <HeroAside />
      </section>

      <div className="mx-auto max-w-6xl space-y-16 px-4 pt-12 lg:space-y-24 lg:px-6 lg:pt-16">
        <AppEcosystem />

        <section aria-labelledby="guide-title" className="max-w-3xl">
          <SectionTitle id="guide-title" eyebrow="Guide" title={tool.guide.title} />
          <div className="mt-5 space-y-4 leading-relaxed text-muted">
            {tool.guide.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </section>

        <section id="how-to" aria-labelledby="how-to-title">
          <SectionTitle id="how-to-title" eyebrow="Step by step" title="How to Use the JaxFit Calculator" />
          <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} className="card p-5">
                <span className="grid size-9 place-items-center rounded-xl bg-accent font-extrabold text-on-accent">{i + 1}</span>
                <h3 className="mt-3 font-extrabold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="privacy" aria-labelledby="privacy-title">
          <SectionTitle id="privacy-title" eyebrow="Private by design" title="Your Health Data Stays on Your Device" />
          <ul className="mt-8 grid gap-3 md:grid-cols-3">
            {privacyPoints.map((p) => (
              <li key={p} className="flex gap-3 rounded-3xl bg-accent-soft p-5 text-sm leading-relaxed font-semibold text-text/80">
                <Icon name="lock" className="mt-0.5 size-5 shrink-0 text-accent" />
                {p}
              </li>
            ))}
          </ul>
        </section>

        <section id="faq" aria-labelledby="faq-title">
          <SectionTitle id="faq-title" eyebrow="FAQ" title="Frequently Asked Questions" />
          <div className="mt-8">
            <Faq items={tool.faq} />
          </div>
        </section>

        <nav aria-labelledby="more-title">
          <SectionTitle id="more-title" eyebrow="More calculators" title="Free JaxFit Calculators" />
          <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {NAV_TOOLS.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/${t.slug}/`}
                  aria-current={t.slug === tool.slug ? "page" : undefined}
                  className="flex min-h-14 items-center justify-between gap-2 rounded-2xl border border-border bg-card px-4 font-bold transition-colors hover:border-accent aria-[current=page]:border-accent aria-[current=page]:text-accent"
                >
                  {t.nav}
                  <Icon name="chevron" className="size-4 shrink-0 -rotate-90 text-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}

function SectionTitle({ id, eyebrow, title }: { id: string; eyebrow: string; title: string }) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-bold text-accent">{eyebrow}</p>
      <h2 id={id} className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}
