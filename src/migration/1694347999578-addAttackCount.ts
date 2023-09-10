import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAttackCount1694347999578 implements MigrationInterface {
    name = 'AddAttackCount1694347999578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`declaration\`
            ADD \`month\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`declaration\`
            ADD \`day\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`declaration\`
            ADD \`attackCount\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`declaration\`
            ADD \`eventMonth\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`report\`
            ADD \`month\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`report\`
            ADD \`day\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`report\`
            ADD \`attackCount\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`report\`
            ADD \`eventMonth\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`declaration\`
            ADD CONSTRAINT \`FK_e1192f21fa9be5e40b798d5a489\` FOREIGN KEY (\`eventMonth\`) REFERENCES \`event\`(\`month\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`report\`
            ADD CONSTRAINT \`FK_a3e19672c803db49cfcf83ae944\` FOREIGN KEY (\`eventMonth\`) REFERENCES \`event\`(\`month\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_a3e19672c803db49cfcf83ae944\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`declaration\` DROP FOREIGN KEY \`FK_e1192f21fa9be5e40b798d5a489\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`report\` DROP COLUMN \`eventMonth\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`report\` DROP COLUMN \`attackCount\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`report\` DROP COLUMN \`day\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`report\` DROP COLUMN \`month\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`declaration\` DROP COLUMN \`eventMonth\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`declaration\` DROP COLUMN \`attackCount\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`declaration\` DROP COLUMN \`day\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`declaration\` DROP COLUMN \`month\`
        `);
    }

}
