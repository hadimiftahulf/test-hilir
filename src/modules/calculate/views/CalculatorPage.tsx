"use client";

import React, { useState, useEffect } from "react";
import { Row, Col, message } from "antd";
import { useTranslations } from "next-intl";
import { useCalculatorStats } from "../hooks/useCalculatorStats";
import { AiResponse, CalculatorProps } from "../types/calculator";
import CalculatorInput from "../components/CalculatorInput";
import StatsCard from "../components/StatsCard";
import AIAnalysisCard from "../components/AIAnalysisCard";

export default function CalculatorPage({
  onSaveSuccess,
  selectedHistory,
}: CalculatorProps) {
  const t = useTranslations("calculate");
  const [messageApi, contextHolder] = message.useMessage();

  const [adSpend, setAdSpend] = useState(1500000);
  const [cpr, setCpr] = useState(235000);
  const [aov, setAov] = useState(100000);
  const [productPrice, setProductPrice] = useState(50000);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AiResponse | null>(null);
  const [saving, setSaving] = useState(false);

  const stats = useCalculatorStats(adSpend, cpr, aov, productPrice);

  useEffect(() => {
    if (selectedHistory) {
      setAdSpend(Math.round(selectedHistory.adSpend || 0));
      setCpr(Math.round(selectedHistory.costPerResult || 0));
      setAov(Math.round(selectedHistory.averageOrderValue || 0));
      setProductPrice(Math.round(selectedHistory.productPrice || 0));
      setAiResult(null);
    }
  }, [selectedHistory]);

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

  return (
    <Row gutter={[24, 24]}>
      {contextHolder}

      <Col xs={24} lg={9} xl={8}>
        <CalculatorInput
          adSpend={adSpend}
          cpr={cpr}
          aov={aov}
          productPrice={productPrice}
          saving={saving}
          onAdSpendChange={setAdSpend}
          onCprChange={setCpr}
          onAovChange={setAov}
          onProductPriceChange={setProductPrice}
          onSave={handleSave}
          t={t}
        />
      </Col>

      <Col xs={24} lg={15} xl={16}>
        <div className="flex flex-col gap-6 h-full">
          <StatsCard stats={stats} t={t} />

          <AIAnalysisCard
            aiLoading={aiLoading}
            aiResult={aiResult}
            onAnalyze={handleAnalyzeAI}
            onReset={() => setAiResult(null)}
          />
        </div>
      </Col>
    </Row>
  );
}
