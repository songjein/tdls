'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });

			[TODO] 잘 생각해보면, 어떤 링크는 중복이 될 수 없어,
			즉, 다른 유저라면, 자기 글을 쓸 때 sourceLink를 명시하고,
			새로 생성될 글 혹은 이전의 자기 글에 대해서 '자기 글'에 대해서!
			inlink를 만들고, 비록 inlink로 들어오는 source글이 자신이 만든 것이 아니라 할지라도
			다른 사람은 해당 source-target 링크를 만들 수 없어.
    */
		return queryInterface.createTable(
			'LogGraphs',
			{
				createdAt: {
					allowNull: false,	
					type: Sequelize.DATE,
				},
				updatedAt: {
					allowNull: false,	
					type: Sequelize.DATE,
				},
				SourceId: {
					allowNull: false,	
					type: Sequelize.INTEGER,
					references: {
						model: 'Logs',
						key: 'id',
					},
				},
				TargetId: {
					allowNull: false,	
					type: Sequelize.INTEGER,
					references: {
						model: 'Logs',
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

		return queryInterface.dropTable('LogGraphs');
  }
};
