import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigration1726306707987 implements MigrationInterface {
  name = 'NewMigration1726306707987';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sub_plan\` ADD \`userId\` varchar(36) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sub_plan\` ADD CONSTRAINT \`FK_18aca3db0fc5d71acfd57369090\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sub_plan\` DROP FOREIGN KEY \`FK_18aca3db0fc5d71acfd57369090\``,
    );
    await queryRunner.query(`ALTER TABLE \`sub_plan\` DROP COLUMN \`userId\``);
  }
}
