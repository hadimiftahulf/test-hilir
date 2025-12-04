"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Slider,
  InputNumber,
  Typography,
  Statistic,
  Divider,
  Button,
  message,
  Spin,
  Tag,
  Progress,
  theme,
} from "antd";
import {
  RobotOutlined,
  SaveOutlined,
  RiseOutlined,
  FallOutlined,
  CheckCircleFilled,
  WarningFilled,
  FireFilled,
  ThunderboltFilled,
} from "@ant-design/icons";
import { useTranslations } from "next-intl";

const { Title, Text, Paragraph } = Typography;

type AiResponse = {
  health_score: number;
  risk_level: "Low" | "Medium" | "High";
  status_title: string;
  executive_summary: string;
  action_plan: {
    type: string;
    title: string;
    description: string;
  }[];
};

interface CalculationHistory {
  id: string;
  adSpend: number;
  costPerResult: number;
  averageOrderValue: number;
  productPrice: number;
}

interface CalculatorProps {
  onSaveSuccess: () => void;
  selectedHistory: CalculationHistory | null;
}

export default function Calculator({
  onSaveSuccess,
  selectedHistory,
}: CalculatorProps) {
  const t = useTranslations("calculate");
  const { token } = theme.useToken();
  const [messageApi, contextHolder] = message.useMessage();

  const [adSpend, setAdSpend] = useState(1500000);
  const [cpr, setCpr] = useState(235000);
  const [aov, setAov] = useState(100000);
  const [productPrice, setProductPrice] = useState(50000);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AiResponse | null>(null);
  const [saving, setSaving] = useState(false);

  const stats = useMemo(() => {
    const results = cpr > 0 ? adSpend / cpr : 0;
    const revenue = results * aov;
    const profit = revenue - adSpend;
    const roi = adSpend > 0 ? (profit / adSpend) * 100 : 0;

    const marginPerResult = aov - cpr;

    const cprTarget = productPrice * 0.3;

    return {
      results: Math.floor(results),
      revenue,
      profit,
      roi,
      marginPerResult,
      cprTarget,
    };
  }, [adSpend, cpr, aov, productPrice]);

  useEffect(() => {
    if (selectedHistory) {
      setAdSpend(Math.round(selectedHistory.adSpend || 0));
      setCpr(Math.round(selectedHistory.costPerResult || 0));
      setAov(Math.round(selectedHistory.averageOrderValue || 0));
      setProductPrice(Math.round(selectedHistory.productPrice || 0));
      setAiResult(null);
    }
  }, [selectedHistory]);

  const toIDR = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);

  const handleAnalyzeAI = async () => {
    setAiLoading(true);
    setAiResult(null);
    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adSpend,
          cpr,
          aov,
          roi: stats.roi,
          profit: stats.profit,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || t("aiError"));
      setAiResult(json.data);
    } catch (err) {
      messageApi.error(t("aiError"));
    } finally {
      setAiLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adSpend,
          costPerResult: cpr,
          averageOrderValue: aov,
          productPrice,
        }),
      });
      messageApi.success(t("saveSuccess"));
      onSaveSuccess();
    } catch (err) {
      messageApi.error(t("saveError"));
    } finally {
      setSaving(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case "High":
        return "#ff4d4f";
      case "Medium":
        return "#faad14";
      default:
        return "#52c41a";
    }
  };

  return (
    <Row gutter={[24, 24]}>
      {contextHolder}

      <Col xs={24} lg={9} xl={8}>
        <Card
          title={<span className="font-semibold text-lg">{t("title")}</span>}
          className="h-full shadow-sm rounded-2xl border-neutral-200 dark:border-neutral-800"
          styles={{ body: { padding: 24 } }}
        >
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex justify-between mb-1">
                <Text
                  type="secondary"
                  className="text-xs font-medium uppercase tracking-wide"
                >
                  {t("adSpend")}
                </Text>
              </div>
              <Slider
                min={100000}
                max={50000000}
                step={100000}
                value={adSpend}
                onChange={setAdSpend}
                tooltip={{ formatter: (val) => toIDR(val || 0) }}
                trackStyle={{ background: token.colorPrimary }}
              />
              <InputNumber
                style={{ width: "100%" }}
                size="large"
                value={adSpend}
                onChange={(v) => setAdSpend(v || 0)}
                formatter={(value) =>
                  `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }
                parser={(value) =>
                  value?.replace(/Rp\s?|\./g, "") as unknown as number
                }
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <Text
                  type="secondary"
                  className="text-xs font-medium uppercase tracking-wide"
                >
                  {t("cpr")}
                </Text>
              </div>
              <Slider
                min={1000}
                max={1000000}
                step={1000}
                value={cpr}
                onChange={setCpr}
                trackStyle={{ background: token.colorWarning }}
              />
              <InputNumber
                style={{ width: "100%" }}
                value={cpr}
                formatter={(value) =>
                  `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }
                parser={(value) =>
                  value?.replace(/Rp\s?|\./g, "") as unknown as number
                }
                onChange={(v) => setCpr(v || 0)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text
                  type="secondary"
                  className="text-xs font-medium uppercase tracking-wide block mb-2"
                >
                  {t("aov")}
                </Text>
                <InputNumber
                  style={{ width: "100%" }}
                  size="large"
                  value={aov}
                  onChange={(v) => setAov(v || 0)}
                  formatter={(value) =>
                    `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                  }
                  parser={(value) =>
                    value?.replace(/Rp\s?|(\.*)/g, "") as unknown as number
                  }
                />
              </div>
              <div>
                <Text
                  type="secondary"
                  className="text-xs font-medium uppercase tracking-wide block mb-2"
                >
                  {t("productPrice")}
                </Text>
                <InputNumber
                  style={{ width: "100%" }}
                  size="large"
                  value={productPrice}
                  onChange={(v) => setProductPrice(v || 0)}
                  formatter={(value) =>
                    `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                  }
                  parser={(value) =>
                    value?.replace(/Rp\s?|(\.*)/g, "") as unknown as number
                  }
                />
              </div>
            </div>

            <Divider className="my-2" />

            <Button
              type="primary"
              block
              size="large"
              icon={<SaveOutlined />}
              loading={saving}
              onClick={handleSave}
            >
              {t("save")}
            </Button>
          </div>
        </Card>
      </Col>

      <Col xs={24} lg={15} xl={16}>
        <div className="flex flex-col gap-6 h-full">
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
                    Biarkan AI menganalisis performa kampanye Anda dan
                    memberikan strategi optimasi.
                  </p>
                  <Button
                    type="primary"
                    shape="round"
                    icon={<RobotOutlined />}
                    onClick={handleAnalyzeAI}
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
                      onClick={() => setAiResult(null)}
                      className="text-neutral-400 hover:text-neutral-600"
                    >
                      Reset Analisis
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </Col>
    </Row>
  );
}
