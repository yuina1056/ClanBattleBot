import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserDeletedAt1695383849900 implements MigrationInterface {
    name = 'AddUserDeletedAt1695383849900'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`DeletedAt\` datetime(6) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`DeletedAt\`
        `);
    }

}
