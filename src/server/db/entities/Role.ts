// src/server/db/entities/Role.ts
import { Entity, Column, ManyToMany, JoinTable } from "typeorm";
import { Base } from "./Base";
import { Permission } from "./Permission";
import { User } from "./User";

@Entity("roles")
export class Role extends Base {
  @Column({ unique: true }) name!: string;
  @Column({ default: "" }) description!: string;

  @ManyToMany(() => Permission)
  @JoinTable({ name: "role_permissions" })
  permissions!: Permission[];

  @ManyToMany(() => User, (u) => u.roles) users!: User[];
}
Object.defineProperty(Role, "name", {
  value: "Role",
  writable: false,
  configurable: false,
});
