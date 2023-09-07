import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeclarationTable1694085410405 implements MigrationInterface {
    name = 'AddDeclarationTable1694085410405'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`declaration\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`clanId\` int NOT NULL,
                \`userId\` int NOT NULL,
                \`bossId\` int NOT NULL,
                \`lap\` int NOT NULL,
                \`isFinished\` tinyint NOT NULL,
                \`CreatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`UpdatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`declaration\`
            ADD CONSTRAINT \`FK_9688f3408a93c875e94d3e6d9ed\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`declaration\` DROP FOREIGN KEY \`FK_9688f3408a93c875e94d3e6d9ed\`
        `);
        await queryRunner.query(`
            DROP TABLE \`declaration\`
        `);
    }

}
