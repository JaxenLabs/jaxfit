"use client";

import { useId } from "react";
import { jaxfast } from "@/content/apps";
import { CUSTOM_RANGE, PROTOCOLS, fastHours, formatTime, fromInputTime, schedule, toInputTime, type ClockTime, type ProtocolId } from "@/lib/fit/fasting";
import { fastingStore } from "@/lib/stores";
import { PlayLogo } from "../AppPromo";
import { Icon } from "../Icon";
import { FastingDial } from "./FastingDial";
import { Notice } from "./Notice";

const when = (t: ClockTime) => `${formatTime(t.minutes)}${t.day ? " next day" : ""}`;

/** Tab 1: fasting plan, daily schedule, body stages, and starting the fast in JaxFast. */
export function FastingTab({ defaultProtocol, now, minor }: { defaultProtocol: ProtocolId; now: Date | null; minor: boolean }) {
  const f = fastingStore.use();
  const protocol = f.protocol ?? defaultProtocol;
  const hours = fastHours(protocol, f.customHours);
  const s = schedule(f.lastMeal, hours);
  const timeId = useId();
  const sliderId = useId();
  const set = (patch: Partial<typeof f>) => fastingStore.set({ ...fastingStore.get(), ...patch });

  if (minor) {
    return (
      <Notice tone="amber" title="Fasting plans are for adults">
        You entered an age under 18. Growing bodies need regular, balanced meals, so JaxFast doesn&rsquo;t offer fasting schedules for teens. A normal overnight
        break between dinner and breakfast is all you need. If you have questions about food or weight, a parent, school nurse or doctor can help.
      </Notice>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="label">Choose your fasting plan</h3>
        <div role="radiogroup" aria-label="Fasting plan" className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {PROTOCOLS.map((p) => {
            const on = p.id === protocol;
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => set({ protocol: p.id })}
                className={`flex min-h-[4.25rem] flex-col items-center justify-center rounded-2xl border px-1 text-center transition-colors ${
                  on ? "border-amber-2 bg-amber-soft text-amber" : "border-transparent bg-field text-text hover:border-border"
                }`}
              >
                <span className="text-lg leading-none font-extrabold">{p.id === "custom" ? "Custom" : p.id}</span>
                <span className={`mt-1 text-[0.6875rem] leading-tight font-bold ${on ? "" : "text-muted"}`}>{p.name}</span>
              </button>
            );
          })}
        </div>
        {protocol === "custom" && (
          <div className="mt-3 rounded-2xl bg-field px-4 pt-3 pb-1">
            <label htmlFor={sliderId} className="flex justify-between text-sm font-bold">
              Fasting hours <span className="text-amber">{f.customHours}h fast · {24 - f.customHours}h eating</span>
            </label>
            <input
              id={sliderId}
              type="range"
              min={CUSTOM_RANGE[0]}
              max={CUSTOM_RANGE[1]}
              step={1}
              value={f.customHours}
              onChange={(e) => set({ customHours: Number(e.target.value) })}
              className="range"
            />
          </div>
        )}
      </div>

      <div className="grid items-center gap-6 md:grid-cols-[auto_1fr]">
        <div className="flex justify-center">
          <FastingDial lastMeal={f.lastMeal} hours={hours} nowMinutes={now ? now.getHours() * 60 + now.getMinutes() : null} />
        </div>
        <div className="space-y-3">
          <div>
            <label htmlFor={timeId} className="label">
              My last meal ends at
            </label>
            <input
              id={timeId}
              type="time"
              value={toInputTime(f.lastMeal)}
              onChange={(e) => {
                const m = fromInputTime(e.target.value);
                if (m !== null) set({ lastMeal: m });
              }}
              className="field max-w-[12rem]"
            />
          </div>
          <dl className="grid grid-cols-2 gap-2" data-testid="schedule">
            <Slot icon="moon" tone="amber" label="Fast begins" value={when(s.fastBegins)} />
            <Slot icon="meal" tone="green" label={hours === 24 ? "Break your fast" : "Window opener meal"} value={when(s.windowOpens)} />
            <Slot icon="clock" tone="green" label="Eating window" value={s.windowHours ? `${s.windowHours} hours` : "One meal"} />
            <Slot icon="moon" tone="amber" label="Window closer meal" value={s.windowHours ? when(s.windowCloses) : "—"} />
          </dl>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-extrabold">Cellular Renewal & Body Insights Timeline</h3>
        <ol className="mt-3 space-y-2">
          {s.stages.map((st, i) => (
            <li key={st.title} className={`flex gap-3 rounded-2xl p-4 ${st.reached ? "bg-field" : "bg-field/50 opacity-60"}`}>
              <span className={`grid size-9 shrink-0 place-items-center rounded-xl text-sm font-extrabold ${st.reached ? "bg-amber-soft text-amber" : "bg-card text-muted"}`}>{i + 1}</span>
              <div className="min-w-0">
                <p className="text-xs font-bold text-muted">
                  {st.to === null ? `${st.from}h+` : `${st.from}–${st.to}h`} · from {when(st.time)}
                  {!st.reached && " · not reached on this plan"}
                </p>
                <p className="font-bold">{st.title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-muted">{st.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-2 text-xs text-muted">Timings are typical averages and vary with your last meal, activity and metabolism.</p>
      </div>

      <StartFast hours={hours} />
    </div>
  );
}

/** Starting the fast happens in the JaxFast app: the button is a link to it on Google Play. */
function StartFast({ hours }: { hours: number }) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl bg-amber-soft p-5 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <p className="font-extrabold">Ready to start your {hours}-hour fast?</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          Your fast continues in the {jaxfast.name} app, with a live dial through six body stages. Offline, no account, no ads.
        </p>
      </div>
      <div className="flex flex-col gap-1.5 sm:items-end">
        <a
          href={jaxfast.play("start_fast")}
          target="_blank"
          rel="noopener"
          data-testid="start-fast"
          aria-describedby="start-fast-note"
          className="btn-primary inline-flex h-12 items-center justify-center gap-2.5 rounded-2xl pr-5 pl-2.5 font-bold whitespace-nowrap"
        >
          <span className="grid size-8 place-items-center rounded-xl bg-white">
            <PlayLogo className="size-4" />
          </span>
          Start fast in {jaxfast.name}
        </a>
        <p id="start-fast-note" className="text-center text-xs font-semibold text-muted sm:text-right">
          Opens {jaxfast.name} on Google Play
        </p>
      </div>
    </div>
  );
}

function Slot({ icon, tone, label, value }: { icon: "moon" | "meal" | "clock"; tone: "amber" | "green"; label: string; value: string }) {
  return (
    <div className={`rounded-2xl p-3.5 ${tone === "amber" ? "bg-amber-soft" : "bg-accent-soft"}`}>
      <dt className={`flex items-center gap-1.5 text-xs font-bold ${tone === "amber" ? "text-amber" : "text-accent"}`}>
        <Icon name={icon} className="size-3.5" />
        {label}
      </dt>
      <dd className="mt-1 text-base font-extrabold sm:text-lg">{value}</dd>
    </div>
  );
}
