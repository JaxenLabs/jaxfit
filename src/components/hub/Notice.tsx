import type { ReactNode } from "react";
import { Icon } from "../Icon";

/** A supportive message box (safety notes, safeguards). */
export function Notice({ tone, title, children }: { tone: "amber" | "green" | "info"; title: string; children: ReactNode }) {
  const styles = { amber: "bg-amber-soft text-amber", green: "bg-accent-soft text-accent", info: "bg-field text-muted" }[tone];
  return (
    <div role="note" className={`flex gap-3 rounded-3xl p-5 ${styles}`}>
      <Icon name={tone === "green" ? "heart" : "info"} className="mt-0.5 size-5 shrink-0" />
      <div className="min-w-0">
        <p className="font-extrabold">{title}</p>
        <div className="mt-1 text-sm leading-relaxed text-text/80">{children}</div>
      </div>
    </div>
  );
}
