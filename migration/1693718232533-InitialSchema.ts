import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1693718232533 implements MigrationInterface {
    name = 'InitialSchema1693718232533'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`report\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`clanId\` int NOT NULL,
                \`userId\` int NOT NULL,
                \`bossId\` int NOT NULL,
                \`damage\` int NOT NULL,
                \`isShaved\` tinyint NOT NULL,
                \`CreatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`UpdatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`clan\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`name\` varchar(255) NOT NULL,
                \`discordRoleId\` varchar(255) NOT NULL,
                \`CreatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`UpdatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`user\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`clanId\` int NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`discordUserId\` varchar(255) NOT NULL,
                \`CreatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`UpdatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE \`user\`
        `);
        await queryRunner.query(`
            DROP TABLE \`clan\`
        `);
        await queryRunner.query(`
            DROP TABLE \`report\`
        `);
    }

}
