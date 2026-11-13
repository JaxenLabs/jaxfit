import type { Metadata } from "next";
import { PageBody } from "@/components/PageBody";
import { DEFAULT_TOOL } from "@/content/tools";
import { toolMetadata } from "@/lib/seo";

/**
 * The main page shows the intermittent fasting calculator. Its canonical
 * address is /intermittent-fasting-calculator/, so search engines treat that
 * page as the one to rank.
 */
export const metadata: Metadata = toolMetadata(DEFAULT_TOOL);

export default function Home() {
  return <PageBody tool={DEFAULT_TOOL} />;
}
