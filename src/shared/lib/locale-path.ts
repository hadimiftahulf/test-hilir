export type AppLocale = "en" | "id";

export function buildLocalePath(next: AppLocale, path: string) {
  if (!path) return `/${next}`;
  const url = new URL(path, "http://local");
  const raw = url.pathname + url.search + url.hash;
  const clean = raw.startsWith("/") ? raw : `/${raw}`;
  const seg = clean.split("/");
  seg[1] = next;
  return seg.join("/");
}
