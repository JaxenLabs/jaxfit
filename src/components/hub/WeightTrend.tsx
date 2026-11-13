"use client";

import { useState } from "react";
import { kgToLb, round1, type Units } from "@/lib/fit/profile";
import { Segment } from "./ProfileForm";

const RANGES = [
  { id: "7", label: "7 days" },
  { id: "30", label: "30 days" },
  { id: "90", label: "90 days" },
] as const;
type RangeId = (typeof RANGES)[number]["id"];

const W = 480;
const H = 170;
const PAD = { l: 8, r: 8, t: 10, b: 10 };

/** Projected weight over the next 7, 30 or 90 days, with the goal as a dashed line once it's in view. */
export function WeightTrend({ series, goalKg, units }: { series: number[]; goalKg: number; units: Units }) {
  const [range, setRange] = useState<RangeId>("30");
  const days = Number(range);
  const conv = (kg: number) => (units === "metric" ? kg : kgToLb(kg));
  const unit = units === "metric" ? "kg" : "lb";
  // After the goal is reached the weight simply stays there.
  const values = Array.from({ length: days + 1 }, (_, d) => conv(series[Math.min(d, series.length - 1)]));
  const goal = conv(goalKg);
  const reached = series.length - 1 <= days;

  const lo = Math.min(...values, reached ? goal : Infinity);
  const hi = Math.max(...values, reached ? goal : -Infinity);
  const spread = Math.max(hi - lo, 1);
  const yMin = lo - spread * 0.15;
  const yMax = hi + spread * 0.15;
  const x = (d: number) => PAD.l + (d / days) * (W - PAD.l - PAD.r);
  const y = (v: number) => PAD.t + (1 - (v - yMin) / (yMax - yMin)) * (H - PAD.t - PAD.b);
  const line = values.map((v, d) => `${d ? "L" : "M"}${x(d).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  const area = `${line} L${x(days)} ${H - PAD.b} L${x(0)} ${H - PAD.b} Z`;
  const end = values[days];
  const change = end - values[0];

  return (
    <div className="rounded-3xl bg-field p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-extrabold">
          Projected trend{" "}
          <span className="text-sm font-bold text-muted" data-testid="trend-change">
            {change > 0 ? "+" : ""}
            {round1(change)} {unit} in {days} days
          </span>
        </p>
        <div className="w-full sm:w-auto sm:min-w-64">
          <Segment label="Trend range" value={range} options={RANGES} onChange={setRange} />
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Projected weight: ${round1(values[0])} ${unit} today, ${round1(end)} ${unit} in ${days} days`} preserveAspectRatio="none" className="mt-3 h-36 w-full sm:h-44">
        <defs>
          <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--accent-2)" stopOpacity="0.28" />
            <stop offset="1" stopColor="var(--accent-2)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {reached && (
          <g>
            <line x1={PAD.l} x2={W - PAD.r} y1={y(goal)} y2={y(goal)} strokeDasharray="6 5" strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="stroke-amber-2" />
          </g>
        )}
        <path d={area} fill="url(#trend-fill)" />
        <path d={line} fill="none" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" className="stroke-accent" />
      </svg>
      <div className="mt-2 flex flex-wrap justify-between gap-x-4 gap-y-1 text-xs font-bold text-muted">
        <span>Today · {round1(values[0])} {unit}</span>
        {reached && <span className="text-amber">Goal {round1(goal)} {unit} reached</span>}
        <span>
          Day {days} · {round1(end)} {unit}
        </span>
      </div>
    </div>
  );
}
