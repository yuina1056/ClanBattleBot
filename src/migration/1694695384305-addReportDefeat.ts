import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReportDefeat1694695384305 implements MigrationInterface {
    name = 'AddReportDefeat1694695384305'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`report\`
            ADD \`isDefeat\` tinyint NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`report\` DROP COLUMN \`isDefeat\`
        `);
    }

}
