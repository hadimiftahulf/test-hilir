"use client";

import React from "react";
import { Button, Tooltip, Space, Typography } from "antd";
import {
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  EnvironmentOutlined,
  UpOutlined,
  DownOutlined,
} from "@ant-design/icons";
import clsx from "clsx";
import dayjs from "dayjs";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { CurrentUser } from "@/types/auth";

const { Text } = Typography;

type Props = {
  collapsed: boolean;
  user: CurrentUser;
  att: {
    status: "none" | "checked_in" | "checked_out";
    clockInAt?: string;
    clockOutAt?: string;
    mode?: "WFO" | "WFH";
    locationLabel?: string;
  };
  loadingIn: boolean;
  loadingOut: boolean;
  canCheckIn: boolean;
  canCheckOut: boolean;
  onClockIn: () => void;
  onClockOut: () => void;
};

export default function AttendanceCard({
  collapsed,
  user,
  att,
  loadingIn,
  loadingOut,
  canCheckIn,
  canCheckOut,
  onClockIn,
  onClockOut,
}: Props) {
  const [open, setOpen] = useLocalStorage<boolean>("attOpen", true);

  const clockInText = att.clockInAt
    ? dayjs(att.clockInAt).format("HH:mm")
    : "-";
  const clockOutText = att.clockOutAt
    ? dayjs(att.clockOutAt).format("HH:mm")
    : "-";

  return (
    <div className="px-3 pt-3 pb-2">
      <div
        className="rounded-2xl p-3 overflow-hidden min-w-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(126,34,250,0.10) 0%, rgba(126,34,250,0.04) 100%)",
          border: "1px solid",
          borderColor: "rgba(126,34,250,0.25)",
        }}
      >
        <div className="flex items-center gap-2">
          {user?.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 grid place-items-center">
              <UserOutlined className="text-sm text-neutral-600 dark:text-neutral-300" />
            </div>
          )}
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-medium text-neutral-900 dark:text-neutral-50 truncate">
                {user?.name}
              </div>
              <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                {user?.email || "Employee"}
              </div>
            </div>
          )}
          <Tooltip title={open ? "Hide" : "Show"}>
            <Button
              size="small"
              shape="circle"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="attendance-panel"
              className="!flex !items-center !justify-center"
              icon={open ? <UpOutlined /> : <DownOutlined />}
            />
          </Tooltip>
        </div>

        <div
          id="attendance-panel"
          className={clsx(
            "transition-[grid-template-rows] duration-300 ease-in-out grid",
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          )}
        >
          <div className="overflow-hidden">
            {!collapsed && (
              <>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-neutral-200/70 dark:border-neutral-700/60 px-3 py-2">
                    <Space
                      size={6}
                      className="text-neutral-500 dark:text-neutral-400"
                    >
                      <LoginOutlined />
                      <Text type="secondary" className="text-[12px]">
                        Check-In
                      </Text>
                    </Space>
                    <div className="mt-1 text-[15px] font-semibold text-neutral-900 dark:text-neutral-50">
                      {clockInText}
                    </div>
                  </div>
                  <div className="rounded-xl border border-neutral-200/70 dark:border-neutral-700/60 px-3 py-2">
                    <Space
                      size={6}
                      className="text-neutral-500 dark:text-neutral-400"
                    >
                      <LogoutOutlined />
                      <Text type="secondary" className="text-[12px]">
                        Check-Out
                      </Text>
                    </Space>
                    <div className="mt-1 text-[15px] font-semibold text-neutral-900 dark:text-neutral-50">
                      {clockOutText}
                    </div>
                  </div>
                </div>

                {(att.mode || att.locationLabel) && (
                  <div className="mt-2 flex items-center gap-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                    <EnvironmentOutlined />
                    <span className="truncate">
                      {att.mode ? `[${att.mode}] ` : ""}
                      {att.locationLabel || ""}
                    </span>
                  </div>
                )}

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Tooltip
                    title={!canCheckIn ? "Already checked in" : "Check-In"}
                  >
                    <Button
                      type="primary"
                      block
                      size="middle"
                      shape="round"
                      icon={<LoginOutlined />}
                      loading={loadingIn}
                      disabled={!canCheckIn}
                      onClick={onClockIn}
                      className="!h-9"
                    >
                      Check-In
                    </Button>
                  </Tooltip>
                  <Tooltip
                    title={
                      !canCheckOut ? "You must check in first" : "Check-Out"
                    }
                  >
                    <Button
                      block
                      size="middle"
                      shape="round"
                      icon={<LogoutOutlined />}
                      loading={loadingOut}
                      disabled={!canCheckOut}
                      onClick={onClockOut}
                      className="!h-9"
                    >
                      Check-Out
                    </Button>
                  </Tooltip>
                </div>
              </>
            )}

            {collapsed && (
              <div className="mt-2 flex justify-center gap-2">
                <Tooltip
                  title={!canCheckIn ? "Already checked in" : "Check-In"}
                >
                  <Button
                    shape="circle"
                    icon={<LoginOutlined />}
                    size="small"
                    loading={loadingIn}
                    disabled={!canCheckIn}
                    onClick={onClockIn}
                  />
                </Tooltip>
                <Tooltip
                  title={!canCheckOut ? "You must check in first" : "Check-Out"}
                >
                  <Button
                    shape="circle"
                    icon={<LogoutOutlined />}
                    size="small"
                    loading={loadingOut}
                    disabled={!canCheckOut}
                    onClick={onClockOut}
                  />
                </Tooltip>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
