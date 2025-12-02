"use client";

import dayjs from "dayjs";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
// Asumsi path dan store yang ada:
import { useDashboardStore } from "../store/dashboardStore";
import { useUser } from "@shared/hooks/useAuth"; // Hook untuk mendapatkan user yang sedang login

// --- Tipe Data untuk Response API ---
interface RoiStatus {
  score: number;
  alert: string;
}

// 🎯 Perbaikan Utama: Update interface state Anda
export interface DashboardData {
  // [Fields lama yang sudah ada di error log]
  greeting: string;
  days: string;
  kpis: any[];
  activities: any[];
  systemTasks: any[];
  error: string | null;
  roiStatus: RoiStatus;
  topUsers?: Array<{
    id: number;
    name: string;
    avatarUrl: string;
    roiScore: number;
  }>;

  // Actions
  hydrate: (data: any) => void;
  setDays: (days: string) => void;
  setGreeting: (greeting: string) => void;
  // ... actions lain ...
}

export function useDashboardData() {
  // --- STATE LOKAL ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- HOOKS DAN CONTEXT ---
  const locale = (useLocale?.() as "en" | "id") ?? "en";
  const t = useTranslations("dashboard");
  const user = useUser(); // Ambil data user

  // --- STORE ACTIONS & STATE ---
  const { hydrate, setDays, setGreeting, ...state } = useDashboardStore();

  // --- DERIVED STATE ---
  const days = dayjs().format("dddd, D MMMM YYYY");

  const greeting = useMemo(() => {
    const hour = dayjs().hour();
    if (hour < 11) return t("greet.morning");
    if (hour < 15) return t("greet.afternoon");
    if (hour < 19) return t("greet.evening");
    return t("greet.night");
  }, [t]);

  // --- FETCH LOGIC ---
  const fetchData = useCallback(async () => {
    // Cek user ID sebelum fetch (jika belum ada, hentikan dan tampilkan loading false)
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Panggil API summary (Wajib menggunakan Cookie Auth)
      const res = await fetch("/api/dashboard/summary");

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch dashboard data");
      }

      const data: DashboardData = await res.json();
      hydrate(data); // Simpan data ke store
    } catch (e: any) {
      setError(e.message || "Failed to load dashboard data.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [hydrate, user?.id]); // Dependency hanya pada user.id (untuk trigger fetch saat login)

  // --- EFFECT ---
  useEffect(() => {
    setGreeting(greeting);
    setDays(days);
    fetchData(); // Panggil fungsi fetch saat mount atau user ID berubah
  }, [greeting, days, setGreeting, setDays, fetchData]);

  // --- RETURN ---
  return {
    locale,
    loading,
    error,
    // days,
    // greeting,
    ...state,
  };
}
