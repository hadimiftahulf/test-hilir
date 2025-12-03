"use client";

import React, { useMemo, useCallback } from "react";
import { Menu, theme, Badge } from "antd";
import type { MenuProps } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { MENU, SETTINGS_ITEM } from "./config";

// 1. Definisi Tipe untuk menghindari 'any'
interface MenuItem {
  key: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  permission?: string;
  badge?: number;
}

// Interface untuk User Session agar TS tahu ada properti 'permissions'
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

  // 2. Ambil permission dengan Type Casting yang aman
  const userPermissions = (session?.user as SessionUser)?.permissions || [];

  // 3. Helper normalisasi URL (Gunakan useCallback agar stabil di dependency array)
  const buildHref = useCallback(
    (path: string) => {
      const rawPath = `/${locale}/${path}`;
      return rawPath.replace(/\/+/g, "/");
    },
    [locale]
  );

  // 4. Logic Active Key (Dependency array lengkap)
  const activeKey = useMemo(() => {
    // Casting MENU ke tipe MenuItem[] agar method sort & find dikenali
    const menuItems = MENU as MenuItem[];

    // Copy array sebelum sort agar tidak memutasi array asli (Best Practice)
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

  // 5. Logic Filter Menu
  const filteredMenu = useMemo(() => {
    const menuItems = MENU as MenuItem[];

    return menuItems.filter((item) => {
      if (!item.permission) return true;

      // Cek apakah ada permission yang match dengan prefix
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

  // 6. Generate Menu Items
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
    // Spread operator kondisional yang aman
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
