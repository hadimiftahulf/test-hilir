export const getCssColorVar: (name: string, fallbackHex: string) => string = (
  name,
  fallbackHex
) => {
  if (typeof window === "undefined") return fallbackHex;
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    ?.trim();
  if (!v) return fallbackHex;
  if (/^\d+\s+\d+\s+\d+$/.test(v)) {
    const [r, g, b] = v.split(/\s+/).map(Number);
    return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
  }
  return v;
};
