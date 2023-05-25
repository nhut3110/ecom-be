'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',
    );
    return await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        unique: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      phone_number: {
        type: Sequelize.STRING,
      },
      picture: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      shipping_point: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      provider: {
        type: Sequelize.ENUM,
        values: ['local', 'facebook'],
        defaultValue: 'local',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'created_at',
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'updated_at',
      },
    });
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(() => {
      return Promise.all([
        queryInterface.dropTable('users'),
        queryInterface.sequelize.query(
          'DROP TYPE IF EXISTS "enum_users_provider";',
        ),
      ]);
    });
  },
};
