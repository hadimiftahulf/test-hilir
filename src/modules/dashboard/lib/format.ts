export function percentDelta(points: number[] | undefined | null): number {
  // 👇 PERBAIKAN UTAMA: Cek apakah 'points' ada dan memiliki panjang
  // Error Anda ada di sini: points.length crash jika points null/undefined
  if (!points || !points.length) return 0;

  const first = points[0];
  const last = points[points.length - 1];

  if (first === 0) return 0;

  // Asumsi logika perhitungan yang sebenarnya
  return ((last - first) / first) * 100;
}
