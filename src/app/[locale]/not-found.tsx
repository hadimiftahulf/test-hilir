"use client";

import React from "react";
import Link from "next/link";
import { Button, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { ArrowLeftOutlined, HomeOutlined } from "@ant-design/icons";

export default function NotFound() {
  const t = useTranslations("notFound");
  const locale = useLocale();
  const router = useRouter();
  const goHome = () => router.push(`/${locale}/dashboard`);

  return (
    <main
      role="main"
      aria-label={t("title")}
      className="relative min-h-screen overflow-hidden bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 -left-48 h-[520px] w-[520px] rounded-full blur-3xl opacity-20 bg-gradient-to-br from-[#7e22fa] to-[#a78bfa] dark:opacity-25" />
        <div className="absolute left-1/2 top-1/2 -z-10 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-neutral-200/60 dark:border-neutral-800/70" />
        <div className="absolute -bottom-48 -right-48 h-[520px] w-[520px] rounded-full blur-3xl opacity-15 bg-gradient-to-tr from-[#a78bfa] to-[#7e22fa] dark:opacity-20" />
        <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.08] [background:repeating-linear-gradient(45deg,transparent_0_6px,rgba(0,0,0,.08)_6px,rgba(0,0,0,.08)_7px)]" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 text-center">
        <div className="mb-4 inline-flex items-center gap-2">
          <span className="rounded-full bg-gradient-to-br from-[#7e22fa]/15 to-[#a78bfa]/20 px-3 py-1 text-xs font-medium text-[#7e22fa] dark:text-[#a78bfa]">
            404
          </span>
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
            {t("tipPrefix")} ⌘/Ctrl+K {t("tipSuffix")}
          </span>
        </div>

        <Typography.Title
          id="nf-title"
          level={1}
          className="!mb-3 !text-3xl sm:!text-4xl md:!text-5xl !font-semibold !leading-tight !text-balance"
        >
          {t("title")}
        </Typography.Title>

        <Typography.Paragraph className="!mt-0 !text-neutral-600 dark:!text-neutral-400 max-w-2xl mx-auto">
          {t("description")}
        </Typography.Paragraph>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          <Button
            type="primary"
            size="large"
            onClick={goHome}
            icon={<HomeOutlined />}
            className="rounded-xl"
          >
            {t("goHome")}
          </Button>

          <Button
            size="large"
            onClick={() => router.back()}
            icon={<ArrowLeftOutlined />}
            className="rounded-xl"
          >
            {t("back")}
          </Button>

          <Link href={`/${locale}/help`} className="inline-flex">
            <Button size="large" ghost className="rounded-xl">
              {t("helpCenter")}
            </Button>
          </Link>
        </div>

        <div className="mt-12 text-[11px] text-neutral-400 dark:text-neutral-500">
          <span className="inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7e22fa]/70" />
            <span>
              {t("footerNote", {
                year: new Date().getFullYear(),
                defaultValue: `© ${new Date().getFullYear()} Inovasi Dinamika Solusi`,
              })}
            </span>
          </span>
        </div>
      </section>
    </main>
  );
}
