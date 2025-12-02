"use client";

import React, { useState, useEffect } from "react";
import { Table, Tag, Typography, message, TableProps, Modal } from "antd"; // Import Modal untuk useModal
import Calculator from "@/modules/calculate/components/Calculator";
import dayjs from "dayjs";

// --- Tipe data (Wajib sync dengan Calculator.tsx) ---
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

  // 👇 1. SETUP HOOKS CONTEXT-AWARE
  const [messageApi, contextHolder] = message.useMessage();

  // --- LOGIC FETCH HISTORY (Tidak Berubah) ---
  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/calculations");
      if (!res.ok) throw new Error("Failed to fetch history");
      const json = await res.json();
      setHistory(json.data || []);
    } catch (e) {
      console.error("Fetch History Error:", e);
      // Gunakan messageApi di sini juga jika error
      messageApi.error("Gagal memuat riwayat perhitungan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // --- LOGIC ROW CLICK ---
  const handleHistorySelect = (record: CalculationHistory) => {
    setSelectedCalc(record);
    // 👇 2. GUNAKAN INSTANCE: messageApi.info
    messageApi.info(
      `Data loaded for calculation ID: ${record.id.slice(0, 4)}...`
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Helper untuk konversi data desimal dari DB (string) ke float
  const safeParseFloat = (v: string | number) => {
    const floatVal = parseFloat(String(v));
    return isNaN(floatVal) ? 0 : floatVal;
  };

  // --- DEFINISI KOLOM TABEL ---
  const columns: TableProps<CalculationHistory>["columns"] = [
    {
      title: "Tanggal",
      dataIndex: "createdAt",
      width: 150,
      render: (v: string) => dayjs(v).format("DD MMM YYYY"),
    },
    // ... (Kolom lainnya tetap sama, menggunakan safeParseFloat) ...
    {
      title: "Ad Spend",
      dataIndex: "adSpend",
      render: (v: string | number) =>
        `Rp ${safeParseFloat(v).toLocaleString(undefined, {
          maximumFractionDigits: 0,
        })}`,
    },
    {
      title: "ROI",
      dataIndex: "roiPercentage",
      width: 120,
      render: (v: string | number) => {
        const safeRoi = safeParseFloat(v);
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
      width: 150,
      render: (v: string | number) => {
        const safeProfit = safeParseFloat(v);
        return (
          <span className={safeProfit >= 0 ? "text-green-600" : "text-red-600"}>
            Rp{" "}
            {safeProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
        );
      },
    },
    {
      title: "Details",
      key: "details",
      render: () => <span className="text-blue-500 cursor-pointer">View</span>,
    },
  ];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-8">
      {/* 👇 3. RENDER CONTEXT HOLDER DI SINI */}
      {contextHolder}

      {/* 1. Calculator Core */}
      <Calculator onSaveSuccess={fetchHistory} selectedHistory={selectedCalc} />

      {/* 2. History Log */}
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
          onRow={(record) => ({
            onClick: () => handleHistorySelect(record as CalculationHistory),
            className:
              "cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors",
          })}
        />
      </div>
    </div>
  );
}
