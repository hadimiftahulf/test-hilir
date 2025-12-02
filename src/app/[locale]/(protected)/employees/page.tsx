"use client";

import React from "react";
import {
  Table,
  Input,
  Select,
  Button,
  Dropdown,
  Avatar,
  Tag,
  Typography,
  Segmented,
  Card,
  Space,
  Pagination,
} from "antd";
import type { MenuProps, TableColumnsType } from "antd";
import {
  PlusOutlined,
  MoreOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

type Employee = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  position: string;
  department: string;
  status: "Active" | "On Leave" | "Inactive";
  hiredAt?: string;
  phone?: string;
};

const DATA: Employee[] = [
  {
    id: "1",
    name: "Rina Sari",
    email: "rina@company.com",
    position: "HR Generalist",
    department: "HR",
    status: "Active",
    hiredAt: "2023-07-12",
    phone: "(021) 555-0199",
  },
  {
    id: "2",
    name: "Agus Pratama",
    email: "agus@company.com",
    position: "Backend Engineer",
    department: "Engineering",
    status: "On Leave",
    hiredAt: "2022-01-04",
    phone: "(021) 555-0102",
  },
  {
    id: "3",
    name: "Budi Santoso",
    email: "budi@company.com",
    position: "Legal Officer",
    department: "Legal",
    status: "Active",
    hiredAt: "2021-10-09",
    phone: "(021) 555-4432",
  },
  {
    id: "4",
    name: "Nadia Putri",
    email: "nadia@company.com",
    position: "Product Designer",
    department: "Design",
    status: "Inactive",
    hiredAt: "2020-04-21",
    phone: "(021) 555-7788",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

export default function EmployeesMinimal() {
  const t = useTranslations("employees");
  const locale = useLocale();
  const router = useRouter();

  const [q, setQ] = React.useState("");
  const [dept, setDept] = React.useState<string>();
  const [status, setStatus] = React.useState<string>();
  const [view, setView] = React.useState<"table" | "grid">("grid");
  const [page, setPage] = React.useState(1);

  const PAGE_SIZE = 8;

  const departments = React.useMemo(
    () => Array.from(new Set(DATA.map((d) => d.department))).sort(),
    []
  );

  const filtered = React.useMemo(() => {
    const qq = q.trim().toLowerCase();
    return DATA.filter((r) => {
      const byQ =
        !qq ||
        r.name.toLowerCase().includes(qq) ||
        r.email.toLowerCase().includes(qq) ||
        r.position.toLowerCase().includes(qq);
      const byDept = !dept || r.department === dept;
      const byStatus = !status || r.status === status;
      return byQ && byDept && byStatus;
    });
  }, [q, dept, status]);

  React.useEffect(() => {
    setPage(1);
  }, [q, dept, status]);

  const paged = React.useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const badge = (s: Employee["status"]) => {
    const map = {
      Active: { c: "#16a34a", bg: "#16a34a1a", txt: t("status.Active") },
      "On Leave": { c: "#a16207", bg: "#a162071a", txt: t("status.On Leave") },
      Inactive: { c: "#b91c1c", bg: "#b91c1c1a", txt: t("status.Inactive") },
    } as const;
    const { c, bg, txt } = map[s];
    return (
      <Tag
        style={{
          border: "none",
          borderRadius: 999,
          color: c,
          background: bg,
          paddingInline: 10,
          height: 24,
        }}
      >
        {txt}
      </Tag>
    );
  };

  const actions = (row: Employee): MenuProps["items"] => [
    {
      key: "view",
      label: t("actions.viewProfile"),
      onClick: () => router.push(`/${locale}/employees/${row.id}`),
    },
    {
      key: "edit",
      label: t("actions.edit"),
      onClick: () => router.push(`/${locale}/employees/${row.id}/edit`),
    },
  ];

  const columns: TableColumnsType<Employee> = [
    {
      title: t("table.employee"),
      dataIndex: "name",
      render: (_: any, r) => (
        <div className="flex items-center gap-3 min-w-0">
          <Avatar
            size={36}
            src={r.avatar}
            icon={!r.avatar && <UserOutlined />}
            style={{ background: !r.avatar ? "#1118270f" : undefined }}
          >
            {!r.avatar ? getInitials(r.name) : null}
          </Avatar>
          <div className="min-w-0">
            <div className="font-medium text-[14px] text-neutral-900 dark:text-neutral-50 truncate">
              {r.name}
            </div>
            <div className="text-[12px] text-neutral-500 truncate">
              {r.email}
            </div>
          </div>
        </div>
      ),
    },
    { title: t("table.position"), dataIndex: "position", responsive: ["sm"] },
    {
      title: t("table.department"),
      dataIndex: "department",
      responsive: ["md"],
    },
    {
      title: t("table.status"),
      dataIndex: "status",
      width: 140,
      render: (v) => badge(v),
    },
    {
      title: "",
      key: "a",
      width: 48,
      align: "right",
      render: (_: any, r) => (
        <Dropdown menu={{ items: actions(r) }} trigger={["click"]}>
          <Button
            type="text"
            aria-label="more"
            icon={<MoreOutlined />}
            className="opacity-60 hover:opacity-100"
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Typography.Title level={3} className="!mb-0 !text-[20px]">
            {t("title")}
          </Typography.Title>
          <p className="text-[13px] text-neutral-500">{t("subtitle")}</p>
        </div>

        <Space size={8} wrap>
          <Segmented
            size="middle"
            value={view}
            onChange={(v) => setView(v as any)}
            options={[
              { label: t("view.grid"), value: "grid" },
              { label: t("view.table"), value: "table" },
            ]}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => router.push(`/${locale}/employees/new`)}
          >
            {t("toolbar.add")}
          </Button>
        </Space>
      </div>

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
        <Input
          allowClear
          value={q}
          onChange={(e) => setQ(e.target.value)}
          prefix={<SearchOutlined className="text-neutral-400" />}
          placeholder={t("filters.searchPlaceholder")}
          className="md:max-w-md rounded-lg bg-white dark:bg-neutral-900 border-neutral-200/70 dark:border-neutral-800"
        />
        <div className="flex-1" />
        <Select
          allowClear
          placeholder={t("filters.department")}
          className="min-w-[180px]"
          value={dept}
          onChange={setDept}
          options={departments.map((d) => ({ label: d, value: d }))}
        />
        <Select
          allowClear
          placeholder={t("filters.status")}
          className="min-w-[160px]"
          value={status}
          onChange={setStatus}
          options={[
            { label: t("status.Active"), value: "Active" },
            { label: t("status.On Leave"), value: "On Leave" },
            { label: t("status.Inactive"), value: "Inactive" },
          ]}
        />
      </div>

      {view === "table" ? (
        <div className="rounded-2xl border border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <Table<Employee>
            dataSource={filtered}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: PAGE_SIZE, showSizeChanger: false }}
            size="middle"
          />
        </div>
      ) : (
        <div className="rounded-2xl border border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-3 md:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 md:gap-4">
            {paged.map((r) => (
              <Card
                key={r.id}
                variant="borderless"
                className="rounded-2xl"
                styles={{
                  header: { padding: 12 },
                  body: { padding: 16 },
                }}
                title={
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar
                        size={44}
                        src={r.avatar}
                        icon={!r.avatar && <UserOutlined />}
                        className="shadow-sm"
                        style={{
                          background: !r.avatar ? "#1118270f" : undefined,
                        }}
                      >
                        {!r.avatar ? getInitials(r.name) : null}
                      </Avatar>
                      <div className="min-w-0">
                        <div className="font-medium text-[14px] text-neutral-900 dark:text-neutral-50 truncate">
                          {r.name}
                        </div>
                        <div className="text-[12px] text-neutral-500 truncate">
                          {r.position}
                        </div>
                      </div>
                    </div>

                    <Dropdown menu={{ items: actions(r) }} trigger={["click"]}>
                      <Button
                        type="text"
                        aria-label="more"
                        icon={<MoreOutlined />}
                        className="opacity-60 hover:opacity-100"
                      />
                    </Dropdown>
                  </div>
                }
                extra={null}
              >
                <div className="grid grid-cols-2 gap-3 text-[12px]">
                  <div>
                    <div className="text-neutral-500">
                      {t("table.department")}
                    </div>
                    <div className="font-medium text-neutral-800 dark:text-neutral-200">
                      {r.department}
                    </div>
                  </div>
                  <div>
                    <div className="text-neutral-500">{t("table.status")}</div>
                    <div>{badge(r.status)}</div>
                  </div>

                  <div className="col-span-2">
                    <div className="text-neutral-500">
                      {t("table.employee")}
                    </div>
                    <div className="truncate font-medium text-neutral-800 dark:text-neutral-200">
                      {r.email}
                    </div>
                  </div>

                  <div>
                    <div className="text-neutral-500">{t("card.hired")}</div>
                    <div className="font-medium text-neutral-800 dark:text-neutral-200">
                      {r.hiredAt ?? "-"}
                    </div>
                  </div>
                  <div>
                    <div className="text-neutral-500">{t("card.phone")}</div>
                    <div className="font-medium text-neutral-800 dark:text-neutral-200">
                      {r.phone ?? "-"}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <Pagination
              size="small"
              total={filtered.length}
              pageSize={PAGE_SIZE}
              current={page}
              showSizeChanger={false}
              onChange={setPage}
            />
          </div>
        </div>
      )}
    </div>
  );
}
