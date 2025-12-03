import { Permission } from "@/server/db/entities/Permission";
import { createItemHandlers } from "@/server/lib/crud-factory";

export const { GET, PUT, DELETE } = createItemHandlers<Permission>({
  entity: Permission,
  permissions: {
    read: "roles:read",
    update: "roles:manage",
    delete: "roles:manage",
  },
  scopeField: "user",
});
