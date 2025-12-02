import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Role } from "./entities/Role";
import { Permission } from "./entities/Permission";
import { Calculation } from "./entities/Calculation";

// ✅ PENTING: Di production, JANGAN pakai path-based entities
// Selalu import langsung entities sebagai class reference
export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,

  // ✅ Import langsung entities (BUKAN path string)
  entities: [User, Role, Permission, Calculation],

  // ✅ CRITICAL: Di production HARUS false!
  synchronize: false,

  // ✅ Untuk production, pakai migrations
  migrations: [__dirname + "/migrations/*.{ts,js}"],
  migrationsRun: false, // Jalankan manual dengan CLI

  logging: process.env.NODE_ENV === "development",
});

let isInitialized = false;

export const initializeDB = async () => {
  if (!isInitialized && !AppDataSource.isInitialized) {
    try {
      await AppDataSource.initialize();
      isInitialized = true;
      console.log("✅ Database connected");
    } catch (error) {
      console.error("❌ Database connection failed:", error);
      throw error;
    }
  }
  return AppDataSource;
};
