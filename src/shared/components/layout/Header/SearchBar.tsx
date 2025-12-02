"use client";

import React from "react";
import { Input } from "antd";
import type { InputRef } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import clsx from "clsx";

export default function SearchBar({
  onSearch,
  hotkey = true,
  className,
}: {
  onSearch: (q: string) => void;
  hotkey?: boolean;
  className?: string;
}) {
  const [value, setValue] = React.useState("");
  const inputRef = React.useRef<InputRef>(null);

  React.useEffect(() => {
    if (!hotkey) return;
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hotkey]);

  return (
    <Input
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onPressEnter={(e) => onSearch((e.target as HTMLInputElement).value)}
      prefix={<SearchOutlined className="text-neutral-400" />}
      placeholder="Search…"
      allowClear
      className={clsx(
        "rounded-full",
        "bg-neutral-100 dark:bg-neutral-800",
        "border border-neutral-200/70 dark:border-neutral-700",
        "[&_.ant-input]:!text-[13px]",
        className
      )}
      suffix={
        <span className="hidden xl:inline-flex items-center gap-1 text-[11px] text-neutral-500">
          <kbd className="px-1 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700">
            ⌘
          </kbd>{" "}
          K
        </span>
      }
    />
  );
}
