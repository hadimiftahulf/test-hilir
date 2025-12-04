import { Entity, Column, ManyToOne } from "typeorm";
import { Base } from "./Base";

import type { User } from "./User";

@Entity("calculations")
export class Calculation extends Base {
  @Column("decimal", { precision: 15, scale: 2 })
  adSpend!: number;

  @Column("decimal", { precision: 15, scale: 2 })
  costPerResult!: number;

  @Column("decimal", { precision: 15, scale: 2 })
  productPrice!: number;

  @Column("decimal", { precision: 15, scale: 2 })
  averageOrderValue!: number;

  @Column("decimal", { precision: 5, scale: 2 })
  roiPercentage!: number;

  @Column("decimal", { precision: 15, scale: 2 })
  totalRevenue!: number;

  @Column("decimal", { precision: 15, scale: 2 })
  totalProfit!: number;

  @ManyToOne("User", "calculations", {
    onDelete: "CASCADE",
  })
  user!: User;
}
Object.defineProperty(Calculation, "name", {
  value: "Calculation",
  writable: false,
  configurable: false,
});
