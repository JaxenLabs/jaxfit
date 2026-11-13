"use client";

import { glassesToday, dayKey } from "@/lib/fit/garden";
import { hydration } from "@/lib/fit/health";
import { activityOf, type Profile } from "@/lib/fit/profile";
import { gardenStore } from "@/lib/stores";
import { Icon } from "../Icon";
import { HabitGarden } from "./HabitGarden";
import { ProfileForm } from "./ProfileForm";

/** Tab 3: daily water target and the Habit Garden. */
export function WaterTab({ profile: p, now }: { profile: Profile; now: Date | null }) {
  const w = hydration(p);
  const g = gardenStore.use();
  const drunk = now ? glassesToday(g, dayKey(now)) : 0;
  const litres = (w.ml / 1000).toFixed(w.ml % 100 ? 2 : 1);

  return (
    <div className="space-y-6">
      <ProfileForm profile={p} compact />

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0e7490] to-[#0f766e] p-5 text-white sm:p-6">
        <Icon name="drop" className="pointer-events-none absolute -right-6 -bottom-8 size-44 text-white/10" />
        <p className="text-sm font-bold text-white/80">Your daily water target</p>
        <p className="mt-1 text-5xl font-extrabold tracking-tight tabular-nums" data-testid="water-litres">
          {litres} L
        </p>
        <p className="mt-2 font-bold text-white/90" data-testid="water-detail">
          {w.ml.toLocaleString("en-US")} ml · {w.glasses} glasses of 250 ml{p.units === "imperial" ? ` · ${Math.round(w.flOz)} fl oz` : ""}
        </p>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80">
          {w.low.toLocaleString("en-US")}–{w.high.toLocaleString("en-US")} ml from 30–35 ml per kg
          {w.extra ? `, including ${w.extra.toLocaleString("en-US")} ml extra for being ${activityOf(p.activity).label.toLowerCase()}` : ""}. Drink more in hot weather.
        </p>
      </div>

      <div>
        <p className="label">
          Today: {drunk} of {w.glasses} glasses
        </p>
        <div className="flex flex-wrap gap-1.5" aria-hidden>
          {Array.from({ length: Math.max(w.glasses, drunk) }, (_, i) => (
            <Icon key={i} name="drop" className={`size-6 transition-colors ${i < drunk ? "fill-[#0e7490] text-[#0e7490]" : "text-border"}`} />
          ))}
        </div>
      </div>

      <HabitGarden now={now} />
    </div>
  );
}
