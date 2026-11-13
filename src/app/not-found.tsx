import { SITE_URL } from "@/content/site";

/** 404 page: points back to the calculators. */
export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-3xl font-extrabold">Page not found</h1>
      <p className="mt-3 text-muted">This page doesn’t exist, but your fasting calculator does.</p>
      <a href={SITE_URL} className="btn-primary mt-6 inline-flex h-12 items-center rounded-2xl px-6 font-bold">
        Open the JaxFit calculator
      </a>
    </section>
  );
}
