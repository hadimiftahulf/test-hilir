"use client";

import React, { useState, useEffect } from "react";
import { message } from "antd";
import TableCaclulator from "@/modules/calculate/views/TableCaclulator";
import CalculatorPage from "@/modules/calculate/views/CalculatorPage";

interface CalculationHistory {
  id: string;
  adSpend: number;
  costPerResult: number;
  averageOrderValue: number;
  productPrice: number;
}

export default function CalculatePage() {
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCalc, setSelectedCalc] = useState<CalculationHistory | null>(
    null
  );

  const [messageApi, contextHolder] = message.useMessage();

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/calculations");
      if (!res.ok) throw new Error("Failed to fetch history");
      const json = await res.json();
      setHistory(json.data || []);
    } catch (e) {
      console.error("Fetch History Error:", e);

      messageApi.error("Gagal memuat riwayat perhitungan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-8">
      {contextHolder}

      <CalculatorPage
        onSaveSuccess={fetchHistory}
        selectedHistory={selectedCalc}
      />

      <TableCaclulator
        loading={loading}
        history={history}
        setSelectedCalc={setSelectedCalc}
      />
    </div>
  );
}
