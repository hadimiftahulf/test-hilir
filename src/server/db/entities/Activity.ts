import { Entity, Column, ManyToOne, Index } from "typeorm";
import { Base } from "./Base";
import type { User } from "./User"; // Import type untuk relasi

@Entity("activities")
export class Activity extends Base {
  @Index()
  @Column()
  entityName!: string; // Contoh: 'User', 'Role', 'Calculation'

  @Index()
  @Column()
  entityId!: string; // ID dari record yang dimodifikasi

  @Column()
  action!: string; // 'CREATE', 'UPDATE', 'DELETE'

  @Column({ nullable: true, type: "jsonb" }) // JSON field untuk detail perubahan
  details: any | null;

  // Relasi ke User yang melakukan aksi (opsional jika dari sistem)
  @ManyToOne("User", { nullable: true })
  user!: User | null;
}
