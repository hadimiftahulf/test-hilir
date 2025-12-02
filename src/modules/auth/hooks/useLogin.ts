"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { App } from "antd";
import { useTranslations, useLocale } from "next-intl";
import { useAuthStore } from "../stores/auth";

type Locale = "en" | "id";

export function useLogin() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const router = useRouter();
  const search = useSearchParams();
  const callbackUrl = search.get("callbackUrl") || "";
  const { message } = App.useApp();
  const { login, loading } = useAuthStore();

  const onSubmit = async (values: {
    email: string;
    password: string;
    remember: boolean;
  }) => {
    const res = await login(values);
    if (!res.ok) {
      message.error(res.message || t("auth.invalid"));
      return;
    }
    message.success(t("auth.welcome"));
    router.replace(callbackUrl || `/${locale}/dashboard`);
  };

  const goForgot = () => router.push(`/${locale}/forgot-password`);

  return { t, locale, onSubmit, goForgot, submitting: loading };
}
