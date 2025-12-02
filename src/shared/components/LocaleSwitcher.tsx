"use client";

import React, { useMemo } from "react";
import { Dropdown, Button } from "antd";
import type { MenuProps } from "antd";
import { useLocale } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Locale = "en" | "id";

const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "id", label: "Bahasa Indonesia", flag: "🇮🇩" },
];

function replaceLocaleInPath(path: string, next: string) {
  const parts = path.split("/");
  if (LOCALES.some((l) => l.code === (parts[1] as Locale))) {
    parts[1] = next;
    return parts.join("/") || `/${next}`;
  }
  return `/${next}${path.startsWith("/") ? "" : "/"}${path}`;
}

export default function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname() || "/en";
  const search = useSearchParams();
  const router = useRouter();
  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  const items: MenuProps["items"] = useMemo(
    () =>
      LOCALES.map((l) => ({
        key: l.code,
        onClick: () => {
          const nextPath = replaceLocaleInPath(pathname, l.code);
          const qs = search.toString();
          router.replace(qs ? `${nextPath}?${qs}` : nextPath);
        },
        label: (
          <div
            className={[
              "flex items-center justify-between gap-3 px-2 py-1.5 rounded-md",
              "transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800",
            ].join(" ")}
          >
            <span className="text-lg">{l.flag}</span>
            {l.code === locale && (
              <span className="inline-block h-2 w-2 rounded-full bg-brand" />
            )}
          </div>
        ),
      })),
    [pathname, search, router, locale]
  );
  const flipY = locale === "id" ? 180 : 0;

  return (
    <Dropdown
      menu={{ items }}
      trigger={["click"]}
      placement="bottomRight"
      overlayClassName="!rounded-xl !overflow-hidden !shadow-lg !bg-white dark:!bg-neutral-900 dark:!text-neutral-200"
    >
      <Button
        size="middle"
        className={[
          "relative rounded-full w-[46px] h-[40px] px-0 flex items-center justify-center",
          "bg-neutral-100 dark:bg-neutral-900 border border-black/5 dark:border-white/10",
          "hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all shadow-sm",
          "focus-visible:ring-2 ring-brand/50 ring-offset-2",
        ].join(" ")}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(120px 40px at 70% 30%, rgba(255,255,255,.35), transparent 60%)",
            mixBlendMode: "overlay",
          }}
        />

        <span
          className={[
            "text-lg leading-none relative z-[1]",
            "transition-transform duration-500 [transform-style:preserve-3d]",
            "motion-reduce:transition-none motion-reduce:transform-none",
          ].join(" ")}
          style={{ transform: `rotateY(${flipY}deg)` }}
          aria-hidden={false}
        >
          {current.flag}
        </span>
      </Button>
    </Dropdown>
  );
}
