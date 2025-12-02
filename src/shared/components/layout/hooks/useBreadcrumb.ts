"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";

function segmentToLabel(s: string) {
  if (!s) return "";
  return s.replace(/[-_]/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

export function useBreadcrumb() {
  const pathname = usePathname() || "/";
  const locale = useLocale();
  const parts = pathname.split("/").filter(Boolean);
  const pure = parts[0] === locale ? parts.slice(1) : parts;

  return pure.map((seg, i) => {
    const href = `/${[locale, ...pure.slice(0, i + 1)].join("/")}`;
    return { label: segmentToLabel(seg), href, key: href };
  });
}
