// src/services/permission.service.ts
import { AppDataSource, initializeDB } from "@/server/db/datasource";
import { User } from "@/server/db/entities/User";

export const getUserPermissions = async (userId: string): Promise<string[]> => {
  if (!userId) return [];

  await initializeDB();
  const userRepo = AppDataSource.getRepository(User);

  // 1. Ambil User beserta Roles & Permissions-nya
  const user = await userRepo.findOne({
    where: { id: userId },
    relations: ["roles", "roles.permissions"],
    cache: 60000, // (Opsional) Cache 1 menit agar tidak spam DB
  });

  if (!user) return [];

  // 2. Flatten Permissions menjadi array string unik
  const permissionSet = new Set<string>();
  user.roles.forEach((role) => {
    role.permissions.forEach((p) => {
      permissionSet.add(p.key);
    });
  });

  return Array.from(permissionSet);
};
