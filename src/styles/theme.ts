export const PALETTE = {
  light: {
    brand: "#1677ff",
    bg: "#ffffff",
    surface: "#f8fafc",
    text: "#0f172a",
    muted: "#475569",
    border: "#e2e8f0",
  },
  dark: {
    brand: "#69b1ff",
    bg: "#0f172a",
    surface: "#111827",
    text: "#e5e7eb",
    muted: "#94a3b8",
    border: "#1f2937",
  },
};

export function getAntdTokens(isDark: boolean) {
  const t = isDark ? PALETTE.dark : PALETTE.light;
  return {
    colorPrimary: t.brand,
    colorBgBase: t.bg,
    colorTextBase: t.text,
    colorBorder: t.border,
    borderRadius: 8,
  } as const;
}
