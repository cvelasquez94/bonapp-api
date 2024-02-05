'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Branches extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Branches.hasMany(models.user_branches, {
        foreignKey: 'branch_id',
        as: 'user_branches', // Esto es opcional, pero ayuda a definir cómo llamar a la asociación
      });
      Branches.belongsTo(models.Restaurant, {
        foreignKey: 'restaurant_id',
        as: 'Restaurant',
      });
    }
  }
  Branches.init(
    {
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      rut: DataTypes.STRING,
      patent_url: DataTypes.STRING,
      restaurant_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Branches',
    }
  );
  return Branches;
};
