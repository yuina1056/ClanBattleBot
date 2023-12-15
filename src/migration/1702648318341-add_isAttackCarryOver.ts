import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsAttackCarryOver1702648318341 implements MigrationInterface {
    name = 'AddIsAttackCarryOver1702648318341'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`declaration\` ADD \`isAttackCarryOver\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`report\` ADD \`isAttackCarryOver\` tinyint NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`report\` DROP COLUMN \`isAttackCarryOver\``);
        await queryRunner.query(`ALTER TABLE \`declaration\` DROP COLUMN \`isAttackCarryOver\``);
    }

}
