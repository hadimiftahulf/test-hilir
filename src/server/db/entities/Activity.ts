import { Entity, Column, ManyToOne, Index } from "typeorm";
import { Base } from "./Base";
import type { User } from "./User";

@Entity("activities")
export class Activity extends Base {
  @Index()
  @Column()
  entityName!: string;

  @Index()
  @Column()
  entityId!: string;

  @Column()
  action!: string;

  @Column({ nullable: true, type: "jsonb" })
  details: any | null;

  @ManyToOne("User", { nullable: true })
  user!: User | null;
}
