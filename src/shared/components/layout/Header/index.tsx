"use client";

import React from "react";
import { Layout, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useBreadcrumb } from "../hooks/useBreadcrumb";
import BreadcrumbTrail from "./BreadcrumbTrail";
import UserMenu from "./UserMenu";
import MobileDrawer from "./MobileDrawer";
import ThemeToggle from "@/shared/components/ThemeToggle";
import LocaleSwitcher from "@/shared/components/LocaleSwitcher";
import type { NotificationItem } from "../types/header";
import clsx from "clsx";
import { useUser } from "@shared/hooks/useAuth";
import { CurrentUser } from "@/types/auth";

const { Header: AntHeader } = Layout;

const DEFAULT_NOTIFS: NotificationItem[] = [
  {
    id: "1",
    title: "Approval needed",
    desc: "Timesheet minggu ini menunggu persetujuan.",
    time: "2m ago",
    unread: true,
  },
  {
    id: "2",
    title: "New payslip",
    desc: "Payslip Oktober 2025 tersedia untuk diunduh.",
    time: "1h ago",
  },
];

export default function Header({
  notifications = DEFAULT_NOTIFS,
  onSearch,
}: {
  notifications?: NotificationItem[];
  onSearch?: (q: string) => void;
}) {
  const router = useRouter();
  const breadcrumb = useBreadcrumb();
  const user = useUser();

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [mobileSearch, setMobileSearch] = React.useState("");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const handleSearch = (q: string) => {
    const val = q.trim();
    if (!val) return;
    if (onSearch) return onSearch(val);
    router.push(`?q=${encodeURIComponent(val)}`);
  };

  const currentUser: CurrentUser = {
    id: user?.id ?? "",
    avatarUrl: user?.avatarUrl ?? "",
    email: user?.email ?? "",
    name: user?.name ?? "",
    roles: user?.roles ?? [],
  };

  return (
    <>
      <AntHeader
        className={clsx(
          "!h-14 !leading-[56px]",
          "!bg-white/85 dark:!bg-neutral-900/80",
          "backdrop-blur supports-[backdrop-filter]:!bg-white/70",
          "dark:supports-[backdrop-filter]:!bg-neutral-900/65",
          "sticky top-0 z-40 border-b",
          "border-neutral-200/70 dark:border-neutral-800",
          "px-2 sm:px-3 md:px-4"
        )}
      >
        <div className="mx-auto w-full max-w-[1400px] h-full flex items-center gap-4">
          <div className="flex md:hidden">
            <Button
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              aria-controls="app-mobile-drawer"
              type="text"
              className="!w-9 !h-9 !rounded-full hover:!bg-neutral-100 dark:hover:!bg-neutral-800"
              icon={<MenuOutlined />}
              onClick={() => setDrawerOpen(true)}
            />
          </div>

          <BreadcrumbTrail items={breadcrumb} />
          <div className="flex-1" />

          <div className="hidden sm:block">
            <LocaleSwitcher />
          </div>

          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          <div className="hidden md:block">
            <UserMenu user={currentUser} />
          </div>
        </div>
      </AntHeader>

      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={currentUser}
        notifications={notifications}
        onSearch={handleSearch}
        searchValue={mobileSearch}
        setSearchValue={setMobileSearch}
      />
    </>
  );
}
