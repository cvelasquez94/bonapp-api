'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Statuses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Statuses.hasMany(models.User, {
        foreignKey: 'status_id',
      });
    }
  }
  Statuses.init(
    {
      type: DataTypes.STRING,
      name: DataTypes.STRING,
      descrip: DataTypes.STRING,
      enable: DataTypes.INTEGER,
      color: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Statuses',
    }
  );
  return Statuses;
};
