import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeReportisDefeated1693857165296 implements MigrationInterface {
    name = 'ChangeReportisDefeated1693857165296'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`report\` CHANGE \`isShaved\` \`isDefeated\` tinyint NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`report\` CHANGE \`isDefeated\` \`isShaved\` tinyint NOT NULL
        `);
    }

}
