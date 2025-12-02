"use client";

import React from "react";
import { Dropdown, Avatar } from "antd";
import type { AntMenuItems } from "../types/header";
import { UserOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { useAuthStore } from "@auth/stores/auth";
import { CurrentUser } from "@/types/auth";

export default function UserMenu({ user }: { user: CurrentUser }) {
  const { logout } = useAuthStore();
  const items: AntMenuItems = [
    {
      key: "profile-card",
      type: "group",
      label: (
        <div className="w-[min(88vw,240px)]">
          <div className="flex items-center gap-2">
            <Avatar
              size={36}
              icon={<UserOutlined />}
              src={user.avatarUrl !== "" ? user.avatarUrl : undefined}
            />
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-neutral-900 dark:text-neutral-50 truncate">
                {user.name}
              </div>
              <div className="text-[12px] text-neutral-500 truncate">
                {user.email}
              </div>
            </div>
          </div>
        </div>
      ),
    },
    { type: "divider" },
    { key: "profile", label: "Profile" },
    { key: "settings", label: "Settings" },
    {
      key: "help",
      label: (
        <span className="inline-flex items-center gap-2">
          <QuestionCircleOutlined /> Help Center
        </span>
      ),
    },
    { type: "divider" },
    {
      key: "logout",
      danger: true,
      label: "Logout",
      onClick: async () => {
        await logout().then(() => window.location.reload());
      },
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
      <Avatar
        size={32}
        className="cursor-pointer select-none bg-neutral-200"
        icon={<UserOutlined />}
        src={user.avatarUrl !== "" ? user.avatarUrl : undefined}
        alt="User menu"
      />
    </Dropdown>
  );
}
