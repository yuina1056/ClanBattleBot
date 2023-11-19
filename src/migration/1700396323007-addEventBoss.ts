import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEventBoss1700396323007 implements MigrationInterface {
    name = 'AddEventBoss1700396323007'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`event_boss\` (\`id\` int NOT NULL AUTO_INCREMENT, \`clanId\` int NOT NULL, \`eventId\` int NOT NULL, \`boss1HP\` int NOT NULL DEFAULT '800', \`boss2HP\` int NOT NULL DEFAULT '1000', \`boss3HP\` int NOT NULL DEFAULT '1300', \`boss4HP\` int NOT NULL DEFAULT '1500', \`boss5HP\` int NOT NULL DEFAULT '2000', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`event_boss\``);
    }

}
