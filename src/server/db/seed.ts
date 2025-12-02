import "reflect-metadata";
import "dotenv/config";
import AppDataSource from "./datasource.cli"; // Pastikan path ini benar
import { Role } from "./entities/Role";
import { User } from "./entities/User";
import { Permission } from "./entities/Permission";
import bcrypt from "bcryptjs";

// Tipe data untuk konsistensi key
type PermAction = "read" | "create" | "update" | "delete" | "manage";
type PermScope = "any" | "own";

// Helper generate key: "resource:action:scope" -> "users:read:any"
const permKey = (r: string, a: PermAction, s: PermScope) => `${r}:${a}:${s}`;

async function main() {
  console.log("⏳ Initializing DataSource...");

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  // === 1. SAFE TRUNCATE (Bersihkan Data Lama) ===
  const qr = AppDataSource.createQueryRunner();
  await qr.connect();
  await qr.startTransaction();
  try {
    // Hapus tabel secara berurutan agar tidak kena constraint foreign key
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

  // === 2. CREATE PERMISSIONS ===
  console.log("🔨 Creating Permissions...");

  // Resource sesuai Menu Sidebar & Fitur
  const resources = [
    "dashboard", // Untuk menu Dashboard
    "users", // Untuk menu Employees
    "roles", // Untuk menu Roles & Access
    "calculate", // Untuk fitur ROI Calculator
    "settings", // Untuk menu Settings
  ];

  const actions: PermAction[] = [
    "read",
    "create",
    "update",
    "delete",
    "manage",
  ];
  const scopes: PermScope[] = ["any", "own"];

  const perms: Permission[] = [];

  // Generate kombinasi: 5 resources * 5 actions * 2 scopes = 50 permissions
  for (const r of resources) {
    for (const a of actions) {
      for (const s of scopes) {
        perms.push(
          permRepo.create({
            resource: r,
            action: a,
            scope: s,
            key: permKey(r, a, s), // cth: users:create:any
            description: `Allow to ${a} ${r} (${s})`,
          })
        );
      }
    }
  }

  // Simpan batch ke DB
  const allPerms = await permRepo.save(perms);
  console.log(`✅ Created ${allPerms.length} permissions`);

  // === 3. CREATE ROLES ===
  console.log("👑 Creating Roles...");

  // --- A. ROLE ADMIN (Superuser) ---
  // Punya semua permission yang ada
  const adminRole = roleRepo.create({
    name: "Admin",
    description: "Full access to all system resources",
    permissions: allPerms,
  });

  // --- B. ROLE USER (Standard Employee) ---
  // Hanya punya akses terbatas
  const userPermKeys = [
    // Dashboard
    permKey("dashboard", "read", "any"), // Boleh lihat dashboard umum

    // Settings
    permKey("settings", "read", "own"), // Boleh lihat setting sendiri
    permKey("settings", "update", "own"),

    // Calculator ROI (Fitur utama)
    permKey("calculate", "read", "own"), // Lihat history sendiri
    permKey("calculate", "create", "own"), // Buat hitungan baru

    // User Profile (Diri Sendiri)
    permKey("users", "read", "own"), // Lihat profil sendiri
    permKey("users", "update", "own"), // Edit profil sendiri

    // NOTE: User TIDAK punya 'users:read:any' & 'roles:read:any'
    // Akibatnya: Menu "Employees" dan "Roles" akan HILANG di Sidebar user ini.
  ];

  const userRole = roleRepo.create({
    name: "User",
    description: "Limited access (dashboard, self-service)",
    permissions: allPerms.filter((p) => userPermKeys.includes(p.key)),
  });

  // Simpan Roles
  await roleRepo.save([adminRole, userRole]);
  console.log("✅ Roles created");

  // === 4. CREATE USERS ===
  console.log("👤 Creating Users...");

  const adminPwd = await bcrypt.hash("Admin123!", 10);
  const userPwd = await bcrypt.hash("User123!", 10);

  // User 1: Admin
  const adminUser = userRepo.create({
    email: "admin@example.com",
    name: "Admin Dashboard", // Contoh nama admin
    avatarUrl: "https://i.pravatar.cc/150?u=admin",
    passwordHash: adminPwd,
    roles: [adminRole],
  });

  // User 2: Staff Biasa
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
