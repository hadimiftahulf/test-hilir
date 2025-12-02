"use client";

import React from "react";
import { Drawer, Input, Button, Avatar } from "antd";
import {
  PlusOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/shared/components/ThemeToggle";
import LocaleSwitcher from "@/shared/components/LocaleSwitcher";
import type { NotificationItem } from "../types/header";
import { CurrentUser } from "@/types/auth";

export default function MobileDrawer({
  open,
  onClose,
  user,
  notifications,
  onSearch,
  searchValue,
  setSearchValue,
}: {
  open: boolean;
  onClose: () => void;
  user: CurrentUser;
  notifications: NotificationItem[];
  onSearch: (q: string) => void;
  searchValue: string;
  setSearchValue: (val: string) => void;
}) {
  const router = useRouter();

  return (
    <Drawer
      id="app-mobile-drawer"
      open={open}
      onClose={onClose}
      placement="left"
      width={Math.min(
        320,
        typeof window !== "undefined" ? window.innerWidth - 32 : 320
      )}
      className="md:hidden"
      styles={{
        body: { padding: 12 },
        header: { borderBottom: "1px solid var(--color-border, #e5e7eb)" },
      }}
      title={
        <div className="flex items-center gap-2">
          <Avatar
            size={32}
            icon={<UserOutlined />}
            src={user.avatarUrl ?? undefined}
          />
          <div className="min-w-0">
            <div className="text-[13px] font-semibold truncate">
              {user.name}
            </div>
            <div className="text-[12px] text-neutral-500 truncate">
              {user.email}
            </div>
          </div>
        </div>
      }
    >
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="text-xs font-medium text-neutral-500">Search</div>
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onPressEnter={(e) => onSearch((e.target as HTMLInputElement).value)}
            prefix={<SearchOutlined className="text-neutral-400" />}
            placeholder="Search…"
            allowClear
            className="rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/70 dark:border-neutral-700 [&_.ant-input]:!text-[13px]"
          />
        </div>

        <div className="space-y-3">
          <div className="text-xs font-medium text-neutral-500">
            Quick actions
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button className="h-10 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-[13px] font-medium transition inline-flex items-center justify-center gap-2">
              <PlusOutlined /> New
            </button>
            <button className="h-10 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition inline-flex items-center justify-center gap-2">
              <QuestionCircleOutlined /> Help
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-xs font-medium text-neutral-500">
              Notifications
            </div>
            <button
              className="text-xs text-violet-600"
              onClick={() => {
                onClose();
                router.push("./notifications");
              }}
            >
              View all
            </button>
          </div>
          <div className="space-y-2">
            {notifications.slice(0, 3).map((n) => (
              <div
                key={n.id}
                className="rounded-xl p-3 border border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900/60"
              >
                <div className="text-[13px] font-medium">{n.title}</div>
                <div className="text-[12px] text-neutral-500">{n.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-xs font-medium text-neutral-500">
            Preferences
          </div>
          <div className="flex items-center justify-between gap-3">
            <ThemeToggle />
            <LocaleSwitcher />
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-medium text-neutral-500">Account</div>
          <div className="grid gap-2">
            <Button block onClick={onClose}>
              Profile
            </Button>
            <Button block onClick={onClose}>
              Settings
            </Button>
            <Button block danger onClick={onClose}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
