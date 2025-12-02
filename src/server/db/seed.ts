import "reflect-metadata";
import "dotenv/config";
import AppDataSource from "./datasource.cli";
import { Role } from "./entities/Role";
import { User } from "./entities/User";
import { Permission } from "./entities/Permission";
import bcrypt from "bcryptjs";

type PermAction = "read" | "create" | "update" | "delete" | "manage";
type PermScope = "any" | "own";
const permKey = (r: string, a: PermAction, s: PermScope) => `${r}:${a}:${s}`;

async function main() {
  console.log("⏳ Initializing DataSource...");
  await AppDataSource.initialize();

  // === SAFE TRUNCATE ===
  const qr = AppDataSource.createQueryRunner();
  await qr.connect();
  await qr.startTransaction();
  try {
    await qr.query(`
      TRUNCATE TABLE
        "role_permissions",
        "user_roles",
        "users",
        "roles",
        "permissions"
      RESTART IDENTITY CASCADE;
    `);
    await qr.commitTransaction();
  } catch (e) {
    await qr.rollbackTransaction();
    throw e;
  } finally {
    await qr.release();
  }

  const roleRepo = AppDataSource.getRepository(Role);
  const userRepo = AppDataSource.getRepository(User);
  const permRepo = AppDataSource.getRepository(Permission);

  // === STEP 1: CREATE PERMISSIONS ===
  const resources = ["dashboard", "users", "roles", "calculate"];
  const actions: PermAction[] = [
    "read",
    "create",
    "update",
    "delete",
    "manage",
  ];
  const scopes: PermScope[] = ["any", "own"];

  const perms: Permission[] = [];
  for (const r of resources) {
    for (const a of actions) {
      for (const s of scopes) {
        perms.push(
          permRepo.create({
            resource: r,
            action: a,
            scope: s,
            key: permKey(r, a, s),
            description: `${r} ${a} ${s}`,
          })
        );
      }
    }
  }
  const allPerms = await permRepo.save(perms);
  console.log(`✅ Created ${allPerms.length} permissions`);

  // === STEP 2: ROLES ===
  const adminRole = roleRepo.create({
    name: "Admin",
    description: "Full access to all resources",
    permissions: allPerms,
  });

  const userRole = roleRepo.create({
    name: "User",
    description: "Limited access (dashboard, self)",
  });

  // user role permissions
  const userPermKeys = [
    permKey("dashboard", "read", "any"),
    permKey("calculate", "read", "any"),
    permKey("users", "read", "own"),
    permKey("users", "update", "own"),
  ];
  userRole.permissions = allPerms.filter((p) => userPermKeys.includes(p.key));

  await roleRepo.save([adminRole, userRole]);
  console.log("✅ Roles & permissions created");

  await roleRepo.save([adminRole, userRole]);

  // === STEP 4: USERS ===
  const adminPwd = await bcrypt.hash("Admin123!", 10);
  const userPwd = await bcrypt.hash("User123!", 10);

  const adminUser = userRepo.create({
    email: "admin@example.com",
    name: "Super Admin",
    passwordHash: adminPwd,
    roles: [adminRole],
  });
  const normalUser = userRepo.create({
    email: "user@example.com",
    name: "Regular User",
    passwordHash: userPwd,
    roles: [userRole],
  });

  await userRepo.save([adminUser, normalUser]);

  console.log("✅ Users seeded");
  console.log("🔐 Login credentials:");
  console.log("   - Admin: admin@example.com / Admin123!");
  console.log("   - User : user@example.com  / User123!");

  await AppDataSource.destroy();
  console.log("🎉 Seeding finished successfully!");
}

main().catch((err) => {
  console.error("❌ Seeder error:", err);
  process.exit(1);
});
