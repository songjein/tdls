'use strict';
module.exports = (sequelize, DataTypes) => {
  const LogTag = sequelize.define('LogTag', {
		LogId: {
			allowNull: false,
			type: DataTypes.INTEGER,
			references: {
				model: 'Logs',
				key: 'id',
			},
		},
		TagId: {
			allowNull: false,
			type: DataTypes.INTEGER,
			references: {
				model: 'Tags',	
				key: 'id',
			},
		}
  }, {});
  LogTag.associate = function(models) {
    // associations can be defined here
  };
  return LogTag;
};
