"use client";

import React from "react";
import { Card, Button, Spin, Tag } from "antd";
import {
  RobotOutlined,
  FireFilled,
  ThunderboltFilled,
  CheckCircleFilled,
  WarningFilled,
} from "@ant-design/icons";
import { AiResponse } from "../types/calculator";
import { getRiskColor } from "../utils/formatters";

interface AIAnalysisCardProps {
  aiLoading: boolean;
  aiResult: AiResponse | null;
  onAnalyze: () => void;
  onReset: () => void;
}

export default function AIAnalysisCard({
  aiLoading,
  aiResult,
  onAnalyze,
  onReset,
}: AIAnalysisCardProps) {
  return (
    <Card
      className="flex-1 shadow-sm rounded-2xl border-neutral-200 dark:border-neutral-800 overflow-hidden relative"
      styles={{
        body: {
          height: "100%",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <RobotOutlined className="text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-bold m-0 leading-tight">
              AI Smart Analysis
            </h3>
            <span className="text-xs text-neutral-400">
              Powered by Gemini 2.0
            </span>
          </div>
        </div>

        {aiResult && (
          <div className="text-right">
            <div className="text-xs text-neutral-400 uppercase font-semibold">
              Health Score
            </div>
            <div
              className="text-2xl font-black"
              style={{
                color: getRiskColor(
                  aiResult.risk_level === "High"
                    ? "High"
                    : aiResult.health_score > 70
                    ? "Low"
                    : "Medium"
                ),
              }}
            >
              {aiResult.health_score}/100
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 relative">
        {!aiResult && !aiLoading && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-neutral-50 dark:bg-neutral-900/50 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-700">
            <ThunderboltFilled className="text-4xl text-neutral-300 mb-3" />
            <h4 className="text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Butuh Pendapat Kedua?
            </h4>
            <p className="text-sm text-neutral-400 mb-6 max-w-xs">
              Biarkan AI menganalisis performa kampanye Anda dan memberikan
              strategi optimasi.
            </p>
            <Button
              type="primary"
              shape="round"
              icon={<RobotOutlined />}
              onClick={onAnalyze}
              size="large"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 border-0 hover:scale-105 transition-transform"
            >
              Minta Analisis Sekarang
            </Button>
          </div>
        )}

        {aiLoading && (
          <div className="h-full flex flex-col items-center justify-center py-12">
            <Spin size="large" />
            <p className="mt-4 text-neutral-500 animate-pulse">
              Sedang menganalisis jutaan kemungkinan...
            </p>
          </div>
        )}

        {aiResult && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <FireFilled className="text-orange-500" />
                <span className="font-bold text-blue-900 dark:text-blue-100">
                  {aiResult.status_title}
                </span>
                <Tag
                  color={getRiskColor(aiResult.risk_level)}
                  className="ml-auto font-bold border-0"
                >
                  RISK: {aiResult.risk_level.toUpperCase()}
                </Tag>
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200 m-0 leading-relaxed">
                &quot;{aiResult.executive_summary}&quot;
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiResult.action_plan?.map((plan, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors bg-white dark:bg-neutral-800"
                >
                  <div className="flex items-center gap-2 mb-2">
                    {plan.type === "Optimization" ? (
                      <CheckCircleFilled className="text-green-500" />
                    ) : (
                      <WarningFilled className="text-amber-500" />
                    )}
                    <span className="font-semibold text-sm">
                      {plan.title}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 m-0 leading-relaxed">
                    {plan.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Button
                type="text"
                onClick={onReset}
                className="text-neutral-400 hover:text-neutral-600"
              >
                Reset Analisis
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}