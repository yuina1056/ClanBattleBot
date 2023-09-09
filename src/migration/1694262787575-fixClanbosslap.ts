import { MigrationInterface, QueryRunner } from "typeorm";

export class FixClanbosslap1694262787575 implements MigrationInterface {
    name = 'FixClanbosslap1694262787575'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`clan\` CHANGE \`boss1Lap\` \`boss1Lap\` int NOT NULL DEFAULT '1'
        `);
        await queryRunner.query(`
            ALTER TABLE \`clan\` CHANGE \`boss2Lap\` \`boss2Lap\` int NOT NULL DEFAULT '1'
        `);
        await queryRunner.query(`
            ALTER TABLE \`clan\` CHANGE \`boss3Lap\` \`boss3Lap\` int NOT NULL DEFAULT '1'
        `);
        await queryRunner.query(`
            ALTER TABLE \`clan\` CHANGE \`boss4Lap\` \`boss4Lap\` int NOT NULL DEFAULT '1'
        `);
        await queryRunner.query(`
            ALTER TABLE \`clan\` CHANGE \`boss5Lap\` \`boss5Lap\` int NOT NULL DEFAULT '1'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`clan\` CHANGE \`boss5Lap\` \`boss5Lap\` int NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE \`clan\` CHANGE \`boss4Lap\` \`boss4Lap\` int NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE \`clan\` CHANGE \`boss3Lap\` \`boss3Lap\` int NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE \`clan\` CHANGE \`boss2Lap\` \`boss2Lap\` int NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE \`clan\` CHANGE \`boss1Lap\` \`boss1Lap\` int NOT NULL DEFAULT '0'
        `);
    }

}
