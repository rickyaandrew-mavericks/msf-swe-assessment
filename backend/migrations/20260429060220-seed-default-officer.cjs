'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Check if the user already exists to prevent unique constraint errors
    const [users] = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE id = '00000000-0000-0000-0000-000000000001'"
    );

    if (users.length === 0) {
      await queryInterface.bulkInsert('users', [{
        id: '00000000-0000-0000-0000-000000000001',
        username: 'officer_jane',
        name: 'Jane Doe',
        email: 'jane.doe@msf.gov.sg',
        hash_password: 'hashed_password',
        role: 'officer',
        created_at: new Date(),
        updated_at: new Date()
      }]);
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { id: '00000000-0000-0000-0000-000000000001' });
  }
};
