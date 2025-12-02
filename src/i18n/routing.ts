export const locales = ["en", "id"] as const;
export type AppLocale = (typeof locales)[number];
export const defaultLocale: AppLocale = "en";
