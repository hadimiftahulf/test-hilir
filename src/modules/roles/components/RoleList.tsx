"use client";

import React, { useMemo, useState } from "react";
import {
  Table,
  Input,
  Button,
  Dropdown,
  Tag,
  Typography,
  Modal,
  message,
  Empty,
  Spin,
} from "antd";
import type { TableColumnsType, MenuProps } from "antd";
import {
  PlusOutlined,
  MoreOutlined,
  SearchOutlined,
  SafetyCertificateOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";
import { Role } from "../types/role";
import RoleFormModal from "./RoleFormModal";

interface RoleListProps {
  data: Role[];
  loading: boolean;
  onRefresh: () => void;
}

export default function RoleList({ data, loading, onRefresh }: RoleListProps) {
  const t = useTranslations("roles");
  const tCommon = useTranslations("common");

  const [modal, contextHolderModal] = Modal.useModal();
  const [messageApi, contextHolderMessage] = message.useMessage();

  const [q, setQ] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const handleAdd = () => {
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setIsModalOpen(true);
  };

  const handleDelete = (role: Role) => {
    modal.confirm({
      title: t("actions.deleteTitle"),
      icon: <ExclamationCircleFilled />,
      content: t("actions.deleteConfirm", { name: role.name }),
      okText: tCommon("delete"),
      okType: "danger",
      cancelText: tCommon("cancel"),
      onOk: async () => {
        try {
          const res = await fetch(`/api/roles/${role.id}`, {
            method: "DELETE",
          });
          if (!res.ok) throw new Error("Failed");
          messageApi.success(t("messages.deleteSuccess"));
          onRefresh();
        } catch {
          messageApi.error(t("messages.deleteError"));
        }
      },
    });
  };

  const filtered = useMemo(() => {
    return data.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()));
  }, [data, q]);

  const actions = (row: Role): MenuProps["items"] => [
    { key: "edit", label: t("actions.edit"), onClick: () => handleEdit(row) },
    {
      key: "delete",
      label: <span className="text-red-500">{t("actions.delete")}</span>,
      onClick: () => handleDelete(row),
    },
  ];

  const columns: TableColumnsType<Role> = [
    {
      title: t("table.roleName"),
      dataIndex: "name",
      render: (text) => (
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <SafetyCertificateOutlined />
          </div>
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: t("table.description"),
      dataIndex: "description",
      responsive: ["md"],
      render: (t) => <span className="text-neutral-500">{t || "-"}</span>,
    },
    {
      title: t("table.permissions"),
      dataIndex: "permissions",
      render: (perms: any[]) => (
        <Tag color="geekblue" className="rounded-full px-3">
          {perms.length} Permissions
        </Tag>
      ),
    },
    {
      key: "action",
      width: 48,
      align: "right",
      render: (_, r) => (
        <Dropdown menu={{ items: actions(r) }} trigger={["click"]}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {contextHolderModal}
      {contextHolderMessage}

      <RoleFormModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSuccess={onRefresh}
        initialData={editingRole}
      />

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
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          {t("toolbar.add")}
        </Button>
      </div>

      <div className="bg-white dark:bg-neutral-900 p-1 rounded-xl max-w-md">
        <Input
          allowClear
          value={q}
          onChange={(e) => setQ(e.target.value)}
          prefix={<SearchOutlined className="text-neutral-400" />}
          placeholder={t("filters.searchPlaceholder")}
          className="border-none bg-transparent"
        />
      </div>

      {loading && !data.length ? (
        <div className="h-64 grid place-content-center">
          <Spin size="large" />
        </div>
      ) : filtered.length === 0 ? (
        <Empty description={t("empty")} className="py-12" />
      ) : (
        <div className="rounded-2xl border border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden">
          <Table<Role>
            dataSource={filtered}
            columns={columns}
            rowKey="id"
            pagination={false}
            size="middle"
          />
        </div>
      )}
    </div>
  );
}
