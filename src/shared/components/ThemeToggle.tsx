"use client";

import React from "react";
import { Button } from "antd"; // Import Button dari Ant Design
import { SunOutlined, MoonOutlined } from "@ant-design/icons"; // Import ikon
import { useIsDark, useThemeStore } from "@/shared/store/theme";
import { writeThemeCookie } from "@shared/theme/client-theme";

export default function SimpleThemeSwitch() {
  const isDark = useIsDark();
  const setMode = useThemeStore((s) => s.setMode);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <div
        aria-hidden
        className="w-9 h-9 rounded-full bg-neutral-300/40 dark:bg-neutral-700/50"
      />
    );
  }

  const toggle = () => {
    const next = isDark ? "light" : "dark";
    setMode(next as "light" | "dark");
    writeThemeCookie(next === "dark" ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <Button
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      type="text"
      className="!w-9 !h-9 !rounded-full hover:!bg-neutral-100 dark:hover:!bg-neutral-800"
      icon={isDark ? <SunOutlined /> : <MoonOutlined />}
      onClick={toggle}
    />
  );
}
