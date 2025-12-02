"use client";

import React from "react";
import { Divider } from "antd";
import clsx from "clsx";

export default function BreadcrumbTrail({
  items,
}: {
  items: { key: string; href: string; label: string }[];
}) {
  const current = items[items.length - 1]?.label || "Dashboard";

  return (
    <div className="flex items-center gap-2 min-w-0">
      <h1
        className="m-0 text-[clamp(14px,2vw,15px)] font-semibold text-neutral-900 dark:text-neutral-50 truncate"
        title={current}
      >
        {current}
      </h1>

      <Divider
        type="vertical"
        className="!h-4 !m-0 !border-neutral-200 dark:!border-neutral-700 hidden sm:inline-block"
      />

      <nav
        aria-label="Breadcrumb"
        className="hidden sm:flex items-center gap-1 text-[12px] text-neutral-500 dark:text-neutral-400 min-w-0"
      >
        <div className="truncate">
          {items.map((b, i) => (
            <React.Fragment key={b.key}>
              <span
                className={clsx(
                  i === items.length - 1 &&
                    "text-neutral-700 dark:text-neutral-300"
                )}
              >
                {b.label}
              </span>
              {i < items.length - 1 && <span className="mx-1">/</span>}
            </React.Fragment>
          ))}
        </div>
      </nav>
    </div>
  );
}
