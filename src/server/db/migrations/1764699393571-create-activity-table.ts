import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateActivityTable1764699393571 implements MigrationInterface {
    name = 'CreateActivityTable1764699393571'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`CREATE TABLE "activities" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "entityName" character varying NOT NULL, "entityId" character varying NOT NULL, "action" character varying NOT NULL, "details" jsonb, "userId" uuid, CONSTRAINT "PK_7f4004429f731ffb9c88eb486a8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9ce2a42327f38e2a2778daad26" ON "activities" ("entityName") `);
        await queryRunner.query(`CREATE INDEX "IDX_8cf773faf57db556752b414e7a" ON "activities" ("entityId") `);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
        await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "FK_5a2cfe6f705df945b20c1b22c71" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "FK_5a2cfe6f705df945b20c1b22c71"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8cf773faf57db556752b414e7a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9ce2a42327f38e2a2778daad26"`);
        await queryRunner.query(`DROP TABLE "activities"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
    }

}
