import type { ProtocolId } from "@/lib/fit/fasting";

/**
 * The five calculator pages. They all show the same calculator hub, opened
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
}

export const TOOLS: ToolPage[] = [
  {
    slug: "intermittent-fasting-calculator",
    nav: "Fasting Calculator",
    tab: "fasting",
    protocol: "16:8",
    title: "Intermittent Fasting Calculator – 16:8 Schedule & Fasting Window",
    description:
      "Free intermittent fasting calculator: plan 14:10, 16:8, 18:6, 20:4 or 24h fasts, see your eating window, body stages hour by hour and run a live fasting timer. Private, no sign-up.",
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
      "Free WHO BMI calculator for adults in kg/cm or lb/ft-in. See your BMI category, healthy weight range for your height and daily calories, with built-in safety checks. Private, no sign-up.",
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
      "Free calorie deficit and TDEE calculator (Mifflin-St Jeor): get a safe daily calorie target, your estimated goal date and a 7, 30 and 90-day weight trend. Private, no sign-up.",
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
      "Plan your 16:8 intermittent fasting schedule: enter your last meal time to get your exact fasting and eating window, what happens in your body hour by hour, and a live 16-hour timer.",
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
    title: "Water Intake Calculator – How Much Water Should I Drink a Day?",
    description:
      "Free daily water intake calculator: your hydration target from your weight and activity in litres, millilitres and 250 ml glasses, plus a Habit Garden that grows with every glass.",
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
