import { getRequestConfig } from "next-intl/server";
type MyRequestConfig = {
  locale: string;
  messages: Record<string, string>;
};
export default getRequestConfig(async ({ locale }: { locale?: string }) => {
  const supported = ["en", "id"] as const;
  const safeLocale = supported.includes(locale as "en" | "id") ? locale : "en";
  return {
    locale: safeLocale,
    messages: (await import(`../messages/${safeLocale}.json`)).default,
  } as MyRequestConfig;
});
