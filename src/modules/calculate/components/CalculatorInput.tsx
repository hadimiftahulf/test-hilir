"use client";

import React from "react";
import {
  Card,
  Slider,
  InputNumber,
  Typography,
  Divider,
  Button,
  theme,
} from "antd";
import { SaveOutlined } from "@ant-design/icons";
import { toIDR } from "../utils/formatters";

const { Text } = Typography;

interface CalculatorInputProps {
  adSpend: number;
  cpr: number;
  aov: number;
  productPrice: number;
  saving: boolean;
  onAdSpendChange: (value: number) => void;
  onCprChange: (value: number) => void;
  onAovChange: (value: number) => void;
  onProductPriceChange: (value: number) => void;
  onSave: () => void;
  t: any;
}

export default function CalculatorInput({
  adSpend,
  cpr,
  aov,
  productPrice,
  saving,
  onAdSpendChange,
  onCprChange,
  onAovChange,
  onProductPriceChange,
  onSave,
  t,
}: CalculatorInputProps) {
  const { token } = theme.useToken();

  return (
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
            onChange={onAdSpendChange}
            tooltip={{ formatter: (val) => toIDR(val || 0) }}
            trackStyle={{ background: token.colorPrimary }}
          />
          <InputNumber
            style={{ width: "100%" }}
            size="large"
            value={adSpend}
            onChange={(v) => onAdSpendChange(v || 0)}
            formatter={(value) =>
              `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            }
            parser={(value) =>
              value?.replace(/Rp\s?|(\.*)/g, "") as unknown as number
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
            onChange={onCprChange}
            trackStyle={{ background: token.colorWarning }}
          />
          <InputNumber
            style={{ width: "100%" }}
            value={cpr}
            formatter={(value) =>
              `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            }
            parser={(value) =>
              value?.replace(/Rp\s?|(\.*)/g, "") as unknown as number
            }
            onChange={(v) => onCprChange(v || 0)}
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
              onChange={(v) => onAovChange(v || 0)}
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
              onChange={(v) => onProductPriceChange(v || 0)}
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
          onClick={onSave}
        >
          {t("save")}
        </Button>
      </div>
    </Card>
  );
}
