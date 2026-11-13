import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageBody } from "@/components/PageBody";
import { TOOLS, toolBySlug } from "@/content/tools";
import { toolMetadata } from "@/lib/seo";

/** One static page per calculator, e.g. /bmi-calculator/ or /16-8-fasting-schedule/. */
export const dynamicParams = false;

export function generateStaticParams() {
  return TOOLS.map((t) => ({ tool: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ tool: string }> }): Promise<Metadata> {
  const t = toolBySlug((await params).tool);
  return t ? toolMetadata(t) : {};
}

export default async function ToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const t = toolBySlug((await params).tool);
  if (!t) notFound();
  return <PageBody tool={t} />;
}
