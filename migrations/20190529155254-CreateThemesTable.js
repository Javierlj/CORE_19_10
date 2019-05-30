'use strict';

module.exports = {
  up: function (queryInterface, Sequelize){
    return queryInterface.createTable(
      'themes',{
        name:{
          type:Sequelize.STRING,
          unique: "compositeKey",
        },
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          unique: true
      },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updatedAt: {
            type: Sequelize.DATE,
            allowNull: false
        }
      },
      {
          sync: {force:true}
      }
    )
  },

  down: (queryInterface, Sequelize) => {

    return queryInterface.dropTable('themes');

  }
};
