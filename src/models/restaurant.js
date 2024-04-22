'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Restaurant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Restaurant.hasMany(models.Branches, {
        foreignKey: 'restaurant_id',
        as: 'RestaurantBranches',
      });
    }
  }
  Restaurant.init({
    name: DataTypes.STRING,
    category: DataTypes.STRING,
    food_type: DataTypes.STRING,
    rut: DataTypes.STRING,
    start_date: DataTypes.DATE,
    spa_name: DataTypes.STRING,
    logo_url: DataTypes.STRING,
    enable: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Restaurant',
  });
  return Restaurant;
};