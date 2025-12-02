import type { Palette } from "./types";

export function buildComponents(isDark: boolean, palette: Palette) {
  return {
    Card: {
      colorBgContainer: isDark ? palette.surfaceDark : "#ffffff",
      boxShadow: isDark
        ? "0 8px 30px rgba(0,0,0,0.45)"
        : "0 8px 28px rgba(0,0,0,0.08)",
      paddingLG: 28,
      borderRadiusLG: 14,
      headerBorderBottom: "1px solid",
      headerBg: "transparent",
      headerColor: isDark ? "#e5e7eb" : "#111827",
    },
    Input: {
      colorBgContainer: isDark ? "#0b1220" : "#ffffff",
      colorBorder: isDark ? "#253347" : "#d1d5db",
      colorTextPlaceholder: isDark ? "#94a3b8" : "#9ca3af",
      activeShadow: isDark
        ? "0 0 0 3px rgba(155,135,245,0.22)"
        : "0 0 0 3px rgba(124,58,237,0.18)",
      hoverBorderColor: isDark ? "#335175" : "#a78bfa",
      controlHeight: 40,
      borderRadius: 10,
    },
    Password: {
      colorIcon: isDark ? "#9ca3af" : "#6b7280",
      colorIconHover: isDark ? "#cbd5e1" : "#374151",
    },
    Button: {
      controlHeight: 44,
      borderRadius: 12,
      colorPrimary: isDark ? palette.brandDark : palette.brandLight,
      colorPrimaryHover: isDark ? "#b3a3ff" : "#6d28d9",
      colorPrimaryActive: isDark ? "#a491ff" : "#5b21b6",
      defaultHoverBorderColor: isDark ? "#3b4e6a" : "#a1a1aa",
      defaultHoverColor: isDark ? "#e5e7eb" : "#111827",
    },
    Checkbox: {
      colorBgContainer: isDark ? "#0b1220" : "#ffffff",
      colorBorder: isDark ? "#2a3a50" : "#cbd5e1",
      colorChecked: isDark ? palette.brandDark : palette.brandLight,
      borderRadiusSM: 6,
    },
    Divider: {
      colorSplit: isDark ? "#203047" : "#e5e7eb",
      orientationMargin: 18,
    },
    Typography: {
      titleMarginBottom: 4,
      titleMarginTop: 0,
      colorLink: isDark ? "#c7b8ff" : "#7c3aed",
      colorLinkHover: isDark ? "#e4dcff" : "#6d28d9",
    },
    Segmented: {
      itemActiveBg: isDark ? "#162037" : "#f3f4f6",
      borderRadiusSM: 999,
    },
    Select: {
      optionSelectedColor: isDark ? "#f3f4f6" : "#111827",
      optionSelectedBg: isDark
        ? "rgba(155,135,245,0.18)"
        : "rgba(124,58,237,0.12)",
    },
    Tooltip: {
      colorBgSpotlight: isDark ? "#0f172a" : "#111827",
      colorTextLightSolid: isDark ? "#e5e7eb" : "#f9fafb",
    },
    Message: {
      contentBg: isDark ? "#0f172a" : "#ffffff",
    },
  } as const;
}
