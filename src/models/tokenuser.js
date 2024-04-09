'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TokenUser extends Model {
    static associate(models) {
      TokenUser.hasMany(models.User, {
        foreignKey: 'user_id',
      });
    }
  }
  TokenUser.init(
    {
      token: DataTypes.STRING,
      type: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
      device: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'TokenUser',
    }
  );
  return TokenUser;
};
