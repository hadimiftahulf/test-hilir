// src/services/auth.service.ts
import { compare } from "bcryptjs";
import { AppDataSource, initializeDB } from "@/server/db/datasource";
import { User } from "@/server/db/entities/User";

export const verifyUserLogin = async (email: string, pass: string) => {
  if (!AppDataSource.isInitialized) await initializeDB();
  const userRepo = AppDataSource.getRepository(User);

  // 1. Load User + Roles + PERMISSIONS
  const user = await userRepo
    .createQueryBuilder("user")
    .addSelect("user.passwordHash")
    .leftJoinAndSelect("user.roles", "role")
    .leftJoinAndSelect("role.permissions", "permission") // 👈 Ambil permission juga
    .where("user.email = :email", { email })
    .getOne();

  if (!user) return null;

  const isValid = await compare(pass, user.passwordHash);
  if (!isValid) return null;

  // 2. Flatten Permissions (Satukan semua permission dari semua role)
  // Hasil: ["dashboard:read:any", "users:create:own", ...]
  const allPermissions = new Set<string>();

  user.roles.forEach((role) => {
    if (role.permissions) {
      role.permissions.forEach((p) => {
        allPermissions.add(p.key); // Kita simpan 'key'-nya saja agar hemat byte di JWT
      });
    }
  });

  const { passwordHash, ...safeUser } = user;

  // Return user beserta list permission-nya
  return {
    ...safeUser,
    permissionKeys: Array.from(allPermissions), // Konversi Set ke Array
  };
};
