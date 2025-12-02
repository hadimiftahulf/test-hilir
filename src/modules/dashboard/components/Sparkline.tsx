"use client";

import React from "react";

// 1. Update Prop Type agar menerima null/undefined
interface SparklineProps {
  points: number[] | undefined | null;
}

export default function Sparkline({ points: originalPoints }: SparklineProps) {
  const w = 100;
  const h = 32;

  // 2. FIX UTAMA: Defensif Check dan Fallback ke Array Kosong
  const points = originalPoints || [];

  // 3. Pengecekan data: Jika array kosong atau hanya 1 titik, kembalikan placeholder
  if (points.length < 2) {
    return <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} />;
  }

  // Sekarang aman untuk menggunakan spread operator dan array methods
  const max = Math.max(...points);
  const min = Math.min(...points);

  // Normalisasi data
  const norm = (v: number) =>
    max === min ? h / 2 : h - ((v - min) / (max - min)) * h;

  const step = w / Math.max(points.length - 1, 1);

  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * step},${norm(p)}`)
    .join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="opacity-80">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
