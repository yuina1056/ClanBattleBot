import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReportLap1693718602136 implements MigrationInterface {
    name = 'AddReportLap1693718602136'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`report\`
            ADD \`lap\` int NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`report\` DROP COLUMN \`lap\`
        `);
    }

}
