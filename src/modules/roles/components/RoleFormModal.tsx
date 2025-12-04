"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Modal,
  Form,
  Input,
  Checkbox,
  message,
  Typography,
  Divider,
  Spin,
  Row,
  Col,
  Tag,
  Tooltip,
} from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import { useTranslations } from "next-intl";
import { InfoCircleOutlined } from "@ant-design/icons";
import { Role, Permission } from "../types/role";

interface RoleFormModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  initialData?: Role | null;
}

export default function RoleFormModal({
  open,
  onCancel,
  onSuccess,
  initialData,
}: RoleFormModalProps) {
  const t = useTranslations("roles");
  const tCommon = useTranslations("common");

  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [submitting, setSubmitting] = useState(false);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [loadingPerms, setLoadingPerms] = useState(false);

  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  const isEdit = !!initialData;

  useEffect(() => {
    if (open && allPermissions.length === 0) {
      setLoadingPerms(true);
      fetch("/api/permissions")
        .then((res) => res.json())
        .then((json) => setAllPermissions(json.data || []))
        .catch(() => messageApi.error("Failed to load permissions"))
        .finally(() => setLoadingPerms(false));
    }
  }, [open, allPermissions.length, messageApi]);

  useEffect(() => {
    if (open) {
      form.resetFields();
      if (initialData) {
        setTimeout(() => {
          form.setFieldsValue({
            name: initialData.name,
            description: initialData.description,
          });

          setCheckedIds(initialData.permissions.map((p) => p.id));
        }, 100);
      } else {
        setCheckedIds([]);
      }
    }
  }, [open, initialData, form]);

  const groupedPermissions = useMemo(() => {
    const groups: Record<string, Permission[]> = {};
    allPermissions.forEach((p) => {
      const key = p.resource.charAt(0).toUpperCase() + p.resource.slice(1);
      if (!groups[key]) groups[key] = [];
      groups[key].push(p);
    });
    return groups;
  }, [allPermissions]);

  const handleGroupSelectAll = (resourceKey: string, checked: boolean) => {
    const groupPerms = groupedPermissions[resourceKey];
    const groupIds = groupPerms.map((p) => p.id);

    let newCheckedIds = [...checkedIds];

    if (checked) {
      groupIds.forEach((id) => {
        if (!newCheckedIds.includes(id)) newCheckedIds.push(id);
      });
    } else {
      newCheckedIds = newCheckedIds.filter((id) => !groupIds.includes(id));
    }

    setCheckedIds(newCheckedIds);
  };

  const handleSingleCheck = (id: string, checked: boolean) => {
    if (checked) {
      setCheckedIds((prev) => [...prev, id]);
    } else {
      setCheckedIds((prev) => prev.filter((pid) => pid !== id));
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      const url = isEdit ? `/api/roles/${initialData.id}` : "/api/roles";
      const method = isEdit ? "PUT" : "POST";

      const payload = {
        name: values.name,
        description: values.description,
        permissionIds: checkedIds,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Gagal menyimpan");

      messageApi.success(
        isEdit ? t("messages.updateSuccess") : t("messages.createSuccess")
      );
      onSuccess();
      onCancel();
    } catch (error: any) {
      if (error?.errorFields) return;
      messageApi.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "read":
        return "blue";
      case "create":
        return "green";
      case "update":
        return "orange";
      case "delete":
        return "red";
      default:
        return "default";
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={
          <div className="flex flex-col">
            <span className="text-lg font-semibold">
              {isEdit ? t("modal.editTitle") : t("modal.addTitle")}
            </span>
            <span className="text-xs font-normal text-neutral-500">
              Define access level and permissions for this role.
            </span>
          </div>
        }
        open={open}
        onCancel={onCancel}
        onOk={handleSubmit}
        okText={tCommon("save")}
        cancelText={tCommon("cancel")}
        confirmLoading={submitting}
        destroyOnHidden={true}
        maskClosable={false}
        width={720}
        styles={{
          body: { maxHeight: "75vh", overflowY: "auto", paddingRight: 8 },
        }}
      >
        <Form form={form} layout="vertical" preserve={false} className="mt-4">
          {/* --- Basic Info --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              name="name"
              label={t("form.roleName")}
              rules={[{ required: true, message: t("validation.required") }]}
            >
              <Input size="large" placeholder="e.g. HR Manager" />
            </Form.Item>
            <Form.Item name="description" label={t("form.description")}>
              <Input size="large" placeholder="e.g. Can manage employees" />
            </Form.Item>
          </div>

          <Divider
            orientation="left"
            className="!my-4 !text-xs !font-bold text-neutral-400 uppercase tracking-wider"
          >
            Access Controls
          </Divider>

          {/* --- Permission List --- */}
          {loadingPerms ? (
            <div className="flex justify-center py-12">
              <Spin size="large" />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {Object.entries(groupedPermissions).map(([resource, perms]) => {
                const groupIds = perms.map((p) => p.id);
                const checkedCount = groupIds.filter((id) =>
                  checkedIds.includes(id)
                ).length;
                const isAllChecked = checkedCount === groupIds.length;
                const isIndeterminate = checkedCount > 0 && !isAllChecked;

                return (
                  <div
                    key={resource}
                    className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-white dark:bg-neutral-900/50"
                  >
                    {/* Header Group */}
                    <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-100 dark:border-neutral-800">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={isAllChecked}
                          indeterminate={isIndeterminate}
                          onChange={(e) =>
                            handleGroupSelectAll(resource, e.target.checked)
                          }
                        />
                        <span className="font-semibold text-sm">
                          {resource}
                        </span>
                        <Tooltip
                          title={`Select all ${perms.length} permissions for ${resource}`}
                        >
                          <InfoCircleOutlined className="text-neutral-400 text-xs" />
                        </Tooltip>
                      </div>
                      <span className="text-xs text-neutral-400">
                        {checkedCount} / {perms.length} selected
                      </span>
                    </div>

                    {/* Permissions Grid */}
                    <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4">
                      {perms.map((p) => {
                        const isChecked = checkedIds.includes(p.id);
                        return (
                          <div
                            key={p.id}
                            onClick={() => handleSingleCheck(p.id, !isChecked)}
                            className={`
                              flex items-center gap-2 p-2 rounded-lg cursor-pointer border transition-all
                              ${
                                isChecked
                                  ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                                  : "bg-transparent border-transparent hover:bg-neutral-50 dark:hover:bg-neutral-800"
                              }
                            `}
                          >
                            <Checkbox
                              checked={isChecked}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) =>
                                handleSingleCheck(p.id, e.target.checked)
                              }
                            />
                            <div className="flex flex-col leading-none select-none">
                              <span className="text-xs font-medium capitalize mb-0.5">
                                {p.action}
                              </span>
                              <span className="text-[10px] text-neutral-400 font-mono">
                                {p.scope}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Form>
      </Modal>
    </>
  );
}
