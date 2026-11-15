import type { ProtocolId } from "@/lib/fit/fasting";

/**
 * The calculator pages. They all show the same calculator hub, opened
 * on a different tab, with their own title, description, headline, guide
 * and FAQ so each can rank for its own searches.
 */

export type TabId = "fasting" | "body" | "water";

export interface Qa {
  q: string;
  a: string;
}

// --- Questions and answers (each page uses six) ------------------------------------
const QA = {
  plans: {
    q: "What is the difference between 16:8 and 18:6 intermittent fasting?",
    a: "Both are daily time-restricted eating plans. On 16:8 you fast for 16 hours and eat within an 8-hour window, for example noon to 8 PM. On 18:6 you fast for 18 hours and eat within 6 hours, for example 2 PM to 8 PM. 16:8 is the most popular starting point because it mostly uses the hours you are asleep. 18:6 adds two more hours in the fat-burning stage, but it is harder to keep up, so most people build up to it gradually from 14:10 or 16:8.",
  },
  stages: {
    q: "What happens to your body during a fast, hour by hour?",
    a: "In the first 0–4 hours your last meal is digested and insulin brings blood sugar back to a steady level. From about 4–12 hours insulin falls and your body uses the sugar stored in your liver (glycogen) while digestion rests. Around 12–16 hours glycogen runs low and your body switches more to burning stored fat. After about 16 hours ketone levels rise (mild ketosis) and research suggests autophagy, the body's recycling of worn-out cell parts, increases. These timings are typical averages: your meals, activity and metabolism shift them.",
  },
  bmi: {
    q: "What are the WHO BMI categories for adults?",
    a: "The World Health Organization classifies adult BMI (weight in kg divided by height in metres squared) as: below 18.5 underweight, 18.5 to 24.9 healthy weight, 25.0 to 29.9 overweight, and 30.0 or above obesity. BMI is a quick screening number, not a diagnosis: it doesn't measure body fat directly, so very muscular people can score high. For under-18s, BMI must be compared with growth charts for age and sex instead of these adult categories.",
  },
  tdee: {
    q: "How is my daily calorie target calculated?",
    a: "First your resting energy use (BMR) is calculated with the Mifflin-St Jeor equation: 10 × weight in kg + 6.25 × height in cm − 5 × age, plus 5 for men or minus 161 for women. That is multiplied by your activity level (1.2 for sedentary up to 1.9 for extra active) to give your TDEE, the calories you use in a day. For weight loss the calculator subtracts 250, 500 or 750 kcal depending on the pace you choose, but never suggests less than 1,200 kcal a day for women or 1,500 kcal for men.",
  },
  water: {
    q: "How much water should I drink a day?",
    a: "A common guideline is 30–35 ml of water for every kilogram you weigh, plus extra when you are active, sweat a lot or the weather is hot. With JaxFit's activity extra, a 70 kg adult who is lightly active needs roughly 2.4 to 2.75 litres a day, about 11 glasses of 250 ml. Food provides some of your water too. Pale yellow urine is a simple sign you are drinking enough. If you have a heart or kidney condition, follow your doctor's fluid advice instead.",
  },
  privacy: {
    q: "Is my health data private on JaxFit?",
    a: "Yes. Every calculation runs in your own browser. Your age, weight, goals, fasting timer and Habit Garden are saved only in your browser's local storage on this device, so they're there when you come back. Nothing is uploaded, there are no accounts, no analytics cookies, no tracking scripts and no ads. Clearing your browser data removes everything.",
  },
  goalDate: {
    q: "How is my goal date estimated?",
    a: "The calculator simulates your progress day by day. Each day it works out your energy use at your projected weight, applies your chosen deficit (never going below the safe minimum intake) and counts about 7,700 kcal for each kilogram of body fat. As you get lighter you use a little less energy, so progress slows gently near the goal. Real weight also moves with water, salt and hormones, so treat the date as a friendly milestone, not a deadline.",
  },
  safeDeficit: {
    q: "What is a safe calorie deficit for weight loss?",
    a: "For most adults a deficit of 250–500 kcal a day, losing roughly 0.25–0.5 kg (0.5–1 lb) a week, is sustainable and protects muscle. Larger deficits can be used for a short time by people with more weight to lose, but very low intakes leave little room for protein, vitamins and minerals. That's why JaxFit never suggests going below 1,200 kcal a day for women or 1,500 kcal for men, and doesn't offer weight-loss targets to under-18s or anyone underweight.",
  },
  sixteenEight: {
    q: "How do I start a 16:8 fasting schedule?",
    a: "Pick the time your last meal usually ends, for example 8 PM. Your fast then runs until 12 noon the next day, and you eat between noon and 8 PM. Sleep covers about half the fast. Water, black coffee and plain tea are fine while fasting. If 16 hours feels hard, start with 14:10 for a week or two and move the first meal later by 30 minutes at a time.",
  },
  breakFast: {
    q: "What should I eat to break a fast?",
    a: "Open your eating window with a balanced, gentle meal: some protein (eggs, yoghurt, lentils, fish or chicken), fibre-rich vegetables or fruit, and a source of healthy fat. Avoid breaking a long fast with a very large or very sugary meal. Drinking a glass of water first helps too. Within your window, aim to eat enough overall: fasting is about when you eat, not about eating as little as possible.",
  },
  whoShouldnt: {
    q: "Who should not try intermittent fasting?",
    a: "Intermittent fasting isn't suitable for children and teenagers, during pregnancy or breastfeeding, for people with a history of eating disorders, or for anyone underweight. If you have diabetes, take medicines that lower blood sugar or blood pressure, or have another medical condition, talk to your doctor before you start. Stop and eat if you feel dizzy, faint or unwell.",
  },
  healthyRange: {
    q: "What is a healthy weight for my height?",
    a: "A healthy weight range is the span of weights that give a BMI between 18.5 and 24.9 for your height. For example, at 170 cm (5 ft 7 in) that's about 53.5 to 72 kg (118 to 159 lb). Enter your height in the BMI tab to see your exact range. Anywhere inside it is a healthy target, so choose a goal that feels comfortable and sustainable for you.",
  },
  waterWeight: {
    q: "Does drinking water help with weight loss and fasting?",
    a: "Water has no calories, helps you feel full and can make fasting windows easier by easing hunger pangs, which often feel similar to thirst. Drinking a glass before meals may help some people eat a little less. During a fast, water, black coffee and plain tea won't break it. Adding a pinch of salt is sometimes used on long fasts, but check with your doctor if you watch your salt intake.",
  },
  eighteenSix: {
    q: "How do I start an 18:6 fasting schedule?",
    a: "Choose when your last meal ends, for example 8 PM. Your fast then runs until 2 PM the next day, and you eat between 2 PM and 8 PM. Most people get there from 16:8 by moving their first meal an hour later each week. Drink water, black coffee or plain tea in the morning, and make your two meals filling, with plenty of protein and vegetables.",
  },
  eighteenSixResults: {
    q: "Is 18:6 better than 16:8 for weight loss?",
    a: "18:6 gives you two more hours in the fasting stages each day and a shorter window, which makes it easier for some people to eat a little less. But weight loss mostly comes from your overall calorie balance, and the best plan is the one you can keep up. If 18:6 leaves you very hungry, irritable or eating too much in your window, 16:8 is just as good a choice.",
  },
  twentyFour: {
    q: "What is 20:4 fasting (the Warrior Diet)?",
    a: "On 20:4 you fast for 20 hours and eat within a 4-hour window each day, for example 4 PM to 8 PM. It's sometimes called the Warrior Diet. With only one or two meals, it's important to eat enough protein, vegetables, fruit and healthy fats in that window. It's an advanced plan: build up from 16:8 or 18:6 first, and don't use it if you're pregnant, breastfeeding, underweight, under 18 or have a history of eating disorders.",
  },
  twentyFourMeals: {
    q: "What should I eat on a 20:4 schedule?",
    a: "Plan one substantial meal and one smaller meal or snack in your 4-hour window. Build each around protein (eggs, fish, chicken, lentils, beans or yoghurt), vegetables and whole grains, with some healthy fat. Eating too little on a short window is easy, so check your calorie target in the BMI & Calories tab and don't aim far below it.",
  },
  idealWeight: {
    q: "How is my ideal weight calculated?",
    a: "JaxFit uses the World Health Organization's healthy BMI range: every weight that gives a BMI between 18.5 and 24.9 at your height is a healthy weight. For example, at 165 cm (5 ft 5 in) that's about 50.4 to 67.8 kg (111 to 149 lb). Older formulas such as Devine or Robinson give a single number, but a range is more realistic, because frame, muscle and age all differ.",
  },
  idealWeightGoal: {
    q: "How should I choose a goal weight?",
    a: "Pick a weight inside your healthy range that you can reach and keep without extreme dieting. If you have a lot to lose, a first goal of 5–10% of your current weight already brings real health benefits. Enter it as your goal in the BMI & Calories tab to see a safe daily calorie target and an estimated goal date. JaxFit won't plan towards a goal below a healthy BMI.",
  },
} satisfies Record<string, Qa>;

export interface ToolPage {
  slug: string;
  /** Short name for links and the breadcrumb. */
  nav: string;
  tab: TabId;
  protocol: ProtocolId;
  title: string;
  description: string;
  keywords: string[];
  h1: string;
  /** The part of the headline shown in green. */
  highlight: string;
  intro: string;
  guide: { title: string; paragraphs: string[] };
  faq: Qa[];
  /** The how-to section's title and steps, when the page has its own (otherwise the shared `steps`). */
  howTo?: { title: string; steps: { title: string; text: string }[] };
}

export const TOOLS: ToolPage[] = [
  {
    slug: "intermittent-fasting-calculator",
    nav: "Fasting Calculator",
    tab: "fasting",
    protocol: "16:8",
    title: "Intermittent Fasting Calculator – 16:8 Schedule & Timer",
    description:
      "Free intermittent fasting calculator: plan 14:10, 16:8, 18:6, 20:4 or 24h fasts, see your eating window and body stages, and run a live fasting timer.",
    keywords: ["intermittent fasting calculator", "fasting window calculator", "16 8 fasting schedule", "fasting timer", "intermittent fasting schedule", "autophagy timeline", "18 6 fasting", "20 4 fasting"],
    h1: "Intermittent Fasting Calculator",
    highlight: "& Live Fasting Timer",
    intro:
      "Choose a fasting plan and the time of your last meal to see exactly when your fast begins, when to break it and when your eating window closes, with the body stages you pass through hour by hour. Then start a live timer that keeps running even if you close the tab.",
    guide: {
      title: "How to Choose the Right Fasting Plan",
      paragraphs: [
        "Intermittent fasting means eating within a set window each day and fasting the rest. Because most of the fast happens while you sleep, a plan like 16:8 feels much easier than it sounds: finish dinner at 8 PM and your next meal is lunch at noon.",
        "New to fasting? Start with 14:10 (Gentle Routine) for a week or two, then move to 16:8 (Most Popular). 18:6 and 20:4 keep you in the fat-burning stage for longer and suit people who already fast comfortably. A 24-hour Eat-Stop-Eat fast is usually done only once or twice a week, not every day.",
        "The best plan is the one you can keep up. Eat enough nourishing food within your window, drink water through the fast, and adjust whenever life needs it: a shorter fast is still progress.",
      ],
    },
    faq: [QA.plans, QA.stages, QA.sixteenEight, QA.whoShouldnt, QA.tdee, QA.privacy],
  },
  {
    slug: "bmi-calculator",
    nav: "BMI Calculator",
    tab: "body",
    protocol: "16:8",
    title: "BMI Calculator – WHO Categories & Healthy Weight Range",
    description:
      "Free WHO BMI calculator for adults in kg/cm or lb/ft-in: your BMI category, healthy weight range for your height and daily calories. Private, no sign-up.",
    keywords: ["bmi calculator", "who bmi calculator", "healthy weight range calculator", "bmi chart", "body mass index calculator", "ideal weight for height", "bmi calculator kg cm", "bmi calculator lbs"],
    h1: "WHO BMI Calculator",
    highlight: "& Healthy Weight Range",
    intro:
      "Enter your height and weight in metric or imperial units to see your body mass index, its World Health Organization category and the healthy weight range for your height, plus your daily calorie needs. Your details are saved on this device only.",
    guide: {
      title: "Understanding Your BMI Result",
      paragraphs: [
        "BMI compares your weight with your height: weight in kilograms divided by height in metres squared. The World Health Organization uses it to screen adults: under 18.5 is underweight, 18.5–24.9 is a healthy weight, 25–29.9 is overweight and 30 or more is obesity.",
        "BMI is a starting point, not a verdict. It can't tell muscle from fat, so athletes may read as overweight, and it doesn't show where fat is stored. Waist size, blood pressure, activity and how you feel matter too.",
        "Your healthy weight range is every weight that gives a BMI between 18.5 and 24.9 at your height. Any goal inside it is a healthy one. JaxFit won't plan weight loss below that range, and for under-18s it shows growth guidance instead of adult categories.",
      ],
    },
    faq: [QA.bmi, QA.healthyRange, QA.tdee, QA.safeDeficit, QA.plans, QA.privacy],
  },
  {
    slug: "calorie-deficit-calculator",
    nav: "Calorie Deficit Calculator",
    tab: "body",
    protocol: "16:8",
    title: "Calorie Deficit Calculator – TDEE & Weight Loss Goal Date",
    description:
      "Free calorie deficit and TDEE calculator (Mifflin-St Jeor): a safe daily calorie target, your estimated goal date and a 7, 30 and 90-day weight trend.",
    keywords: ["calorie deficit calculator", "tdee calculator", "weight loss goal date calculator", "maintenance calories calculator", "bmr calculator", "how many calories to lose weight", "weight loss calculator", "mifflin st jeor calculator"],
    h1: "Calorie Deficit Calculator",
    highlight: "& Goal Date Planner",
    intro:
      "Find your maintenance calories (TDEE) with the Mifflin-St Jeor equation, pick a gentle, steady or brisk pace and get a safe daily calorie target with your estimated goal date and a projected weight trend for the next 7, 30 or 90 days.",
    guide: {
      title: "How a Calorie Deficit Works",
      paragraphs: [
        "Your body uses a certain amount of energy each day: your TDEE. Eat less than that and it makes up the difference from stored energy, mostly fat. About 7,700 kcal equals one kilogram of body fat, so a 500 kcal daily deficit works out to roughly 0.45 kg (1 lb) a week.",
        "A moderate deficit is easier to keep up and protects muscle. As you lose weight your TDEE falls a little too, which is why progress naturally slows near your goal; JaxFit's projection accounts for that by recalculating every day.",
        "Safety comes first: targets never go below 1,200 kcal a day for women or 1,500 kcal for men, and weight-loss plans aren't offered to under-18s, to anyone underweight, or towards a goal below a healthy BMI.",
      ],
    },
    faq: [QA.tdee, QA.safeDeficit, QA.goalDate, QA.bmi, QA.plans, QA.privacy],
  },
  {
    slug: "16-8-fasting-schedule",
    nav: "16:8 Fasting Schedule",
    tab: "fasting",
    protocol: "16:8",
    title: "16:8 Fasting Schedule – Eating Window Times & Live Timer",
    description:
      "Plan your 16:8 intermittent fasting schedule: enter your last meal time to get your exact fasting and eating window, body stages hour by hour and a live timer.",
    keywords: ["16 8 intermittent fasting", "16 8 fasting schedule", "16:8 fasting", "16 8 eating window", "16 hour fast", "16 8 fasting timer", "what to eat 16 8", "16 8 fasting for beginners"],
    h1: "16:8 Fasting Schedule",
    highlight: "Planner & Timer",
    intro:
      "Fast for 16 hours and eat within 8: set the time your last meal ends and see when to break your fast, when your eating window closes and the body stages along the way. Start the live 16-hour timer when you're ready.",
    guide: {
      title: "A Simple 16:8 Day",
      paragraphs: [
        "The classic 16:8 day: finish dinner by 8 PM, sleep, have water, black coffee or plain tea in the morning, and eat your first meal at noon. Your eating window then runs from noon to 8 PM, with two or three meals or a meal and a snack.",
        "Prefer an earlier window? Finish eating at 6 PM and break your fast at 10 AM. Any eight-hour window works: pick the one that fits your work, family meals and sleep, and keep it roughly the same each day.",
        "Break your fast with protein, vegetables and some healthy fat rather than a large, sugary meal, and eat enough across your window. If 16 hours is too long at first, begin with 14:10 and add an hour every week or so.",
      ],
    },
    faq: [QA.sixteenEight, QA.plans, QA.breakFast, QA.stages, QA.whoShouldnt, QA.privacy],
  },
  {
    slug: "water-intake-calculator",
    nav: "Water Intake Calculator",
    tab: "water",
    protocol: "16:8",
    title: "Water Intake Calculator – How Much Water to Drink a Day",
    description:
      "Free daily water intake calculator: your hydration target from your weight and activity in litres, ml and 250 ml glasses, plus a Habit Garden for every glass.",
    keywords: ["daily water intake calculator", "hydration calculator", "how much water should i drink", "water intake by weight", "water calculator", "daily water intake", "how many glasses of water a day"],
    h1: "Daily Water Intake Calculator",
    highlight: "& Habit Garden",
    intro:
      "Work out how much water to drink each day from your weight and how active you are, in litres, millilitres and 250 ml glasses. Then log your glasses and watch your Habit Garden grow: nothing in it ever dies.",
    guide: {
      title: "How Much Water Do You Really Need?",
      paragraphs: [
        "A practical guide is 30–35 ml of water per kilogram of body weight each day, plus more when you exercise or sweat. JaxFit adds 300 ml to 1 litre depending on your activity level and shows the result in litres, millilitres and 250 ml glasses.",
        "Spread your water through the day rather than drinking it all at once: a glass when you wake, one with each meal and one around exercise covers much of it. During a fast, water also helps with hunger, which can feel a lot like thirst.",
        "Needs go up in hot weather, at altitude, when you're ill with fever, or while breastfeeding. Some heart and kidney conditions need less fluid, so follow your doctor's advice if that applies to you.",
      ],
    },
    faq: [QA.water, QA.waterWeight, QA.plans, QA.bmi, QA.tdee, QA.privacy],
  },
  // Extra landing pages: the same calculator preset for one popular search.
  // They're linked from the main page's "Popular plans" list and the sitemap,
  // not from the header or footer (NAV_TOOLS).
  {
    slug: "18-6-fasting-schedule",
    nav: "18:6 Fasting Schedule",
    tab: "fasting",
    protocol: "18:6",
    title: "18:6 Fasting Schedule – Eating Window Times & Live Timer",
    description:
      "Plan 18:6 intermittent fasting: enter your last meal time to get your exact 18-hour fast and 6-hour eating window, body stages hour by hour and a live timer.",
    keywords: ["18 6 intermittent fasting", "18 6 fasting schedule", "18:6 fasting", "18 6 eating window", "18 hour fast", "18 6 fasting timer", "18 6 fasting results", "18 6 vs 16 8"],
    h1: "18:6 Fasting Schedule",
    highlight: "Planner & Timer",
    intro:
      "Fast for 18 hours and eat within 6. The 18:6 plan is already selected: set when your last meal ends to see when to break your fast and when your window closes, with the body stages along the way, then start the live 18-hour timer.",
    guide: {
      title: "A Simple 18:6 Day",
      paragraphs: [
        "A typical 18:6 day: finish dinner by 8 PM, sleep, drink water, black coffee or plain tea through the morning, and eat your first meal at 2 PM. Your eating window runs from 2 PM to 8 PM, which usually fits two meals.",
        "18:6 keeps you past the 16-hour mark, when ketone levels start to rise, for two extra hours each day. It's a natural next step once 16:8 feels easy; jumping straight in often means a hungry, tired first week.",
        "Because the window is short, make both meals count: protein, vegetables, whole grains and some healthy fat. Check your daily calorie target in the BMI & Calories tab so you eat enough, not as little as possible.",
      ],
    },
    howTo: {
      title: "How to Plan Your 18:6 Fast",
      steps: [
        { title: "Keep 18:6 selected", text: "The 18:6 plan (Deep Metabolic) is chosen for you. You can switch to 16:8 or 20:4 at any time." },
        { title: "Set your last meal", text: "Enter the time your last meal ends, for example 8 PM, to see your fast and your 6-hour eating window." },
        { title: "Check the body stages", text: "See when you reach each stage, including the 16-hour mark when mild ketosis begins." },
        { title: "Start the live timer", text: "Tap Start to time your 18-hour fast. It keeps running even if you close the tab." },
      ],
    },
    faq: [QA.eighteenSix, QA.eighteenSixResults, QA.stages, QA.breakFast, QA.whoShouldnt, QA.privacy],
  },
  {
    slug: "20-4-fasting-schedule",
    nav: "20:4 Fasting Schedule",
    tab: "fasting",
    protocol: "20:4",
    title: "20:4 Fasting Schedule – Warrior Diet Eating Window & Timer",
    description:
      "Plan 20:4 intermittent fasting (the Warrior Diet): set your last meal to see your 20-hour fast and 4-hour eating window, body stages and a live fasting timer.",
    keywords: ["20 4 intermittent fasting", "20 4 fasting schedule", "20:4 fasting", "warrior diet", "20 hour fast", "20 4 eating window", "20 4 fasting timer", "warrior diet schedule"],
    h1: "20:4 Fasting Schedule",
    highlight: "Warrior Diet Planner",
    intro:
      "Fast for 20 hours and eat within a 4-hour window. The 20:4 plan is already selected: set when your last meal ends to see when your fast breaks and your window closes, then time the fast with the live timer.",
    guide: {
      title: "Is 20:4 Right for You?",
      paragraphs: [
        "20:4 is one of the longest daily fasting plans: for example, eat between 4 PM and 8 PM and fast the other 20 hours. Fans like its simplicity, with one main meal and a smaller one, and the long stretch past the 16-hour mark.",
        "It's an advanced plan. Most people do best building up from 16:8 to 18:6 first, and some use 20:4 only a few days a week. If you feel dizzy, weak or can't sleep, a longer window is the better choice.",
        "Eating enough is the hard part of 20:4. Fit plenty of protein, vegetables, fruit, whole grains and healthy fats into your window, and use the BMI & Calories tab to see the daily calories you need.",
      ],
    },
    howTo: {
      title: "How to Plan Your 20:4 Fast",
      steps: [
        { title: "Keep 20:4 selected", text: "The 20:4 plan (Warrior) is chosen for you. Switch to 18:6 or 16:8 if a 4-hour window is too short." },
        { title: "Set your last meal", text: "Enter the time your last meal ends to see when your 20-hour fast breaks and your 4-hour window closes." },
        { title: "Plan your meals", text: "Fit one main meal and a smaller one into the window, and check your calorie target in the BMI & Calories tab." },
        { title: "Start the live timer", text: "Tap Start to time your fast; complete it to grow your Habit Garden." },
      ],
    },
    faq: [QA.twentyFour, QA.twentyFourMeals, QA.plans, QA.stages, QA.whoShouldnt, QA.privacy],
  },
  {
    slug: "ideal-weight-calculator",
    nav: "Ideal Weight Calculator",
    tab: "body",
    protocol: "16:8",
    title: "Ideal Weight Calculator – Healthy Weight for Your Height",
    description:
      "Free ideal weight calculator: enter your height to see the healthy weight range for it (WHO BMI 18.5–24.9) in kg or lb, plus your BMI and daily calories.",
    keywords: ["ideal weight calculator", "healthy weight for my height", "ideal body weight calculator", "how much should i weigh", "healthy weight range calculator", "ideal weight for height", "weight for height chart"],
    h1: "Ideal Weight Calculator",
    highlight: "for Your Height",
    intro:
      "How much should you weigh? Enter your height and weight, in metric or imperial, to see the healthy weight range for your height based on the WHO BMI categories, along with your current BMI and the calories you need each day.",
    guide: {
      title: "Why Your Ideal Weight Is a Range",
      paragraphs: [
        "There's no single perfect weight for a height. People with the same height differ in frame, muscle and where they carry weight, so JaxFit shows the full healthy range: every weight that gives a BMI between 18.5 and 24.9.",
        "Anywhere inside that range is a healthy target. Many people aim for the middle; very active, muscular people may sit comfortably near the top, or even a little above it, while still being healthy.",
        "Use the range as a guide, not a rule. Waist size, fitness, blood pressure and how you feel all matter. For under-18s, adult ranges don't apply, so JaxFit shows growth guidance instead.",
      ],
    },
    howTo: {
      title: "How to Find Your Ideal Weight",
      steps: [
        { title: "Choose your units", text: "Use kg and cm, or lb and feet and inches. Your details are saved on this device only." },
        { title: "Enter your height and weight", text: "Add your age and sex too, so your daily calorie needs can be worked out." },
        { title: "Read your healthy range", text: "See the healthy weight range for your height, your BMI and its WHO category." },
        { title: "Set a goal if you like", text: "Enter a goal weight inside the range to get a safe calorie target and an estimated goal date." },
      ],
    },
    faq: [QA.idealWeight, QA.healthyRange, QA.idealWeightGoal, QA.bmi, QA.safeDeficit, QA.privacy],
  },
];

/** The main page shows the intermittent fasting calculator (its canonical page). */
export const DEFAULT_TOOL = TOOLS[0];
export const toolBySlug = (slug: string) => TOOLS.find((t) => t.slug === slug);

/**
 * The calculators linked in the header, "More calculators" and the footer, in this
 * order. The intermittent fasting calculator is left out of all three for now;
 * it is still the main page (the logo opens it).
 */
export const NAV_TOOLS = ["bmi-calculator", "16-8-fasting-schedule", "water-intake-calculator", "calorie-deficit-calculator"].map((slug) => toolBySlug(slug)!);

/** The extra landing pages, listed only on the main page ("Popular plans"), on each other and in the sitemap. */
export const POPULAR_TOOLS = ["18-6-fasting-schedule", "20-4-fasting-schedule", "ideal-weight-calculator"].map((slug) => toolBySlug(slug)!);

/**
 * The page each calculator tab opens, so the headline, guide and FAQ always
 * match the open tab. (A page already on that tab, like the calorie deficit
 * page for "BMI & Calories", stays where it is.)
 */
export const TAB_PAGES: Record<TabId, string> = {
  body: "bmi-calculator",
  fasting: "16-8-fasting-schedule",
  water: "water-intake-calculator",
};

/** A page's how-to title and steps: its own, or the shared ones. */
export const howTo = (t: ToolPage) => t.howTo ?? { title: "How to Use the JaxFit Calculator", steps };

export const steps = [
  { title: "Enter your details", text: "Height, weight, age and activity, in metric or imperial. They're saved on this device for next time." },
  { title: "Plan your fasting window", text: "Pick 14:10, 16:8, 18:6, 20:4, 24h or your own plan and the time your last meal ends." },
  { title: "Check your numbers", text: "See your WHO BMI, healthy weight range, safe calorie target, goal date and daily water." },
  { title: "Grow your Habit Garden", text: "Start the live fasting timer, log water and healthy meals, and watch your plant flourish." },
];

export const privacyPoints = [
  "Every calculation runs in your browser. Nothing you enter is uploaded or sent anywhere.",
  "No accounts, no analytics cookies, no tracking scripts and no ads.",
  "Your details, timer and garden are saved only on this device. Clearing your browser data removes them.",
];

export const disclaimer =
  "JaxFit gives general wellness information, not medical advice. Talk to a doctor before fasting or changing your diet if you are pregnant or breastfeeding, have diabetes or another medical condition, take regular medication, or have a history of eating disorders.";
