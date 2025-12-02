import { Role } from "@/server/db/entities/Role";
import { createItemHandlers } from "@/server/lib/crud-factory";

const handlers = createItemHandlers<Role>({
  entity: Role,
  relations: ["permissions"],
  permissions: {
    read: "roles:read:any",
    update: "roles:update:any",
    delete: "roles:delete:any",
  },
  beforeSave: async (data) => {
    if ((data as any).permissionIds) {
      data.permissions = (data as any).permissionIds.map((id: string) => ({
        id,
      }));
    }
    return data;
  },
});

export const { GET, PUT, DELETE } = handlers;
