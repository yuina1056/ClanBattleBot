import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1693718566631 implements MigrationInterface {
    name = 'InitialSchema1693718566631'

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
