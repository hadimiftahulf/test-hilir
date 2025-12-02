"use client";

import React from "react";
import { Menu, theme, Badge } from "antd";
import type { MenuProps } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { MENU, SETTINGS_ITEM } from "./config";

export default function SidebarMenu({ collapsed }: { collapsed: boolean }) {
  const { token } = theme.useToken();
  const router = useRouter();
  const pathname = usePathname() || "/";
  const locale = useLocale() as "en" | "id";

  const buildHref = (path: string) => `/${locale}/${path}`;
  const activeKey =
    MENU.find((m) => pathname.startsWith(buildHref(m.path)))?.key ??
    "dashboard";

  const items: MenuProps["items"] = [
    {
      key: "section-main",
      type: "group",
      label: !collapsed ? (
        <span className="text-[11px] uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          Main Menu
        </span>
      ) : (
        ""
      ),
      children: MENU.map((m) => ({
        key: m.key,
        icon: m.icon,
        label: (
          <div className="flex items-center gap-2">
            <span className="text-[15px]">{m.label}</span>
            {typeof m.badge === "number" && m.badge > 0 ? (
              <Badge
                count={m.badge}
                size="small"
                style={{ background: token.colorPrimary }}
              />
            ) : null}
          </div>
        ),
        onClick: () => router.push(buildHref(m.path)),
      })),
    },
    { type: "divider" as const },
    {
      key: SETTINGS_ITEM.key,
      icon: SETTINGS_ITEM.icon,
      label: SETTINGS_ITEM.label,
      onClick: () => router.push(buildHref(SETTINGS_ITEM.path)),
    },
  ];

  return (
    <div className="px-2 pb-3 flex-1 overflow-auto no-scrollbar">
      <Menu
        mode="inline"
        selectedKeys={[activeKey]}
        inlineCollapsed={collapsed}
        items={items}
        className="!border-0"
      />
    </div>
  );
}
