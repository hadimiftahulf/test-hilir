import { getToken } from "next-auth/jwt";
import { Calculation } from "@/server/db/entities/Calculation";
import { createCollectionHandlers } from "@/server/lib/crud-factory";

const handlers = createCollectionHandlers<Calculation>({
  entity: Calculation,
  relations: ["user"],
  permissions: {
    read: "calculate:read",
    create: "calculate:create",
  },
  scopeField: "user",

  beforeSave: async (data, req) => {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (token && token.uid) {
      data.user = { id: token.uid as string } as any;
    }

    if (data.adSpend && data.costPerResult && data.averageOrderValue) {
      const results = data.adSpend / data.costPerResult;
      data.totalRevenue = results * data.averageOrderValue;
      data.totalProfit = data.totalRevenue - data.adSpend;
      data.roiPercentage = (data.totalProfit / data.adSpend) * 100;

      if (!data.productPrice) data.productPrice = 0;
    }

    return data;
  },
});

export const { GET, POST } = handlers;
