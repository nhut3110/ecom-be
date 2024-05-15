'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',
    );
    return await queryInterface.createTable('products', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        allowNull: false,
        unique: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      thumbnail_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      category_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      rate: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      set_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      number_id: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
      },
      pieces: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1975,
      },
      instructions_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      minifigs: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      height: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      depth: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      width: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      weight: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      discount_percentage: {
        type: Sequelize.FLOAT,
        allowNull: true,
        defaultValue: 0,
      },
      available_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      age_range: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      barcode: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: '',
      },
      additional_image_count: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      packaging_type: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: '',
      },
      availability: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: '',
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
      return queryInterface.dropTable('products');
    });
  },
};
