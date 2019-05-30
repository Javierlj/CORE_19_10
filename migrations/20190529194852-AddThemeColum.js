'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.addColumn(
          'quizzes',
          'themeId',
          {type: Sequelize.INTEGER}
      );
  },

  down: function (queryInterface, Sequelize) {
      return queryInterface.removeColumn('quizzes', 'themeId');
  }
};

