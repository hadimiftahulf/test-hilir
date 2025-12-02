import {
  Entity,
  Column,
  Index,
  ManyToMany,
  JoinTable,
  OneToMany,
} from "typeorm";
import { Base } from "./Base";
import { Role } from "./Role";
import type { Calculation } from "./Calculation";
@Entity("users")
export class User extends Base {
  @Index({ unique: true }) @Column() email!: string;
  @Column() name!: string;
  @Column({ nullable: true }) avatarUrl?: string;
  @Column({ select: false }) passwordHash!: string;
  @ManyToMany(() => Role, (r) => r.users)
  @JoinTable({ name: "user_roles" })
  roles!: Role[];
  @OneToMany("Calculation", (calculation: Calculation) => calculation.user)
  calculations!: Calculation[];
}
