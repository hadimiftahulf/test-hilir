"use client";

import React from "react";
import { Tooltip } from "antd";
import { PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons";

export default function GlobalActions() {
  return (
    <div className="hidden lg:flex items-center gap-2">
      <Tooltip title="Create new">
        <button
          type="button"
          className="h-9 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-[13px] font-medium transition inline-flex items-center gap-2"
        >
          <PlusOutlined /> New
        </button>
      </Tooltip>
      <Tooltip title="Help">
        <button
          type="button"
          className="h-9 w-9 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 grid place-items-center transition"
          aria-label="Help"
        >
          <QuestionCircleOutlined className="text-neutral-700 dark:text-neutral-300" />
        </button>
      </Tooltip>
    </div>
  );
}
