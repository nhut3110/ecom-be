'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return await queryInterface.bulkInsert('users', [
      {
        name: 'nhut',
        email: 'nhut@gmail.com',
        password:
          '$2a$10$rZSagaLx2NzzJhySoEgaPeBvNEH54KXRMXpctc8SssrzBCofrz0fm', //123456789
        picture: 'https://mcdn.coolmate.me/image/October2021/meme-cheems-1.png',
      },
      {
        name: 'nhut',
        email: 'admin@gmail.com',
        password:
          '$2a$10$rZSagaLx2NzzJhySoEgaPeBvNEH54KXRMXpctc8SssrzBCofrz0fm', //123456789
        picture: 'https://mcdn.coolmate.me/image/October2021/meme-cheems-1.png',
      },
    ]);
  },

  async down(queryInterface) {
    return await queryInterface.bulkDelete('users', null, {});
  },
};
