// src/server/db/entities/Permission.ts
import { Entity, Column, Index, Unique } from "typeorm";
import { Base } from "./Base";

export type PermAction = "read" | "create" | "update" | "delete" | "manage";
export type PermScope = "any" | "own";

@Entity("permissions")
@Unique("uq_perm_key", ["key"])
@Unique("uq_perm_tuple", ["resource", "action", "scope"])
export class Permission extends Base {
  @Index() @Column() resource!: string; // contoh: "users", "roles", "reports"
  @Index() @Column({ type: "varchar" }) action!: PermAction;
  @Index() @Column({ type: "varchar" }) scope!: PermScope; // "any" | "own"
  @Column({ default: "" }) description!: string;

  // String unik, mis: "users:read:any"
  @Index() @Column() key!: string;
}
Object.defineProperty(Permission, "name", {
  value: "Permission",
  writable: false,
  configurable: false,
});
