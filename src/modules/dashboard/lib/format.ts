export function percentDelta(points: number[]) {
  if (!points.length) return 0;
  const first = points[0];
  const last = points[points.length - 1];
  if (first === 0) return 0;
  return Math.round(((last - first) / Math.abs(first)) * 100);
}
