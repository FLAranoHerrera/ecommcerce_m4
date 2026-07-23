import { MigrationInterface, QueryRunner } from 'typeorm';

export class BaselineLegacySchema1784759300000 implements MigrationInterface {
  name = 'BaselineLegacySchema1784759300000';

  async up(queryRunner: QueryRunner): Promise<void> {
    const hasLegacySchema =
      (await queryRunner.hasTable('users')) &&
      (await queryRunner.hasTable('products')) &&
      (await queryRunner.hasTable('orders')) &&
      (await queryRunner.hasTable('order_details')) &&
      (await queryRunner.hasColumn('orders', 'orderDetailId'));

    if (!hasLegacySchema) {
      return;
    }

    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await queryRunner.query(
      'ALTER TABLE "users" ALTER COLUMN "phone" TYPE character varying USING "phone"::text',
    );
    await queryRunner.query(
      'ALTER TABLE "order_details" ADD COLUMN IF NOT EXISTS "orderId" uuid',
    );
    await queryRunner.query(`
      UPDATE "order_details" AS detail
      SET "orderId" = orders."id"
      FROM "orders" AS orders
      WHERE orders."orderDetailId" = detail."id"
        AND detail."orderId" IS NULL
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "order_items" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "quantity" integer NOT NULL,
        "unitPrice" numeric(10,2) NOT NULL,
        "subtotal" numeric(10,2) NOT NULL,
        "orderDetailId" uuid NOT NULL,
        "productId" uuid NOT NULL,
        CONSTRAINT "PK_order_items" PRIMARY KEY ("id"),
        CONSTRAINT "FK_order_items_detail" FOREIGN KEY ("orderDetailId")
          REFERENCES "order_details"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_order_items_product" FOREIGN KEY ("productId")
          REFERENCES "products"("id") ON DELETE RESTRICT
      )
    `);

    if (await queryRunner.hasTable('products_order_details_order_details')) {
      await queryRunner.query(`
        INSERT INTO "order_items" (
          "quantity",
          "unitPrice",
          "subtotal",
          "orderDetailId",
          "productId"
        )
        SELECT
          1,
          product."price",
          product."price",
          legacy."orderDetailsId",
          legacy."productsId"
        FROM "products_order_details_order_details" AS legacy
        INNER JOIN "products" AS product
          ON product."id" = legacy."productsId"
        WHERE NOT EXISTS (
          SELECT 1
          FROM "order_items" AS item
          WHERE item."orderDetailId" = legacy."orderDetailsId"
            AND item."productId" = legacy."productsId"
        )
      `);
      await queryRunner.query(
        'DROP TABLE "products_order_details_order_details"',
      );
    }

    await queryRunner.query(
      'ALTER TABLE "orders" DROP COLUMN "orderDetailId" CASCADE',
    );
    await queryRunner.query(`
      ALTER TABLE "order_details"
      ADD CONSTRAINT "UQ_order_details_order" UNIQUE ("orderId")
    `);
    await queryRunner.query(`
      ALTER TABLE "order_details"
      ADD CONSTRAINT "FK_order_details_order" FOREIGN KEY ("orderId")
        REFERENCES "orders"("id") ON DELETE CASCADE
    `);
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM "order_details" WHERE "orderId" IS NULL
        ) THEN
          ALTER TABLE "order_details" ALTER COLUMN "orderId" SET NOT NULL;
        END IF;
      END
      $$
    `);
    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS "IDX_orders_user" ON "orders" ("userId")',
    );
    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS "IDX_products_category" ON "products" ("categoryId")',
    );
    await queryRunner.query(
      'CREATE INDEX IF NOT EXISTS "IDX_order_items_detail" ON "order_items" ("orderDetailId")',
    );
  }

  down(): Promise<void> {
    return Promise.reject(
      new Error(
        'La adaptación del esquema heredado no se revierte automáticamente para evitar pérdida de datos.',
      ),
    );
  }
}
