import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelation21693723562146 implements MigrationInterface {
    name = 'AddRelation21693723562146'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD CONSTRAINT \`FK_5601c634625bad156dbfd888831\` FOREIGN KEY (\`clanId\`) REFERENCES \`clan\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_5601c634625bad156dbfd888831\`
        `);
    }

}
