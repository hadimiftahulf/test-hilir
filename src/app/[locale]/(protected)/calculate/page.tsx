"use client";

import React, { useState, useEffect } from "react";
import { Table, Tag, Typography } from "antd";
import Calculator from "@/modules/calculate/components/Calculator";

export default function CalculatePage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch History
  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/calculations");
      const json = await res.json();
      setHistory(json.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Columns untuk Tabel History
  const columns = [
    {
      title: "Tanggal",
      dataIndex: "createdAt",
      render: (v: string) => new Date(v).toLocaleDateString(),
    },
    {
      title: "Ad Spend",
      dataIndex: "adSpend",
      render: (v: string | number) => {
        const num = parseFloat(String(v));
        if (isNaN(num)) return "-";
        return `Rp ${num.toLocaleString()}`;
      },
    },
    {
      title: "ROI",
      dataIndex: "roiPercentage",
      render: (v: string | number) => {
        // 1. Konversi ke string (jika bukan string/angka) lalu ke float
        const roiValue = parseFloat(String(v));

        // 2. Pengecekan Aman: Jika NaN/null, default ke 0
        const safeRoi = isNaN(roiValue) ? 0 : roiValue;

        return (
          <Tag color={safeRoi >= 0 ? "green" : "red"}>
            {safeRoi.toFixed(2)}%
          </Tag>
        );
      },
    },
    {
      title: "Profit",
      dataIndex: "totalProfit",
      render: (v: string | number) => {
        const profitValue = parseFloat(String(v));
        const safeProfit = isNaN(profitValue) ? 0 : profitValue;

        return (
          <span className={safeProfit >= 0 ? "text-green-600" : "text-red-600"}>
            Rp{" "}
            {safeProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
        );
      },
    },
  ];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-8">
      {/* 1. Header */}
      <div>
        <Typography.Title level={2}>ROI Calculator</Typography.Title>
        <p className="text-neutral-500">
          Hitung profitabilitas kampanye dan dapatkan saran AI.
        </p>
      </div>

      {/* 2. Calculator Core */}
      <Calculator onSaveSuccess={fetchHistory} />

      {/* 3. History Log */}
      <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800">
        <Typography.Title level={4} className="mb-4">
          Riwayat Perhitungan
        </Typography.Title>
        <Table
          dataSource={history}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </div>
    </div>
  );
}
