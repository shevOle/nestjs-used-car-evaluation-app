const typeOrmConfig = {
  synchronize: false,
  migrations: ['./migrations/*.js'],
};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(typeOrmConfig, {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: ['**/*.entity.js'],
    });
    break;
  case 'test':
    Object.assign(typeOrmConfig, {
      type: 'sqlite',
      database: ':memory:',
      entities: ['**/*.entity.ts'],
      migrationsRun: true,
    });
    break;
  case 'production':
    Object.assign(typeOrmConfig, {
      type: 'postgress',
      url: process.env.DATABASE_URL, // provided by Heroku
      migrationsRun: true,
      entities: ['**/*.entity.js'],
      ssl: {
        rejectUnauthorized: false, // to avoid self-signed sertificate error
      },
    });
    break;
  default:
    throw new Error('Unknown environment');
}

module.exports = typeOrmConfig;
