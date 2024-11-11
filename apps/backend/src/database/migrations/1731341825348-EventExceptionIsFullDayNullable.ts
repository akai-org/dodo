import { MigrationInterface, QueryRunner } from "typeorm";

export class EventExceptionIsFullDayNullable1731341825348 implements MigrationInterface {
    name = 'EventExceptionIsFullDayNullable1731341825348'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`event_exception\` CHANGE \`is_full_day\` \`is_full_day\` tinyint NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`event_exception\` CHANGE \`is_full_day\` \`is_full_day\` tinyint NOT NULL`);
    }

}
