"use client";

import dayjs from "dayjs";
import { useEffect, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useDashboardStore } from "../store/dashboardStore";
import { fetchDashboardData } from "../api/dashboardMock";

export function useDashboardData() {
  const locale = (useLocale?.() as "en" | "id") ?? "en";
  const t = useTranslations("dashboard");
  const days = dayjs().format("dddd, D MMMM YYYY");
  const { hydrate, setDays, setGreeting, ...state } = useDashboardStore();

  const greeting = useMemo(() => {
    const hour = dayjs().hour();
    if (hour < 11) return t("greet.morning");
    if (hour < 15) return t("greet.afternoon");
    if (hour < 19) return t("greet.evening");
    return t("greet.night");
  }, [t]);

  useEffect(() => {
    setGreeting(greeting);
    setDays(days);
    (async () => {
      const data = await fetchDashboardData(locale);
      hydrate(data);
    })();
  }, [locale, greeting, hydrate, setGreeting, setDays]);

  return { locale, ...state };
}
