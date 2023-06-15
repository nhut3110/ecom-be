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
      is_paid_by_card: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      card_number: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      card_owner: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      card_expired_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      card_cvc: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      product_list: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      order_status: {
        type: Sequelize.ENUM,
        values: [
          'pending',
          'confirmed',
          'paid',
          'shipping',
          'completed',
          'canceled',
        ],
        defaultValue: 'pending',
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

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(() => {
      return Promise.all([
        queryInterface.dropTable('orders'),
        queryInterface.sequelize.query(
          'DROP TYPE IF EXISTS "enum_orders_order_status";',
        ),
      ]);
    });
  },
};
