import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "antd/dist/reset.css";
import "../../styles/globals.css";
import Providers from "./providers";
import { Suspense } from "react";
import { readThemeCookie } from "@/shared/theme/server-theme";

export const metadata: Metadata = { title: "Admin Dashboard" };

export function generateStaticParams(): { locale: "en" | "id" }[] {
  return [{ locale: "en" }, { locale: "id" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  const p = await params;
  const locale = (p?.locale ?? "en") as "en" | "id";
  const messages = (await import(`../../messages/${locale}.json`)).default;

  const theme = await readThemeCookie();
  return (
    <html
      lang={locale}
      data-theme={theme}
      className={theme === "dark" ? "dark" : "light"}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  try{
    var m = (document.cookie.match(/(?:^|; )theme=([^;]+)/)||[])[1];
    if(m==='dark'||m==='light'){
      document.documentElement.setAttribute('data-theme', m);
      if(m==='dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    }
  }catch(e){}
})();`.trim(),
          }}
        />
      </head>
      <body>
        <AntdRegistry>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Providers locale={locale} initialTheme={theme}>
              <Suspense fallback={<div />}>{children}</Suspense>
            </Providers>
          </NextIntlClientProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
