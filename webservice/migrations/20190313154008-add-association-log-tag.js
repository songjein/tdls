'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
		return queryInterface.createTable(
			'LogTags',	
			{
				createdAt: {
					allowNull: false,
					type: Sequelize.DATE,
				},
				updatedAt: {
					allowNull: false,
					type: Sequelize.DATE,
				},
				LogId: {
					allowNull: false,	
					type: Sequelize.INTEGER,
					references: {
						model: 'Logs',
						key: 'id',
					},
				},
				TagId: {
					allowNull: false,	
					type: Sequelize.INTEGER,
					references: {
						model: 'Tags',
						key: 'id',
					},
				}
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
		return queryInterface.dropTable('LogTags');
  }
};
