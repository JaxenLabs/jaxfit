"use client";

import { useSyncExternalStore } from "react";
import { Icon } from "./Icon";

/*
 * Light ("Warm Ivory") or dark ("Luxury Dark"). The choice is the
 * data-theme attribute on <html>, set before the page paints by the small
 * script in layout.tsx (so there's no flash) and remembered in localStorage.
 */
export const THEME_KEY = "jaxfit-theme";
const THEME_COLORS = { light: "#faf8f5", dark: "#0f1115" } as const;
type Theme = keyof typeof THEME_COLORS;

const listeners = new Set<() => void>();
const current = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLORS[theme]);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Storage blocked: the theme lasts until the page is closed.
  }
  listeners.forEach((l) => l());
}

/** The script run in <head> before the page paints: applies the saved theme. */
export const themeScript = `try{if(localStorage.getItem("${THEME_KEY}")==="dark"){document.documentElement.dataset.theme="dark";document.querySelector('meta[name="theme-color"]')?.setAttribute("content","${THEME_COLORS.dark}")}}catch(e){}`;

export function ThemeToggle() {
  const theme = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    current,
    () => "light" as Theme,
  );
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      title={dark ? "Light theme" : "Dark theme"}
      className="btn-ghost grid size-11 shrink-0 place-items-center rounded-2xl text-muted hover:text-text"
    >
      <Icon name={dark ? "sun" : "moon"} className="size-5" />
    </button>
  );
}
