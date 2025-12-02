"use client";

import "@ant-design/v5-patch-for-react-19";
import { useEffect, useMemo, useState } from "react";
import { ConfigProvider, App, theme as antdTheme } from "antd";
import enUS from "antd/locale/en_US";
import idID from "antd/locale/id_ID";
import dayjs from "dayjs";
import "dayjs/locale/id";
import "dayjs/locale/en";

import { useIsDark, useThemeStore } from "@/shared/store/theme";
import { DEFAULT_PALETTE } from "@/shared/theme/palette";
import { getCssColorVar } from "@/shared/theme/cssVar";
import { buildTokens } from "@/shared/theme/tokens";
import { buildComponents } from "@/shared/theme/components";
import { StableEmpty } from "@shared/components/StableEmpty";
import { SessionProvider } from "next-auth/react";
import AuthProvider from "@shared/components/providers/AuthProvider";

const ANT_LOCALES: Record<string, typeof enUS> = { en: enUS, id: idID };

export default function Providers({
  children,
  locale,
  initialTheme,
}: {
  children: React.ReactNode;
  locale: string;
  initialTheme: "light" | "dark";
}) {
  const mode = useThemeStore((s) => s.mode);
  const isDarkReactive = useIsDark();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const initializeMounted = () => {
      setMounted(true);
    };

    initializeMounted();
  }, []);
  const isDark = mounted ? isDarkReactive : initialTheme === "dark";
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light"
    );
  }, [isDark]);
  useEffect(() => {
    dayjs.locale(locale === "id" ? "id" : "en");
  }, [locale]);

  const antdLocale = useMemo(() => ANT_LOCALES[locale] ?? enUS, [locale]);
  const themeTokens = useMemo(
    () => buildTokens(isDark, DEFAULT_PALETTE, getCssColorVar),
    [isDark]
  );
  const themeComponents = useMemo(
    () => buildComponents(isDark, DEFAULT_PALETTE),
    [isDark]
  );

  return (
    <ConfigProvider
      locale={antdLocale}
      theme={{
        hashed: false,
        algorithm: isDark
          ? antdTheme.darkAlgorithm
          : antdTheme.defaultAlgorithm,
        token: themeTokens,
        components: themeComponents,
      }}
      renderEmpty={() => <StableEmpty />}
    >
      <App>
        <SessionProvider>
          <AuthProvider>{children}</AuthProvider>
        </SessionProvider>
      </App>
    </ConfigProvider>
  );
}
