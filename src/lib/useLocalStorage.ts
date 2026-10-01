"use client";
import { useCallback, useMemo, useState, useSyncExternalStore } from "react";

// Estado persistido en localStorage, con actualizaciones funcionales.
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
}

function readRaw(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [initial] = useState(initialValue);
  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(key),
    () => null
  );

  const value = useMemo<T>(() => {
    if (raw === null) return initial;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return initial;
    }
  }, [raw, initial]);

  const setValue = useCallback(
    (next: T | ((prevValue: T) => T)) => {
      const current = readRaw(key);
      let prev = initial;
      try {
        if (current !== null) prev = JSON.parse(current) as T;
      } catch {}
      const resolved = typeof next === "function" ? (next as (prevValue: T) => T)(prev) : next;
      try {
        localStorage.setItem(key, JSON.stringify(resolved));
      } catch {}
      listeners.forEach((l) => l());
    },
    [key, initial]
  );

  return [value, setValue] as const;
}
