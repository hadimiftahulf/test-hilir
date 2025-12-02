export type ThemeCookie = "light" | "dark";

export function writeThemeCookie(mode: ThemeCookie) {
  document.cookie = `theme=${mode}; Max-Age=${
    60 * 60 * 24 * 365
  }; Path=/; SameSite=Lax`;
}
