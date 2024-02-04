import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeBossBossid1707050711897 implements MigrationInterface {
    name = 'ChangeBossBossid1707050711897'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`boss\` CHANGE \`bossid\` \`bossNo\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`declaration\` CHANGE \`bossId\` \`bossNo\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`bossId\` \`bossNo\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`report\` CHANGE \`bossNo\` \`bossId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`declaration\` CHANGE \`bossNo\` \`bossId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`boss\` CHANGE \`bossNo\` \`bossid\` int NOT NULL`);
    }

}
