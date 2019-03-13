'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    name: { 
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
  }, {});
  Tag.associate = function(models) {
    // associations can be defined here

		models.Tag.belongsToMany(models.Log, { through: models.LogTag });
  };
  return Tag;
};
