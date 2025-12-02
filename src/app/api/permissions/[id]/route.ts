import { Permission } from "@/server/db/entities/Permission";
import { createItemHandlers } from "@/server/lib/crud-factory";

export const { GET, PUT, DELETE } = createItemHandlers<Permission>({
  entity: Permission,
  permissions: {
    read: "roles:read:any",
    update: "roles:manage:any",
    delete: "roles:manage:any",
  },
});
