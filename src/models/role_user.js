'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoleUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RoleUser.belongsTo(models.Role, {
        foreignKey: 'role_id',
        as: 'role',
      });
      RoleUser.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    }
  }
  RoleUser.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: Model.User,
          key: 'id',
        },
      },
      role_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: Model.Role,
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'RoleUser',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return RoleUser;
};
