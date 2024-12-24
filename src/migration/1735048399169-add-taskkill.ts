import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTaskkill1735048399169 implements MigrationInterface {
    name = 'AddTaskkill1735048399169'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`task_kill\` (\`id\` int NOT NULL AUTO_INCREMENT, \`eventId\` int NOT NULL, \`clanId\` int NOT NULL, \`userId\` int NOT NULL, \`day\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`task_kill\``);
    }

}
