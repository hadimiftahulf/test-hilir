"use client";

import React from "react";
import { Card, Row, Col, Tag } from "antd";
import { RiseOutlined, FallOutlined } from "@ant-design/icons";
import { CalculatorStats } from "../types/calculator";
import { toIDR } from "../utils/formatters";

interface StatsCardProps {
  stats: CalculatorStats;
  t: any;
}

export default function StatsCard({ stats, t }: StatsCardProps) {
  return (
    <Card className="shadow-sm rounded-2xl border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <Row gutter={[24, 24]} align="middle">
        <Col
          xs={24}
          md={10}
          className="border-r border-neutral-100 dark:border-neutral-800 pr-6"
        >
          <div className="mb-1 text-neutral-500 font-medium">
            ROI Forecast
          </div>
          <div
            className={`text-5xl font-bold mb-2 ${
              stats.roi >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {stats.roi > 0 && "+"}
            {stats.roi.toFixed(1)}%
          </div>
          <Tag
            icon={stats.roi >= 0 ? <RiseOutlined /> : <FallOutlined />}
            color={stats.roi >= 0 ? "success" : "error"}
            className="px-3 py-1 text-sm rounded-full border-0"
          >
            {stats.roi >= 0 ? "Profitable" : "Loss Potential"}
          </Tag>
        </Col>

        <Col xs={24} md={14}>
          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <div className="text-xs text-neutral-400 uppercase tracking-wide mb-1">
                {t("revenue")}
              </div>
              <div className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">
                {toIDR(stats.revenue)}
              </div>
            </div>
            <div>
              <div className="text-xs text-neutral-400 uppercase tracking-wide mb-1">
                {t("profit")}
              </div>
              <div
                className={`text-xl font-semibold ${
                  stats.profit >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {toIDR(stats.profit)}
              </div>
            </div>
            <div>
              <div className="text-xs text-neutral-400 uppercase tracking-wide mb-1">
                {t("results")}
              </div>
              <div className="text-xl font-semibold">
                {stats.results.toLocaleString()} Sales
              </div>
            </div>
            <div>
              <div className="text-xs text-neutral-400 uppercase tracking-wide mb-1">
                {t("cprTarget")}
              </div>
              <div className="text-xl font-semibold">
                {toIDR(stats.cprTarget)}
              </div>
            </div>
            <div>
              <div className="text-xs text-neutral-400 uppercase tracking-wide mb-1">
                {t("margin")}
              </div>
              <div className="text-xl font-semibold">
                {toIDR(stats.marginPerResult)}
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
}