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
    break;
  default:
    throw new Error('Unknown environment');
}

module.exports = typeOrmConfig;
