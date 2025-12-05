export const toIDR = (val: number): string =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(val);

export const getRiskColor = (level: string): string => {
  switch (level) {
    case "High":
      return "#ff4d4f";
    case "Medium":
      return "#faad14";
    default:
      return "#52c41a";
  }
};
