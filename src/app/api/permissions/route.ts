import { Permission } from "@/server/db/entities/Permission";
import { createCollectionHandlers } from "@/server/lib/crud-factory";

export const { GET, POST } = createCollectionHandlers<Permission>({
  entity: Permission,
  permissions: {
    read: "roles:read",
    create: "roles:manage",
  },
  scopeField: "user",
});
