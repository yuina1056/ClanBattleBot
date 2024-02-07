import { MigrationInterface, QueryRunner } from "typeorm";

export class AddClanEvent1707047616600 implements MigrationInterface {
  name = "AddClanEvent1707047616600";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`clan_event\` (\`id\` int NOT NULL AUTO_INCREMENT, \`clanId\` int NOT NULL, \`eventId\` int NOT NULL, \`boss1Lap\` int NOT NULL DEFAULT '1', \`boss1HP\` int NOT NULL DEFAULT '800', \`boss2Lap\` int NOT NULL DEFAULT '1', \`boss2HP\` int NOT NULL DEFAULT '1000', \`boss3Lap\` int NOT NULL DEFAULT '1', \`boss3HP\` int NOT NULL DEFAULT '1300', \`boss4Lap\` int NOT NULL DEFAULT '1', \`boss4HP\` int NOT NULL DEFAULT '1500', \`boss5Lap\` int NOT NULL DEFAULT '1', \`boss5HP\` int NOT NULL DEFAULT '2000', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`clan_event\` ADD CONSTRAINT \`FK_19e6f6301d54030626bf181c0d9\` FOREIGN KEY (\`clanId\`) REFERENCES \`clan\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`clan_event\` DROP FOREIGN KEY \`FK_19e6f6301d54030626bf181c0d9\``,
    );
    await queryRunner.query(`DROP TABLE \`clan_event\``);
  }
}
