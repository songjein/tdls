'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstKey: { 
			type: DataTypes.STRING,
			unique: true,
		},
    secondKeyHash: DataTypes.STRING,
		telegramId: DataTypes.INTEGER,
    nickName: { 
			type: DataTypes.STRING,
			unique: true,
		},
    company: DataTypes.STRING,
    memo: DataTypes.TEXT,
    email: DataTypes.STRING,
		githubUrl: DataTypes.STRING,
		todoItems: DataTypes.TEXT,
		finTodoItems: DataTypes.TEXT,
  }, {});
  User.associate = function(models) {
    // associations can be defined here
		models.User.hasMany(models.Log, { onDelete: 'CASCADE' });
  };
  return User;
};
