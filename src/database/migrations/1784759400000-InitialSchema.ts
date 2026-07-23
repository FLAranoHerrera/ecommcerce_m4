import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1784759400000 implements MigrationInterface {
  name = 'InitialSchema1784759400000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(50) NOT NULL,
        CONSTRAINT "UQ_categories_name" UNIQUE ("name"),
        CONSTRAINT "PK_categories" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(50) NOT NULL,
        "birthday" date,
        "email" character varying(50) NOT NULL,
        "password" character varying(100) NOT NULL,
        "phone" character varying,
        "country" character varying(50),
        "address" character varying(50),
        "city" character varying(50),
        "admin" boolean NOT NULL DEFAULT false,
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "products" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(50) NOT NULL,
        "description" text NOT NULL,
        "price" numeric(10,2) NOT NULL,
        "stock" integer NOT NULL,
        "imgUrl" character varying NOT NULL DEFAULT 'https://via.placeholder.com/150',
        "categoryId" uuid NOT NULL,
        CONSTRAINT "PK_products" PRIMARY KEY ("id"),
        CONSTRAINT "FK_ff56834e735fa78a15d0cf21926" FOREIGN KEY ("categoryId")
          REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE NO ACTION
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "orders" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "date" TIMESTAMP NOT NULL DEFAULT now(),
        "userId" uuid NOT NULL,
        CONSTRAINT "PK_orders" PRIMARY KEY ("id"),
        CONSTRAINT "FK_151b79a83ba240b0cb31b2302d1" FOREIGN KEY ("userId")
          REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "order_details" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "price" numeric(10,2) NOT NULL,
        "orderId" uuid NOT NULL,
        CONSTRAINT "UQ_order_details_order" UNIQUE ("orderId"),
        CONSTRAINT "PK_order_details" PRIMARY KEY ("id"),
        CONSTRAINT "FK_147bc15de4304f89a93c7eee969" FOREIGN KEY ("orderId")
          REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "order_items" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "quantity" integer NOT NULL,
        "unitPrice" numeric(10,2) NOT NULL,
        "subtotal" numeric(10,2) NOT NULL,
        "orderDetailId" uuid NOT NULL,
        "productId" uuid NOT NULL,
        CONSTRAINT "PK_order_items" PRIMARY KEY ("id"),
        CONSTRAINT "FK_6ffbfa8f42ba058c5d5e3d465cd" FOREIGN KEY ("orderDetailId")
          REFERENCES "order_details"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_cdb99c05982d5191ac8465ac010" FOREIGN KEY ("productId")
          REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE NO ACTION
      )
    `);
    await queryRunner.query(
      'CREATE INDEX "IDX_orders_user" ON "orders" ("userId")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_products_category" ON "products" ("categoryId")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_order_items_detail" ON "order_items" ("orderDetailId")',
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "order_items"');
    await queryRunner.query('DROP TABLE "order_details"');
    await queryRunner.query('DROP TABLE "orders"');
    await queryRunner.query('DROP TABLE "products"');
    await queryRunner.query('DROP TABLE "users"');
    await queryRunner.query('DROP TABLE "categories"');
  }
}
