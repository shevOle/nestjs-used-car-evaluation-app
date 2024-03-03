const typeOrmConfig = {
  synchronize: false,
};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(typeOrmConfig, {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: ['**/*.entity.js'],
      synchronize: true,
    });
    break;
  case 'test':
    Object.assign(typeOrmConfig, {
      type: 'sqlite',
      dropSchema: true,
      database: ':memory:',
      entities: ['**/*.entity.ts'],
      synchronize: true,
    });
    break;
  case 'production':
    break;
  default:
    throw new Error('Unknown environment');
}

module.exports = typeOrmConfig;
