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

  return (
    <Dropdown
      menu={{ items }}
      trigger={["click"]}
      placement="bottomRight"
      overlayClassName="!rounded-xl !overflow-hidden !shadow-lg !bg-white dark:!bg-neutral-900 dark:!text-neutral-200"
    >
      <Button
        type="text" // Menggunakan type="text" agar seragam dengan ThemeToggle
        size="middle"
        // PERUBAHAN UTAMA: Ubah dimensi menjadi w-9 h-9 agar seragam dengan ThemeToggle
        className={[
          "!w-9 !h-9 !rounded-full px-0 flex items-center justify-center", // Tambahkan ! di depan w/h/rounded-full untuk override
          "hover:!bg-neutral-100 dark:hover:!bg-neutral-800 transition-colors", // Styling hover
        ].join(" ")}
      >
        {/*
          Menghapus span aria-hidden yang berisi background radial-gradient
          Menghapus span ikon dengan styling 3D (transform: rotateY)
        */}
        <span
          className="text-lg leading-none relative z-[1]"
          role="img" // Tambahkan role img untuk aksesibilitas
        >
          {current.flag}
        </span>
      </Button>
    </Dropdown>
  );
}
