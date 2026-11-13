/**
 * The visitor's details, shared by all three tabs and saved on their device
 * only. Everything is stored in metric (kg, cm); the unit system only
 * changes how numbers are shown and typed.
 */

export type Units = "metric" | "imperial";
export type Sex = "female" | "male";

export const ACTIVITY = [
  { id: "sedentary", label: "Sedentary", hint: "Desk job, little exercise", factor: 1.2, waterMl: 0 },
  { id: "light", label: "Lightly active", hint: "Exercise 1–3 days a week", factor: 1.375, waterMl: 300 },
  { id: "moderate", label: "Moderately active", hint: "Exercise 3–5 days a week", factor: 1.55, waterMl: 500 },
  { id: "active", label: "Very active", hint: "Exercise 6–7 days a week", factor: 1.725, waterMl: 750 },
  { id: "athlete", label: "Extra active", hint: "Hard training or a physical job", factor: 1.9, waterMl: 1000 },
] as const;
export type ActivityId = (typeof ACTIVITY)[number]["id"];
export const activityOf = (id: ActivityId) => ACTIVITY.find((a) => a.id === id) ?? ACTIVITY[0];

/** How fast to move towards the goal: the daily calorie difference. */
export const PACES = [
  { id: "gentle", label: "Gentle", kcal: 250 },
  { id: "steady", label: "Steady", kcal: 500 },
  { id: "brisk", label: "Brisk", kcal: 750 },
] as const;
export type PaceId = (typeof PACES)[number]["id"];
export const paceOf = (id: PaceId) => PACES.find((p) => p.id === id) ?? PACES[1];

export interface Profile {
  units: Units;
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  goalKg: number;
  activity: ActivityId;
  pace: PaceId;
}

/** Accepted ranges (inputs outside them are ignored until corrected). */
export const LIMITS = {
  age: [10, 100],
  heightCm: [100, 250],
  weightKg: [25, 350],
} as const;

export const DEFAULT_PROFILE: Profile = {
  units: "metric",
  age: 30,
  sex: "female",
  heightCm: 165,
  weightKg: 72,
  goalKg: 64,
  activity: "light",
  pace: "steady",
};

// --- Unit conversion -----------------------------------------------------------
export const KG_PER_LB = 0.45359237;
export const CM_PER_IN = 2.54;
export const kgToLb = (kg: number) => kg / KG_PER_LB;
export const lbToKg = (lb: number) => lb * KG_PER_LB;
/** Height as whole feet and inches (inches to one decimal; 12 rolls over to the next foot). */
export function cmToFtIn(cm: number) {
  let ft = Math.floor(cm / CM_PER_IN / 12);
  let inch = Math.round((cm / CM_PER_IN - ft * 12) * 10) / 10;
  if (inch >= 12) {
    ft += 1;
    inch = 0;
  }
  return { ft, inch };
}
export const ftInToCm = (ft: number, inch: number) => (ft * 12 + inch) * CM_PER_IN;

/** A weight for display, e.g. "72 kg" or "158.7 lb". */
export function formatWeight(kg: number, units: Units) {
  const v = units === "metric" ? kg : kgToLb(kg);
  return `${round1(v)} ${units === "metric" ? "kg" : "lb"}`;
}
export const round1 = (n: number) => Math.round(n * 10) / 10;

// --- Reading saved data safely -----------------------------------------------------
const inRange = (v: unknown, [min, max]: readonly [number, number]): v is number => typeof v === "number" && Number.isFinite(v) && v >= min && v <= max;

/** Keeps each saved field only if it is valid, else the default. */
export function readProfile(raw: unknown): Profile {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const d = DEFAULT_PROFILE;
  return {
    units: r.units === "imperial" ? "imperial" : "metric",
    age: inRange(r.age, LIMITS.age) ? Math.round(r.age) : d.age,
    sex: r.sex === "male" ? "male" : "female",
    heightCm: inRange(r.heightCm, LIMITS.heightCm) ? r.heightCm : d.heightCm,
    weightKg: inRange(r.weightKg, LIMITS.weightKg) ? r.weightKg : d.weightKg,
    goalKg: inRange(r.goalKg, LIMITS.weightKg) ? r.goalKg : d.goalKg,
    activity: ACTIVITY.some((a) => a.id === r.activity) ? (r.activity as ActivityId) : d.activity,
    pace: PACES.some((p) => p.id === r.pace) ? (r.pace as PaceId) : d.pace,
  };
}
