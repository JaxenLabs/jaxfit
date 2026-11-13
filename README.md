# JaxFit — Intermittent Fasting, Weight Loss & Healthy BMI Blueprint

Free intermittent fasting, BMI, calorie deficit and water intake calculators that run **100% in the browser**. Nothing is uploaded: details, the fasting timer and the Habit Garden are saved in the visitor's own browser only. No accounts, analytics, tracking or ads.

Live: **https://jaxenlabs.github.io/jaxfit/**

| Page | Opens on |
| --- | --- |
| `/intermittent-fasting-calculator/` (canonical main page) | Fasting tab, 16:8 |
| `/bmi-calculator/` | BMI & calories tab |
| `/calorie-deficit-calculator/` | BMI & calories tab |
| `/16-8-fasting-schedule/` | Fasting tab, 16:8 |
| `/water-intake-calculator/` | Water & Habit Garden tab |

## What it does

- **Fasting:** 14:10, 16:8, 18:6, 20:4, 24h and custom (12–24h) plans; last-meal time; 24-hour clock with fast begins, window opener, eating window and window closer; body-stage timeline with clock times; a live timer saved by its start time, so it stays exact after the tab is closed.
- **BMI & calories:** WHO BMI category, healthy weight range, Mifflin-St Jeor BMR and TDEE, a gentle/steady/brisk calorie target (never below 1,200 kcal for women or 1,500 kcal for men), estimated goal date and a 7/30/90-day trend.
- **Safeguards:** no fasting plans or weight-loss targets for under-18s; no deficit when underweight; goals below BMI 18.5 are blocked with a healthy alternative.
- **Water:** 30–35 ml per kg plus an activity extra, in litres, ml and 250 ml glasses, and the Habit Garden, where nothing ever dies.
- Warm Ivory light theme with a Luxury Dark toggle (remembered on the device).

## Develop

```bash
npm install
npm run dev        # http://localhost:3000/jaxfit/
npm run check      # typecheck + lint + static build into out/
npm test           # end-to-end test of out/ in headless Chromium
npm run images     # re-render icons and the share image from the logo
```

- **Logo:** replace `public/images/jaxfit-logo.png` (512×512), then run `npm run images`. If the file is missing, a built-in leaf-and-ring icon is shown.
- **JaxFit on Google Play:** set `JAXFIT_PLAY_STORE_URL` in `src/content/apps.ts`. Every "Coming Soon" badge then becomes a live Google Play button.
- **Page text and SEO:** `src/content/tools.ts`. **Health maths:** `src/lib/fit/`.
- **Custom domain:** set `origin` and `basePath` in `src/content/site.ts` and add `public/CNAME`.

Deploys to GitHub Pages on every push to `main` (`.github/workflows/deploy.yml`).

Not medical advice: the site shows general wellness information.
