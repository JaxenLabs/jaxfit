/**
 * Intermittent fasting plans, the daily schedule they give, and the body
 * stages during a fast. Times are minutes after midnight (0 – 1439).
 */

export const PROTOCOLS = [
  { id: "14:10", hours: 14, name: "Gentle Routine" },
  { id: "16:8", hours: 16, name: "Most Popular" },
  { id: "18:6", hours: 18, name: "Deep Metabolic" },
  { id: "20:4", hours: 20, name: "Warrior" },
  { id: "24h", hours: 24, name: "Eat-Stop-Eat" },
  { id: "custom", hours: null, name: "Your own" },
] as const;
export type ProtocolId = (typeof PROTOCOLS)[number]["id"];
export const isProtocol = (v: unknown): v is ProtocolId => PROTOCOLS.some((p) => p.id === v);
export const CUSTOM_RANGE = [12, 24] as const;

/** What happens in the body during a fast. Timings are typical; they vary from person to person. */
export const STAGES = [
  { from: 0, to: 4, title: "Blood Sugar & Insulin Stabilization", text: "Your last meal is being digested. Blood sugar rises, then insulin brings it back to a steady level." },
  { from: 4, to: 12, title: "Glycogen Depletion & Digestive Rest", text: "Insulin falls and your body draws on the sugar stored in your liver (glycogen) while digestion rests." },
  { from: 12, to: 16, title: "Fat Burning & Metabolic Switch", text: "With glycogen running low, your body turns increasingly to stored fat for fuel." },
  { from: 16, to: null, title: "Mild Ketosis & Cellular Renewal (Autophagy)", text: "Ketone levels rise. Research suggests autophagy, the body’s recycling of worn-out cell parts, steps up with longer fasts." },
] as const;

export interface FastingSettings {
  protocol: ProtocolId | null;
  customHours: number;
  /** When the last meal of the day ends, in minutes after midnight. */
  lastMeal: number;
}
export const DEFAULT_FASTING: FastingSettings = { protocol: null, customHours: 15, lastMeal: 20 * 60 };

export function readFasting(raw: unknown): FastingSettings {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const ok = (v: unknown, min: number, max: number): v is number => typeof v === "number" && Number.isInteger(v) && v >= min && v <= max;
  return {
    protocol: isProtocol(r.protocol) ? r.protocol : null,
    customHours: ok(r.customHours, ...CUSTOM_RANGE) ? r.customHours : DEFAULT_FASTING.customHours,
    lastMeal: ok(r.lastMeal, 0, 1439) ? r.lastMeal : DEFAULT_FASTING.lastMeal,
  };
}

/** Fasting hours for a plan. */
export const fastHours = (id: ProtocolId, customHours: number) => PROTOCOLS.find((p) => p.id === id)?.hours ?? customHours;

/** A clock time `minutes` after the start of the first day; `day` is 0 for that day, 1 for the next. */
export interface ClockTime {
  minutes: number;
  day: number;
}
const at = (m: number): ClockTime => ({ minutes: ((m % 1440) + 1440) % 1440, day: Math.floor(m / 1440) });

/**
 * The daily rhythm for a plan: the fast begins after the last meal, the
 * window opens `hours` later (the meal that breaks the fast) and closes
 * when the next fast begins, 24 hours after the last one.
 */
export function schedule(lastMeal: number, hours: number) {
  return {
    fastBegins: at(lastMeal),
    windowOpens: at(lastMeal + hours * 60),
    windowCloses: at(lastMeal + 24 * 60),
    windowHours: 24 - hours,
    stages: STAGES.map((s) => ({ ...s, time: at(lastMeal + s.from * 60), reached: s.from <= hours })),
  };
}

/** "8:00 PM" (12-hour clock, the same on the server and every browser). */
export function formatTime(minutes: number) {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}
/** "20:00" for <input type="time">. */
export const toInputTime = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
export function fromInputTime(value: string): number | null {
  const m = /^(\d{2}):(\d{2})/.exec(value);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  return h < 24 && min < 60 ? h * 60 + min : null;
}
