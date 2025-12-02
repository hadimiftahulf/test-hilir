import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCalculations1764651460447 implements MigrationInterface {
    name = 'AddCalculations1764651460447'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "calculations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "adSpend" numeric(15,2) NOT NULL, "costPerResult" numeric(15,2) NOT NULL, "productPrice" numeric(15,2) NOT NULL, "averageOrderValue" numeric(15,2) NOT NULL, "roiPercentage" numeric(5,2) NOT NULL, "totalRevenue" numeric(15,2) NOT NULL, "totalProfit" numeric(15,2) NOT NULL, "userId" uuid, CONSTRAINT "PK_a57a12855a44935db91c2533b71" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "calculations" ADD CONSTRAINT "FK_f9feb493b493b6694c16c048143" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "calculations" DROP CONSTRAINT "FK_f9feb493b493b6694c16c048143"`);
        await queryRunner.query(`DROP TABLE "calculations"`);
    }

}
