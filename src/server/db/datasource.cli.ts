import "reflect-metadata";
import "dotenv/config";
import { DataSource } from "typeorm";
import { URL } from "url";
import path from "path";

const raw = process.env.DATABASE_URL_CLI || process.env.DATABASE_URL || "";
if (!raw) throw new Error("Missing DATABASE_URL(_CLI)");

const u = new URL(raw);
if (u.hostname === "db") u.hostname = "localhost"; // aman untuk run dari host

export default new DataSource({
  type: "postgres",
  url: u.toString(),
  entities: [path.join(__dirname, "entities/*.{ts,js}")],
  migrations: [path.join(__dirname, "migrations/*.{ts,js}")],
  synchronize: false,
  logging: false,
});
