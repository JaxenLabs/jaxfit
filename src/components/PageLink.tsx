import Link from "next/link";
import type { ComponentProps } from "react";

/**
 * A link to another page of this site, with prefetching turned off. With
 * `output: "export"`, Next.js 16 prefetches dynamic-route pages from files
 * named like `__next.$d$format.__PAGE__.txt`, but the export saves them in a
 * folder (`__next.$d$format/__PAGE__.txt`), so every prefetch is a 404. A
 * normal click loads the page's own data file, which does exist.
 */
export function PageLink(props: ComponentProps<typeof Link>) {
  return <Link prefetch={false} {...props} />;
}
