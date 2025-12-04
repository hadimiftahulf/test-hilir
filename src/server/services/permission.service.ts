import { AppDataSource, initializeDB } from "@/server/db/datasource";
import { User } from "@/server/db/entities/User";

export const getUserPermissions = async (userId: string): Promise<string[]> => {
  if (!userId) return [];

  await initializeDB();
  const userRepo = AppDataSource.getRepository(User);

  const user = await userRepo.findOne({
    where: { id: userId },
    relations: ["roles", "roles.permissions"],
    cache: 60000,
  });

  if (!user) return [];

  const permissionSet = new Set<string>();
  user.roles.forEach((role) => {
    role.permissions.forEach((p) => {
      permissionSet.add(p.key);
    });
  });

  return Array.from(permissionSet);
};
