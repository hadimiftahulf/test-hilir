"use client";

import React from "react";
import { Button, Tooltip } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

export default function FooterCollapse({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="h-14 px-2 flex items-center border-t border-neutral-200/70 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur supports-backdrop-blur:backdrop-blur-md">
      <Tooltip
        title={collapsed ? "Expand (Ctrl/Cmd+B)" : "Collapse (Ctrl/Cmd+B)"}
      >
        <Button
          block
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          icon={collapsed ? <RightOutlined /> : <LeftOutlined />}
          className="!h-10 !rounded-2xl"
        >
          {!collapsed && (
            <span className="text-[13px] font-medium">Collapse</span>
          )}
        </Button>
      </Tooltip>
    </div>
  );
}
