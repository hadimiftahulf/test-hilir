"use client";

import React from "react";
import { Card, Statistic } from "antd";
import clsx from "clsx";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import Sparkline from "./Sparkline";
import { percentDelta } from "../lib/format";

type Props = {
  title: string;
  value: number | string;
  suffix?: string;
  trend: number[];
  positive?: boolean;
  icon?: React.ReactNode;
};

export default function KpiCard({
  title,
  value,
  suffix,
  trend,
  positive,
  icon,
}: Props) {
  const delta = percentDelta(trend);
  const isUp = positive ?? delta >= 0;

  return (
    <Card
      className="h-full border-neutral-200/70 dark:border-neutral-800 bg-white dark:bg-neutral-900"
      styles={{ body: { padding: 16 } }}
    >
      <div className="flex items-start justify-between">
        <div className="text-neutral-500 dark:text-neutral-400 text-xs">
          {title}
        </div>
        <div className="text-neutral-700 dark:text-neutral-200">{icon}</div>
      </div>
      <div className="mt-1 flex items-end justify-between">
        <Statistic
          value={value}
          suffix={suffix}
          valueStyle={{ fontSize: 24 }}
          className="!mb-0 text-neutral-900 dark:text-neutral-50"
        />
        <div
          className={clsx(
            "px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1",
            isUp
              ? "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-900/30"
              : "text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-900/30"
          )}
        >
          {isUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          {Math.abs(delta)}%
        </div>
      </div>
      <div className="mt-2 text-neutral-500 dark:text-neutral-400">
        <Sparkline points={trend} />
      </div>
    </Card>
  );
}
