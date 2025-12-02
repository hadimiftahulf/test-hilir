"use client";

import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, message } from "antd"; // Import message tetap
import { useTranslations } from "next-intl";
import { User, Role } from "../types/user";

interface UserFormModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  initialData?: User | null;
}

export default function UserFormModal({
  open,
  onCancel,
  onSuccess,
  initialData,
}: UserFormModalProps) {
  const t = useTranslations("employees");
  const tCommon = useTranslations("common");

  // 👇 1. Buat Hook Message Context-Aware
  const [messageApi, contextHolder] = message.useMessage();

  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);

  const isEdit = !!initialData;

  useEffect(() => {
    if (open) {
      fetch("/api/roles")
        .then((res) => res.json())
        .then((json) => setRoles(json.data || []))
        // 👇 2. Ganti message.* dengan messageApi.*
        .catch(() => messageApi.error(t("messages.roleError")));
    }
  }, [open, t, messageApi]);

  useEffect(() => {
    if (open) {
      // Reset form state agar bersih
      form.resetFields();

      if (initialData) {
        form.setFieldsValue({
          name: initialData.name,
          email: initialData.email,
          roleIds: initialData.roles?.map((r) => r.id) || [],
        });
      }
    }
  }, [open, initialData, form]);

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      const url = isEdit ? `/api/users/${initialData.id}` : "/api/users";
      const method = isEdit ? "PUT" : "POST";

      const payload = {
        name: values.name,
        email: values.email,
        roleIds: values.roleIds,
        ...(values.password && { password: values.password }),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.error || t("messages.saveError"));

      // 👇 2. Ganti message.* dengan messageApi.*
      messageApi.success(
        isEdit ? t("messages.updateSuccess") : t("messages.createSuccess")
      );

      onSuccess();
      onCancel();
    } catch (error: any) {
      console.error(error);
      // 👇 2. Ganti message.* dengan messageApi.*
      messageApi.error(error.message || t("messages.saveError"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // 👇 3. Bungkus dengan Fragment agar contextHolder bisa dirender
    <>
      {contextHolder}

      <Modal
        title={isEdit ? t("modal.editTitle") : t("modal.addTitle")}
        open={open}
        onCancel={onCancel}
        onOk={() => form.submit()}
        okText={tCommon("save")}
        cancelText={tCommon("cancel")}
        confirmLoading={submitting}
        destroyOnHidden={true}
        maskClosable={false}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          preserve={false}
        >
          <Form.Item
            name="name"
            label={t("form.name")}
            rules={[{ required: true, message: t("validation.required") }]}
          >
            <Input placeholder="John Doe" />
          </Form.Item>

          <Form.Item
            name="email"
            label={t("form.email")}
            rules={[
              { required: true, message: t("validation.required") },
              { type: "email", message: t("validation.emailInvalid") },
            ]}
          >
            <Input placeholder="user@company.com" />
          </Form.Item>

          <Form.Item
            name="password"
            label={isEdit ? t("form.passwordOptional") : t("form.password")}
            rules={[
              {
                required: !isEdit,
                message: t("validation.passwordRequired"),
              },
              { min: 6, message: t("validation.passwordMin") },
            ]}
            help={isEdit ? t("form.passwordHelp") : null}
          >
            <Input.Password placeholder={isEdit ? "******" : "Secret123"} />
          </Form.Item>

          <Form.Item
            name="roleIds"
            label={t("form.roles")}
            rules={[{ required: true, message: t("validation.roleRequired") }]}
          >
            <Select
              mode="multiple"
              placeholder={t("filters.rolePlaceholder")}
              loading={roles.length === 0}
              options={roles.map((r) => ({ label: r.name, value: r.id }))}
              optionFilterProp="label"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
