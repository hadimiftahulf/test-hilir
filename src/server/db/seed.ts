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

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

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
        "permissions",
        "calculations"
      RESTART IDENTITY CASCADE;
    `);
    await qr.commitTransaction();
    console.log("🧹 Database cleaned");
  } catch (e) {
    await qr.rollbackTransaction();
    console.error("⚠️ Failed to truncate (might be empty). Continuing...");
  } finally {
    await qr.release();
  }

  const roleRepo = AppDataSource.getRepository(Role);
  const userRepo = AppDataSource.getRepository(User);
  const permRepo = AppDataSource.getRepository(Permission);

  console.log("🔨 Creating Permissions...");

  const resources = ["dashboard", "users", "roles", "calculate", "settings"];

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
            description: `Allow to ${a} ${r} (${s})`,
          })
        );
      }
    }
  }

  const allPerms = await permRepo.save(perms);
  console.log(`✅ Created ${allPerms.length} permissions`);

  console.log("👑 Creating Roles...");

  const adminRole = roleRepo.create({
    name: "Admin",
    description: "Full access to all system resources",
    permissions: allPerms,
  });

  const userPermKeys = [
    permKey("dashboard", "read", "any"),

    permKey("settings", "read", "own"),
    permKey("settings", "update", "own"),

    permKey("calculate", "read", "own"),
    permKey("calculate", "create", "own"),

    permKey("users", "read", "own"),
    permKey("users", "update", "own"),
  ];

  const userRole = roleRepo.create({
    name: "User",
    description: "Limited access (dashboard, self-service)",
    permissions: allPerms.filter((p) => userPermKeys.includes(p.key)),
  });

  await roleRepo.save([adminRole, userRole]);
  console.log("✅ Roles created");

  console.log("👤 Creating Users...");

  const adminPwd = await bcrypt.hash("Admin123!", 10);
  const userPwd = await bcrypt.hash("User123!", 10);

  const adminUser = userRepo.create({
    email: "admin@example.com",
    name: "Admin Dashboard",
    avatarUrl: "https://i.pravatar.cc/150?u=admin",
    passwordHash: adminPwd,
    roles: [adminRole],
  });

  const normalUser = userRepo.create({
    email: "user@example.com",
    name: "Users Tester",
    avatarUrl: "https://i.pravatar.cc/150?u=rina",
    passwordHash: userPwd,
    roles: [userRole],
  });

  await userRepo.save([adminUser, normalUser]);

  console.log("✅ Users seeded successfully!");
  console.log("------------------------------------------------");
  console.log("🔐 Login Credentials:");
  console.log("   [Admin] admin@example.com / Admin123!");
  console.log("           -> Access: All Menus (Dashboard, Employees, Roles)");
  console.log("   [User]  user@example.com  / User123!");
  console.log("           -> Access: Dashboard Only");
  console.log("------------------------------------------------");

  await AppDataSource.destroy();
}

main().catch((err) => {
  console.error("❌ Seeder error:", err);
  process.exit(1);
});
