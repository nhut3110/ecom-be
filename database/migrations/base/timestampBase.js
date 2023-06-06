/* eslint-disable */
const { Sequelize } = require('sequelize');

const timestampBase = {
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
};

module.exports.timestampBase = timestampBase;
