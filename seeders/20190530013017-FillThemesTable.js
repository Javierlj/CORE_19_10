'use strict';

module.exports = {
  up(queryInterface, Sequelize) {

      return queryInterface.bulkInsert('themes', [
        {
          name: 'Geography',
          createdAt: new Date(),
          updatedAt: new Date()
      },
          {
            name: 'Maths',
            createdAt: new Date(),
            updatedAt: new Date()
        },
          {
            name: 'Node.js',
            createdAt: new Date(),
            updatedAt: new Date()
        },
          {
              name: 'Other',
              createdAt: new Date(),
              updatedAt: new Date()
          }
      ]);
  },

  down(queryInterface, Sequelize) {

      return queryInterface.bulkDelete('quizzes', null, {});
  }
};
