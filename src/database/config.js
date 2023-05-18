module.exports = {
  dev: {
    migrationStorageTableName: 'Migrations',
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'database',
  },
  test: {
    migrationStorageTableName: 'Migrations',
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'test',
  },
};
