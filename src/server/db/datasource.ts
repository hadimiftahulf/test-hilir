import "reflect-metadata";
import { DataSource } from "typeorm";

import { User } from "./entities/User";
import { Role } from "./entities/Role";
import { Permission } from "./entities/Permission";
import { Calculation } from "./entities/Calculation";

const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [User, Role, Permission, Calculation],
  migrations: [],
  synchronize: false,
  logging: false,
});
export const initializeDB = async () => {
  if (!AppDataSource.isInitialized) {
    try {
      await AppDataSource.initialize();
      console.log("✅ Database initialized");
    } catch (error) {
      console.error("❌ Error initializing database:", error);
      throw error;
    }
  }
  return AppDataSource;
};
export default AppDataSource;
export { AppDataSource, initializeDB };
