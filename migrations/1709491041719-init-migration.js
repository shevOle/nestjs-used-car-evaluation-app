const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class InitMigration1709491041719 {
  name = 'InitMigration1709491041719';

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "report" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "price" integer NOT NULL, "make" varchar NOT NULL, "model" varchar NOT NULL, "mileage" integer NOT NULL, "year" integer NOT NULL, "lng" integer NOT NULL, "lat" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedByUserId" integer, "status" varchar CHECK( "status" IN ('new','approved','rejected') ) NOT NULL DEFAULT ('new'), "userId" integer)`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL)`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_report" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "price" integer NOT NULL, "make" varchar NOT NULL, "model" varchar NOT NULL, "mileage" integer NOT NULL, "year" integer NOT NULL, "lng" integer NOT NULL, "lat" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedByUserId" integer, "status" varchar CHECK( "status" IN ('new','approved','rejected') ) NOT NULL DEFAULT ('new'), "userId" integer, CONSTRAINT "FK_e347c56b008c2057c9887e230aa" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_report"("id", "price", "make", "model", "mileage", "year", "lng", "lat", "createdAt", "updatedAt", "updatedByUserId", "status", "userId") SELECT "id", "price", "make", "model", "mileage", "year", "lng", "lat", "createdAt", "updatedAt", "updatedByUserId", "status", "userId" FROM "report"`,
    );
    await queryRunner.query(`DROP TABLE "report"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_report" RENAME TO "report"`,
    );
  }

  async down(queryRunner) {
    await queryRunner.query(
      `ALTER TABLE "report" RENAME TO "temporary_report"`,
    );
    await queryRunner.query(
      `CREATE TABLE "report" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "price" integer NOT NULL, "make" varchar NOT NULL, "model" varchar NOT NULL, "mileage" integer NOT NULL, "year" integer NOT NULL, "lng" integer NOT NULL, "lat" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedByUserId" integer, "status" varchar CHECK( "status" IN ('new','approved','rejected') ) NOT NULL DEFAULT ('new'), "userId" integer)`,
    );
    await queryRunner.query(
      `INSERT INTO "report"("id", "price", "make", "model", "mileage", "year", "lng", "lat", "createdAt", "updatedAt", "updatedByUserId", "status", "userId") SELECT "id", "price", "make", "model", "mileage", "year", "lng", "lat", "createdAt", "updatedAt", "updatedByUserId", "status", "userId" FROM "temporary_report"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_report"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "report"`);
  }
};
