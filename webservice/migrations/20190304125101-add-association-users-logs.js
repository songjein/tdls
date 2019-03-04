'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
		return queryInterface.addColumn(
			'Logs', // source model
			'UserId', // name of the key want to add
			{
				type: Sequelize.INTEGER,
				references: {
					model: 'Users', // name of the target model
					key: 'id', // key in the target model we're referencing
				},
				onUpdate: 'CASCADE',
				onDelete: 'SET NULL',
			}
		);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */

		return queryInterface.removeColumn(
			'Logs',
			'UserId'
		);
  }
};
