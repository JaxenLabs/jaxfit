"use client";

import type { CSSProperties } from "react";
import { GARDEN_ACTIONS, LEVELS, addAction, dayKey, growth, levelOf, type GardenAction } from "@/lib/fit/garden";
import { gardenStore } from "@/lib/stores";
import { Icon, type IconName } from "../Icon";

const BASE = 172;
const MAX_STEM = 112;
const STEM = [0, 16, 32, 50, 70, 90, 108];

/** Leaves along the stem: where (fraction of its height), which side, from which level, how big. */
const LEAVES = [
  { f: 1, side: 1, level: 1, size: 0.7 },
  { f: 1, side: -1, level: 1, size: 0.7 },
  { f: 0.45, side: 1, level: 2, size: 1 },
  { f: 0.62, side: -1, level: 3, size: 1.05 },
  { f: 0.3, side: -1, level: 4, size: 1.15 },
  { f: 0.8, side: 1, level: 4, size: 1.05 },
  { f: 0.5, side: 1, level: 5, size: 1.2 },
  { f: 0.75, side: -1, level: 5, size: 1.1 },
] as const;

/** From pale and thirsty to deep, healthy green. */
const LEAF_COLORS = ["#b7c98a", "#a6c972", "#8cc56b", "#5fb865", "#34a85a", "#22a35a", "#16964f"];

const LEAF = "M0 0C7-11 22-12 32-3 24 7 9 8 0 0Z";
const anim: CSSProperties = { transition: "transform 0.9s cubic-bezier(0.2,0.8,0.2,1), opacity 0.6s ease, fill 0.8s ease", transformBox: "view-box" };

/** The plant: it only ever grows. */
function Plant({ level, watered }: { level: number; watered: boolean }) {
  const h = STEM[level];
  const top = BASE - h;
  const color = LEAF_COLORS[level];
  return (
    <svg viewBox="0 0 200 222" role="img" aria-label={`Your plant: ${LEVELS[level].name}`} className="h-auto w-full max-w-[13rem]">
      <ellipse cx="100" cy="214" rx="56" ry="6" className="fill-text/10" />
      <g className="animate-sway" style={{ transformOrigin: `100px ${BASE}px`, transformBox: "view-box" }}>
        <path
          d={`M100 ${BASE}V${BASE - MAX_STEM}`}
          stroke="#3f8f4f"
          strokeWidth="4.5"
          strokeLinecap="round"
          style={{ ...anim, transform: `scaleY(${h / MAX_STEM})`, transformOrigin: `100px ${BASE}px` }}
        />
        {LEAVES.map((l, i) => {
          const on = level >= l.level;
          return (
            <path
              key={i}
              d={LEAF}
              fill={color}
              style={{ ...anim, opacity: on ? 1 : 0, transform: `translate(100px, ${BASE - h * l.f}px) rotate(${l.side > 0 ? -18 : 18}deg) scale(${on ? l.side * l.size : 0}, ${on ? l.size : 0})`, transformOrigin: "0 0" }}
            />
          );
        })}
        {/* Buds, then flowers, at the top. */}
        {[-14, 0, 14].map((dx, i) => (
          <g key={dx} style={{ ...anim, opacity: level >= 5 ? 1 : 0, transform: `translate(${100 + dx}px, ${top - 6 + (i === 1 ? -6 : 0)}px) scale(${level >= 5 ? 1 : 0})`, transformOrigin: "0 0" }}>
            {level >= 6 ? (
              <>
                {[0, 72, 144, 216, 288].map((a) => (
                  <ellipse key={a} cx="0" cy="-6" rx="4" ry="6.5" fill="#f9a8d4" transform={`rotate(${a})`} />
                ))}
                <circle r="3.6" fill="#fbbf24" />
              </>
            ) : (
              <circle r="4.5" fill="#f472b6" />
            )}
          </g>
        ))}
      </g>
      <path d={`M48 ${BASE}h104l-12 42H60Z`} fill="#c2703d" />
      <rect x="44" y={BASE - 6} width="112" height="12" rx="4" fill="#d9824a" />
      <ellipse cx="100" cy={BASE - 6} rx="54" ry="5" fill={watered ? "#5b3a1f" : "#8a6440"} style={{ transition: "fill 0.8s ease" }} />
      {/* Seed waiting in the soil. */}
      <ellipse cx="100" cy={BASE - 8} rx="6" ry="4" fill="#a16207" style={{ ...anim, opacity: level === 0 ? 1 : 0 }} />
    </svg>
  );
}

const ACTION_ICONS: Record<GardenAction, IconName> = { water: "drop", fast: "clock", meal: "meal" };

/** The Habit Garden widget: log healthy actions and watch the plant grow. */
export function HabitGarden({ now }: { now: Date | null }) {
  const g = gardenStore.use();
  const points = growth(g);
  const level = levelOf(points);
  const next = LEVELS[level + 1];
  const today = now ? dayKey(now) : null;
  const log = (a: GardenAction) => today && gardenStore.set(addAction(gardenStore.get(), a, today));

  return (
    <div className="card overflow-hidden p-5 sm:p-6">
      <div className="flex items-center gap-2 text-accent">
        <Icon name="sprout" className="size-5" />
        <h3 className="text-lg font-extrabold text-text">Your Habit Garden</h3>
      </div>
      <div className="mt-4 grid items-center gap-5 sm:grid-cols-[13rem_1fr]">
        <div className="mx-auto w-full max-w-[13rem] rounded-3xl bg-gradient-to-b from-accent-soft to-transparent p-2">
          <Plant level={level} watered={today !== null && g.day === today && g.todayWater > 0} />
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-extrabold" data-testid="garden-level">
            {LEVELS[level].name}
          </p>
          <p className="mt-1 text-sm font-semibold text-muted" data-testid="garden-progress">
            {points} healthy action{points === 1 ? "" : "s"}
            {next ? ` · ${next.at - points} more to “${next.name}”` : " · fully grown, and still growing"}
          </p>
          <div className="mt-4 grid gap-2">
            {GARDEN_ACTIONS.map((a) => (
              <button key={a.id} type="button" disabled={!today} onClick={() => log(a.id)} className="btn-ghost flex min-h-12 items-center gap-3 rounded-2xl px-4 text-left text-sm font-bold">
                <Icon name={ACTION_ICONS[a.id]} className="size-5 shrink-0 text-accent" />
                <span className="flex-1">{a.label}</span>
                <span className="rounded-full bg-field px-2 py-0.5 text-xs tabular-nums text-muted">{g[a.id]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-5 flex gap-2 rounded-2xl bg-accent-soft p-4 text-sm leading-relaxed font-semibold text-accent">
        <Icon name="heart" className="mt-0.5 size-4 shrink-0" />
        Nothing in your garden ever dies or is taken away. Resting simply pauses growth until you return.
      </p>
    </div>
  );
}
