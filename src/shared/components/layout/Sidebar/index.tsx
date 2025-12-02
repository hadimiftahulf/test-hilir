"use client";

import React from "react";
import { Layout } from "antd";
import { useLocale } from "next-intl";
import { useAttendance } from "../hooks/useAttendance";
import type { TodayAttendance } from "../types/sidebar";
import Brand from "./Brand";
import AttendanceCard from "./AttendanceCard";
import SidebarMenu from "./SidebarMenu";
import FooterCollapse from "./FooterCollapse";
import { useUser } from "@shared/hooks/useAuth";

const { Sider } = Layout;

export default function Sidebar({
  collapsed,
  onCollapse,
  attendance: initialAttendance = { status: "none" },
}: {
  collapsed: boolean;
  onCollapse: (v: boolean) => void;
  attendance?: TodayAttendance;
}) {
  const user = useUser();
  const locale = useLocale() as "en" | "id";

  const {
    att,
    loadingIn,
    loadingOut,
    canCheckIn,
    canCheckOut,
    handleClockIn,
    handleClockOut,
  } = useAttendance(initialAttendance);

  return (
    <Sider
      collapsedWidth={88}
      width={260}
      collapsed={collapsed}
      onCollapse={onCollapse}
      breakpoint="lg"
      style={{ position: "fixed", left: 0, top: 0, height: "100vh" }}
      className="!bg-white dark:!bg-neutral-900 !border-r !border-neutral-200/70 dark:!border-neutral-800 overflow-hidden"
    >
      <Brand collapsed={collapsed} />

      <div
        className="flex flex-col"
        style={{ height: "calc(100vh - 64px - 56px)" }}
      >
        {/* <AttendanceCard
          collapsed={collapsed}
          user={
            user ?? { id: "", name: "", avatarUrl: "", email: "", roles: [] }
          }
          att={att}
          loadingIn={loadingIn}
          loadingOut={loadingOut}
          canCheckIn={canCheckIn}
          canCheckOut={canCheckOut}
          onClockIn={handleClockIn}
          onClockOut={handleClockOut}
        /> */}

        <SidebarMenu collapsed={collapsed} />
      </div>

      <FooterCollapse
        collapsed={collapsed}
        onToggle={() => onCollapse(!collapsed)}
      />
    </Sider>
  );
}
