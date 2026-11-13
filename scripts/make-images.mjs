/**
 * Renders the site's icons and share image from the JaxFit logo
 * (public/images/jaxfit-logo.png, 512x512, also used by the web app manifest)
 * with a headless browser:
 *   src/app/apple-icon.png       180x180  (iPhone home screen)
 *   src/app/icon1.png            192x192  (Google search results favicon: a multiple of 48px)
 *   public/favicon.ico           48x48    (browsers that ask for /favicon.ico; PNG inside an .ico)
 *   src/app/opengraph-image.png  1200x630 (preview card when the link is shared)
 * Run after changing the icon or the site title: `npm run images`.
 * Uses Playwright's Chromium; set CHROME_PATH to use another Chrome.
 */
import { readFile, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

/** Share-image wording for this tool. */
const SHARE = {
  title: "Intermittent Fasting Calculator",
  subtitle: "16:8 schedule · BMI · Calorie deficit · Water",
  chips: ["100% private", "Live fasting timer", "Goal date", "Habit Garden"],
  alt: "JaxFit: free intermittent fasting, BMI, calorie deficit and water intake calculators with a live fasting timer, 100% private",
};

const root = new URL("../", import.meta.url);
const png = await readFile(new URL("public/images/jaxfit-logo.png", root));
const iconUrl = `data:image/png;base64,${png.toString("base64")}`;

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const page = await browser.newPage();

async function shot(html, width, height) {
  await page.setViewportSize({ width, height });
  await page.setContent(`<html><body style="margin:0">${html}</body></html>`);
  await page.waitForLoadState("networkidle");
  return page.screenshot({ omitBackground: true });
}

const icon = (size) => shot(`<img src="${iconUrl}" width="${size}" height="${size}" style="display:block">`, size, size);

/** Wraps a PNG in the .ico container (one image), which every browser and Google accept. */
function pngToIco(png, size) {
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // one image
  header.writeUInt8(size, 6);
  header.writeUInt8(size, 7);
  header.writeUInt16LE(1, 10); // colour planes
  header.writeUInt16LE(32, 12); // bits per pixel
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18); // image data starts after this header
  return Buffer.concat([header, png]);
}

await writeFile(new URL("src/app/apple-icon.png", root), await icon(180));
await writeFile(new URL("src/app/icon1.png", root), await icon(192));
await writeFile(new URL("public/favicon.ico", root), pngToIco(await icon(48), 48));

const og = `
<div style="width:1200px;height:630px;box-sizing:border-box;padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between;
  font-family:'Segoe UI',Manrope,Arial,sans-serif;color:#1c1917;
  background:radial-gradient(700px 420px at 100% 0%,rgba(16,185,129,.22),transparent 70%),radial-gradient(600px 400px at 0% 100%,rgba(217,119,6,.16),transparent 70%),#faf8f5">
  <div style="display:flex;align-items:center;gap:22px">
    <img src="${iconUrl}" width="96" height="96" style="border-radius:24px">
    <div style="font-size:48px;font-weight:800">Jax<span style="color:#15803d">Fit</span></div>
  </div>
  <div>
    <div style="font-size:74px;font-weight:800;line-height:1.05;letter-spacing:-1.5px">${SHARE.title}</div>
    <div style="font-size:38px;font-weight:700;margin-top:16px;color:#15803d">${SHARE.subtitle}</div>
  </div>
  <div style="display:flex;gap:14px;font-size:26px;font-weight:700">
    ${SHARE.chips
      .map((t) => `<span style="padding:12px 22px;border-radius:999px;border:2px solid rgba(21,128,61,.35);color:#15803d;background:#ffffff">${t}</span>`)
      .join("")}
  </div>
</div>`;
await writeFile(new URL("src/app/opengraph-image.png", root), await shot(og, 1200, 630));
await writeFile(new URL("src/app/opengraph-image.alt.txt", root), SHARE.alt);

await browser.close();
console.log("Images written.");
