import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBossTable1694084007309 implements MigrationInterface {
    name = 'AddBossTable1694084007309'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`boss\` (
                \`bossid\` int NOT NULL AUTO_INCREMENT,
                \`clanId\` int NOT NULL,
                \`discordChannelId\` varchar(255) NOT NULL,
                PRIMARY KEY (\`bossid\`)
            ) ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE \`boss\`
        `);
    }

}
