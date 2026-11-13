import { activityOf, paceOf, type Profile, type Sex } from "./profile";

/** Body mass index: weight (kg) / height (m)². */
export const bmi = (kg: number, cm: number) => kg / (cm / 100) ** 2;

/** The WHO adult BMI categories. */
export const BMI_CATEGORIES = [
  { id: "under", label: "Underweight", range: "below 18.5", min: 0, tone: "amber" },
  { id: "healthy", label: "Healthy weight", range: "18.5 – 24.9", min: 18.5, tone: "green" },
  { id: "over", label: "Overweight", range: "25.0 – 29.9", min: 25, tone: "amber" },
  { id: "obese", label: "Obesity", range: "30.0 and above", min: 30, tone: "red" },
] as const;
export type BmiCategory = (typeof BMI_CATEGORIES)[number];

export function bmiCategory(value: number): BmiCategory {
  // BMI is shown to one decimal, so 24.96 counts as 25.0 (Overweight), matching what is shown.
  const v = Math.round(value * 10) / 10;
  return [...BMI_CATEGORIES].reverse().find((c) => v >= c.min) ?? BMI_CATEGORIES[0];
}

export const HEALTHY_BMI = { min: 18.5, max: 24.9 } as const;
/** Weights (kg) between BMI 18.5 and 24.9 for this height. */
export const healthyRange = (cm: number) => ({ min: HEALTHY_BMI.min * (cm / 100) ** 2, max: HEALTHY_BMI.max * (cm / 100) ** 2 });

/** Resting energy use (kcal/day), Mifflin-St Jeor: 10·kg + 6.25·cm − 5·age + 5 (men) or − 161 (women). */
export const bmr = (kg: number, cm: number, age: number, sex: Sex) => 10 * kg + 6.25 * cm - 5 * age + (sex === "male" ? 5 : -161);

/** Total daily energy use (kcal/day): BMR × activity factor (1.2 – 1.9). */
export const tdee = (p: Pick<Profile, "heightCm" | "age" | "sex" | "activity">, kg: number) => bmr(kg, p.heightCm, p.age, p.sex) * activityOf(p.activity).factor;

/** The lowest daily intake this tool will ever suggest without medical supervision. */
export const MIN_KCAL: Record<Sex, number> = { female: 1200, male: 1500 };

/** About 7,700 kcal of energy is stored in 1 kg of body fat. */
export const KCAL_PER_KG = 7700;
/** Projections stop after this many days. */
const MAX_DAYS = 3 * 365;

export type Plan =
  | { kind: "minor" }
  | { kind: "underweight" }
  /** The goal is below a healthy weight for this height: suggest the lowest healthy weight instead. */
  | { kind: "lowGoal"; minHealthyKg: number }
  | { kind: "maintain"; tdee: number }
  /** Maintenance calories are already at (or near) the safe minimum, so a deficit isn't suggested. */
  | { kind: "atFloor"; tdee: number; floor: number }
  | {
      kind: "lose" | "gain";
      tdee: number;
      /** Suggested daily intake today. */
      target: number;
      /** True when the safe minimum made the target higher than the chosen pace. */
      floored: boolean;
      kgPerWeek: number;
      /** Days to reach the goal, or null if it would take more than three years. */
      days: number | null;
      /** Projected weight for each day from today (index 0) until the goal or three years. */
      series: number[];
    };

/**
 * The calorie plan for the visitor's goal, with every safeguard applied:
 * no deficits for under-18s, for anyone underweight, or towards a goal below
 * a healthy BMI, and never below the safe minimum intake.
 *
 * The projection is simulated day by day: as weight falls, so does energy
 * use, so each day's target is recalculated (never below the minimum). That
 * makes the curve flatten gently near the goal instead of being a straight line.
 */
export function plan(p: Profile): Plan {
  if (p.age < 18) return { kind: "minor" };
  if (bmi(p.weightKg, p.heightCm) < HEALTHY_BMI.min) return { kind: "underweight" };
  const range = healthyRange(p.heightCm);
  if (p.goalKg < range.min - 0.05) return { kind: "lowGoal", minHealthyKg: range.min };

  const today = tdee(p, p.weightKg);
  const diff = p.goalKg - p.weightKg;
  if (Math.abs(diff) < 0.5) return { kind: "maintain", tdee: today };

  const pace = paceOf(p.pace).kcal;
  const floor = MIN_KCAL[p.sex];
  const losing = diff < 0;
  const targetFor = (kg: number) => (losing ? Math.max(floor, tdee(p, kg) - pace) : tdee(p, kg) + pace);

  const target = targetFor(p.weightKg);
  // Less than 100 kcal/day of deficit would barely move the scale: say so honestly instead.
  if (losing && today - target < 100) return { kind: "atFloor", tdee: today, floor };

  const series = [p.weightKg];
  let kg = p.weightKg;
  let days: number | null = null;
  for (let d = 1; d <= MAX_DAYS; d++) {
    const change = (targetFor(kg) - tdee(p, kg)) / KCAL_PER_KG;
    // Stop if the deficit has run out (the minimum intake caught up with energy use).
    if (losing && change > -0.0015) break;
    kg += change;
    if (losing ? kg <= p.goalKg : kg >= p.goalKg) {
      series.push(p.goalKg);
      days = d;
      break;
    }
    series.push(kg);
  }
  return {
    kind: losing ? "lose" : "gain",
    tdee: today,
    target,
    floored: losing && target === floor && today - pace < floor,
    kgPerWeek: (Math.abs(today - target) * 7) / KCAL_PER_KG,
    days,
    series,
  };
}

/** Recommended daily water: 30–35 ml per kg, plus extra for activity. */
export function hydration(p: Pick<Profile, "weightKg" | "activity">) {
  const extra = activityOf(p.activity).waterMl;
  const low = p.weightKg * 30 + extra;
  const high = p.weightKg * 35 + extra;
  // The midpoint, rounded to 50 ml so it reads naturally.
  const ml = Math.round(((low + high) / 2) / 50) * 50;
  return { ml, low: Math.round(low / 50) * 50, high: Math.round(high / 50) * 50, extra, glasses: Math.ceil(ml / 250), flOz: ml / 29.5735 };
}
