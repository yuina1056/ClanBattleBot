import { MigrationInterface, QueryRunner } from "typeorm";

export class AddInitialize1694221451071 implements MigrationInterface {
    name = 'AddInitialize1694221451071'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`report\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`clanId\` int NOT NULL,
                \`userId\` int NOT NULL,
                \`bossId\` int NOT NULL,
                \`lap\` int NOT NULL,
                \`damage\` int NOT NULL,
                \`isCarryOver\` tinyint NOT NULL,
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
                \`discordCategoryId\` varchar(255) NOT NULL,
                \`boss1Lap\` int NOT NULL DEFAULT '0',
                \`boss2Lap\` int NOT NULL DEFAULT '0',
                \`boss3Lap\` int NOT NULL DEFAULT '0',
                \`boss4Lap\` int NOT NULL DEFAULT '0',
                \`boss5Lap\` int NOT NULL DEFAULT '0',
                \`CreatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`UpdatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
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
        await queryRunner.query(`
            CREATE TABLE \`boss\` (
                \`id\` int NOT NULL AUTO_INCREMENT,
                \`bossid\` int NOT NULL,
                \`clanId\` int NOT NULL,
                \`discordChannelId\` varchar(255) NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`report\`
            ADD CONSTRAINT \`FK_e347c56b008c2057c9887e230aa\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`declaration\`
            ADD CONSTRAINT \`FK_9688f3408a93c875e94d3e6d9ed\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD CONSTRAINT \`FK_5601c634625bad156dbfd888831\` FOREIGN KEY (\`clanId\`) REFERENCES \`clan\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_5601c634625bad156dbfd888831\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`declaration\` DROP FOREIGN KEY \`FK_9688f3408a93c875e94d3e6d9ed\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_e347c56b008c2057c9887e230aa\`
        `);
        await queryRunner.query(`
            DROP TABLE \`boss\`
        `);
        await queryRunner.query(`
            DROP TABLE \`user\`
        `);
        await queryRunner.query(`
            DROP TABLE \`declaration\`
        `);
        await queryRunner.query(`
            DROP TABLE \`clan\`
        `);
        await queryRunner.query(`
            DROP TABLE \`report\`
        `);
    }

}
