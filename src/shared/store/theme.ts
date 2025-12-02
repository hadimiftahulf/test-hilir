"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect, useMemo, useSyncExternalStore } from "react";

export type ThemeMode = "light" | "dark" | "system";

type State = {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
};

export const useThemeStore = create<State>()(
  persist(
    (set) => ({
      mode: "system",
      setMode: (mode) => set({ mode }),
    }),
    { name: "theme-mode" }
  )
);
function subscribePrefersDark(cb: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = () => cb();
  if (mql.addEventListener) mql.addEventListener("change", handler);
  else mql.addListener(handler);
  return () => {
    if (mql.removeEventListener) mql.removeEventListener("change", handler);
    else mql.removeListener(handler);
  };
}
function getPrefersDarkSnapshot() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}
function usePrefersDark() {
  return useSyncExternalStore(
    subscribePrefersDark,
    getPrefersDarkSnapshot,
    () => false
  );
}
export function useIsDark() {
  const mode = useThemeStore((s) => s.mode);
  const prefersDark = usePrefersDark();
  const isDark = useMemo(() => {
    if (mode === "dark") return true;
    if (mode === "light") return false;
    return prefersDark;
  }, [mode, prefersDark]);
  return isDark;
}
export function useUpdateThemeMeta(isDark: boolean) {
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    const color = isDark ? "#0f172a" : "#ffffff";
    if (!meta) {
      const m = document.createElement("meta");
      m.name = "theme-color";
      m.content = color;
      document.head.appendChild(m);
    } else {
      meta.setAttribute("content", color);
    }
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  }, [isDark]);
}
