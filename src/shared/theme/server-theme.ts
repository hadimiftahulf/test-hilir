import "server-only";
import { headers, cookies } from "next/headers";

export type ThemeCookie = "light" | "dark";

export async function readThemeCookie(): Promise<ThemeCookie> {
  let h: Readonly<Headers> | null = null;
  try {
    h = await headers();
  } catch {}

  const hv = h?.get("x-theme");
  if (hv === "dark" || hv === "light") return hv;

  let ck: Awaited<ReturnType<typeof cookies>> | null = null;
  try {
    ck = await cookies();
  } catch {}

  const cv = ck?.get("theme")?.value;
  if (cv === "dark" || cv === "light") return cv;

  const rawCookie = h?.get("cookie") ?? "";
  const m = rawCookie.match(/(?:^|;\s*)theme=([^;]+)/);
  const fv = m?.[1];
  if (fv === "dark" || fv === "light") return fv;

  return "light";
}
