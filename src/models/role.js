'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Role.hasMany(models.ReportTo, {
        foreignKey: 'role_id',
        as: 'RoleReportTo',
      });
      Role.hasMany(models.ChecklistBranch, {
        foreignKey: 'id',
        as: 'ChecklistBranchRole',
      });
      Role.hasMany(models.RoleUser, {
        foreignKey: 'role_id',
        as: 'roleUser',
      });
      //Role.belongsToMany(models.User, { through: models.RoleUser });
    }
  }
  Role.init(
    {
      name: DataTypes.STRING,
      enable: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Role',
    }
  );
  return Role;
};
