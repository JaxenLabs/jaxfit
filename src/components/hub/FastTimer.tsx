"use client";

import { STAGES, formatDuration, formatTime, lastMealBefore, stageAt } from "@/lib/fit/fasting";
import { addAction, dayKey } from "@/lib/fit/garden";
import { gardenStore, timerStore } from "@/lib/stores";
import { Icon } from "../Icon";

const HOUR = 3_600_000;

function ProgressRing({ value }: { value: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 120 120" className="size-full -rotate-90" aria-hidden>
      <circle cx="60" cy="60" r={r} fill="none" strokeWidth="10" className="stroke-field" />
      <circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${Math.max(0.001, value) * c} ${c}`}
        className={`transition-[stroke-dasharray] duration-700 ${value >= 1 ? "stroke-accent-2" : "stroke-amber-2"}`}
      />
    </svg>
  );
}

/**
 * The live fasting timer. Only the start time is saved (in localStorage), so
 * it stays exact when the tab is closed, the phone sleeps or the page is
 * reloaded: elapsed time is always "now − start".
 */
export function FastTimer({ now, goalHours, lastMeal }: { now: Date | null; goalHours: number; lastMeal: number }) {
  const timer = timerStore.use();
  const running = timer.startedAt !== null;
  const start = (at: number) => timerStore.set({ startedAt: at, goalHours });

  if (!running || !now) {
    return (
      <div className="flex flex-col gap-3 rounded-3xl bg-amber-soft p-5 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1">
          <p className="font-extrabold">Live fasting timer</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">Keeps counting even if you close this tab. Saved on this device only.</p>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <button type="button" disabled={!now} onClick={() => now && start(now.getTime())} className="btn-primary inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 font-bold">
            <Icon name="play" className="size-4" />
            Start Live Browser Timer
          </button>
          <button
            type="button"
            disabled={!now}
            onClick={() => now && start(lastMealBefore(now, lastMeal))}
            className="text-sm font-bold text-amber underline-offset-4 hover:underline disabled:opacity-50"
          >
            I finished eating at {formatTime(lastMeal)}
          </button>
        </div>
      </div>
    );
  }

  const elapsed = Math.max(0, now.getTime() - timer.startedAt!);
  const hours = elapsed / HOUR;
  const progress = Math.min(1, hours / timer.goalHours);
  const done = progress >= 1;
  const stage = STAGES[stageAt(hours)];
  const endsAt = new Date(timer.startedAt! + timer.goalHours * HOUR);

  const end = () => {
    if (done) gardenStore.set(addAction(gardenStore.get(), "fast", dayKey(now)));
    timerStore.set({ ...timer, startedAt: null });
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-5" aria-live="polite">
      <div className="flex flex-col items-center gap-5 sm:flex-row">
        <div className="relative size-40 shrink-0">
          <ProgressRing value={progress} />
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="text-3xl font-extrabold tabular-nums" data-testid="timer-percent">
                {Math.floor(progress * 100)}%
              </p>
              <p className="text-xs font-bold text-muted">of {timer.goalHours}h</p>
            </div>
          </div>
        </div>
        <div className="w-full min-w-0 text-center sm:text-left">
          <p className="text-sm font-bold text-muted">{done ? "Goal reached — well done!" : "Fasting for"}</p>
          <p className="text-4xl font-extrabold tracking-tight tabular-nums" data-testid="timer-elapsed">
            {formatDuration(elapsed)}
          </p>
          <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-soft px-3 py-1 text-xs font-bold text-amber">
            <Icon name="bolt" className="size-3.5" />
            {stage.title}
          </p>
          <p className="mt-2 text-sm text-muted">
            {done ? "Break your fast gently with a balanced meal." : `${formatDuration(endsAt.getTime() - now.getTime())} to go · ends at ${formatTime(endsAt.getHours() * 60 + endsAt.getMinutes())}`}
          </p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" onClick={end} className={`${done ? "btn-primary" : "btn-ghost"} inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl px-5 font-bold`}>
          <Icon name={done ? "check" : "meal"} className="size-4" />
          {done ? "Complete fast & grow my garden" : "End fast now"}
        </button>
      </div>
    </div>
  );
}
