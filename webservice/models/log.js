'use strict';
module.exports = (sequelize, DataTypes) => {
  const Log = sequelize.define('Log', {
    title: { 
			allowNull: false,
			type: DataTypes.STRING,
		},
    htmlBody: { 
			allowNull: false,
			type: DataTypes.TEXT,
		},
		UserId: {
			type: DataTypes.INTEGER,
			references: {
				model: 'Users', // name of the target model	
				key: 'id',
			},
			onUpdate: 'CASCADE',
			onDelete: 'SET NULL',
		},
  }, {});
  Log.associate = function(models) {
    // associations can be defined here
		models.Log.belongsTo(models.User, { onDelete: 'CASCADE' });
  };
  return Log;
};
