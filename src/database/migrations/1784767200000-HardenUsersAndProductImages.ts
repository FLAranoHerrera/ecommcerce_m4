import { MigrationInterface, QueryRunner } from 'typeorm';

export class HardenUsersAndProductImages1784767200000
  implements MigrationInterface
{
  name = 'HardenUsersAndProductImages1784767200000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "users" ALTER COLUMN "name" TYPE character varying(80)',
    );
    await queryRunner.query(
      'ALTER TABLE "users" ALTER COLUMN "email" TYPE character varying(254)',
    );
    await queryRunner.query(
      'ALTER TABLE "users" ALTER COLUMN "address" TYPE character varying(80)',
    );
    await queryRunner.query('UPDATE "users" SET "email" = LOWER("email")');
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_users_email_lower" ON "users" (LOWER("email"))',
    );
    await queryRunner.query(
      'ALTER TABLE "products" ADD "imagePublicId" character varying',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "products" DROP COLUMN "imagePublicId"',
    );
    await queryRunner.query('DROP INDEX "IDX_users_email_lower"');
    await queryRunner.query(
      'ALTER TABLE "users" ALTER COLUMN "address" TYPE character varying(50)',
    );
    await queryRunner.query(
      'ALTER TABLE "users" ALTER COLUMN "email" TYPE character varying(50)',
    );
    await queryRunner.query(
      'ALTER TABLE "users" ALTER COLUMN "name" TYPE character varying(50)',
    );
  }
}
