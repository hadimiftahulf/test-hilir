import { Entity, Column, ManyToMany, JoinTable, OneToMany } from "typeorm";
import { Base } from "./Base";
import { Role } from "./Role";
import { Calculation } from "./Calculation";

@Entity("users")
export class User extends Base {
  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  avatarUrl!: string;

  @Column({ select: false })
  passwordHash!: string;

  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable({ name: "user_roles" })
  roles!: Role[];

  @OneToMany(() => Calculation, (calculation) => calculation.user)
  calculations!: Calculation[];
}
Object.defineProperty(User, "name", {
  value: "User",
  writable: false,
  configurable: false,
});
