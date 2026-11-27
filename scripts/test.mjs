/**
 * End-to-end test of the built site (run `npm run build` first, then `npm test`).
 *
 * Serves out/ at the site's basePath like GitHub Pages and opens it in
 * headless Chromium:
 * - Fasting: plan picker, last-meal time, schedule times, custom slider,
 *   body stages, and the Start fast button (a JaxFast Google Play link, no browser timer).
 * - BMI & calories: BMI, WHO category, healthy range, BMR/TDEE, target and
 *   goal date, trend ranges, imperial units, and every safeguard (under 18,
 *   underweight, goal below a healthy BMI, the safe calorie minimum).
 * - Water: target in litres / ml / glasses, logging glasses, the Habit Garden.
 * - Theme toggle, saved details shared across pages, each page's SEO tags.
 * - The extra landing pages (18:6, 20:4, ideal weight): presets, real
 *   results, linked only from the main page; the sitemap, _headers and
 *   the IndexNow key file.
 * It also fails on browser errors, requests to other servers or carrying data,
 * and if a company name or email appears.
 * Set CHROME_PATH to use a Chrome that is already installed.
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const OUT = fileURLToPath(new URL("../out/", import.meta.url));
const BASE = "";
const TOOLS = [
  { slug: "intermittent-fasting-calculator", tab: "fasting", title: /^Intermittent Fasting Calculator/ },
  { slug: "bmi-calculator", tab: "body", title: /^BMI Calculator/ },
  { slug: "calorie-deficit-calculator", tab: "body", title: /^Calorie Deficit Calculator/ },
  { slug: "16-8-fasting-schedule", tab: "fasting", title: /^16:8 Fasting Schedule/ },
  { slug: "water-intake-calculator", tab: "water", title: /^Water Intake Calculator/ },
  { slug: "18-6-fasting-schedule", tab: "fasting", title: /^18:6 Fasting Schedule/ },
  { slug: "20-4-fasting-schedule", tab: "fasting", title: /^20:4 Fasting Schedule/ },
  { slug: "ideal-weight-calculator", tab: "body", title: /^Ideal Weight Calculator/ },
];
/** The extra landing pages: linked from the main page and the sitemap only, not the header or footer. */
const POPULAR = ["18-6-fasting-schedule", "20-4-fasting-schedule", "ideal-weight-calculator"];
const KEY = "845c2f16773504845be98e165b02af08";
const SITE = "https://jaxfast.pages.dev";
/** JaxFast on Google Play (the package name keeps the app's original "jaxfit" id), and a button's link with its install referrer. */
const PLAY = "https://play.google.com/store/apps/details?id=com.jaxenlabs.jaxfit";
const play = (placement) => `${PLAY}&referrer=utm_source%3Dweb_jaxfast_hub%26utm_content%3D${placement}`;
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2", ".txt": "text/plain", ".xml": "application/xml", ".webmanifest": "application/manifest+json" };

// --- A tiny static server, like GitHub Pages ---------------------------------
const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (!path.startsWith(BASE)) return res.writeHead(404).end();
  let file = normalize(join(OUT, path.slice(BASE.length)));
  if (!file.startsWith(normalize(OUT))) return res.writeHead(403).end();
  if (file.endsWith("\\") || file.endsWith("/")) file = join(file, "index.html");
  try {
    const body = await readFile(file);
    res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" }).end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(0, r));
const origin = `http://localhost:${server.address().port}`;
const url = (path = "") => `${origin}${BASE}/${path}`;

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const context = await browser.newContext();
// Links that open Google Play are answered locally, so the test never reaches the real store.
await context.route(/^https:\/\/play\.google\.com\//, (r) => r.fulfill({ status: 200, contentType: "text/html", body: "Google Play" }));
const page = await context.newPage();

// --- Checks ------------------------------------------------------------------
const problems = [];
const check = (ok, message) => {
  console.log(`${ok ? "  ok  " : "  FAIL"}  ${message}`);
  if (!ok) problems.push(message);
};
page.on("console", (m) => m.type() === "error" && problems.push(`Console error: ${m.text().slice(0, 300)}`));
page.on("pageerror", (e) => problems.push(`Page error: ${e.message}`));
page.on("request", (r) => {
  const u = new URL(r.url());
  if (!(u.origin === origin || u.protocol === "data:")) problems.push(`Unexpected request: ${r.url()}`);
  if (r.postData()) problems.push(`Request sent data: ${r.url()}`);
});

const testId = (id) => page.locator(`[data-testid="${id}"]`).first().innerText();
const panel = (id) => page.locator(`#panel-${id}`);
/** Picks a calculator tab and waits for its page to load (tabs other than the page's own open their page). */
async function tab(id) {
  const before = page.url();
  await page.locator(`#tab-${id}`).click();
  await page.waitForURL((u) => u.href !== before, { timeout: 3000 }).catch(() => {});
  await page.waitForLoadState("networkidle");
  await page.locator(`#tab-${id}[aria-selected="true"]`).waitFor();
}
const schedule = async () => (await panel("fasting").locator('[data-testid="schedule"]').innerText()).replace(/\s+/g, " ");
/** Fills a labelled number box in a tab's details form. */
const fill = (tabId, label, value) => panel(tabId).getByLabel(label, { exact: true }).first().fill(String(value));

// --- Fasting --------------------------------------------------------------------
console.log("Fasting tab");
await page.goto(url());
await page.waitForLoadState("networkidle");
check((await page.locator("#tab-body").getAttribute("aria-selected")) === "true", "main page opens on the BMI tab");
check((await page.locator("header nav [aria-current=page]").innerText()) === "BMI", "main page highlights BMI in the header");
await page.goto(url("16-8-fasting-schedule/"));
await page.waitForLoadState("networkidle");
check((await page.locator("#tab-fasting").getAttribute("aria-selected")) === "true", "the 16:8 page opens on the fasting tab");
check((await page.locator('[role="radio"][aria-checked="true"]').innerText()).includes("16:8"), "16:8 is the default plan");
let s = await schedule();
check(s.includes("Fast begins 8:00 PM") && s.includes("12:00 PM next day") && s.includes("8 hours") && s.includes("Window closer meal 8:00 PM next day"), `16:8 from 8 PM: ${s}`);

await page.getByRole("radio", { name: /18:6/ }).click();
s = await schedule();
check(s.includes("2:00 PM next day") && s.includes("6 hours"), "18:6 opens the window at 2 PM");
await panel("fasting").getByLabel("My last meal ends at").fill("18:30");
s = await schedule();
check(s.includes("Fast begins 6:30 PM") && s.includes("12:30 PM next day"), "last meal time moves the schedule");
await page.getByRole("radio", { name: /24h/ }).click();
s = await schedule();
check(s.includes("Break your fast 6:30 PM next day") && s.includes("One meal"), "24h plan: break the fast 24 hours later");
await page.getByRole("radio", { name: /Custom/ }).click();
await panel("fasting").locator('input[type="range"]').fill("13");
s = await schedule();
check(s.includes("7:30 AM next day") && s.includes("11 hours"), "custom 13h fast");
const stages = await panel("fasting").locator("ol li").allInnerTexts();
check(stages.length === 4 && stages[3].includes("not reached on this plan") && stages[2].includes("from 6:30 AM next day"), "body stages with times; 16h+ not reached on a 13h fast");
await page.getByRole("radio", { name: /16:8/ }).click();

// Starting a fast opens JaxFast on Google Play instead of a browser timer.
{
  const start = panel("fasting").getByRole("link", { name: /^Start fast in JaxFast/ });
  check((await start.count()) === 1 && (await start.getAttribute("href")) === play("start_fast"), "Start fast is a link to JaxFast on Google Play (placement start_fast)");
  check((await start.getAttribute("target")) === "_blank" && (await start.getAttribute("rel")) === "noopener", "Start fast opens in a new tab with rel=noopener");
  check(!(await panel("fasting").getByRole("button", { name: /start|timer/i }).count()), "no browser timer button on the fasting tab");
  const [popup] = await Promise.all([context.waitForEvent("page"), start.click()]);
  await popup.waitForURL(/play.google.com/).catch(() => {});
  check(popup.url().startsWith(PLAY), `pressing Start fast opens Google Play (${popup.url().slice(0, 80)})`);
  await popup.close();
  await page.waitForTimeout(1200);
  check(
    !(await page.locator('[data-testid^="timer"]').count()) && (await page.evaluate(() => Object.keys(localStorage).every((k) => !k.includes("timer")))),
    "pressing Start fast doesn't start a timer on the page",
  );
}

// --- BMI & calories --------------------------------------------------------------------
console.log("BMI & calories tab");
await tab("body");
check((await testId("bmi")) === "26.4" && (await testId("bmi-category")) === "Overweight", "165 cm, 72 kg: BMI 26.4, Overweight");
check((await testId("healthy-range")) === "50.4 kg – 67.8 kg", "healthy range for 165 cm");
check((await testId("bmr")) === "1,440 kcal" && (await testId("tdee")) === "1,980 kcal", "Mifflin-St Jeor BMR 1,440, TDEE 1,980 (lightly active)");
check((await testId("target")) === "1,480 kcal", "steady pace: 500 kcal deficit");
check(/^[A-Z][a-z]+ \d{1,2}, 20\d\d$/.test(await testId("goal-date")), `goal date shown: ${await testId("goal-date")}`);
for (const [r, label] of [["7", "7 days"], ["90", "90 days"]]) {
  await panel("body").getByRole("button", { name: label, exact: true }).click();
  check((await testId("trend-change")).includes(`in ${r} days`), `trend: ${await testId("trend-change")}`);
}
await panel("body").getByRole("button", { name: /^Gentle/ }).click();
check((await testId("target")) === "1,730 kcal", "gentle pace: 250 kcal deficit");

await fill("body", "Goal weight", 45);
check((await panel("body").innerText()).includes("Your goal is below a healthy weight"), "goal below BMI 18.5 is blocked");
await panel("body").getByRole("button", { name: /Use 50.4 kg as my goal/ }).click();
check((await panel("body").getByLabel("Goal weight").inputValue()) === "50.4" && (await testId("target")).endsWith("kcal"), "suggested healthy goal is applied");

await fill("body", "Current weight", 48);
check((await testId("bmi-category")) === "Underweight" && (await panel("body").innerText()).includes("nourishment, not a deficit"), "underweight: no deficit");
await fill("body", "Current weight", 72);

await fill("body", "Age", 16);
check((await panel("body").innerText()).includes("Growing bodies need fuel") && !(await panel("body").locator('[data-testid="target"]').count()), "under 18: no weight-loss targets");
await tab("fasting");
check((await panel("fasting").innerText()).includes("Fasting plans are for adults") && !(await page.locator(`a[href="${play("start_fast")}"]`).count()), "under 18: no fasting plans or Start fast button");
await tab("body");
await fill("body", "Age", 70);
await panel("body").getByRole("button", { name: "Male", exact: true }).click();
await fill("body", "Height", 160);
await fill("body", "Current weight", 60);
await fill("body", "Goal weight", 55);
await panel("body").getByLabel("Activity level").selectOption("sedentary");
check((await panel("body").innerText()).includes("close to the safe minimum"), "maintenance near 1,500 kcal (men): no deficit offered");
await panel("body").getByLabel("Activity level").selectOption("moderate");
await panel("body").getByRole("button", { name: /^Brisk/ }).click();
check((await testId("target")) === "1,500 kcal" && (await panel("body").innerText()).includes("Safe minimum applied"), "brisk pace is held at 1,500 kcal for men");

// Back to the first person, then imperial units.
await panel("body").getByRole("button", { name: "Female", exact: true }).click();
await fill("body", "Age", 30);
await fill("body", "Height", 165);
await fill("body", "Current weight", 72);
await fill("body", "Goal weight", 64);
await panel("body").getByLabel("Activity level").selectOption("light");
await panel("body").getByRole("button", { name: /^Steady/ }).click();
await panel("body").getByRole("button", { name: "Imperial (lb, ft)" }).click();
check((await panel("body").getByLabel("Current weight").inputValue()) === "158.7" && (await panel("body").getByLabel("Height", { exact: true }).inputValue()) === "5", "imperial: 158.7 lb, 5 ft");
check((await panel("body").getByLabel("Inches").inputValue()) === "5" && (await testId("healthy-range")) === "111 lb – 149.5 lb", `imperial: 5 in, range in lb (${await testId("healthy-range")})`);
await panel("body").getByLabel("Inches").fill("10");
check((await testId("bmi")) === "22.8" && (await testId("bmi-category")) === "Healthy weight", "5 ft 10 in, 158.7 lb: BMI 22.8, Healthy weight");
await panel("body").getByLabel("Inches").fill("5");
await panel("body").getByRole("button", { name: "Metric (kg, cm)" }).click();
check((await testId("bmi")) === "26.4", "back to metric: same BMI");

// --- Water & garden --------------------------------------------------------------------
console.log("Water tab");
await tab("water");
check((await testId("water-litres")) === "2.65 L" && (await testId("water-detail")).startsWith("2,650 ml · 11 glasses"), "72 kg, lightly active: 2.65 L, 11 glasses");
check((await testId("garden-level")) === "Thirsty seed", "the garden starts as a seed");
await page.getByRole("button", { name: /Log a Glass of Water/ }).click();
await page.getByRole("button", { name: /Complete Mini Fast/ }).click();
await page.getByRole("button", { name: /I Cooked a Healthy Meal/ }).click();
check((await panel("water").innerText()).includes("Today: 1 of 11 glasses") && (await testId("garden-level")) === "Seedling", "logging grows the garden");
await page.reload();
await tab("water");
check((await testId("garden-progress")).startsWith("3 healthy actions"), "garden is saved");
check((await panel("water").innerText()).includes("Nothing in your garden ever dies"), "garden promise is shown");

// --- Theme ------------------------------------------------------------------------------
await page.getByRole("button", { name: "Switch to dark theme" }).click();
await page.reload();
check((await page.evaluate(() => document.documentElement.dataset.theme)) === "dark", "dark theme is remembered");
await page.getByRole("button", { name: "Switch to light theme" }).click();
check((await page.evaluate(() => document.documentElement.dataset.theme)) === "light", "light theme again");

// --- Apps -------------------------------------------------------------------------------
console.log("JaxFast app");
{
  const links = page.locator('a[href*="play.google.com"]');
  const hrefs = await links.evaluateAll((as) => as.map((a) => [a.getAttribute("href"), a.target, a.rel]));
  check(hrefs.length > 0 && hrefs.every(([h, t, r]) => h.startsWith(`${PLAY}&referrer=utm_source%3Dweb_jaxfast_hub%26utm_content%3D`) && t === "_blank" && r === "noopener"), `every Google Play link is JaxFast's, with the referrer, in a new tab (${hrefs.length})`);
  for (const [where, placement] of [["header", "header"], ["#apps", "ecosystem"], ["#top", "results_water"], ["footer", "footer"]]) {
    check((await page.locator(`${where} a[href="${play(placement)}"]`).count()) === 1, `Get it on Google Play in the ${where.replace("#", "")} (${placement})`);
  }
  check((await page.locator("#apps").innerText()).includes("Available on Google Play"), "app section says JaxFast is available");
  await page.setViewportSize({ width: 390, height: 844 });
  const bar = page.locator(`a[href="${play("sticky_bar")}"]`);
  const box = await bar.boundingBox();
  check((await bar.isVisible()) && box && box.y + box.height <= 844 && box.y > 700, "phones: Google Play bar pinned to the bottom");
  await page.setViewportSize({ width: 1440, height: 900 });
  check(!(await bar.isVisible()) && (await page.locator(`aside a[href="${play("hero")}"]`).isVisible()), "desktop: app card beside the calculator, no bottom bar");
}
const body = await page.locator("body").innerText();
check(!/coming soon/i.test(body), 'no "coming soon" on the page');
check(!/Jaxen ?Labs|JaxScan|JaxBudget|@[a-z0-9-]+\.[a-z]{2,}/i.test(body), "no company name, other apps or email on the page");

// --- Pages & SEO ------------------------------------------------------------------------
// --- Header menu and calculator tabs stay in step ---------------------------------
console.log("Header menu");
{
  await page.setViewportSize({ width: 1440, height: 900 });
  const highlighted = () => page.locator('header [aria-current="page"]').innerText();
  const nav = await page.locator('header nav[aria-label="Calculators"] a').allInnerTexts();
  check(nav.join(",") === "BMI,16:8 Fasting Schedule,Water Intake,Calorie Deficit", `header links: ${nav.join(", ")}`);
  const footer = await page.locator("footer nav a").allInnerTexts();
  check(!footer.includes("Fasting Calculator") && footer.length === 4, "footer lists the same four calculators");
  await page.goto(url("bmi-calculator/"));
  await page.waitForLoadState("networkidle");
  check((await highlighted()) === "BMI", "BMI page highlights BMI");
  await tab("water");
  check(
    page.url() === url("water-intake-calculator/") && (await highlighted()) === "Water Intake" && (await page.locator("h1").innerText()).startsWith("Daily Water Intake"),
    "the Water tab opens the water page: headline, header and content follow",
  );
  await tab("fasting");
  check(page.url() === url("16-8-fasting-schedule/") && (await highlighted()) === "16:8 Fasting Schedule", "the Fasting tab opens the 16:8 page");
  await page.locator("header").getByRole("link", { name: "BMI", exact: true }).click();
  await page.waitForURL(url("bmi-calculator/"));
  check((await page.locator("#tab-body").getAttribute("aria-selected")) === "true" && (await highlighted()) === "BMI", "the header's BMI link opens the BMI tab");
  await page.locator("header").getByRole("link", { name: "Calorie Deficit" }).click();
  await page.waitForURL(url("calorie-deficit-calculator/"));
  check((await highlighted()) === "Calorie Deficit" && (await page.locator("#tab-body").getAttribute("aria-selected")) === "true", "Calorie Deficit page: its link and the BMI & Calories tab");
  await page.goto(url());
  await page.waitForLoadState("networkidle");
}

console.log("Pages");
check((await page.locator('link[rel="canonical"]').getAttribute("href")) === `${SITE}/bmi-calculator/`, "main page canonical is the BMI calculator");
for (const t of TOOLS) {
  await page.goto(url(`${t.slug}/`));
  await page.waitForLoadState("networkidle");
  const title = await page.title();
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  const ld = JSON.parse(await page.locator('script[type="application/ld+json"]').first().innerText());
  const types = ld["@graph"].map((x) => x["@type"]);
  const faq = ld["@graph"].find((x) => x["@type"] === "FAQPage");
  check(
    t.title.test(title) &&
      canonical === `${SITE}/${t.slug}/` &&
      (await page.locator(`#tab-${t.tab}`).getAttribute("aria-selected")) === "true" &&
      types.includes("WebApplication") &&
      faq.mainEntity.length === 6 &&
      (await page.locator("details").count()) === 6,
    `${t.slug}: title, canonical, tab, WebApplication + 6 FAQs`,
  );
  check((await page.locator('[data-testid="bmi"]').innerText()) === "26.4", `${t.slug}: saved details shared`);
}
await page.goto(url("16-8-fasting-schedule/"));
await page.evaluate(() => localStorage.removeItem("jaxfast-fasting-v1"));
await page.reload();
check((await page.locator('[role="radio"][aria-checked="true"]').innerText()).includes("16:8"), "16:8 page opens on 16:8");

console.log("Popular plans (extra landing pages)");
for (const [slug, plan, opens, hours] of [
  ["18-6-fasting-schedule", "18:6", "2:00 PM next day", "6 hours"],
  ["20-4-fasting-schedule", "20:4", "4:00 PM next day", "4 hours"],
]) {
  await page.goto(url(`${slug}/`));
  await page.evaluate(() => localStorage.removeItem("jaxfast-fasting-v1"));
  await page.reload();
  await page.waitForLoadState("networkidle");
  const sched = await schedule();
  check((await page.locator('[role="radio"][aria-checked="true"]').innerText()).includes(plan) && sched.includes("Fast begins 8:00 PM") && sched.includes(opens) && sched.includes(hours), `${slug}: opens on ${plan}, real schedule: ${sched}`);
}
await page.goto(url("ideal-weight-calculator/"));
await page.waitForLoadState("networkidle");
check((await page.locator("#tab-body").getAttribute("aria-selected")) === "true" && (await testId("healthy-range")) === "50.4 kg – 67.9 kg", `ideal weight page: BMI tab with the healthy range for the saved 5 ft 5 in, 165.1 cm (${await testId("healthy-range")})`);
for (const slug of POPULAR) {
  await page.goto(url(`${slug}/`));
  const ld = JSON.parse(await page.locator('script[type="application/ld+json"]').first().innerText());
  const types = ld["@graph"].map((x) => x["@type"]);
  const nav = await page.locator('header nav[aria-label="Calculators"] a').allInnerTexts();
  check(
    ["WebApplication", "FAQPage", "HowTo", "BreadcrumbList"].every((x) => types.includes(x)) &&
      ld["@graph"].find((x) => x["@type"] === "HowTo").name !== "How to Use the JaxFast Calculator" &&
      (await page.locator("h1").count()) === 1 &&
      nav.join(",") === "BMI,16:8 Fasting Schedule,Water Intake,Calorie Deficit" &&
      (await page.locator("footer nav a").count()) === 4,
    `${slug}: own how-to, structured data, one H1, header and footer unchanged`,
  );
}
await page.goto(url());
for (const slug of POPULAR) check((await page.locator(`main a[href="/${slug}/"]`).count()) === 1 && (await page.locator(`header a[href="/${slug}/"], footer a[href="/${slug}/"]`).count()) === 0, `main page content links to /${slug}/ (not the header or footer)`);
await page.goto(url("bmi-calculator/"));
check((await page.locator(POPULAR.map((s) => `a[href="/${s}/"]`).join(", ")).count()) === 0, "other calculator pages don't link to the extra pages");
await page.goto(url("16-8-fasting-schedule/"));
// Footer link navigation (client-side).
await page.locator("footer").getByRole("link", { name: "BMI Calculator" }).click();
await page.waitForURL(url("bmi-calculator/"));
check((await page.locator("h1").innerText()).startsWith("WHO BMI Calculator"), "footer link opens the BMI calculator");

const sitemap = await (await fetch(url("sitemap.xml"))).text();
check(TOOLS.every((t) => sitemap.includes(`<loc>${SITE}/${t.slug}/</loc>`)) && (sitemap.match(/<loc>/g) ?? []).length === 8, "sitemap lists the eight calculator pages");
for (const file of ["_headers", `${KEY}.txt`, "_redirects", "google88897a4d8dc2d04e.html"]) {
  const r = await fetch(url(file));
  const text = r.ok ? await r.text() : "";
  const ok = { _headers: text.includes("/_next/static/*"), _redirects: text.includes("/google88897a4d8dc2d04e.html"), "google88897a4d8dc2d04e.html": text.includes("google88897a4d8dc2d04e") }[file] ?? text === KEY;
  check(ok, `out/${file} exists`);
}
const res404 = await fetch(url("nope/"));
check(res404.status === 404, "unknown pages are 404");

console.log("Renamed to JaxFast");
// Details saved under the old JaxFit keys are kept and moved to the new ones.
await page.evaluate(() => {
  localStorage.removeItem("jaxfast-garden-v1");
  localStorage.setItem("jaxfit-garden-v1", JSON.stringify({ water: 4, fast: 1, meal: 2, todayWater: 0, day: "" }));
});
await page.goto(url("water-intake-calculator/"));
await page.waitForLoadState("networkidle");
check(
  (await testId("garden-progress")).startsWith("7 healthy actions") && (await page.evaluate(() => localStorage.getItem("jaxfit-garden-v1") === null && localStorage.getItem("jaxfast-garden-v1") !== null)),
  "a garden saved under the old key is moved to the new one",
);
// Every built page: the new name and address only ("jaxfit" survives only in the Play Store package name), and no other apps.
{
  const { readdir } = await import("node:fs/promises");
  const pages = (await readdir(OUT, { recursive: true })).filter((f) => f.endsWith(".html") && !f.startsWith("google"));
  const bad = [];
  for (const f of pages) {
    const html = (await readFile(join(OUT, f), "utf8")).replaceAll("com.jaxenlabs.jaxfit", "");
    if (/jaxfit/i.test(html)) bad.push(`${f}: JaxFit`);
    if (/coming soon/i.test(html)) bad.push(`${f}: coming soon`);
    if (/JaxBudget|JaxScan|Jaxen ?Labs/i.test(html)) bad.push(`${f}: another app or the company`);
    if (/halal/i.test(html)) bad.push(`${f}: halal claim`);
    if (!html.includes(`${SITE}/`)) bad.push(`${f}: no ${SITE} address`);
  }
  check(pages.length >= 10 && !bad.length, `built pages use JaxFast and ${SITE} only (${pages.length} pages)${bad.length ? `: ${bad.join("; ")}` : ""}`);
}

await browser.close();
server.close();
if (problems.length) {
  console.log(`\n${problems.length} problem(s):\n- ${problems.join("\n- ")}`);
  process.exit(1);
}
console.log("\nAll checks passed.");
