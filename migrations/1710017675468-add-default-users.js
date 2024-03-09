const { promisify } = require('util');
const { scrypt } = require('crypto');
const dotenv = require('@nestjs/config/node_modules/dotenv');

const cryptFunction = promisify(scrypt);
dotenv.config();

module.exports = class AddDefaultUsers1710017675468 {
  async up(queryRunner) {
    const {
      DEFAULT_ADMIN_EMAIL,
      DEFAULT_ADMIN_PASSWORD,
      DEFAULT_USER_EMAIL,
      DEFAULT_USER_PASSWORD,
      SECRET,
    } = process.env;

    const hashedAdminPassword = (
      await cryptFunction(DEFAULT_ADMIN_PASSWORD, SECRET, 24)
    ).toString('hex');
    const hashedUserPassword = (
      await cryptFunction(DEFAULT_USER_PASSWORD, SECRET, 24)
    ).toString('hex');

    await queryRunner.query(
      `INSERT INTO "user" 
            ("id", "email", "password", "isAdmin") VALUES ("1", "${DEFAULT_ADMIN_EMAIL}", "${hashedAdminPassword}", "TRUE"), ("2", "${DEFAULT_USER_EMAIL}", "${hashedUserPassword}", "FALSE")`,
    );
  }

  async down(queryRunner) {
    await queryRunner.query(`DELETE FROM "user" WHERE id IN ("1", "2")`);
  }
};
