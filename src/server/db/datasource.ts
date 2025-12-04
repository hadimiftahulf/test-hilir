import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Role } from "./entities/Role";
import { Permission } from "./entities/Permission";
import { Calculation } from "./entities/Calculation";
import { ActivitySubscriber } from "./subscribers/ActivitySubscriber";
import { Activity } from "./entities/Activity";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,

  entities: [User, Role, Permission, Calculation, Activity],

  synchronize: false,

  migrations: [__dirname + "/migrations/*.{ts,js}"],
  subscribers: [ActivitySubscriber],
  migrationsRun: false,

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
