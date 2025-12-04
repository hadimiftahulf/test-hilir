import { Calculation } from "@/server/db/entities/Calculation";
import { createItemHandlers } from "@/server/lib/crud-factory";

export const { GET, PUT, DELETE } = createItemHandlers<Calculation>({
  entity: Calculation,
  permissions: {
    read: "calculate:read:own",
    update: "calculate:create:own",
    delete: "calculate:delete:own",
  },
  scopeField: "user",
});
