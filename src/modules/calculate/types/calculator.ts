export type AiResponse = {
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

export interface CalculationHistory {
  id: string;
  adSpend: number;
  costPerResult: number;
  averageOrderValue: number;
  productPrice: number;
}

export interface CalculatorProps {
  onSaveSuccess: () => void;
  selectedHistory: CalculationHistory | null;
}

export interface CalculatorStats {
  results: number;
  revenue: number;
  profit: number;
  roi: number;
  marginPerResult: number;
  cprTarget: number;
}
