"use client";

import React from "react";
import { Layout } from "antd";

const { Content } = Layout;

export default function ContentArea({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Content className="relative min-h-[calc(100vh-56px)] bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      <div
        className={`
            w-full
            pt-6 md:pt-8 lg:pt-10 pb-10
            px-1 sm:px-1 md:px-8
            max-w-[960px] xl:max-w-[1600px] 2xl:max-w-[1760px]
        `}
      >
        {children}
      </div>
    </Content>
  );
}
