import { Role } from "@/server/db/entities/Role";
import { createCollectionHandlers } from "@/server/lib/crud-factory";

const handlers = createCollectionHandlers<Role>({
  entity: Role,
  relations: ["permissions"], // Penting: Admin perlu lihat role ini punya izin apa aja
  permissions: {
    read: "roles:read",
    create: "roles:create",
  },
  scopeField: "user",
  beforeSave: async (data) => {
    // Link Permission IDs jika dikirim dari frontend
    // Format input: { name: "Editor", permissionIds: ["uuid1", "uuid2"] }
    if ((data as any).permissionIds) {
      data.permissions = (data as any).permissionIds.map((id: string) => ({
        id,
      }));
    }
    return data;
  },
});

export const { GET, POST } = handlers;
