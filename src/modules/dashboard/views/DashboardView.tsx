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
  Badge,
  Divider,
} from "antd";
import {
  TeamOutlined,
  CheckCircleTwoTone,
  ClockCircleTwoTone,
  FileProtectOutlined,
  PlusOutlined,
  UserAddOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { useDashboardData } from "../hooks/useDashboardData";
import KpiCard from "../components/KpiCard";
import { useUser } from "@shared/hooks/useAuth";

const { Title, Text } = Typography;

const iconMap = {
  team: <TeamOutlined />,
  check: <CheckCircleTwoTone twoToneColor="#22c55e" />,
  clock: <ClockCircleTwoTone twoToneColor="#f59e0b" />,
  file: <FileProtectOutlined />,
} as const;
export default function DashboardView() {
  const t = useTranslations("dashboard");
  const user = useUser();
  const { days, greeting, kpis, eventsToday, activities, tasks, payslips } =
    useDashboardData();

  const normalizedKpis = kpis.map((k) => ({
    ...k,
    icon: k.iconKey ? iconMap[k.iconKey] : undefined,
  }));

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 p-4 md:p-6">
      <div className="max-w-[1200px] mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Title level={4} className="!m-0">
              {greeting}, {user?.name}
            </Title>
            <Text className="text-neutral-500 dark:text-neutral-400">
              {days}
            </Text>
          </div>
          <div className="hidden sm:flex gap-2">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="rounded-xl"
            >
              {t("actions.createRequest")}
            </Button>
            <Button icon={<UserAddOutlined />} className="rounded-xl">
              {t("actions.newEmployee")}
            </Button>
            <Button icon={<UploadOutlined />} className="rounded-xl">
              {t("actions.uploadPayslip")}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {normalizedKpis.map((k) => (
            <KpiCard key={k.title} {...k} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <Card
            title={t("title.attendanceToday")}
            className="lg:col-span-2 border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: t("stats.avgCheckIn"), value: "09:07" },
                { label: t("stats.avgCheckOut"), value: "17:12" },
                { label: t("stats.present"), value: "119" },
                { label: t("stats.wfh"), value: "28" },
              ].map((x) => (
                <div
                  key={x.label}
                  className="rounded-2xl p-3 border border-neutral-200/70 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50"
                >
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                    {x.label}
                  </div>
                  <div className="mt-1 text-xl font-semibold">{x.value}</div>
                </div>
              ))}
            </div>

            <Divider className="!my-4" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Card
                size="small"
                className="border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                title={t("title.today")}
              >
                <List
                  dataSource={eventsToday}
                  renderItem={(item) => (
                    <List.Item className="!px-0">
                      <List.Item.Meta
                        avatar={<Badge status="processing" />}
                        title={
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{item.title}</span>
                            <Tag bordered={false} className="rounded-full">
                              {item.tag}
                            </Tag>
                          </div>
                        }
                        description={
                          <span className="text-neutral-500 dark:text-neutral-400">
                            {item.time}
                          </span>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>

              <Card
                size="small"
                className="border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900"
                title={t("title.recentActivity")}
              >
                <List
                  dataSource={activities}
                  renderItem={(a) => (
                    <List.Item className="!px-0">
                      <List.Item.Meta
                        avatar={<Avatar>{a.user[0]}</Avatar>}
                        title={
                          <span className="text-[13px]">
                            <b>{a.user}</b> {a.action}
                          </span>
                        }
                        description={
                          <span className="text-neutral-500 dark:text-neutral-400">
                            {a.when} ago
                          </span>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </div>
          </Card>

          <div className="space-y-3">
            <Card
              title={t("title.teamProgress")}
              className="border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900"
            >
              <div className="space-y-3">
                {[
                  { label: "Onboarding", pct: 72, status: "active" as const },
                  {
                    label: "Policy Review",
                    pct: 46,
                    status: "active" as const,
                  },
                  {
                    label: "Payroll Prep",
                    pct: 89,
                    status: "success" as const,
                  },
                ].map((r) => (
                  <div key={r.label}>
                    <div className="flex justify-between text-sm">
                      <span>{r.label}</span>
                      <span>{r.pct}%</span>
                    </div>
                    <Progress
                      percent={r.pct}
                      status={r.status}
                      className="!mb-0"
                    />
                  </div>
                ))}
              </div>
            </Card>

            <Card
              title={t("title.myTasks")}
              className="border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900"
            >
              <Table
                size="small"
                pagination={false}
                dataSource={tasks}
                columns={[
                  { title: "Task", dataIndex: "task", key: "task" },
                  {
                    title: "Priority",
                    dataIndex: "priority",
                    key: "priority",
                    render: (p: string) => (
                      <Tag
                        color={
                          p === "High"
                            ? "red"
                            : p === "Medium"
                            ? "gold"
                            : "blue"
                        }
                      >
                        {p}
                      </Tag>
                    ),
                  },
                  { title: "Due", dataIndex: "due", key: "due" },
                ]}
              />
            </Card>

            <Card
              title={t("title.payslips")}
              className="border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900"
            >
              <Table
                size="small"
                pagination={false}
                dataSource={payslips}
                columns={[
                  { title: "Month", dataIndex: "month", key: "month" },
                  { title: "Status", dataIndex: "status", key: "status" },
                  {
                    title: "Amount",
                    dataIndex: "amount",
                    key: "amount",
                    align: "right",
                  },
                ]}
              />
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
