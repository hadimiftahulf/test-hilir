"use client";

import React, { useMemo, useState } from "react";
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
  Modal,
  message,
  Empty,
  Spin,
} from "antd";
import type { MenuProps, TableColumnsType } from "antd";
import {
  PlusOutlined,
  MoreOutlined,
  SearchOutlined,
  UserOutlined,
  ReloadOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { User } from "../types/user";
import UserFormModal from "./UserFormModal";

interface UserListProps {
  data: User[];
  loading: boolean;
  onRefresh: () => void;
  title?: string;
  subtitle?: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

export default function UserList({ data, loading, onRefresh }: UserListProps) {
  const t = useTranslations("employees");
  const tCommon = useTranslations("common");

  const [modal, contextHolderModal] = Modal.useModal();
  const [messageApi, contextHolderMessage] = message.useMessage();

  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState<string | undefined>();
  const [view, setView] = useState<"table" | "grid">("table");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleAdd = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (user: User) => {
    modal.confirm({
      title: t("actions.deleteTitle"),
      icon: <ExclamationCircleFilled />,
      content: t("actions.deleteConfirm", { name: user.name }),
      okText: tCommon("delete"),
      okType: "danger",
      cancelText: tCommon("cancel"),
      onOk: async () => {
        try {
          const res = await fetch(`/api/users/${user.id}`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error("Failed to delete");

          messageApi.success(t("messages.deleteSuccess"));
          onRefresh();
        } catch (error) {
          messageApi.error(t("messages.deleteError"));
        }
      },
    });
  };

  const allRoles = useMemo(() => {
    const roles = new Set<string>();
    data.forEach((u) => u.roles.forEach((r) => roles.add(r.name)));
    return Array.from(roles).sort();
  }, [data]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return data.filter((user) => {
      const byQ =
        !qq ||
        user.name.toLowerCase().includes(qq) ||
        user.email.toLowerCase().includes(qq);
      const byRole =
        !roleFilter || user.roles.some((r) => r.name === roleFilter);
      return byQ && byRole;
    });
  }, [q, roleFilter, data]);

  const paged = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const renderRoleTags = (roles: User["roles"]) => {
    if (!roles.length)
      return (
        <span className="text-neutral-400 text-xs italic">
          {t("table.noRole")}
        </span>
      );
    return (
      <div className="flex flex-wrap gap-1">
        {roles.map((r) => (
          <Tag
            key={r.id}
            color={r.name === "Admin" ? "blue" : "default"}
            className="mr-0 rounded-full px-2.5"
          >
            {r.name}
          </Tag>
        ))}
      </div>
    );
  };

  const actions = (row: User): MenuProps["items"] => [
    { key: "edit", label: t("actions.edit"), onClick: () => handleEdit(row) },
    {
      key: "delete",
      label: <span className="text-red-500">{t("actions.delete")}</span>,
      onClick: () => handleDelete(row),
    },
  ];

  const columns: TableColumnsType<User> = [
    {
      title: t("table.employee"),
      dataIndex: "name",
      render: (_, r) => (
        <div className="flex items-center gap-3 min-w-0">
          <Avatar
            size={36}
            src={r.avatarUrl}
            icon={<UserOutlined />}
            className="flex-shrink-0"
          >
            {!r.avatarUrl && getInitials(r.name)}
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
    {
      title: t("table.roles"),
      dataIndex: "roles",
      render: (_, r) => renderRoleTags(r.roles),
    },
    {
      title: t("table.joined"),
      dataIndex: "createdAt",
      responsive: ["md"],
      render: (v) => (
        <span className="text-neutral-500 text-xs">
          {new Date(v).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "action",
      width: 48,
      align: "right",
      render: (_, r) => (
        <Dropdown menu={{ items: actions(r) }} trigger={["click"]}>
          <Button
            type="text"
            icon={<MoreOutlined />}
            className="text-neutral-400 hover:text-neutral-900"
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* 👇 3. PASTIKAN CONTEXT HOLDER DIRENDER DI SINI */}
      {contextHolderModal}
      {contextHolderMessage}

      {/* --- MODAL FORM --- */}
      <UserFormModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSuccess={onRefresh}
        initialData={editingUser}
      />

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Typography.Title
            level={3}
            className="!mb-0 !text-[20px] dark:text-white"
          >
            {t("title")}
          </Typography.Title>
          <p className="text-[13px] text-neutral-500">{t("subtitle")}</p>
        </div>
        <Space size={8} wrap>
          <Segmented
            value={view}
            onChange={(v) => setView(v as any)}
            options={[
              { label: t("view.grid"), value: "grid" },
              { label: t("view.table"), value: "table" },
            ]}
          />
          <Button
            icon={<ReloadOutlined />}
            onClick={onRefresh}
            loading={loading}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            {t("toolbar.add")}
          </Button>
        </Space>
      </div>

      {/* --- FILTER --- */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3 bg-white dark:bg-neutral-900 p-1 rounded-xl">
        <Input
          allowClear
          value={q}
          onChange={(e) => setQ(e.target.value)}
          prefix={<SearchOutlined className="text-neutral-400" />}
          placeholder={t("filters.searchPlaceholder")}
          className="md:max-w-md rounded-lg"
        />
        <div className="flex-1" />
        <Select
          allowClear
          placeholder={t("filters.rolePlaceholder")}
          className="min-w-[160px]"
          value={roleFilter}
          onChange={setRoleFilter}
          options={allRoles.map((r) => ({ label: r, value: r }))}
        />
      </div>

      {/* --- CONTENT --- */}
      {loading && !data.length ? (
        <div className="h-64 grid place-content-center">
          <Spin size="large" />
        </div>
      ) : filtered.length === 0 ? (
        <Empty description={t("empty")} className="py-12" />
      ) : view === "table" ? (
        <div className="rounded-2xl border border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
          <Table<User>
            dataSource={filtered}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: PAGE_SIZE }}
            size="middle"
            scroll={{ x: 600 }}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
            {paged.map((r) => (
              <Card
                key={r.id}
                variant="borderless"
                className="rounded-2xl border border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm"
                styles={{ body: { padding: 16 } }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      size={48}
                      src={r.avatarUrl}
                      icon={<UserOutlined />}
                      className="bg-neutral-100 dark:bg-neutral-800"
                    >
                      {!r.avatarUrl && getInitials(r.name)}
                    </Avatar>
                    <div className="min-w-0">
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                        {r.name}
                      </div>
                      <div className="text-xs text-neutral-500 truncate">
                        {r.email}
                      </div>
                    </div>
                  </div>
                  <Dropdown menu={{ items: actions(r) }} trigger={["click"]}>
                    <Button type="text" size="small" icon={<MoreOutlined />} />
                  </Dropdown>
                </div>
                <div className="min-h-[24px] mb-3">
                  {renderRoleTags(r.roles)}
                </div>
                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center text-xs text-neutral-500">
                  <span>{t("card.joined")}</span>
                  <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
              </Card>
            ))}
          </div>
          <div className="flex justify-end">
            <Pagination
              size="small"
              total={filtered.length}
              pageSize={PAGE_SIZE}
              current={page}
              onChange={setPage}
              showSizeChanger={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}
