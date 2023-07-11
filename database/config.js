module.exports = {
  dev: {
    migrationStorageTableName: 'Migrations',
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'vmnvmn3110',
    database: 'postgres',
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
