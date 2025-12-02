"use client";

import React from "react";
import {
  Card,
  Typography,
  Tag,
  Progress,
  List,
  Avatar,
  Button,
  Table,
  Space,
  Divider,
} from "antd";
import {
  PlusOutlined,
  RobotOutlined,
  BarChartOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { useDashboardData } from "../hooks/useDashboardData";
import KpiCard from "../components/KpiCard";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const { Title, Text } = Typography;

const iconMap = {
  roi: <BarChartOutlined className="text-xl" />,
  users: <UserOutlined className="text-xl" />,
  settings: <SettingOutlined className="text-xl" />,
} as const;

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

export default function DashboardView() {
  const t = useTranslations("dashboard");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { data: session } = useSession();

  const { days, greeting, kpis, activities, roiStatus, topUsers, loading } =
    useDashboardData();

  const user = session?.user;

  const normalizedKpis =
    kpis?.map((k: any) => ({
      ...k,
      icon: k.iconKey ? iconMap[k.iconKey as keyof typeof iconMap] : undefined,
    })) || [];

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 p-4 md:p-6">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* --- HEADER & QUICK ACTIONS --- */}
        <div className="flex items-center justify-between">
          <div>
            <Title level={4} className="!m-0 dark:text-white">
              {greeting}, {user?.name}
            </Title>
            <Text className="text-[13px] text-neutral-500 dark:text-neutral-400">
              {days}
            </Text>
          </div>
          <div className="hidden sm:flex gap-3">
            <Button
              icon={<RobotOutlined />}
              onClick={() => router.push("/calculate")}
            >
              {t("actions.newCalculation")}
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                /* Trigger Modal Add User */
              }}
            >
              {t("actions.addUser")}
            </Button>
          </div>
        </div>

        {/* --- 1. KPI CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {loading &&
            Array.from({ length: 4 }).map((_, i) => <Card loading key={i} />)}
          {!loading &&
            normalizedKpis.map((k: any) => <KpiCard key={k.title} {...k} />)}
        </div>

        {/* --- 2. MAIN CONTENT GRID (ROI, ACTIVITY, USERS) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* KOLOM KIRI (Besar): ROI STATUS & TOP USERS */}
          {/* 👇 PERBAIKAN DI SINI: Gunakan flex flex-col gap-6 */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* A. ROI STATUS CARD (Tidak perlu mt- lagi) */}
            <Card
              title={t("title.roiStatus")}
              className="border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="md:col-span-1 text-center">
                  <Progress
                    type="dashboard"
                    percent={roiStatus?.score || 0}
                    size={120}
                    format={(percent) => (
                      <span className="text-xl font-bold">{percent}%</span>
                    )}
                    strokeColor={
                      roiStatus?.score
                        ? roiStatus.score > 70
                          ? "#52c41a"
                          : "#faad14"
                        : undefined
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <Title
                    level={5}
                    className={`!m-0 ${
                      roiStatus?.score
                        ? roiStatus.score < 50
                          ? "text-red-500"
                          : "text-green-600"
                        : ""
                    }`}
                  >
                    {roiStatus?.alert || t("status.dataUnavailable")}
                  </Title>
                  <p className="text-sm text-neutral-500 mt-1 mb-3">
                    {t("status.checkCalculator")}
                  </p>
                  <Button
                    icon={<BarChartOutlined />}
                    type="default"
                    size="small"
                    onClick={() => router.push("/calculate")}
                  >
                    {tCommon("analyze")}
                  </Button>
                </div>
              </div>
            </Card>

            {/* D. TOP USERS/NEW ACCESSES (Hapus mt-6 karena gap-6 sudah ada) */}
            <Card
              title={t("title.topUsers")}
              className="border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm"
              size="small"
            >
              <List
                dataSource={topUsers || []}
                renderItem={(u: any) => (
                  <List.Item className="!px-0">
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          src={u.avatarUrl}
                          style={{ background: "#e0f2fe" }}
                        >
                          {getInitials(u.name)}
                        </Avatar>
                      }
                      title={u.name}
                      description={u.role || t("status.user")}
                    />
                  </List.Item>
                )}
              />
              <Divider className="my-2" />
              <Button
                type="link"
                size="small"
                onClick={() => router.push("/users")}
                className="w-full text-center"
              >
                {tCommon("viewAllUsers")}
              </Button>
            </Card>
          </div>

          {/* KOLOM KANAN (Kecil): RECENT ACTIVITY & SYSTEM TASKS */}
          <div className="space-y-4">
            {/* B. RECENT ACTIVITY (System Events) */}
            <Card
              title={t("title.recentActivity")}
              className="border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm"
              size="small"
            >
              <List
                dataSource={activities || []}
                renderItem={(a: any) => (
                  <List.Item className="!px-0">
                    <List.Item.Meta
                      avatar={
                        <Avatar style={{ background: a.color || "#e0f2fe" }}>
                          {a.user[0]}
                        </Avatar>
                      }
                      title={
                        <span className="text-[13px] dark:text-neutral-200">
                          <b>{a.user}</b> {a.action}
                        </span>
                      }
                      description={
                        <span className="text-neutral-500 dark:text-neutral-400 text-xs">
                          {a.when} ago
                        </span>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
