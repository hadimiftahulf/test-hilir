"use client";

import React from "react";
import { useIsDark, useThemeStore } from "@/shared/store/theme";
import { writeThemeCookie } from "@shared/theme/client-theme";

const W = 92;
const H = 40;
const P = 4;
const TH = H - P * 2;
export default function SimpleThemeSwitch() {
  const isDark = useIsDark();
  const setMode = useThemeStore((s) => s.setMode);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <div
        aria-hidden
        className="w-[92px] h-10 rounded-full bg-neutral-300/40 dark:bg-neutral-700/50"
      />
    );
  }

  const pos = isDark ? W - TH - P : P;
  const toggle = () => {
    const next = isDark ? "light" : "dark";
    setMode(next as any);
    writeThemeCookie(next === "dark" ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <button
      type="button"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      onClick={toggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          setMode("light");
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          setMode("dark");
        }
      }}
      style={{ width: W, height: H }}
      className={[
        "relative select-none outline-none rounded-full",
        "ring-offset-2 focus-visible:ring-2 ring-brand/50",
        isDark ? "bg-neutral-900" : "bg-neutral-100",
        "shadow-[inset_0_1px_1px_rgba(0,0,0,.25)]",
        "transition-colors duration-200 hover:brightness-105 dark:hover:brightness-110",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            className={isDark ? "opacity-35" : "opacity-90"}
          >
            <circle
              cx="12"
              cy="12"
              r="5"
              fill={isDark ? "#A3A3A3" : "#1F2937"}
            />
            <g
              stroke={isDark ? "#A3A3A3" : "#1F2937"}
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l-1.4-1.4M20.4 20.4L19 19M5 19l-1.4 1.4M20.4 3.6L19 5" />
            </g>
          </svg>
        </div>
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            className={isDark ? "opacity-90" : "opacity-35"}
          >
            <path
              d="M15.5 3.5a7.5 7.5 0 1 0 5 12.9A8.5 8.5 0 1 1 15.5 3.5z"
              fill={isDark ? "#E5E7EB" : "#111827"}
            />
            <circle
              cx="18.5"
              cy="7"
              r="1"
              fill={isDark ? "#E5E7EB" : "#111827"}
            />
            <circle
              cx="17"
              cy="10"
              r="0.8"
              fill={isDark ? "#E5E7EB" : "#111827"}
            />
          </svg>
        </div>
      </div>

      <div
        aria-hidden
        className={[
          "absolute rounded-full grid place-items-center",
          "transition-transform duration-250 will-change-transform",
          isDark ? "bg-neutral-100" : "bg-neutral-900",
          isDark
            ? "shadow-[0_1px_2px_rgba(0,0,0,.25),inset_0_1px_0_rgba(255,255,255,.7),0_0_0_1px_rgba(255,255,255,.15)]"
            : "shadow-[0_1px_2px_rgba(0,0,0,.25),inset_0_1px_0_rgba(255,255,255,.5),0_0_0_1px_rgba(0,0,0,.12)]",
        ].join(" ")}
        style={{
          width: TH,
          height: TH,
          top: P,
          transform: `translateX(${pos}px)`,
        }}
      >
        <span
          className={
            isDark
              ? "h-1.5 w-1.5 rounded-full bg-white/80"
              : "h-1.5 w-1.5 rounded-full bg-white/20"
          }
        />
      </div>
    </button>
  );
}
