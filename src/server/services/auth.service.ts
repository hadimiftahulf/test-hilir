import { compare } from "bcryptjs";
import { AppDataSource, initializeDB } from "@/server/db/datasource";
import { User } from "@/server/db/entities/User";

export const verifyUserLogin = async (email: string, pass: string) => {
  if (!AppDataSource.isInitialized) await initializeDB();
  const userRepo = AppDataSource.getRepository(User);

  const user = await userRepo
    .createQueryBuilder("user")
    .addSelect("user.passwordHash")
    .leftJoinAndSelect("user.roles", "role")
    .leftJoinAndSelect("role.permissions", "permission")
    .where("user.email = :email", { email })
    .getOne();

  if (!user) return null;

  const isValid = await compare(pass, user.passwordHash);
  if (!isValid) return null;

  const allPermissions = new Set<string>();

  user.roles.forEach((role) => {
    if (role.permissions) {
      role.permissions.forEach((p) => {
        allPermissions.add(p.key);
      });
    }
  });

  const { passwordHash, ...safeUser } = user;

  return {
    ...safeUser,
    permissionKeys: Array.from(allPermissions),
  };
};
