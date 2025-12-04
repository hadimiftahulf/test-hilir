"use client";

import { Form, Input, Button, Card, Typography, Divider } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";

interface RegisterCardProps {
  title: string;
  subtitle?: string;
  onSubmit: (values: any) => void;
  submitting: boolean;
  footer: React.ReactNode;
}

export default function RegisterCard({
  title,
  subtitle,
  onSubmit,
  submitting,
  footer,
}: RegisterCardProps) {
  const [form] = Form.useForm();

  return (
    <Card className="w-full max-w-md rounded-2xl shadow-lg border border-neutral-200/70 dark:border-neutral-800/70 bg-white/85 dark:bg-neutral-900/80 backdrop-blur">
      <div className="flex items-center gap-3 mb-4">
        <div className="size-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 grid place-content-center text-white font-semibold shadow">
          Hilir
        </div>
        <div className="leading-tight">
          <Typography.Title level={4} className="!mb-0">
            {title}
          </Typography.Title>
          {subtitle && (
            <Typography.Text type="secondary" className="text-sm">
              {subtitle}
            </Typography.Text>
          )}
        </div>
      </div>

      <Divider className="!my-3" />

      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        requiredMark={false}
        autoComplete="off"
      >
        <Form.Item
          name="name"
          label="Full Name"
          rules={[
            { required: true, message: "Please input your name" },
            { min: 3, message: "Name must be at least 3 characters" },
          ]}
        >
          <Input
            size="large"
            prefix={<UserOutlined />}
            placeholder="John Doe"
          />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please input your email" },
            { type: "email", message: "Invalid email format" },
          ]}
        >
          <Input
            size="large"
            prefix={<MailOutlined />}
            placeholder="you@example.com"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: "Please input your password" },
            { min: 6, message: "Min 6 characters" },
          ]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined />}
            placeholder="••••••••"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined />}
            placeholder="••••••••"
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={submitting}
          disabled={submitting}
          className="w-full !h-11 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border-0"
        >
          {submitting ? "Creating account..." : "Register"}
        </Button>
      </Form>

      <Divider className="!my-4">OR</Divider>

      <div className="flex items-center justify-center text-sm text-neutral-500 dark:text-neutral-400 w-full">
        {footer}
      </div>
    </Card>
  );
}
