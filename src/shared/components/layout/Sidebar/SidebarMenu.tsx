"use client";

import React, { useMemo, useCallback } from "react";
import { Menu, theme, Badge } from "antd";
import type { MenuProps } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { MENU, SETTINGS_ITEM } from "./config";

interface MenuItem {
  key: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  permission?: string;
  badge?: number;
}

interface SessionUser {
  permissions?: string[];
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface SidebarMenuProps {
  collapsed: boolean;
}

export default function SidebarMenu({ collapsed }: SidebarMenuProps) {
  const { token } = theme.useToken();
  const router = useRouter();
  const pathname = usePathname() || "/";
  const locale = useLocale() as "en" | "id";
  const { data: session } = useSession();

  const userPermissions = (session?.user as SessionUser)?.permissions || [];

  const buildHref = useCallback(
    (path: string) => {
      const rawPath = `/${locale}/${path}`;
      return rawPath.replace(/\/+/g, "/");
    },
    [locale]
  );

  const activeKey = useMemo(() => {
    const menuItems = MENU as MenuItem[];

    const sortedMenu = [...menuItems].sort(
      (a, b) => b.path.length - a.path.length
    );

    const found = sortedMenu.find((m) => {
      const fullPath = buildHref(m.path);
      return pathname === fullPath || pathname.startsWith(`${fullPath}/`);
    });

    if (pathname.startsWith(buildHref(SETTINGS_ITEM?.path) as string)) {
      return SETTINGS_ITEM.key;
    }

    return found?.key ?? "dashboard";
  }, [pathname, buildHref]);

  const filteredMenu = useMemo(() => {
    const menuItems = MENU as MenuItem[];

    return menuItems.filter((item) => {
      if (!item.permission) return true;

      return userPermissions.some((userPerm) =>
        userPerm.startsWith(item.permission as string)
      );
    });
  }, [userPermissions]);

  const showSettings =
    !SETTINGS_ITEM.permission ||
    userPermissions.some((userPerm) =>
      userPerm.startsWith(SETTINGS_ITEM.permission as string)
    );

  const menuItems: MenuProps["items"] = [
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
      children: filteredMenu.map((m) => ({
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

    ...(filteredMenu.length > 0 && showSettings
      ? [{ type: "divider" as const }]
      : []),
    ...(showSettings
      ? [
          {
            key: SETTINGS_ITEM.key,
            icon: SETTINGS_ITEM.icon,
            label: SETTINGS_ITEM.label,
            onClick: () => router.push(buildHref(SETTINGS_ITEM.path)),
          },
        ]
      : []),
  ];

  return (
    <div className="flex-1 overflow-auto px-2 pb-3 no-scrollbar">
      <Menu
        mode="inline"
        selectedKeys={[activeKey]}
        inlineCollapsed={collapsed}
        items={menuItems}
        className="!border-0"
      />
    </div>
  );
}
