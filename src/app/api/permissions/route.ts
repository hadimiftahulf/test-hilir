import { Permission } from "@/server/db/entities/Permission";
import { createCollectionHandlers } from "@/server/lib/crud-factory";

// Biasanya permission hanya boleh dibaca, tapi jika Super Admin mau nambah manual:
export const { GET, POST } = createCollectionHandlers<Permission>({
  entity: Permission,
  permissions: {
    read: "roles:read", // Menggunakan izin baca role saja cukup, atau buat spesifik
    create: "roles:manage", // Hanya admin level tinggi
  },
  scopeField: "user",
});
