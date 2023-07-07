'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',
    );
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
        unique: true,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      address_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'addresses',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      payment_type: {
        type: Sequelize.ENUM('cash', 'card'),
        allowNull: false,
      },
      payment_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'payment',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      order_status: {
        type: Sequelize.ENUM(
          'pending',
          'confirmed',
          'paid',
          'shipping',
          'completed',
          'canceled',
        ),
        allowNull: true,
        defaultValue: 'pending',
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
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
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_payment_type";',
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_order_status";',
    );
    return await queryInterface.dropTable('orders');
  },
};
