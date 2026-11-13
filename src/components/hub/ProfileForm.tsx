"use client";

import { useId, useState } from "react";
import { ACTIVITY, LIMITS, activityOf, cmToFtIn, ftInToCm, kgToLb, lbToKg, round1, type ActivityId, type Profile } from "@/lib/fit/profile";
import { updateProfile } from "@/lib/stores";

/**
 * A number box that keeps what the visitor is typing (e.g. "7" on the way to
 * "72") and reports a value only when it's a valid number in range. When the
 * value changes from elsewhere (another tab, switching units, saved data
 * loading), the box shows the new value.
 */
function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  unit,
  step = "any",
  name,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
  unit: string;
  step?: string;
  name: string;
}) {
  const id = useId();
  const [draft, setDraft] = useState(String(value));
  const [shown, setShown] = useState(value);
  if (value !== shown) {
    setShown(value);
    setDraft(String(value));
  }
  const n = Number(draft);
  const invalid = draft.trim() === "" || !Number.isFinite(n) || n < min || n > max;
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="label">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={draft}
          aria-invalid={invalid}
          aria-describedby={invalid ? `${id}-err` : undefined}
          onChange={(e) => {
            const text = e.target.value;
            setDraft(text);
            const v = Number(text);
            if (text.trim() !== "" && Number.isFinite(v) && v >= min && v <= max) {
              setShown(v);
              onChange(v);
            }
          }}
          className="field pr-12"
        />
        <span className="pointer-events-none absolute inset-y-0 right-3.5 grid place-items-center text-sm font-semibold text-muted">{unit}</span>
      </div>
      {invalid && (
        <p id={`${id}-err`} className="mt-1 text-xs font-semibold text-danger">
          Enter {min}–{max}
        </p>
      )}
    </div>
  );
}

/** Two- or three-option picker. */
export function Segment<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: readonly { id: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div role="group" aria-label={label} className="segment">
      {options.map((o) => (
        <button key={o.id} type="button" aria-pressed={value === o.id} onClick={() => onChange(o.id)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

const r1 = round1;
const UNIT_OPTIONS = [
  { id: "metric", label: "Metric (kg, cm)" },
  { id: "imperial", label: "Imperial (lb, ft)" },
] as const;
const SEX_OPTIONS = [
  { id: "female", label: "Female" },
  { id: "male", label: "Male" },
] as const;

/** Weight in the visitor's units, stored as kg. */
function WeightField({ label, name, kg, units, onChange }: { label: string; name: string; kg: number; units: Profile["units"]; onChange: (kg: number) => void }) {
  const [min, max] = LIMITS.weightKg;
  return units === "metric" ? (
    <NumberField label={label} name={name} value={r1(kg)} min={min} max={max} unit="kg" onChange={onChange} />
  ) : (
    <NumberField label={label} name={name} value={r1(kgToLb(kg))} min={Math.ceil(kgToLb(min))} max={Math.floor(kgToLb(max))} unit="lb" onChange={(lb) => onChange(lbToKg(lb))} />
  );
}

/**
 * The visitor's details, shared by every tab and saved on this device.
 * `compact` shows only what the water calculator needs.
 */
export function ProfileForm({ profile: p, compact = false }: { profile: Profile; compact?: boolean }) {
  const { ft, inch } = cmToFtIn(p.heightCm);
  const activityId = useId();
  return (
    <div className="space-y-4">
      <Segment label="Units" value={p.units} options={UNIT_OPTIONS} onChange={(units) => updateProfile({ units })} />
      <div className={`grid gap-3 ${compact ? "sm:grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}`}>
        {!compact && (
          <>
            <NumberField label="Age" name="age" value={p.age} min={LIMITS.age[0]} max={LIMITS.age[1]} step="1" unit="yrs" onChange={(age) => updateProfile({ age: Math.round(age) })} />
            <div className="min-w-0">
              <span className="label">Sex</span>
              <Segment label="Sex" value={p.sex} options={SEX_OPTIONS} onChange={(sex) => updateProfile({ sex })} />
            </div>
            {p.units === "metric" ? (
              <NumberField label="Height" name="height" value={r1(p.heightCm)} min={LIMITS.heightCm[0]} max={LIMITS.heightCm[1]} unit="cm" onChange={(heightCm) => updateProfile({ heightCm })} />
            ) : (
              <div className="col-span-2 grid grid-cols-2 gap-3 sm:col-span-1">
                <NumberField label="Height" name="height-ft" value={ft} min={3} max={8} step="1" unit="ft" onChange={(f) => updateProfile({ heightCm: clampHeight(ftInToCm(f, inch)) })} />
                <NumberField label="Inches" name="height-in" value={inch} min={0} max={11.9} unit="in" onChange={(i) => updateProfile({ heightCm: clampHeight(ftInToCm(ft, i)) })} />
              </div>
            )}
          </>
        )}
        <WeightField label="Current weight" name="weight" kg={p.weightKg} units={p.units} onChange={(weightKg) => updateProfile({ weightKg })} />
        {!compact && <WeightField label="Goal weight" name="goal" kg={p.goalKg} units={p.units} onChange={(goalKg) => updateProfile({ goalKg })} />}
        <div className={`min-w-0 ${!compact && p.units === "imperial" ? "col-span-2 sm:col-span-1" : ""}`}>
          <label htmlFor={activityId} className="label">
            Activity level
          </label>
          <select id={activityId} name="activity" value={p.activity} onChange={(e) => updateProfile({ activity: e.target.value as ActivityId })} className="field">
            {ACTIVITY.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs font-semibold text-muted">{activityOf(p.activity).hint}</p>
        </div>
      </div>
    </div>
  );
}

const clampHeight = (cm: number) => Math.min(LIMITS.heightCm[1], Math.max(LIMITS.heightCm[0], cm));
