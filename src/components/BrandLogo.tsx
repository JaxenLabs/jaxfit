"use client";

import { useState } from "react";
import { site } from "@/content/site";

/**
 * The JaxFast logo (public/images/jaxfast-logo.png). Replace that file to
 * change the logo everywhere. If it can't be loaded, a built-in leaf and
 * fasting-ring icon is drawn instead, so the site never shows a broken image.
 */
export function BrandLogo({ size = 40, eager = false, className = "" }: { size?: number; eager?: boolean; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <FallbackLogo className={className} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export: plain <img> with a fixed size
    <img
      src={`${site.basePath}/images/jaxfast-logo.png`}
      alt="JaxFast Logo"
      width={size}
      height={size}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

/** A botanical leaf inside a fasting ring, in the JaxFast colours. */
function FallbackLogo({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-label="JaxFast Logo" className={className}>
      <rect width="48" height="48" rx="12" fill="#0f766e" />
      <circle cx="24" cy="24" r="14" fill="none" stroke="#fbbf24" strokeWidth="3.5" strokeDasharray="66 22" strokeLinecap="round" transform="rotate(-90 24 24)" />
      <path d="M24 32c0-7 4-11 9-12-1 6-4 11-9 12Z" fill="#4ade80" />
      <path d="M24 32c0-5-3-8-7-9 1 4 3 8 7 9Z" fill="#86efac" />
    </svg>
  );
}
