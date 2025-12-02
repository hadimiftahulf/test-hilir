"use client";

import React from "react";
import LoginCard from "../components/LoginCard";
import { useLogin } from "../hooks/useLogin";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/shared/components/LocaleSwitcher";
import ThemeToggle from "@/shared/components/ThemeToggle";

const COPYRIGHT_YEAR = new Date().getFullYear();

export default function Login() {
  const { onSubmit, goForgot, submitting } = useLogin();
  const t = useTranslations();

  return (
    <main className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-neutral-100 to-white dark:from-neutral-950 dark:to-neutral-900">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[.06] dark:opacity-10 [background:radial-gradient(600px_circle_at_0%_0%,#111_0,transparent_40%),radial-gradient(600px_circle_at_100%_0%,#111_0,transparent_40%),radial-gradient(700px_circle_at_100%_100%,#111_0,transparent_40%),radial-gradient(700px_circle_at_0%_100%,#111_0,transparent_40%)]"
      />
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LocaleSwitcher />
        <ThemeToggle />
      </div>
      <LoginCard
        title={t("title.login")}
        subtitle={t("auth.subtitle")}
        onSubmit={onSubmit}
        onForgot={goForgot}
        submitting={submitting}
        footer={
          <>
            <span>© {COPYRIGHT_YEAR} Inovasi Dinamika Solusi</span>
            <div className="space-x-3">
              <a href="/privacy">Privacy</a>
              <a href="/terms">Terms</a>
            </div>
          </>
        }
      />
    </main>
  );
}
