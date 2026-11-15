/**
 * Builds the GitHub Pages copy of the site as forwarding pages to its real
 * home on Cloudflare Pages, so old links and search results keep working and
 * the two copies don't compete in search.
 *
 * For every page of the built site (out/), it writes a page at the same path
 * that points search engines to the Cloudflare address (canonical) and sends
 * visitors there straight away, keeping any ?query and #anchor. Unknown
 * paths (404.html) are forwarded too, minus the GitHub Pages folder.
 *
 * Usage: node scripts/github-redirects.mjs <built site> <output folder> <Cloudflare address> <GitHub Pages folder>
 *   e.g. node scripts/github-redirects.mjs out github-pages https://topdf-online.pages.dev /topdf
 * Used by .github/workflows/deploy.yml.
 */
import { mkdir, readdir, writeFile } from "node:fs/promises";
import { dirname, join, relative, sep } from "node:path";

const [from, to, target, folder] = process.argv.slice(2);
if (!from || !to || !/^https:\/\/[^/]+$/.test(target ?? "") || !/^\/[\w-]+$/.test(folder ?? "")) {
  console.error("Usage: node scripts/github-redirects.mjs <built site> <output folder> <https://name.pages.dev> </github-folder>");
  process.exit(1);
}

const escape = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/** A page that forwards to `url` (plus the visitor's ?query and #anchor). */
const forward = (url) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>This page has moved</title>
<link rel="canonical" href="${escape(url)}">
<meta name="robots" content="noindex, follow">
<meta http-equiv="refresh" content="0; url=${escape(url)}">
<script>location.replace(${JSON.stringify(url)} + location.search + location.hash);</script>
</head>
<body style="font-family:system-ui,sans-serif;padding:2rem">
<p>This page has moved to <a href="${escape(url)}">${escape(url)}</a>.</p>
</body>
</html>
`;

/** The 404 page: forwards whatever path was asked for, without the GitHub Pages folder. */
const forwardAny = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>This site has moved</title>
<meta name="robots" content="noindex">
<script>
  var path = location.pathname.replace(new RegExp(${JSON.stringify(`^${folder}(?=/|$)`)}), "");
  location.replace(${JSON.stringify(target)} + (path || "/") + location.search + location.hash);
</script>
</head>
<body style="font-family:system-ui,sans-serif;padding:2rem">
<p>This site has moved to <a href="${escape(target)}/">${escape(target)}</a>.</p>
</body>
</html>
`;

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name.endsWith(".html")) yield path;
  }
}

let count = 0;
for await (const file of htmlFiles(from)) {
  const rel = relative(from, file).split(sep).join("/");
  // Next.js's internal copies of the error page; 404.html covers them.
  if (/^(_not-found|404)\//.test(rel)) continue;
  const out = join(to, rel);
  await mkdir(dirname(out), { recursive: true });
  if (rel === "404.html") {
    await writeFile(out, forwardAny);
  } else {
    // "dhaka/index.html" → https://…/dhaka/ ; "index.html" → https://…/
    const path = rel === "index.html" ? "/" : `/${rel.replace(/(^|\/)index\.html$/, "$1").replace(/\.html$/, "")}`;
    await writeFile(out, forward(`${target}${path}`));
  }
  count++;
}
// GitHub Pages must serve files as they are (no Jekyll processing).
await writeFile(join(to, ".nojekyll"), "");
console.log(`Wrote ${count} forwarding pages to ${to} → ${target}`);
