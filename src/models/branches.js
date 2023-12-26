'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Branches extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Branches.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    rut: DataTypes.STRING,
    patent_url: DataTypes.STRING,
    restaurant_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Branches',
  });
  return Branches;
};