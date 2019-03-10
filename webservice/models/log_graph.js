'use strict';
module.exports = (sequelize, DataTypes) => {
  const LogGraph = sequelize.define('LogGraph', {
		SourceId: {
			allowNull: false,
			type: DataTypes.INTEGER,
			references: {
				model: 'Logs',
				key: 'id',
			},
		},
		TargetId: {
			allowNull: false,
			type: DataTypes.INTEGER,
			references: {
				model: 'Logs',	
				key: 'id',
			},
		}
  }, {});
  LogGraph.associate = function(models) {
    // associations can be defined here
  };
  return LogGraph;
};
