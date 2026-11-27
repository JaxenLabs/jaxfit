"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_FASTING, readFasting, type FastingSettings } from "./fit/fasting";
import { EMPTY_GARDEN, readGarden, type Garden } from "./fit/garden";
import { DEFAULT_PROFILE, readProfile, type Profile } from "./fit/profile";

/*
 * Browser-only state, read with useSyncExternalStore. During the static
 * build and the first (hydration) render the server snapshot is used (no
 * clock, default values), so the HTML always matches; React then switches
 * to the real values. Everything is saved in localStorage on this device
 * only and never sent anywhere.
 */

// --- The live clock: one shared one-second timer ------------------------------
let now: Date | null = null;
let timer: ReturnType<typeof setInterval> | undefined;
const clockListeners = new Set<() => void>();

function subscribeClock(cb: () => void) {
  clockListeners.add(cb);
  if (!timer) {
    now = new Date();
    timer = setInterval(() => {
      now = new Date();
      clockListeners.forEach((l) => l());
    }, 1000);
    // Tell React about the first value straight away rather than after a second.
    queueMicrotask(cb);
  }
  return () => {
    clockListeners.delete(cb);
    if (!clockListeners.size && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

/** The current time, ticking every second; null while the page is being built or hydrated. */
export function useNow(): Date | null {
  return useSyncExternalStore(
    subscribeClock,
    () => now,
    () => null,
  );
}

// --- localStorage-backed stores -------------------------------------------------
/**
 * A value saved under "jaxfast-<name>", validated by `read` when loaded
 * (anything missing or malformed falls back to defaults). Changes made in
 * another tab show up here too. Storage can be blocked (private mode): the
 * page then still works, and values last until it is closed.
 *
 * Values saved before the rename to JaxFast ("jaxfit-<name>") are moved to
 * the new key the first time they're read, so returning visitors keep them.
 */
function createStore<T>(name: string, read: (raw: unknown) => T, serverValue: T) {
  const key = `jaxfast-${name}`;
  const oldKey = `jaxfit-${name}`;
  let cache: T | undefined;
  const listeners = new Set<() => void>();
  const load = () => {
    try {
      let saved = localStorage.getItem(key);
      if (saved === null && (saved = localStorage.getItem(oldKey)) !== null) {
        localStorage.setItem(key, saved);
        localStorage.removeItem(oldKey);
      }
      return read(JSON.parse(saved ?? "null"));
    } catch {
      return read(null);
    }
  };
  const get = () => (cache ??= load());
  const onStorage = (e: StorageEvent) => {
    if (e.key !== key) return;
    cache = undefined;
    listeners.forEach((l) => l());
  };
  return {
    use: () =>
      useSyncExternalStore(
        (cb) => {
          if (!listeners.size) window.addEventListener("storage", onStorage);
          listeners.add(cb);
          return () => {
            listeners.delete(cb);
            if (!listeners.size) window.removeEventListener("storage", onStorage);
          };
        },
        get,
        () => serverValue,
      ),
    get,
    set(next: T) {
      cache = next;
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // Storage blocked: the value lasts until the page is closed.
      }
      listeners.forEach((l) => l());
    },
  };
}

export const profileStore = createStore<Profile>("profile-v1", readProfile, DEFAULT_PROFILE);
export const fastingStore = createStore<FastingSettings>("fasting-v1", readFasting, DEFAULT_FASTING);
export const gardenStore = createStore<Garden>("garden-v1", readGarden, EMPTY_GARDEN);

/** Updates some fields of the profile. */
export const updateProfile = (patch: Partial<Profile>) => profileStore.set({ ...profileStore.get(), ...patch });
