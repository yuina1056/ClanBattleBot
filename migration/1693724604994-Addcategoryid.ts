import { MigrationInterface, QueryRunner } from "typeorm";

export class Addcategoryid1693724604994 implements MigrationInterface {
    name = 'Addcategoryid1693724604994'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`clan\`
            ADD \`discordCategoryId\` varchar(255) NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`clan\` DROP COLUMN \`discordCategoryId\`
        `);
    }

}
