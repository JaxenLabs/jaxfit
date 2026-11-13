
import { Icon } from "./Icon";

/**
 * FAQ accordion built on <details>, so it works without JavaScript and the
 * answers are in the HTML for search engines. The same questions feed the
 * FAQPage structured data (src/lib/seo.ts).
 */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card">
      {items.map((f, i) => (
        <details key={f.q} open={i === 0} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold sm:px-6 sm:py-5">
            <h3 className="text-base">{f.q}</h3>
            <Icon name="chevron" className="chev size-5 shrink-0 text-muted transition-transform" />
          </summary>
          <p className="px-5 pb-5 text-sm leading-relaxed text-muted sm:px-6">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
