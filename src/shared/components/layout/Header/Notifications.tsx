"use client";

import React from "react";
import { Dropdown, Badge, Tooltip } from "antd";
import type { MenuProps } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import type { NotificationItem } from "../types/header";

export default function Notifications({
  items,
}: {
  items: NotificationItem[];
}) {
  const router = useRouter();
  const unreadCount = items.reduce((acc, n) => acc + (n.unread ? 1 : 0), 0);

  const menu: MenuProps = {
    items: [
      {
        key: "panel",
        type: "group",
        label: (
          <div className="w-[min(88vw,360px)]">
            <div className="flex items-center justify-between mb-1">
              <div className="text-[13px] font-semibold">Notifications</div>
              <button
                className="text-xs text-violet-600 hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("./notifications");
                }}
              >
                View all
              </button>
            </div>
            <div className="max-h-[48vh] overflow-auto -mx-2 px-2">
              {items.map((n) => (
                <div
                  key={n.id}
                  className={clsx(
                    "rounded-xl p-3 mb-2 border",
                    "border-neutral-200/70 dark:border-neutral-800",
                    "bg-white dark:bg-neutral-900/60"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <span
                      aria-hidden
                      className={clsx(
                        "mt-1 w-2 h-2 rounded-full shrink-0",
                        n.unread
                          ? "bg-violet-600"
                          : "bg-neutral-300 dark:bg-neutral-600"
                      )}
                    />
                    <div className="min-w-0">
                      <div className="text-[13px] font-medium text-neutral-900 dark:text-neutral-50 truncate">
                        {n.title}
                      </div>
                      <div className="text-[12px] text-neutral-600 dark:text-neutral-300 line-clamp-2">
                        {n.desc}
                      </div>
                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                        {n.time}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {!items.length && (
                <div className="text-center text-xs text-neutral-500 py-6">
                  No notifications
                </div>
              )}
            </div>
          </div>
        ),
      },
    ],
  };

  return (
    <Dropdown trigger={["click"]} placement="bottomRight" menu={menu}>
      <Tooltip title="Notifications">
        <Badge count={unreadCount} size="small" overflowCount={99}>
          <button
            type="button"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition"
            aria-label={`Notifications (${unreadCount} unread)`}
          >
            <BellOutlined className="text-[16px] text-neutral-600 dark:text-neutral-300" />
          </button>
        </Badge>
      </Tooltip>
    </Dropdown>
  );
}
