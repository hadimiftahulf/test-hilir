"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "@/shared/components/LocaleSwitcher";
import ThemeToggle from "@/shared/components/ThemeToggle";
import { useRegister } from "@auth/hooks/useRegister";
import RegisterCard from "@auth/components/RegisterCard";

const COPYRIGHT_YEAR = new Date().getFullYear();

export default function RegisterPage() {
  const { onSubmit, submitting } = useRegister();
  const t = useTranslations();

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-neutral-50 dark:bg-neutral-950">
      <div className="absolute inset-0 z-0 h-full w-full bg-white dark:bg-neutral-950 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f1f1f_1px,transparent_1px)] [background-size:16px_16px]">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-neutral-950 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      </div>

      <div className="absolute top-5 right-5 z-20 flex items-center gap-3 rounded-full border border-white/20 bg-white/60 p-1.5 pl-4 pr-2 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-black/30 transition-all hover:bg-white/80 dark:hover:bg-black/50">
        <LocaleSwitcher />
        <div className="h-4 w-px bg-neutral-300 dark:bg-neutral-700" />
        <ThemeToggle />
      </div>

      <div className="z-10 w-full max-w-[420px] p-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <RegisterCard
          title="Create Account"
          subtitle="Join us to manage your campaigns"
          onSubmit={onSubmit}
          submitting={submitting}
          footer={
            <div className="flex flex-col items-center gap-2">
              <span>
                {t("auth.haveAccount")}
                <Link
                  href="/en/auth/login"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  {t("auth.signIn")}
                </Link>
              </span>

              <span className="mt-4 text-xs text-neutral-400 dark:text-neutral-500">
                © {COPYRIGHT_YEAR} PT Hillir
              </span>
            </div>
          }
        />
      </div>
    </main>
  );
}
