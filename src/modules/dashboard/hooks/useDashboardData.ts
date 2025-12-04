"use client";

import dayjs from "dayjs";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";

import { useDashboardStore } from "../store/dashboardStore";
import { useUser } from "@shared/hooks/useAuth";

interface RoiStatus {
  score: number;
  alert: string;
}

export interface DashboardData {
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

  hydrate: (data: any) => void;
  setDays: (days: string) => void;
  setGreeting: (greeting: string) => void;
}

export function useDashboardData() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const locale = (useLocale?.() as "en" | "id") ?? "en";
  const t = useTranslations("dashboard");
  const user = useUser();

  const { hydrate, setDays, setGreeting, ...state } = useDashboardStore();

  const days = dayjs().format("dddd, D MMMM YYYY");

  const greeting = useMemo(() => {
    const hour = dayjs().hour();
    if (hour < 11) return t("greet.morning");
    if (hour < 15) return t("greet.afternoon");
    if (hour < 19) return t("greet.evening");
    return t("greet.night");
  }, [t]);

  const fetchData = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/dashboard/summary");

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch dashboard data");
      }

      const data: DashboardData = await res.json();
      hydrate(data);
    } catch (e: any) {
      setError(e.message || "Failed to load dashboard data.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [hydrate, user?.id]);

  useEffect(() => {
    setGreeting(greeting);
    setDays(days);
    fetchData();
  }, [greeting, days, setGreeting, setDays, fetchData]);

  return {
    locale,
    loading,
    error,

    ...state,
  };
}
