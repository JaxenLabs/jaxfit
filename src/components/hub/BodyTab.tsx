"use client";

import { BMI_CATEGORIES, MIN_KCAL, bmi, bmiCategory, bmr, healthyRange, plan, tdee } from "@/lib/fit/health";
import { PACES, formatWeight, round1, type Profile } from "@/lib/fit/profile";
import { updateProfile } from "@/lib/stores";
import { Notice } from "./Notice";
import { ProfileForm, Segment } from "./ProfileForm";
import { WeightTrend } from "./WeightTrend";

const kcal = (n: number) => `${Math.round(n).toLocaleString("en-US")} kcal`;
const DATE = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" });

/** The BMI scale from 15 to 40, with the WHO bands. */
const SCALE = { min: 15, max: 40 };
const pct = (v: number) => `${((Math.min(SCALE.max, Math.max(SCALE.min, v)) - SCALE.min) / (SCALE.max - SCALE.min)) * 100}%`;
const BAND_COLORS = { under: "bg-amber-2/70", healthy: "bg-accent-2", over: "bg-amber-2", obese: "bg-danger/80" } as const;

/** Tab 2: WHO BMI, healthy weight range, BMR / TDEE and the goal plan with its safeguards. */
export function BodyTab({ profile: p, now }: { profile: Profile; now: Date | null }) {
  const value = bmi(p.weightKg, p.heightCm);
  const cat = bmiCategory(value);
  const range = healthyRange(p.heightCm);
  const minor = p.age < 18;
  const result = plan(p);

  return (
    <div className="space-y-6">
      <ProfileForm profile={p} />

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-3xl bg-field p-5">
          <p className="text-sm font-bold text-muted">Your BMI</p>
          <p className="mt-1 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tabular-nums" data-testid="bmi">
              {round1(value).toFixed(1)}
            </span>
            {!minor && (
              <span className={`text-lg font-extrabold ${cat.id === "healthy" ? "text-accent" : cat.id === "obese" ? "text-danger" : "text-amber"}`} data-testid="bmi-category">
                {cat.label}
              </span>
            )}
          </p>
          <div className="relative mt-4" aria-hidden>
            <div className="flex h-2.5 overflow-hidden rounded-full">
              {BMI_CATEGORIES.map((c, i) => {
                const from = Math.max(SCALE.min, c.min);
                const to = BMI_CATEGORIES[i + 1]?.min ?? SCALE.max;
                return <span key={c.id} className={BAND_COLORS[c.id]} style={{ width: `${((to - from) / (SCALE.max - SCALE.min)) * 100}%` }} />;
              })}
            </div>
            <span className="absolute -top-1 size-4.5 -translate-x-1/2 rounded-full border-[3px] border-card bg-text shadow" style={{ left: pct(value) }} />
          </div>
          <div className="mt-2 flex justify-between text-[0.6875rem] font-bold text-muted" aria-hidden>
            <span>15</span>
            <span>18.5</span>
            <span>25</span>
            <span>30</span>
            <span>40</span>
          </div>
        </div>
        <div className="rounded-3xl bg-accent-soft p-5">
          <p className="text-sm font-bold text-accent">Healthy weight range for your height</p>
          <p className="mt-1 text-2xl font-extrabold" data-testid="healthy-range">
            {formatWeight(range.min, p.units)} – {formatWeight(range.max, p.units)}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">BMI 18.5 to 24.9 (World Health Organization). Any weight in this range is a healthy goal.</p>
        </div>
      </div>

      {!minor && (
        <ul className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4" aria-label="WHO BMI categories">
          {BMI_CATEGORIES.map((c) => (
            <li key={c.id} className={`rounded-2xl border p-3 ${c.id === cat.id ? "border-accent bg-card" : "border-transparent bg-field"}`}>
              <span className="block font-bold">{c.label}</span>
              <span className="text-xs font-semibold text-muted">BMI {c.range}</span>
            </li>
          ))}
        </ul>
      )}

      {result.kind === "minor" ? (
        <Notice tone="amber" title="Growing bodies need fuel, not restriction">
          You entered an age under 18. Adult BMI categories don&rsquo;t apply to teens: doctors use growth charts for age and sex instead. Because your body is still
          growing, JaxFit doesn&rsquo;t show calorie-deficit or weight-loss targets. Focus on regular, balanced meals, plenty of water, sleep and activity you enjoy,
          and talk to a doctor or school nurse if you have questions about your weight.
        </Notice>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <Stat label="BMR (resting energy)" value={kcal(bmr(p.weightKg, p.heightCm, p.age, p.sex))} hint="Mifflin-St Jeor" testId="bmr" />
            <Stat label="TDEE (maintenance)" value={kcal(tdee(p, p.weightKg))} hint="Calories you use per day" testId="tdee" />
          </div>
          <Result result={result} p={p} now={now} />
        </>
      )}
    </div>
  );
}

function Stat({ label, value, hint, testId }: { label: string; value: string; hint: string; testId: string }) {
  return (
    <div className="rounded-3xl bg-field p-4 sm:p-5">
      <p className="text-xs font-bold text-muted sm:text-sm">{label}</p>
      <p className="mt-1 text-xl font-extrabold tabular-nums sm:text-2xl" data-testid={testId}>
        {value}
      </p>
      <p className="mt-0.5 text-xs text-muted">{hint}</p>
    </div>
  );
}

function Result({ result, p, now }: { result: Exclude<ReturnType<typeof plan>, { kind: "minor" }>; p: Profile; now: Date | null }) {
  switch (result.kind) {
    case "underweight":
      return (
        <Notice tone="amber" title="Let’s focus on nourishment, not a deficit">
          Your BMI is below 18.5, which the WHO classes as underweight, so JaxFit won&rsquo;t suggest a calorie deficit or fasting for weight loss. Eating at least your
          maintenance calories ({kcal(tdee(p, p.weightKg))} a day) with plenty of protein supports your energy and health. A doctor or dietitian can help you find the
          right plan for you.
        </Notice>
      );
    case "lowGoal":
      return (
        <Notice tone="amber" title="Your goal is below a healthy weight for your height">
          A goal of {formatWeight(p.goalKg, p.units)} would put your BMI under 18.5. To protect your health, JaxFit only plans towards goals within your healthy range.
          <button type="button" onClick={() => updateProfile({ goalKg: Math.ceil(result.minHealthyKg * 10) / 10 })} className="btn-primary mt-3 flex h-11 items-center rounded-2xl px-4 text-sm font-bold">
            Use {formatWeight(Math.ceil(result.minHealthyKg * 10) / 10, p.units)} as my goal
          </button>
        </Notice>
      );
    case "maintain":
      return (
        <Notice tone="green" title="You’re at your goal">
          Eat around {kcal(result.tdee)} a day to keep your weight steady. Keep enjoying your fasting rhythm, water and movement.
        </Notice>
      );
    case "atFloor":
      return (
        <Notice tone="info" title="Your maintenance calories are already close to the safe minimum">
          A deficit would take you below {kcal(result.floor)} a day, the lowest intake JaxFit suggests without medical supervision. Adding daily movement, such as a brisk
          30-minute walk, raises the calories you use instead. A doctor or dietitian can tailor a plan for you.
        </Notice>
      );
    default: {
      const losing = result.kind === "lose";
      const date = now && result.days !== null ? new Date(now.getFullYear(), now.getMonth(), now.getDate() + result.days) : null;
      return (
        <div className="space-y-4">
          <div>
            <span className="label">Pace</span>
            <Segment
              label="Pace"
              value={p.pace}
              options={PACES.map((x) => ({ id: x.id, label: `${x.label} ${losing ? "−" : "+"}${x.kcal}` }))}
              onChange={(pace) => updateProfile({ pace })}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl bg-accent p-5 text-on-accent">
              <p className="text-sm font-bold opacity-85">Daily energy target</p>
              <p className="mt-1 text-3xl font-extrabold tabular-nums" data-testid="target">
                {kcal(result.target)}
              </p>
              <p className="mt-1 text-sm font-semibold opacity-85">
                {losing ? "About " : "About +"}
                {round1(p.units === "metric" ? result.kgPerWeek : result.kgPerWeek / 0.45359237)} {p.units === "metric" ? "kg" : "lb"} a week
              </p>
            </div>
            <div className="rounded-3xl bg-amber-soft p-5">
              <p className="text-sm font-bold text-amber">Estimated Healthy Milestone</p>
              <p className="mt-1 text-2xl font-extrabold" data-testid="goal-date">
                {result.days === null ? "Over 3 years away" : date ? DATE.format(date) : "…"}
              </p>
              <p className="mt-1 text-sm font-semibold text-muted">
                {result.days === null ? "Try a faster pace, or a goal closer to today." : `${formatWeight(p.goalKg, p.units)} in about ${weeks(result.days)}`}
              </p>
            </div>
          </div>
          {result.floored && (
            <Notice tone="info" title="Safe minimum applied">
              Your target is held at {kcal(MIN_KCAL[p.sex])} a day, the safe minimum for {p.sex === "female" ? "women" : "men"}, so progress is a little slower than the pace
              you picked. That&rsquo;s healthy and sustainable.
            </Notice>
          )}
          <WeightTrend series={result.series} goalKg={p.goalKg} units={p.units} />
          <p className="text-xs leading-relaxed text-muted">
            Estimates use about 7,700 kcal per kg of body fat and recalculate your energy use as your weight changes. Real progress moves in waves with water and
            hormones: be kind to yourself.
          </p>
        </div>
      );
    }
  }
}

const weeks = (days: number) => (days < 14 ? `${days} day${days === 1 ? "" : "s"}` : `${Math.round(days / 7)} weeks`);
