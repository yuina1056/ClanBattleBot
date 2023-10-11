import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLap1695991736813 implements MigrationInterface {
  name = "AddLap1695991736813";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`lap\` (\`id\` int NOT NULL AUTO_INCREMENT, \`clanId\` int NOT NULL, \`eventId\` int NOT NULL, \`boss1Lap\` int NOT NULL DEFAULT '1', \`boss2Lap\` int NOT NULL DEFAULT '1', \`boss3Lap\` int NOT NULL DEFAULT '1', \`boss4Lap\` int NOT NULL DEFAULT '1', \`boss5Lap\` int NOT NULL DEFAULT '1', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(`ALTER TABLE \`clan\` DROP COLUMN \`boss1Lap\``);
    await queryRunner.query(`ALTER TABLE \`clan\` DROP COLUMN \`boss2Lap\``);
    await queryRunner.query(`ALTER TABLE \`clan\` DROP COLUMN \`boss3Lap\``);
    await queryRunner.query(`ALTER TABLE \`clan\` DROP COLUMN \`boss4Lap\``);
    await queryRunner.query(`ALTER TABLE \`clan\` DROP COLUMN \`boss5Lap\``);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`clan\` ADD \`boss5Lap\` int NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`clan\` ADD \`boss4Lap\` int NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`clan\` ADD \`boss3Lap\` int NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`clan\` ADD \`boss2Lap\` int NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(
      `ALTER TABLE \`clan\` ADD \`boss1Lap\` int NOT NULL DEFAULT '1'`,
    );
    await queryRunner.query(`DROP TABLE \`lap\``);
  }
}
