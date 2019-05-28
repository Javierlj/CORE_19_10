'use strict';

module.exports = {
  up: function (queryInterface, Sequelize){
    return queryInterface.createTable(
      'followers',{
        followerId:{
          type:Sequelize.INTEGER,
          primaryKey:true,
          unique: "compositeKey",
          allowNull: false
        },
        followedId:{
          type:Sequelize.INTEGER,
          primaryKey:true,
          unique: "compositeKey",
          allowNull: false
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

      return queryInterface.dropTable('followers');

  }
};
