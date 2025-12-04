export function percentDelta(points: number[] | undefined | null): number {
  if (!points || !points.length) return 0;

  const first = points[0];
  const last = points[points.length - 1];

  if (first === 0) return 0;

  return ((last - first) / first) * 100;
}
