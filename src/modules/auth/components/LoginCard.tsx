"use client";

import { Form, Input, Button, Card, Typography, Checkbox, Divider } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { PropsAuth } from "@auth/types/auth";

export default function LoginCard({
  title,
  subtitle,
  onSubmit,
  onForgot,
  submitting,
  footer,
}: PropsAuth) {
  const [form] = Form.useForm<{
    email: string;
    password: string;
    remember: boolean;
  }>();

  return (
    <Card className="w-full max-w-md rounded-2xl shadow-lg border border-neutral-200/70 dark:border-neutral-800/70 bg-white/85 dark:bg-neutral-900/80 backdrop-blur">
      <div className="flex items-center gap-3 mb-4">
        <div className="size-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 grid place-content-center text-white font-semibold shadow">
          HILIR
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
        initialValues={{ remember: true }}
        requiredMark={false}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Invalid email" },
          ]}
        >
          <Input
            type="email"
            autoComplete="email"
            size="large"
            prefix={<MailOutlined />}
            placeholder="you@example.com"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: "Password is required" },
            { min: 6, message: "Min 6 characters" },
          ]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined />}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </Form.Item>

        <div className="flex items-center justify-between mb-2">
          <Form.Item name="remember" valuePropName="checked" className="!mb-0">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <Button type="link" size="small" className="p-0" onClick={onForgot}>
            Forgot password?
          </Button>
        </div>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={submitting}
          disabled={submitting}
          className="w-full !h-11 mt-1"
        >
          {submitting ? "Signing in..." : "Login"}
        </Button>
      </Form>

      <Divider className="!my-4">OR</Divider>

      <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
        {footer}
      </div>
    </Card>
  );
}
