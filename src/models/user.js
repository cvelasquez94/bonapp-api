'use strict';
const { Model } = require('sequelize');
const user_branches = require('./user_branches');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.user_branches, {
        foreignKey: 'user_id',
        as: 'user_branches', // Esto es opcional, pero ayuda a definir cómo llamar a la asociación
      })
      // define association here
      //User.belongsToMany(models.Role, { through: models.RoleUser });
      User.hasMany(models.RoleUser, {
        foreignKey: 'user_id',
        as: 'roleUser',
      });
    }
  }
  User.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      pwd: DataTypes.STRING,
      birthdate: DataTypes.DATE,
      avatar: DataTypes.STRING,
      role_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
