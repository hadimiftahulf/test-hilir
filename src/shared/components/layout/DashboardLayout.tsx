"use client";

import React from "react";
import { Layout } from "antd";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Content from "./Content";
import Footer from "./Footer";
import { useSession } from "next-auth/react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = React.useState(false);

  const sidebarWidth = collapsed ? 88 : 260;

  return (
    <Layout className="min-h-screen">
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout
        style={{
          marginLeft: sidebarWidth,
          transition: "margin-left 200ms ease",
        }}
      >
        <Header />
        <Content>{children}</Content>
        <Footer />
      </Layout>
    </Layout>
  );
}
