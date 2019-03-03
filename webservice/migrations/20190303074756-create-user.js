'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstKey: {
        type: Sequelize.STRING,
				unique: true,
      },
      secondKeyHash: {
        type: Sequelize.STRING
      },
      nickName: {
        type: Sequelize.STRING,
				unique: true,
      },
      company: {
        type: Sequelize.STRING
      },
      memo: {
        type: Sequelize.TEXT
      },
      email: {
        type: Sequelize.STRING
      },
			githubUrl: {
        type: Sequelize.STRING
			},
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
