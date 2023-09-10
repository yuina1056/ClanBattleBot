import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTableEvent1694320130346 implements MigrationInterface {
    name = 'AddTableEvent1694320130346'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`event\` (
                \`month\` varchar(255) NOT NULL,
                \`fromDate\` datetime NOT NULL,
                \`toDate\` datetime NOT NULL,
                PRIMARY KEY (\`month\`)
            ) ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE \`event\`
        `);
    }

}
