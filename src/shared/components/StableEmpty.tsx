"use client";
import React from "react";

export function StableEmpty() {
  return (
    <div style={{ textAlign: "center", padding: 16, color: "inherit" }}>
      <svg width="64" height="41" viewBox="0 0 64 41" aria-hidden>
        <ellipse
          cx="32"
          cy="33"
          rx="32"
          ry="7"
          fill="currentColor"
          opacity="0.08"
        />
        <g stroke="currentColor" opacity="0.25">
          <path
            d="M10 12 h44 v16 a2 2 0 0 1 -2 2 h-40 a2 2 0 0 1 -2 -2 z"
            fill="none"
          />
        </g>
      </svg>
      <div style={{ fontSize: 12, opacity: 0.6, marginTop: 6 }}>No Data</div>
    </div>
  );
}
