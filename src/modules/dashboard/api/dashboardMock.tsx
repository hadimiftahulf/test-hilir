"use server";

import { getTranslations } from "next-intl/server";
import type {
  Kpi,
  EventItem,
  ActivityItem,
  TaskItem,
  PayslipItem,
} from "../types/dashbordTypes";

export async function fetchDashboardData(locale: "en" | "id") {
  const t = await getTranslations({ locale, namespace: "dashboard" });

  const kpis: Kpi[] = [
    {
      title: t("kpi.employees"),
      value: 126,
      trend: [2, 5, 8, 6, 9, 12, 15],
      positive: true,
      iconKey: "team",
    },
    {
      title: t("kpi.attendanceRate"),
      value: 96.2,
      suffix: "%",
      trend: [92, 93, 94, 95, 96, 95, 96],
      positive: true,
      iconKey: "check",
    },
    {
      title: t("kpi.pendingApprovals"),
      value: 7,
      trend: [3, 4, 5, 6, 7, 6, 7],
      positive: false,
      iconKey: "clock",
    },
    {
      title: t("kpi.activeContracts"),
      value: 118,
      trend: [110, 111, 114, 115, 116, 117, 118],
      positive: true,
      iconKey: "file",
    },
  ];

  const eventsToday: EventItem[] = [
    { id: 1, time: "09:30", title: "Daily Standup", tag: "Team" },
    { id: 2, time: "11:00", title: t("events.backendInterview"), tag: "HR" },
    { id: 3, time: "15:00", title: t("events.contractReview"), tag: "Legal" },
  ];

  const activities: ActivityItem[] = [
    {
      id: "a1",
      user: "Rina",
      action: locale === "id" ? "mengajukan cuti" : "submitted a leave",
      when: "2m",
    },
    {
      id: "a2",
      user: "Agus",
      action: locale === "id" ? "check-in" : "checked-in",
      when: "10m",
    },
    {
      id: "a3",
      user: "Budi",
      action: locale === "id" ? "unggah slip gaji" : "uploaded a payslip",
      when: "1h",
    },
  ];

  const tasks: TaskItem[] = [
    {
      key: "t1",
      task:
        locale === "id"
          ? "Approve timesheet tim A"
          : "Approve Team A timesheet",
      priority: "High",
      due: "Today",
    },
    {
      key: "t2",
      task: locale === "id" ? "Review pengajuan cuti" : "Review leave requests",
      priority: "Medium",
      due: "Tomorrow",
    },
  ];

  const payslips: PayslipItem[] = [
    { key: "p1", month: "Oct 2025", status: "Ready", amount: "IDR 12.500.000" },
    {
      key: "p2",
      month: "Sep 2025",
      status: "Downloaded",
      amount: "IDR 12.200.000",
    },
  ];

  return { kpis, eventsToday, activities, tasks, payslips };
}
