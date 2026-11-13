/**
 * Adds JSON-LD structured data (facts search engines read to show richer
 * results). `<` is escaped so the data can never close the <script> early.
 */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
