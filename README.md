# JaxFast — Intermittent Fasting, Weight Loss & Healthy BMI Blueprint

Free intermittent fasting, BMI, calorie deficit and water intake calculators that run **100% in the browser**, promoting the [JaxFast Android app](https://play.google.com/store/apps/details?id=com.jaxenlabs.jaxfit). Nothing is uploaded: details, the fasting plan and the Habit Garden are saved in the visitor's own browser only. No accounts, analytics, tracking or ads.

Live: **https://jaxfast.pages.dev/** · Preview of `develop`: **https://develop.jaxfast.pages.dev/**

| Page | Opens on |
| --- | --- |
| `/` and `/bmi-calculator/` (canonical) | BMI & calories tab |
| `/calorie-deficit-calculator/` | BMI & calories tab |
| `/16-8-fasting-schedule/` | Fasting tab, 16:8 |
| `/water-intake-calculator/` | Water & Habit Garden tab |
| `/intermittent-fasting-calculator/`, `/18-6-fasting-schedule/`, `/20-4-fasting-schedule/`, `/ideal-weight-calculator/` | Their own tab and plan |

## What it does

- **Fasting:** 14:10, 16:8, 18:6, 20:4, 24h and custom (12–24h) plans; last-meal time; 24-hour clock with fast begins, window opener, eating window and window closer; body-stage timeline with clock times. "Start fast in JaxFast" opens the app on Google Play, where the fast is timed.
- **BMI & calories:** WHO BMI category, healthy weight range, Mifflin-St Jeor BMR and TDEE, a gentle/steady/brisk calorie target (never below 1,200 kcal for women or 1,500 kcal for men), estimated goal date and a 7/30/90-day trend.
- **Safeguards:** no fasting plans or weight-loss targets for under-18s; no deficit when underweight; goals below BMI 18.5 are blocked with a healthy alternative.
- **Water:** 30–35 ml per kg plus an activity extra, in litres, ml and 250 ml glasses, and the Habit Garden, where nothing ever dies.
- **JaxFast app:** a Google Play button in the header, after the results, in the app section, in a bar pinned to the bottom of phones and tablets, and in the footer. App details live in `src/content/apps.ts` and must match the Play listing.
- Warm Ivory light theme with a Luxury Dark toggle (remembered on the device).

## Develop

```bash
npm install
npm run dev        # http://localhost:3000/
npm run check      # typecheck + lint + static build into out/
npm test           # end-to-end test of out/ in headless Chromium
npm run images     # re-render icons and the share image from the logo
```

- **Logo:** replace `public/images/jaxfast-logo.png` (512×512), then run `npm run images`. If the file is missing, a built-in leaf-and-ring icon is shown.
- **Google Play link:** `JAXFAST_PLAY_STORE_URL` in `src/content/apps.ts`; each button adds its own install referrer (`utm_source=web_jaxfast_hub`, `utm_content=<placement>`).
- **Page text and SEO:** `src/content/tools.ts`. **Health maths:** `src/lib/fit/`.
- **Custom domain:** set `origin` and `basePath` in `src/content/site.ts`.

Deploys to Cloudflare Pages (project `jaxfast`) from `.github/workflows/deploy.yml`: pushes to `develop` publish the preview, pushes to `main` the live site.

Not medical advice: the site shows general wellness information.
