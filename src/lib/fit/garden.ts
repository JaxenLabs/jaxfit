/**
 * The Habit Garden: every healthy action adds growth, and nothing is ever
 * taken away. Missing a day simply pauses growth.
 */

export const GARDEN_ACTIONS = [
  { id: "water", label: "Log a Glass of Water (+250ml)", done: "Glass logged" },
  { id: "fast", label: "Complete Mini Fast", done: "Mini fast complete" },
  { id: "meal", label: "I Cooked a Healthy Meal", done: "Healthy meal logged" },
] as const;
export type GardenAction = (typeof GARDEN_ACTIONS)[number]["id"];

export interface Garden {
  water: number;
  fast: number;
  meal: number;
  /** Glasses of water logged on `day` (a local date, "2026-11-14"). */
  todayWater: number;
  day: string;
}
export const EMPTY_GARDEN: Garden = { water: 0, fast: 0, meal: 0, todayWater: 0, day: "" };

/** Growth levels and the number of actions each needs. The plant never goes back down. */
export const LEVELS = [
  { at: 0, name: "Thirsty seed" },
  { at: 1, name: "First sprout" },
  { at: 3, name: "Seedling" },
  { at: 6, name: "Growing strong" },
  { at: 10, name: "Leafy & green" },
  { at: 15, name: "Budding" },
  { at: 21, name: "Lush & blooming" },
] as const;

export const growth = (g: Garden) => g.water + g.fast + g.meal;
export const levelOf = (points: number) => LEVELS.findLastIndex((l) => points >= l.at);

/** A local calendar date key, e.g. "2026-11-14". */
export const dayKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** Today's glasses (0 if the saved count is from an earlier day). */
export const glassesToday = (g: Garden, today: string) => (g.day === today ? g.todayWater : 0);

export function addAction(g: Garden, action: GardenAction, today: string): Garden {
  const next = { ...g, [action]: g[action] + 1 };
  if (action === "water") return { ...next, todayWater: glassesToday(g, today) + 1, day: today };
  return next;
}

export function readGarden(raw: unknown): Garden {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const count = (v: unknown) => (typeof v === "number" && Number.isInteger(v) && v >= 0 && v < 1e6 ? v : 0);
  return {
    water: count(r.water),
    fast: count(r.fast),
    meal: count(r.meal),
    todayWater: count(r.todayWater),
    day: typeof r.day === "string" && /^\d{4}-\d{2}-\d{2}$/.test(r.day) ? r.day : "",
  };
}
