import { formatTime } from "@/lib/fit/fasting";

const R = 80;
const C = 2 * Math.PI * R;
const DAY = 1440;

/** A ring segment from minute `start` lasting `length` minutes (midnight at the top). */
function Arc({ start, length, className, width = 18 }: { start: number; length: number; className: string; width?: number }) {
  if (length <= 0) return null;
  return (
    <circle
      cx="100"
      cy="100"
      r={R}
      fill="none"
      strokeWidth={width}
      strokeDasharray={`${r2((Math.min(length, DAY) / DAY) * C)} ${r2(C)}`}
      transform={`rotate(${r2((start / DAY) * 360 - 90)} 100 100)`}
      className={className}
    />
  );
}

/**
 * Coordinates are rounded to 2 decimals: the server (building the page) and
 * the browser can differ in the last digits of sin/cos, which React would
 * report as a mismatch when the page loads.
 */
const r2 = (n: number) => Math.round(n * 100) / 100;

const point = (minutes: number, r: number) => {
  const a = (minutes / DAY) * 2 * Math.PI - Math.PI / 2;
  return { x: r2(100 + r * Math.cos(a)), y: r2(100 + r * Math.sin(a)) };
};

/**
 * The 24-hour clock: the fast in amber, the eating window in green, and
 * (once the page is running in the browser) a dot at the current time.
 */
export function FastingDial({ lastMeal, hours, nowMinutes }: { lastMeal: number; hours: number; nowMinutes: number | null }) {
  const windowHours = 24 - hours;
  const dot = nowMinutes === null ? null : point(nowMinutes, R);
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={`24-hour clock: fasting ${hours} hours from ${formatTime(lastMeal)}, eating window ${windowHours} hours`} className="h-auto w-full max-w-[17rem]">
      <circle cx="100" cy="100" r={R} fill="none" strokeWidth="18" className="stroke-field" />
      <Arc start={lastMeal} length={hours * 60} className="stroke-amber-2" />
      <Arc start={lastMeal + hours * 60} length={windowHours * 60} className="stroke-accent-2" />
      {[0, 360, 720, 1080].map((m) => {
        const p = point(m, 56);
        return (
          <text key={m} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central" className="fill-muted text-[9px] font-bold">
            {["12 AM", "6 AM", "12 PM", "6 PM"][m / 360]}
          </text>
        );
      })}
      {Array.from({ length: 24 }, (_, h) => {
        const a = point(h * 60, 66);
        const b = point(h * 60, h % 6 ? 68 : 70);
        return <line key={h} x1={a.x} y1={a.y} x2={b.x} y2={b.y} strokeWidth="1.2" className="stroke-border" />;
      })}
      <text x="100" y="93" textAnchor="middle" className="fill-text text-[22px] font-extrabold">
        {hours}h
      </text>
      <text x="100" y="112" textAnchor="middle" className="fill-muted text-[9.5px] font-bold">
        {windowHours > 0 ? `fast · ${windowHours}h eating` : "fast · one meal"}
      </text>
      {dot && (
        <g>
          <circle cx={dot.x} cy={dot.y} r="7.5" className="fill-card" />
          <circle cx={dot.x} cy={dot.y} r="4.5" className="fill-text" />
        </g>
      )}
    </svg>
  );
}
