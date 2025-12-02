import React from "react";
import { Layout } from "antd";

const { Footer: AntFooter } = Layout;

export default function Footer() {
  return (
    <AntFooter className="text-center text-xs text-neutral-500 dark:text-neutral-400 !bg-white dark:!bg-neutral-900 border-t border-neutral-200/70 dark:border-neutral-800">
      © {new Date().getFullYear()} PT Inovasi Dinamika Solusi — All rights
      reserved.
    </AntFooter>
  );
}
