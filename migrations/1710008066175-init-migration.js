const { promisify } = require('util');
const { scrypt } = require('crypto');
const dotenv = require('@nestjs/config/node_modules/dotenv');
const {
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
  DEFAULT_USER_EMAIL,
  DEFAULT_USER_PASSWORD,
} = require('../src/common/constants/test.constants');

const cryptFunction = promisify(scrypt);
dotenv.config();

module.exports = class InitMigration1710008066175 {
  async up(queryRunner) {
    const { SECRET } = process.env;

    const hashedAdminPassword = (
      await cryptFunction(DEFAULT_ADMIN_PASSWORD, SECRET, 24)
    ).toString('hex');
    const hashedUserPassword = (
      await cryptFunction(DEFAULT_USER_PASSWORD, SECRET, 24)
    ).toString('hex');

    await queryRunner.query(
      `CREATE TABLE "user" 
      ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "isAdmin" boolean NOT NULL DEFAULT (0))`,
    );

    await queryRunner.query(
      `INSERT INTO "user" 
      ("id", "email", "password", "isAdmin") VALUES ("1", "${DEFAULT_ADMIN_EMAIL}", "${hashedAdminPassword}", "TRUE"), ("2", "${DEFAULT_USER_EMAIL}", "${hashedUserPassword}", "FALSE")`,
    );

    await queryRunner.query(
      `CREATE TABLE "report" 
        ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "price" integer NOT NULL, "make" varchar NOT NULL, "model" varchar NOT NULL, "mileage" integer NOT NULL, "year" integer NOT NULL, "lng" integer NOT NULL, "lat" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedByUserId" integer, "status" varchar CHECK( "status" IN ('new','approved','rejected') ) NOT NULL DEFAULT ('new'), "userId" integer, CONSTRAINT "FK_e347c56b008c2057c9887e230aa" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE IF EXISTS user`);
    await queryRunner.query(`DROP TABLE IF EXISTS report`);
  }
};
