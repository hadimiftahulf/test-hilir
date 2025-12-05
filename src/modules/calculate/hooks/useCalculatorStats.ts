import { useMemo } from "react";
import { CalculatorStats } from "../types/calculator";

export const useCalculatorStats = (
  adSpend: number,
  cpr: number,
  aov: number,
  productPrice: number
): CalculatorStats => {
  return useMemo(() => {
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
};
