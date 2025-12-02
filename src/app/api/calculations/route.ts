import { getToken } from "next-auth/jwt";
import { Calculation } from "@/server/db/entities/Calculation";
import { createCollectionHandlers } from "@/server/lib/crud-factory";

const handlers = createCollectionHandlers<Calculation>({
  entity: Calculation,
  relations: ["user"], // Opsional: jika admin ingin lihat siapa yang hitung
  permissions: {
    read: "calculate:read:own", // User biasa cuma boleh lihat data sendiri (Logic filter ada di factory/wrapper)
    create: "calculate:create:own",
  },
  // 🔥 HOOK PENTING: Assign User ID otomatis
  beforeSave: async (data, req) => {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (token && token.uid) {
      // Hubungkan kalkulasi ini dengan User ID dari token
      data.user = { id: token.uid as string } as any;
    }

    // Hitung otomatis ROI di backend (untuk keamanan data)
    // Asumsi frontend kirim: adSpend, costPerResult, averageOrderValue
    if (data.adSpend && data.costPerResult && data.averageOrderValue) {
      const results = data.adSpend / data.costPerResult;
      data.totalRevenue = results * data.averageOrderValue;
      data.totalProfit = data.totalRevenue - data.adSpend;
      data.roiPercentage = (data.totalProfit / data.adSpend) * 100;

      // (Opsional) set productPrice default jika 0/null
      if (!data.productPrice) data.productPrice = 0;
    }

    return data;
  },
});

export const { GET, POST } = handlers;
