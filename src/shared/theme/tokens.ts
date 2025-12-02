import type { Palette, CssVarReader } from "./types";

export function buildTokens(
  isDark: boolean,
  palette: Palette,
  readVar: CssVarReader
) {
  return {
    colorPrimary: readVar(
      "--color-brand",
      isDark ? palette.brandDark : palette.brandLight
    ),
    colorTextBase: readVar(
      "--color-text",
      isDark ? palette.textDark : palette.textLight
    ),
    colorBgBase: readVar(
      "--color-bg",
      isDark ? palette.bgDark : palette.bgLight
    ),
    colorBgContainer: isDark ? palette.surfaceDark : "#ffffff",
    colorBgElevated: isDark ? palette.surfaceDark : "#ffffff",
    colorBorder: isDark ? palette.borderDark : palette.borderLight,
    colorSplit: isDark ? "#1f2a3a" : "#e5e7eb",
    colorTextSecondary: isDark ? palette.textMutedD : palette.textMutedL,
    colorTextTertiary: "#6b7280",
    colorTextPlaceholder: isDark ? palette.placeholderD : "#9ca3af",
    colorFillSecondary: isDark ? palette.fillHoverD : "#f3f4f6",
    colorLink: undefined,
    colorLinkHover: undefined,
    borderRadius: 10,
    controlOutline: isDark ? "rgba(155,135,245,0.40)" : "rgba(124,58,237,0.35)",
    controlOutlineWidth: 3,
    controlInteractiveSize: 16,
    motionDurationMid: "0.18s",
  };
}
